const { Sequelize } = require('sequelize');
const env = require('./env');
const colors = require('colors');

const sequelize = new Sequelize(
  env.database.name,
  env.database.user,
  env.database.password,
  {
    host: env.database.host,
    port: env.database.port,
    dialect: 'mysql',
    logging: env.nodeEnv === 'development' ? console.log : false,
    pool: {
      max: 5, // Reduced to prevent too many concurrent connections
      min: 0,
      acquire: 60000, // Increased timeout for acquiring connections
      idle: 10000,
      evict: 1000, // Check for idle connections every second
    },
    retry: {
      match: [
        /ETIMEDOUT/,
        /EHOSTUNREACH/,
        /ECONNRESET/,
        /ECONNREFUSED/,
        /ESOCKETTIMEDOUT/,
        /EPIPE/,
        /EAI_AGAIN/,
        /SequelizeConnectionError/,
        /SequelizeConnectionRefusedError/,
        /SequelizeHostNotFoundError/,
        /SequelizeHostNotReachableError/,
        /SequelizeInvalidConnectionError/,
        /SequelizeConnectionTimedOutError/,
        /ER_LOCK_DEADLOCK/,
      ],
      max: 3,
    },
    timezone: '+00:00',
    define: {
      timestamps: true,
      underscored: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  }
);

// Test database connection
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection has been established successfully.'.green);
  } catch (error) {
    console.error('❌ Unable to connect to the database:'.red, error);
    process.exit(1);
  }
};

// Sync database with retry logic for deadlock handling
const syncDatabase = async (options = {}) => {
  const maxRetries = 3;
  let retryCount = 0;
  
  while (retryCount < maxRetries) {
    try {
      // Simplified sync options to avoid configuration issues
      const syncOptions = {
        alter: options.alter || false,
        force: options.force || false,
      };
      
      await sequelize.sync(syncOptions);
      console.log('✅ Database synchronized successfully.'.green);
      return;
    } catch (error) {
      retryCount++;
      
      // Check if it's a deadlock error
      if (error.name === 'SequelizeDatabaseError' && 
          (error.original?.code === 'ER_LOCK_DEADLOCK' || 
           error.original?.errno === 1213)) {
        
        console.log(`⚠️  Database deadlock detected. Retry ${retryCount}/${maxRetries}...`.yellow);
        
        if (retryCount < maxRetries) {
          // Wait before retrying (exponential backoff)
          const waitTime = Math.pow(2, retryCount) * 1000;
          await new Promise(resolve => setTimeout(resolve, waitTime));
          continue;
        }
      }
      
      console.error('❌ Error synchronizing database:'.red, error);
      
      // If it's not a deadlock or we've exhausted retries, exit
      if (retryCount >= maxRetries) {
        console.error('❌ Max retries exceeded. Please check database connections and try again.'.red);
        process.exit(1);
      }
    }
  }
};

module.exports = sequelize;
module.exports.testConnection = testConnection;
module.exports.syncDatabase = syncDatabase;

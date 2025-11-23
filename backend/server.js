const express = require('express');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const colors = require('colors');
const https = require('https');
const http = require('http');
const fs = require('fs');
const { connectRedis } = require("./config/redis");

// Load environment variables
const env = require('./config/env');

// Import database
const sequelize = require('./config/database');
const { testConnection, syncDatabase } = require('./config/database');

// Import models to ensure associations are loaded
require('./models');

// Import language middleware
const { languageMiddleware } = require('./middleware/language');

// Create Express app
const app = express();
const PORT = env.port;

// Trust proxy
app.set('trust proxy', 1);

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// CORS configuration
// CORS configuration - Open to all origins (DEVELOPMENT ONLY)
app.use(
  cors({
    origin: "*",
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs for auth endpoints
  message: 'Too many authentication attempts, please try again later.',
  skipSuccessfulRequests: true,
});

// Apply rate limiting
// app.use('/api/', limiter);
// app.use('/api/auth/send-otp', authLimiter);
// app.use('/api/auth/verify-otp', authLimiter);
// app.use('/api/auth/login', authLimiter);

// Logging middleware
if (env.nodeEnv === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Language middleware - must be before API routes
app.use(languageMiddleware);

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is healthy',
    timestamp: new Date().toISOString(),
    environment: env.nodeEnv,
  });
});

// API Routes
const routes = require('./routes');
app.use('/api', routes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.originalUrl,
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:'.red, err);

  // Sequelize validation error
  if (err.name === 'SequelizeValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: err.errors.map((e) => ({
        field: e.path,
        message: e.message,
      })),
    });
  }

  // Sequelize unique constraint error
  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(409).json({
      success: false,
      message: 'Resource already exists',
      error: err.errors[0].message,
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid token',
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token expired',
    });
  }

  // CORS error
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({
      success: false,
      message: 'CORS policy violation',
    });
  }

  // Default error
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    error: env.nodeEnv === 'development' ? err.stack : undefined,
  });
});

// Start server
const startServer = async () => {
  try {
    // Test database connection
    await testConnection();
    
    // Sync database with safer options
    const syncOptions = {
      alter: false, // Disable alter to prevent deadlocks
      force: false, // Don't force recreate tables
    };
    
    // Only use alter in development if explicitly needed
    if (env.nodeEnv === 'development' && process.env.FORCE_ALTER === 'true') {
      syncOptions.alter = true;
      console.log('⚠️  Using ALTER mode - this may cause deadlocks'.yellow);
    }
    
    await syncDatabase(syncOptions);
    
    // Create server based on SSL configuration
    let server;
    
    if (env.ssl.enabled) {
      // Check if SSL certificates exist
      if (!fs.existsSync(env.ssl.keyPath) || !fs.existsSync(env.ssl.certPath)) {
        console.error('❌ SSL certificates not found:'.red);
        console.error(`   Key: ${env.ssl.keyPath}`.red);
        console.error(`   Cert: ${env.ssl.certPath}`.red);
        console.error('💡 Make sure SSL certificates are properly configured'.yellow);
        process.exit(1);
      }
      
      // Read SSL certificates
      const privateKey = fs.readFileSync(env.ssl.keyPath, 'utf8');
      const certificate = fs.readFileSync(env.ssl.certPath, 'utf8');
      const credentials = { key: privateKey, cert: certificate };
      
      // Create HTTPS server
      server = https.createServer(credentials, app);
      
      // Start HTTPS server
      server.listen(PORT,"0.0.0.0", () => {
        console.log('='.repeat(50).green);
        console.log(`🚀 ${env.appName} Backend Server (HTTPS)`.green.bold);
        console.log(`🔒 SSL Enabled: YES`.green);
        console.log(`📍 Running on: https://localhost:${PORT}`.cyan);
        console.log(`🌍 Environment dsdsds: ${env.nodeEnv}`.cyan);
        console.log(`📅 Started at: ${new Date().toLocaleString()}`.cyan);
        console.log('='.repeat(50).green);
      });
    } else {
      // Create HTTP server
      server = http.createServer(app);
      
      // Start HTTP server
      // server.listen(PORT, () => {
      //   console.log('='.repeat(50).green);
      //   console.log(`🚀 ${env.appName} Backend Server (HTTP)`.green.bold);
      //   console.log(`⚠️  SSL Enabled: NO`.yellow);
      //   console.log(`📍 Running on: http://localhost:${PORT}`.cyan);
      //   console.log(`🌍 Environment: ${env.nodeEnv}`.cyan);
      //   console.log(`📅 Started at: ${new Date().toLocaleString()}`.cyan);
      //   console.log('='.repeat(50).green);
      // });
    }
  } catch (error) {
    console.error('❌ Failed to start server:'.red, error);
    console.error('💡 Try running with FORCE_ALTER=true if you need to update schema'.yellow);
    process.exit(1);
  }
};

(async () => {
  try {
    await testConnection();
    await syncDatabase();

    await connectRedis(); // 🟩 NEW

    // If HTTPS
    if (env.ssl.enabled) {
      https.createServer({
        key: fs.readFileSync(env.ssl.keyPath),
        cert: fs.readFileSync(env.ssl.certPath)
      }, app).listen(PORT, () => {
        console.log(`🚀 Server is running securely at https://localhost:${PORT}`);
                console.log(`🌍 Environment: ${env.nodeEnv}`.cyan);
        console.log(`📅 Started at: ${new Date().toLocaleString()}`.cyan);
        console.log('='.repeat(50).green);
      });
    } else {
      http.createServer(app).listen(PORT, () => {
        console.log(`🚀 Server is running at http://localhost:${PORT}`);
      });
    }
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
})();

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:'.red, error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:'.red, promise, 'reason:'.red, reason);
  process.exit(1);
});

// Handle graceful shutdown
process.on('SIGTERM', async () => {
  console.log('👋 SIGTERM signal received: closing HTTP server'.yellow);
  await sequelize.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('👋 SIGINT signal received: closing HTTP server'.yellow);
  await sequelize.close();
  process.exit(0);
});

// Start the server
startServer();

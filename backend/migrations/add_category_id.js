const sequelize = require('../config/database');

async function runMigration() {
  try {
    console.log('Running migration: Add category_id to providers table...');
    
    // Check if column already exists
    const [columns] = await sequelize.query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = 'baitak_beta' 
      AND TABLE_NAME = 'providers' 
      AND COLUMN_NAME = 'category_id'
    `);
    
    if (columns.length === 0) {
      // Add category_id column
      await sequelize.query(`
        ALTER TABLE providers ADD COLUMN category_id INT NULL
      `);
      console.log('✓ Added category_id column to providers table');
      
      // Add foreign key constraint
      await sequelize.query(`
        ALTER TABLE providers 
        ADD CONSTRAINT providers_category_fk 
        FOREIGN KEY (category_id) REFERENCES categories(id) 
        ON DELETE RESTRICT ON UPDATE CASCADE
      `);
      console.log('✓ Added foreign key constraint');
      
      // Add index
      await sequelize.query(`
        CREATE INDEX idx_providers_category_id ON providers(category_id)
      `);
      console.log('✓ Created index on category_id');
    } else {
      console.log('✓ Column category_id already exists');
    }
    
    process.exit(0);
  } catch (error) {
    if (error.message.includes('Duplicate column name')) {
      console.log('✓ Column already exists');
      process.exit(0);
    } else {
      console.error('Migration error:', error.message);
      process.exit(1);
    }
  }
}

runMigration();


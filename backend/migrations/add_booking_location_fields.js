const sequelize = require('../config/database');

async function runMigration() {
  try {
    console.log('Running migration: Add latitude and longitude to bookings table...');
    
    // Check if columns already exist
    const [columns] = await sequelize.query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'bookings' 
      AND COLUMN_NAME IN ('latitude', 'longitude')
    `);
    
    const existingColumns = columns.map(col => col.COLUMN_NAME);
    
    // Add latitude if it doesn't exist
    if (!existingColumns.includes('latitude')) {
      await sequelize.query(`
        ALTER TABLE bookings ADD COLUMN latitude DECIMAL(10, 8) NULL
      `);
      console.log('✓ Added latitude column');
    }
    
    // Add longitude if it doesn't exist
    if (!existingColumns.includes('longitude')) {
      await sequelize.query(`
        ALTER TABLE bookings ADD COLUMN longitude DECIMAL(11, 8) NULL
      `);
      console.log('✓ Added longitude column');
    }
    
    console.log('✓ Migration completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Migration error:', error.message);
    process.exit(1);
  }
}

runMigration();


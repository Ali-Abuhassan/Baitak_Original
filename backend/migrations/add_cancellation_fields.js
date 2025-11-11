const sequelize = require('../config/database');

async function runMigration() {
  try {
    console.log('Running migration: Add cancellation fields to bookings table...');
    
    // Check if column already exists
    const [columns] = await sequelize.query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'bookings' 
      AND COLUMN_NAME IN ('cancellation_reason', 'cancellation_category', 'cancelled_by', 'cancelled_at')
    `);
    
    const existingColumns = columns.map(col => col.COLUMN_NAME);
    
    // Add cancellation_reason if it doesn't exist
    if (!existingColumns.includes('cancellation_reason')) {
      await sequelize.query(`
        ALTER TABLE bookings ADD COLUMN cancellation_reason TEXT NULL
      `);
      console.log('✓ Added cancellation_reason column');
    }
    
    // Add cancellation_category if it doesn't exist
    if (!existingColumns.includes('cancellation_category')) {
      await sequelize.query(`
        ALTER TABLE bookings ADD COLUMN cancellation_category VARCHAR(100) NULL
      `);
      console.log('✓ Added cancellation_category column');
    }
    
    // Add cancelled_by if it doesn't exist
    if (!existingColumns.includes('cancelled_by')) {
      await sequelize.query(`
        ALTER TABLE bookings ADD COLUMN cancelled_by ENUM('customer', 'provider', 'admin') NULL
      `);
      console.log('✓ Added cancelled_by column');
    }
    
    // Add cancelled_at if it doesn't exist
    if (!existingColumns.includes('cancelled_at')) {
      await sequelize.query(`
        ALTER TABLE bookings ADD COLUMN cancelled_at DATETIME NULL
      `);
      console.log('✓ Added cancelled_at column');
    }
    
    console.log('✓ Migration completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Migration error:', error.message);
    process.exit(1);
  }
}

runMigration();


const sequelize = require('../config/database');

async function runMigration() {
  try {
    console.log('Running migration: Add completion fields to bookings table...');
    
    // Check if column already exists
    const [columns] = await sequelize.query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'bookings' 
      AND COLUMN_NAME IN ('amount_paid', 'provider_satisfaction')
    `);
    
    const existingColumns = columns.map(col => col.COLUMN_NAME);
    
    // Add amount_paid if it doesn't exist
    if (!existingColumns.includes('amount_paid')) {
      await sequelize.query(`
        ALTER TABLE bookings ADD COLUMN amount_paid DECIMAL(10, 2) NULL 
        COMMENT 'Actual amount paid by customer (can differ from total_price)'
      `);
      console.log('✓ Added amount_paid column');
    }
    
    // Add provider_satisfaction if it doesn't exist
    if (!existingColumns.includes('provider_satisfaction')) {
      await sequelize.query(`
        ALTER TABLE bookings ADD COLUMN provider_satisfaction DECIMAL(3, 2) NULL 
        COMMENT 'Provider satisfaction rating with customer (1.00 to 5.00)'
      `);
      console.log('✓ Added provider_satisfaction column');
    }
    
    console.log('✓ Migration completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Migration error:', error.message);
    process.exit(1);
  }
}

runMigration();


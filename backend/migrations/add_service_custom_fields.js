const sequelize = require('../config/database');

async function runMigration() {
  try {
    console.log('Running migration: Add category_other and scope_notes to services table...');
    
    // Check if columns already exist
    const [columns] = await sequelize.query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'services' 
      AND COLUMN_NAME IN ('category_other', 'scope_notes')
    `);
    
    const existingColumns = columns.map(col => col.COLUMN_NAME);
    
    // Add category_other if it doesn't exist
    if (!existingColumns.includes('category_other')) {
      await sequelize.query(`
        ALTER TABLE services ADD COLUMN category_other TEXT NULL
      `);
      console.log('✓ Added category_other column');
    }
    
    // Add scope_notes if it doesn't exist
    if (!existingColumns.includes('scope_notes')) {
      await sequelize.query(`
        ALTER TABLE services ADD COLUMN scope_notes TEXT NULL
      `);
      console.log('✓ Added scope_notes column');
    }
    
    // Make category_id nullable since we now support category_other
    await sequelize.query(`
      ALTER TABLE services MODIFY COLUMN category_id INT NULL
    `);
    console.log('✓ Made category_id nullable');
    
    console.log('✓ Migration completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Migration error:', error.message);
    process.exit(1);
  }
}

runMigration();

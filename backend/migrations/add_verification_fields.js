const { QueryTypes } = require('sequelize');
const sequelize = require('../config/database');

module.exports = {
  up: async () => {
    try {
      console.log('🔧 Adding verification fields to providers table...');

      // Check and add verification document fields
      const checkAndAddColumn = async (columnName, columnType = 'VARCHAR(500)') => {
        const results = await sequelize.query(
          `SHOW COLUMNS FROM providers LIKE '${columnName}'`,
          { type: QueryTypes.SELECT }
        );

        if (!results || results.length === 0) {
          await sequelize.query(
            `ALTER TABLE providers ADD COLUMN ${columnName} ${columnType} NULL`,
            { type: QueryTypes.RAW }
          );
          console.log(`✓ Added ${columnName} column`.green);
        } else {
          console.log(`✓ Column ${columnName} already exists`.yellow);
        }
      };

      // Check and add verification badge fields
      const checkAndAddBadge = async (columnName) => {
        const results = await sequelize.query(
          `SHOW COLUMNS FROM providers LIKE '${columnName}'`,
          { type: QueryTypes.SELECT }
        );

        if (!results || results.length === 0) {
          await sequelize.query(
            `ALTER TABLE providers ADD COLUMN ${columnName} BOOLEAN DEFAULT FALSE`,
            { type: QueryTypes.RAW }
          );
          console.log(`✓ Added ${columnName} column`.green);
        } else {
          console.log(`✓ Column ${columnName} already exists`.yellow);
        }
      };

      // Add verification document fields
      await checkAndAddColumn('id_verified_image');
      await checkAndAddColumn('vocational_license_image');
      await checkAndAddColumn('police_clearance_image');

      // Add verification badge fields
      await checkAndAddBadge('is_id_verified');
      await checkAndAddBadge('is_license_verified');
      await checkAndAddBadge('is_police_clearance_verified');

      console.log('✅ Verification fields added successfully!'.green);
    } catch (error) {
      console.error('❌ Error adding verification fields:'.red, error);
      throw error;
    }
  },
  down: async () => {
    try {
      console.log('🔧 Removing verification fields from providers table...');

      const columnsToRemove = [
        'id_verified_image',
        'vocational_license_image',
        'police_clearance_image',
        'is_id_verified',
        'is_license_verified',
        'is_police_clearance_verified',
      ];

      for (const column of columnsToRemove) {
        try {
          await sequelize.query(
            `ALTER TABLE providers DROP COLUMN IF EXISTS ${column}`,
            { type: QueryTypes.RAW }
          );
          console.log(`✓ Removed ${column} column`.green);
        } catch (error) {
          console.log(`⚠ Column ${column} may not exist`.yellow);
        }
      }

      console.log('✅ Verification fields removed successfully!'.green);
    } catch (error) {
      console.error('❌ Error removing verification fields:'.red, error);
      throw error;
    }
  },
};

// Run migration if executed directly
if (require.main === module) {
  require('colors');
  const runMigration = async () => {
    try {
      await module.exports.up();
      console.log('✅ Migration completed successfully!'.green);
      process.exit(0);
    } catch (error) {
      console.error('❌ Migration failed:'.red, error);
      process.exit(1);
    }
  };
  runMigration();
}

module.exports = module.exports;


/**
 * Data Migration Script: EXTRA → TALENT
 * 
 * This script migrates existing users with role EXTRA to TALENT.
 * Run this after applying the Prisma migration.
 * 
 * Usage: npx ts-node scripts/migrate-extra-to-talent.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function migrateExtraToTalent() {
    console.log('🚀 Starting EXTRA → TALENT migration...\n');

    try {
        // Note: After the enum migration, the column type will already be 'TALENT'
        // This script handles any data inconsistencies and logs the migration

        // Count users that need migration (if any with old enum value)
        const usersToMigrate = await prisma.$executeRaw`
      UPDATE "User" 
      SET role = 'TALENT' 
      WHERE role = 'EXTRA'
    `;

        console.log(`✅ Updated ${usersToMigrate} user(s) from EXTRA to TALENT role\n`);

        // Verify the migration
        const talentCount = await prisma.user.count({
            where: { role: 'TALENT' }
        });

        console.log(`📊 Total TALENT users after migration: ${talentCount}`);
        console.log('\n✨ Migration completed successfully!');

    } catch (error) {
        console.error('❌ Migration failed:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

migrateExtraToTalent()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    });

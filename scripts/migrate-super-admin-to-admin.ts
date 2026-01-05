import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env.local
config({ path: resolve(__dirname, '../.env.local') });

import connectDB from '../src/lib/db/connect';
import User from '../src/lib/db/models/User';

/**
 * Migrate Super Admin to Admin Script
 * 
 * This script updates all users with role 'super_admin' to 'admin'
 * since the application no longer supports 'super_admin' role
 */

async function migrateSuperAdminToAdmin() {
    try {
        console.log('🔄 Starting super_admin to admin migration...\n');

        await connectDB();
        console.log('✅ Connected to database\n');

        // Find all users with super_admin role
        const superAdminUsers = await User.find({ role: 'super_admin' });

        if (superAdminUsers.length === 0) {
            console.log('✅ No users with super_admin role found. Migration not needed.\n');
            process.exit(0);
        }

        console.log(`Found ${superAdminUsers.length} user(s) with super_admin role:\n`);

        superAdminUsers.forEach((user, index) => {
            console.log(`${index + 1}. ${user.fullName} (${user.email})`);
        });

        console.log('\n🔄 Updating roles...\n');

        // Update all super_admin to admin
        const result = await User.updateMany(
            { role: 'super_admin' },
            { $set: { role: 'admin' } }
        );

        console.log(`✅ Successfully updated ${result.modifiedCount} user(s)\n`);

        // Verify the update
        const remainingSuperAdmins = await User.find({ role: 'super_admin' });

        if (remainingSuperAdmins.length === 0) {
            console.log('✅ Migration completed successfully!');
            console.log('   All super_admin users have been updated to admin role.\n');
        } else {
            console.log('⚠️  WARNING: Some users still have super_admin role:');
            remainingSuperAdmins.forEach((user) => {
                console.log(`   - ${user.fullName} (${user.email})`);
            });
        }

        // Show all current admin users
        const adminUsers = await User.find({ role: 'admin' })
            .select('email fullName role accountStatus');

        console.log(`\n📋 Current admin users (${adminUsers.length}):\n`);
        adminUsers.forEach((user, index) => {
            console.log(`${index + 1}. ${user.fullName} (${user.email}) - Status: ${user.accountStatus}`);
        });

        console.log('\n⚠️  IMPORTANT: Users need to log out and log back in to get fresh JWT tokens!\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error during migration:', error);
        process.exit(1);
    }
}

migrateSuperAdminToAdmin();

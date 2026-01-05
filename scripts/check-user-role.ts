import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env.local
config({ path: resolve(__dirname, '../.env.local') });

import connectDB from '../src/lib/db/connect';
import User from '../src/lib/db/models/User';


/**
 * Check User Role Script
 * 
 * This script checks the roles of admin/super_admin users in the database
 */

async function checkUserRoles() {
    try {
        console.log('Connecting to database...');
        await connectDB();
        console.log('Connected to database successfully!\n');

        // Find all admin and super_admin users
        const adminUsers = await User.find({
            role: { $in: ['admin', 'super_admin'] }
        }).select('email fullName role accountStatus isProfileActive');

        console.log(`Found ${adminUsers.length} admin/super_admin users:\n`);

        adminUsers.forEach((user, index) => {
            console.log(`${index + 1}. ${user.fullName} (${user.email})`);
            console.log(`   Role: ${user.role}`);
            console.log(`   Account Status: ${user.accountStatus}`);
            console.log(`   Profile Active: ${user.isProfileActive}`);
            console.log('');
        });

        // Check if there are any pending admin accounts
        const pendingAdmins = await User.find({
            role: { $in: ['admin', 'super_admin'] },
            accountStatus: 'pending'
        }).select('email fullName role accountStatus');

        if (pendingAdmins.length > 0) {
            console.log(`\n⚠️  WARNING: Found ${pendingAdmins.length} admin users with PENDING status:`);
            pendingAdmins.forEach((user) => {
                console.log(`   - ${user.fullName} (${user.email})`);
            });
        }

        // Check if there are any inactive admin profiles
        const inactiveAdmins = await User.find({
            role: { $in: ['admin', 'super_admin'] },
            isProfileActive: false
        }).select('email fullName role isProfileActive');

        if (inactiveAdmins.length > 0) {
            console.log(`\n⚠️  WARNING: Found ${inactiveAdmins.length} admin users with INACTIVE profiles:`);
            inactiveAdmins.forEach((user) => {
                console.log(`   - ${user.fullName} (${user.email})`);
            });
        }

        process.exit(0);
    } catch (error) {
        console.error('Error checking user roles:', error);
        process.exit(1);
    }
}

checkUserRoles();

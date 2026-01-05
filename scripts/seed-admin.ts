/**
 * Seed Admin User Script
 *
 * Creates the initial admin user for the platform
 * Reads credentials from environment variables
 */

import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env.local
config({ path: resolve(__dirname, '../.env.local') });

import mongoose from 'mongoose';
import connectDB from '../src/lib/db/connect';
import User from '../src/lib/db/models/User';

async function seedAdmin() {
  try {
    console.log('👨‍💼 Starting admin user seeding...\n');

    // Connect to database
    await connectDB();
    console.log('✅ Connected to database\n');

    // Get admin credentials from environment or use defaults
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@mulaboard.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123456';
    const adminName = process.env.ADMIN_NAME || 'System Administrator';

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (existingAdmin) {
      console.log(`⚠️  Admin user with email "${adminEmail}" already exists.`);
      console.log(`   User: ${existingAdmin.fullName}`);
      console.log(`   Role: ${existingAdmin.role}`);
      console.log(`   Created: ${existingAdmin.createdAt}\n`);

      // Ask if user wants to update
      console.log('💡 To create a new admin, delete the existing one first or use a different email.\n');
      process.exit(0);
    }

    // Create admin user
    console.log('Creating admin user...');
    const admin = await User.create({
      email: adminEmail,
      password: adminPassword, // Will be hashed by pre-save middleware
      fullName: adminName,
      designation: 'System Administrator',
      department: 'Administration',
      publicSlug: 'admin',
      role: 'admin',
      isProfileActive: true,
      accountStatus: 'approved',
      approvedAt: new Date(),
    });

    console.log('\n✅ Admin user created successfully!\n');
    console.log('📋 Admin Details:');
    console.log(`   Email: ${admin.email}`);
    console.log(`   Name: ${admin.fullName}`);
    console.log(`   Role: ${admin.role}`);
    console.log(`   Public Profile: /${admin.publicSlug}`);
    console.log(`   ID: ${admin._id}\n`);

    console.log('🔐 Login Credentials:');
    console.log(`   Email: ${adminEmail}`);
    console.log(`   Password: ${adminPassword}`);
    console.log('\n⚠️  IMPORTANT: Change the admin password after first login!\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding admin user:', error);
    process.exit(1);
  }
}

// Run the seed function
seedAdmin();

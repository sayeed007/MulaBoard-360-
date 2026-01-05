import dotenv from 'dotenv';
import mongoose from 'mongoose';
import ReviewPeriod from '../src/lib/db/models/ReviewPeriod';

// Load environment variables
dotenv.config({ path: '.env.local' });

async function createReviewPeriod() {
    try {
        // Connect to MongoDB
        const mongoUri = process.env.MONGODB_URI;
        if (!mongoUri) {
            throw new Error('MONGODB_URI not found in environment variables');
        }

        await mongoose.connect(mongoUri);
        console.log('✅ Connected to MongoDB');

        // Check if an active period already exists
        const existingActivePeriod = await ReviewPeriod.findOne({ isActive: true });

        if (existingActivePeriod) {
            console.log('⚠️  Active review period already exists:');
            console.log(`   Name: ${existingActivePeriod.name}`);
            console.log(`   Period: ${existingActivePeriod.startDate.toLocaleDateString()} - ${existingActivePeriod.endDate.toLocaleDateString()}`);
            console.log(`   Theme: ${existingActivePeriod.theme.name}`);
            return;
        }

        // Create a new active review period for Q1 2026
        const startDate = new Date('2026-01-01');
        const endDate = new Date('2026-03-31');

        const newPeriod = await ReviewPeriod.create({
            name: 'Q1 2026 Review',
            slug: 'q1-2026',
            startDate,
            endDate,
            isActive: true,
            theme: {
                name: 'New Year Fresh Start',
                primaryEmoji: '🌿',
                backgroundColor: '#f0fdf4',
            },
        });

        console.log('✅ Created active review period:');
        console.log(`   Name: ${newPeriod.name}`);
        console.log(`   Period: ${newPeriod.startDate.toLocaleDateString()} - ${newPeriod.endDate.toLocaleDateString()}`);
        console.log(`   Theme: ${newPeriod.theme.name} ${newPeriod.theme.primaryEmoji}`);
        console.log(`   Status: ${newPeriod.isActive ? 'ACTIVE ✅' : 'Inactive'}`);

    } catch (error) {
        console.error('❌ Error creating review period:', error);
        process.exit(1);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
}

// Run the script
createReviewPeriod();

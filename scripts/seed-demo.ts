/**
 * Seed Demo Data Script
 *
 * Creates demo users, review period, and feedback for testing
 */

import mongoose from 'mongoose';
import connectDB from '../src/lib/db/connect';
import User from '../src/lib/db/models/User';
import ReviewPeriod from '../src/lib/db/models/ReviewPeriod';
import Feedback from '../src/lib/db/models/Feedback';

// Demo users data
const demoUsers = [
  {
    email: 'john.doe@company.com',
    password: 'User@123',
    fullName: 'John Doe',
    designation: 'Senior Software Engineer',
    department: 'Engineering',
    publicSlug: 'john-doe',
    role: 'employee',
  },
  {
    email: 'jane.smith@company.com',
    password: 'User@123',
    fullName: 'Jane Smith',
    designation: 'Product Manager',
    department: 'Product',
    publicSlug: 'jane-smith',
    role: 'employee',
  },
  {
    email: 'bob.johnson@company.com',
    password: 'User@123',
    fullName: 'Bob Johnson',
    designation: 'UI/UX Designer',
    department: 'Design',
    publicSlug: 'bob-johnson',
    role: 'employee',
  },
  {
    email: 'alice.williams@company.com',
    password: 'User@123',
    fullName: 'Alice Williams',
    designation: 'Team Lead',
    department: 'Engineering',
    publicSlug: 'alice-williams',
    role: 'employee',
  },
  {
    email: 'charlie.brown@company.com',
    password: 'User@123',
    fullName: 'Charlie Brown',
    designation: 'DevOps Engineer',
    department: 'Infrastructure',
    publicSlug: 'charlie-brown',
    role: 'employee',
  },
];

// Sample feedback templates
const feedbackTemplates = [
  {
    ratings: {
      technicalSkills: 4.5,
      communication: 4.0,
      teamwork: 5.0,
      problemSolving: 4.5,
      workEthic: 4.0,
    },
    strengths: 'Excellent technical skills and great team player. Always willing to help others and share knowledge.',
    improvements: 'Could improve time management when handling multiple tasks.',
    overallComments: 'A valuable team member who consistently delivers high-quality work.',
  },
  {
    ratings: {
      technicalSkills: 3.5,
      communication: 5.0,
      teamwork: 4.5,
      problemSolving: 4.0,
      workEthic: 4.5,
    },
    strengths: 'Outstanding communication skills. Great at presenting ideas and collaborating with stakeholders.',
    improvements: 'Could deepen technical knowledge in certain areas.',
    overallComments: 'Excellent communicator who bridges the gap between technical and non-technical teams.',
  },
  {
    ratings: {
      technicalSkills: 4.0,
      communication: 3.5,
      teamwork: 4.0,
      problemSolving: 5.0,
      workEthic: 4.5,
    },
    strengths: 'Exceptional problem-solver. Can tackle complex challenges with creative solutions.',
    improvements: 'Could be more proactive in team discussions.',
    overallComments: 'Strong analytical thinker who adds significant value to the team.',
  },
  {
    ratings: {
      technicalSkills: 2.5,
      communication: 3.0,
      teamwork: 3.5,
      problemSolving: 2.5,
      workEthic: 3.0,
    },
    strengths: 'Shows willingness to learn and improve.',
    improvements: 'Needs to work on technical skills and take more initiative on projects.',
    overallComments: 'Has potential but needs more experience and mentorship.',
  },
  {
    ratings: {
      technicalSkills: 5.0,
      communication: 4.5,
      teamwork: 5.0,
      problemSolving: 5.0,
      workEthic: 5.0,
    },
    strengths: 'Exceptional performer across all areas. Technical expert, great communicator, and natural leader.',
    improvements: 'Keep up the excellent work!',
    overallComments: 'Top performer who sets the standard for the entire team.',
  },
];

async function seedDemo() {
  try {
    console.log('🎭 Starting demo data seeding...\n');

    // Connect to database
    await connectDB();
    console.log('✅ Connected to database\n');

    // Create demo users
    console.log('👥 Creating demo users...');
    const createdUsers = [];

    for (const userData of demoUsers) {
      // Check if user already exists
      const existingUser = await User.findOne({ email: userData.email });

      if (existingUser) {
        console.log(`   ⚠️  User ${userData.email} already exists, skipping...`);
        createdUsers.push(existingUser);
      } else {
        const user = await User.create({
          ...userData,
          isProfileActive: true,
        });
        console.log(`   ✅ Created: ${user.fullName} (${user.email})`);
        createdUsers.push(user);
      }
    }

    console.log(`\n✅ ${createdUsers.length} users ready\n`);

    // Create review period
    console.log('📅 Creating review period...');

    const startDate = new Date();
    startDate.setDate(1); // First day of current month
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 1);
    endDate.setDate(0); // Last day of current month

    const periodName = `Q${Math.ceil((new Date().getMonth() + 1) / 3)} ${new Date().getFullYear()} Review`;
    const periodSlug = `q${Math.ceil((new Date().getMonth() + 1) / 3)}-${new Date().getFullYear()}`;

    let reviewPeriod = await ReviewPeriod.findOne({ slug: periodSlug });

    if (reviewPeriod) {
      console.log(`   ⚠️  Review period "${periodName}" already exists`);
    } else {
      // Deactivate all other periods
      await ReviewPeriod.updateMany({}, { isActive: false });

      reviewPeriod = await ReviewPeriod.create({
        name: periodName,
        slug: periodSlug,
        startDate,
        endDate,
        isActive: true,
      });
      console.log(`   ✅ Created: ${reviewPeriod.name}`);
    }

    console.log(`   Period: ${reviewPeriod.startDate.toLocaleDateString()} - ${reviewPeriod.endDate.toLocaleDateString()}\n`);

    // Create demo feedback
    console.log('💬 Creating demo feedback...');

    let feedbackCount = 0;

    // Create feedback for each user from random other users
    for (const targetUser of createdUsers) {
      // Each user gets 2-4 pieces of feedback
      const numFeedback = Math.floor(Math.random() * 3) + 2;

      for (let i = 0; i < numFeedback; i++) {
        // Pick a random feedback template
        const template = feedbackTemplates[Math.floor(Math.random() * feedbackTemplates.length)];

        // Check if feedback already exists for this period
        const existingFeedback = await Feedback.findOne({
          targetUser: targetUser._id,
          reviewPeriod: reviewPeriod._id,
        }).limit(1);

        if (existingFeedback && i === 0) {
          console.log(`   ⚠️  Feedback for ${targetUser.fullName} already exists, skipping...`);
          break;
        }

        if (i === 0) {
          // Create feedback
          await Feedback.create({
            targetUser: targetUser._id,
            reviewPeriod: reviewPeriod._id,
            ratings: template.ratings,
            strengths: template.strengths,
            improvements: template.improvements,
            overallComments: template.overallComments,
            submitterFingerprint: `demo-${targetUser._id}-${i}`,
            submitterIpHash: `hash-${targetUser._id}-${i}`,
            moderation: {
              status: 'approved',
              isApproved: true,
            },
          });

          feedbackCount++;
        }
      }
    }

    console.log(`   ✅ Created ${feedbackCount} feedback entries\n`);

    // Summary
    console.log('📊 Demo Data Summary:');
    console.log(`   Users: ${createdUsers.length}`);
    console.log(`   Review Period: ${reviewPeriod.name}`);
    console.log(`   Feedback: ${feedbackCount} entries`);

    console.log('\n🔐 Login Credentials for Demo Users:');
    console.log('   Email: [any demo user email]');
    console.log('   Password: User@123\n');

    console.log('✅ Demo data seeding completed successfully!\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding demo data:', error);
    process.exit(1);
  }
}

// Run the seed function
seedDemo();

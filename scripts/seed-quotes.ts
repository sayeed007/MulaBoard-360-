/**
 * Seed Quotes Script
 *
 * Populates the database with funny quotes for different sections
 * Based on the MulaBoard blueprint
 */

import mongoose from 'mongoose';
import connectDB from '../src/lib/db/connect';
import Quote from '../src/lib/db/models/Quote';
import User from '../src/lib/db/models/User';

const quotes = [
  // Landing Page Quotes
  {
    text: "Your feedback won't hurt... much. 🌿",
    category: 'landing',
    mood: 'funny',
  },
  {
    text: "We promise we won't cry... publicly.",
    category: 'landing',
    mood: 'sarcastic',
  },
  {
    text: "Anonymous feedback: Because honesty needs a disguise!",
    category: 'landing',
    mood: 'funny',
  },
  {
    text: "Feedback is the breakfast of champions. Serve it hot!",
    category: 'landing',
    mood: 'motivational',
  },
  {
    text: "Great feedback leads to great growth.",
    category: 'landing',
    mood: 'wise',
  },

  // Feedback Form Quotes
  {
    text: "Remember: Be honest, but be kind. We're all humans here... probably.",
    category: 'feedback_form',
    mood: 'funny',
  },
  {
    text: "Your feedback is like a mula - sweet when ripe, nutritious when fresh!",
    category: 'feedback_form',
    mood: 'funny',
  },
  {
    text: "Constructive criticism: It's like a hug, but with words!",
    category: 'feedback_form',
    mood: 'wise',
  },
  {
    text: "Take your time. Good feedback is like good tea - it can't be rushed.",
    category: 'feedback_form',
    mood: 'motivational',
  },
  {
    text: "Pro tip: Writing feedback while angry is like grocery shopping while hungry.",
    category: 'feedback_form',
    mood: 'sarcastic',
  },

  // Success/Thank You Quotes
  {
    text: "Thanks for the feedback! You're officially awesome! 🎉",
    category: 'success',
    mood: 'funny',
  },
  {
    text: "Feedback submitted! May the Mula be with you! 🌿",
    category: 'success',
    mood: 'funny',
  },
  {
    text: "Your feedback has been delivered! No mulas were harmed in this process.",
    category: 'success',
    mood: 'funny',
  },
  {
    text: "Mission accomplished! Your honesty is appreciated.",
    category: 'success',
    mood: 'motivational',
  },
  {
    text: "Feedback received! Together we grow stronger.",
    category: 'success',
    mood: 'wise',
  },

  // Profile/Dashboard Quotes
  {
    text: "Look at you, growing and improving! Keep it up! 💪",
    category: 'profile',
    mood: 'motivational',
  },
  {
    text: "Your feedback journey: Better than a Netflix series!",
    category: 'profile',
    mood: 'funny',
  },
  {
    text: "Progress is progress, no matter how small.",
    category: 'profile',
    mood: 'wise',
  },
  {
    text: "You're doing great! Even if the feedback says otherwise... 😅",
    category: 'profile',
    mood: 'sarcastic',
  },
  {
    text: "Every piece of feedback is a step towards excellence.",
    category: 'profile',
    mood: 'motivational',
  },

  // Admin Panel Quotes
  {
    text: "With great power comes great responsibility... and lots of feedback to moderate.",
    category: 'admin',
    mood: 'funny',
  },
  {
    text: "Admin mode activated! Time to manage the feedback empire! 👑",
    category: 'admin',
    mood: 'funny',
  },
  {
    text: "The best admins are those who listen.",
    category: 'admin',
    mood: 'wise',
  },
  {
    text: "Behind every great platform is a tired admin with too many tabs open.",
    category: 'admin',
    mood: 'sarcastic',
  },
  {
    text: "Lead by example, moderate with wisdom.",
    category: 'admin',
    mood: 'motivational',
  },

  // Error Page Quotes
  {
    text: "Error 404: Our motivation to show this page was not found.",
    category: 'error',
    mood: 'funny',
  },
  {
    text: "Something went wrong... but hey, at least you found this funny quote!",
    category: 'error',
    mood: 'funny',
  },
  {
    text: "Errors are proof that you're trying. Keep going!",
    category: 'error',
    mood: 'motivational',
  },
  {
    text: "This page is on a coffee break. Please come back later.",
    category: 'error',
    mood: 'sarcastic',
  },
  {
    text: "Every error is an opportunity to learn... or to blame someone else.",
    category: 'error',
    mood: 'sarcastic',
  },

  // Loading Page Quotes
  {
    text: "Loading... Please wait while we gather the mulas! 🌿",
    category: 'loading',
    mood: 'funny',
  },
  {
    text: "Patience is a virtue. Loading is a reality.",
    category: 'loading',
    mood: 'wise',
  },
  {
    text: "Good things come to those who wait... and load.",
    category: 'loading',
    mood: 'motivational',
  },
  {
    text: "Loading: The art of doing nothing while looking busy.",
    category: 'loading',
    mood: 'sarcastic',
  },
  {
    text: "Hold tight! Great feedback is worth the wait!",
    category: 'loading',
    mood: 'motivational',
  },

  // Bengali/Banglish Quotes
  {
    text: "আপনার ফিডব্যাক আমাদের শক্তি!",
    textBn: "Your feedback is our strength!",
    category: 'landing',
    mood: 'motivational',
  },
  {
    text: "সততা সেরা নীতি... এবং সেরা ফিডব্যাক!",
    textBn: "Honesty is the best policy... and the best feedback!",
    category: 'feedback_form',
    mood: 'wise',
  },
  {
    text: "ধন্যবাদ! আপনি সত্যিই অসাধারণ! 🎉",
    textBn: "Thank you! You are truly amazing!",
    category: 'success',
    mood: 'funny',
  },
  {
    text: "একসাথে আমরা আরও শক্তিশালী!",
    textBn: "Together we are stronger!",
    category: 'profile',
    mood: 'motivational',
  },
];

async function seedQuotes() {
  try {
    console.log('🌱 Starting quotes seeding...\n');

    // Connect to database
    await connectDB();
    console.log('✅ Connected to database\n');

    // Find or create a system admin user for creating quotes
    let adminUser = await User.findOne({ email: 'admin@mulaboard.com' });

    if (!adminUser) {
      console.log('⚠️  Admin user not found. Creating system admin for quotes...');
      adminUser = await User.create({
        email: 'admin@mulaboard.com',
        password: 'Admin@123', // Will be hashed by pre-save middleware
        fullName: 'System Admin',
        designation: 'Administrator',
        department: 'IT',
        publicSlug: 'system-admin',
        role: 'admin',
        isProfileActive: true,
      });
      console.log('✅ System admin created\n');
    }

    // Clear existing quotes
    const deleteResult = await Quote.deleteMany({});
    console.log(`🗑️  Cleared ${deleteResult.deletedCount} existing quotes\n`);

    // Insert new quotes
    const quotesWithAdmin = quotes.map((quote) => ({
      ...quote,
      createdBy: adminUser._id,
      isActive: true,
    }));

    const result = await Quote.insertMany(quotesWithAdmin);
    console.log(`✅ Successfully inserted ${result.length} quotes\n`);

    // Show breakdown by category
    const breakdown = await Quote.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    console.log('📊 Quotes by category:');
    breakdown.forEach((item) => {
      console.log(`   - ${item._id}: ${item.count} quotes`);
    });

    console.log('\n✅ Quotes seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding quotes:', error);
    process.exit(1);
  }
}

// Run the seed function
seedQuotes();

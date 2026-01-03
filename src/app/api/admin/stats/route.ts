import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/helpers';
import connectDB from '@/lib/db/connect';
import User from '@/lib/db/models/User';
import Feedback from '@/lib/db/models/Feedback';
import ReviewPeriod from '@/lib/db/models/ReviewPeriod';
import { calculateAggregateRatings } from '@/lib/utils/mula-calculator';

/**
 * GET /api/admin/stats
 *
 * Get admin dashboard statistics (admin only)
 */
export async function GET(request: NextRequest) {
  try {
    // Check authentication and admin role
    const user = await getCurrentUser();

    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        {
          success: false,
          error: 'Unauthorized. Admin access required.',
        },
        { status: 403 }
      );
    }

    // Connect to database
    await connectDB();

    // Get total counts
    const [totalUsers, totalFeedback, activePeriod] = await Promise.all([
      User.countDocuments(),
      Feedback.countDocuments(),
      ReviewPeriod.findOne({ isActive: true }),
    ]);

    // Get pending moderation count
    const pendingModeration = await Feedback.countDocuments({
      'moderation.status': 'pending',
    });

    // Get flagged feedback count
    const flaggedFeedback = await Feedback.countDocuments({
      'moderation.status': 'flagged',
    });

    // Get all feedback for distribution
    const allFeedback = await Feedback.find({}).lean();
    const mulaDistribution = calculateAggregateRatings(
      allFeedback.map((f) => ({ mulaRating: f.mulaRating }))
    );

    // Get current period stats if active period exists
    let currentPeriodStats = null;
    if (activePeriod) {
      const periodFeedback = await Feedback.find({
        reviewPeriod: activePeriod._id,
      }).lean();

      currentPeriodStats = {
        periodName: activePeriod.name,
        feedbackCount: periodFeedback.length,
        distribution: calculateAggregateRatings(
          periodFeedback.map((f) => ({ mulaRating: f.mulaRating }))
        ),
      };
    }

    // Get user role distribution
    const usersByRole = await User.aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 },
        },
      },
    ]);

    const roleDistribution = {
      admin: usersByRole.find((r) => r._id === 'admin')?.count || 0,
      employee: usersByRole.find((r) => r._id === 'employee')?.count || 0,
    };

    // Get recent activity (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentFeedback = await Feedback.countDocuments({
      createdAt: { $gte: thirtyDaysAgo },
    });

    const recentUsers = await User.countDocuments({
      createdAt: { $gte: thirtyDaysAgo },
    });

    // Return stats
    return NextResponse.json(
      {
        success: true,
        data: {
          overview: {
            totalUsers,
            totalFeedback,
            pendingModeration,
            flaggedFeedback,
          },
          mulaDistribution,
          currentPeriodStats,
          roleDistribution,
          recentActivity: {
            feedbackLast30Days: recentFeedback,
            usersLast30Days: recentUsers,
          },
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Admin stats error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'An error occurred while fetching statistics.',
      },
      { status: 500 }
    );
  }
}

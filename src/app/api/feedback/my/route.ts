import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/helpers';
import connectDB from '@/lib/db/connect';
import Feedback from '@/lib/db/models/Feedback';
import { calculateAggregateRatings } from '@/lib/utils/mula-calculator';

/**
 * GET /api/feedback/my
 *
 * Get all feedback for the authenticated user
 */
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: 'Unauthorized. Please sign in.',
        },
        { status: 401 }
      );
    }

    // Get query params
    const { searchParams } = new URL(request.url);
    const reviewPeriodId = searchParams.get('period');

    // Connect to database
    await connectDB();

    // Build query
    const query: any = {
      targetUser: user.id,
      'moderation.status': 'approved', // Only show approved feedback
    };

    if (reviewPeriodId) {
      query.reviewPeriod = reviewPeriodId;
    }

    // Fetch feedbacks
    const feedbacks = await Feedback.find(query)
      .sort({ createdAt: -1 })
      .populate('reviewPeriod', 'name slug theme')
      .lean();

    // Calculate aggregate stats
    const aggregateStats = calculateAggregateRatings(
      feedbacks.map((f) => ({ mulaRating: f.mulaRating }))
    );

    // Calculate category averages
    const categoryAverages = {
      communication: 0,
      teamwork: 0,
      technical: 0,
      problemSolving: 0,
      attitude: 0,
    };

    if (feedbacks.length > 0) {
      feedbacks.forEach((feedback) => {
        Object.keys(categoryAverages).forEach((key) => {
          categoryAverages[key as keyof typeof categoryAverages] +=
            feedback.ratings[key as keyof typeof feedback.ratings].score;
        });
      });

      Object.keys(categoryAverages).forEach((key) => {
        categoryAverages[key as keyof typeof categoryAverages] =
          Math.round((categoryAverages[key as keyof typeof categoryAverages] / feedbacks.length) * 100) / 100;
      });
    }

    // Return response
    return NextResponse.json(
      {
        success: true,
        data: {
          feedbacks,
          stats: {
            total: feedbacks.length,
            aggregate: aggregateStats,
            categoryAverages,
          },
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get my feedback error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'An error occurred while fetching feedback.',
      },
      { status: 500 }
    );
  }
}

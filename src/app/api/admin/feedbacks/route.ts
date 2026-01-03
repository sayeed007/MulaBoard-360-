import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/helpers';
import connectDB from '@/lib/db/connect';
import Feedback from '@/lib/db/models/Feedback';

/**
 * GET /api/admin/feedbacks
 *
 * Get all feedbacks for moderation (admin only)
 */
export async function GET(request: NextRequest) {
  try {
    // Check authentication and admin role
    const currentUser = await getCurrentUser();

    if (!currentUser || currentUser.role !== 'admin') {
      return NextResponse.json(
        {
          success: false,
          error: 'Unauthorized. Admin access required.',
        },
        { status: 403 }
      );
    }

    // Get query params
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    // Connect to database
    await connectDB();

    // Build query
    const query: any = {};

    if (status) {
      query['moderation.status'] = status;
    }

    // Get total count
    const total = await Feedback.countDocuments(query);

    // Get feedbacks with pagination
    const feedbacks = await Feedback.find(query)
      .populate('targetUser', 'fullName email department')
      .populate('reviewPeriod', 'name slug')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    // Return response
    return NextResponse.json(
      {
        success: true,
        data: {
          feedbacks,
          pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
          },
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get feedbacks error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'An error occurred while fetching feedbacks.',
      },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import User from '@/lib/db/models/User';
import Feedback from '@/lib/db/models/Feedback';

/**
 * GET /api/users/public
 * 
 * Fetch all public user profiles with search, filters, and pagination
 * 
 * Query Parameters:
 * - page: number (default: 1)
 * - limit: number (default: 12, max: 50)
 * - search: string (search in fullName, designation, department)
 * - department: string (filter by department)
 * - sort: 'newest' | 'most-reviewed' | 'highest-rated' (default: 'newest')
 */
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const searchParams = request.nextUrl.searchParams;
    
    // Pagination
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '12')));
    const skip = (page - 1) * limit;

    // Search and filters
    const search = searchParams.get('search')?.trim() || '';
    const department = searchParams.get('department')?.trim() || '';
    const sort = searchParams.get('sort') || 'newest';

    // Build query
    const query: any = {
      isProfileActive: true,
      accountStatus: 'approved',
    };

    // Add search filter (case-insensitive regex)
    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { designation: { $regex: search, $options: 'i' } },
        { department: { $regex: search, $options: 'i' } },
      ];
    }

    // Add department filter
    if (department) {
      query.department = department;
    }

    // Build sort query
    let sortQuery: any = { createdAt: -1 }; // Default: newest first
    
    if (sort === 'most-reviewed') {
      // We'll sort after aggregating feedback counts
      sortQuery = null;
    } else if (sort === 'highest-rated') {
      // We'll sort after aggregating ratings
      sortQuery = null;
    }

    // Get total count for pagination
    const totalUsers = await User.countDocuments(query);

    // Fetch users
    let users = await User.find(query)
      .select('fullName designation department profileImage bio publicSlug settings.showAggregatePublicly createdAt')
      .sort(sortQuery || { createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Aggregate feedback stats for each user
    const usersWithStats = await Promise.all(
      users.map(async (user) => {
        let stats = null;

        // Only include stats if user allows public display
        if (user.settings?.showAggregatePublicly) {
          try {
            const feedbackStats = await Feedback.getUserStats(user._id.toString());
            const avgRatings = await Feedback.getUserAverageRatings(user._id.toString());

            stats = {
              totalFeedbacks: feedbackStats.total,
              averageRating: avgRatings.overall,
              mulaDistribution: {
                golden_mula: feedbackStats.golden_mula,
                fresh_carrot: feedbackStats.fresh_carrot,
                rotten_tomato: feedbackStats.rotten_tomato,
              },
            };
          } catch (error) {
            console.error(`Error fetching stats for user ${user._id}:`, error);
          }
        }

        return {
          _id: user._id.toString(),
          fullName: user.fullName,
          designation: user.designation,
          department: user.department,
          profileImage: user.profileImage || '',
          bio: user.bio || '',
          publicSlug: user.publicSlug,
          stats,
          createdAt: user.createdAt,
        };
      })
    );

    // Sort by feedback count or rating if requested
    if (sort === 'most-reviewed') {
      usersWithStats.sort((a, b) => {
        const aCount = a.stats?.totalFeedbacks || 0;
        const bCount = b.stats?.totalFeedbacks || 0;
        return bCount - aCount;
      });
    } else if (sort === 'highest-rated') {
      usersWithStats.sort((a, b) => {
        const aRating = a.stats?.averageRating || 0;
        const bRating = b.stats?.averageRating || 0;
        return bRating - aRating;
      });
    }

    // Remove createdAt from response (only used for sorting)
    const finalUsers = usersWithStats.map(({ createdAt, ...user }) => user);

    // Calculate pagination info
    const totalPages = Math.ceil(totalUsers / limit);
    const hasNext = page < totalPages;
    const hasPrev = page > 1;

    return NextResponse.json({
      users: finalUsers,
      pagination: {
        currentPage: page,
        totalPages,
        totalUsers,
        hasNext,
        hasPrev,
      },
    });
  } catch (error) {
    console.error('Error fetching public users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch public users' },
      { status: 500 }
    );
  }
}

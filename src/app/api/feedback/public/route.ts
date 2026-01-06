import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import Feedback from '@/lib/db/models/Feedback';
import mongoose from 'mongoose';

/**
 * GET /api/feedback/public
 * 
 * Fetch public feedbacks for a specific user
 * 
 * Query Parameters:
 * - userId: string (required) - The target user's ID
 * - page: number (default: 1)
 * - limit: number (default: 10, max: 50)
 */
export async function GET(request: NextRequest) {
    try {
        await connectDB();

        const searchParams = request.nextUrl.searchParams;

        // Get userId
        const userId = searchParams.get('userId');
        if (!userId) {
            return NextResponse.json(
                { error: 'userId is required' },
                { status: 400 }
            );
        }

        // Validate userId format
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return NextResponse.json(
                { error: 'Invalid userId format' },
                { status: 400 }
            );
        }

        // Pagination
        const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
        const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '10')));
        const skip = (page - 1) * limit;

        // Build query - only public and approved feedbacks
        const query = {
            targetUser: new mongoose.Types.ObjectId(userId),
            visibility: 'public',
            'moderation.status': 'approved',
        };

        // Get total count for pagination
        const totalFeedbacks = await Feedback.countDocuments(query);

        // Fetch feedbacks
        const feedbacks = await Feedback.find(query)
            .populate('reviewPeriod', 'name slug')
            .sort({ createdAt: -1 }) // Newest first
            .skip(skip)
            .limit(limit)
            .lean();

        // Format feedbacks for response
        const formattedFeedbacks = feedbacks.map((feedback) => ({
            _id: feedback._id.toString(),
            ratings: feedback.ratings,
            strengths: feedback.strengths,
            improvements: feedback.improvements,
            mulaRating: feedback.mulaRating,
            employeeReaction: feedback.employeeReaction,
            reviewPeriod: feedback.reviewPeriod
                ? {
                    name: (feedback.reviewPeriod as any).name,
                    slug: (feedback.reviewPeriod as any).slug,
                }
                : null,
            createdAt: feedback.createdAt,
        }));

        // Calculate pagination info
        const totalPages = Math.ceil(totalFeedbacks / limit);
        const hasNext = page < totalPages;
        const hasPrev = page > 1;

        return NextResponse.json({
            feedbacks: formattedFeedbacks,
            pagination: {
                currentPage: page,
                totalPages,
                totalFeedbacks,
                hasNext,
                hasPrev,
            },
        });
    } catch (error) {
        console.error('Error fetching public feedbacks:', error);
        return NextResponse.json(
            { error: 'Failed to fetch public feedbacks' },
            { status: 500 }
        );
    }
}

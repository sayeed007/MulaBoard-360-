import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import User from '@/lib/db/models/User';

/**
 * POST /api/profile/[slug]/view
 * Increment profile view count for a user
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    // Connect to database
    await connectDB();

    // Find and increment profile view count
    const user = await User.findOneAndUpdate(
      { publicSlug: slug, isProfileActive: true },
      { $inc: { profileViews: 1 } },
      { new: true, select: 'profileViews' }
    );

    if (!user) {
      return NextResponse.json(
        { error: 'User not found or profile inactive' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      profileViews: user.profileViews,
    });
  } catch (error) {
    console.error('Profile view tracking error:', error);
    return NextResponse.json(
      { error: 'Failed to track profile view' },
      { status: 500 }
    );
  }
}

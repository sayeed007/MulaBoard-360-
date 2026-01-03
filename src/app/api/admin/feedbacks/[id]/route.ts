import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/helpers';
import connectDB from '@/lib/db/connect';
import Feedback from '@/lib/db/models/Feedback';

/**
 * PATCH /api/admin/feedbacks/[id]
 *
 * Moderate feedback (admin only)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const { id } = params;
    const body = await request.json();
    const { action, moderationNote } = body;

    // Connect to database
    await connectDB();

    // Find feedback
    const feedback = await Feedback.findById(id);

    if (!feedback) {
      return NextResponse.json(
        {
          success: false,
          error: 'Feedback not found',
        },
        { status: 404 }
      );
    }

    // Perform moderation action
    if (action === 'approve') {
      feedback.moderation.status = 'approved';
      feedback.moderation.isApproved = true;
      feedback.moderation.moderatedBy = currentUser.id;
      feedback.moderation.moderatedAt = new Date();
      if (moderationNote) {
        feedback.moderation.moderationNote = moderationNote;
      }
    } else if (action === 'flag') {
      feedback.moderation.status = 'flagged';
      feedback.moderation.isApproved = false;
      feedback.moderation.moderatedBy = currentUser.id;
      feedback.moderation.moderatedAt = new Date();
      if (moderationNote) {
        feedback.moderation.moderationNote = moderationNote;
      }
    } else if (action === 'reject') {
      feedback.moderation.status = 'rejected';
      feedback.moderation.isApproved = false;
      feedback.moderation.moderatedBy = currentUser.id;
      feedback.moderation.moderatedAt = new Date();
      if (moderationNote) {
        feedback.moderation.moderationNote = moderationNote;
      }
    }

    await feedback.save();

    // Return success
    return NextResponse.json(
      {
        success: true,
        message: 'Feedback moderated successfully',
        data: feedback,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Moderate feedback error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'An error occurred while moderating feedback.',
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/feedbacks/[id]
 *
 * Delete feedback (admin only)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const { id } = params;

    // Connect to database
    await connectDB();

    // Delete feedback
    const feedback = await Feedback.findByIdAndDelete(id);

    if (!feedback) {
      return NextResponse.json(
        {
          success: false,
          error: 'Feedback not found',
        },
        { status: 404 }
      );
    }

    // Return success
    return NextResponse.json(
      {
        success: true,
        message: 'Feedback deleted successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Delete feedback error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'An error occurred while deleting feedback.',
      },
      { status: 500 }
    );
  }
}

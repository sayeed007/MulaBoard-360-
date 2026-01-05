import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser, hasAdminRole } from '@/lib/auth/helpers';
import connectDB from '@/lib/db/connect';
import Feedback from '@/lib/db/models/Feedback';
import { Types } from 'mongoose';

/**
 * PATCH /api/admin/feedbacks/[id]
 *
 * Moderate feedback (admin only)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication and admin role
    const currentUser = await getCurrentUser();

    if (!currentUser || !hasAdminRole(currentUser.role)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Unauthorized. Admin access required.',
        },
        { status: 403 }
      );
    }

    const { id } = await params;
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
      feedback.moderation.moderatedBy = new Types.ObjectId(currentUser.id);
      feedback.moderation.moderatedAt = new Date();
      if (moderationNote) {
        feedback.moderation.moderationNote = moderationNote;
      }
    } else if (action === 'flag') {
      feedback.moderation.status = 'flagged';
      feedback.moderation.moderatedBy = new Types.ObjectId(currentUser.id);
      feedback.moderation.moderatedAt = new Date();
      if (moderationNote) {
        feedback.moderation.moderationNote = moderationNote;
      }
    } else if (action === 'reject') {
      feedback.moderation.status = 'pending';
      feedback.moderation.moderatedBy = new Types.ObjectId(currentUser.id);
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
  { params }: { params: Promise<{ id: string }> }
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

    const { id } = await params;

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

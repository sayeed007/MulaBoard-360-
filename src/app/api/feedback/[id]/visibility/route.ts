import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/helpers';
import connectDB from '@/lib/db/connect';
import Feedback from '@/lib/db/models/Feedback';
import { updateFeedbackVisibilitySchema } from '@/validators/feedback';

/**
 * PATCH /api/feedback/[id]/visibility
 * Toggle feedback visibility (private/public)
 * Only the target user can change visibility
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();

    // Validate input
    const validatedData = updateFeedbackVisibilitySchema.safeParse(body);

    if (!validatedData.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid input',
          details: validatedData.error.issues,
        },
        { status: 400 }
      );
    }

    await connectDB();

    // Find feedback and verify ownership
    const feedback = await Feedback.findById(id);

    if (!feedback) {
      return NextResponse.json(
        { success: false, error: 'Feedback not found' },
        { status: 404 }
      );
    }

    // Only the target user can change visibility
    if (feedback.targetUser.toString() !== user.id) {
      return NextResponse.json(
        { success: false, error: 'You can only change visibility of your own feedback' },
        { status: 403 }
      );
    }

    // Update visibility
    feedback.visibility = validatedData.data.visibility;
    await feedback.save();

    return NextResponse.json({
      success: true,
      data: {
        id: feedback._id,
        visibility: feedback.visibility,
      },
    });
  } catch (error) {
    console.error('Error updating feedback visibility:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'An error occurred while updating visibility.',
      },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser, hasAdminRole } from '@/lib/auth/helpers';
import connectDB from '@/lib/db/connect';
import User from '@/lib/db/models/User';
import { sendUserApprovedEmail, sendUserRejectedEmail } from '@/lib/email/service';
import { Types } from 'mongoose';

/**
 * POST /api/admin/users/[id]/approve
 *
 * Approve or reject a pending user registration
 */
export async function POST(
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
    const { action, rejectionReason } = body;

    if (!action || !['approve', 'reject'].includes(action)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid action. Must be "approve" or "reject".',
        },
        { status: 400 }
      );
    }

    if (action === 'reject' && !rejectionReason) {
      return NextResponse.json(
        {
          success: false,
          error: 'Rejection reason is required when rejecting a user.',
        },
        { status: 400 }
      );
    }

    // Connect to database
    await connectDB();

    // Find user
    const user = await User.findById(id);

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: 'User not found',
        },
        { status: 404 }
      );
    }

    if (user.accountStatus !== 'pending') {
      return NextResponse.json(
        {
          success: false,
          error: `User account is already ${user.accountStatus}`,
        },
        { status: 400 }
      );
    }

    // Update user status
    if (action === 'approve') {
      user.accountStatus = 'approved';
      user.isProfileActive = true;
      user.approvedBy = new Types.ObjectId(currentUser.id);
      user.approvedAt = new Date();
      user.rejectionReason = undefined;
    } else if (action === 'reject') {
      user.accountStatus = 'rejected';
      user.isProfileActive = false;
      user.rejectionReason = rejectionReason;
    }

    await user.save();

    // Send email notification to user
    try {
      if (action === 'approve') {
        await sendUserApprovedEmail({
          fullName: user.fullName,
          email: user.email,
        });
      } else if (action === 'reject') {
        await sendUserRejectedEmail({
          fullName: user.fullName,
          email: user.email,
          rejectionReason,
        });
      }
    } catch (emailError) {
      console.error('Failed to send user notification email:', emailError);
      // Don't fail the approval/rejection if email fails
    }

    return NextResponse.json(
      {
        success: true,
        message: `User ${action === 'approve' ? 'approved' : 'rejected'} successfully`,
        data: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          accountStatus: user.accountStatus,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Approve/Reject user error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'An error occurred while processing the request.',
      },
      { status: 500 }
    );
  }
}

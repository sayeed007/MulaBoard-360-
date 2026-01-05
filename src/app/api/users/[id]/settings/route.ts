import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser, hasAdminRole } from '@/lib/auth/helpers';
import connectDB from '@/lib/db/connect';
import User from '@/lib/db/models/User';
import { updateSettingsSchema } from '@/validators/user';

/**
 * PATCH /api/users/[id]/settings
 *
 * Update user settings (authenticated users can only update their own settings, admins can update any)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json(
        {
          success: false,
          error: 'Unauthorized. Please sign in.',
        },
        { status: 401 }
      );
    }

    const { id } = await params;

    // Authorization: Users can only update their own settings, admins can update any
    if (currentUser.id !== id && !hasAdminRole(currentUser.role)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Forbidden. You can only update your own settings.',
        },
        { status: 403 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validatedData = updateSettingsSchema.safeParse(body);

    if (!validatedData.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          details: validatedData.error.issues,
        },
        { status: 400 }
      );
    }

    // Connect to database
    await connectDB();

    // Find and update user
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

    // Update settings
    const { isProfileActive } = validatedData.data;
    if (isProfileActive !== undefined) {
      user.isProfileActive = isProfileActive;
    }

    await user.save();

    // Return success response
    return NextResponse.json(
      {
        success: true,
        data: {
          isProfileActive: user.isProfileActive,
        },
        message: 'Settings updated successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Settings update error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'An error occurred while updating settings. Please try again.',
      },
      { status: 500 }
    );
  }
}

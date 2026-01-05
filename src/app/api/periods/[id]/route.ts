import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser, hasAdminRole } from '@/lib/auth/helpers';
import connectDB from '@/lib/db/connect';
import ReviewPeriod from '@/lib/db/models/ReviewPeriod';
import { updatePeriodSchema } from '@/validators/period';

/**
 * PATCH /api/periods/[id]
 *
 * Update review period (admin only)
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

    // Validate request body
    const validatedData = updatePeriodSchema.safeParse(body);

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

    // Find period
    const period = await ReviewPeriod.findById(id);

    if (!period) {
      return NextResponse.json(
        {
          success: false,
          error: 'Review period not found',
        },
        { status: 404 }
      );
    }

    const { name, startDate, endDate, themeName, themeEmoji, themeBackgroundColor, isActive } = validatedData.data;

    // Check if slug already exists (logic removed as slug update is not supported in schema)

    // If this should be active, deactivate all other periods
    if (isActive === true && !period.isActive) {
      await ReviewPeriod.updateMany({ _id: { $ne: id } }, { isActive: false });
    }

    // Update period
    if (name) period.name = name;
    if (startDate) period.startDate = new Date(startDate);
    if (endDate) period.endDate = new Date(endDate);
    if (isActive !== undefined) period.isActive = isActive;

    // Update theme if any theme field is provided
    if (themeName || themeEmoji || themeBackgroundColor) {
      period.theme = {
        name: themeName || period.theme.name,
        primaryEmoji: themeEmoji || period.theme.primaryEmoji,
        backgroundColor: themeBackgroundColor || period.theme.backgroundColor || '#f0fdf4',
      };
    }

    await period.save();

    // Return success
    return NextResponse.json(
      {
        success: true,
        message: 'Review period updated successfully',
        data: period,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Update period error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'An error occurred while updating review period.',
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/periods/[id]
 *
 * Delete review period (admin only)
 */
export async function DELETE(
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

    // Connect to database
    await connectDB();

    // Delete period
    const period = await ReviewPeriod.findByIdAndDelete(id);

    if (!period) {
      return NextResponse.json(
        {
          success: false,
          error: 'Review period not found',
        },
        { status: 404 }
      );
    }

    // Return success
    return NextResponse.json(
      {
        success: true,
        message: 'Review period deleted successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Delete period error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'An error occurred while deleting review period.',
      },
      { status: 500 }
    );
  }
}

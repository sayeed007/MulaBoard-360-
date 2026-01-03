import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/helpers';
import connectDB from '@/lib/db/connect';
import ReviewPeriod from '@/lib/db/models/ReviewPeriod';
import { createPeriodSchema } from '@/validators/period';

/**
 * PATCH /api/periods/[id]
 *
 * Update review period (admin only)
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

    // Validate request body
    const validatedData = createPeriodSchema.safeParse(body);

    if (!validatedData.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          details: validatedData.error.errors,
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

    const { name, slug, startDate, endDate, theme } = validatedData.data;

    // Check if slug already exists (excluding current period)
    if (slug !== period.slug) {
      const existingPeriod = await ReviewPeriod.findOne({ slug });
      if (existingPeriod) {
        return NextResponse.json(
          {
            success: false,
            error: 'Slug already exists',
          },
          { status: 409 }
        );
      }
    }

    // If this should be active, deactivate all other periods
    if (body.isActive && !period.isActive) {
      await ReviewPeriod.updateMany({ _id: { $ne: id } }, { isActive: false });
    }

    // Update period
    period.name = name;
    period.slug = slug;
    period.startDate = startDate;
    period.endDate = endDate;
    period.isActive = body.isActive !== undefined ? body.isActive : period.isActive;
    period.theme = theme || period.theme;

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

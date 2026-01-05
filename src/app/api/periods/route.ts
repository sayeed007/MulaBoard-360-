import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser, hasAdminRole } from '@/lib/auth/helpers';
import connectDB from '@/lib/db/connect';
import ReviewPeriod from '@/lib/db/models/ReviewPeriod';
import { createPeriodSchema } from '@/validators/period';

/**
 * GET /api/periods
 *
 * Get all review periods
 */
export async function GET(request: NextRequest) {
  try {
    // Connect to database
    await connectDB();

    // Get query params
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get('active') === 'true';

    // Build query
    const query: any = {};
    if (activeOnly) {
      query.isActive = true;
    }

    // Get periods
    const periods = await ReviewPeriod.find(query).sort({ startDate: -1 }).lean();

    // Return response
    return NextResponse.json(
      {
        success: true,
        data: periods,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get periods error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'An error occurred while fetching review periods.',
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/periods
 *
 * Create new review period (admin only)
 */
export async function POST(request: NextRequest) {
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

    // Parse and validate request body
    const body = await request.json();
    const validatedData = createPeriodSchema.safeParse(body);

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

    const { name, slug, startDate, endDate, themeName, themeEmoji, themeBackgroundColor, isActive } = validatedData.data;

    // Check if slug already exists
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

    // If this should be active, deactivate all other periods
    if (isActive) {
      await ReviewPeriod.updateMany({}, { isActive: false });
    }

    // Create period
    const period = await ReviewPeriod.create({
      name,
      slug,
      startDate,
      endDate,
      isActive,
      theme: {
        name: themeName,
        primaryEmoji: themeEmoji,
        backgroundColor: themeBackgroundColor,
      },
    });

    // Return success
    return NextResponse.json(
      {
        success: true,
        message: 'Review period created successfully',
        data: period,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create period error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'An error occurred while creating review period.',
      },
      { status: 500 }
    );
  }
}

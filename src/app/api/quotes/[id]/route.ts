import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser, hasAdminRole } from '@/lib/auth/helpers';
import connectDB from '@/lib/db/connect';
import Quote from '@/lib/db/models/Quote';
import { updateQuoteSchema } from '@/validators/quote';

/**
 * PATCH /api/quotes/[id]
 *
 * Update quote (admin only)
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
    const validatedData = updateQuoteSchema.safeParse(body);

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

    // Find and update quote
    const quote = await Quote.findByIdAndUpdate(
      id,
      { $set: validatedData.data },
      { new: true, runValidators: true }
    );

    if (!quote) {
      return NextResponse.json(
        {
          success: false,
          error: 'Quote not found',
        },
        { status: 404 }
      );
    }

    // Return success
    return NextResponse.json(
      {
        success: true,
        message: 'Quote updated successfully',
        data: quote,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Update quote error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'An error occurred while updating quote.',
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/quotes/[id]
 *
 * Delete quote (admin only)
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

    // Delete quote
    const quote = await Quote.findByIdAndDelete(id);

    if (!quote) {
      return NextResponse.json(
        {
          success: false,
          error: 'Quote not found',
        },
        { status: 404 }
      );
    }

    // Return success
    return NextResponse.json(
      {
        success: true,
        message: 'Quote deleted successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Delete quote error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'An error occurred while deleting quote.',
      },
      { status: 500 }
    );
  }
}

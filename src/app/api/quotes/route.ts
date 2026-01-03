import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/helpers';
import connectDB from '@/lib/db/connect';
import Quote from '@/lib/db/models/Quote';
import { createQuoteSchema } from '@/validators/quote';

/**
 * GET /api/quotes
 *
 * Get all quotes (admin) or get random quote (public)
 */
export async function GET(request: NextRequest) {
  try {
    // Connect to database
    await connectDB();

    const { searchParams } = new URL(request.url);
    const isAdmin = searchParams.get('admin') === 'true';

    // Admin: List all quotes with filtering
    if (isAdmin) {
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

      const category = searchParams.get('category') || '';
      const mood = searchParams.get('mood') || '';
      const isActive = searchParams.get('isActive');
      const page = parseInt(searchParams.get('page') || '1');
      const limit = parseInt(searchParams.get('limit') || '20');

      // Build query
      const query: any = {};

      if (category) {
        query.category = category;
      }

      if (mood) {
        query.mood = mood;
      }

      if (isActive !== null && isActive !== undefined && isActive !== '') {
        query.isActive = isActive === 'true';
      }

      // Get total count
      const total = await Quote.countDocuments(query);

      // Get quotes with pagination
      const quotes = await Quote.find(query)
        .populate('createdBy', 'fullName email')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean();

      // Return response
      return NextResponse.json(
        {
          success: true,
          data: {
            quotes,
            pagination: {
              page,
              limit,
              total,
              totalPages: Math.ceil(total / limit),
            },
          },
        },
        { status: 200 }
      );
    }

    // Public: Get random quote
    const category = searchParams.get('category') || 'landing';
    const mood = searchParams.get('mood');

    const query: any = {
      isActive: true,
      category,
    };

    if (mood) {
      query.mood = mood;
    }

    // Get random quote
    const quotes = await Quote.find(query).lean();

    if (quotes.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'No quotes found for this category',
        },
        { status: 404 }
      );
    }

    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

    // Increment display count (fire and forget)
    Quote.findByIdAndUpdate(randomQuote._id, { $inc: { displayCount: 1 } }).exec();

    return NextResponse.json(
      {
        success: true,
        data: randomQuote,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get quotes error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'An error occurred while fetching quotes.',
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/quotes
 *
 * Create new quote (admin only)
 */
export async function POST(request: NextRequest) {
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

    // Parse request body
    const body = await request.json();

    // Validate with Zod
    const validatedData = createQuoteSchema.safeParse(body);

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

    const { text, textBn, category, mood, isActive } = validatedData.data;

    // Connect to database
    await connectDB();

    // Create quote
    const quote = await Quote.create({
      text,
      textBn,
      category,
      mood,
      isActive,
      createdBy: currentUser.id,
    });

    // Return success
    return NextResponse.json(
      {
        success: true,
        message: 'Quote created successfully',
        data: quote,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create quote error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'An error occurred while creating quote.',
      },
      { status: 500 }
    );
  }
}

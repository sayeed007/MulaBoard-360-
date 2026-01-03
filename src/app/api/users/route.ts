import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/helpers';
import connectDB from '@/lib/db/connect';
import User from '@/lib/db/models/User';
import { registerSchema } from '@/validators/user';
import { generateUniqueSlug } from '@/lib/utils/slug';

/**
 * GET /api/users
 *
 * Get all users (admin only)
 */
export async function GET(request: NextRequest) {
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

    // Get query params
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const role = searchParams.get('role') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    // Connect to database
    await connectDB();

    // Build query
    const query: any = {};

    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { department: { $regex: search, $options: 'i' } },
      ];
    }

    if (role) {
      query.role = role;
    }

    // Get total count
    const total = await User.countDocuments(query);

    // Get users with pagination
    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    // Return response
    return NextResponse.json(
      {
        success: true,
        data: {
          users,
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
  } catch (error) {
    console.error('Get users error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'An error occurred while fetching users.',
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/users
 *
 * Create new user (admin only)
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
    const validatedData = registerSchema.safeParse(body);

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

    const { email, password, fullName, designation, department } = validatedData.data;

    // Connect to database
    await connectDB();

    // Check if email already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          error: 'Email already registered',
        },
        { status: 409 }
      );
    }

    // Generate unique slug
    const publicSlug = await generateUniqueSlug(fullName);

    // Create user
    const user = await User.create({
      email: email.toLowerCase(),
      password, // Will be hashed by pre-save middleware
      fullName,
      designation,
      department,
      publicSlug,
      role: body.role || 'employee', // Allow admin to set role
      isProfileActive: true,
    });

    // Return success
    return NextResponse.json(
      {
        success: true,
        message: 'User created successfully',
        data: {
          id: user._id,
          email: user.email,
          fullName: user.fullName,
          role: user.role,
          publicSlug: user.publicSlug,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create user error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'An error occurred while creating user.',
      },
      { status: 500 }
    );
  }
}

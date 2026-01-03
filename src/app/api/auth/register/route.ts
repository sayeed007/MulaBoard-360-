import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import User from '@/lib/db/models/User';
import { registerSchema } from '@/validators/user';
import { generateSlug, generateUniqueSlug } from '@/lib/utils/slug';

/**
 * POST /api/auth/register
 *
 * Register a new user account
 */
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();

    // Validate input
    const validatedData = registerSchema.safeParse(body);

    if (!validatedData.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          details: validatedData.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { email, password, fullName, designation, department } = validatedData.data;

    // Connect to database
    await connectDB();

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          error: 'An account with this email already exists',
        },
        { status: 409 }
      );
    }

    // Generate unique slug from full name
    let publicSlug = generateSlug(fullName);

    // Check if slug is already taken
    const existingSlug = await User.findOne({ publicSlug });

    if (existingSlug) {
      // Generate unique slug with random suffix
      publicSlug = generateUniqueSlug(publicSlug);

      // Keep trying until we find a unique slug
      let attempts = 0;
      while (await User.findOne({ publicSlug })) {
        publicSlug = generateUniqueSlug(generateSlug(fullName));
        attempts++;

        // Prevent infinite loop
        if (attempts > 10) {
          return NextResponse.json(
            {
              success: false,
              error: 'Unable to generate unique profile URL. Please try again.',
            },
            { status: 500 }
          );
        }
      }
    }

    // Create new user
    const user = await User.create({
      email: email.toLowerCase(),
      password, // Will be hashed by the pre-save middleware
      fullName,
      designation,
      department,
      publicSlug,
      role: 'employee', // Default role
      isProfileActive: true,
      settings: {
        emailNotifications: true,
        showAggregatePublicly: false,
      },
    });

    // Return success response (without password)
    return NextResponse.json(
      {
        success: true,
        message: 'Account created successfully',
        data: {
          id: user._id,
          email: user.email,
          fullName: user.fullName,
          publicSlug: user.publicSlug,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);

    // Handle duplicate key errors
    if (error instanceof Error && 'code' in error && error.code === 11000) {
      return NextResponse.json(
        {
          success: false,
          error: 'An account with this email or username already exists',
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: 'An error occurred during registration. Please try again.',
      },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/helpers';
import connectDB from '@/lib/db/connect';
import User from '@/lib/db/models/User';
import { updateProfileSchema } from '@/validators/user';

/**
 * PATCH /api/users/[id]
 *
 * Update user profile (authenticated users can only update their own profile, admins can update any)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
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

    const { id } = params;

    // Authorization: Users can only update their own profile, admins can update any
    if (currentUser.id !== id && currentUser.role !== 'admin') {
      return NextResponse.json(
        {
          success: false,
          error: 'Forbidden. You can only update your own profile.',
        },
        { status: 403 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validatedData = updateProfileSchema.safeParse(body);

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

    // Find and update user
    const user = await User.findById(id).select('-password');

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: 'User not found',
        },
        { status: 404 }
      );
    }

    // Update user fields
    const { fullName, designation, department, bio, profileImage } = validatedData.data;

    user.fullName = fullName;
    user.designation = designation;
    user.department = department;
    user.bio = bio || user.bio;
    if (profileImage) {
      user.profileImage = profileImage;
    }

    await user.save();

    // Return updated user data (without password)
    return NextResponse.json(
      {
        success: true,
        data: {
          id: user._id,
          email: user.email,
          fullName: user.fullName,
          designation: user.designation,
          department: user.department,
          bio: user.bio,
          profileImage: user.profileImage,
          publicSlug: user.publicSlug,
        },
        message: 'Profile updated successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Profile update error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'An error occurred while updating profile. Please try again.',
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/users/[id]
 *
 * Get user profile by ID (public endpoint, no auth required)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Connect to database
    await connectDB();

    // Find user by ID (exclude password and sensitive fields)
    const user = await User.findById(id).select(
      '-password -createdAt -updatedAt -__v'
    );

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: 'User not found',
        },
        { status: 404 }
      );
    }

    // Only return profile if it's active
    if (!user.isProfileActive) {
      return NextResponse.json(
        {
          success: false,
          error: 'Profile is not available',
        },
        { status: 404 }
      );
    }

    // Return user profile
    return NextResponse.json(
      {
        success: true,
        data: {
          id: user._id,
          fullName: user.fullName,
          designation: user.designation,
          department: user.department,
          bio: user.bio,
          profileImage: user.profileImage,
          publicSlug: user.publicSlug,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get user error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'An error occurred while fetching user profile.',
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/users/[id]
 *
 * Delete user (admin only)
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

    // Prevent deleting self
    if (currentUser.id === id) {
      return NextResponse.json(
        {
          success: false,
          error: 'Cannot delete your own account',
        },
        { status: 400 }
      );
    }

    // Connect to database
    await connectDB();

    // Delete user
    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: 'User not found',
        },
        { status: 404 }
      );
    }

    // Return success
    return NextResponse.json(
      {
        success: true,
        message: 'User deleted successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Delete user error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'An error occurred while deleting user.',
      },
      { status: 500 }
    );
  }
}

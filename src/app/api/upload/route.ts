import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/helpers';
import { uploadImage } from '@/lib/cloudinary/upload';

// Force this route to run only on the server
export const runtime = 'nodejs';

/**
 * POST /api/upload
 *
 * Upload image to Cloudinary (authenticated users only)
 */
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: 'Unauthorized. Please sign in.',
        },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { image } = body;

    if (!image) {
      return NextResponse.json(
        {
          success: false,
          error: 'No image provided',
        },
        { status: 400 }
      );
    }

    // Validate base64 format
    if (!image.startsWith('data:image/')) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid image format. Please provide a valid image.',
        },
        { status: 400 }
      );
    }

    // Upload to Cloudinary
    const result = await uploadImage(image, 'mulaboard/profiles');

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error || 'Failed to upload image',
        },
        { status: 500 }
      );
    }

    // Return success response
    return NextResponse.json(
      {
        success: true,
        url: result.url,
        publicId: result.publicId,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Upload error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'An error occurred during upload. Please try again.',
      },
      { status: 500 }
    );
  }
}

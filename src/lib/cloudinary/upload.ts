import cloudinary, { validateCloudinaryConfig } from './config';

/**
 * Cloudinary Upload Utilities
 */

export interface CloudinaryUploadResult {
  success: boolean;
  url?: string;
  publicId?: string;
  error?: string;
}

/**
 * Upload image to Cloudinary
 *
 * @param base64Image - Base64 encoded image string
 * @param folder - Cloudinary folder to upload to (default: 'mulaboard/profiles')
 * @returns Upload result with URL and public ID
 */
export async function uploadImage(
  base64Image: string,
  folder: string = 'mulaboard/profiles'
): Promise<CloudinaryUploadResult> {
  try {
    // Validate Cloudinary configuration
    if (!validateCloudinaryConfig()) {
      return {
        success: false,
        error: 'Cloudinary is not configured. Please add credentials to .env.local',
      };
    }

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(base64Image, {
      folder,
      transformation: [
        { width: 500, height: 500, crop: 'fill', gravity: 'face' },
        { quality: 'auto' },
        { fetch_format: 'auto' },
      ],
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    });

    return {
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    return {
      success: false,
      error: 'Failed to upload image. Please try again.',
    };
  }
}

/**
 * Delete image from Cloudinary
 *
 * @param publicId - Cloudinary public ID of the image
 * @returns Success status
 */
export async function deleteImage(publicId: string): Promise<boolean> {
  try {
    // Validate Cloudinary configuration
    if (!validateCloudinaryConfig()) {
      console.error('Cloudinary is not configured');
      return false;
    }

    const result = await cloudinary.uploader.destroy(publicId);
    return result.result === 'ok';
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    return false;
  }
}

/**
 * Validate image file
 *
 * @param file - File object
 * @returns Validation result
 */
export function validateImageFile(file: File): {
  valid: boolean;
  error?: string;
} {
  const MAX_SIZE = 5 * 1024 * 1024; // 5MB
  const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

  if (!ALLOWED_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: 'Invalid file type. Please upload a JPG, PNG, or WebP image.',
    };
  }

  if (file.size > MAX_SIZE) {
    return {
      valid: false,
      error: 'File is too large. Maximum size is 5MB.',
    };
  }

  return { valid: true };
}

/**
 * Convert file to base64
 *
 * @param file - File object
 * @returns Promise with base64 string
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
}

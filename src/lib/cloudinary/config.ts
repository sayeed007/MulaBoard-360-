import { v2 as cloudinary } from 'cloudinary';

/**
 * Cloudinary Configuration
 *
 * Configures Cloudinary for image uploads
 */

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// Validate configuration
export function validateCloudinaryConfig(): boolean {
  const { cloud_name, api_key, api_secret } = cloudinary.config();
  return !!(cloud_name && api_key && api_secret);
}

export default cloudinary;

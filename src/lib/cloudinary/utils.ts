/**
 * Cloudinary Client Utilities
 *
 * Helper functions for handling images on the client side.
 * These functions do NOT import the Cloudinary SDK and are safe for Client Components.
 */

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

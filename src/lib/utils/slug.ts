/**
 * Generate a URL-friendly slug from a string
 *
 * @param text - Text to slugify
 * @returns URL-friendly slug
 *
 * @example
 * generateSlug('Sayeed Hossen') // => 'sayeed-hossen'
 * generateSlug('John O\'Brien Jr.') // => 'john-obrien-jr'
 */
export function generateSlug(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, ''); // Trim - from end of text
}

/**
 * Generate a unique slug by appending a random suffix
 *
 * @param baseSlug - Base slug to make unique
 * @param length - Length of random suffix (default: 4)
 * @returns Unique slug
 *
 * @example
 * generateUniqueSlug('sayeed-hossen') // => 'sayeed-hossen-a3d9'
 */
export function generateUniqueSlug(baseSlug: string, length: number = 4): string {
  const randomSuffix = Math.random()
    .toString(36)
    .substring(2, 2 + length);
  return `${baseSlug}-${randomSuffix}`;
}

/**
 * Validate if a string is a valid slug
 *
 * @param slug - Slug to validate
 * @returns True if valid slug
 *
 * @example
 * isValidSlug('sayeed-hossen') // => true
 * isValidSlug('Sayeed Hossen') // => false
 * isValidSlug('sayeed_hossen') // => true
 */
export function isValidSlug(slug: string): boolean {
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  return slugRegex.test(slug);
}

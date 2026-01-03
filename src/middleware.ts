import { auth } from '@/lib/auth/auth';

/**
 * Middleware for Route Protection
 *
 * This middleware uses NextAuth.js v5's auth() function
 * to protect routes and handle authorization.
 *
 * Protected routes:
 * - /dashboard - Requires authentication (employee or admin)
 * - /profile - Requires authentication (employee or admin)
 * - /my-reviews - Requires authentication (employee or admin)
 * - /settings - Requires authentication (employee or admin)
 * - /admin - Requires admin role
 */

export default auth;

/**
 * Matcher Configuration
 *
 * Specifies which routes the middleware should run on.
 * Uses Next.js middleware matcher syntax.
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (auth endpoints)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, fonts, etc.)
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

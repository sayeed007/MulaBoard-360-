import NextAuth from 'next-auth';
import { authConfig } from '@/lib/auth/auth.config.edge';

/**
 * Middleware for Route Protection
 *
 * This middleware uses NextAuth.js v5 with Edge Runtime compatible configuration.
 * The edge config excludes database operations and Node.js modules to be compatible
 * with the Edge Runtime.
 *
 * Protected routes:
 * - /dashboard - Requires authentication (employee or admin)
 * - /profile - Requires authentication (employee or admin)
 * - /my-reviews - Requires authentication (employee or admin)
 * - /settings - Requires authentication (employee or admin)
 * - /admin - Requires admin role
 */

export default NextAuth(authConfig).auth;

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
    '/((?!api/auth|_next/static|_next/image|favicon.ico|.*\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

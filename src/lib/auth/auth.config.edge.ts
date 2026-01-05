import type { NextAuthConfig } from 'next-auth';

/**
 * Edge-Compatible NextAuth Configuration
 *
 * This configuration file is Edge Runtime compatible and used by middleware.
 * Database operations and Node.js-specific code are in auth.config.ts
 */

export const authConfig = {
  pages: {
    signIn: '/login',
    signOut: '/login',
    error: '/login',
    newUser: '/register',
  },

  callbacks: {
    // Authorized callback - controls access to pages (Edge Runtime compatible)
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      const isOnProfile = nextUrl.pathname.startsWith('/profile');
      const isOnMyReviews = nextUrl.pathname.startsWith('/my-reviews');
      const isOnSettings = nextUrl.pathname.startsWith('/settings');
      const isOnAdmin = nextUrl.pathname.startsWith('/admin');
      const isOnAuth = nextUrl.pathname.startsWith('/login') || nextUrl.pathname.startsWith('/register');

      // Redirect to dashboard if logged in and trying to access auth pages
      if (isOnAuth && isLoggedIn) {
        return Response.redirect(new URL('/dashboard', nextUrl));
      }

      // Require authentication for protected routes
      if ((isOnDashboard || isOnProfile || isOnMyReviews || isOnSettings) && !isLoggedIn) {
        return false; // Will redirect to sign in page
      }

      // Check admin access
      if (isOnAdmin && auth?.user?.role !== 'admin') {
        return Response.redirect(new URL('/dashboard', nextUrl));
      }

      return true;
    },
  },

  providers: [],

  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  secret: process.env.NEXTAUTH_SECRET,

  debug: process.env.NODE_ENV === 'development',
} satisfies NextAuthConfig;

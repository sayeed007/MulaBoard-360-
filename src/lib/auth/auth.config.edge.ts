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
    // JWT callback - runs when JWT is created or updated (Edge Runtime compatible)
    async jwt({ token, user }) {
      // Initial sign in
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.role = user.role;
        token.name = user.name;
        token.publicSlug = user.publicSlug;
        token.isProfileActive = user.isProfileActive;
      }
      return token;
    },

    // Session callback - runs whenever session is checked (Edge Runtime compatible)
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.role = token.role as 'employee' | 'admin';
        session.user.name = token.name as string;
        session.user.publicSlug = token.publicSlug as string;
        session.user.isProfileActive = token.isProfileActive as boolean;
      }
      return session;
    },

    // Authorized callback - controls access to pages (Edge Runtime compatible)
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      const isOnProfile = nextUrl.pathname.startsWith('/profile');
      const isOnMyReviews = nextUrl.pathname.startsWith('/my-reviews');
      const isOnSettings = nextUrl.pathname.startsWith('/settings');
      const isOnAdmin = nextUrl.pathname.startsWith('/admin');
      const isOnAuth = nextUrl.pathname.startsWith('/login') || nextUrl.pathname.startsWith('/register');

      // Redirect to appropriate page if logged in and trying to access auth pages
      if (isOnAuth && isLoggedIn) {
        const redirectPath = auth.user.role === 'admin' ? '/admin' : '/dashboard';
        return Response.redirect(new URL(redirectPath, nextUrl));
      }

      // Require authentication for protected routes
      if ((isOnDashboard || isOnProfile || isOnMyReviews || isOnSettings) && !isLoggedIn) {
        return false; // Will redirect to sign in page
      }

      // Check admin access
      if (isOnAdmin) {
        console.log('🔍 Admin route access check:', {
          path: nextUrl.pathname,
          userRole: auth?.user?.role,
          isAdmin: auth?.user?.role === 'admin',
        });

        if (auth?.user?.role !== 'admin') {
          console.log('❌ Access denied - redirecting to /dashboard');
          return Response.redirect(new URL('/dashboard', nextUrl));
        }
        console.log('✅ Admin access granted');
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

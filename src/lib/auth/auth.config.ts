import type { NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { loginSchema } from '@/validators/user';
import connectDB from '@/lib/db/connect';
import User from '@/lib/db/models/User';

/**
 * NextAuth.js v5 Configuration
 *
 * This file contains the authentication configuration for NextAuth.js v5
 * using credentials-based authentication with MongoDB.
 */

export const authConfig = {
  pages: {
    signIn: '/login',
    signOut: '/login',
    error: '/login',
    newUser: '/register',
  },

  callbacks: {
    // JWT callback - runs when JWT is created or updated
    async jwt({ token, user, trigger, session }) {
      // Initial sign in
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.role = user.role;
        token.name = user.name;
        token.publicSlug = user.publicSlug;
        token.isProfileActive = user.isProfileActive;
      }

      // Handle session updates
      if (trigger === 'update' && session) {
        token.name = session.name;
      }

      return token;
    },

    // Session callback - runs whenever session is checked
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

    // Authorized callback - controls access to pages
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
      if (isOnAdmin && auth?.user?.role !== 'admin') {
        return Response.redirect(new URL('/dashboard', nextUrl));
      }

      return true;
    },
  },

  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },

      async authorize(credentials) {
        try {
          // Validate input
          const validatedFields = loginSchema.safeParse(credentials);

          if (!validatedFields.success) {
            console.error('Invalid credentials format');
            return null;
          }

          const { email, password } = validatedFields.data;

          // Connect to database
          await connectDB();

          // Find user and explicitly include password field
          const user = await User.findOne({ email }).select('+password');

          if (!user) {
            console.error('User not found');
            return null;
          }

          // Check if profile is active
          if (!user.isProfileActive) {
            console.error('User profile is inactive');
            return null;
          }

          // Compare password
          const isPasswordValid = await user.comparePassword(password);

          if (!isPasswordValid) {
            console.error('Invalid password');
            return null;
          }

          // Return user object (password will be excluded by toJSON)
          return {
            id: user._id.toString(),
            email: user.email,
            name: user.fullName,
            role: user.role,
            image: user.profileImage || null,
            publicSlug: user.publicSlug,
            isProfileActive: user.isProfileActive,
          };
        } catch (error) {
          console.error('Error during authentication:', error);
          return null;
        }
      },
    }),
  ],

  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  secret: process.env.NEXTAUTH_SECRET,

  debug: process.env.NODE_ENV === 'development',
} satisfies NextAuthConfig;

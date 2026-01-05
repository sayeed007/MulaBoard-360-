import type { NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { CredentialsSignin } from 'next-auth';
import { loginSchema } from '@/validators/user';

class InvalidLoginError extends CredentialsSignin {
  constructor() {
    super()
    this.code = "invalid_credentials"
  }
}

class PendingApprovalError extends CredentialsSignin {
  constructor() {
    super()
    this.code = "pending_approval"
  }
}

class RejectedError extends CredentialsSignin {
  constructor(reason: string) {
    super()
    this.code = "rejected"
    this.message = reason // Try passing reason as message, though code might be safer for logic
  }
}

class InactiveProfileError extends CredentialsSignin {
  constructor() {
    super()
    this.code = "inactive_profile"
  }
}
import connectDB from '@/lib/db/connect';
import User from '@/lib/db/models/User';
import { authConfig as edgeConfig } from './auth.config.edge';

/**
 * Full NextAuth Configuration (Node.js Runtime)
 *
 * This file contains the complete authentication configuration including
 * database operations and providers. This is used by the auth instance
 * in routes and API endpoints (Node.js runtime).
 *
 * For Edge Runtime (middleware), auth.config.edge.ts is used instead.
 */

export const authConfig = {
  ...edgeConfig,

  callbacks: {
    ...edgeConfig.callbacks,

    // JWT callback - runs when JWT is created or updated
    async jwt({ token, user, trigger, session }) {
      // Initial sign in
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.role = user.role;
        token.name = user.name;
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
      }

      return session;
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

          // Compare password first (before other checks)
          const isPasswordValid = await user.comparePassword(password);

          if (!isPasswordValid) {
            console.error('Invalid password');
            return null;
          }

          // Check account status
          if (user.accountStatus === 'pending') {
            console.error('Account pending approval');
            throw new PendingApprovalError();
          }

          if (user.accountStatus === 'rejected') {
            const reason = user.rejectionReason || 'No reason provided';
            console.error('Account rejected');
            throw new RejectedError(reason);
          }

          // Check if profile is active
          if (!user.isProfileActive) {
            console.error('User profile is inactive');
            throw new InactiveProfileError();
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
          if (error instanceof CredentialsSignin) {
            throw error;
          }
          if (error instanceof Error && error.message.includes('pending admin approval')) {
            throw new PendingApprovalError();
          }
          if (error instanceof Error && error.message.includes('rejected')) {
            throw new RejectedError(error.message.split('Reason: ')[1] || 'Account rejected');
          }
          console.error('Error during authentication:', error);
          return null;
        }
      },
    }),
  ],
} satisfies NextAuthConfig;

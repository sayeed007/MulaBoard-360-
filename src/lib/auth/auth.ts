import NextAuth from 'next-auth';
import { authConfig } from './auth.config.full';

/**
 * NextAuth.js v5 Instance
 *
 * This exports the auth handlers and helper functions
 * for authentication throughout the application.
 *
 * Uses the full configuration (with providers) for Node.js runtime.
 */

export const { auth, signIn, signOut, handlers } = NextAuth(authConfig);

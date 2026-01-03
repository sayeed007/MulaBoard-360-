import NextAuth from 'next-auth';
import { authConfig } from './auth.config';

/**
 * NextAuth.js v5 Instance
 *
 * This exports the auth handlers and helper functions
 * for authentication throughout the application.
 */

export const { auth, signIn, signOut, handlers } = NextAuth(authConfig);

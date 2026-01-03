/**
 * NextAuth.js v5 API Route Handler
 *
 * This handles all authentication requests:
 * - GET /api/auth/signin
 * - POST /api/auth/signin
 * - GET /api/auth/signout
 * - POST /api/auth/signout
 * - GET /api/auth/session
 * - GET /api/auth/csrf
 * - GET /api/auth/providers
 */

import { handlers } from '@/lib/auth/auth';

export const { GET, POST } = handlers;

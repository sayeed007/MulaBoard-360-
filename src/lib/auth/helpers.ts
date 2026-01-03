import { auth } from './auth';

/**
 * Auth Helper Functions
 *
 * Utility functions for working with authentication
 */

/**
 * Get current session (server-side)
 * @returns Session object or null
 */
export async function getSession() {
  return await auth();
}

/**
 * Get current user (server-side)
 * @returns User object or null
 */
export async function getCurrentUser() {
  const session = await getSession();
  return session?.user || null;
}

/**
 * Check if user is authenticated (server-side)
 * @returns true if authenticated, false otherwise
 */
export async function isAuthenticated() {
  const session = await getSession();
  return !!session?.user;
}

/**
 * Check if user is admin (server-side)
 * @returns true if admin, false otherwise
 */
export async function isAdmin() {
  const session = await getSession();
  return session?.user?.role === 'admin';
}

/**
 * Check if user is employee (server-side)
 * @returns true if employee, false otherwise
 */
export async function isEmployee() {
  const session = await getSession();
  return session?.user?.role === 'employee';
}

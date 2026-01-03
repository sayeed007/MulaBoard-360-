import crypto from 'crypto';

/**
 * Hash an IP address using SHA-256
 *
 * This is used for privacy-preserving storage of IP addresses.
 * We never store raw IPs, only their hashed versions.
 *
 * @param ip - IP address to hash
 * @returns SHA-256 hash of the IP
 *
 * @example
 * hashIP('192.168.1.1') // => 'a1b2c3d4e5f6...'
 */
export function hashIP(ip: string): string {
  return crypto.createHash('sha256').update(ip).digest('hex');
}

/**
 * Hash a password using bcrypt
 *
 * @param password - Plain text password
 * @param saltRounds - Number of salt rounds (default: 12)
 * @returns Hashed password
 */
export async function hashPassword(password: string, saltRounds: number = 12): Promise<string> {
  const bcrypt = require('bcryptjs');
  return await bcrypt.hash(password, saltRounds);
}

/**
 * Compare a plain text password with a hashed password
 *
 * @param password - Plain text password
 * @param hashedPassword - Hashed password
 * @returns True if passwords match
 */
export async function comparePassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  const bcrypt = require('bcryptjs');
  return await bcrypt.compare(password, hashedPassword);
}

/**
 * Generate a random token
 *
 * @param length - Length of the token in bytes (default: 32)
 * @returns Random hex token
 *
 * @example
 * generateToken() // => 'a1b2c3d4e5f6...' (64 chars)
 * generateToken(16) // => 'a1b2c3d4...' (32 chars)
 */
export function generateToken(length: number = 32): string {
  return crypto.randomBytes(length).toString('hex');
}

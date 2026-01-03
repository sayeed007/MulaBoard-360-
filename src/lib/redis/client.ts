import { Redis } from '@upstash/redis';

/**
 * Upstash Redis Client
 *
 * Used for rate limiting and spam prevention
 */

// Check if Redis is configured
export function validateRedisConfig(): boolean {
  return !!(
    process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
  );
}

// Initialize Redis client (only if configured)
let redis: Redis | null = null;

if (validateRedisConfig()) {
  redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
  });
}

export default redis;

/**
 * Rate limiting helpers
 */

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

/**
 * Check rate limit for a key
 *
 * @param key - Unique key for the rate limit (e.g., "feedback:ip:hash123")
 * @param limit - Maximum number of requests allowed
 * @param window - Time window in seconds
 * @returns Rate limit result
 */
export async function checkRateLimit(
  key: string,
  limit: number,
  window: number
): Promise<RateLimitResult> {
  if (!redis) {
    // If Redis is not configured, allow all requests
    console.warn('Redis not configured, rate limiting disabled');
    return {
      success: true,
      limit,
      remaining: limit,
      reset: Date.now() + window * 1000,
    };
  }

  try {
    const count = await redis.incr(key);

    // Set expiry on first request
    if (count === 1) {
      await redis.expire(key, window);
    }

    const ttl = await redis.ttl(key);
    const reset = Date.now() + (ttl > 0 ? ttl * 1000 : window * 1000);

    return {
      success: count <= limit,
      limit,
      remaining: Math.max(0, limit - count),
      reset,
    };
  } catch (error) {
    console.error('Redis rate limit error:', error);
    // On error, allow the request
    return {
      success: true,
      limit,
      remaining: limit,
      reset: Date.now() + window * 1000,
    };
  }
}

/**
 * Get current count for a key
 *
 * @param key - Unique key
 * @returns Current count or 0 if not exists
 */
export async function getCount(key: string): Promise<number> {
  if (!redis) return 0;

  try {
    const count = await redis.get<number>(key);
    return count || 0;
  } catch (error) {
    console.error('Redis get count error:', error);
    return 0;
  }
}

/**
 * Delete a key
 *
 * @param key - Key to delete
 */
export async function deleteKey(key: string): Promise<void> {
  if (!redis) return;

  try {
    await redis.del(key);
  } catch (error) {
    console.error('Redis delete error:', error);
  }
}

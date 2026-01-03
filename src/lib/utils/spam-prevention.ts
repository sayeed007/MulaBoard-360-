import { checkRateLimit } from '@/lib/redis/client';
import connectDB from '@/lib/db/connect';
import FeedbackAttempt from '@/lib/db/models/FeedbackAttempt';
import { hashIP } from './hash';

/**
 * Spam Prevention Utilities
 *
 * Implements multi-layer spam prevention:
 * 1. Fingerprint uniqueness (one submission per user per review period)
 * 2. IP rate limiting (5 submissions per hour)
 * 3. Fingerprint rate limiting (10 submissions per hour)
 */

export interface EligibilityCheck {
  allowed: boolean;
  reason?: string;
  message?: string;
}

/**
 * Check if a user can submit feedback
 *
 * @param fingerprint - Browser fingerprint from FingerprintJS
 * @param ipAddress - User's IP address (will be hashed)
 * @param targetUserId - Target user ID
 * @param reviewPeriodId - Review period ID
 * @returns Eligibility result
 */
export async function canSubmitFeedback(
  fingerprint: string,
  ipAddress: string,
  targetUserId: string,
  reviewPeriodId: string
): Promise<EligibilityCheck> {
  try {
    await connectDB();

    // Hash IP for privacy
    const ipHash = hashIP(ipAddress);

    // 1. Check if already submitted (fingerprint + targetUser + reviewPeriod)
    const existingAttempt = await FeedbackAttempt.findOne({
      fingerprint,
      targetUser: targetUserId,
      reviewPeriod: reviewPeriodId,
      status: 'submitted',
    });

    if (existingAttempt) {
      return {
        allowed: false,
        reason: 'already_submitted',
        message: 'You have already submitted feedback for this user in this review period.',
      };
    }

    // 2. Check IP rate limit (5 per hour)
    const ipRateLimit = await checkRateLimit(`feedback:ip:${ipHash}`, 5, 3600);

    if (!ipRateLimit.success) {
      const resetTime = new Date(ipRateLimit.reset);
      return {
        allowed: false,
        reason: 'ip_rate_limit',
        message: `Too many submissions from your network. Please try again at ${resetTime.toLocaleTimeString()}.`,
      };
    }

    // 3. Check fingerprint rate limit (10 per hour)
    const fingerprintRateLimit = await checkRateLimit(
      `feedback:fingerprint:${fingerprint}`,
      10,
      3600
    );

    if (!fingerprintRateLimit.success) {
      const resetTime = new Date(fingerprintRateLimit.reset);
      return {
        allowed: false,
        reason: 'fingerprint_rate_limit',
        message: `You're submitting feedback too quickly. Please try again at ${resetTime.toLocaleTimeString()}.`,
      };
    }

    // All checks passed
    return {
      allowed: true,
    };
  } catch (error) {
    console.error('Eligibility check error:', error);
    // On error, block the submission for safety
    return {
      allowed: false,
      reason: 'error',
      message: 'An error occurred while checking eligibility. Please try again.',
    };
  }
}

/**
 * Record a feedback attempt
 *
 * @param fingerprint - Browser fingerprint
 * @param ipAddress - User's IP address (will be hashed)
 * @param targetUserId - Target user ID
 * @param reviewPeriodId - Review period ID
 * @param status - Attempt status (submitted, blocked)
 * @param blockReason - Reason for blocking (if applicable)
 */
export async function recordFeedbackAttempt(
  fingerprint: string,
  ipAddress: string,
  targetUserId: string,
  reviewPeriodId: string,
  status: 'submitted' | 'blocked' = 'submitted',
  blockReason?: string
): Promise<void> {
  try {
    await connectDB();

    const ipHash = hashIP(ipAddress);

    await FeedbackAttempt.create({
      fingerprint,
      ipHash,
      targetUser: targetUserId,
      reviewPeriod: reviewPeriodId,
      status,
      blockReason,
    });
  } catch (error) {
    console.error('Record attempt error:', error);
    // Don't throw, just log
  }
}

/**
 * Validate submission timing (honeypot detection)
 *
 * @param formLoadTime - When the form was loaded (timestamp)
 * @param minSeconds - Minimum seconds required (default 30)
 * @returns True if timing is valid
 */
export function validateSubmissionTiming(
  formLoadTime: number,
  minSeconds: number = 30
): boolean {
  const now = Date.now();
  const elapsed = (now - formLoadTime) / 1000;

  return elapsed >= minSeconds;
}

/**
 * Validate honeypot field (should be empty)
 *
 * @param honeypotValue - Value of the honeypot field
 * @returns True if valid (empty)
 */
export function validateHoneypot(honeypotValue: string | undefined): boolean {
  return !honeypotValue || honeypotValue.trim() === '';
}

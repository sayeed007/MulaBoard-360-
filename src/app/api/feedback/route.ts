import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import connectDB from '@/lib/db/connect';
import Feedback from '@/lib/db/models/Feedback';
import User from '@/lib/db/models/User';
import ReviewPeriod from '@/lib/db/models/ReviewPeriod';
import { feedbackSubmissionSchema } from '@/validators/feedback';
import {
  canSubmitFeedback,
  recordFeedbackAttempt,
  validateSubmissionTiming,
  validateHoneypot,
} from '@/lib/utils/spam-prevention';
import { calculateMulaRatingFromRatings, calculateAverageScore } from '@/lib/utils/mula-calculator';

/**
 * POST /api/feedback
 *
 * Submit anonymous feedback (public endpoint with spam prevention)
 */
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    const {
      targetUserId,
      reviewPeriodId,
      fingerprint,
      formLoadTime,
      ratings,
      strengths,
      improvements,
      honeypot,
      confirmation,
    } = body;

    // 1. Validate honeypot (should be empty)
    if (!validateHoneypot(honeypot)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid submission detected',
        },
        { status: 400 }
      );
    }

    // 2. Validate submission timing (min 30 seconds)
    if (!validateSubmissionTiming(formLoadTime)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Form submitted too quickly. Please take your time to provide thoughtful feedback.',
        },
        { status: 400 }
      );
    }

    // 3. Validate with Zod
    const validatedData = feedbackSubmissionSchema.safeParse({
      ratings,
      strengths,
      improvements,
      honeypot,
      confirmation,
    });

    if (!validatedData.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          details: validatedData.error.issues,
        },
        { status: 400 }
      );
    }

    // 4. Get IP address
    const ipAddress =
      request.headers.get('x-forwarded-for')?.split(',')[0] ||
      request.headers.get('x-real-ip') ||
      '127.0.0.1';

    // 5. Check eligibility (fingerprint uniqueness + rate limits)
    const eligibility = await canSubmitFeedback(
      fingerprint,
      ipAddress,
      targetUserId,
      reviewPeriodId
    );

    if (!eligibility.allowed) {
      // Record blocked attempt
      await recordFeedbackAttempt(
        fingerprint,
        ipAddress,
        targetUserId,
        reviewPeriodId,
        'blocked',
        eligibility.reason
      );

      return NextResponse.json(
        {
          success: false,
          error: eligibility.message || 'You are not eligible to submit feedback',
        },
        { status: 403 }
      );
    }

    // 6. Connect to database
    await connectDB();

    // 7. Verify target user exists
    const targetUser = await User.findById(targetUserId);
    if (!targetUser) {
      return NextResponse.json(
        {
          success: false,
          error: 'User not found',
        },
        { status: 404 }
      );
    }

    // 8. Verify review period exists and is active
    const period = await ReviewPeriod.findById(reviewPeriodId);
    if (!period) {
      return NextResponse.json(
        {
          success: false,
          error: 'Review period not found',
        },
        { status: 404 }
      );
    }

    if (!period.isActive) {
      return NextResponse.json(
        {
          success: false,
          error: 'This review period is no longer active',
        },
        { status: 400 }
      );
    }

    // 9. Calculate Mula rating
    const mulaRating = calculateMulaRatingFromRatings(validatedData.data.ratings);

    // 10. Create feedback
    const feedback = await Feedback.create({
      targetUser: targetUserId,
      reviewPeriod: reviewPeriodId,
      reviewerFingerprint: fingerprint,
      reviewerIpHash: crypto
        .createHash('sha256')
        .update(ipAddress)
        .digest('hex'),
      ratings: validatedData.data.ratings,
      strengths: validatedData.data.strengths,
      improvements: validatedData.data.improvements,
      mulaRating,
      visibility: 'private', // Default to private, user can change later
      moderation: {
        status: 'pending',
      },
    });

    // 11. Record successful attempt
    await recordFeedbackAttempt(
      fingerprint,
      ipAddress,
      targetUserId,
      reviewPeriodId,
      'submitted'
    );

    // 12. Return success
    return NextResponse.json(
      {
        success: true,
        message: 'Feedback submitted successfully!',
        data: {
          id: feedback._id,
          mulaRating,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Feedback submission error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'An error occurred while submitting feedback. Please try again.',
      },
      { status: 500 }
    );
  }
}

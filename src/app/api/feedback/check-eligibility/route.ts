import { NextRequest, NextResponse } from 'next/server';
import { canSubmitFeedback } from '@/lib/utils/spam-prevention';

/**
 * POST /api/feedback/check-eligibility
 *
 * Check if a user is eligible to submit feedback
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fingerprint, targetUserId, reviewPeriodId } = body;

    // Validate required fields
    if (!fingerprint || !targetUserId || !reviewPeriodId) {
      return NextResponse.json(
        {
          allowed: false,
          message: 'Missing required fields',
        },
        { status: 400 }
      );
    }

    // Get IP address
    const ipAddress =
      request.headers.get('x-forwarded-for')?.split(',')[0] ||
      request.headers.get('x-real-ip') ||
      '127.0.0.1';

    // Check eligibility
    const eligibility = await canSubmitFeedback(
      fingerprint,
      ipAddress,
      targetUserId,
      reviewPeriodId
    );

    return NextResponse.json(eligibility, { status: 200 });
  } catch (error) {
    console.error('Eligibility check error:', error);

    return NextResponse.json(
      {
        allowed: false,
        message: 'An error occurred while checking eligibility',
      },
      { status: 500 }
    );
  }
}

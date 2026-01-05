'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { feedbackSubmissionSchema, type FeedbackSubmissionInput } from '@/validators/feedback';
import { RATING_CATEGORIES } from '@/lib/constants/ratings';
import { useFingerprint } from '@/hooks/useFingerprint';
import RatingCategory from './RatingCategory';
import type { User } from '@/types/user';

/**
 * Feedback Form Component
 *
 * Main feedback submission form with spam prevention and validation
 */

interface FeedbackFormProps {
  targetUser: User;
  reviewPeriodId: string;
}

export default function FeedbackForm({
  targetUser,
  reviewPeriodId,
}: FeedbackFormProps) {
  const router = useRouter();
  const { fingerprint, loading: fingerprintLoading } = useFingerprint();

  const [error, setError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingEligibility, setIsCheckingEligibility] = useState(true);
  const [eligibilityError, setEligibilityError] = useState<string>('');
  const [confirmation, setConfirmation] = useState(false);

  // Track form load time for spam prevention
  const formLoadTime = useRef(Date.now());

  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FeedbackSubmissionInput>({
    resolver: zodResolver(feedbackSubmissionSchema),
    defaultValues: {
      ratings: {
        workQuality: { score: 0, comment: '' },
        communication: { score: 0, comment: '' },
        teamBehavior: { score: 0, comment: '' },
        accountability: { score: 0, comment: '' },
        overall: { score: 0, comment: '' },
      },
      strengths: '',
      improvements: '',
      website: '',
    },
  });

  const watchedStrengths = watch('strengths');
  const watchedImprovements = watch('improvements');

  // Check eligibility when fingerprint is ready
  useEffect(() => {
    async function checkEligibility() {
      if (!fingerprint) return;

      setIsCheckingEligibility(true);

      try {
        const response = await fetch('/api/feedback/check-eligibility', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            fingerprint,
            targetUserId: targetUser._id,
            reviewPeriodId,
          }),
        });

        const result = await response.json();

        if (!result.allowed) {
          setEligibilityError(result.message || 'You are not eligible to submit feedback');
        }

        setIsCheckingEligibility(false);
      } catch (err) {
        setEligibilityError('Failed to check eligibility. Please try again.');
        setIsCheckingEligibility(false);
      }
    }

    checkEligibility();
  }, [fingerprint, targetUser._id, reviewPeriodId]);

  const onSubmit = async (data: FeedbackSubmissionInput) => {
    if (!fingerprint) {
      setError('Unable to verify your identity. Please refresh and try again.');
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          targetUserId: targetUser._id,
          reviewPeriodId,
          fingerprint,
          formLoadTime: formLoadTime.current,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || 'Failed to submit feedback');
        setIsSubmitting(false);
        return;
      }

      // Redirect to thank you page
      router.push(`/${targetUser.publicSlug}/thank-you`);
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      setIsSubmitting(false);
    }
  };

  // Loading state
  if (fingerprintLoading || isCheckingEligibility) {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <div className="bg-card rounded-lg shadow-lg p-12 border text-center">
          <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-muted-foreground">Preparing feedback form...</p>
        </div>
      </div>
    );
  }

  // Eligibility error
  if (eligibilityError) {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <div className="bg-destructive/10 rounded-lg p-8 border border-destructive/20">
          <div className="text-center">
            <div className="text-6xl mb-4">🚫</div>
            <h2 className="text-2xl font-bold mb-2">Unable to Submit Feedback</h2>
            <p className="text-destructive">{eligibilityError}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Header */}
        <div className="bg-card rounded-lg shadow-lg p-8 border">
          <h1 className="text-3xl font-bold mb-2">
            Give Feedback to {targetUser.fullName}
          </h1>
          <p className="text-muted-foreground">
            Your feedback is anonymous and helps {targetUser.fullName.split(' ')[0]} grow professionally.
          </p>
        </div>

        {error && (
          <div className="rounded-md bg-destructive/10 p-4 text-sm text-destructive border border-destructive/20">
            {error}
          </div>
        )}

        {/* Rating Categories */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Rate Performance</h2>
          {RATING_CATEGORIES.map((category) => (
            <Controller
              key={category.key}
              name={`ratings.${category.key as keyof FeedbackSubmissionInput['ratings']}`}
              control={control}
              render={({ field, fieldState }) => (
                <RatingCategory
                  category={category}
                  score={field.value.score}
                  comment={field.value.comment || ''}
                  onScoreChange={(score) => field.onChange({ ...field.value, score })}
                  onCommentChange={(comment) => field.onChange({ ...field.value, comment })}
                  disabled={isSubmitting}
                  error={fieldState.error?.message}
                />
              )}
            />
          ))}
        </div>

        {/* Strengths */}
        <div className="bg-card rounded-lg shadow-lg p-8 border space-y-4">
          <h2 className="text-2xl font-bold">What are their strengths?</h2>
          <p className="text-sm text-muted-foreground">
            Share specific examples of what they do well (minimum 20 characters)
          </p>
          <textarea
            {...register('strengths')}
            disabled={isSubmitting}
            rows={4}
            maxLength={500}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none ${
              errors.strengths ? 'border-destructive' : 'border-input'
            }`}
            placeholder="Example: Great at explaining complex concepts, always willing to help team members..."
          />
          <div className="flex justify-between items-center">
            <div>
              {errors.strengths && (
                <p className="text-sm text-destructive">{errors.strengths.message}</p>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {watchedStrengths?.length || 0}/500
            </p>
          </div>
        </div>

        {/* Improvements */}
        <div className="bg-card rounded-lg shadow-lg p-8 border space-y-4">
          <h2 className="text-2xl font-bold">What could they improve?</h2>
          <p className="text-sm text-muted-foreground">
            Provide constructive feedback for growth (minimum 20 characters)
          </p>
          <textarea
            {...register('improvements')}
            disabled={isSubmitting}
            rows={4}
            maxLength={500}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none ${
              errors.improvements ? 'border-destructive' : 'border-input'
            }`}
            placeholder="Example: Could improve time management, would benefit from more documentation..."
          />
          <div className="flex justify-between items-center">
            <div>
              {errors.improvements && (
                <p className="text-sm text-destructive">{errors.improvements.message}</p>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {watchedImprovements?.length || 0}/500
            </p>
          </div>
        </div>

        {/* Honeypot (hidden field for spam prevention) */}
        <input
          type="text"
          {...register('website')}
          className="hidden"
          tabIndex={-1}
          autoComplete="off"
        />

        {/* Confirmation */}
        <div className="bg-card rounded-lg shadow-lg p-8 border space-y-4">
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="confirmation"
              checked={confirmation}
              onChange={(e) => setConfirmation(e.target.checked)}
              disabled={isSubmitting}
              className="mt-1 w-5 h-5 rounded border-input focus:ring-2 focus:ring-primary cursor-pointer"
            />
            <label htmlFor="confirmation" className="flex-1 text-sm cursor-pointer">
              I confirm that this feedback is honest, constructive, and respectful. I understand that while my identity is anonymous, my feedback will be visible to {targetUser.fullName}.
            </label>
          </div>
          {!confirmation && error && (
            <p className="text-sm text-destructive ml-8">Please confirm before submitting</p>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-primary text-primary-foreground py-4 rounded-lg font-medium text-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Anonymous Feedback'}
          </button>
        </div>

        {/* Privacy Notice */}
        <div className="bg-muted/50 rounded-lg p-4 text-sm text-muted-foreground border">
          <p className="font-medium mb-2">🔒 Your Privacy is Protected</p>
          <ul className="space-y-1 ml-4">
            <li>• Your feedback is completely anonymous</li>
            <li>• We don't store your name, email, or any identifying information</li>
            <li>• Advanced spam prevention ensures one submission per person</li>
          </ul>
        </div>
      </form>
    </div>
  );
}

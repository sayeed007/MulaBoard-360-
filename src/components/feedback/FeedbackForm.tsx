'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { feedbackSubmissionSchema, type FeedbackSubmissionInput } from '@/validators/feedback';
import { RATING_CATEGORIES } from '@/lib/constants/ratings';
import { useFingerprint } from '@/hooks/useFingerprint';
import { Button, Logo, Textarea } from '@/components/ui';
import RatingCategory from './RatingCategory';
import type { User } from '@/types/user';

/**
 * Feedback Form Component
 *
 * Main feedback submission form with spam prevention and validation
 */

interface ReviewPeriod {
  _id: string;
  name: string;
  startDate: string;
  endDate: string;
  theme: {
    name: string;
    primaryEmoji: string;
    backgroundColor?: string;
  };
}

interface FeedbackFormProps {
  targetUser: User;
  reviewPeriod: ReviewPeriod;
}

export default function FeedbackForm({
  targetUser,
  reviewPeriod,
}: FeedbackFormProps) {
  const router = useRouter();
  const { fingerprint, loading: fingerprintLoading } = useFingerprint();

  const [error, setError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingEligibility, setIsCheckingEligibility] = useState(true);
  const [eligibilityError, setEligibilityError] = useState<string>('');

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
      honeypot: '',
      confirmation: false,
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
            reviewPeriodId: reviewPeriod._id,
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
  }, [fingerprint, targetUser._id, reviewPeriod._id]);

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
          reviewPeriodId: reviewPeriod._id,
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
    <div className="max-w-4xl mx-auto px-4 py-6 md:p-8">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 md:space-y-8">
        {/* Header */}
        <div className="bg-card rounded-lg shadow-lg p-6 md:p-8 border">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">
            Give Feedback to {targetUser.fullName}
          </h1>
          <p className="text-muted-foreground mb-4 text-sm md:text-base">
            Your feedback is anonymous and helps {targetUser.fullName.split(' ')[0]} grow professionally.
          </p>

          {/* Review Period Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-2 md:px-4 bg-primary/10 border border-primary/20 rounded-lg text-sm">
            {/* <span className="text-xl md:text-2xl">{reviewPeriod.theme.primaryEmoji}</span> */}
            <Logo />
            <div className="flex flex-col md:block">
              <span className="font-semibold text-primary">{reviewPeriod.name}</span>
              <span className="text-muted-foreground md:ml-2 text-xs md:text-sm">
                <span className="hidden md:inline">• </span>
                {new Date(reviewPeriod.startDate).toLocaleDateString()} - {new Date(reviewPeriod.endDate).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {error && (
          <div className="rounded-md bg-destructive/10 p-4 text-sm text-destructive border border-destructive/20">
            {error}
          </div>
        )}

        {/* Rating Categories */}
        <div className="space-y-6">
          <h2 className="text-xl md:text-2xl font-bold">Rate Performance</h2>
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
        <div className="bg-card rounded-lg shadow-lg p-6 md:p-8 border space-y-4">
          <h2 className="text-xl md:text-2xl font-bold">What are their strengths?</h2>
          <p className="text-sm text-muted-foreground">
            Share specific examples of what they do well (minimum 20 characters)
          </p>
          <Textarea
            {...register('strengths')}
            disabled={isSubmitting}
            rows={4}
            maxLength={500}
            fullWidth
            error={errors.strengths?.message}
            placeholder="Example: Great at explaining complex concepts, always willing to help team members..."
            helperText={`${watchedStrengths?.length || 0}/500`}
          />
        </div>

        {/* Improvements */}
        <div className="bg-card rounded-lg shadow-lg p-6 md:p-8 border space-y-4">
          <h2 className="text-xl md:text-2xl font-bold">What could they improve?</h2>
          <p className="text-sm text-muted-foreground">
            Provide constructive feedback for growth (minimum 20 characters)
          </p>
          <Textarea
            {...register('improvements')}
            disabled={isSubmitting}
            rows={4}
            maxLength={500}
            fullWidth
            error={errors.improvements?.message}
            placeholder="Example: Could improve time management, would benefit from more documentation..."
            helperText={`${watchedImprovements?.length || 0}/500`}
          />
        </div>

        {/* Honeypot (hidden field for spam prevention) */}
        <input
          type="text"
          {...register('honeypot')}
          className="hidden"
          tabIndex={-1}
          autoComplete="off"
        />

        {/* Confirmation */}
        <div className="bg-card rounded-lg shadow-lg p-6 md:p-8 border space-y-4">
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="confirmation"
              {...register('confirmation')}
              disabled={isSubmitting}
              className="mt-1 w-5 h-5 rounded border-input focus:ring-2 focus:ring-primary cursor-pointer"
            />
            <label htmlFor="confirmation" className="flex-1 text-sm cursor-pointer">
              I confirm that this feedback is honest, constructive, and respectful. I understand that while my identity is anonymous, my feedback will be visible to {targetUser.fullName}.
            </label>
          </div>
          {errors.confirmation && (
            <p className="text-sm text-destructive ml-8">{errors.confirmation.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex gap-4">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 py-6 text-lg"
            variant="primary"
            size="lg"
            isLoading={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Anonymous Feedback'}
          </Button>
        </div>

        {/* Privacy Notice */}
        <div className="bg-muted/50 rounded-lg p-4 text-sm text-muted-foreground border">
          <p className="font-medium mb-2">🔒 Your Privacy is Protected</p>
          <ul className="space-y-1 ml-4">
            <li>• Your feedback is completely anonymous</li>
            <li>• We don&rsquo;t store your name, email, or any identifying information</li>
            <li>• Advanced spam prevention ensures one submission per person</li>
          </ul>
        </div>
      </form>
    </div>
  );
}

import { z } from 'zod';

/**
 * Feedback Validation Schemas
 */

// Rating Category Schema (1-5 with optional comment)
const ratingCategorySchema = z.object({
  score: z
    .number()
    .min(1, 'Rating must be at least 1')
    .max(5, 'Rating cannot exceed 5')
    .int('Rating must be a whole number'),

  comment: z
    .string()
    .max(500, 'Comment cannot exceed 500 characters')
    .trim()
    .optional()
    .or(z.literal('')),
});

// Feedback Ratings Schema (all 5 categories)
const feedbackRatingsSchema = z.object({
  workQuality: ratingCategorySchema,
  communication: ratingCategorySchema,
  teamBehavior: ratingCategorySchema,
  accountability: ratingCategorySchema,
  overall: ratingCategorySchema,
});

// Feedback Submission Schema
export const feedbackSubmissionSchema = z.object({
  // Target information
  targetUser: z.string().min(1, 'Target user is required'),
  reviewPeriod: z.string().min(1, 'Review period is required'),

  // Ratings
  ratings: feedbackRatingsSchema,

  // Required text feedback
  strengths: z
    .string()
    .min(20, 'Strengths must be at least 20 characters')
    .max(500, 'Strengths cannot exceed 500 characters')
    .trim(),

  improvements: z
    .string()
    .min(20, 'Areas for improvement must be at least 20 characters')
    .max(500, 'Areas for improvement cannot exceed 500 characters')
    .trim(),

  // Spam prevention fields
  fingerprint: z.string().min(1, 'Browser fingerprint is required'),
  ipHash: z.string().min(1, 'IP hash is required'),

  // hCaptcha token
  hCaptchaToken: z.string().min(1, 'Please complete the CAPTCHA'),

  // Honeypot field (should be empty)
  website: z.string().max(0, 'Invalid submission').optional().or(z.literal('')),

  // Form timing (minimum 30 seconds)
  formLoadTime: z.number().positive('Invalid form load time'),
});

export type FeedbackSubmissionInput = z.infer<typeof feedbackSubmissionSchema>;

// Feedback Update Schema (for employees to update their received feedback)
export const updateFeedbackVisibilitySchema = z.object({
  visibility: z.enum(['private', 'public'], {
    errorMap: () => ({ message: 'Visibility must be either private or public' }),
  }),
});

export type UpdateFeedbackVisibilityInput = z.infer<typeof updateFeedbackVisibilitySchema>;

// Employee Reaction Schema
export const updateFeedbackReactionSchema = z.object({
  reaction: z.enum(['thanks', 'noted', 'ouch', 'fair_enough'], {
    errorMap: () => ({ message: 'Invalid reaction type' }),
  }),
});

export type UpdateFeedbackReactionInput = z.infer<typeof updateFeedbackReactionSchema>;

// Feedback Moderation Schema (for admins)
export const moderateFeedbackSchema = z.object({
  status: z.enum(['pending', 'approved', 'flagged'], {
    errorMap: () => ({ message: 'Invalid moderation status' }),
  }),

  moderationNote: z
    .string()
    .max(500, 'Moderation note cannot exceed 500 characters')
    .trim()
    .optional()
    .or(z.literal('')),

  // If editing content
  editedStrengths: z
    .string()
    .min(20, 'Strengths must be at least 20 characters')
    .max(500, 'Strengths cannot exceed 500 characters')
    .trim()
    .optional(),

  editedImprovements: z
    .string()
    .min(20, 'Improvements must be at least 20 characters')
    .max(500, 'Improvements cannot exceed 500 characters')
    .trim()
    .optional(),

  removedFields: z.array(z.string()).optional(),
});

export type ModerateFeedbackInput = z.infer<typeof moderateFeedbackSchema>;

// Feedback Eligibility Check Schema
export const feedbackEligibilitySchema = z.object({
  targetUser: z.string().min(1, 'Target user is required'),
  reviewPeriod: z.string().min(1, 'Review period is required'),
  fingerprint: z.string().min(1, 'Fingerprint is required'),
  ipHash: z.string().min(1, 'IP hash is required'),
});

export type FeedbackEligibilityInput = z.infer<typeof feedbackEligibilitySchema>;

// Feedback Query/Filter Schema
export const feedbackFilterSchema = z.object({
  targetUser: z.string().optional(),
  reviewPeriod: z.string().optional(),
  mulaRating: z.enum(['golden_mula', 'fresh_carrot', 'rotten_tomato']).optional(),
  visibility: z.enum(['private', 'public']).optional(),
  moderationStatus: z.enum(['pending', 'approved', 'flagged']).optional(),
  page: z.number().positive().optional(),
  limit: z.number().positive().max(100).optional(),
  sortBy: z.enum(['createdAt', 'mulaRating', 'visibility']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

export type FeedbackFilterInput = z.infer<typeof feedbackFilterSchema>;

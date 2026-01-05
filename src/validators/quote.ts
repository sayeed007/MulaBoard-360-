import { z } from 'zod';

/**
 * Funny Quote Validation Schemas
 */

// Create Quote Schema
export const createQuoteSchema = z.object({
  text: z
    .string()
    .min(10, 'Quote must be at least 10 characters')
    .max(500, 'Quote cannot exceed 500 characters')
    .trim(),

  textBn: z
    .string()
    .max(500, 'Bengali quote cannot exceed 500 characters')
    .trim()
    .optional()
    .or(z.literal('')),

  category: z.enum(
    ['landing', 'feedback_form', 'success', 'profile', 'admin', 'error', 'loading'],
    {
      message: 'Invalid quote category',
    }
  ),

  mood: z.enum(['funny', 'motivational', 'sarcastic', 'wise'], {
    message: 'Invalid quote mood',
  }),

  isActive: z.boolean().optional().default(true),
});

export type CreateQuoteInput = z.infer<typeof createQuoteSchema>;

// Update Quote Schema
export const updateQuoteSchema = z.object({
  text: z
    .string()
    .min(10, 'Quote must be at least 10 characters')
    .max(500, 'Quote cannot exceed 500 characters')
    .trim()
    .optional(),

  textBn: z
    .string()
    .max(500, 'Bengali quote cannot exceed 500 characters')
    .trim()
    .optional()
    .or(z.literal('')),

  category: z
    .enum(['landing', 'feedback_form', 'success', 'profile', 'admin', 'error', 'loading'], {
      message: 'Invalid quote category',
    })
    .optional(),

  mood: z
    .enum(['funny', 'motivational', 'sarcastic', 'wise'], {
      message: 'Invalid quote mood',
    })
    .optional(),

  isActive: z.boolean().optional(),
});

export type UpdateQuoteInput = z.infer<typeof updateQuoteSchema>;

// Get Random Quote Schema
export const getRandomQuoteSchema = z.object({
  category: z.enum(
    ['landing', 'feedback_form', 'success', 'profile', 'admin', 'error', 'loading'],
    {
      message: 'Invalid quote category',
    }
  ),

  mood: z
    .enum(['funny', 'motivational', 'sarcastic', 'wise'], {
      message: 'Invalid quote mood',
    })
    .optional(),
});

export type GetRandomQuoteInput = z.infer<typeof getRandomQuoteSchema>;

// Quote Filter Schema
export const quoteFilterSchema = z.object({
  category: z
    .enum(['landing', 'feedback_form', 'success', 'profile', 'admin', 'error', 'loading'])
    .optional(),

  mood: z.enum(['funny', 'motivational', 'sarcastic', 'wise']).optional(),

  isActive: z.boolean().optional(),

  page: z.number().positive().optional(),

  limit: z.number().positive().max(100).optional(),

  sortBy: z.enum(['createdAt', 'displayCount', 'category', 'mood']).optional(),

  sortOrder: z.enum(['asc', 'desc']).optional(),
});

export type QuoteFilterInput = z.infer<typeof quoteFilterSchema>;

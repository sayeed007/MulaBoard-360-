import { z } from 'zod';

/**
 * Review Period Validation Schemas
 */

// Create Review Period Schema
export const createPeriodSchema = z
  .object({
    name: z
      .string()
      .min(3, 'Period name must be at least 3 characters')
      .max(100, 'Period name cannot exceed 100 characters')
      .trim(),

    slug: z
      .string()
      .min(3, 'Slug must be at least 3 characters')
      .max(50, 'Slug cannot exceed 50 characters')
      .regex(
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        'Slug can only contain lowercase letters, numbers, and hyphens'
      )
      .trim()
      .toLowerCase(),

    startDate: z.string().datetime('Please provide a valid start date'),

    endDate: z.string().datetime('Please provide a valid end date'),

    themeName: z
      .string()
      .min(3, 'Theme name must be at least 3 characters')
      .max(100, 'Theme name cannot exceed 100 characters')
      .trim()
      .default('The Mula Season'),

    themeEmoji: z
      .string()
      .max(10, 'Emoji cannot exceed 10 characters')
      .default('🌿'),

    themeBackgroundColor: z
      .string()
      .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Please provide a valid hex color code')
      .optional()
      .default('#f0fdf4'),

    isActive: z.boolean().optional().default(false),
  })
  .refine(
    (data) => {
      const start = new Date(data.startDate);
      const end = new Date(data.endDate);
      return end > start;
    },
    {
      message: 'End date must be after start date',
      path: ['endDate'],
    }
  );

export type CreatePeriodInput = z.infer<typeof createPeriodSchema>;

// Update Review Period Schema
export const updatePeriodSchema = z
  .object({
    name: z
      .string()
      .min(3, 'Period name must be at least 3 characters')
      .max(100, 'Period name cannot exceed 100 characters')
      .trim()
      .optional(),

    startDate: z.string().datetime('Please provide a valid start date').optional(),

    endDate: z.string().datetime('Please provide a valid end date').optional(),

    isActive: z.boolean().optional(),

    themeName: z
      .string()
      .min(3, 'Theme name must be at least 3 characters')
      .max(100, 'Theme name cannot exceed 100 characters')
      .trim()
      .optional(),

    themeEmoji: z
      .string()
      .max(10, 'Emoji cannot exceed 10 characters')
      .optional(),

    themeBackgroundColor: z
      .string()
      .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Please provide a valid hex color code')
      .optional(),
  })
  .refine(
    (data) => {
      if (data.startDate && data.endDate) {
        const start = new Date(data.startDate);
        const end = new Date(data.endDate);
        return end > start;
      }
      return true;
    },
    {
      message: 'End date must be after start date',
      path: ['endDate'],
    }
  );

export type UpdatePeriodInput = z.infer<typeof updatePeriodSchema>;

// Activate Period Schema
export const activatePeriodSchema = z.object({
  periodId: z.string().min(1, 'Period ID is required'),
});

export type ActivatePeriodInput = z.infer<typeof activatePeriodSchema>;

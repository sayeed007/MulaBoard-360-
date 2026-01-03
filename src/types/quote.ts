/**
 * Funny Quote Types
 */

export type QuoteCategory =
  | 'landing'
  | 'feedback_form'
  | 'success'
  | 'profile'
  | 'admin'
  | 'error'
  | 'loading';

export type QuoteMood = 'funny' | 'motivational' | 'sarcastic' | 'wise';

export interface FunnyQuote {
  _id: string;
  text: string;
  textBn?: string;
  category: QuoteCategory;
  mood: QuoteMood;
  isActive: boolean;
  displayCount: number;
  createdAt: string;
  updatedAt: string;
  hasBengaliVersion?: boolean; // Virtual field
}

// Form data types
export interface CreateQuoteFormData {
  text: string;
  textBn?: string;
  category: QuoteCategory;
  mood: QuoteMood;
}

export interface UpdateQuoteFormData extends CreateQuoteFormData {
  isActive: boolean;
}

// Quote categories with descriptions
export const QUOTE_CATEGORIES: Record<QuoteCategory, { label: string; description: string }> = {
  landing: {
    label: 'Landing Page',
    description: 'Shown on the homepage hero section',
  },
  feedback_form: {
    label: 'Feedback Form',
    description: 'Displayed while giving feedback',
  },
  success: {
    label: 'Success Page',
    description: 'Shown after successful feedback submission',
  },
  profile: {
    label: 'Profile/Empty State',
    description: 'Shown on profiles or when no data is available',
  },
  admin: {
    label: 'Admin Dashboard',
    description: 'Displayed in the admin panel',
  },
  error: {
    label: 'Error Pages',
    description: 'Shown on error pages (404, 500, etc.)',
  },
  loading: {
    label: 'Loading States',
    description: 'Displayed during loading/processing',
  },
};

// Quote moods with descriptions
export const QUOTE_MOODS: Record<QuoteMood, { label: string; emoji: string }> = {
  funny: {
    label: 'Funny',
    emoji: '😄',
  },
  motivational: {
    label: 'Motivational',
    emoji: '💪',
  },
  sarcastic: {
    label: 'Sarcastic',
    emoji: '😏',
  },
  wise: {
    label: 'Wise',
    emoji: '🧠',
  },
};

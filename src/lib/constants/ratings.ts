import type { MulaRating } from '@/types/feedback';

/**
 * Mula Rating System
 *
 * The core gamification element of MulaBoard
 */

export const MULA_RATINGS = {
  golden_mula: {
    label: 'Golden Mula',
    emoji: '🌿✨',
    description: 'Outstanding performance! You\'re a star!',
    color: '#FFD700',
    bgColor: '#FFF9E6',
    minScore: 4.5,
    maxScore: 5.0,
    animation: 'sparkle',
  },
  fresh_carrot: {
    label: 'Fresh Carrot',
    emoji: '🥕',
    description: 'Good work! Keep it up!',
    color: '#FF8C00',
    bgColor: '#FFF3E6',
    minScore: 3.0,
    maxScore: 4.49,
    animation: 'bounce',
  },
  rotten_tomato: {
    label: 'Rotten Tomato',
    emoji: '🍅💀',
    description: 'Room for improvement. Let\'s work on this!',
    color: '#DC2626',
    bgColor: '#FEE2E2',
    minScore: 1.0,
    maxScore: 2.99,
    animation: 'shake',
  },
} as const;

/**
 * Rating category configuration
 */
export const RATING_CATEGORIES = [
  {
    key: 'communication',
    label: 'Communication Skills',
    description: 'How well does this person communicate?',
    emoji: '💬',
  },
  {
    key: 'teamwork',
    label: 'Teamwork & Collaboration',
    description: 'How well do they work with others?',
    emoji: '🤝',
  },
  {
    key: 'technical',
    label: 'Technical Skills',
    description: 'How strong are their technical abilities?',
    emoji: '⚙️',
  },
  {
    key: 'problemSolving',
    label: 'Problem Solving',
    description: 'How effective are they at solving problems?',
    emoji: '🧩',
  },
  {
    key: 'attitude',
    label: 'Work Attitude & Initiative',
    description: 'How positive and proactive are they?',
    emoji: '🚀',
  },
] as const;

/**
 * Rating scale (1-5)
 */
export const RATING_SCALE = [
  { value: 1, label: 'Poor', emoji: '😢' },
  { value: 2, label: 'Below Average', emoji: '😕' },
  { value: 3, label: 'Average', emoji: '😐' },
  { value: 4, label: 'Good', emoji: '😊' },
  { value: 5, label: 'Excellent', emoji: '🤩' },
] as const;

/**
 * Employee reactions to feedback
 */
export const FEEDBACK_REACTIONS = {
  thanks: {
    label: 'Thanks! 🙏',
    emoji: '🙏',
    description: 'I appreciate this feedback',
  },
  noted: {
    label: 'Noted 📝',
    emoji: '📝',
    description: 'I\'ve taken note of this',
  },
  ouch: {
    label: 'Ouch! 😬',
    emoji: '😬',
    description: 'This one stings a bit',
  },
  fair_enough: {
    label: 'Fair Enough ✅',
    emoji: '✅',
    description: 'This is a fair assessment',
  },
} as const;

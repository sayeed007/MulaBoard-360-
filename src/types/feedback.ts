/**
 * Feedback Types
 */

export type MulaRating = 'golden_mula' | 'fresh_carrot' | 'rotten_tomato';

export type EmployeeReaction = 'thanks' | 'noted' | 'ouch' | 'fair_enough';

export type ModerationStatus = 'pending' | 'approved' | 'flagged';

export type FeedbackVisibility = 'private' | 'public';

export interface RatingCategory {
  score: number; // 1-5
  comment?: string;
}

export interface FeedbackRatings {
  workQuality: RatingCategory;
  communication: RatingCategory;
  teamBehavior: RatingCategory;
  accountability: RatingCategory;
  overall: RatingCategory;
}

export interface ModerationInfo {
  status: ModerationStatus;
  moderatedBy?: string;
  moderatedAt?: string;
  removedFields?: string[];
  originalContent?: Record<string, string>;
  moderationNote?: string;
}

export interface Feedback {
  _id: string;
  targetUser: string;
  reviewPeriod: string;
  ratings: FeedbackRatings;
  strengths: string;
  improvements: string;
  mulaRating: MulaRating;
  visibility: FeedbackVisibility;
  moderation: ModerationInfo;
  employeeReaction?: EmployeeReaction;
  createdAt: string;
  updatedAt: string;
}

export interface PopulatedFeedback extends Omit<Feedback, 'targetUser' | 'reviewPeriod'> {
  targetUser: {
    _id: string;
    fullName: string;
    publicSlug: string;
  };
  reviewPeriod: {
    _id: string;
    name: string;
    slug: string;
  };
}

// Form data types
export interface FeedbackFormData {
  targetUser: string;
  reviewPeriod: string;
  ratings: FeedbackRatings;
  strengths: string;
  improvements: string;
}

export interface FeedbackSubmissionData extends FeedbackFormData {
  fingerprint: string;
  ipHash: string;
  hCaptchaToken: string;
}

// Statistics types
export interface FeedbackStats {
  golden_mula: number;
  fresh_carrot: number;
  rotten_tomato: number;
  total: number;
}

export interface AverageRatings {
  workQuality: number;
  communication: number;
  teamBehavior: number;
  accountability: number;
  overall: number;
  count: number;
}

export interface UserFeedbackSummary {
  stats: FeedbackStats;
  averages: AverageRatings;
  feedbacks: Feedback[];
}

// Mula Rating Definitions
export interface MulaRatingDefinition {
  emoji: string;
  label: string;
  labelBn: string;
  description: string;
  descriptionBn: string;
  scoreRange: [number, number];
  color: string;
  bgColor: string;
  animation: string;
}

export const MULA_RATINGS: Record<MulaRating, MulaRatingDefinition> = {
  golden_mula: {
    emoji: '🌿',
    label: 'Golden Mula',
    labelBn: 'সোনার মুলা',
    description: 'Outstanding performer!',
    descriptionBn: 'অসাধারণ পারফরমার!',
    scoreRange: [4.5, 5.0],
    color: '#FFD700',
    bgColor: '#FEF9C3',
    animation: 'sparkle',
  },
  fresh_carrot: {
    emoji: '🥕',
    label: 'Fresh Carrot',
    labelBn: 'টাটকা গাজর',
    description: 'Solid contributor!',
    descriptionBn: 'ভালো অবদানকারী!',
    scoreRange: [3.0, 4.4],
    color: '#FF6B35',
    bgColor: '#FED7AA',
    animation: 'bounce',
  },
  rotten_tomato: {
    emoji: '🍅',
    label: 'Rotten Tomato',
    labelBn: 'পচা টমেটো',
    description: 'Room for growth...',
    descriptionBn: 'উন্নতির সুযোগ আছে...',
    scoreRange: [1.0, 2.9],
    color: '#DC2626',
    bgColor: '#FECACA',
    animation: 'shake',
  },
};

// Employee Reactions
export interface EmployeeReactionDefinition {
  emoji: string;
  label: string;
  labelBn: string;
  description: string;
}

export const EMPLOYEE_REACTIONS: Record<EmployeeReaction, EmployeeReactionDefinition> = {
  thanks: {
    emoji: '🙏',
    label: 'Thanks!',
    labelBn: 'ধন্যবাদ!',
    description: 'Appreciating the feedback',
  },
  noted: {
    emoji: '📝',
    label: 'Noted!',
    labelBn: 'নোট করলাম!',
    description: 'Will keep in mind',
  },
  ouch: {
    emoji: '😅',
    label: 'Ouch, but fair!',
    labelBn: 'আউচ, তবে ঠিকই আছে!',
    description: 'Honest self-reflection',
  },
  fair_enough: {
    emoji: '🤷',
    label: 'Fair enough!',
    labelBn: 'ঠিক আছে!',
    description: 'Accepting the feedback',
  },
};

/**
 * Achievement Badges System
 *
 * Gamification badges based on feedback performance
 */

export interface Badge {
  id: string;
  name: string;
  description: string;
  emoji: string;
  category: 'excellence' | 'consistency' | 'improvement' | 'participation';
  condition: {
    type: string;
    value: number | string;
  };
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  color: string;
}

export const BADGES: Badge[] = [
  // Excellence Badges
  {
    id: 'golden_streak',
    name: 'Golden Streak',
    description: 'Received 5+ Golden Mulas in a single review period',
    emoji: '🌿✨',
    category: 'excellence',
    condition: {
      type: 'golden_mula_count_per_period',
      value: 5,
    },
    rarity: 'epic',
    color: '#FFD700',
  },
  {
    id: 'perfectionist',
    name: 'The Perfectionist',
    description: 'Achieved a perfect 5.0 average score in a review period',
    emoji: '💯',
    category: 'excellence',
    condition: {
      type: 'perfect_average_score',
      value: 5.0,
    },
    rarity: 'legendary',
    color: '#9333EA',
  },
  {
    id: 'all_rounder',
    name: 'All-Rounder',
    description: 'Scored 4+ in all rating categories',
    emoji: '🎯',
    category: 'excellence',
    condition: {
      type: 'all_categories_above',
      value: 4.0,
    },
    rarity: 'rare',
    color: '#3B82F6',
  },

  // Consistency Badges
  {
    id: 'rising_star',
    name: 'Rising Star',
    description: 'Received feedback from 10+ different colleagues',
    emoji: '⭐',
    category: 'consistency',
    condition: {
      type: 'unique_reviewers_count',
      value: 10,
    },
    rarity: 'rare',
    color: '#F59E0B',
  },
  {
    id: 'team_favorite',
    name: 'Team Favorite',
    description: 'Maintained 80%+ Golden/Fresh ratings across 3 periods',
    emoji: '💚',
    category: 'consistency',
    condition: {
      type: 'positive_rating_streak',
      value: 3,
    },
    rarity: 'epic',
    color: '#10B981',
  },

  // Improvement Badges
  {
    id: 'growth_mindset',
    name: 'Growth Mindset',
    description: 'Improved average score by 0.5+ points between periods',
    emoji: '📈',
    category: 'improvement',
    condition: {
      type: 'score_improvement',
      value: 0.5,
    },
    rarity: 'rare',
    color: '#8B5CF6',
  },
  {
    id: 'comeback_king',
    name: 'Comeback Champion',
    description: 'Turned around from Rotten Tomato to Golden Mula',
    emoji: '👑',
    category: 'improvement',
    condition: {
      type: 'rating_turnaround',
      value: 'rotten_to_golden',
    },
    rarity: 'legendary',
    color: '#EC4899',
  },

  // Participation Badges
  {
    id: 'first_feedback',
    name: 'Breaking the Ice',
    description: 'Received your first feedback',
    emoji: '🎊',
    category: 'participation',
    condition: {
      type: 'feedback_count',
      value: 1,
    },
    rarity: 'common',
    color: '#6366F1',
  },
];

/**
 * Badge rarity details
 */
export const BADGE_RARITY = {
  common: {
    label: 'Common',
    color: '#9CA3AF',
    bgColor: '#F3F4F6',
  },
  rare: {
    label: 'Rare',
    color: '#3B82F6',
    bgColor: '#DBEAFE',
  },
  epic: {
    label: 'Epic',
    color: '#8B5CF6',
    bgColor: '#EDE9FE',
  },
  legendary: {
    label: 'Legendary',
    color: '#F59E0B',
    bgColor: '#FEF3C7',
  },
} as const;

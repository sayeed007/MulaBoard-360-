import { BADGES, type Badge } from '@/lib/constants/badges';
import type { Feedback, MulaRating } from '@/types/feedback';

/**
 * Badge Calculator
 *
 * Determines which badges a user has earned based on their feedback stats
 */

export interface UserStats {
  totalFeedback: number;
  feedbacksByPeriod: Map<string, Feedback[]>;
  goldenMulaCount: number;
  freshCarrotCount: number;
  rottenTomatoCount: number;
  averageScore: number;
  categoryAverages: {
    communication: number;
    teamwork: number;
    technical: number;
    problemSolving: number;
    attitude: number;
  };
  uniqueReviewers: number;
  periodHistory: {
    periodId: string;
    averageScore: number;
    dominantRating: MulaRating;
  }[];
}

/**
 * Check if a user has earned a specific badge
 *
 * @param badge - Badge to check
 * @param stats - User's feedback stats
 * @returns True if earned
 */
export function hasBadge(badge: Badge, stats: UserStats): boolean {
  const { condition } = badge;

  switch (condition.type) {
    case 'feedback_count':
      return stats.totalFeedback >= (condition.value as number);

    case 'golden_mula_count_per_period':
      // Check if any period has enough golden mulas
      return Array.from(stats.feedbacksByPeriod.values()).some((feedbacks) => {
        const goldenCount = feedbacks.filter((f) => f.mulaRating === 'golden_mula').length;
        return goldenCount >= (condition.value as number);
      });

    case 'perfect_average_score':
      // Check if any period has perfect 5.0 average
      return stats.periodHistory.some((period) => period.averageScore === 5.0);

    case 'all_categories_above':
      // All category averages must be above threshold
      const threshold = condition.value as number;
      return Object.values(stats.categoryAverages).every((avg) => avg >= threshold);

    case 'unique_reviewers_count':
      return stats.uniqueReviewers >= (condition.value as number);

    case 'positive_rating_streak':
      // Check last N periods for 80%+ positive ratings
      const streakLength = condition.value as number;
      const recentPeriods = stats.periodHistory.slice(-streakLength);

      if (recentPeriods.length < streakLength) return false;

      return recentPeriods.every((period) => {
        const periodFeedbacks = stats.feedbacksByPeriod.get(period.periodId) || [];
        const positiveCount = periodFeedbacks.filter(
          (f) => f.mulaRating === 'golden_mula' || f.mulaRating === 'fresh_carrot'
        ).length;
        const positivePercentage = (positiveCount / periodFeedbacks.length) * 100;
        return positivePercentage >= 80;
      });

    case 'score_improvement':
      // Check if improved by threshold between last 2 periods
      if (stats.periodHistory.length < 2) return false;

      const latestPeriod = stats.periodHistory[stats.periodHistory.length - 1];
      const previousPeriod = stats.periodHistory[stats.periodHistory.length - 2];

      const improvement = latestPeriod.averageScore - previousPeriod.averageScore;
      return improvement >= (condition.value as number);

    case 'rating_turnaround':
      // Check if went from rotten tomato to golden mula between consecutive periods
      if (stats.periodHistory.length < 2) return false;

      const latest = stats.periodHistory[stats.periodHistory.length - 1];
      const previous = stats.periodHistory[stats.periodHistory.length - 2];

      return previous.dominantRating === 'rotten_tomato' && latest.dominantRating === 'golden_mula';

    default:
      return false;
  }
}

/**
 * Calculate all earned badges for a user
 *
 * @param stats - User's feedback stats
 * @returns Array of earned badges
 */
export function calculateEarnedBadges(stats: UserStats): Badge[] {
  return BADGES.filter((badge) => hasBadge(badge, stats));
}

/**
 * Get progress towards a specific badge
 *
 * @param badge - Badge to check progress for
 * @param stats - User's feedback stats
 * @returns Progress percentage (0-100)
 */
export function getBadgeProgress(badge: Badge, stats: UserStats): number {
  const { condition } = badge;

  switch (condition.type) {
    case 'feedback_count':
      const target = condition.value as number;
      return Math.min((stats.totalFeedback / target) * 100, 100);

    case 'golden_mula_count_per_period':
      // Progress based on current period's golden mulas
      const currentPeriod = Array.from(stats.feedbacksByPeriod.values())[0] || [];
      const goldenCount = currentPeriod.filter((f) => f.mulaRating === 'golden_mula').length;
      const targetGolden = condition.value as number;
      return Math.min((goldenCount / targetGolden) * 100, 100);

    case 'unique_reviewers_count':
      const targetReviewers = condition.value as number;
      return Math.min((stats.uniqueReviewers / targetReviewers) * 100, 100);

    default:
      // For other badges, just return 0 or 100
      return hasBadge(badge, stats) ? 100 : 0;
  }
}

import type { MulaRating, FeedbackRatings } from '@/types/feedback';
import { MULA_RATINGS } from '@/lib/constants/ratings';

/**
 * Mula Rating Calculator
 *
 * Calculates Mula ratings based on average scores
 */

/**
 * Calculate average score from feedback ratings
 *
 * @param ratings - Feedback ratings object
 * @returns Average score (1-5)
 */
export function calculateAverageScore(ratings: FeedbackRatings): number {
  const scores = [
    ratings.workQuality.score,
    ratings.communication.score,
    ratings.teamBehavior.score,
    ratings.accountability.score,
    ratings.overall.score,
  ];

  const sum = scores.reduce((acc, score) => acc + score, 0);
  const average = sum / scores.length;

  // Round to 2 decimal places
  return Math.round(average * 100) / 100;
}

/**
 * Calculate Mula rating from average score
 *
 * @param averageScore - Average score (1-5)
 * @returns Mula rating (golden_mula, fresh_carrot, rotten_tomato)
 */
export function calculateMulaRating(averageScore: number): MulaRating {
  if (averageScore >= MULA_RATINGS.golden_mula.minScore) {
    return 'golden_mula';
  } else if (averageScore >= MULA_RATINGS.fresh_carrot.minScore) {
    return 'fresh_carrot';
  } else {
    return 'rotten_tomato';
  }
}

/**
 * Calculate Mula rating from feedback ratings
 *
 * @param ratings - Feedback ratings object
 * @returns Mula rating
 */
export function calculateMulaRatingFromRatings(
  ratings: FeedbackRatings
): MulaRating {
  const average = calculateAverageScore(ratings);
  return calculateMulaRating(average);
}

/**
 * Get Mula rating details
 *
 * @param rating - Mula rating
 * @returns Rating details (label, emoji, color, etc.)
 */
export function getMulaRatingDetails(rating: MulaRating) {
  return MULA_RATINGS[rating];
}

/**
 * Get personalized message for Mula rating
 *
 * @param rating - Mula rating
 * @param recipientName - Name of the person receiving feedback
 * @returns Personalized message
 */
export function getMulaMessage(
  rating: MulaRating,
  recipientName: string
): string {
  const messages = {
    golden_mula: [
      `${recipientName} is shining bright like a golden mula! ✨`,
      `Outstanding work, ${recipientName}! Keep up the excellence! 🌿`,
      `${recipientName} is crushing it! Golden mula all the way! 🏆`,
    ],
    fresh_carrot: [
      `${recipientName} is doing great! Fresh carrot vibes! 🥕`,
      `Good job, ${recipientName}! Keep growing! 🌱`,
      `${recipientName} is on the right track! Keep it up! 👍`,
    ],
    rotten_tomato: [
      `${recipientName}, there's room to grow. Let's work on this together! 💪`,
      `${recipientName}, we believe in your potential! Time to level up! 🚀`,
      `${recipientName}, every expert was once a beginner. Keep learning! 📚`,
    ],
  };

  const options = messages[rating];
  return options[Math.floor(Math.random() * options.length)];
}

/**
 * Calculate aggregate Mula rating from multiple feedbacks
 *
 * @param feedbacks - Array of feedback objects with mulaRating field
 * @returns Aggregate Mula rating distribution
 */
export function calculateAggregateRatings(feedbacks: { mulaRating: MulaRating }[]): {
  golden_mula: number;
  fresh_carrot: number;
  rotten_tomato: number;
  total: number;
  percentage: {
    golden_mula: number;
    fresh_carrot: number;
    rotten_tomato: number;
  };
  dominant: MulaRating;
} {
  const counts = {
    golden_mula: 0,
    fresh_carrot: 0,
    rotten_tomato: 0,
  };

  feedbacks.forEach((feedback) => {
    counts[feedback.mulaRating]++;
  });

  const total = feedbacks.length;

  const percentage = {
    golden_mula: total > 0 ? Math.round((counts.golden_mula / total) * 100) : 0,
    fresh_carrot: total > 0 ? Math.round((counts.fresh_carrot / total) * 100) : 0,
    rotten_tomato: total > 0 ? Math.round((counts.rotten_tomato / total) * 100) : 0,
  };

  // Determine dominant rating
  let dominant: MulaRating = 'fresh_carrot';
  let maxCount = counts.fresh_carrot;

  if (counts.golden_mula > maxCount) {
    dominant = 'golden_mula';
    maxCount = counts.golden_mula;
  }
  if (counts.rotten_tomato > maxCount) {
    dominant = 'rotten_tomato';
  }

  return {
    ...counts,
    total,
    percentage,
    dominant,
  };
}

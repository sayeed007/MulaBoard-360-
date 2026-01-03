'use client';

import { getMulaRatingDetails } from '@/lib/utils/mula-calculator';
import type { MulaRating } from '@/types/feedback';

/**
 * Stats Cards Component
 *
 * Displays Mula rating distribution with counts and percentages
 */

interface StatsCardsProps {
  stats: {
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
  };
}

export default function StatsCards({ stats }: StatsCardsProps) {
  const ratings: MulaRating[] = ['golden_mula', 'fresh_carrot', 'rotten_tomato'];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {ratings.map((rating) => {
        const details = getMulaRatingDetails(rating);
        const count = stats[rating];
        const percentage = stats.percentage[rating];

        return (
          <div
            key={rating}
            className={`
              bg-card rounded-lg shadow-lg p-6 border-2 transition-transform hover:scale-105
              ${stats.dominant === rating ? 'border-primary' : 'border-border'}
            `}
            style={{
              backgroundColor: details.bgColor,
            }}
          >
            {/* Icon and Label */}
            <div className="flex items-center gap-3 mb-4">
              <span className={`text-5xl animate-${details.animation}`}>
                {details.emoji}
              </span>
              <div className="flex-1">
                <h3
                  className="text-lg font-bold"
                  style={{ color: details.color }}
                >
                  {details.label}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {details.description}
                </p>
              </div>
            </div>

            {/* Count */}
            <div className="text-center">
              <div
                className="text-5xl font-bold mb-2"
                style={{ color: details.color }}
              >
                {count}
              </div>
              <div className="text-sm text-muted-foreground">
                {percentage}% of total feedback
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-4 bg-muted/50 rounded-full h-2 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${percentage}%`,
                  backgroundColor: details.color,
                }}
              />
            </div>

            {/* Dominant Badge */}
            {stats.dominant === rating && stats.total > 0 && (
              <div className="mt-4 text-center">
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary/20 text-primary rounded-full text-xs font-medium">
                  <span>🏆</span>
                  <span>Dominant Rating</span>
                </span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

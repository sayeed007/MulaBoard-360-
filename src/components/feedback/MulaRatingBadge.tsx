import type { MulaRating } from '@/types/feedback';
import { getMulaRatingDetails } from '@/lib/utils/mula-calculator';

/**
 * Mula Rating Badge Component
 *
 * Displays Mula rating with emoji, label, and animation
 */

interface MulaRatingBadgeProps {
  rating: MulaRating;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export default function MulaRatingBadge({
  rating,
  size = 'md',
  showLabel = true,
}: MulaRatingBadgeProps) {
  const details = getMulaRatingDetails(rating);

  const sizeClasses = {
    sm: 'text-2xl px-3 py-1.5',
    md: 'text-4xl px-4 py-2',
    lg: 'text-6xl px-6 py-3',
  };

  const labelSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  return (
    <div className="inline-flex flex-col items-center gap-2">
      <div
        className={`
          inline-flex items-center gap-2 rounded-lg font-bold
          ${sizeClasses[size]}
          animate-${details.animation}
        `}
        style={{
          backgroundColor: details.bgColor,
          color: details.color,
        }}
      >
        <span>{details.emoji}</span>
        {showLabel && size !== 'sm' && <span>{details.label}</span>}
      </div>
      {showLabel && size === 'sm' && (
        <span className={`${labelSizeClasses[size]} font-medium`} style={{ color: details.color }}>
          {details.label}
        </span>
      )}
    </div>
  );
}

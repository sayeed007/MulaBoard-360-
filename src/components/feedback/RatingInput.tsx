'use client';

import { useState } from 'react';
import { RATING_SCALE } from '@/lib/constants/ratings';

/**
 * Rating Input Component
 *
 * Interactive 1-5 rating input with emoji feedback
 */

interface RatingInputProps {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
  name?: string;
}

export default function RatingInput({
  value,
  onChange,
  disabled = false,
  name,
}: RatingInputProps) {
  const [hoveredValue, setHoveredValue] = useState<number | null>(null);

  const displayValue = hoveredValue !== null ? hoveredValue : value;
  const displayLabel =
    RATING_SCALE.find((r) => r.value === displayValue)?.label || '';

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        {RATING_SCALE.map((rating) => {
          const isSelected = value === rating.value;
          const isHovered = hoveredValue === rating.value;
          const isBeforeSelected = rating.value <= value;
          const isBeforeHovered =
            hoveredValue !== null && rating.value <= hoveredValue;

          return (
            <button
              key={rating.value}
              type="button"
              name={name}
              onClick={() => !disabled && onChange(rating.value)}
              onMouseEnter={() => !disabled && setHoveredValue(rating.value)}
              onMouseLeave={() => !disabled && setHoveredValue(null)}
              disabled={disabled}
              className={`
                text-4xl p-2 rounded-lg transition-all duration-200
                ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:scale-125'}
                ${isSelected || isHovered ? 'scale-125' : 'scale-100'}
                ${
                  isBeforeHovered || (hoveredValue === null && isBeforeSelected)
                    ? 'opacity-100'
                    : 'opacity-30'
                }
              `}
              aria-label={`${rating.label} - ${rating.value} stars`}
              title={rating.label}
            >
              {rating.emoji}
            </button>
          );
        })}
      </div>

      {/* Display label */}
      {displayValue > 0 && (
        <div className="text-sm font-medium text-center text-muted-foreground">
          {displayLabel}
        </div>
      )}
    </div>
  );
}

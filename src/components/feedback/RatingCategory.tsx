'use client';

import RatingInput from './RatingInput';

/**
 * Rating Category Component
 *
 * Single rating category with score and optional comment
 */

interface RatingCategoryProps {
  category: {
    key: string;
    label: string;
    description: string;
    emoji: string;
  };
  score: number;
  comment: string;
  onScoreChange: (score: number) => void;
  onCommentChange: (comment: string) => void;
  disabled?: boolean;
  error?: string;
}

export default function RatingCategory({
  category,
  score,
  comment,
  onScoreChange,
  onCommentChange,
  disabled = false,
  error,
}: RatingCategoryProps) {
  const maxCommentLength = 200;

  return (
    <div className="space-y-4 p-6 bg-card rounded-lg border">
      {/* Category Header */}
      <div className="flex items-start gap-3">
        <span className="text-3xl">{category.emoji}</span>
        <div className="flex-1">
          <h3 className="font-semibold text-lg">{category.label}</h3>
          <p className="text-sm text-muted-foreground">{category.description}</p>
        </div>
      </div>

      {/* Rating Input */}
      <div>
        <label className="block text-sm font-medium mb-2">
          How would you rate this? *
        </label>
        <RatingInput
          value={score}
          onChange={onScoreChange}
          disabled={disabled}
          name={`${category.key}-score`}
        />
        {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
      </div>

      {/* Optional Comment */}
      <div>
        <label
          htmlFor={`${category.key}-comment`}
          className="block text-sm font-medium mb-2"
        >
          Additional comments{' '}
          <span className="text-muted-foreground font-normal">(Optional)</span>
        </label>
        <textarea
          id={`${category.key}-comment`}
          value={comment}
          onChange={(e) => onCommentChange(e.target.value)}
          disabled={disabled}
          maxLength={maxCommentLength}
          rows={2}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
          placeholder="Any specific examples or suggestions?"
        />
        <div className="mt-1 text-xs text-muted-foreground text-right">
          {comment.length}/{maxCommentLength}
        </div>
      </div>
    </div>
  );
}

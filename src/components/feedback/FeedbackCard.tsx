import { formatRelativeTime } from '@/lib/utils/helpers';
import type { Feedback } from '@/types/feedback';
import MulaRatingBadge from './MulaRatingBadge';
import { RATING_CATEGORIES } from '@/lib/constants/ratings';

/**
 * Feedback Card Component
 *
 * Displays a single feedback with ratings and comments
 */

interface FeedbackCardProps {
  feedback: Feedback;
  isOwner?: boolean;
  onToggleVisibility?: () => void;
  onReaction?: (reaction: string) => void;
}

export default function FeedbackCard({
  feedback,
  isOwner = false,
  onToggleVisibility,
  onReaction,
}: FeedbackCardProps) {
  return (
    <div className="bg-card rounded-lg shadow-lg p-6 border space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <MulaRatingBadge rating={feedback.mulaRating} size="md" />
          <p className="text-sm text-muted-foreground mt-2">
            {formatRelativeTime(new Date(feedback.createdAt))}
          </p>
        </div>
        {isOwner && (
          <div className="flex gap-2">
            <button
              onClick={onToggleVisibility}
              className="px-3 py-1.5 text-sm bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors"
            >
              {feedback.visibility === 'public' ? '👁️ Public' : '🔒 Private'}
            </button>
          </div>
        )}
      </div>

      {/* Rating Breakdown */}
      <div className="space-y-3">
        <h3 className="font-semibold">Rating Breakdown</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {RATING_CATEGORIES.map((category) => {
            const rating = feedback.ratings[category.key as keyof typeof feedback.ratings];
            return (
              <div key={category.key} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{category.emoji}</span>
                  <span className="text-sm font-medium">{category.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold">{rating.score}</span>
                  <span className="text-sm text-muted-foreground">/5</span>
                </div>
              </div>
            );
          })}
        </div>
        <div className="p-3 bg-primary/10 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="font-semibold">Average Score</span>
            <span className="text-xl font-bold text-primary">
              {feedback.averageScore?.toFixed(2) || 'N/A'} / 5.00
            </span>
          </div>
        </div>
      </div>

      {/* Strengths */}
      <div className="space-y-2">
        <h3 className="font-semibold flex items-center gap-2">
          <span>💪</span>
          <span>Strengths</span>
        </h3>
        <p className="text-muted-foreground bg-muted/30 p-4 rounded-lg">
          {feedback.strengths}
        </p>
      </div>

      {/* Improvements */}
      <div className="space-y-2">
        <h3 className="font-semibold flex items-center gap-2">
          <span>📈</span>
          <span>Areas for Improvement</span>
        </h3>
        <p className="text-muted-foreground bg-muted/30 p-4 rounded-lg">
          {feedback.improvements}
        </p>
      </div>

      {/* Category Comments */}
      <div className="space-y-3">
        <h3 className="font-semibold">Specific Comments</h3>
        {RATING_CATEGORIES.filter(
          (cat) => feedback.ratings[cat.key as keyof typeof feedback.ratings]?.comment
        ).map((category) => {
          const rating = feedback.ratings[category.key as keyof typeof feedback.ratings];
          return (
            <div key={category.key} className="p-3 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">{category.emoji}</span>
                <span className="text-sm font-medium">{category.label}</span>
              </div>
              <p className="text-sm text-muted-foreground ml-7">
                {rating.comment}
              </p>
            </div>
          );
        })}
        {RATING_CATEGORIES.every(
          (cat) => !feedback.ratings[cat.key as keyof typeof feedback.ratings]?.comment
        ) && (
          <p className="text-sm text-muted-foreground italic">No specific comments provided</p>
        )}
      </div>

      {/* Employee Reaction (if owner has reacted) */}
      {isOwner && feedback.employeeReaction && (
        <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
          <p className="text-sm font-medium">
            Your reaction: {feedback.employeeReaction}
          </p>
        </div>
      )}

      {/* Reaction Buttons (if owner) */}
      {isOwner && !feedback.employeeReaction && onReaction && (
        <div className="space-y-2">
          <p className="text-sm font-medium">How do you feel about this feedback?</p>
          <div className="flex gap-2 flex-wrap">
            {['Thanks! 🙏', 'Noted 📝', 'Ouch! 😬', 'Fair Enough ✅'].map((reaction) => (
              <button
                key={reaction}
                onClick={() => onReaction(reaction)}
                className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors text-sm"
              >
                {reaction}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

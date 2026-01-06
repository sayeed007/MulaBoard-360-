'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import MulaRatingIcon from './MulaRatingIcon';
import { Button, Badge } from '@/components/ui';
import Image from 'next/image';

interface InteractiveFeedbackCardProps {
  feedback: {
    _id: string;
    mulaRating: 'golden_mula' | 'fresh_carrot' | 'rotten_tomato';
    ratings: {
      workQuality?: { score: number; comment?: string };
      communication?: { score: number; comment?: string };
      teamBehavior?: { score: number; comment?: string };
      accountability?: { score: number; comment?: string };
      overall?: { score: number; comment?: string };
    };
    strengths: string;
    improvements: string;
    visibility: 'private' | 'public';
    createdAt: string;
  };
}

export default function InteractiveFeedbackCard({ feedback }: InteractiveFeedbackCardProps) {
  const [visibility, setVisibility] = useState<'private' | 'public'>(feedback.visibility);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleVisibilityToggle = async () => {
    setIsUpdating(true);
    const newVisibility = visibility === 'private' ? 'public' : 'private';

    try {
      const response = await fetch(`/api/feedback/${feedback._id}/visibility`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ visibility: newVisibility }),
      });

      const data = await response.json();

      if (data.success) {
        setVisibility(newVisibility);
      } else {
        alert('Failed to update visibility: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error updating visibility:', error);
      alert('An error occurred while updating visibility.');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md rounded-2xl p-6 border border-zinc-200/50 dark:border-zinc-700/50 shadow-sm hover:shadow-xl hover:scale-[1.01] hover:bg-white/90 dark:hover:bg-zinc-900/90 transition-all duration-300">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-shrink-0">
          <MulaRatingIcon rating={feedback.mulaRating} size={64} />
        </div>
        <div className="flex flex-col items-end gap-2">
          <Badge variant={visibility === 'public' ? 'success' : 'default'}>
            {visibility === 'public' ? '🌍 Public' : '🔒 Private'}
          </Badge>
          <span className="text-xs text-muted-foreground">
            {new Date(feedback.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>

      {/* Rating Summary */}
      <div className="space-y-2 mb-4">
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Work Quality</span>
            <span className="font-medium">{feedback.ratings.workQuality?.score || 0}/5</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Communication</span>
            <span className="font-medium">{feedback.ratings.communication?.score || 0}/5</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Team Behavior</span>
            <span className="font-medium">{feedback.ratings.teamBehavior?.score || 0}/5</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Accountability</span>
            <span className="font-medium">{feedback.ratings.accountability?.score || 0}/5</span>
          </div>
          <div className="col-span-2 pt-2 border-t border-border/50 flex justify-between font-semibold">
            <span>Overall</span>
            <span>{feedback.ratings.overall?.score || 0}/5</span>
          </div>
        </div>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="space-y-4 mb-4 animate-slide-up">
          <div className="pt-4 border-t border-border/50">
            <h4 className="text-sm font-semibold mb-2 text-green-600 dark:text-green-400">💪 Strengths</h4>
            <p className="text-sm text-foreground/80 bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
              {feedback.strengths || <span className="text-muted-foreground italic">No Comment</span>}
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-2 text-blue-600 dark:text-blue-400">🎯 Areas for Improvement</h4>
            <p className="text-sm text-foreground/80 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
              {feedback.improvements || <span className="text-muted-foreground italic">No Comment</span>}
            </p>
          </div>

          {/* Specific Rating Comments */}
          <div className="pt-2">
            <h4 className="text-sm font-semibold mb-3">📝 Detailed Ratings</h4>
            <div className="grid gap-3 text-sm">
              {[
                { label: 'Work Quality', data: feedback.ratings.workQuality },
                { label: 'Communication', data: feedback.ratings.communication },
                { label: 'Team Behavior', data: feedback.ratings.teamBehavior },
                { label: 'Accountability', data: feedback.ratings.accountability },
              ].map((item) => (
                <div key={item.label} className="bg-muted/30 p-3 rounded-lg">
                  <div className="flex justify-between font-medium mb-1">
                    <span>{item.label}</span>
                    <span>{item.data?.score || 0}/5</span>
                  </div>
                  <p className="text-muted-foreground text-xs">
                    {item.data?.comment || <span className="italic opacity-70">No specific comment</span>}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2 mt-4">
        <Button
          variant="ghost"
          size="sm"
          className="flex-1"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? '▲ Hide Details' : '▼ View Details'}
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={handleVisibilityToggle}
          disabled={isUpdating}
        >
          {isUpdating ? 'Updating...' : visibility === 'private' ? '🌍 Make Public' : '🔒 Make Private'}
        </Button>
      </div>
    </div>
  );
}

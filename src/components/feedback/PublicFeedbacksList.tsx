'use client';

import InteractiveFeedbackCard from './InteractiveFeedbackCard';
import { Badge } from '@/components/ui/Badge';
import type { MulaRating, EmployeeReaction } from '@/lib/db/models/Feedback';

interface PublicFeedback {
    _id: string;
    ratings: {
        workQuality: { score: number; comment?: string };
        communication: { score: number; comment?: string };
        teamBehavior: { score: number; comment?: string };
        accountability: { score: number; comment?: string };
        overall: { score: number; comment?: string };
    };
    strengths: string;
    improvements: string;
    mulaRating: MulaRating;
    employeeReaction?: EmployeeReaction;
    reviewPeriod: {
        name: string;
        slug: string;
    } | null;
    createdAt: string;
    visibility: 'private' | 'public';
}

interface PublicFeedbacksListProps {
    feedbacks: PublicFeedback[];
    userName: string;
}

const REACTION_EMOJIS: Record<EmployeeReaction, { emoji: string; label: string }> = {
    thanks: { emoji: '🙏', label: 'Thanks!' },
    noted: { emoji: '📝', label: 'Noted!' },
    ouch: { emoji: '😅', label: 'Ouch, but fair!' },
    fair_enough: { emoji: '🤷', label: 'Fair enough!' },
};

export default function PublicFeedbacksList({ feedbacks, userName }: PublicFeedbacksListProps) {
    if (feedbacks.length === 0) {
        return (
            <div className="bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md rounded-2xl p-12 border border-white/10 shadow-sm text-center">
                <div className="text-5xl mb-4">📭</div>
                <h3 className="text-xl font-bold mb-2">No Public Feedback Yet</h3>
                <p className="text-muted-foreground">
                    {userName} hasn&apos;t made any feedback public yet.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">
                    Public Feedback ({feedbacks.length})
                </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {feedbacks.map((feedback) => {
                    // Create custom header badges for review period and employee reaction
                    const customBadges = (
                        <div className="flex items-center gap-2 flex-wrap">
                            {feedback.reviewPeriod && (
                                <Badge variant="info" className="text-xs">
                                    {feedback.reviewPeriod.name}
                                </Badge>
                            )}
                            {feedback.employeeReaction && (
                                <Badge variant="default" className="text-sm">
                                    {REACTION_EMOJIS[feedback.employeeReaction].emoji}{' '}
                                    {REACTION_EMOJIS[feedback.employeeReaction].label}
                                </Badge>
                            )}
                        </div>
                    );

                    return (
                        <InteractiveFeedbackCard
                            key={feedback._id}
                            feedback={feedback}
                            customActions={customBadges}
                            hideVisibilityToggle={true}
                        />
                    );
                })}
            </div>
        </div>
    );
}

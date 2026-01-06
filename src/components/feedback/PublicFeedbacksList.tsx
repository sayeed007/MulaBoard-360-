'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import MulaRatingBadge from './MulaRatingBadge';
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
    const [expandedFeedback, setExpandedFeedback] = useState<string | null>(null);

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

    const toggleExpand = (id: string) => {
        setExpandedFeedback(expandedFeedback === id ? null : id);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const renderStars = (score: number) => {
        return (
            <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className={i < score ? 'text-yellow-500' : 'text-gray-300'}>
                        ⭐
                    </span>
                ))}
            </div>
        );
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">
                    Public Feedback ({feedbacks.length})
                </h2>
            </div>

            <div className="space-y-4">
                {feedbacks.map((feedback) => {
                    const isExpanded = expandedFeedback === feedback._id;

                    return (
                        <Card key={feedback._id} className="overflow-hidden">
                            <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <MulaRatingBadge rating={feedback.mulaRating} size="lg" />
                                            {feedback.reviewPeriod && (
                                                <Badge variant="info" className="text-xs">
                                                    {feedback.reviewPeriod.name}
                                                </Badge>
                                            )}
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                            {formatDate(feedback.createdAt)}
                                        </p>
                                    </div>

                                    {feedback.employeeReaction && (
                                        <Badge variant="default" className="text-sm">
                                            {REACTION_EMOJIS[feedback.employeeReaction].emoji}{' '}
                                            {REACTION_EMOJIS[feedback.employeeReaction].label}
                                        </Badge>
                                    )}
                                </div>
                            </CardHeader>

                            <CardContent className="pt-6">
                                {/* Ratings Breakdown */}
                                <div className="mb-6">
                                    <h4 className="text-sm font-semibold mb-3">Ratings Breakdown</h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-muted-foreground">Work Quality</span>
                                            {renderStars(feedback.ratings.workQuality.score)}
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-muted-foreground">Communication</span>
                                            {renderStars(feedback.ratings.communication.score)}
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-muted-foreground">Team Behavior</span>
                                            {renderStars(feedback.ratings.teamBehavior.score)}
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-muted-foreground">Accountability</span>
                                            {renderStars(feedback.ratings.accountability.score)}
                                        </div>
                                        <div className="flex items-center justify-between sm:col-span-2">
                                            <span className="text-sm font-medium">Overall</span>
                                            {renderStars(feedback.ratings.overall.score)}
                                        </div>
                                    </div>
                                </div>

                                {/* Strengths */}
                                <div className="mb-4">
                                    <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                                        <span className="text-green-500">✓</span> Strengths
                                    </h4>
                                    <p className={`text-sm text-muted-foreground ${!isExpanded && feedback.strengths.length > 200 ? 'line-clamp-3' : ''}`}>
                                        {feedback.strengths}
                                    </p>
                                </div>

                                {/* Improvements */}
                                <div className="mb-4">
                                    <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                                        <span className="text-orange-500">→</span> Areas for Improvement
                                    </h4>
                                    <p className={`text-sm text-muted-foreground ${!isExpanded && feedback.improvements.length > 200 ? 'line-clamp-3' : ''}`}>
                                        {feedback.improvements}
                                    </p>
                                </div>

                                {/* Expand/Collapse Button */}
                                {(feedback.strengths.length > 200 || feedback.improvements.length > 200) && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => toggleExpand(feedback._id)}
                                        className="text-xs"
                                    >
                                        {isExpanded ? 'Show Less ↑' : 'Read More ↓'}
                                    </Button>
                                )}
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}

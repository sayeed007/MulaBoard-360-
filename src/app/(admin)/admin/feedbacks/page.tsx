import Link from 'next/link';
import { redirect } from 'next/navigation';
import MulaRatingIcon from '@/components/feedback/MulaRatingIcon';
import { getCurrentUser, hasAdminRole } from '@/lib/auth/helpers';
import connectDB from '@/lib/db/connect';
import Feedback from '@/lib/db/models/Feedback';
// Import User and ReviewPeriod for population
import '@/lib/db/models/User';
import '@/lib/db/models/ReviewPeriod';
import { Button, Badge } from '@/components/ui';

export const metadata = {
    title: 'Moderate Feedback | MulaBoard Admin',
    description: 'Approve or reject employee feedback.',
};

export default async function AdminFeedbacksPage() {
    const currentUser = await getCurrentUser();

    if (!currentUser || !hasAdminRole(currentUser.role)) {
        redirect('/dashboard');
    }

    await connectDB();

    // Fetch all feedback, sorted by newest
    const feedbacks = await Feedback.find({})
        .sort({ createdAt: -1 })
        .populate('targetUser', 'fullName email')
        .populate('reviewPeriod', 'name')
        .lean();

    return (
        <div className="space-y-8 animate-slide-up">
            {/* Header */}
            <div className="bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md rounded-2xl p-8 border border-white/20 dark:border-zinc-800 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Link href="/admin" className="text-muted-foreground hover:text-primary transition-colors">
                            Admin Dashboard
                        </Link>
                        <span className="text-muted-foreground">/</span>
                        <span className="font-semibold">Feedback</span>
                    </div>
                    <h1 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
                        Feedback Moderation
                    </h1>
                    <p className="text-muted-foreground">
                        Review and moderate {feedbacks.length} anonymous submissions.
                    </p>
                </div>
            </div>

            {/* Feedbacks Grid */}
            <div className="grid grid-cols-1 gap-6">
                {feedbacks.length > 0 ? feedbacks.map((feedback: any) => (
                    <div key={feedback._id} className="bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md rounded-2xl p-6 border border-white/20 dark:border-zinc-800 shadow-sm flex flex-col md:flex-row gap-6">
                        {/* Rating Visual */}
                        <div className="flex-shrink-0 flex flex-col items-center justify-center min-w-[100px] border-r border-border/50 pr-6">
                            <div className="mb-2">
                                <MulaRatingIcon rating={feedback.mulaRating} size={64} />
                            </div>
                            <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                {feedback.mulaRating.replace('_', ' ')}
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 space-y-4">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-semibold text-lg flex items-center gap-2">
                                        <span>To:</span>
                                        <span className="text-foreground">{feedback.targetUser?.fullName || 'Unknown User'}</span>
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        Period: {feedback.reviewPeriod?.name || 'General'} • {new Date(feedback.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    {feedback.moderation?.status === 'approved' ? (
                                        <Badge variant="success">Approved</Badge>
                                    ) : feedback.moderation?.status === 'flagged' ? (
                                        <Badge variant="danger">Flagged</Badge>
                                    ) : (
                                        <Badge variant="warning">Pending</Badge>
                                    )}
                                </div>
                            </div>

                            {feedback.comment && (
                                <div className="bg-muted/30 p-4 rounded-xl text-foreground/90 italic border border-border/50">
                                    &quot;{feedback.comment}&quot;
                                </div>
                            )}

                            {/* Ratings Breakdown (Compact) */}
                            <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                                {Object.entries(feedback.ratings).map(([key, value]: [string, any]) => (
                                    <div key={key} className="flex gap-1">
                                        <span className="capitalize">{key}:</span>
                                        <span className="font-bold text-foreground">{value.score}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col justify-center gap-2 border-l border-border/50 pl-6 min-w-[140px]">
                            {feedback.moderation?.status !== 'approved' && (
                                <Button variant="outline" size="sm" className="w-full text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900/20 border-green-200">
                                    Approve
                                </Button>
                            )}
                            {feedback.moderation?.status !== 'flagged' && (
                                <Button variant="outline" size="sm" className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 border-red-200">
                                    Flag
                                </Button>
                            )}
                            <Button variant="ghost" size="sm" className="w-full">
                                View Details
                            </Button>
                        </div>
                    </div>
                )) : (
                    <div className="text-center py-12 bg-card/50 rounded-2xl border border-dashed">
                        <p className="text-muted-foreground">No feedback submissions found.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

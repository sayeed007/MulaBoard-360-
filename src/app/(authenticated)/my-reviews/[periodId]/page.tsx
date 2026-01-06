import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/helpers';
import connectDB from '@/lib/db/connect';
import Feedback from '@/lib/db/models/Feedback';
import ReviewPeriod from '@/lib/db/models/ReviewPeriod';
import { Button } from '@/components/ui';
import MulaRatingIcon from '@/components/feedback/MulaRatingIcon';

interface ReviewDetailsPageProps {
    params: Promise<{
        periodId: string;
    }>;
}

export const metadata = {
    title: 'Review Details | MulaBoard',
    description: 'View detailed feedback for a specific period.',
};

export default async function ReviewDetailsPage({ params }: ReviewDetailsPageProps) {
    const user = await getCurrentUser();
    const { periodId } = await params;

    if (!user) {
        redirect('/login');
    }

    await connectDB();

    // Validate period ID format (basic check)
    if (!periodId.match(/^[0-9a-fA-F]{24}$/)) {
        // If not an ID, it might be a slug or invalid. For now assume ID.
        // In a real app we might handle slugs.
        redirect('/my-reviews');
    }

    const period = await ReviewPeriod.findById(periodId).lean();

    if (!period) {
        redirect('/my-reviews');
    }

    const feedbacks = await Feedback.find({
        targetUser: user.id,
        reviewPeriod: periodId,
        'moderation.status': 'approved',
    })
        .sort({ createdAt: -1 })
        .lean();

    return (
        <div className="min-h-screen pb-20 animate-slide-up">
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Header */}
                <div className="bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md rounded-2xl p-8 border border-white/20 dark:border-zinc-800 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Link href="/my-reviews" className="text-muted-foreground hover:text-primary transition-colors">
                                My Reviews
                            </Link>
                            <span className="text-muted-foreground">/</span>
                            <span className="font-semibold">{period.name}</span>
                        </div>
                        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-indigo-600">
                            {period.name}
                        </h1>
                        <p className="text-muted-foreground">
                            {period.theme?.name || 'Performance Review'}
                        </p>
                    </div>
                    <Link href="/my-reviews">
                        <Button variant="outline">Back to Overview</Button>
                    </Link>
                </div>

                {/* Feedback List */}
                <div className="space-y-6">
                    {feedbacks.length > 0 ? feedbacks.map((feedback: any) => (
                        <div key={feedback._id} className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border shadow-sm">
                            <div className="flex flex-col md:flex-row gap-6">
                                <div className="flex-shrink-0 flex flex-col items-center">
                                    <div className="mb-2">
                                        <MulaRatingIcon rating={feedback.mulaRating} size={64} />
                                    </div>
                                    <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                        {feedback.mulaRating.replace('_', ' ')}
                                    </div>
                                </div>
                                <div className="flex-1 space-y-4">
                                    {feedback.comment && (
                                        <div className="text-lg font-medium text-foreground/90 italic">
                                            &quot;{feedback.comment}&quot;
                                        </div>
                                    )}
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-border/50">
                                        {Object.entries(feedback.ratings).map(([key, value]: [string, any]) => (
                                            <div key={key}>
                                                <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{key}</div>
                                                <div className="font-bold text-lg">{value.score}/5</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )) : (
                        <div className="text-center py-12 text-muted-foreground">
                            No feedback found for this period.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

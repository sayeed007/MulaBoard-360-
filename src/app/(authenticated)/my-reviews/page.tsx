import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth/helpers';
import connectDB from '@/lib/db/connect';
import Feedback from '@/lib/db/models/Feedback';
// We need to import ReviewPeriod to ensure the model is registered for population
import '@/lib/db/models/ReviewPeriod';
import { calculateAggregateRatings } from '@/lib/utils/mula-calculator';
import { Button, Card, Badge } from '@/components/ui';

export const metadata = {
    title: 'My Reviews | MulaBoard',
    description: 'View your performance feedback and Mula ratings.',
};

export default async function MyReviewsPage() {
    const user = await getCurrentUser();

    if (!user) {
        redirect('/login');
    }

    await connectDB();

    // Fetch approved feedback for the user
    const feedbacks = await Feedback.find({
        targetUser: user.id,
        'moderation.isApproved': true,
    })
        .sort({ createdAt: -1 })
        .populate('reviewPeriod', 'name slug theme')
        .lean();

    // Calculate stats
    const aggregateStats = calculateAggregateRatings(
        feedbacks.map((f) => ({ mulaRating: f.mulaRating }))
    );

    // Group by Review Period
    const feedbackByPeriod: Record<string, typeof feedbacks> = {};
    feedbacks.forEach((f: any) => {
        const periodName = f.reviewPeriod?.name || 'Unspecified Period';
        if (!feedbackByPeriod[periodName]) {
            feedbackByPeriod[periodName] = [];
        }
        feedbackByPeriod[periodName].push(f);
    });

    return (
        <div className="min-h-screen pb-20 animate-slide-up">
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Header */}
                <div className="bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md rounded-2xl p-8 border border-white/20 dark:border-zinc-800 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-indigo-600">
                            My Reviews
                        </h1>
                        <p className="text-muted-foreground">
                            Track your growth and see what your colleagues are saying.
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Link href="/dashboard">
                            <Button variant="outline">Back to Dashboard</Button>
                        </Link>
                    </div>
                </div>

                {/* Overview Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border shadow-sm flex flex-col items-center justify-center text-center">
                        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">Total Feedback</h3>
                        <div className="text-5xl font-bold text-foreground">{feedbacks.length}</div>
                        <p className="text-xs text-muted-foreground mt-2">All time received</p>
                    </div>

                    <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border shadow-sm flex flex-col items-center justify-center text-center">
                        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">Dominant Vibe</h3>
                        <div className="text-5xl mb-2">
                            {aggregateStats.dominant === 'golden_mula' ? '🌿' :
                                aggregateStats.dominant === 'fresh_carrot' ? '🥕' : '🍅'}
                        </div>
                        <div className="text-lg font-bold capitalize">
                            {aggregateStats.dominant.replace('_', ' ')}
                        </div>
                    </div>

                    <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border shadow-sm">
                        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4 text-center">Rating Distribution</h3>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <span className="text-2xl">🌿</span>
                                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                                    <div className="h-full bg-yellow-500" style={{ width: `${aggregateStats.percentage.golden_mula}%` }}></div>
                                </div>
                                <span className="text-sm font-medium w-8 text-right">{aggregateStats.percentage.golden_mula}%</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-2xl">🥕</span>
                                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                                    <div className="h-full bg-orange-500" style={{ width: `${aggregateStats.percentage.fresh_carrot}%` }}></div>
                                </div>
                                <span className="text-sm font-medium w-8 text-right">{aggregateStats.percentage.fresh_carrot}%</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-2xl">🍅</span>
                                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                                    <div className="h-full bg-red-500" style={{ width: `${aggregateStats.percentage.rotten_tomato}%` }}></div>
                                </div>
                                <span className="text-sm font-medium w-8 text-right">{aggregateStats.percentage.rotten_tomato}%</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Reviews by Period */}
                {Object.keys(feedbackByPeriod).length > 0 ? (
                    <div className="space-y-8">
                        {Object.entries(feedbackByPeriod).map(([periodName, periodFeedbacks]) => (
                            <div key={periodName} className="space-y-4">
                                <h2 className="text-xl font-bold flex items-center gap-2">
                                    <span>📅</span> {periodName}
                                    <span className="text-sm font-normal text-muted-foreground ml-2">({periodFeedbacks.length} reviews)</span>
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {periodFeedbacks.map((feedback: any) => (
                                        <div key={feedback._id} className="bg-white/40 dark:bg-zinc-900/40 backdrop-blur-sm rounded-xl p-6 border border-white/10 dark:border-zinc-800 hover:shadow-md transition-all">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="text-4xl">
                                                    {feedback.mulaRating === 'golden_mula' ? '🌿' :
                                                        feedback.mulaRating === 'fresh_carrot' ? '🥕' : '🍅'}
                                                </div>
                                                <span className="text-xs text-muted-foreground">
                                                    {new Date(feedback.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <div className="space-y-2 mb-4">
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-muted-foreground">Communication</span>
                                                    <span className="font-medium">{feedback.ratings.communication.score}/5</span>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-muted-foreground">Teamwork</span>
                                                    <span className="font-medium">{feedback.ratings.teamwork.score}/5</span>
                                                </div>
                                            </div>
                                            {feedback.comment && (
                                                <div className="bg-muted/30 p-3 rounded-lg text-sm text-foreground/80 italic">
                                                    &quot;{feedback.comment}&quot;
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-card/30 rounded-2xl p-12 text-center border border-dashed">
                        <div className="text-6xl mb-4 grayscale opacity-50">📪</div>
                        <h3 className="text-xl font-bold mb-2">No Reviews Yet</h3>
                        <p className="text-muted-foreground mb-6">
                            You haven't received any feedback yet. Share your profile to get started!
                        </p>
                        <Link href="/profile">
                            <Button variant="primary">Go to Profile</Button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}

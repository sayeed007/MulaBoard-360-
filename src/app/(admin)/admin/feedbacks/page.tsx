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
import InteractiveFeedbackCard from '@/components/feedback/InteractiveFeedbackCard';
import AdminFeedbackActions from './AdminFeedbackActions';

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
                    <InteractiveFeedbackCard
                        key={feedback._id.toString()}
                        feedback={{
                            _id: feedback._id.toString(),
                            mulaRating: feedback.mulaRating,
                            ratings: feedback.ratings,
                            strengths: feedback.strengths,
                            improvements: feedback.improvements,
                            visibility: feedback.visibility,
                            createdAt: feedback.createdAt.toISOString ? feedback.createdAt.toISOString() : feedback.createdAt,
                        }}
                        targetUser={{
                            fullName: feedback.targetUser?.fullName || 'Unknown User',
                            email: feedback.reviewPeriod?.name ? `Period: ${feedback.reviewPeriod.name}` : undefined
                        }}
                        hideVisibilityToggle={true}
                        customActions={
                            <AdminFeedbackActions
                                feedbackId={feedback._id.toString()}
                                currentStatus={feedback.moderation?.status || 'pending'}
                            />
                        }
                    />
                )) : (
                    <div className="text-center py-12 bg-card/50 rounded-2xl border border-dashed">
                        <p className="text-muted-foreground">No feedback submissions found.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

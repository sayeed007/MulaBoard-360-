import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/helpers';
import { Button, Logo } from '@/components/ui';
import Link from 'next/link';
import connectDB from '@/lib/db/connect';
import Feedback from '@/lib/db/models/Feedback';
import User from '@/lib/db/models/User';
import '@/lib/db/models/ReviewPeriod';
import InteractiveFeedbackCard from '@/components/feedback/InteractiveFeedbackCard';
import ShareProfile from '@/components/dashboard/ShareProfile';

export const metadata = {
  title: 'Dashboard | MulaBoard',
  description: 'Your MulaBoard dashboard',
};

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  await connectDB();

  // Fetch user's feedback stats
  const feedbacks = await Feedback.find({
    targetUser: user.id,
    'moderation.status': 'approved',
  })
    .sort({ createdAt: -1 })
    .limit(5)
    .populate('reviewPeriod', 'name theme')
    .lean();

  const totalReviews = await Feedback.countDocuments({
    targetUser: user.id,
    'moderation.status': 'approved',
  });

  // Calculate average score
  const avgRatings = await Feedback.getUserAverageRatings(user.id);
  const mulaScore = avgRatings.count > 0 ? avgRatings.overall.toFixed(1) : 'N/A';

  // Get profile views count
  const currentUserData = await User.findById(user.id).select('profileViews').lean();
  const profileViews = currentUserData?.profileViews || 0;

  // Stats data
  const stats = [
    { label: 'Total Reviews', value: totalReviews.toString(), icon: '📝', color: 'text-blue-500' },
    { label: 'Mula Score', value: mulaScore, icon: '🏆', color: 'text-yellow-500' },
    { label: 'Profile Views', value: profileViews.toString(), icon: '👀', color: 'text-purple-500' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">

      {/* Welcome Section */}
      <div className="mb-12 animate-slide-up">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
          Dashboard
        </h1>
        <div className="bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl border border-white/20 dark:border-zinc-800 rounded-3xl p-8 shadow-xl relative overflow-hidden">
          <div className="absolute top-[-30px] right-10 p-8 opacity-30 text-9xl select-none pointer-events-none">
            <Logo size={200} />
          </div>
          <div className="relative z-10 max-w-2xl">
            <h2 className="text-2xl font-bold mb-2">Welcome back, {user.name}! 👋</h2>
            <p className="text-lg text-muted-foreground mb-6">
              &quot;Another day, another opportunity to collect Mulas and grow.&quot; 🌿
            </p>
            <div className="flex gap-4">
              <ShareProfile profileUrl={`${process.env.NEXT_PUBLIC_APP_URL}/${user.publicSlug}`} />
              <Link href="/profile">
                <Button variant="secondary">
                  Edit Profile
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 animate-slide-up" style={{ animationDelay: '0.1s' }}>
        {stats.map((stat, i) => (
          <div key={i} className="bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md rounded-2xl p-6 border border-white/10 dark:border-zinc-800 shadow-sm hover:translate-y-[-2px] transition-transform">
            <div className="flex items-center justify-between mb-4">
              <span className="text-3xl">{stat.icon}</span>
              <span className={`text-xs font-bold px-2 py-1 rounded-full bg-background/50 border ${stat.color}`}>
                Live
              </span>
            </div>
            <p className="text-sm text-muted-foreground font-medium uppercase tracking-wide">{stat.label}</p>
            <p className="text-3xl font-bold mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Recent Feedback */}
      <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <span>💬</span> Recent Feedback
          </h3>
          {feedbacks.length > 0 && (
            <Link href="/my-reviews">
              <Button variant="outline" size="sm">View All</Button>
            </Link>
          )}
        </div>

        {feedbacks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {feedbacks.map((feedback: any) => (
              <InteractiveFeedbackCard
                key={feedback._id}
                feedback={{
                  _id: feedback._id.toString(),
                  mulaRating: feedback.mulaRating,
                  ratings: feedback.ratings,
                  strengths: feedback.strengths,
                  improvements: feedback.improvements,
                  visibility: feedback.visibility,
                  createdAt: feedback.createdAt.toISOString ? feedback.createdAt.toISOString() : feedback.createdAt,
                }}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white/40 dark:bg-zinc-900/40 backdrop-blur-md rounded-2xl border border-white/10 dark:border-zinc-800 p-12 text-center">
            <div className="w-20 h-20 bg-muted/50 rounded-full flex items-center justify-center text-4xl mx-auto mb-4">
              📭
            </div>
            <h4 className="text-lg font-semibold mb-2">No feedback yet</h4>
            <p className="text-muted-foreground max-w-md mx-auto mb-8">
              Share your profile link with colleagues to start receiving anonymous 360° feedback!
            </p>
            <Link href="/profile">
              <Button variant="outline">
                Go to Profile
              </Button>
            </Link>
          </div>
        )}
      </div>

    </div>
  );
}

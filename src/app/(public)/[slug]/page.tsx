import { notFound } from 'next/navigation';
import Link from 'next/link';
import connectDB from '@/lib/db/connect';
import User from '@/lib/db/models/User';
import ReviewPeriod from '@/lib/db/models/ReviewPeriod';
import { getCurrentUser } from '@/lib/auth/helpers';
import type { Metadata } from 'next';
import { Button } from '@/components/ui';
import FeedbackForm from '@/components/feedback/FeedbackForm';

interface PublicProfilePageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: PublicProfilePageProps): Promise<Metadata> {
  const { slug } = await params;

  await connectDB();

  const profileUser = await User.findOne({
    publicSlug: slug,
    isProfileActive: true,
  }).select('fullName designation department');

  if (!profileUser) {
    return {
      title: 'Profile Not Found | MulaBoard',
    };
  }

  return {
    title: `${profileUser.fullName} - ${profileUser.designation} | MulaBoard`,
    description: `View ${profileUser.fullName}'s profile on MulaBoard. ${profileUser.designation} at ${profileUser.department}.`,
  };
}

export default async function PublicProfilePage({
  params,
}: PublicProfilePageProps) {
  const { slug } = await params;

  // Connect to database
  await connectDB();

  // Find user by slug
  const profileUser = await User.findOne({
    publicSlug: slug,
    isProfileActive: true,
  })
    .select('-password -createdAt -updatedAt -__v')
    .lean();

  // Return 404 if user not found or profile inactive
  if (!profileUser) {
    notFound();
  }

  // Get active review period
  const activePeriod = await ReviewPeriod.getActivePeriod();

  if (!activePeriod) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md text-center">
          <div className="text-6xl mb-4">⏸️</div>
          <h1 className="text-2xl font-bold mb-2">No Active Review Period</h1>
          <p className="text-muted-foreground mb-6">
            Feedback submission is currently paused. Please check back later when a review period is active.
          </p>
          <Link href="/">
            <Button variant="outline">Go to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Get current user to check if viewing own profile
  const currentUser = await getCurrentUser();
  const isOwnProfile = currentUser?.id === profileUser._id.toString();

  // Convert to plain object for client component
  const userForForm = {
    ...profileUser,
    _id: profileUser._id.toString(),
    createdAt: profileUser.createdAt?.toISOString() || new Date().toISOString(),
    updatedAt: profileUser.updatedAt?.toISOString() || new Date().toISOString(),
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-100 via-background to-background dark:from-indigo-950 dark:to-background pb-20">

      {/* Decorated Header Background */}
      <div className="h-48 bg-gradient-to-r from-primary/20 via-primary/5 to-background relative overflow-hidden">
        <div className="absolute top-10 left-10 text-6xl opacity-10 animate-pulse">🌿</div>
        <div className="absolute bottom-[-10px] right-20 text-6xl opacity-10 animate-bounce-gentle" style={{ animationDelay: '1s' }}>🥕</div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 -mt-20 relative z-10">
        <div className="bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl border border-white/20 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-xl animate-slide-up">

          <div className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              {/* Profile Image */}
              <div className="flex-shrink-0">
                <div className="w-32 h-32 rounded-full p-1 bg-gradient-to-br from-primary via-purple-500 to-pink-500 shadow-lg">
                  {profileUser.profileImage ? (
                    <img
                      src={profileUser.profileImage}
                      alt={profileUser.fullName}
                      className="w-full h-full rounded-full object-cover border-4 border-background bg-background"
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-background flex items-center justify-center text-5xl font-bold text-primary border-4 border-background">
                      {profileUser.fullName.charAt(0)}
                    </div>
                  )}
                </div>
              </div>

              {/* Profile Info */}
              <div className="flex-1 text-center md:text-left space-y-2">
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
                  {profileUser.fullName}
                </h1>
                <div className="flex flex-wrap justify-center md:justify-start gap-3 text-muted-foreground font-medium">
                  <span className="flex items-center gap-1">
                    💼 {profileUser.designation}
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-border self-center hidden md:block"></span>
                  <span className="flex items-center gap-1">
                    🏢 {profileUser.department}
                  </span>
                </div>

                {profileUser.bio && (
                  <p className="pt-2 text-muted-foreground max-w-2xl leading-relaxed">
                    &quot;{profileUser.bio}&quot;
                  </p>
                )}

                {/* Actions */}
                {isOwnProfile && (
                  <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                    <Link href="/profile">
                      <Button variant="secondary" size="sm">
                        Edit Profile
                      </Button>
                    </Link>
                    <Link href="/dashboard">
                      <Button variant="outline" size="sm">
                        Go to Dashboard
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>

        {/* Feedback Form (only show if not own profile) */}
        {!isOwnProfile && (
          <div className="mt-8">
            <FeedbackForm
              targetUser={userForForm}
              reviewPeriodId={activePeriod._id.toString()}
            />
          </div>
        )}

        {/* Own Profile Message */}
        {isOwnProfile && (
          <div className="mt-8 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md rounded-2xl p-8 border border-white/10 shadow-sm text-center">
            <div className="max-w-md mx-auto">
              <div className="text-5xl mb-4">🌿</div>
              <h3 className="text-2xl font-bold mb-2">Your Public Profile</h3>
              <p className="text-muted-foreground mb-6">
                Share your profile link with colleagues to start collecting anonymous feedback!
              </p>
              <div className="bg-secondary/20 rounded-lg p-4 mb-4">
                <p className="text-sm font-mono break-all">
                  {typeof window !== 'undefined' ? window.location.href : `/${slug}`}
                </p>
              </div>
              <Link href="/my-reviews">
                <Button variant="primary">
                  View My Feedback
                </Button>
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

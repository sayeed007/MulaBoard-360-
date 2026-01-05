import { notFound } from 'next/navigation';
import Link from 'next/link';
import connectDB from '@/lib/db/connect';
import User from '@/lib/db/models/User';
import { getCurrentUser } from '@/lib/auth/helpers';
import type { Metadata } from 'next';
import { Button } from '@/components/ui';

interface PublicProfilePageProps {
  params: {
    slug: string;
  };
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: PublicProfilePageProps): Promise<Metadata> {
  await connectDB();

  const profileUser = await User.findOne({
    publicSlug: params.slug,
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
  const { slug } = params;

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

  // Get current user to check if viewing own profile
  const currentUser = await getCurrentUser();
  const isOwnProfile = currentUser?.id === profileUser._id.toString();

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-100 via-background to-background dark:from-indigo-950 dark:to-background pb-20">

      {/* Decorated Header Background */}
      <div className="h-64 bg-gradient-to-r from-primary/20 via-primary/5 to-background relative overflow-hidden">
        <div className="absolute top-10 left-10 text-9xl opacity-10 animate-pulse">🌿</div>
        <div className="absolute bottom-[-10px] right-20 text-9xl opacity-10 animate-bounce-gentle" style={{ animationDelay: '1s' }}>🥕</div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 -mt-32 relative z-10">
        <div className="bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl border border-white/20 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-xl animate-slide-up">

          <div className="p-8 md:p-12">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
              {/* Profile Image */}
              <div className="flex-shrink-0">
                <div className="w-40 h-40 rounded-full p-1 bg-gradient-to-br from-primary via-purple-500 to-pink-500 shadow-lg">
                  {profileUser.profileImage ? (
                    <img
                      src={profileUser.profileImage}
                      alt={profileUser.fullName}
                      className="w-full h-full rounded-full object-cover border-4 border-background bg-background"
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-background flex items-center justify-center text-6xl font-bold text-primary border-4 border-background">
                      {profileUser.fullName.charAt(0)}
                    </div>
                  )}
                </div>
              </div>

              {/* Profile Info */}
              <div className="flex-1 text-center md:text-left space-y-2">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
                  {profileUser.fullName}
                </h1>
                <div className="flex flex-wrap justify-center md:justify-start gap-3 text-muted-foreground text-lg font-medium">
                  <span className="flex items-center gap-1">
                    💼 {profileUser.designation}
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-border self-center hidden md:block"></span>
                  <span className="flex items-center gap-1">
                    🏢 {profileUser.department}
                  </span>
                </div>

                {profileUser.bio && (
                  <p className="pt-4 text-muted-foreground text-lg max-w-2xl leading-relaxed">
                    &quot;{profileUser.bio}&quot;
                  </p>
                )}

                {/* Actions */}
                <div className="pt-6 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                  {isOwnProfile ? (
                    <Link href="/profile">
                      <Button variant="secondary" size="lg" className="shadow-sm">
                        Edit Profile
                      </Button>
                    </Link>
                  ) : (
                    <Link href={`/feedback/submit?to=${slug}`}>
                      <Button variant="primary" size="lg" className="shadow-lg shadow-primary/25 animate-pulse-slow">
                        Give Anonymous Feedback 🤫
                      </Button>
                    </Link>
                  )}
                  <Link href="/dashboard">
                    <Button variant="outline" size="lg">
                      Go to Dashboard
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">

          {/* Stats Card - Placeholder */}
          <div className="bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-sm md:col-span-1">
            <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
              <span>📊</span> Feedback Stats
            </h2>
            <div className="space-y-4">
              <div className="bg-background/80 rounded-xl p-5 text-center border border-border/50">
                <div className="text-4xl mb-2 opacity-50">🏆</div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Mula Score</p>
                <p className="text-xl font-bold">Hidden</p>
              </div>
              <div className="bg-background/80 rounded-xl p-5 text-center border border-border/50">
                <div className="text-4xl mb-2 opacity-50">💬</div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Received</p>
                <p className="text-xl font-bold">--</p>
              </div>
            </div>
            <p className="text-xs text-center text-muted-foreground mt-4 italic">
              Detailed stats are private to the user.
            </p>
          </div>

          {/* Recent Feedback & Placeholder */}
          <div className="md:col-span-2 space-y-8">
            <div className="bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md rounded-2xl p-8 border border-white/10 shadow-sm text-center">
              <div className="max-w-md mx-auto py-8">
                <div className="text-6xl mb-6 animate-bounce-gentle">✨</div>
                <h3 className="text-2xl font-bold mb-2">Anonymous Feedback</h3>
                <p className="text-muted-foreground mb-8 text-lg">
                  Help {profileUser.fullName} grow by providing honest, constructive feedback. Use the Mula Rating System!
                </p>

                {!isOwnProfile && (
                  <div className="grid grid-cols-3 gap-4 mb-8 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
                    <div className="text-center">
                      <div className="text-4xl mb-1">🌿</div>
                      <div className="text-xs font-bold">Golden Mula</div>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl mb-1">🥕</div>
                      <div className="text-xs font-bold">Fresh Carrot</div>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl mb-1">🍅</div>
                      <div className="text-xs font-bold">Rotten Tomato</div>
                    </div>
                  </div>
                )}

                {!isOwnProfile ? (
                  <Link href={`/feedback/submit?to=${slug}`}>
                    <Button variant="primary" size="lg" className="w-full sm:w-auto">
                      Give Feedback Now
                    </Button>
                  </Link>
                ) : (
                  <p className="bg-secondary/50 p-4 rounded-xl text-sm border border-secondary text-secondary-foreground font-medium">
                    Share your profile link to start collecting feedback!
                  </p>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

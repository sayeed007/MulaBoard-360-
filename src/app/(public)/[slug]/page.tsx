import { notFound } from 'next/navigation';
import Link from 'next/link';
import connectDB from '@/lib/db/connect';
import User from '@/lib/db/models/User';
import { getCurrentUser } from '@/lib/auth/helpers';
import type { Metadata } from 'next';

/**
 * Public Profile Page
 *
 * Displays a user's public profile based on their unique slug
 */

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
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-background border-b">
        <div className="max-w-5xl mx-auto px-8 py-12">
          <div className="flex items-start justify-between">
            <div className="flex gap-6 items-start">
              {/* Profile Image */}
              <div className="flex-shrink-0">
                {profileUser.profileImage ? (
                  <img
                    src={profileUser.profileImage}
                    alt={profileUser.fullName}
                    className="w-32 h-32 rounded-full object-cover border-4 border-background shadow-lg"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-primary/20 flex items-center justify-center text-5xl font-bold border-4 border-background shadow-lg">
                    {profileUser.fullName.charAt(0)}
                  </div>
                )}
              </div>

              {/* Profile Info */}
              <div className="flex-1">
                <h1 className="text-4xl font-bold mb-2">
                  {profileUser.fullName}
                </h1>
                <p className="text-xl text-muted-foreground mb-1">
                  {profileUser.designation}
                </p>
                <p className="text-lg text-muted-foreground">
                  {profileUser.department}
                </p>

                {profileUser.bio && (
                  <p className="mt-4 text-muted-foreground max-w-2xl">
                    {profileUser.bio}
                  </p>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              {isOwnProfile ? (
                <Link
                  href="/profile"
                  className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors"
                >
                  Edit Profile
                </Link>
              ) : (
                <Link
                  href={`/feedback/submit?to=${slug}`}
                  className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
                >
                  Give Feedback
                </Link>
              )}
              <Link
                href="/dashboard"
                className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors"
              >
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Stats Card - Coming Soon */}
          <div className="bg-card rounded-lg shadow-lg p-6 border">
            <h2 className="text-lg font-bold mb-4">Feedback Stats</h2>
            <div className="space-y-3 text-center">
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="text-3xl mb-1">🏆</div>
                <p className="text-sm text-muted-foreground">Mula Rating</p>
                <p className="text-lg font-bold">Coming Soon</p>
              </div>
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="text-3xl mb-1">📊</div>
                <p className="text-sm text-muted-foreground">
                  Total Feedback Received
                </p>
                <p className="text-lg font-bold">-</p>
              </div>
            </div>
          </div>

          {/* Recent Feedback - Coming Soon */}
          <div className="md:col-span-2 bg-card rounded-lg shadow-lg p-6 border">
            <h2 className="text-lg font-bold mb-4">Recent Feedback</h2>
            <div className="text-center py-12">
              <div className="text-6xl mb-4">💬</div>
              <p className="text-muted-foreground">
                Feedback history will be available in Phase 5
              </p>
              {!isOwnProfile && (
                <Link
                  href={`/feedback/submit?to=${slug}`}
                  className="inline-block mt-4 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
                >
                  Be the first to give feedback!
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Achievements - Coming Soon */}
        <div className="mt-8 bg-card rounded-lg shadow-lg p-6 border">
          <h2 className="text-lg font-bold mb-4">Achievements & Badges</h2>
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎖️</div>
            <p className="text-muted-foreground">
              Achievement badges will be available in Phase 7
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

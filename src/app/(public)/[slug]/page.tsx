import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import connectDB from "@/lib/db/connect";
import User from "@/lib/db/models/User";
import ReviewPeriod from "@/lib/db/models/ReviewPeriod";
import { getCurrentUser } from "@/lib/auth/helpers";
import type { Metadata } from "next";
import { Button, Logo } from "@/components/ui";
import FeedbackForm from "@/components/feedback/FeedbackForm";
import HeroSection from "@/components/layout/HeroSection";
import ProfileViewTracker from "@/components/profile/ProfileViewTracker";

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
  }).select("fullName designation department");

  if (!profileUser) {
    return {
      title: "Profile Not Found | MulaBoard",
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
    .select("-password -createdAt -updatedAt -__v")
    .lean();

  // Return 404 if user not found or profile inactive
  if (!profileUser) {
    notFound();
  }

  // Get active review period
  const activePeriod = await ReviewPeriod.getActivePeriod();

  // Get current user to check if viewing own profile
  const currentUser = await getCurrentUser();
  const isOwnProfile = currentUser?.id === profileUser._id.toString();

  // Convert to plain object for client component and sanitize
  const userForForm = {
    _id: profileUser._id.toString(),
    email: profileUser.email || "",
    role: profileUser.role || "employee",
    fullName: profileUser.fullName,
    designation: profileUser.designation,
    department: profileUser.department,
    profileImage: profileUser.profileImage,
    bio: profileUser.bio,
    publicSlug: profileUser.publicSlug,
    isProfileActive: profileUser.isProfileActive,
    settings: profileUser.settings || {
      emailNotifications: false,
      showAggregatePublicly: false,
    },
    createdAt: profileUser.createdAt?.toISOString() || new Date().toISOString(),
    updatedAt: profileUser.updatedAt?.toISOString() || new Date().toISOString(),
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-100 via-background to-background dark:from-indigo-950 dark:to-background pb-20">
      {/* Track profile views (client-side) */}
      <ProfileViewTracker slug={slug} isOwnProfile={isOwnProfile} />

      {/* Decorated Header Background */}
      <HeroSection />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 -mt-20 relative z-10">
        {/* Breadcrumb Navigation */}
        {/* <div className="mb-4">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/directory" className="hover:text-foreground transition-colors">
              Directory
            </Link>
            <span>/</span>
            <Link href={`/directory/${slug}`} className="hover:text-foreground transition-colors">
              {profileUser.fullName}
            </Link>
            <span>/</span>
            <span className="text-foreground font-medium">Give Feedback</span>
          </nav>
        </div> */}

        <div className="bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl border border-white/20 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-xl animate-slide-up">
          <div className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              {/* Profile Image */}
              <div className="flex-shrink-0">
                <div className="w-32 h-32 rounded-full p-1 bg-gradient-to-br from-primary via-purple-500 to-pink-500 shadow-lg">
                  {profileUser.profileImage ? (
                    <div className="w-full h-full rounded-full border-4 border-background bg-background relative overflow-hidden">
                      <Image
                        src={profileUser.profileImage}
                        alt={profileUser.fullName}
                        fill
                        className="object-cover"
                      />
                    </div>
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

                {/* Give Feedback Button for Others */}
                {!isOwnProfile && activePeriod && (
                  <div className="pt-4 flex justify-center md:justify-start">
                    <a href="#give-feedback">
                      <Button variant="primary" size="sm">
                        Give Feedback 📝
                      </Button>
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Feedback Form (only show if not own profile and active period) */}
        {!isOwnProfile && activePeriod && (
          <div className="mt-8" id="give-feedback">
            <FeedbackForm
              targetUser={userForForm}
              reviewPeriod={{
                _id: activePeriod._id.toString(),
                name: activePeriod.name,
                startDate: activePeriod.startDate.toISOString(),
                endDate: activePeriod.endDate.toISOString(),
                theme: activePeriod.theme,
              }}
            />
          </div>
        )}

        {/* No Active Period Message */}
        {!isOwnProfile && !activePeriod && (
          <div className="mt-8 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md rounded-2xl p-8 border border-white/10 shadow-sm text-center">
            <div className="text-5xl mb-4">⏸️</div>
            <h3 className="text-xl font-bold mb-2">No Active Review Period</h3>
            <p className="text-muted-foreground mb-6">
              Feedback submission is currently paused. Please check back later
              when a review period is active.
            </p>
            <Link href="/directory">
              <Button variant="outline">← Back to Directory</Button>
            </Link>
          </div>
        )}

        {/* Own Profile Message */}
        {isOwnProfile && (
          <div className="mt-8 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md rounded-2xl p-8 border border-white/10 shadow-sm text-center">
            <div className="max-w-md mx-auto">
              <div className="flex justify-center">
                <Logo size={100} />
              </div>
              <h3 className="text-2xl font-bold mb-2">Your Public Profile</h3>
              <p className="text-muted-foreground mb-6">
                Share your profile link with colleagues to start collecting
                anonymous feedback!
              </p>
              <div className="bg-secondary/20 rounded-lg p-4 mb-4">
                <p className="text-sm font-mono break-all">
                  {typeof window !== "undefined"
                    ? window.location.href
                    : `/${slug}`}
                </p>
              </div>
              <div className="flex gap-3 justify-center">
                <Link href="/my-reviews">
                  <Button variant="primary">View My Feedback</Button>
                </Link>
                <Link href="/directory">
                  <Button variant="outline">Browse Directory</Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

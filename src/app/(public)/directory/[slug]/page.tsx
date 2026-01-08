import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import connectDB from '@/lib/db/connect';
import User from '@/lib/db/models/User';
import { getCurrentUser } from '@/lib/auth/helpers';
import type { Metadata } from 'next';
import { Button } from '@/components/ui';
import PublicFeedbacksList from '@/components/feedback/PublicFeedbacksList';
import HeroSection from '@/components/layout/HeroSection';

interface DirectoryUserProfileProps {
    params: Promise<{
        slug: string;
    }>;
}

// Generate metadata for SEO
export async function generateMetadata({
    params,
}: DirectoryUserProfileProps): Promise<Metadata> {
    const { slug } = await params;

    await connectDB();

    const profileUser = await User.findOne({
        publicSlug: slug,
        isProfileActive: true,
        accountStatus: 'approved',
    }).select('fullName designation department');

    if (!profileUser) {
        return {
            title: 'Profile Not Found | MulaBoard',
        };
    }

    return {
        title: `${profileUser.fullName} - ${profileUser.designation} | MulaBoard`,
        description: `View ${profileUser.fullName}'s public profile and feedback on MulaBoard. ${profileUser.designation} at ${profileUser.department}.`,
    };
}

export default async function DirectoryUserProfilePage({
    params,
}: DirectoryUserProfileProps) {
    const { slug } = await params;

    // Connect to database
    await connectDB();

    // Find user by slug (only approved and active profiles)
    const profileUser = await User.findOne({
        publicSlug: slug,
        isProfileActive: true,
        accountStatus: 'approved',
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

    // Fetch public feedbacks
    let publicFeedbacks = [];
    let totalFeedbacks = 0;
    try {
        const apiUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/feedback/public?userId=${profileUser._id.toString()}&limit=20`;
        const response = await fetch(apiUrl, { cache: 'no-store' });
        if (response.ok) {
            const data = await response.json();
            publicFeedbacks = data.feedbacks || [];
            totalFeedbacks = data.pagination?.totalFeedbacks || 0;
        }
    } catch (error) {
        console.error('Error fetching public feedbacks:', error);
    }

    return (
        <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-100 via-background to-background dark:from-indigo-950 dark:to-background pb-20">

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
                        <span className="text-foreground font-medium">{profileUser.fullName}</span>
                    </nav>
                </div> */}

                {/* User Profile Card */}
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
                                {isOwnProfile ? (
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
                                ) : (
                                    <div className="pt-4 flex justify-center md:justify-start">
                                        <Link href={`/${slug}`}>
                                            <Button variant="primary" size="lg">
                                                Give Feedback 📝
                                            </Button>
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Public Feedbacks Section */}
                {!isOwnProfile && publicFeedbacks.length > 0 && (
                    <div className="mt-8">
                        <PublicFeedbacksList
                            feedbacks={publicFeedbacks}
                            userName={profileUser.fullName}
                        />
                    </div>
                )}

                {/* No Public Feedbacks Message */}
                {!isOwnProfile && publicFeedbacks.length === 0 && (
                    <div className="mt-8 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md rounded-2xl p-8 border border-white/10 shadow-sm text-center">
                        <div className="text-5xl mb-4">💬</div>
                        <h3 className="text-xl font-bold mb-2">No Public Feedback Yet</h3>
                        <p className="text-muted-foreground mb-6">
                            Be the first to share your feedback about {profileUser.fullName}!
                        </p>
                        <Link href={`/${slug}`}>
                            <Button variant="primary">
                                Give Feedback 📝
                            </Button>
                        </Link>
                    </div>
                )}

                {/* Own Profile Message */}
                {isOwnProfile && (
                    <div className="mt-8 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md rounded-2xl p-8 border border-white/10 shadow-sm text-center">
                        <div className="max-w-md mx-auto">
                            <div className="text-5xl mb-4">👤</div>
                            <h3 className="text-2xl font-bold mb-2">Your Public Profile</h3>
                            <p className="text-muted-foreground mb-6">
                                This is how others see your profile in the directory. {totalFeedbacks > 0 ? `You have ${totalFeedbacks} public feedback${totalFeedbacks === 1 ? '' : 's'}.` : 'Share your profile link to start collecting feedback!'}
                            </p>
                            <div className="flex gap-3 justify-center">
                                <Link href="/my-reviews">
                                    <Button variant="primary">
                                        View My Feedback
                                    </Button>
                                </Link>
                                <Link href="/directory">
                                    <Button variant="outline">
                                        Browse Directory
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}

import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth/helpers';
import ProfileForm from '@/components/profile/ProfileForm';
import { Button, Logo } from '@/components/ui';
import connectDB from '@/lib/db/connect';
import User from '@/lib/db/models/User';

export const metadata = {
  title: 'Edit Profile | MulaBoard',
  description: 'Edit your MulaBoard profile',
};

export default async function ProfilePage() {
  const sessionUser = await getCurrentUser();

  if (!sessionUser) {
    redirect('/login');
  }

  // Fetch full user data from database
  await connectDB();
  const dbUser = await User.findById(sessionUser.id).lean();

  if (!dbUser) {
    redirect('/login');
  }

  // Convert MongoDB document to plain object with string _id
  const user = {
    ...dbUser,
    _id: dbUser._id.toString(),
    createdAt: dbUser.createdAt.toISOString(),
    updatedAt: dbUser.updatedAt.toISOString(),
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-100 via-background to-background dark:from-indigo-950 dark:to-background pb-20">

      {/* Navbar Placeholder - Similar to Dashboard */}
      <div className="border-b border-border/40 bg-background/60 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <Logo size={32} />
              <span className="font-bold text-lg hidden sm:block">MulaBoard</span>
            </Link>
          </div>
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">Back to Dashboard</Button>
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 animate-slide-up">

        <div className="mb-8 text-center sm:text-left">
          <h1 className="text-3xl font-bold mb-2">Edit Profile</h1>
          <p className="text-muted-foreground">
            Update your personal information and public profile details.
          </p>
        </div>

        <div className="grid gap-8">
          {/* Public Profile Link Card */}
          <div className="bg-primary/5 border border-primary/10 rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="font-semibold text-primary mb-1">Your Public Profile</h3>
              <p className="text-sm text-muted-foreground">Share this link to collect feedback.</p>
            </div>
            <Link href={`/${sessionUser.publicSlug}`} target="_blank">
              <Button variant="outline" className="text-primary hover:text-primary border-primary/20 hover:bg-primary/5">
                View Public Profile ↗
              </Button>
            </Link>
          </div>

          {/* Profile Edit Form Card */}
          <div className="bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl border border-white/20 dark:border-zinc-800 rounded-2xl p-8 shadow-sm">
            <ProfileForm user={user} />
          </div>

          {/* Profile Visibility Notice */}
          <div className="bg-muted/30 rounded-xl p-6 border border-border/50">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <span>👁️</span> Profile Visibility
            </h3>
            <p className="text-sm text-muted-foreground">
              Your profile is currently{' '}
              <span className={`font-medium ${sessionUser.isProfileActive ? 'text-primary' : 'text-muted-foreground'}`}>
                {sessionUser.isProfileActive ? 'Active' : 'Inactive'}
              </span>
              . {sessionUser.isProfileActive
                ? 'Colleagues can find you and give you feedback.'
                : 'Your profile is hidden from colleagues.'}
            </p>
            <div className="mt-4">
              <Link href="/settings">
                <Button variant="secondary" size="sm">Manage Visibility in Settings</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

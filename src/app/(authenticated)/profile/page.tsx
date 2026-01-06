import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth/helpers';
import EditProfileForm from '@/components/profile/EditProfileForm';
import { Button } from '@/components/ui';
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

  // Convert MongoDB document to plain object with serialized values
  const user = {
    _id: dbUser._id.toString(),
    email: dbUser.email,
    role: dbUser.role,
    accountStatus: dbUser.accountStatus,
    fullName: dbUser.fullName,
    designation: dbUser.designation,
    department: dbUser.department,
    profileImage: dbUser.profileImage,
    bio: dbUser.bio,
    publicSlug: dbUser.publicSlug,
    isProfileActive: dbUser.isProfileActive,
    settings: dbUser.settings,
    createdAt: dbUser.createdAt instanceof Date ? dbUser.createdAt.toISOString() : String(dbUser.createdAt),
    updatedAt: dbUser.updatedAt instanceof Date ? dbUser.updatedAt.toISOString() : String(dbUser.updatedAt),
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">

      {/* Header */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-1">Edit Profile</h1>
          <p className="text-muted-foreground">
            Update your personal information and profile details
          </p>
        </div>
        <div className="flex gap-2">
          <Link href={`/${sessionUser.publicSlug}`} target="_blank">
            <Button variant="outline" className="text-primary hover:text-primary border-primary/20 hover:bg-primary/5">
              View Public ↗
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="outline">
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-6">
        {/* Profile Edit Form Card */}
        <div className="bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl border border-white/20 dark:border-zinc-800 rounded-2xl p-8 shadow-sm">
          <EditProfileForm user={user} />
        </div>

        {/* Profile Visibility Notice */}
        <div className="bg-muted/30 rounded-xl p-4 border border-border/50">
          <div className="flex items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-semibold mb-1 flex items-center gap-2">
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
            </div>
            <Link href="/settings">
              <Button variant="secondary" size="sm">Manage Settings</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

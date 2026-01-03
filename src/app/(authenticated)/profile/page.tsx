import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth/helpers';
import ProfileForm from '@/components/profile/ProfileForm';

/**
 * Profile Edit Page
 *
 * Allows authenticated users to edit their profile information
 */

export const metadata = {
  title: 'Edit Profile | MulaBoard',
  description: 'Edit your MulaBoard profile',
};

export default async function ProfilePage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-muted/30 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Edit Profile</h1>
              <p className="text-muted-foreground">
                Update your profile information and image
              </p>
            </div>
            <Link
              href="/dashboard"
              className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors"
            >
              Back to Dashboard
            </Link>
          </div>

          {/* Public Profile Link */}
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
            <p className="text-sm text-muted-foreground mb-2">
              Your public profile:
            </p>
            <Link
              href={`/${user.publicSlug}`}
              target="_blank"
              className="text-primary hover:underline font-medium"
            >
              {process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/
              {user.publicSlug}
            </Link>
          </div>
        </div>

        {/* Profile Form */}
        <div className="bg-card rounded-lg shadow-lg p-8 border">
          <ProfileForm user={user} />
        </div>

        {/* Profile Visibility Notice */}
        <div className="mt-6 bg-muted/50 rounded-lg p-6 border">
          <h3 className="font-semibold mb-2">Profile Visibility</h3>
          <p className="text-sm text-muted-foreground">
            Your profile is currently{' '}
            <span className="font-medium text-primary">
              {user.isProfileActive ? 'Active' : 'Inactive'}
            </span>
            . {user.isProfileActive
              ? 'Colleagues can find you and give you feedback.'
              : 'Your profile is hidden from colleagues.'}
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            To change visibility settings, go to{' '}
            <Link href="/settings" className="text-primary hover:underline">
              Settings
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}

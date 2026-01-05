import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth/helpers';
import SettingsForm from '@/components/settings/SettingsForm';
import { Button } from '@/components/ui';
import connectDB from '@/lib/db/connect';
import User from '@/lib/db/models/User';

/**
 * Settings Page
 *
 * Allows authenticated users to manage their account settings
 */

export const metadata = {
  title: 'Settings | MulaBoard',
  description: 'Manage your MulaBoard account settings',
};

export default async function SettingsPage() {
  const sessionUser = await getCurrentUser();

  if (!sessionUser) {
    redirect('/login');
  }

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
    <div className="min-h-screen pb-20 animate-slide-up">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md rounded-2xl p-8 border border-white/20 dark:border-zinc-800 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
              Settings
            </h1>
            <p className="text-muted-foreground">
              Manage your account preferences and privacy
            </p>
          </div>
          <Link href="/dashboard">
            <Button variant="outline">
              Back to Dashboard
            </Button>
          </Link>
        </div>

        {/* Settings Sections */}
        <div className="space-y-6">
          {/* Profile Visibility */}
          <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-8 border shadow-sm">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <span>👁️</span> Profile Visibility
            </h2>
            <SettingsForm user={user} />
          </div>

          {/* Account Information */}
          <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-8 border shadow-sm">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <span>👤</span> Account Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 bg-muted/30 rounded-xl border border-border/50">
                <label className="block text-sm font-medium mb-1 text-muted-foreground">Email Address</label>
                <p className="text-foreground font-medium">{user.email}</p>
                <p className="text-xs text-orange-500 mt-2 flex items-center gap-1">
                  <span>🔒</span> Managed by Admin
                </p>
              </div>

              <div className="p-4 bg-muted/30 rounded-xl border border-border/50">
                <label className="block text-sm font-medium mb-1 text-muted-foreground">
                  Your Public Link
                </label>
                <div className="flex items-center gap-2 mt-2">
                  <Link
                    href={`/${user.publicSlug}`}
                    target="_blank"
                    className="text-primary hover:underline truncate font-mono text-sm"
                  >
                    /{user.publicSlug}
                  </Link>
                  <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">Active</span>
                </div>
              </div>

              <div className="p-4 bg-muted/30 rounded-xl border border-border/50">
                <label className="block text-sm font-medium mb-1 text-muted-foreground">Account Role</label>
                <p className="text-foreground font-medium capitalize flex items-center gap-2">
                  {user.role}
                  {user.role === 'admin' && <span className="text-xs bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 px-2 py-0.5 rounded-full">Super User</span>}
                </p>
              </div>
            </div>
          </div>

          {/* Placeholder Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Password Change - Coming Soon */}
            <div className="bg-card/30 rounded-2xl p-8 border border-dashed border-border flex flex-col items-center text-center opacity-70 hover:opacity-100 transition-opacity">
              <div className="text-4xl mb-4 grayscale">🔐</div>
              <h3 className="font-bold text-lg mb-2">Password & Security</h3>
              <p className="text-sm text-muted-foreground">
                Password rotation and 2FA settings are coming in the next update.
              </p>
            </div>

            {/* Notification Preferences - Coming Soon */}
            <div className="bg-card/30 rounded-2xl p-8 border border-dashed border-border flex flex-col items-center text-center opacity-70 hover:opacity-100 transition-opacity">
              <div className="text-4xl mb-4 grayscale">🔔</div>
              <h3 className="font-bold text-lg mb-2">Notifications</h3>
              <p className="text-sm text-muted-foreground">
                Granular controls for email and push notifications.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

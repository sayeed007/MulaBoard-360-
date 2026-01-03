import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth/helpers';
import SettingsForm from '@/components/settings/SettingsForm';

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
              <h1 className="text-3xl font-bold mb-2">Settings</h1>
              <p className="text-muted-foreground">
                Manage your account preferences and privacy
              </p>
            </div>
            <Link
              href="/dashboard"
              className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>

        {/* Settings Sections */}
        <div className="space-y-6">
          {/* Profile Visibility */}
          <div className="bg-card rounded-lg shadow-lg p-8 border">
            <h2 className="text-xl font-bold mb-4">Profile Visibility</h2>
            <SettingsForm user={user} />
          </div>

          {/* Account Information */}
          <div className="bg-card rounded-lg shadow-lg p-8 border">
            <h2 className="text-xl font-bold mb-4">Account Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <p className="text-muted-foreground">{user.email}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Contact admin to change your email address
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Public Profile URL
                </label>
                <div className="flex items-center gap-2">
                  <code className="text-sm bg-muted px-3 py-2 rounded flex-1">
                    {process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}
                    /{user.publicSlug}
                  </code>
                  <Link
                    href={`/${user.publicSlug}`}
                    target="_blank"
                    className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors text-sm"
                  >
                    View
                  </Link>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Account Role
                </label>
                <p className="text-muted-foreground capitalize">{user.role}</p>
              </div>
            </div>
          </div>

          {/* Password Change - Coming Soon */}
          <div className="bg-card rounded-lg shadow-lg p-8 border">
            <h2 className="text-xl font-bold mb-4">Change Password</h2>
            <div className="bg-muted/50 rounded-lg p-6 text-center">
              <div className="text-4xl mb-3">🔐</div>
              <p className="text-muted-foreground mb-4">
                Password change functionality will be available soon
              </p>
              <p className="text-sm text-muted-foreground">
                Contact your admin if you need to reset your password
              </p>
            </div>
          </div>

          {/* Notification Preferences - Coming Soon */}
          <div className="bg-card rounded-lg shadow-lg p-8 border">
            <h2 className="text-xl font-bold mb-4">Notification Preferences</h2>
            <div className="bg-muted/50 rounded-lg p-6 text-center">
              <div className="text-4xl mb-3">🔔</div>
              <p className="text-muted-foreground mb-4">
                Email notification settings will be available in a future update
              </p>
              <p className="text-sm text-muted-foreground">
                Features: Feedback received, Review period reminders, Achievement
                unlocked
              </p>
            </div>
          </div>

          {/* Privacy & Data - Coming Soon */}
          <div className="bg-card rounded-lg shadow-lg p-8 border">
            <h2 className="text-xl font-bold mb-4">Privacy & Data</h2>
            <div className="bg-muted/50 rounded-lg p-6 text-center">
              <div className="text-4xl mb-3">🛡️</div>
              <p className="text-muted-foreground mb-4">
                Privacy settings and data export will be available soon
              </p>
              <p className="text-sm text-muted-foreground">
                Features: Download your data, Delete account, Privacy controls
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

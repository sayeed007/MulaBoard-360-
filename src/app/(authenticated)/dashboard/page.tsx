import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/helpers';
import { signOut } from '@/lib/auth/auth';

/**
 * Dashboard Page
 *
 * Main dashboard for authenticated users
 * Shows welcome message and basic user info
 */

export const metadata = {
  title: 'Dashboard | MulaBoard',
  description: 'Your MulaBoard dashboard',
};

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-muted/30 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-card rounded-lg shadow-lg p-8 border mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Welcome back, {user.name}! 👋
              </h1>
              <p className="text-muted-foreground">
                &quot;Another day, another opportunity to collect Mulas&quot; 🌿
              </p>
            </div>
            <form
              action={async () => {
                'use server';
                await signOut({ redirectTo: '/login' });
              }}
            >
              <button
                type="submit"
                className="px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors"
              >
                Sign Out
              </button>
            </form>
          </div>
        </div>

        {/* User Info Card */}
        <div className="bg-card rounded-lg shadow-lg p-8 border">
          <h2 className="text-xl font-bold mb-4">Account Information</h2>
          <div className="space-y-3">
            <div>
              <span className="text-sm text-muted-foreground">Email:</span>
              <p className="font-medium">{user.email}</p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Role:</span>
              <p className="font-medium capitalize">{user.role}</p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Status:</span>
              <p className="font-medium text-primary">✅ Active</p>
            </div>
          </div>
        </div>

        {/* Coming Soon Notice */}
        <div className="mt-8 bg-primary/10 border-2 border-primary/20 rounded-lg p-8 text-center">
          <div className="text-6xl mb-4">🚧</div>
          <h2 className="text-2xl font-bold mb-2">Dashboard Coming Soon!</h2>
          <p className="text-muted-foreground">
            Your full dashboard with Mula Meter, feedback stats, and badges will be available
            in Phase 6.
          </p>
          <p className="text-sm text-muted-foreground mt-4">
            For now, you&apos;re successfully authenticated! 🎉
          </p>
        </div>
      </div>
    </div>
  );
}

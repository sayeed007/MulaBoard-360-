import { Suspense } from 'react';
import AdminStats from '@/components/admin/AdminStats';

/**
 * Admin Dashboard Page
 *
 * Overview statistics and quick actions for administrators
 */

export const metadata = {
  title: 'Admin Dashboard | MulaBoard',
  description: 'MulaBoard admin dashboard',
};

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Manage users, moderate feedback, and configure review periods
        </p>
      </div>

      {/* Statistics */}
      <Suspense
        fallback={
          <div className="bg-card rounded-lg shadow-lg p-12 border text-center">
            <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-muted-foreground">Loading statistics...</p>
          </div>
        }
      >
        <AdminStats />
      </Suspense>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <QuickActionCard
          title="Moderate Feedback"
          description="Review pending and flagged feedback"
          icon="🔍"
          href="/admin/feedbacks"
        />
        <QuickActionCard
          title="Manage Users"
          description="Add, edit, or remove users"
          icon="👥"
          href="/admin/users"
        />
        <QuickActionCard
          title="Review Periods"
          description="Create and manage review periods"
          icon="📅"
          href="/admin/periods"
        />
        <QuickActionCard
          title="Manage Quotes"
          description="Add funny quotes for the platform"
          icon="💬"
          href="/admin/quotes"
        />
      </div>
    </div>
  );
}

function QuickActionCard({
  title,
  description,
  icon,
  href,
}: {
  title: string;
  description: string;
  icon: string;
  href: string;
}) {
  return (
    <a
      href={href}
      className="bg-card rounded-lg shadow-lg p-6 border hover:border-primary transition-all hover:scale-105"
    >
      <div className="text-4xl mb-3">{icon}</div>
      <h3 className="font-bold text-lg mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </a>
  );
}

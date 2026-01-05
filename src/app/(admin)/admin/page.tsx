import { Suspense } from 'react';
import AdminStats from '@/components/admin/AdminStats';
import Link from 'next/link';
import { Card, Button } from '@/components/ui';

export const metadata = {
  title: 'Admin Dashboard | MulaBoard',
  description: 'MulaBoard admin dashboard',
};

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8 animate-slide-up">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage users, moderate feedback, and configure review periods
          </p>
        </div>
        <div className="flex gap-2">
          {/* <Button variant="outline" size="sm">
            System Logs
          </Button>
          <Button variant="primary" size="sm">
            + New Alert
          </Button> */}
        </div>
      </div>

      {/* Statistics */}
      <div className="bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md rounded-2xl p-6 border border-white/10 dark:border-zinc-800 shadow-sm">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <span>📈</span> System Overview
        </h2>
        <Suspense
          fallback={
            <div className="text-center py-12">
              <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4" />
              <p className="text-sm text-muted-foreground">Loading statistics...</p>
            </div>
          }
        >
          <AdminStats />
        </Suspense>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-bold mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <QuickActionCard
            title="Pending Approvals"
            description="Approve or reject new user registrations"
            icon="✅"
            href="/admin/users/pending"
            color="text-yellow-500"
            badge
          />
          <QuickActionCard
            title="Moderate Feedback"
            description="Review pending and flagged feedback"
            icon="🔍"
            href="/admin/feedbacks"
            color="text-blue-500"
          />
          <QuickActionCard
            title="Manage Users"
            description="Add, edit, or remove users"
            icon="👥"
            href="/admin/users"
            color="text-green-500"
          />
          <QuickActionCard
            title="Review Periods"
            description="Create and manage review periods"
            icon="📅"
            href="/admin/periods"
            color="text-purple-500"
          />
        </div>
      </div>
    </div>
  );
}

function QuickActionCard({
  title,
  description,
  icon,
  href,
  color,
  badge,
}: {
  title: string;
  description: string;
  icon: string;
  href: string;
  color?: string;
  badge?: boolean;
}) {
  return (
    <Link href={href} className="group">
      <div className="h-full bg-card hover:bg-muted/50 border rounded-xl p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 relative overflow-hidden">
        <div className={`text-4xl mb-4 ${color} transition-transform group-hover:scale-110 duration-300`}>{icon}</div>
        <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors flex items-center gap-2">
          {title}
          {badge && (
            <span className="bg-yellow-500 text-yellow-950 text-xs font-bold px-2 py-0.5 rounded-full">
              NEW
            </span>
          )}
        </h3>
        <p className="text-sm text-muted-foreground">{description}</p>
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity text-primary">
          ↗
        </div>
      </div>
    </Link>
  );
}

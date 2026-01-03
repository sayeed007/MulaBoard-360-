'use client';

import { useEffect, useState } from 'react';
import { getMulaRatingDetails } from '@/lib/utils/mula-calculator';
import type { MulaRating } from '@/types/feedback';

/**
 * Admin Stats Component
 *
 * Displays admin dashboard statistics
 */

interface AdminStatsData {
  overview: {
    totalUsers: number;
    totalFeedback: number;
    pendingModeration: number;
    flaggedFeedback: number;
  };
  mulaDistribution: {
    golden_mula: number;
    fresh_carrot: number;
    rotten_tomato: number;
    total: number;
    percentage: {
      golden_mula: number;
      fresh_carrot: number;
      rotten_tomato: number;
    };
    dominant: MulaRating;
  };
  currentPeriodStats: {
    periodName: string;
    feedbackCount: number;
    distribution: any;
  } | null;
  roleDistribution: {
    admin: number;
    employee: number;
  };
  recentActivity: {
    feedbackLast30Days: number;
    usersLast30Days: number;
  };
}

export default function AdminStats() {
  const [stats, setStats] = useState<AdminStatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch('/api/admin/stats');
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || 'Failed to fetch stats');
        }

        setStats(result.data);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch stats');
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="bg-card rounded-lg shadow-lg p-12 border text-center">
        <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-muted-foreground">Loading statistics...</p>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="bg-destructive/10 rounded-lg p-8 border border-destructive/20 text-center">
        <p className="text-destructive">{error || 'Failed to load statistics'}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={stats.overview.totalUsers}
          icon="👥"
          color="bg-blue-500"
        />
        <StatCard
          title="Total Feedback"
          value={stats.overview.totalFeedback}
          icon="💬"
          color="bg-green-500"
        />
        <StatCard
          title="Pending Moderation"
          value={stats.overview.pendingModeration}
          icon="⏳"
          color="bg-yellow-500"
          alert={stats.overview.pendingModeration > 0}
        />
        <StatCard
          title="Flagged Feedback"
          value={stats.overview.flaggedFeedback}
          icon="🚩"
          color="bg-red-500"
          alert={stats.overview.flaggedFeedback > 0}
        />
      </div>

      {/* Mula Distribution */}
      <div className="bg-card rounded-lg shadow-lg p-6 border">
        <h2 className="text-xl font-bold mb-4">Overall Mula Distribution</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(['golden_mula', 'fresh_carrot', 'rotten_tomato'] as MulaRating[]).map((rating) => {
            const details = getMulaRatingDetails(rating);
            const count = stats.mulaDistribution[rating];
            const percentage = stats.mulaDistribution.percentage[rating];

            return (
              <div
                key={rating}
                className="p-4 rounded-lg border"
                style={{ backgroundColor: details.bgColor }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{details.emoji}</span>
                  <span className="font-semibold" style={{ color: details.color }}>
                    {details.label}
                  </span>
                </div>
                <div className="text-3xl font-bold mb-1" style={{ color: details.color }}>
                  {count}
                </div>
                <div className="text-sm text-muted-foreground">
                  {percentage}% of total
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Current Period Stats */}
      {stats.currentPeriodStats && (
        <div className="bg-card rounded-lg shadow-lg p-6 border">
          <h2 className="text-xl font-bold mb-4">
            Current Period: {stats.currentPeriodStats.periodName}
          </h2>
          <div className="flex items-center gap-6">
            <div>
              <p className="text-sm text-muted-foreground">Feedback Count</p>
              <p className="text-3xl font-bold">{stats.currentPeriodStats.feedbackCount}</p>
            </div>
          </div>
        </div>
      )}

      {/* Recent Activity & User Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-card rounded-lg shadow-lg p-6 border">
          <h3 className="text-lg font-bold mb-4">Recent Activity (Last 30 Days)</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">New Feedback</span>
              <span className="text-2xl font-bold">{stats.recentActivity.feedbackLast30Days}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">New Users</span>
              <span className="text-2xl font-bold">{stats.recentActivity.usersLast30Days}</span>
            </div>
          </div>
        </div>

        {/* User Role Distribution */}
        <div className="bg-card rounded-lg shadow-lg p-6 border">
          <h3 className="text-lg font-bold mb-4">User Distribution</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Admins</span>
              <span className="text-2xl font-bold">{stats.roleDistribution.admin}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Employees</span>
              <span className="text-2xl font-bold">{stats.roleDistribution.employee}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
  color,
  alert = false,
}: {
  title: string;
  value: number;
  icon: string;
  color: string;
  alert?: boolean;
}) {
  return (
    <div className={`bg-card rounded-lg shadow-lg p-6 border ${alert ? 'border-yellow-500' : ''}`}>
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-lg ${color} bg-opacity-20 flex items-center justify-center text-2xl`}>
          {icon}
        </div>
        {alert && <span className="text-yellow-500 text-sm font-medium">⚠️ Attention</span>}
      </div>
      <h3 className="text-sm text-muted-foreground mb-1">{title}</h3>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
}

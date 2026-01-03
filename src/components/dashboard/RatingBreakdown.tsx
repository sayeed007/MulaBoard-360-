'use client';

import { RATING_CATEGORIES } from '@/lib/constants/ratings';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

/**
 * Rating Breakdown Component
 *
 * Visual breakdown of category averages using charts
 */

interface RatingBreakdownProps {
  categoryAverages: {
    communication: number;
    teamwork: number;
    technical: number;
    problemSolving: number;
    attitude: number;
  };
}

export default function RatingBreakdown({ categoryAverages }: RatingBreakdownProps) {
  // Prepare data for chart
  const chartData = RATING_CATEGORIES.map((category) => ({
    name: category.label,
    score: categoryAverages[category.key as keyof typeof categoryAverages],
    emoji: category.emoji,
  }));

  return (
    <div className="bg-card rounded-lg shadow-lg p-6 border">
      <h2 className="text-2xl font-bold mb-6">Performance Breakdown</h2>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="emoji"
            tick={{ fontSize: 20 }}
          />
          <YAxis domain={[0, 5]} ticks={[0, 1, 2, 3, 4, 5]} />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-card border rounded-lg p-3 shadow-lg">
                    <p className="font-semibold">{payload[0].payload.name}</p>
                    <p className="text-primary font-bold">
                      Score: {payload[0].value} / 5.00
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Legend />
          <Bar
            dataKey="score"
            fill="hsl(var(--primary))"
            radius={[8, 8, 0, 0]}
            name="Average Score"
          />
        </BarChart>
      </ResponsiveContainer>

      {/* Detailed List */}
      <div className="mt-6 space-y-3">
        {RATING_CATEGORIES.map((category) => {
          const score = categoryAverages[category.key as keyof typeof categoryAverages];
          const percentage = (score / 5) * 100;

          return (
            <div key={category.key} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{category.emoji}</span>
                  <span className="font-medium">{category.label}</span>
                </div>
                <span className="text-lg font-bold text-primary">
                  {score.toFixed(2)} / 5.00
                </span>
              </div>
              <div className="bg-muted/50 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

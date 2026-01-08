"use client";

import { useState } from "react";
import { Badge } from "@/components/ui";

interface FeedbackFiltersProps {
  users: Array<{ _id: string; fullName: string }>;
  reviewPeriods: Array<{ _id: string; name: string }>;
  onFilterChange: (filters: {
    userId: string;
    rating: string;
    reviewPeriodId: string;
  }) => void;
}

const RATING_OPTIONS = [
  { value: "", label: "All Ratings" },
  { value: "5", label: "5 Stars - Excellent" },
  { value: "4", label: "4 Stars - Good" },
  { value: "3", label: "3 Stars - Average" },
  { value: "2", label: "2 Stars - Below Average" },
  { value: "1", label: "1 Star - Poor" },
];

export default function FeedbackFilters({
  users,
  reviewPeriods,
  onFilterChange,
}: FeedbackFiltersProps) {
  const [userId, setUserId] = useState("");
  const [rating, setRating] = useState("");
  const [reviewPeriodId, setReviewPeriodId] = useState("");

  const handleFilterChange = (
    newUserId: string,
    newRating: string,
    newReviewPeriodId: string
  ) => {
    setUserId(newUserId);
    setRating(newRating);
    setReviewPeriodId(newReviewPeriodId);
    onFilterChange({
      userId: newUserId,
      rating: newRating,
      reviewPeriodId: newReviewPeriodId,
    });
  };

  const activeFiltersCount =
    (userId ? 1 : 0) + (rating ? 1 : 0) + (reviewPeriodId ? 1 : 0);

  const clearFilters = () => {
    handleFilterChange("", "", "");
  };

  return (
    <div className="bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md rounded-2xl p-6 border border-white/20 dark:border-zinc-800 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          🔍 Filters
          {activeFiltersCount > 0 && (
            <Badge variant="info" className="text-xs">
              {activeFiltersCount} active
            </Badge>
          )}
        </h2>
        {activeFiltersCount > 0 && (
          <button
            onClick={clearFilters}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Clear all
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Feedback Session Filter */}
        <div>
          <label
            htmlFor="reviewPeriod"
            className="block text-sm font-medium mb-2"
          >
            📅 Feedback Session
          </label>
          <select
            id="reviewPeriod"
            value={reviewPeriodId}
            onChange={(e) => handleFilterChange(userId, rating, e.target.value)}
            className="w-full px-4 py-2 bg-background text-foreground border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
          >
            <option value="">All Sessions</option>
            {reviewPeriods.map((period) => (
              <option key={period._id} value={period._id}>
                {period.name}
              </option>
            ))}
          </select>
        </div>

        {/* Person Filter */}
        <div>
          <label htmlFor="user" className="block text-sm font-medium mb-2">
            👤 Person
          </label>
          <select
            id="user"
            value={userId}
            onChange={(e) =>
              handleFilterChange(e.target.value, rating, reviewPeriodId)
            }
            className="w-full px-4 py-2 bg-background text-foreground border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
          >
            <option value="">All People</option>
            {users.map((user) => (
              <option key={user._id} value={user._id}>
                {user.fullName}
              </option>
            ))}
          </select>
        </div>

        {/* Rating Filter */}
        <div>
          <label htmlFor="rating" className="block text-sm font-medium mb-2">
            ⭐ Overall Rating
          </label>
          <select
            id="rating"
            value={rating}
            onChange={(e) =>
              handleFilterChange(userId, e.target.value, reviewPeriodId)
            }
            className="w-full px-4 py-2 bg-background text-foreground border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
          >
            {RATING_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

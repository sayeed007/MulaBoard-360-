"use client";

import { useState, useMemo } from "react";
import InteractiveFeedbackCard from "@/components/feedback/InteractiveFeedbackCard";
import AdminFeedbackActions from "./AdminFeedbackActions";
import FeedbackFilters from "./FeedbackFilters";

interface FeedbacksListProps {
  feedbacks: any[];
  users: Array<{ _id: string; fullName: string }>;
  reviewPeriods: Array<{ _id: string; name: string }>;
}

export default function FeedbacksList({
  feedbacks,
  users,
  reviewPeriods,
}: FeedbacksListProps) {
  const [filters, setFilters] = useState({
    userId: "",
    rating: "",
    reviewPeriodId: "",
  });

  const filteredFeedbacks = useMemo(() => {
    return feedbacks.filter((feedback) => {
      // Filter by user
      if (
        filters.userId &&
        feedback.targetUser?._id?.toString() !== filters.userId
      ) {
        return false;
      }

      // Filter by rating
      if (filters.rating) {
        const overallRating = feedback.ratings?.overall?.score;
        if (overallRating?.toString() !== filters.rating) {
          return false;
        }
      }

      // Filter by review period
      if (
        filters.reviewPeriodId &&
        feedback.reviewPeriod?._id?.toString() !== filters.reviewPeriodId
      ) {
        return false;
      }

      return true;
    });
  }, [feedbacks, filters]);

  return (
    <>
      {/* Filters */}
      <FeedbackFilters
        users={users}
        reviewPeriods={reviewPeriods}
        onFilterChange={setFilters}
      />

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing{" "}
          <span className="font-semibold text-foreground">
            {filteredFeedbacks.length}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-foreground">
            {feedbacks.length}
          </span>{" "}
          feedback submissions
        </p>
      </div>

      {/* Feedbacks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFeedbacks.length > 0 ? (
          filteredFeedbacks.map((feedback: any) => (
            <InteractiveFeedbackCard
              key={feedback._id.toString()}
              feedback={{
                _id: feedback._id.toString(),
                mulaRating: feedback.mulaRating,
                ratings: feedback.ratings,
                strengths: feedback.strengths,
                improvements: feedback.improvements,
                visibility: feedback.visibility,
                createdAt: feedback.createdAt.toISOString
                  ? feedback.createdAt.toISOString()
                  : feedback.createdAt,
              }}
              targetUser={{
                fullName: feedback.targetUser?.fullName || "Unknown User",
                email: feedback.reviewPeriod?.name
                  ? `Period: ${feedback.reviewPeriod.name}`
                  : undefined,
              }}
              hideVisibilityToggle={true}
              customActions={
                <AdminFeedbackActions
                  feedbackId={feedback._id.toString()}
                  currentStatus={feedback.moderation?.status || "pending"}
                />
              }
            />
          ))
        ) : (
          <div className="col-span-full text-center py-12 bg-card/50 rounded-2xl border border-dashed">
            <p className="text-muted-foreground">
              {feedbacks.length === 0
                ? "No feedback submissions found."
                : "No feedback matches the selected filters."}
            </p>
          </div>
        )}
      </div>
    </>
  );
}

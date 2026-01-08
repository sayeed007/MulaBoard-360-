import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser, hasAdminRole } from "@/lib/auth/helpers";
import connectDB from "@/lib/db/connect";
import Feedback from "@/lib/db/models/Feedback";
import User from "@/lib/db/models/User";
import ReviewPeriod from "@/lib/db/models/ReviewPeriod";
import FeedbacksList from "./FeedbacksList";

export const metadata = {
  title: "Moderate Feedback | MulaBoard Admin",
  description: "Approve or reject employee feedback.",
};

export default async function AdminFeedbacksPage() {
  const currentUser = await getCurrentUser();

  if (!currentUser || !hasAdminRole(currentUser.role)) {
    redirect("/dashboard");
  }

  await connectDB();

  // Fetch all feedback, sorted by newest
  const feedbacks = await Feedback.find({})
    .sort({ createdAt: -1 })
    .populate("targetUser", "fullName email")
    .populate("reviewPeriod", "name")
    .lean();

  // Fetch all users for filter dropdown
  const users = await User.find({ accountStatus: "approved" })
    .select("fullName")
    .sort({ fullName: 1 })
    .lean();

  // Fetch all review periods for filter dropdown
  const reviewPeriods = await ReviewPeriod.find({})
    .select("name")
    .sort({ startDate: -1 })
    .lean();

  // Convert to plain objects for client component
  const plainFeedbacks = feedbacks.map((f) => ({
    ...f,
    _id: f._id.toString(),
    targetUser: f.targetUser
      ? {
          _id: (f.targetUser as any)._id.toString(),
          fullName: (f.targetUser as any).fullName,
          email: (f.targetUser as any).email,
        }
      : null,
    reviewPeriod: f.reviewPeriod
      ? {
          _id: (f.reviewPeriod as any)._id.toString(),
          name: (f.reviewPeriod as any).name,
        }
      : null,
    createdAt: f.createdAt.toISOString
      ? f.createdAt.toISOString()
      : f.createdAt,
  }));

  const plainUsers = users.map((u) => ({
    _id: u._id.toString(),
    fullName: u.fullName,
  }));

  const plainReviewPeriods = reviewPeriods.map((rp) => ({
    _id: rp._id.toString(),
    name: rp.name,
  }));

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header */}
      <div className="bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-white/20 dark:border-zinc-800 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Link
                href="/admin"
                className="text-muted-foreground hover:text-primary transition-colors text-sm"
              >
                Admin Dashboard
              </Link>
              <span className="text-muted-foreground">/</span>
              <span className="font-semibold text-sm">Feedback</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
              Feedback Moderation
            </h1>
            <p className="text-sm md:text-base text-muted-foreground">
              Review and moderate anonymous submissions.
            </p>
          </div>
        </div>
      </div>

      {/* Feedbacks List with Filters */}
      <FeedbacksList
        feedbacks={plainFeedbacks}
        users={plainUsers}
        reviewPeriods={plainReviewPeriods}
      />
    </div>
  );
}

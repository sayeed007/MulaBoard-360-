import mongoose, { Schema, Model, Document, Types } from 'mongoose';

/**
 * Mula Rating Type
 */
export type MulaRating = 'golden_mula' | 'fresh_carrot' | 'rotten_tomato';

/**
 * Employee Reaction Type
 */
export type EmployeeReaction = 'thanks' | 'noted' | 'ouch' | 'fair_enough';

/**
 * Moderation Status Type
 */
export type ModerationStatus = 'pending' | 'approved' | 'flagged';

/**
 * Rating Category Interface
 */
export interface IRatingCategory {
  score: number; // 1-5
  comment?: string;
}

/**
 * Feedback Ratings Interface (5 categories)
 */
export interface IFeedbackRatings {
  workQuality: IRatingCategory;
  communication: IRatingCategory;
  teamBehavior: IRatingCategory;
  accountability: IRatingCategory;
  overall: IRatingCategory;
}

/**
 * Moderation Info Interface
 */
export interface IModerationInfo {
  status: ModerationStatus;
  moderatedBy?: Types.ObjectId;
  moderatedAt?: Date;
  removedFields?: string[];
  originalContent?: Record<string, string>;
  moderationNote?: string;
}

/**
 * Feedback Interface
 */
export interface IFeedback extends Document {
  // Relations
  targetUser: Types.ObjectId;
  reviewPeriod: Types.ObjectId;

  // Reviewer Identity (for spam prevention, NOT displayed)
  reviewerFingerprint: string;
  reviewerIpHash: string;

  // The 5 Rating Categories
  ratings: IFeedbackRatings;

  // Required Text Feedback
  strengths: string;
  improvements: string;

  // Fun Rating (auto-calculated)
  mulaRating: MulaRating;

  // Visibility Control
  visibility: 'private' | 'public';

  // Moderation
  moderation: IModerationInfo;

  // Employee Reaction
  employeeReaction?: EmployeeReaction;

  // Metadata
  createdAt: Date;
  updatedAt: Date;

  // Methods
  calculateMulaRating(): MulaRating;
  getAverageScore(): number;
}

/**
 * Rating Category Schema
 */
const RatingCategorySchema = new Schema<IRatingCategory>(
  {
    score: {
      type: Number,
      required: [true, 'Rating score is required'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5'],
    },
    comment: {
      type: String,
      trim: true,
      maxlength: [500, 'Comment cannot exceed 500 characters'],
      default: '',
    },
  },
  { _id: false }
);

/**
 * Feedback Schema
 */
const FeedbackSchema = new Schema<IFeedback>(
  {
    // Relations
    targetUser: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Target user is required'],
      index: true,
    },
    reviewPeriod: {
      type: Schema.Types.ObjectId,
      ref: 'ReviewPeriod',
      required: [true, 'Review period is required'],
      index: true,
    },

    // Reviewer Identity (for spam prevention)
    reviewerFingerprint: {
      type: String,
      required: [true, 'Reviewer fingerprint is required'],
      index: true,
    },
    reviewerIpHash: {
      type: String,
      required: [true, 'Reviewer IP hash is required'],
      index: true,
    },

    // The 5 Rating Categories
    ratings: {
      workQuality: {
        type: RatingCategorySchema,
        required: [true, 'Work quality rating is required'],
      },
      communication: {
        type: RatingCategorySchema,
        required: [true, 'Communication rating is required'],
      },
      teamBehavior: {
        type: RatingCategorySchema,
        required: [true, 'Team behavior rating is required'],
      },
      accountability: {
        type: RatingCategorySchema,
        required: [true, 'Accountability rating is required'],
      },
      overall: {
        type: RatingCategorySchema,
        required: [true, 'Overall rating is required'],
      },
    },

    // Required Text Feedback
    strengths: {
      type: String,
      required: [true, 'Strengths feedback is required'],
      trim: true,
      minlength: [20, 'Strengths must be at least 20 characters'],
      maxlength: [500, 'Strengths cannot exceed 500 characters'],
    },
    improvements: {
      type: String,
      required: [true, 'Improvements feedback is required'],
      trim: true,
      minlength: [20, 'Improvements must be at least 20 characters'],
      maxlength: [500, 'Improvements cannot exceed 500 characters'],
    },

    // Fun Rating (auto-calculated)
    mulaRating: {
      type: String,
      enum: {
        values: ['golden_mula', 'fresh_carrot', 'rotten_tomato'],
        message: '{VALUE} is not a valid Mula rating',
      },
      required: [true, 'Mula rating is required'],
      index: true,
    },

    // Visibility Control
    visibility: {
      type: String,
      enum: {
        values: ['private', 'public'],
        message: '{VALUE} is not a valid visibility setting',
      },
      default: 'private',
      index: true,
    },

    // Moderation
    moderation: {
      status: {
        type: String,
        enum: {
          values: ['pending', 'approved', 'flagged'],
          message: '{VALUE} is not a valid moderation status',
        },
        default: 'approved', // Auto-approve by default, manual review for flagged
        index: true,
      },
      moderatedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
      moderatedAt: {
        type: Date,
      },
      removedFields: {
        type: [String],
        default: [],
      },
      originalContent: {
        type: Map,
        of: String,
      },
      moderationNote: {
        type: String,
        trim: true,
        maxlength: [500, 'Moderation note cannot exceed 500 characters'],
      },
    },

    // Employee Reaction
    employeeReaction: {
      type: String,
      enum: {
        values: ['thanks', 'noted', 'ouch', 'fair_enough'],
        message: '{VALUE} is not a valid reaction',
      },
    },
  },
  {
    timestamps: true,
    collection: 'feedbacks',
  }
);

/**
 * Indexes for performance optimization
 */
// Compound index for targetUser and reviewPeriod
FeedbackSchema.index({ targetUser: 1, reviewPeriod: 1 });

// Unique compound index to prevent duplicate feedback
FeedbackSchema.index(
  { reviewerFingerprint: 1, targetUser: 1, reviewPeriod: 1 },
  { unique: true }
);

// Other indexes
FeedbackSchema.index({ 'moderation.status': 1 });
FeedbackSchema.index({ visibility: 1 });
FeedbackSchema.index({ mulaRating: 1 });
FeedbackSchema.index({ createdAt: -1 });

/**
 * Method to calculate Mula Rating based on average score
 */
FeedbackSchema.methods.calculateMulaRating = function (): MulaRating {
  const average = this.getAverageScore();

  if (average >= 4.5) return 'golden_mula';
  if (average >= 3.0) return 'fresh_carrot';
  return 'rotten_tomato';
};

/**
 * Method to get average score across all categories
 */
FeedbackSchema.methods.getAverageScore = function (): number {
  const scores = [
    this.ratings.workQuality.score,
    this.ratings.communication.score,
    this.ratings.teamBehavior.score,
    this.ratings.accountability.score,
    this.ratings.overall.score,
  ];

  const sum = scores.reduce((acc, score) => acc + score, 0);
  const average = sum / scores.length;

  return Math.round(average * 10) / 10; // Round to 1 decimal place
};

/**
 * Pre-save middleware to auto-calculate Mula rating
 */
FeedbackSchema.pre('save', function () {
  // Always recalculate Mula rating before saving
  this.mulaRating = this.calculateMulaRating();
});

/**
 * Static method to get feedback statistics for a user
 */
FeedbackSchema.statics.getUserStats = async function (
  userId: string,
  periodId?: string
) {
  const match: any = {
    targetUser: new Types.ObjectId(userId),
  };

  if (periodId) {
    match.reviewPeriod = new Types.ObjectId(periodId);
  }

  const stats = await this.aggregate([
    { $match: match },
    {
      $group: {
        _id: '$mulaRating',
        count: { $sum: 1 },
      },
    },
  ]);

  const result = {
    golden_mula: 0,
    fresh_carrot: 0,
    rotten_tomato: 0,
    total: 0,
  };

  stats.forEach((stat) => {
    result[stat._id as MulaRating] = stat.count;
    result.total += stat.count;
  });

  return result;
};

/**
 * Static method to get average ratings for a user
 */
FeedbackSchema.statics.getUserAverageRatings = async function (
  userId: string,
  periodId?: string
) {
  const match: any = {
    targetUser: new Types.ObjectId(userId),
  };

  if (periodId) {
    match.reviewPeriod = new Types.ObjectId(periodId);
  }

  const result = await this.aggregate([
    { $match: match },
    {
      $group: {
        _id: null,
        avgWorkQuality: { $avg: '$ratings.workQuality.score' },
        avgCommunication: { $avg: '$ratings.communication.score' },
        avgTeamBehavior: { $avg: '$ratings.teamBehavior.score' },
        avgAccountability: { $avg: '$ratings.accountability.score' },
        avgOverall: { $avg: '$ratings.overall.score' },
        count: { $sum: 1 },
      },
    },
  ]);

  if (result.length === 0) {
    return {
      workQuality: 0,
      communication: 0,
      teamBehavior: 0,
      accountability: 0,
      overall: 0,
      count: 0,
    };
  }

  const stats = result[0];
  return {
    workQuality: Math.round(stats.avgWorkQuality * 10) / 10,
    communication: Math.round(stats.avgCommunication * 10) / 10,
    teamBehavior: Math.round(stats.avgTeamBehavior * 10) / 10,
    accountability: Math.round(stats.avgAccountability * 10) / 10,
    overall: Math.round(stats.avgOverall * 10) / 10,
    count: stats.count,
  };
};

/**
 * Ensure virtuals are included in JSON output
 */
FeedbackSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    // Remove sensitive fields from JSON output
    const { reviewerFingerprint, reviewerIpHash, __v, ...rest } = ret;
    return rest;
  },
});

FeedbackSchema.set('toObject', {
  virtuals: true,
});

/**
 * Feedback Model
 * Export as singleton to prevent model recompilation
 */
const Feedback: Model<IFeedback> =
  mongoose.models.Feedback ||
  mongoose.model<IFeedback>('Feedback', FeedbackSchema);

export default Feedback;

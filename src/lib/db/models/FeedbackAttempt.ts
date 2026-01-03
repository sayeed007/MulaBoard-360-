import mongoose, { Schema, Model, Document, Types } from 'mongoose';

/**
 * Attempt Status Type
 */
export type AttemptStatus = 'completed' | 'blocked' | 'rate_limited';

/**
 * Feedback Attempt Interface
 * Used for spam prevention and rate limiting
 */
export interface IFeedbackAttempt extends Document {
  // Identification
  fingerprint: string;
  ipHash: string;

  // Target
  targetUser: Types.ObjectId;
  reviewPeriod: Types.ObjectId;

  // Status
  status: AttemptStatus;
  blockReason?: string;

  // Metadata
  createdAt: Date;
}

/**
 * Feedback Attempt Schema
 */
const FeedbackAttemptSchema = new Schema<IFeedbackAttempt>(
  {
    // Identification
    fingerprint: {
      type: String,
      required: [true, 'Fingerprint is required'],
      index: true,
    },
    ipHash: {
      type: String,
      required: [true, 'IP hash is required'],
      index: true,
    },

    // Target
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

    // Status
    status: {
      type: String,
      enum: {
        values: ['completed', 'blocked', 'rate_limited'],
        message: '{VALUE} is not a valid status',
      },
      required: [true, 'Status is required'],
      index: true,
    },
    blockReason: {
      type: String,
      trim: true,
      maxlength: [200, 'Block reason cannot exceed 200 characters'],
    },

    // Metadata (only createdAt, no updatedAt needed)
    createdAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: false, // We only need createdAt
    collection: 'feedback_attempts',
  }
);

/**
 * Indexes for performance optimization
 */
// Compound index for fingerprint + targetUser + reviewPeriod
FeedbackAttemptSchema.index({
  fingerprint: 1,
  targetUser: 1,
  reviewPeriod: 1,
});

// Compound index for IP hash + createdAt (for time-based queries)
FeedbackAttemptSchema.index({ ipHash: 1, createdAt: 1 });

// TTL index - automatically delete documents after 1 year
FeedbackAttemptSchema.index(
  { createdAt: 1 },
  { expireAfterSeconds: 31536000 } // 365 days
);

/**
 * Static method to check if feedback can be submitted
 */
FeedbackAttemptSchema.statics.canSubmitFeedback = async function (
  fingerprint: string,
  ipHash: string,
  targetUserId: string,
  reviewPeriodId: string
): Promise<{
  allowed: boolean;
  reason?: string;
  message?: string;
}> {
  // Check 1: Has this fingerprint already submitted for this user + period?
  const existingByFingerprint = await this.findOne({
    fingerprint,
    targetUser: new Types.ObjectId(targetUserId),
    reviewPeriod: new Types.ObjectId(reviewPeriodId),
    status: 'completed',
  });

  if (existingByFingerprint) {
    return {
      allowed: false,
      reason: 'already_submitted',
      message:
        'You have already submitted feedback for this person in this review period.',
    };
  }

  // Check 2: Has this IP submitted too many times in the last hour?
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  const recentByIP = await this.countDocuments({
    ipHash,
    createdAt: { $gte: oneHourAgo },
    status: 'completed',
  });

  const IP_HOURLY_LIMIT = 5;
  if (recentByIP >= IP_HOURLY_LIMIT) {
    return {
      allowed: false,
      reason: 'ip_rate_limited',
      message: 'Too many feedback submissions from your location. Please try again later.',
    };
  }

  // Check 3: Has this fingerprint submitted too many times in the last hour?
  const recentByFingerprint = await this.countDocuments({
    fingerprint,
    createdAt: { $gte: oneHourAgo },
    status: 'completed',
  });

  const FINGERPRINT_HOURLY_LIMIT = 10;
  if (recentByFingerprint >= FINGERPRINT_HOURLY_LIMIT) {
    return {
      allowed: false,
      reason: 'fingerprint_rate_limited',
      message: 'Too many feedback submissions. Please try again later.',
    };
  }

  // All checks passed
  return { allowed: true };
};

/**
 * Static method to record a feedback attempt
 */
FeedbackAttemptSchema.statics.recordAttempt = async function (
  fingerprint: string,
  ipHash: string,
  targetUserId: string,
  reviewPeriodId: string,
  status: AttemptStatus,
  blockReason?: string
): Promise<IFeedbackAttempt> {
  return await this.create({
    fingerprint,
    ipHash,
    targetUser: new Types.ObjectId(targetUserId),
    reviewPeriod: new Types.ObjectId(reviewPeriodId),
    status,
    blockReason,
  });
};

/**
 * Static method to get attempt statistics
 */
FeedbackAttemptSchema.statics.getAttemptStats = async function (
  periodId?: string
): Promise<{
  total: number;
  completed: number;
  blocked: number;
  rateLimited: number;
}> {
  const match: any = {};

  if (periodId) {
    match.reviewPeriod = new Types.ObjectId(periodId);
  }

  const stats = await this.aggregate([
    { $match: match },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
      },
    },
  ]);

  const result = {
    total: 0,
    completed: 0,
    blocked: 0,
    rateLimited: 0,
  };

  stats.forEach((stat) => {
    const status = stat._id as AttemptStatus;
    if (status === 'completed') result.completed = stat.count;
    else if (status === 'blocked') result.blocked = stat.count;
    else if (status === 'rate_limited') result.rateLimited = stat.count;
    result.total += stat.count;
  });

  return result;
};

/**
 * Static method to get recent attempts by fingerprint
 */
FeedbackAttemptSchema.statics.getRecentAttemptsByFingerprint = async function (
  fingerprint: string,
  hours: number = 24
): Promise<IFeedbackAttempt[]> {
  const since = new Date(Date.now() - hours * 60 * 60 * 1000);

  return await this.find({
    fingerprint,
    createdAt: { $gte: since },
  }).sort({ createdAt: -1 });
};

/**
 * Static method to get recent attempts by IP
 */
FeedbackAttemptSchema.statics.getRecentAttemptsByIP = async function (
  ipHash: string,
  hours: number = 24
): Promise<IFeedbackAttempt[]> {
  const since = new Date(Date.now() - hours * 60 * 60 * 1000);

  return await this.find({
    ipHash,
    createdAt: { $gte: since },
  }).sort({ createdAt: -1 });
};

/**
 * Ensure virtuals are included in JSON output
 */
FeedbackAttemptSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret.__v;
    // Keep fingerprint and ipHash hidden in JSON output for privacy
    delete ret.fingerprint;
    delete ret.ipHash;
    return ret;
  },
});

FeedbackAttemptSchema.set('toObject', {
  virtuals: true,
});

/**
 * Feedback Attempt Model
 * Export as singleton to prevent model recompilation
 */
const FeedbackAttempt: Model<IFeedbackAttempt> =
  mongoose.models.FeedbackAttempt ||
  mongoose.model<IFeedbackAttempt>('FeedbackAttempt', FeedbackAttemptSchema);

export default FeedbackAttempt;

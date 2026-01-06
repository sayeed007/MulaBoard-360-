import mongoose, { Schema, Model, Document } from 'mongoose';

/**
 * Review Period Interface
 * Represents a time-bound review cycle (e.g., Annual Review 2025)
 */
export interface IReviewPeriod extends Document {
  // Period Details
  name: string;
  slug: string;

  // Date Range
  startDate: Date;
  endDate: Date;

  // Status
  isActive: boolean;

  // Fun Theme for this Period
  theme: {
    name: string;
    primaryEmoji: string;
    backgroundColor?: string;
  };

  // Metadata
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Static methods interface
 */
export interface IReviewPeriodModel extends Model<IReviewPeriod> {
  getActivePeriod(): Promise<IReviewPeriod | null>;
  activatePeriod(periodId: string): Promise<IReviewPeriod | null>;
}


/**
 * Review Period Schema
 */
const ReviewPeriodSchema = new Schema<IReviewPeriod>(
  {
    // Period Details
    name: {
      type: String,
      required: [true, 'Period name is required'],
      trim: true,
      maxlength: [100, 'Period name cannot exceed 100 characters'],
    },
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        'Slug can only contain lowercase letters, numbers, and hyphens',
      ],
      index: true,
    },

    // Date Range
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
      index: true,
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required'],
      validate: {
        validator: function (value: Date) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          return value > (this as any).startDate;
        },
        message: 'End date must be after start date',
      },
      index: true,
    },

    // Status
    isActive: {
      type: Boolean,
      default: false,
      index: true,
    },

    // Fun Theme
    theme: {
      name: {
        type: String,
        required: [true, 'Theme name is required'],
        trim: true,
        default: 'The Mula Season',
      },
      primaryEmoji: {
        type: String,
        default: '🌿',
        maxlength: [10, 'Emoji cannot exceed 10 characters'],
      },
      backgroundColor: {
        type: String,
        default: '#f0fdf4',
        match: [
          /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
          'Please provide a valid hex color code',
        ],
      },
    },
  },
  {
    timestamps: true,
    collection: 'review_periods',
  }
);

/**
 * Indexes for performance optimization
 */
// Note: slug, isActive already have index: true in field definitions
// Only add compound indexes here
ReviewPeriodSchema.index({ startDate: 1, endDate: 1 }); // Compound index for date range queries


/**
 * Virtual to check if period is currently active (within date range)
 */
ReviewPeriodSchema.virtual('isCurrentlyActive').get(function () {
  const now = new Date();
  return this.isActive && now >= this.startDate && now <= this.endDate;
});

/**
 * Virtual for period duration in days
 */
ReviewPeriodSchema.virtual('durationDays').get(function () {
  const diffTime = Math.abs(this.endDate.getTime() - this.startDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
});

/**
 * Virtual for days remaining (if active)
 */
ReviewPeriodSchema.virtual('daysRemaining').get(function () {
  if (!this.isActive) return 0;
  const now = new Date();
  if (now > this.endDate) return 0;
  const diffTime = this.endDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
});

/**
 * Static method to get active period
 */
ReviewPeriodSchema.statics.getActivePeriod = async function (): Promise<IReviewPeriod | null> {
  return await this.findOne({ isActive: true });
};

/**
 * Static method to deactivate all other periods before activating one
 */
ReviewPeriodSchema.statics.activatePeriod = async function (
  periodId: string
): Promise<IReviewPeriod | null> {
  // Deactivate all periods
  await this.updateMany({}, { isActive: false });

  // Activate the specified period
  return await this.findByIdAndUpdate(
    periodId,
    { isActive: true },
    { new: true }
  );
};

/**
 * Pre-save middleware to ensure only one active period
 */
ReviewPeriodSchema.pre('save', async function () {
  if (this.isModified('isActive') && this.isActive) {
    // If this period is being set to active, deactivate all others
    await mongoose.model('ReviewPeriod').updateMany(
      { _id: { $ne: this._id } },
      { isActive: false }
    );
  }
});

/**
 * Ensure virtuals are included in JSON output
 */
ReviewPeriodSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    const { __v, ...rest } = ret;
    return rest;
  },
});

ReviewPeriodSchema.set('toObject', {
  virtuals: true,
});

/**
 * Review Period Model
 * Export as singleton to prevent model recompilation
 */
const ReviewPeriod: IReviewPeriodModel =
  (mongoose.models.ReviewPeriod as IReviewPeriodModel) ||
  mongoose.model<IReviewPeriod, IReviewPeriodModel>('ReviewPeriod', ReviewPeriodSchema);

export default ReviewPeriod;

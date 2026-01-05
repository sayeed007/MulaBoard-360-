import mongoose, { Schema, Model, Document } from 'mongoose';

/**
 * Quote Category Type
 */
export type QuoteCategory =
  | 'landing'
  | 'feedback_form'
  | 'success'
  | 'profile'
  | 'admin'
  | 'error'
  | 'loading';

/**
 * Quote Mood Type
 */
export type QuoteMood = 'funny' | 'motivational' | 'sarcastic' | 'wise';

/**
 * Funny Quote Interface
 */
export interface IFunnyQuote extends Document {
  // Content
  text: string;
  textBn?: string; // Bengali version

  // Categorization
  category: QuoteCategory;
  mood: QuoteMood;

  // Status
  isActive: boolean;
  displayCount: number; // Track popularity/usage

  // Metadata
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Funny Quote Schema
 */
const FunnyQuoteSchema = new Schema<IFunnyQuote>(
  {
    // Content
    text: {
      type: String,
      required: [true, 'Quote text is required'],
      trim: true,
      minlength: [10, 'Quote must be at least 10 characters'],
      maxlength: [500, 'Quote cannot exceed 500 characters'],
    },
    textBn: {
      type: String,
      trim: true,
      maxlength: [500, 'Bengali quote cannot exceed 500 characters'],
      default: '',
    },

    // Categorization
    category: {
      type: String,
      enum: {
        values: [
          'landing',
          'feedback_form',
          'success',
          'profile',
          'admin',
          'error',
          'loading',
        ],
        message: '{VALUE} is not a valid quote category',
      },
      required: [true, 'Category is required'],
      index: true,
    },
    mood: {
      type: String,
      enum: {
        values: ['funny', 'motivational', 'sarcastic', 'wise'],
        message: '{VALUE} is not a valid mood',
      },
      required: [true, 'Mood is required'],
      index: true,
    },

    // Status
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    displayCount: {
      type: Number,
      default: 0,
      min: [0, 'Display count cannot be negative'],
    },
  },
  {
    timestamps: true,
    collection: 'funny_quotes',
  }
);

/**
 * Indexes for performance optimization
 */
FunnyQuoteSchema.index({ category: 1, isActive: 1 }); // Compound index for filtering
FunnyQuoteSchema.index({ mood: 1 });
FunnyQuoteSchema.index({ displayCount: -1 }); // For sorting by popularity
FunnyQuoteSchema.index({ createdAt: -1 });

/**
 * Static method to get a random quote by category
 */
FunnyQuoteSchema.statics.getRandomQuote = async function (
  category: QuoteCategory,
  mood?: QuoteMood
): Promise<IFunnyQuote | null> {
  const query: any = {
    category,
    isActive: true,
  };

  if (mood) {
    query.mood = mood;
  }

  // Get count of matching quotes
  const count = await this.countDocuments(query);

  if (count === 0) return null;

  // Get random quote
  const random = Math.floor(Math.random() * count);
  const quote = await this.findOne(query).skip(random);

  // Increment display count
  if (quote) {
    await this.findByIdAndUpdate(quote._id, {
      $inc: { displayCount: 1 },
    });
  }

  return quote;
};

/**
 * Static method to get multiple random quotes
 */
FunnyQuoteSchema.statics.getRandomQuotes = async function (
  category: QuoteCategory,
  limit: number = 5,
  mood?: QuoteMood
): Promise<IFunnyQuote[]> {
  const query: any = {
    category,
    isActive: true,
  };

  if (mood) {
    query.mood = mood;
  }

  // Use MongoDB aggregation to get random quotes
  const quotes = await this.aggregate([
    { $match: query },
    { $sample: { size: limit } },
  ]);

  // Increment display count for all returned quotes
  const quoteIds = quotes.map((q) => q._id);
  if (quoteIds.length > 0) {
    await this.updateMany(
      { _id: { $in: quoteIds } },
      { $inc: { displayCount: 1 } }
    );
  }

  return quotes;
};

/**
 * Static method to get most popular quotes
 */
FunnyQuoteSchema.statics.getPopularQuotes = async function (
  limit: number = 10
): Promise<IFunnyQuote[]> {
  return await this.find({ isActive: true })
    .sort({ displayCount: -1 })
    .limit(limit);
};

/**
 * Static method to get quotes by mood
 */
FunnyQuoteSchema.statics.getQuotesByMood = async function (
  mood: QuoteMood,
  limit?: number
): Promise<IFunnyQuote[]> {
  const query = this.find({ mood, isActive: true }).sort({ createdAt: -1 });

  if (limit) {
    query.limit(limit);
  }

  return await query;
};

/**
 * Instance method to increment display count
 */
FunnyQuoteSchema.methods.incrementDisplayCount = async function (): Promise<void> {
  this.displayCount += 1;
  await this.save();
};

/**
 * Virtual to check if quote has Bengali translation
 */
FunnyQuoteSchema.virtual('hasBengaliVersion').get(function () {
  return Boolean(this.textBn && this.textBn.length > 0);
});

/**
 * Ensure virtuals are included in JSON output
 */
FunnyQuoteSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    const { __v, ...rest } = ret;
    return rest;
  },
});

FunnyQuoteSchema.set('toObject', {
  virtuals: true,
});

/**
 * Funny Quote Model
 * Export as singleton to prevent model recompilation
 */
const FunnyQuote: Model<IFunnyQuote> =
  mongoose.models.FunnyQuote ||
  mongoose.model<IFunnyQuote>('FunnyQuote', FunnyQuoteSchema);

export default FunnyQuote;

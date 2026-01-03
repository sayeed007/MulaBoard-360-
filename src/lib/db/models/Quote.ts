import mongoose, { Schema, Document } from 'mongoose';

/**
 * Quote Interface
 */
export interface IQuote extends Document {
  text: string;
  textBn?: string;
  category: 'landing' | 'feedback_form' | 'success' | 'profile' | 'admin' | 'error' | 'loading';
  mood: 'funny' | 'motivational' | 'sarcastic' | 'wise';
  isActive: boolean;
  displayCount: number;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Quote Schema
 */
const QuoteSchema = new Schema<IQuote>(
  {
    text: {
      type: String,
      required: [true, 'Quote text is required'],
      trim: true,
      minlength: [10, 'Quote must be at least 10 characters'],
      maxlength: [500, 'Quote must be at most 500 characters'],
    },
    textBn: {
      type: String,
      trim: true,
      maxlength: [500, 'Bengali quote must be at most 500 characters'],
    },
    category: {
      type: String,
      enum: ['landing', 'feedback_form', 'success', 'profile', 'admin', 'error', 'loading'],
      required: [true, 'Category is required'],
    },
    mood: {
      type: String,
      enum: ['funny', 'motivational', 'sarcastic', 'wise'],
      required: [true, 'Mood is required'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    displayCount: {
      type: Number,
      default: 0,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
QuoteSchema.index({ isActive: 1 });
QuoteSchema.index({ category: 1 });
QuoteSchema.index({ mood: 1 });
QuoteSchema.index({ displayCount: 1 });

const Quote = mongoose.models.Quote || mongoose.model<IQuote>('Quote', QuoteSchema);

export default Quote;

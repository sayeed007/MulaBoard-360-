import mongoose, { Schema, Model, Document } from 'mongoose';
import { hashPassword, comparePassword } from '@/lib/utils/hash';

/**
 * User Interface
 * Represents a registered employee in the system
 */
export interface IUser extends Document {
  // Authentication
  email: string;
  password: string;
  role: 'employee' | 'admin';

  // Profile Information
  fullName: string;
  designation: string;
  department: string;
  profileImage?: string;
  bio?: string;

  // Public Access
  publicSlug: string;
  isProfileActive: boolean;

  // Settings
  settings: {
    emailNotifications: boolean;
    showAggregatePublicly: boolean;
  };

  // Metadata
  createdAt: Date;
  updatedAt: Date;

  // Methods
  comparePassword(candidatePassword: string): Promise<boolean>;
}

/**
 * User Schema
 */
const UserSchema = new Schema<IUser>(
  {
    // Authentication
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        'Please provide a valid email address',
      ],
      index: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false, // Don't return password by default
    },
    role: {
      type: String,
      enum: {
        values: ['employee', 'admin'],
        message: '{VALUE} is not a valid role',
      },
      default: 'employee',
      index: true,
    },

    // Profile Information
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      minlength: [2, 'Full name must be at least 2 characters'],
      maxlength: [100, 'Full name cannot exceed 100 characters'],
    },
    designation: {
      type: String,
      required: [true, 'Designation is required'],
      trim: true,
      maxlength: [100, 'Designation cannot exceed 100 characters'],
    },
    department: {
      type: String,
      required: [true, 'Department is required'],
      trim: true,
      maxlength: [100, 'Department cannot exceed 100 characters'],
    },
    profileImage: {
      type: String,
      default: '',
      match: [
        /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-./?%&=]*)?$/,
        'Please provide a valid URL',
      ],
    },
    bio: {
      type: String,
      trim: true,
      maxlength: [200, 'Bio cannot exceed 200 characters'],
      default: '',
    },

    // Public Access
    publicSlug: {
      type: String,
      required: [true, 'Public slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        'Slug can only contain lowercase letters, numbers, and hyphens',
      ],
      index: true,
    },
    isProfileActive: {
      type: Boolean,
      default: true,
      index: true,
    },

    // Settings
    settings: {
      emailNotifications: {
        type: Boolean,
        default: true,
      },
      showAggregatePublicly: {
        type: Boolean,
        default: false,
      },
    },
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt
    collection: 'users',
  }
);

/**
 * Pre-save middleware to hash password
 * Only hashes if password is modified or new
 */
UserSchema.pre('save', async function (next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) {
    return next();
  }

  try {
    // Hash password with bcrypt (12 rounds)
    this.password = await hashPassword(this.password, 12);
    next();
  } catch (error) {
    next(error as Error);
  }
});

/**
 * Method to compare password for authentication
 */
UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  try {
    return await comparePassword(candidatePassword, this.password);
  } catch (error) {
    return false;
  }
};

/**
 * Indexes for performance optimization
 */
UserSchema.index({ email: 1 }); // Already defined as unique
UserSchema.index({ publicSlug: 1 }); // Already defined as unique
UserSchema.index({ role: 1 });
UserSchema.index({ isProfileActive: 1 });
UserSchema.index({ department: 1 }); // For filtering by department
UserSchema.index({ createdAt: -1 }); // For sorting by registration date

/**
 * Virtual for full profile URL
 */
UserSchema.virtual('profileUrl').get(function () {
  return `${process.env.NEXT_PUBLIC_APP_URL}/${this.publicSlug}`;
});

/**
 * Ensure virtuals are included in JSON output
 */
UserSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    // Remove sensitive fields from JSON output
    delete ret.password;
    delete ret.__v;
    return ret;
  },
});

UserSchema.set('toObject', {
  virtuals: true,
});

/**
 * User Model
 * Export as singleton to prevent model recompilation in development
 */
const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;

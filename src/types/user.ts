/**
 * User Types
 */

export type UserRole = 'employee' | 'admin';

export interface UserSettings {
  emailNotifications: boolean;
  showAggregatePublicly: boolean;
}

export interface UserProfile {
  fullName: string;
  designation: string;
  department: string;
  profileImage?: string;
  bio?: string;
}

export interface User {
  _id: string;
  email: string;
  role: UserRole;
  fullName: string;
  designation: string;
  department: string;
  profileImage?: string;
  bio?: string;
  publicSlug: string;
  isProfileActive: boolean;
  settings: UserSettings;
  createdAt: string;
  updatedAt: string;
  profileUrl?: string; // Virtual field
}

export interface UserWithPassword extends User {
  password: string;
}

export interface PublicUserProfile {
  fullName: string;
  designation: string;
  department: string;
  profileImage?: string;
  bio?: string;
  publicSlug: string;
  settings: {
    showAggregatePublicly: boolean;
  };
}

// Form data types
export interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  designation: string;
  department: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface UpdateProfileFormData {
  fullName: string;
  designation: string;
  department: string;
  bio?: string;
  profileImage?: string;
}

export interface UpdateSettingsFormData {
  emailNotifications: boolean;
  showAggregatePublicly: boolean;
}

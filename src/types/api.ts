/**
 * API Response Types
 */

// Generic API Response
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Paginated Response
export interface PaginatedResponse<T = any> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
}

// Error Response
export interface ApiError {
  success: false;
  error: string;
  message: string;
  statusCode?: number;
  details?: any;
}

// Feedback Eligibility Check Response
export interface FeedbackEligibilityResponse {
  allowed: boolean;
  reason?: string;
  message?: string;
}

// Session User (from NextAuth)
export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: 'employee' | 'admin';
  image?: string;
}

// Upload Response
export interface UploadResponse {
  success: boolean;
  url?: string;
  publicId?: string;
  error?: string;
}

// Admin Statistics Response
export interface AdminStatsResponse {
  users: {
    total: number;
    employees: number;
    admins: number;
    activeProfiles: number;
  };
  feedbacks: {
    total: number;
    pending: number;
    approved: number;
    flagged: number;
  };
  periods: {
    total: number;
    active: number;
  };
  quotes: {
    total: number;
    active: number;
  };
  recentActivity: {
    newUsers: number;
    newFeedbacks: number;
  };
}

// Query Parameters
export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface FilterParams {
  category?: string;
  mood?: string;
  isActive?: boolean;
  visibility?: string;
  mulaRating?: string;
  role?: string;
  department?: string;
}

export interface SortParams {
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface QueryParams extends PaginationParams, FilterParams, SortParams {
  search?: string;
}

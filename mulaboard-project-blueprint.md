# MulaBoard - 360° Anonymous Feedback Platform

## Complete Project Blueprint

**Version:** 1.0  
**Created:** January 2025  
**Author:** Sayeed Hossen  
**Status:** Planning Phase

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [System Architecture](#system-architecture)
4. [Database Schema](#database-schema)
5. [Fun Rating System - The Mula Meter](#fun-rating-system---the-mula-meter)
6. [Spam Prevention Strategy](#spam-prevention-strategy)
7. [Page Structure & Routes](#page-structure--routes)
8. [Fun Features](#fun-features)
9. [UI/UX Design](#uiux-design)
10. [Project Folder Structure](#project-folder-structure)
11. [Environment Variables](#environment-variables)
12. [API Routes](#api-routes)
13. [Sample Data - Funny Quotes](#sample-data---funny-quotes)
14. [Development Timeline](#development-timeline)
15. [Deployment Checklist](#deployment-checklist)

---

## Project Overview

### What is MulaBoard?

MulaBoard is a 360-degree anonymous feedback platform designed for annual salary reviews and performance evaluations. It allows anyone to provide anonymous feedback to registered employees while maintaining professionalism with a touch of humor.

### Core Features

- **Employee Registration:** Users register with authentication and profile details
- **Anonymous Feedback:** Anyone can provide feedback without logging in
- **Rating System:** 1-5 scale across 5 key performance areas
- **Fun Mula Rating:** Visual rating system (Golden Mula 🌿, Fresh Carrot 🥕, Rotten Tomato 🍅)
- **Admin Moderation:** Super admin can monitor and moderate all feedback
- **Review Periods:** Flexible yearly/half-yearly review cycles
- **Privacy Controls:** Employees can make individual feedback public or keep private

### System Name Alternatives

| Name | Vibe |
|------|------|
| **MulaBoard** | Bengali humor, memorable ✓ (Selected) |
| **360Mula** | Direct + fun |
| **ReviewRoulette** | Playful, implies variety |
| **FeedbackBazaar** | Marketplace of opinions |
| **The Honest Carrot** | Quirky, memorable |

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend + Backend** | Next.js 14+ (App Router) | Full-stack framework |
| **Database** | MongoDB Atlas + Mongoose | Data persistence |
| **Authentication** | NextAuth.js v5 (Auth.js) | User authentication |
| **Image Storage** | Cloudinary | Profile image hosting |
| **Styling** | Tailwind CSS + shadcn/ui | UI components |
| **Rate Limiting** | Upstash Redis | Serverless rate limiting |
| **Captcha** | hCaptcha | Privacy-friendly bot prevention |
| **Fingerprinting** | FingerprintJS | Browser identification |
| **Deployment** | Vercel | Hosting platform |

---

## System Architecture

### User Roles & Permissions

```
┌─────────────────────┐     ┌─────────────────────┐     ┌─────────────────────┐
│   Anonymous         │     │   Registered        │     │   Super Admin       │
│   Reviewer          │     │   Employee          │     │                     │
├─────────────────────┤     ├─────────────────────┤     ├─────────────────────┤
│ • Give feedback     │     │ • Register/Login    │     │ • View all users    │
│ • No login required │     │ • Edit profile      │     │ • Moderate feedback │
│ • Rate 1-5 scale    │     │ • View own feedback │     │ • Delete content    │
│ • One feedback per  │     │ • Toggle visibility │     │ • Manage periods    │
│   user per period   │     │ • Add reactions     │     │ • Manage quotes     │
│                     │     │ • Earn badges       │     │ • Full CRUD access  │
└─────────────────────┘     └─────────────────────┘     └─────────────────────┘
```

### Data Flow

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  Anonymous   │────▶│  Feedback    │────▶│  Employee    │
│  Reviewer    │     │  Submission  │     │  Dashboard   │
└──────────────┘     └──────────────┘     └──────────────┘
       │                    │                    │
       ▼                    ▼                    ▼
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│ Fingerprint  │     │   MongoDB    │     │ Mula Meter   │
│ + hCaptcha   │     │   Storage    │     │ Calculation  │
└──────────────┘     └──────────────┘     └──────────────┘
                            │
                            ▼
                    ┌──────────────┐
                    │    Admin     │
                    │  Moderation  │
                    └──────────────┘
```

---

## Database Schema

### 1. User Schema

```typescript
interface IUser {
  _id: ObjectId;
  
  // Authentication
  email: string;
  password: string; // bcrypt hashed
  role: 'employee' | 'admin';
  
  // Profile Information
  fullName: string;
  designation: string;
  department: string;
  profileImage: string; // Cloudinary URL
  bio?: string; // Short intro (optional, max 200 chars)
  
  // Public Access
  publicSlug: string; // unique, URL-friendly (e.g., "sayeed-hossen")
  isProfileActive: boolean; // Can receive feedback?
  
  // Settings
  settings: {
    emailNotifications: boolean;
    showAggregatePublicly: boolean; // Show avg scores on public profile
  };
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
}

// Indexes
// - email: unique
// - publicSlug: unique
// - role: 1
// - isProfileActive: 1
```

### 2. Review Period Schema

```typescript
interface IReviewPeriod {
  _id: ObjectId;
  
  // Period Details
  name: string; // "Annual Review 2025", "Mid-Year 2025"
  slug: string; // "annual-2025", "mid-year-2025"
  
  // Date Range
  startDate: Date;
  endDate: Date;
  
  // Status
  isActive: boolean;
  
  // Fun Theme for this Period
  theme: {
    name: string; // "The Mula Season 🌿"
    primaryEmoji: string; // "🌿"
    backgroundColor?: string; // "#f0fdf4"
  };
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
}

// Indexes
// - slug: unique
// - isActive: 1
// - startDate: 1, endDate: 1
```

### 3. Feedback Schema

```typescript
interface IFeedback {
  _id: ObjectId;
  
  // Relations
  targetUser: ObjectId; // Who is being reviewed (ref: User)
  reviewPeriod: ObjectId; // Which review period (ref: ReviewPeriod)
  
  // Reviewer Identity (for spam prevention, NOT displayed to anyone)
  reviewerFingerprint: string; // FingerprintJS visitor ID
  reviewerIpHash: string; // SHA-256 hashed IP (privacy-preserving)
  
  // The 5 Rating Categories (1-5 scale)
  ratings: {
    workQuality: {
      score: number; // 1-5
      comment?: string; // Optional explanation
    };
    communication: {
      score: number;
      comment?: string;
    };
    teamBehavior: {
      score: number;
      comment?: string;
    };
    accountability: {
      score: number;
      comment?: string;
    };
    overall: {
      score: number;
      comment?: string;
    };
  };
  
  // Required Text Feedback
  strengths: string; // min 20 chars, max 500 chars
  improvements: string; // min 20 chars, max 500 chars
  
  // Fun Rating (auto-calculated based on average score)
  mulaRating: 'golden_mula' | 'fresh_carrot' | 'rotten_tomato';
  
  // Visibility Control (Employee controls this)
  visibility: 'private' | 'public';
  
  // Moderation
  moderation: {
    status: 'pending' | 'approved' | 'flagged';
    moderatedBy?: ObjectId; // ref: User (admin)
    moderatedAt?: Date;
    removedFields?: string[]; // Which fields were censored
    originalContent?: Record<string, string>; // Backup before admin edit
    moderationNote?: string; // Internal note for admins
  };
  
  // Employee Reaction (optional)
  employeeReaction?: 'thanks' | 'noted' | 'ouch' | 'fair_enough';
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
}

// Indexes
// - targetUser: 1, reviewPeriod: 1
// - reviewerFingerprint: 1, targetUser: 1, reviewPeriod: 1 (compound, unique)
// - moderation.status: 1
// - visibility: 1
// - mulaRating: 1
```

### 4. Funny Quote Schema

```typescript
interface IFunnyQuote {
  _id: ObjectId;
  
  // Content
  text: string; // English version
  textBn?: string; // Bengali version (optional)
  
  // Categorization
  category: 
    | 'landing' // Homepage
    | 'feedback_form' // While giving feedback
    | 'success' // After submitting feedback
    | 'profile' // On user profiles
    | 'admin' // Admin dashboard
    | 'error' // Error pages
    | 'loading'; // Loading states
  
  mood: 'funny' | 'motivational' | 'sarcastic' | 'wise';
  
  // Status
  isActive: boolean;
  displayCount: number; // Track popularity/usage
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
}

// Indexes
// - category: 1, isActive: 1
// - mood: 1
```

### 5. Feedback Attempt Schema (Spam Prevention)

```typescript
interface IFeedbackAttempt {
  _id: ObjectId;
  
  // Identification
  fingerprint: string; // FingerprintJS visitor ID
  ipHash: string; // SHA-256 hashed IP
  
  // Target
  targetUser: ObjectId; // ref: User
  reviewPeriod: ObjectId; // ref: ReviewPeriod
  
  // Status
  status: 'completed' | 'blocked' | 'rate_limited';
  blockReason?: string;
  
  // Metadata
  createdAt: Date;
}

// Indexes
// - fingerprint: 1, targetUser: 1, reviewPeriod: 1 (compound)
// - ipHash: 1, createdAt: 1
// - createdAt: 1 (TTL index: auto-delete after 1 year)
```

---

## Fun Rating System - The Mula Meter

### Rating Definitions

```typescript
const MULA_RATINGS = {
  golden_mula: {
    emoji: '🌿',
    label: 'Golden Mula',
    labelBn: 'সোনার মুলা',
    description: 'Outstanding performer!',
    descriptionBn: 'অসাধারণ পারফরমার!',
    scoreRange: [4.5, 5.0],
    color: '#FFD700', // Gold
    bgColor: '#FEF9C3', // Light yellow
    animation: 'sparkle'
  },
  fresh_carrot: {
    emoji: '🥕',
    label: 'Fresh Carrot',
    labelBn: 'টাটকা গাজর',
    description: 'Solid contributor!',
    descriptionBn: 'ভালো অবদানকারী!',
    scoreRange: [3.0, 4.4],
    color: '#FF6B35', // Orange
    bgColor: '#FED7AA', // Light orange
    animation: 'bounce'
  },
  rotten_tomato: {
    emoji: '🍅',
    label: 'Rotten Tomato',
    labelBn: 'পচা টমেটো',
    description: 'Room for growth...',
    descriptionBn: 'উন্নতির সুযোগ আছে...',
    scoreRange: [1.0, 2.9],
    color: '#DC2626', // Red
    bgColor: '#FECACA', // Light red
    animation: 'shake'
  }
};
```

### Auto-Calculation Logic

```typescript
function calculateMulaRating(ratings: IRatings): MulaRating {
  const scores = [
    ratings.workQuality.score,
    ratings.communication.score,
    ratings.teamBehavior.score,
    ratings.accountability.score,
    ratings.overall.score
  ];
  
  const average = scores.reduce((sum, score) => sum + score, 0) / scores.length;
  
  if (average >= 4.5) return 'golden_mula';
  if (average >= 3.0) return 'fresh_carrot';
  return 'rotten_tomato';
}

function getMulaMessage(rating: MulaRating, name: string): string {
  const messages = {
    golden_mula: [
      `${name} is cooking with golden mulas! 🌿`,
      `Someone's getting that corner office! 🌿`,
      `${name} = Office MVP 🌿`
    ],
    fresh_carrot: [
      `${name} is on the right track! 🥕`,
      `Keep growing, almost a Mula! 🥕`,
      `Solid work, ${name}! 🥕`
    ],
    rotten_tomato: [
      `${name} has some growth opportunities 🍅`,
      `Room to improve, but we believe! 🍅`,
      `Every tomato can become a mula! 🍅`
    ]
  };
  
  const options = messages[rating];
  return options[Math.floor(Math.random() * options.length)];
}
```

### Visual Display (ASCII Representation)

```
┌─────────────────────────────────────────┐
│         YOUR MULA METER 2025            │
│                                         │
│     🍅 ────────🥕────────🌿             │
│              ▲                          │
│           You: 3.8                      │
│        "Fresh Carrot!" 🥕               │
│                                         │
│   "Keep growing, almost a Mula!"        │
└─────────────────────────────────────────┘
```

---

## Spam Prevention Strategy

### Multi-Layer Approach

```
Layer 1: Browser Fingerprinting (FingerprintJS)
    ↓
Layer 2: IP Rate Limiting (Upstash Redis)
    ↓
Layer 3: hCaptcha Verification
    ↓
Layer 4: Honeypot Field (Hidden form field)
    ↓
Layer 5: Submission Timing Check (Min 30 seconds)
    ↓
✅ Feedback Accepted
```

### Rate Limiting Configuration

```typescript
const RATE_LIMITS = {
  // Core limit: One feedback per person per user per review period
  feedbackPerUserPerPeriod: 1,
  
  // Hourly limits to prevent mass spamming
  feedbacksPerHourPerIP: 5,
  feedbacksPerHourPerFingerprint: 10,
  
  // Page view limits to prevent scraping
  pageViewsPerMinutePerIP: 30,
  
  // API call limits
  apiCallsPerMinutePerIP: 60
};
```

### Duplicate Prevention Logic

```typescript
async function canSubmitFeedback(
  fingerprint: string,
  ipHash: string,
  targetUserId: string,
  reviewPeriodId: string
): Promise<{ allowed: boolean; reason?: string; message?: string }> {
  
  // Check 1: Same fingerprint already submitted for this user + period
  const existingByFingerprint = await FeedbackAttempt.findOne({
    fingerprint,
    targetUser: targetUserId,
    reviewPeriod: reviewPeriodId,
    status: 'completed'
  });
  
  if (existingByFingerprint) {
    return { 
      allowed: false, 
      reason: 'already_submitted',
      message: 'You have already submitted feedback for this person in this review period.'
    };
  }
  
  // Check 2: Same IP submitted too many times this hour
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  const recentByIP = await FeedbackAttempt.countDocuments({
    ipHash,
    createdAt: { $gte: oneHourAgo }
  });
  
  if (recentByIP >= RATE_LIMITS.feedbacksPerHourPerIP) {
    return { 
      allowed: false, 
      reason: 'rate_limited',
      message: 'Too many feedback submissions. Please try again later.'
    };
  }
  
  // Check 3: Same fingerprint submitted too many times this hour
  const recentByFingerprint = await FeedbackAttempt.countDocuments({
    fingerprint,
    createdAt: { $gte: oneHourAgo }
  });
  
  if (recentByFingerprint >= RATE_LIMITS.feedbacksPerHourPerFingerprint) {
    return { 
      allowed: false, 
      reason: 'rate_limited',
      message: 'Too many feedback submissions. Please try again later.'
    };
  }
  
  return { allowed: true };
}
```

### Honeypot Implementation

```typescript
// In FeedbackForm component
const FeedbackForm = () => {
  const [honeypot, setHoneypot] = useState('');
  
  const handleSubmit = async (data: FeedbackData) => {
    // If honeypot field is filled, it's a bot
    if (honeypot) {
      // Silently reject but show success (confuse bots)
      await fakeDelay(2000);
      return { success: true }; // Fake success
    }
    
    // Actual submission logic
    // ...
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {/* Hidden honeypot field - bots will fill this */}
      <input
        type="text"
        name="website"
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        style={{ 
          position: 'absolute',
          left: '-9999px',
          opacity: 0,
          pointerEvents: 'none'
        }}
        tabIndex={-1}
        autoComplete="off"
      />
      
      {/* Actual form fields */}
    </form>
  );
};
```

### Submission Timing Check

```typescript
const MIN_SUBMISSION_TIME_MS = 30000; // 30 seconds

function validateSubmissionTiming(formLoadTime: number): boolean {
  const submissionTime = Date.now();
  const timeSpent = submissionTime - formLoadTime;
  
  // If form was submitted in less than 30 seconds, likely a bot
  return timeSpent >= MIN_SUBMISSION_TIME_MS;
}
```

---

## Page Structure & Routes

### Route Organization

```
src/app/
│
├── (public)/                           # No auth required
│   ├── page.tsx                        # Landing page
│   ├── login/
│   │   └── page.tsx                    # Employee login
│   ├── register/
│   │   └── page.tsx                    # Employee registration
│   └── [slug]/                         # Dynamic public profile
│       ├── page.tsx                    # Profile + feedback form
│       └── thank-you/
│           └── page.tsx                # Post-submission confirmation
│
├── (authenticated)/                    # Auth required (employees)
│   ├── layout.tsx                      # Shared layout with sidebar
│   ├── dashboard/
│   │   └── page.tsx                    # Employee dashboard
│   ├── profile/
│   │   └── page.tsx                    # Edit own profile
│   ├── my-reviews/
│   │   ├── page.tsx                    # All feedback overview
│   │   └── [periodId]/
│   │       └── page.tsx                # Period-specific feedback
│   └── settings/
│       └── page.tsx                    # Account settings
│
├── (admin)/                            # Admin auth required
│   ├── layout.tsx                      # Admin layout
│   └── admin/
│       ├── page.tsx                    # Admin dashboard
│       ├── users/
│       │   └── page.tsx                # Manage employees
│       ├── feedbacks/
│       │   └── page.tsx                # Moderate feedbacks
│       ├── periods/
│       │   └── page.tsx                # Manage review periods
│       └── quotes/
│           └── page.tsx                # Manage funny quotes
│
├── api/                                # API routes
│   ├── auth/
│   │   └── [...nextauth]/
│   │       └── route.ts                # NextAuth handlers
│   ├── users/
│   │   ├── route.ts                    # GET all, POST create
│   │   └── [id]/
│   │       └── route.ts                # GET, PATCH, DELETE
│   ├── feedback/
│   │   ├── route.ts                    # GET all, POST create
│   │   ├── [id]/
│   │   │   └── route.ts                # GET, PATCH
│   │   ├── check-eligibility/
│   │   │   └── route.ts                # Check if can submit
│   │   └── my/
│   │       └── route.ts                # Get own feedback
│   ├── periods/
│   │   ├── route.ts                    # CRUD
│   │   ├── active/
│   │   │   └── route.ts                # Get current active period
│   │   └── [id]/
│   │       └── route.ts
│   ├── quotes/
│   │   ├── route.ts                    # CRUD
│   │   └── random/
│   │       └── route.ts                # Get random quote
│   └── upload/
│       └── route.ts                    # Cloudinary upload
│
├── layout.tsx                          # Root layout
├── globals.css                         # Global styles
└── not-found.tsx                       # 404 page
```

### Page Descriptions

| Route | Description | Auth |
|-------|-------------|------|
| `/` | Landing page with hero, features, random quote | Public |
| `/login` | Employee login form | Public |
| `/register` | Employee registration with profile setup | Public |
| `/[slug]` | Public profile page + anonymous feedback form | Public |
| `/[slug]/thank-you` | Confirmation after feedback submission | Public |
| `/dashboard` | Employee dashboard with stats, Mula Meter | Employee |
| `/profile` | Edit own profile (name, designation, image) | Employee |
| `/my-reviews` | View all received feedback | Employee |
| `/my-reviews/[periodId]` | Feedback for specific review period | Employee |
| `/settings` | Account settings, notifications, visibility | Employee |
| `/admin` | Admin dashboard with overview stats | Admin |
| `/admin/users` | Manage all employees | Admin |
| `/admin/feedbacks` | Moderate all feedback | Admin |
| `/admin/periods` | Create/manage review periods | Admin |
| `/admin/quotes` | Manage funny quotes | Admin |

---

## Fun Features

### 1. Random Quotes System

```typescript
const QUOTE_PLACEMENTS = {
  landing_hero: [
    "Where anonymous feedback meets accountability.",
    "The only thing worse than being reviewed is not being reviewed at all.",
    "360° reviews: Because everyone deserves to know they talk too much in meetings."
  ],
  
  feedback_form_top: [
    "Be honest, but remember: karma exists. 🙏",
    "This is anonymous. Your chai buddy won't know. Probably.",
    "Constructive criticism only. Save the roasting for Friday lunch."
  ],
  
  success_page: [
    "Your feedback has been delivered. May the Mula be with them. 🌿",
    "Done! Now wash your hands of this and grab some chai.",
    "Your honesty has been recorded. The universe thanks you."
  ],
  
  empty_reviews: [
    "No reviews yet. Either you're new, or everyone's scared. 😅",
    "Your review box is emptier than the office on Friday afternoon.",
    "Crickets... 🦗 Share your profile link to get some feedback!"
  ],
  
  error_404: [
    "404: This page is as missing as Monday motivation.",
    "This page took a permanent coffee break.",
    "Lost in the void, like last year's performance goals."
  ],
  
  loading: [
    "Loading... faster than your last PR review ⏳",
    "Calculating your Mula score... 🌿",
    "Fetching data... unlike some people fetch their own coffee ☕"
  ],
  
  admin_dashboard: [
    "With great admin power comes great moderation responsibility.",
    "Welcome to the control room. Try not to break anything.",
    "You can see everything. Use this power wisely."
  ]
};
```

### 2. Employee Reactions

Employees can react to feedback they receive:

```typescript
const EMPLOYEE_REACTIONS = {
  thanks: {
    emoji: '🙏',
    label: 'Thanks!',
    labelBn: 'ধন্যবাদ!',
    description: 'Appreciating the feedback'
  },
  noted: {
    emoji: '📝',
    label: 'Noted!',
    labelBn: 'নোট করলাম!',
    description: 'Will keep in mind'
  },
  ouch: {
    emoji: '😅',
    label: 'Ouch, but fair!',
    labelBn: 'আউচ, তবে ঠিকই আছে!',
    description: 'Honest self-reflection'
  },
  fair_enough: {
    emoji: '🤷',
    label: 'Fair enough!',
    labelBn: 'ঠিক আছে!',
    description: 'Accepting the feedback'
  }
};
```

### 3. Achievement Badges

```typescript
const BADGES = {
  first_review: {
    id: 'first_review',
    name: 'Fresh Meat',
    emoji: '🥩',
    description: 'Received your first feedback',
    condition: (stats: UserStats) => stats.totalFeedbacks >= 1
  },
  
  five_reviews: {
    id: 'five_reviews',
    name: 'Getting Popular',
    emoji: '📈',
    description: 'Received 5+ feedbacks',
    condition: (stats: UserStats) => stats.totalFeedbacks >= 5
  },
  
  ten_reviews: {
    id: 'ten_reviews',
    name: 'Popular Kid',
    emoji: '⭐',
    description: 'Received 10+ feedbacks',
    condition: (stats: UserStats) => stats.totalFeedbacks >= 10
  },
  
  all_golden: {
    id: 'all_golden',
    name: 'Mula Master',
    emoji: '🏆',
    description: 'All Golden Mula ratings in a period',
    condition: (stats: UserStats) => stats.allGoldenInPeriod
  },
  
  survivor: {
    id: 'survivor',
    name: 'Tomato Survivor',
    emoji: '🛡️',
    description: 'Improved from Rotten Tomato to Fresh Carrot',
    condition: (stats: UserStats) => stats.improvedFromRotten
  },
  
  transparent: {
    id: 'transparent',
    name: 'Glass House',
    emoji: '🏠',
    description: 'Made 5+ feedbacks public',
    condition: (stats: UserStats) => stats.publicFeedbacks >= 5
  },
  
  consistent: {
    id: 'consistent',
    name: 'Steady Eddie',
    emoji: '🎯',
    description: 'Maintained 4+ average for 2 consecutive periods',
    condition: (stats: UserStats) => stats.consecutiveHighPeriods >= 2
  },
  
  early_bird: {
    id: 'early_bird',
    name: 'Early Bird',
    emoji: '🐦',
    description: 'Received feedback in the first week of review period',
    condition: (stats: UserStats) => stats.earlyFeedback
  }
};
```

### 4. Seasonal Themes

```typescript
const SEASONAL_THEMES = {
  ramadan: {
    id: 'ramadan',
    name: 'Iftar Edition',
    emoji: '🌙',
    quote: 'Breaking fast, not breaking hearts with feedback',
    quoteBn: 'রোজা ভাঙছি, হৃদয় নয়',
    available: { month: [3, 4] }, // March-April
    colors: {
      primary: '#1E3A5F',
      secondary: '#D4AF37'
    }
  },
  
  pohela_boishakh: {
    id: 'pohela_boishakh',
    name: 'নববর্ষ Special',
    emoji: '🎉',
    quote: 'নতুন বছর, নতুন feedback!',
    quoteBn: 'New year, new feedback!',
    available: { date: '04-14' }, // April 14
    colors: {
      primary: '#E53E3E',
      secondary: '#F6E05E'
    }
  },
  
  eid: {
    id: 'eid',
    name: 'Eid Mubarak Edition',
    emoji: '🕌',
    quote: 'Eid feedback: More valuable than Eidi!',
    quoteBn: 'ঈদ ফিডব্যাক: ঈদির চেয়েও মূল্যবান!',
    available: 'dynamic', // Based on lunar calendar
    colors: {
      primary: '#2F855A',
      secondary: '#F6E05E'
    }
  },
  
  winter: {
    id: 'winter',
    name: 'Pitha Season',
    emoji: '🥮',
    quote: 'Feedback গরম পিঠার মতো serve করুন',
    quoteBn: 'Serve feedback like hot pitha',
    available: { month: [12, 1] }, // December-January
    colors: {
      primary: '#744210',
      secondary: '#FBD38D'
    }
  },
  
  independence: {
    id: 'independence',
    name: 'Victory Day Edition',
    emoji: '🇧🇩',
    quote: 'স্বাধীন মতামত, স্বাধীন feedback!',
    available: { date: '12-16' }, // December 16
    colors: {
      primary: '#006A4E',
      secondary: '#F42A41'
    }
  }
};
```

---

## UI/UX Design

### Landing Page Wireframe

```
┌────────────────────────────────────────────────────────────────┐
│  🌿 MulaBoard                           [Login] [Register]     │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│                    360° Anonymous Feedback                     │
│                    Where Truth Meets Growth                    │
│                                                                │
│         "The only thing worse than being reviewed is           │
│                not being reviewed at all."                     │
│                                                                │
│              [Get Started →]    [Give Feedback]                │
│                                                                │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│    ┌──────────┐    ┌──────────┐    ┌──────────┐               │
│    │    👤    │    │    📝    │    │    🌿    │               │
│    │ Register │    │  Review  │    │  Grow    │               │
│    │ Profile  │    │Anonymously│   │ Together │               │
│    └──────────┘    └──────────┘    └──────────┘               │
│                                                                │
├────────────────────────────────────────────────────────────────┤
│                     The Mula Rating System                     │
│                                                                │
│    🌿 Golden Mula     🥕 Fresh Carrot     🍅 Rotten Tomato    │
│     Outstanding          Solid              Needs Work         │
│      (4.5-5.0)         (3.0-4.4)            (1.0-2.9)         │
│                                                                │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│                     © 2025 MulaBoard                          │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

### Feedback Form Design

```
┌────────────────────────────────────────────────────────────────┐
│  📝 Leave Feedback for Sayeed Hossen                           │
│  ───────────────────────────────────────────────────────────   │
│                                                                │
│  💡 "Remember: This is anonymous, not invisible to karma."    │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │  Work Quality                                             │ │
│  │  How accurate and consistent is their work?               │ │
│  │                                                           │ │
│  │  😟   😕   😐   🙂   🤩                                  │ │
│  │   1    2    3    4    5                                   │ │
│  │        ○    ○    ●    ○                                   │ │
│  │                                                           │ │
│  │  Add a comment (optional)                                 │ │
│  │  ┌─────────────────────────────────────────────────────┐ │ │
│  │  │ Always delivers clean code with minimal bugs...      │ │ │
│  │  └─────────────────────────────────────────────────────┘ │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │  Communication                                            │ │
│  │  [Similar rating UI...]                                   │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │  Team Behavior                                            │ │
│  │  [Similar rating UI...]                                   │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │  Accountability                                           │ │
│  │  [Similar rating UI...]                                   │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │  Overall Rating                                           │ │
│  │  [Similar rating UI...]                                   │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │  ✨ Key Strengths (Required)                              │ │
│  │  What do they do really well?                             │ │
│  │  ┌─────────────────────────────────────────────────────┐ │ │
│  │  │                                                      │ │ │
│  │  │                                                      │ │ │
│  │  └─────────────────────────────────────────────────────┘ │ │
│  │  23/500 characters (min 20)                              │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │  🎯 Areas to Improve (Required)                           │ │
│  │  What could they work on?                                 │ │
│  │  ┌─────────────────────────────────────────────────────┐ │ │
│  │  │                                                      │ │ │
│  │  │                                                      │ │ │
│  │  └─────────────────────────────────────────────────────┘ │ │
│  │  0/500 characters (min 20)                               │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                │
│  ☑️ I confirm this is honest, constructive feedback           │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │  [hCaptcha Widget]                                        │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │              [ Submit Feedback 🌿 ]                       │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                │
│  ⚠️ Note: Once submitted, feedback cannot be edited or        │
│     deleted. Choose your words wisely!                        │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

### Employee Dashboard Design

```
┌────────────────────────────────────────────────────────────────┐
│  🌿 MulaBoard    [Dashboard] [Profile] [My Reviews] [Settings] │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  Welcome back, Sayeed! 👋                                      │
│  "Another day, another opportunity to collect Mulas"           │
│                                                                │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐               │
│  │   🌿 12    │  │   🥕 8     │  │   🍅 2     │               │
│  │Golden Mula │  │Fresh Carrot│  │Rotten Tomato│              │
│  │   (55%)    │  │   (36%)    │  │    (9%)    │               │
│  └────────────┘  └────────────┘  └────────────┘               │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │  Your Mula Meter - Annual Review 2025                     │ │
│  │                                                           │ │
│  │  🍅 ─────────────────🥕─────────────▲────────🌿          │ │
│  │   1         2         3         4   4.2       5           │ │
│  │                                                           │ │
│  │                "Fresh Carrot! 🥕"                         │ │
│  │           Keep growing, almost a Mula!                    │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │  📊 Rating Breakdown                                      │ │
│  │                                                           │ │
│  │  Work Quality     ████████████████░░░░  4.1              │ │
│  │  Communication    ██████████████████░░  4.5              │ │
│  │  Team Behavior    ████████████████░░░░  4.0              │ │
│  │  Accountability   █████████████████░░░  4.2              │ │
│  │  Overall          █████████████████░░░  4.3              │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                │
│  🏆 Your Badges                                                │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐                       │
│  │ ⭐ Popular│ │ 🏠 Glass │ │ 🎯 Steady│                       │
│  │   Kid    │ │  House   │ │  Eddie   │                       │
│  └──────────┘ └──────────┘ └──────────┘                       │
│                                                                │
│  📝 Recent Feedback                                            │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │ 🥕 Anonymous • 2 days ago           [🔒 Private] [👁️ Make │
│  │                                                  Public] │ │
│  │ Work Quality: ⭐⭐⭐⭐☆ (4)                                 │ │
│  │ "Great at explaining complex things simply. Could          │ │
│  │  improve on meeting deadlines sometimes."                  │ │
│  │                                                           │ │
│  │ Your reaction: [🙏] [📝] [😅] [🤷]                       │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │ 🌿 Anonymous • 5 days ago           [👁️ Public]          │ │
│  │ Work Quality: ⭐⭐⭐⭐⭐ (5)                                │ │
│  │ "One of the best developers I've worked with..."          │ │
│  │                                                           │ │
│  │ Your reaction: 🙏 Thanks!                                 │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                │
│  [View All Feedback →]                                         │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │  📤 Share your profile to collect more feedback:          │ │
│  │                                                           │ │
│  │  https://mulaboard.com/sayeed-hossen    [Copy Link 📋]   │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

### Admin Dashboard Design

```
┌────────────────────────────────────────────────────────────────┐
│  🌿 MulaBoard Admin    [Dashboard] [Users] [Feedbacks] [More ▼]│
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  👋 Welcome, Admin!                                            │
│  "With great admin power comes great moderation responsibility"│
│                                                                │
│  ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐      │
│  │    45     │ │    312    │ │    23     │ │     3     │      │
│  │  Users    │ │ Feedbacks │ │  Pending  │ │  Flagged  │      │
│  │           │ │           │ │Moderation │ │           │      │
│  └───────────┘ └───────────┘ └───────────┘ └───────────┘      │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │  📅 Active Review Period                                  │ │
│  │                                                           │ │
│  │  Annual Review 2025                                       │ │
│  │  Jan 1, 2025 - Jan 31, 2025                              │ │
│  │  Theme: The Mula Season 🌿                                │ │
│  │  Status: ● Active                                         │ │
│  │                                                           │ │
│  │  [Edit Period] [End Early] [Create New]                   │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │  ⚠️ Feedbacks Requiring Attention                         │ │
│  │                                                           │ │
│  │  ┌────────────────────────────────────────────────────┐  │ │
│  │  │ 🚩 Flagged - Potentially unprofessional language    │  │ │
│  │  │ For: Rahim Ahmed • 2 hours ago                      │  │ │
│  │  │ "..." [View Full] [Approve] [Edit] [Delete]         │  │ │
│  │  └────────────────────────────────────────────────────┘  │ │
│  │                                                           │ │
│  │  ┌────────────────────────────────────────────────────┐  │ │
│  │  │ 🔍 Pending Review                                   │  │ │
│  │  │ For: Karim Hossain • 4 hours ago                    │  │ │
│  │  │ "..." [View Full] [Approve] [Edit] [Delete]         │  │ │
│  │  └────────────────────────────────────────────────────┘  │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │  📈 This Period Stats                                     │ │
│  │                                                           │ │
│  │  Distribution:                                            │ │
│  │  🌿 Golden Mula:    ████████████░░░░░░░░  35%            │ │
│  │  🥕 Fresh Carrot:   ██████████████████░░  52%            │ │
│  │  🍅 Rotten Tomato:  █████░░░░░░░░░░░░░░░  13%            │ │
│  │                                                           │ │
│  │  Average Rating: 3.8 / 5.0                                │ │
│  │  Total Feedbacks: 156                                     │ │
│  │  Active Users: 42                                         │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

---

## Project Folder Structure

```
mulaboard/
│
├── public/
│   ├── images/
│   │   ├── logo.svg
│   │   ├── logo-dark.svg
│   │   ├── mula-golden.svg
│   │   ├── mula-golden.png
│   │   ├── carrot-fresh.svg
│   │   ├── carrot-fresh.png
│   │   ├── tomato-rotten.svg
│   │   ├── tomato-rotten.png
│   │   ├── og-image.png              # Social share image
│   │   └── favicon.ico
│   └── fonts/
│       └── (custom fonts if any)
│
├── src/
│   ├── app/
│   │   ├── (public)/
│   │   │   ├── page.tsx              # Landing page
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   ├── register/
│   │   │   │   └── page.tsx
│   │   │   └── [slug]/
│   │   │       ├── page.tsx          # Public profile + feedback form
│   │   │       └── thank-you/
│   │   │           └── page.tsx
│   │   │
│   │   ├── (authenticated)/
│   │   │   ├── layout.tsx            # Auth check + sidebar layout
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx
│   │   │   ├── profile/
│   │   │   │   └── page.tsx
│   │   │   ├── my-reviews/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [periodId]/
│   │   │   │       └── page.tsx
│   │   │   └── settings/
│   │   │       └── page.tsx
│   │   │
│   │   ├── (admin)/
│   │   │   ├── layout.tsx            # Admin check + admin layout
│   │   │   └── admin/
│   │   │       ├── page.tsx          # Admin dashboard
│   │   │       ├── users/
│   │   │       │   └── page.tsx
│   │   │       ├── feedbacks/
│   │   │       │   └── page.tsx
│   │   │       ├── periods/
│   │   │       │   └── page.tsx
│   │   │       └── quotes/
│   │   │           └── page.tsx
│   │   │
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   └── [...nextauth]/
│   │   │   │       └── route.ts
│   │   │   ├── users/
│   │   │   │   ├── route.ts          # GET all, POST create
│   │   │   │   ├── [id]/
│   │   │   │   │   └── route.ts      # GET, PATCH, DELETE
│   │   │   │   └── by-slug/
│   │   │   │       └── [slug]/
│   │   │   │           └── route.ts  # GET by public slug
│   │   │   ├── feedback/
│   │   │   │   ├── route.ts          # GET all, POST create
│   │   │   │   ├── [id]/
│   │   │   │   │   ├── route.ts      # GET, PATCH
│   │   │   │   │   ├── visibility/
│   │   │   │   │   │   └── route.ts  # PATCH visibility
│   │   │   │   │   └── reaction/
│   │   │   │   │       └── route.ts  # PATCH reaction
│   │   │   │   ├── check-eligibility/
│   │   │   │   │   └── route.ts      # POST check if can submit
│   │   │   │   └── my/
│   │   │   │       └── route.ts      # GET own feedback
│   │   │   ├── periods/
│   │   │   │   ├── route.ts          # GET all, POST create
│   │   │   │   ├── active/
│   │   │   │   │   └── route.ts      # GET current active
│   │   │   │   └── [id]/
│   │   │   │       └── route.ts      # GET, PATCH, DELETE
│   │   │   ├── quotes/
│   │   │   │   ├── route.ts          # GET all, POST create
│   │   │   │   ├── random/
│   │   │   │   │   └── route.ts      # GET random by category
│   │   │   │   └── [id]/
│   │   │   │       └── route.ts      # PATCH, DELETE
│   │   │   ├── upload/
│   │   │   │   └── route.ts          # POST Cloudinary upload
│   │   │   └── admin/
│   │   │       ├── stats/
│   │   │       │   └── route.ts      # GET admin stats
│   │   │       └── moderate/
│   │   │           └── [id]/
│   │   │               └── route.ts  # PATCH moderate feedback
│   │   │
│   │   ├── layout.tsx                # Root layout
│   │   ├── globals.css               # Global styles
│   │   ├── loading.tsx               # Global loading UI
│   │   ├── error.tsx                 # Global error UI
│   │   └── not-found.tsx             # 404 page
│   │
│   ├── components/
│   │   ├── ui/                       # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   ├── label.tsx
│   │   │   ├── textarea.tsx
│   │   │   ├── avatar.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── progress.tsx
│   │   │   ├── skeleton.tsx
│   │   │   ├── tabs.tsx
│   │   │   ├── toast.tsx
│   │   │   └── tooltip.tsx
│   │   │
│   │   ├── layout/
│   │   │   ├── Header.tsx            # Public header
│   │   │   ├── Footer.tsx            # Public footer
│   │   │   ├── Sidebar.tsx           # Authenticated sidebar
│   │   │   ├── AdminHeader.tsx       # Admin header
│   │   │   └── MobileNav.tsx         # Mobile navigation
│   │   │
│   │   ├── auth/
│   │   │   ├── LoginForm.tsx
│   │   │   ├── RegisterForm.tsx
│   │   │   └── AuthGuard.tsx         # Client-side auth check
│   │   │
│   │   ├── feedback/
│   │   │   ├── FeedbackForm.tsx      # Main feedback form
│   │   │   ├── RatingInput.tsx       # 1-5 emoji rating
│   │   │   ├── RatingCategory.tsx    # Single category with comment
│   │   │   ├── MulaMeter.tsx         # Visual meter display
│   │   │   ├── MulaRatingBadge.tsx   # Golden/Carrot/Tomato badge
│   │   │   ├── FeedbackCard.tsx      # Display single feedback
│   │   │   ├── FeedbackList.tsx      # List of feedbacks
│   │   │   ├── ReactionButtons.tsx   # Employee reaction buttons
│   │   │   └── VisibilityToggle.tsx  # Public/Private toggle
│   │   │
│   │   ├── profile/
│   │   │   ├── ProfileCard.tsx       # Display profile
│   │   │   ├── ProfileForm.tsx       # Edit profile form
│   │   │   ├── AvatarUpload.tsx      # Cloudinary upload
│   │   │   └── PublicProfile.tsx     # Public-facing profile
│   │   │
│   │   ├── dashboard/
│   │   │   ├── StatsCards.tsx        # Mula count cards
│   │   │   ├── RatingBreakdown.tsx   # Category breakdown
│   │   │   ├── BadgeDisplay.tsx      # Achievement badges
│   │   │   ├── ShareLink.tsx         # Copy profile link
│   │   │   └── PeriodSelector.tsx    # Switch review periods
│   │   │
│   │   ├── admin/
│   │   │   ├── UserTable.tsx         # Users list/management
│   │   │   ├── FeedbackModerator.tsx # Moderation interface
│   │   │   ├── PeriodManager.tsx     # Review period CRUD
│   │   │   ├── QuoteManager.tsx      # Quotes CRUD
│   │   │   ├── AdminStats.tsx        # Admin statistics
│   │   │   └── ModerationActions.tsx # Approve/Edit/Delete
│   │   │
│   │   └── shared/
│   │       ├── FunnyQuote.tsx        # Random quote display
│   │       ├── LoadingSpinner.tsx    # Loading indicator
│   │       ├── EmptyState.tsx        # Empty list state
│   │       ├── ErrorMessage.tsx      # Error display
│   │       ├── HCaptcha.tsx          # Captcha wrapper
│   │       ├── ConfirmDialog.tsx     # Confirmation modal
│   │       └── CopyButton.tsx        # Copy to clipboard
│   │
│   ├── lib/
│   │   ├── db/
│   │   │   ├── connect.ts            # MongoDB connection
│   │   │   └── models/
│   │   │       ├── User.ts
│   │   │       ├── Feedback.ts
│   │   │       ├── ReviewPeriod.ts
│   │   │       ├── FunnyQuote.ts
│   │   │       └── FeedbackAttempt.ts
│   │   │
│   │   ├── auth/
│   │   │   ├── auth.config.ts        # NextAuth configuration
│   │   │   └── auth.ts               # Auth helpers
│   │   │
│   │   ├── cloudinary/
│   │   │   ├── config.ts             # Cloudinary setup
│   │   │   └── upload.ts             # Upload utilities
│   │   │
│   │   ├── redis/
│   │   │   └── client.ts             # Upstash Redis client
│   │   │
│   │   ├── utils/
│   │   │   ├── mula-calculator.ts    # Calculate mula rating
│   │   │   ├── spam-prevention.ts    # Rate limit checks
│   │   │   ├── hash.ts               # IP hashing
│   │   │   ├── slug.ts               # Slug generation
│   │   │   ├── validation.ts         # Zod schemas
│   │   │   └── helpers.ts            # General utilities
│   │   │
│   │   └── constants/
│   │       ├── ratings.ts            # Mula rating definitions
│   │       ├── badges.ts             # Badge definitions
│   │       ├── themes.ts             # Seasonal themes
│   │       ├── quotes.ts             # Quote placements
│   │       └── config.ts             # App configuration
│   │
│   ├── hooks/
│   │   ├── useRandomQuote.ts         # Fetch random quote
│   │   ├── useFeedback.ts            # Feedback CRUD
│   │   ├── useFingerprint.ts         # FingerprintJS hook
│   │   ├── useUser.ts                # Current user
│   │   ├── usePeriod.ts              # Active period
│   │   └── useCopyToClipboard.ts     # Clipboard hook
│   │
│   ├── types/
│   │   ├── index.ts                  # Main type exports
│   │   ├── user.ts                   # User types
│   │   ├── feedback.ts               # Feedback types
│   │   ├── period.ts                 # Period types
│   │   └── api.ts                    # API response types
│   │
│   ├── validators/
│   │   ├── user.ts                   # User validation schemas
│   │   ├── feedback.ts               # Feedback validation
│   │   └── period.ts                 # Period validation
│   │
│   └── middleware.ts                 # Route protection
│
├── scripts/
│   ├── seed-quotes.ts                # Seed funny quotes
│   ├── seed-admin.ts                 # Create initial admin
│   └── seed-demo.ts                  # Demo data for testing
│
├── .env.local                        # Local environment
├── .env.example                      # Example environment
├── .gitignore
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── package.json
├── README.md
└── CONTRIBUTING.md
```

---

## Environment Variables

```bash
# .env.example

# ===========================================
# DATABASE
# ===========================================
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/mulaboard?retryWrites=true&w=majority

# ===========================================
# AUTHENTICATION (NextAuth.js)
# ===========================================
NEXTAUTH_SECRET=your-super-secret-key-generate-with-openssl
NEXTAUTH_URL=http://localhost:3000

# ===========================================
# CLOUDINARY (Image Upload)
# ===========================================
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name

# ===========================================
# UPSTASH REDIS (Rate Limiting)
# ===========================================
UPSTASH_REDIS_REST_URL=https://your-redis-url.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-redis-token

# ===========================================
# HCAPTCHA (Bot Prevention)
# ===========================================
NEXT_PUBLIC_HCAPTCHA_SITE_KEY=your-site-key
HCAPTCHA_SECRET_KEY=your-secret-key

# ===========================================
# FINGERPRINTJS (Browser Identification)
# ===========================================
NEXT_PUBLIC_FINGERPRINT_API_KEY=your-api-key

# ===========================================
# APP CONFIGURATION
# ===========================================
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=MulaBoard

# ===========================================
# ADMIN SETUP (Initial Admin Creation)
# ===========================================
ADMIN_EMAIL=admin@yourcompany.com
ADMIN_PASSWORD=your-secure-admin-password
```

---

## API Routes

### Authentication

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register new employee | Public |
| POST | `/api/auth/signin` | Login | Public |
| POST | `/api/auth/signout` | Logout | Authenticated |
| GET | `/api/auth/session` | Get current session | Public |

### Users

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/users` | List all users (admin) | Admin |
| GET | `/api/users/[id]` | Get user by ID | Authenticated |
| GET | `/api/users/by-slug/[slug]` | Get user by public slug | Public |
| PATCH | `/api/users/[id]` | Update user profile | Owner/Admin |
| DELETE | `/api/users/[id]` | Delete user | Admin |

### Feedback

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/feedback` | Submit new feedback | Public |
| GET | `/api/feedback` | List all feedback (admin) | Admin |
| GET | `/api/feedback/my` | Get own received feedback | Authenticated |
| GET | `/api/feedback/[id]` | Get feedback by ID | Owner/Admin |
| POST | `/api/feedback/check-eligibility` | Check if can submit | Public |
| PATCH | `/api/feedback/[id]/visibility` | Toggle public/private | Owner |
| PATCH | `/api/feedback/[id]/reaction` | Add reaction | Owner |

### Review Periods

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/periods` | List all periods | Public |
| GET | `/api/periods/active` | Get current active period | Public |
| POST | `/api/periods` | Create new period | Admin |
| PATCH | `/api/periods/[id]` | Update period | Admin |
| DELETE | `/api/periods/[id]` | Delete period | Admin |

### Quotes

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/quotes` | List all quotes | Admin |
| GET | `/api/quotes/random?category=landing` | Get random quote | Public |
| POST | `/api/quotes` | Create quote | Admin |
| PATCH | `/api/quotes/[id]` | Update quote | Admin |
| DELETE | `/api/quotes/[id]` | Delete quote | Admin |

### Admin

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/admin/stats` | Get admin statistics | Admin |
| PATCH | `/api/admin/moderate/[id]` | Moderate feedback | Admin |

### Upload

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/upload` | Upload image to Cloudinary | Authenticated |

---

## Sample Data - Funny Quotes

```javascript
const seedQuotes = [
  // ============================================
  // LANDING PAGE QUOTES
  // ============================================
  {
    text: "Where anonymous feedback meets accountability.",
    category: "landing",
    mood: "wise",
    isActive: true
  },
  {
    text: "The only thing worse than being reviewed is not being reviewed at all.",
    category: "landing",
    mood: "wise",
    isActive: true
  },
  {
    text: "360° reviews: Because everyone deserves to know they talk too much in meetings.",
    category: "landing",
    mood: "sarcastic",
    isActive: true
  },
  {
    text: "Feedback so anonymous, even we don't know who sent it. Okay, we really don't.",
    category: "landing",
    mood: "funny",
    isActive: true
  },
  {
    text: "Building better workplaces, one honest review at a time.",
    category: "landing",
    mood: "motivational",
    isActive: true
  },
  
  // ============================================
  // FEEDBACK FORM QUOTES
  // ============================================
  {
    text: "Be honest, but not 'reply-all mistake' honest.",
    category: "feedback_form",
    mood: "funny",
    isActive: true
  },
  {
    text: "Remember: Karma has no deadline.",
    category: "feedback_form",
    mood: "wise",
    isActive: true
  },
  {
    text: "This is anonymous. Your chai buddy won't know. Probably.",
    category: "feedback_form",
    mood: "sarcastic",
    isActive: true
  },
  {
    text: "Constructive criticism only. Save the roasting for Friday lunch.",
    category: "feedback_form",
    mood: "funny",
    isActive: true
  },
  {
    text: "Write what you'd want to hear if roles were reversed.",
    category: "feedback_form",
    mood: "wise",
    isActive: true
  },
  {
    text: "Your feedback matters. No pressure. Okay, some pressure.",
    category: "feedback_form",
    mood: "sarcastic",
    isActive: true
  },
  {
    text: "Think twice, type once. There's no edit button after submit.",
    category: "feedback_form",
    mood: "wise",
    isActive: true
  },
  
  // ============================================
  // SUCCESS PAGE QUOTES
  // ============================================
  {
    text: "Feedback delivered! May the Mula be with them. 🌿",
    category: "success",
    mood: "funny",
    isActive: true
  },
  {
    text: "Done! Now wash your hands of this and grab some chai.",
    category: "success",
    mood: "funny",
    isActive: true
  },
  {
    text: "Your honesty has been recorded. The universe thanks you.",
    category: "success",
    mood: "motivational",
    isActive: true
  },
  {
    text: "Feedback submitted successfully. Feel free to feel good about yourself.",
    category: "success",
    mood: "sarcastic",
    isActive: true
  },
  {
    text: "You've done your part. Now let karma do its thing.",
    category: "success",
    mood: "wise",
    isActive: true
  },
  
  // ============================================
  // PROFILE/EMPTY STATE QUOTES
  // ============================================
  {
    text: "No reviews yet. Either you're new, or everyone's scared. 😅",
    category: "profile",
    mood: "sarcastic",
    isActive: true
  },
  {
    text: "Your review box is emptier than the office on Friday afternoon.",
    category: "profile",
    mood: "funny",
    isActive: true
  },
  {
    text: "Crickets... 🦗 Share your profile link to get some feedback!",
    category: "profile",
    mood: "funny",
    isActive: true
  },
  {
    text: "No feedback? Time to remind people you exist!",
    category: "profile",
    mood: "sarcastic",
    isActive: true
  },
  
  // ============================================
  // ERROR QUOTES
  // ============================================
  {
    text: "404: This page is as missing as Monday motivation.",
    category: "error",
    mood: "funny",
    isActive: true
  },
  {
    text: "This page took a permanent coffee break.",
    category: "error",
    mood: "funny",
    isActive: true
  },
  {
    text: "Lost in the void, like last year's performance goals.",
    category: "error",
    mood: "sarcastic",
    isActive: true
  },
  {
    text: "Something broke. Unlike your spirit during performance reviews.",
    category: "error",
    mood: "sarcastic",
    isActive: true
  },
  {
    text: "Oops! Even our best developers couldn't prevent this.",
    category: "error",
    mood: "funny",
    isActive: true
  },
  
  // ============================================
  // LOADING QUOTES
  // ============================================
  {
    text: "Loading... faster than your last PR review ⏳",
    category: "loading",
    mood: "sarcastic",
    isActive: true
  },
  {
    text: "Calculating your Mula score... 🌿",
    category: "loading",
    mood: "funny",
    isActive: true
  },
  {
    text: "Fetching data... unlike some people fetch their own coffee ☕",
    category: "loading",
    mood: "sarcastic",
    isActive: true
  },
  {
    text: "Hold on, we're gathering all the honest opinions...",
    category: "loading",
    mood: "funny",
    isActive: true
  },
  
  // ============================================
  // ADMIN QUOTES
  // ============================================
  {
    text: "With great admin power comes great moderation responsibility.",
    category: "admin",
    mood: "wise",
    isActive: true
  },
  {
    text: "Welcome to the control room. Try not to break anything.",
    category: "admin",
    mood: "sarcastic",
    isActive: true
  },
  {
    text: "You can see everything. Use this power wisely.",
    category: "admin",
    mood: "wise",
    isActive: true
  },
  {
    text: "Admin mode: Where you see all the feedback people thought was private.",
    category: "admin",
    mood: "sarcastic",
    isActive: true
  },
  
  // ============================================
  // BENGALI/BANGLISH QUOTES
  // ============================================
  {
    text: "Feedback দিন, Mula কামান! 🌿",
    textBn: "ফিডব্যাক দিন, মুলা কামান!",
    category: "landing",
    mood: "funny",
    isActive: true
  },
  {
    text: "আজকে honest feedback, কালকে promotion? Maybe. 😅",
    category: "feedback_form",
    mood: "sarcastic",
    isActive: true
  },
  {
    text: "সত্যি কথা বলুন, কিন্তু ভদ্রতা বজায় রাখুন।",
    textBn: "Speak the truth, but maintain courtesy.",
    category: "feedback_form",
    mood: "wise",
    isActive: true
  },
  {
    text: "চা খাওয়ার ফাঁকে feedback দিয়ে যান! ☕",
    category: "landing",
    mood: "funny",
    isActive: true
  }
];
```

---

## Development Timeline

### Week 1: Foundation
- [ ] Project setup (Next.js, Tailwind, shadcn/ui)
- [ ] MongoDB connection setup
- [ ] Database models creation
- [ ] NextAuth.js configuration
- [ ] Basic layout components

### Week 2: Authentication & Profile
- [ ] Registration page & API
- [ ] Login page & API
- [ ] Profile edit page
- [ ] Cloudinary integration for image upload
- [ ] Public profile page

### Week 3: Feedback System
- [ ] FingerprintJS integration
- [ ] hCaptcha integration
- [ ] Feedback form component
- [ ] Rating input component
- [ ] Spam prevention logic
- [ ] Feedback submission API

### Week 4: Dashboard & Reviews
- [ ] Employee dashboard
- [ ] Mula Meter component
- [ ] Rating breakdown chart
- [ ] Feedback list with visibility toggle
- [ ] Reaction buttons
- [ ] Badge system

### Week 5: Admin Panel
- [ ] Admin dashboard
- [ ] User management (list, delete)
- [ ] Feedback moderation interface
- [ ] Review period management
- [ ] Quote management

### Week 6: Review Periods & Themes
- [ ] Review period CRUD
- [ ] Period selector in dashboard
- [ ] Seasonal theme implementation
- [ ] Funny quotes throughout app
- [ ] Empty states with humor

### Week 7: Polish & Testing
- [ ] Responsive design fixes
- [ ] Loading states
- [ ] Error handling
- [ ] Form validation
- [ ] Unit tests
- [ ] Integration tests

### Week 8: Deployment & Launch
- [ ] Environment setup on Vercel
- [ ] MongoDB Atlas production setup
- [ ] Cloudinary production setup
- [ ] Upstash Redis setup
- [ ] Final testing
- [ ] Documentation
- [ ] Launch! 🚀

---

## Deployment Checklist

### Pre-Deployment

- [ ] All environment variables set
- [ ] MongoDB Atlas IP whitelist configured
- [ ] Cloudinary upload preset configured
- [ ] hCaptcha domain verification done
- [ ] Admin user seeded
- [ ] Sample quotes seeded
- [ ] Initial review period created

### Vercel Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

### Post-Deployment

- [ ] Verify authentication works
- [ ] Test feedback submission
- [ ] Test admin panel
- [ ] Verify rate limiting works
- [ ] Check image uploads
- [ ] Monitor error logs
- [ ] Share profile links work

---

## Security Considerations

1. **Password Hashing**: bcrypt with salt rounds 12
2. **IP Privacy**: Store only hashed IPs (SHA-256)
3. **Rate Limiting**: Both IP and fingerprint based
4. **Input Sanitization**: Zod validation on all inputs
5. **XSS Prevention**: React's default escaping
6. **CSRF Protection**: NextAuth.js built-in
7. **Admin Routes**: Middleware protected
8. **Database**: Parameterized queries via Mongoose

---

## Future Enhancements (v2.0)

- [ ] Email notifications for new feedback
- [ ] PDF export of feedback reports
- [ ] Comparison with previous periods
- [ ] Department-level analytics
- [ ] Slack/Teams integration
- [ ] AI-powered feedback summarization
- [ ] Mobile app (React Native)
- [ ] Multi-language support
- [ ] Custom rating categories
- [ ] Goal setting integration

---

## Contributing

Please read CONTRIBUTING.md for details on our code of conduct and the process for submitting pull requests.

---

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## Acknowledgments

- Built with Next.js 14
- UI components from shadcn/ui
- Inspired by the need for honest, constructive workplace feedback
- And a bit of Bengali humor to make reviews less scary! 🌿

---

**Happy Reviewing! May the Mula be with you! 🌿**

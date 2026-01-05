# MulaBoard Frontend Routes

This document lists the existing and planned frontend routes for the MulaBoard platform.

## 🌐 Public Routes
*No authentication required.*

| Route | Description | Status |
|-------|-------------|--------|
| `/` | Landing page with hero, features, and call-to-action. | ✅ Implemented |
| `/login` | Employee login page. | ✅ Implemented |
| `/register` | Employee registration page with profile setup. | ✅ Implemented |
| `/[slug]` | Dynamic public profile page + anonymous feedback form. | ✅ Implemented |
| `/[slug]/thank-you` | Post-submission confirmation page. | ✅ Implemented |

## 👤 Authenticated Routes (Employee)
*Requires employee login.*

| Route | Description | Status |
|-------|-------------|--------|
| `/dashboard` | Employee dashboard with stats, Mula Meter, and badges. | ✅ Implemented |
| `/profile` | Edit personal profile (name, designation, bio, image). | ✅ Implemented |
| `/settings` | Account settings, notifications, and profile visibility. | ✅ Implemented |
| `/my-reviews` | Overview of all received feedback. | ✅ Planned |
| `/my-reviews/[periodId]` | Feedback filtered by a specific review period. | ✅ Planned |

## 🛡️ Admin Routes
*Requires super admin authentication.*

| Route | Description | Status |
|-------|-------------|--------|
| `/admin` | Admin dashboard with system-wide statistics. | ✅ Implemented |
| `/admin/users` | Management page for all employee accounts. | 🟡 API Ready / UI Pending |
| `/admin/feedbacks` | Moderation dashboard for all feedback submissions. | 🟡 API Ready / UI Pending |
| `/admin/periods` | Interface to create and manage review periods. | 🟡 API Ready / UI Pending |
| `/admin/quotes` | Management page for funny quotes and system messages. | 🟡 API Ready / UI Pending |

## 🛠️ API Routes (Internal)
*Used for frontend-backend communication.*

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/[...nextauth]` | ALL | Authentication handlers (NextAuth). |
| `/api/auth/register` | POST | Register a new employee. |
| `/api/users` | GET/POST | List/Create users (Admin). |
| `/api/users/[id]` | GET/PATCH/DELETE | Manage specific user profile. |
| `/api/feedback` | GET/POST | Submit/List feedback. |
| `/api/feedback/check-eligibility` | GET | Spam prevention check. |
| `/api/feedback/my` | GET | Fetch feedback for logged-in user. |
| `/api/admin/stats` | GET | System-wide statistics for admin. |
| `/api/admin/feedbacks` | GET | List feedback for moderation. |
| `/api/admin/feedbacks/[id]` | PATCH/DELETE | Moderate/Delete feedback. |
| `/api/periods` | GET/POST | Manage review periods. |
| `/api/quotes` | GET/POST | Manage funny quotes. |
| `/api/quotes/random` | GET | Fetch a random quote for the UI. |
| `/api/upload` | POST | Image upload via Cloudinary. |

---
*Last Updated: January 2026*

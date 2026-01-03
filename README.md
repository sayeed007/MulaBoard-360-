# 🌿 MulaBoard - 360° Anonymous Feedback Platform

A fun and professional anonymous feedback platform for annual salary reviews and performance evaluations, built with Next.js 14+ and a touch of Bengali humor!

## 🚀 Project Status

**Current Phase:** Phase 1 Complete ✅ | Phase 2 Starting
**Progress:** ~8% Complete

See [PROJECT-TODO.md](PROJECT-TODO.md) for detailed progress tracking.

## 🎯 What is MulaBoard?

MulaBoard is a 360-degree anonymous feedback platform that allows:
- **Employees** to receive honest, anonymous feedback from anyone
- **Reviewers** to provide constructive feedback without logging in
- **Admins** to moderate and manage the review process
- **Everyone** to see feedback ratings through the fun "Mula Meter" system

### The Mula Rating System

- 🌿 **Golden Mula** (4.5-5.0) - Outstanding performer!
- 🥕 **Fresh Carrot** (3.0-4.4) - Solid contributor!
- 🍅 **Rotten Tomato** (1.0-2.9) - Room for growth...

## 🛠️ Tech Stack

- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript
- **Database:** MongoDB + Mongoose
- **Authentication:** NextAuth.js v5
- **Styling:** Tailwind CSS v4 + shadcn/ui
- **Image Storage:** Cloudinary
- **Rate Limiting:** Upstash Redis
- **Bot Prevention:** hCaptcha + FingerprintJS
- **Deployment:** Vercel

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd mulaboard_360
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Then edit `.env.local` with your credentials.

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔐 Environment Variables

Required environment variables (see `.env.example` for full list):

- `MONGODB_URI` - MongoDB connection string
- `NEXTAUTH_SECRET` - NextAuth.js secret (generate with `openssl rand -base64 32`)
- `NEXTAUTH_URL` - Application URL
- `CLOUDINARY_*` - Cloudinary credentials
- `UPSTASH_REDIS_*` - Upstash Redis credentials
- `HCAPTCHA_*` - hCaptcha keys

## 📁 Project Structure

```
mulaboard_360/
├── src/
│   ├── app/              # Next.js app directory
│   ├── components/       # React components
│   ├── lib/              # Utilities, database, auth
│   ├── hooks/            # Custom React hooks
│   ├── types/            # TypeScript types
│   └── validators/       # Zod schemas
├── public/               # Static assets
├── scripts/              # Seed scripts
└── docs/                 # Documentation
```

## 🚀 Development

### Commands

```bash
npm run dev              # Start development server
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint
```

## 📖 Documentation

- [Project Blueprint](mulaboard-project-blueprint.md) - Complete project specification
- [Project TODO](PROJECT-TODO.md) - Detailed task tracking
- [Phase 1 Summary](PHASE-1-SUMMARY.md) - Completed foundation work

## 🎨 Features

### Core Features (Planned)
- ✅ Environment & configuration setup
- 🔲 Employee registration and authentication
- 🔲 Anonymous feedback submission (no login required)
- 🔲 5-category rating system
- 🔲 Mula Meter visualization
- 🔲 Employee dashboard with statistics
- 🔲 Admin moderation panel
- 🔲 Review period management
- 🔲 Achievement badges
- 🔲 Funny quotes throughout the app

### Fun Features
- 🌿 Mula rating system with custom emojis
- 😄 Random funny quotes (English & Bengali)
- 🎨 Custom animations (sparkle, bounce, shake)
- 🌓 Dark mode support
- 🎯 Achievement badges
- 🎭 Seasonal themes

## 🔒 Security Features

- Password hashing with bcrypt (12 rounds)
- IP hashing with SHA-256 (privacy-preserving)
- Rate limiting with Redis
- Browser fingerprinting for spam prevention
- hCaptcha bot protection
- Input validation with Zod
- CSRF protection (NextAuth.js)

## 📝 License

This project is licensed under the MIT License.

## 👨‍💼 Author

**Sayeed Hossen**
Project Creator & Developer

## 🙏 Acknowledgments

- Built with Next.js 14
- UI components from shadcn/ui
- Inspired by the need for honest, constructive workplace feedback
- And a bit of Bengali humor to make reviews less scary! 🌿

---

## 🎯 Current Development Status

### ✅ Completed (Phase 1)
- Next.js project setup
- All dependencies installed
- Environment configuration
- Project folder structure
- MongoDB connection utility
- Utility functions (helpers, slug, hash)
- Tailwind CSS theme with Mula colors
- Custom animations

### 🔄 In Progress (Phase 2)
- Database models (User, Feedback, ReviewPeriod, etc.)
- TypeScript types
- Zod validation schemas

### 📋 Next Up (Phase 3)
- NextAuth.js v5 setup
- Authentication pages (login, register)
- Auth API routes

---

**May the Mula be with you! 🌿**

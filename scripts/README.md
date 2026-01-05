# Database Seed Scripts

This directory contains scripts for seeding the MulaBoard database with initial data.

## Prerequisites

Before running any seed scripts, ensure you have:

1. **MongoDB running** (local or Atlas)
2. **Environment variables configured** in `.env.local`:
   - `MONGODB_URI` - Your MongoDB connection string
   - `ADMIN_EMAIL` - (Optional) Admin email for seed-admin script
   - `ADMIN_PASSWORD` - (Optional) Admin password for seed-admin script
   - `ADMIN_NAME` - (Optional) Admin full name for seed-admin script

## Available Scripts

### 1. Seed Admin User

Creates the initial admin user for the platform.

```bash
npm run seed:admin
```

**What it does:**
- Creates an admin user with credentials from environment variables
- Default credentials if not provided:
  - Email: `admin@mulaboard.com`
  - Password: `Admin@123456`
  - Name: `System Administrator`
- Skips if admin user already exists

**Environment Variables:**
- `ADMIN_EMAIL` - Admin user email
- `ADMIN_PASSWORD` - Admin user password
- `ADMIN_NAME` - Admin user full name

### 2. Seed Quotes

Populates the database with funny quotes for different sections.

```bash
npm run seed:quotes
```

**What it does:**
- Clears all existing quotes
- Inserts 45+ quotes across 7 categories:
  - Landing page quotes
  - Feedback form quotes
  - Success/thank you quotes
  - Profile/dashboard quotes
  - Admin panel quotes
  - Error page quotes
  - Loading page quotes
- Includes Bengali/Banglish quotes
- Shows breakdown by category

### 3. Seed Demo Data

Creates demo users, review period, and sample feedback for testing.

```bash
npm run seed:demo
```

**What it does:**
- Creates 5 demo employee users
- Creates current quarter review period
- Creates sample feedback for each user
- All demo users have password: `User@123`

**Demo Users:**
- john.doe@company.com - Senior Software Engineer
- jane.smith@company.com - Product Manager
- bob.johnson@company.com - UI/UX Designer
- alice.williams@company.com - Team Lead
- charlie.brown@company.com - DevOps Engineer

### 4. Seed All

Runs all seed scripts in the correct order.

```bash
npm run seed:all
```

**Order:**
1. Admin user
2. Quotes
3. Demo data

## Usage Examples

### First Time Setup

```bash
# Seed everything for a fresh database
npm run seed:all
```

### Reset Quotes Only

```bash
# Re-seed quotes (clears existing ones)
npm run seed:quotes
```

### Add Demo Data to Existing Database

```bash
# Add demo users and feedback (preserves existing data)
npm run seed:demo
```

### Create Admin with Custom Credentials

```bash
# Set environment variables first
ADMIN_EMAIL="boss@company.com" ADMIN_PASSWORD="SecurePass123!" ADMIN_NAME="The Boss" npm run seed:admin
```

## Important Notes

⚠️ **Security Warnings:**
- Change the admin password immediately after first login
- Do not commit `.env.local` with real credentials
- Use strong passwords in production

⚠️ **Data Warnings:**
- `seed:quotes` **DELETES ALL EXISTING QUOTES** before inserting
- `seed:demo` skips if users already exist (safe to run multiple times)
- `seed:admin` skips if admin already exists (safe to run multiple times)

## Troubleshooting

### "Cannot connect to database"
- Check if MongoDB is running
- Verify `MONGODB_URI` in `.env.local`
- Ensure network connectivity to MongoDB Atlas (if using cloud)

### "Admin user already exists"
- This is expected behavior
- Delete the existing admin user first if you want to recreate
- Or use a different email by setting `ADMIN_EMAIL` environment variable

### "Module not found" errors
- Run `npm install` to ensure all dependencies are installed
- Ensure you're running from the project root directory

## Development

To create a new seed script:

1. Create a new `.ts` file in this directory
2. Follow the pattern from existing scripts:
   - Import `connectDB` from `../src/lib/db/connect`
   - Import necessary models
   - Create an async function
   - Handle errors and exit codes
3. Add a script to `package.json`

Example:

```typescript
import connectDB from '../src/lib/db/connect';
import YourModel from '../src/lib/db/models/YourModel';

async function seedYourData() {
  try {
    await connectDB();
    // Your seeding logic here
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

seedYourData();
```

## Questions?

Refer to the main project documentation or check the blueprint at `mulaboard-project-blueprint.md`.

import Link from 'next/link';
import { Button } from '@/components/ui';

/**
 * 404 Not Found Page
 *
 * Displayed when a user navigates to a non-existent route
 */

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        {/* 404 Illustration */}
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-primary mb-4">404</h1>
          <div className="text-6xl mb-4">🔍</div>
        </div>

        {/* Error Message */}
        <h2 className="text-3xl font-bold mb-4">Page Not Found</h2>
        <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
          Oops! The page you're looking for seems to have wandered off. Maybe it's getting
          some feedback elsewhere?
        </p>

        {/* Fun Quote */}
        <div className="bg-card border rounded-lg p-6 mb-8 max-w-lg mx-auto">
          <p className="text-sm text-muted-foreground italic">
            "Not all who wander are lost... but this page definitely is."
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <Button variant="primary" size="lg">
              Go to Homepage
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="outline" size="lg">
              Go to Dashboard
            </Button>
          </Link>
        </div>

        {/* Helpful Links */}
        <div className="mt-12 pt-8 border-t">
          <p className="text-sm text-muted-foreground mb-4">Looking for something specific?</p>
          <div className="flex flex-wrap gap-4 justify-center text-sm">
            <Link href="/feedback" className="text-primary hover:underline">
              Give Feedback
            </Link>
            <Link href="/profile" className="text-primary hover:underline">
              View Profile
            </Link>
            <Link href="/leaderboard" className="text-primary hover:underline">
              Leaderboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

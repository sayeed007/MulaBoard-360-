'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui';

/**
 * Error Page
 *
 * Displayed when an error occurs during rendering
 */

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        {/* Error Illustration */}
        <div className="mb-8">
          <div className="text-9xl mb-4">⚠️</div>
          <h1 className="text-4xl font-bold text-destructive mb-2">Oops! Something went wrong</h1>
        </div>

        {/* Error Message */}
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 mb-8 max-w-lg mx-auto">
          <p className="text-sm text-destructive font-mono">
            {error.message || 'An unexpected error occurred'}
          </p>
          {error.digest && (
            <p className="text-xs text-muted-foreground mt-2">
              Error ID: {error.digest}
            </p>
          )}
        </div>

        {/* Fun Quote */}
        <div className="bg-card border rounded-lg p-6 mb-8 max-w-lg mx-auto">
          <p className="text-sm text-muted-foreground italic">
            "The only real mistake is the one from which we learn nothing." - Henry Ford
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            (But seriously, we're sorry about this error!)
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Button variant="primary" size="lg" onClick={reset}>
            Try Again
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() => (window.location.href = '/')}
          >
            Go to Homepage
          </Button>
        </div>

        {/* Help Text */}
        <div className="text-sm text-muted-foreground">
          <p>If this error persists, please contact your administrator.</p>
        </div>
      </div>
    </div>
  );
}

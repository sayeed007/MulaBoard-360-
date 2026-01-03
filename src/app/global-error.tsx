'use client';

import { useEffect } from 'react';

/**
 * Global Error Page
 *
 * Catches errors in the root layout
 */

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Global application error:', error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center px-4 text-white">
          <div className="max-w-2xl w-full text-center">
            {/* Error Illustration */}
            <div className="mb-8">
              <div className="text-9xl mb-4">💥</div>
              <h1 className="text-4xl font-bold mb-2">Critical Error</h1>
            </div>

            {/* Error Message */}
            <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-6 mb-8 max-w-lg mx-auto">
              <p className="text-sm font-mono text-red-300">
                {error.message || 'A critical error occurred'}
              </p>
              {error.digest && (
                <p className="text-xs text-gray-400 mt-2">
                  Error ID: {error.digest}
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <button
                onClick={reset}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={() => (window.location.href = '/')}
                className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition-colors"
              >
                Go to Homepage
              </button>
            </div>

            {/* Help Text */}
            <div className="text-sm text-gray-400">
              <p>A critical error has occurred. Please try refreshing the page.</p>
              <p className="mt-2">If this error persists, contact your administrator.</p>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}

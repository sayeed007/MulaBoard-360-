import Link from 'next/link';

/**
 * Thank You Page
 *
 * Shown after successful feedback submission
 */

interface ThankYouPageProps {
  params: {
    slug: string;
  };
}

export const metadata = {
  title: 'Thank You | MulaBoard',
  description: 'Thank you for your feedback!',
};

export default function ThankYouPage({ params }: ThankYouPageProps) {
  const { slug } = params;

  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center p-8">
      <div className="max-w-2xl w-full">
        {/* Success Card */}
        <div className="bg-card rounded-lg shadow-lg p-12 border text-center space-y-6">
          {/* Celebration Icon */}
          <div className="text-8xl animate-bounce">🎉</div>

          {/* Title */}
          <h1 className="text-4xl font-bold">Feedback Submitted!</h1>

          {/* Message */}
          <div className="space-y-4">
            <p className="text-xl text-muted-foreground">
              Thank you for taking the time to provide thoughtful feedback.
            </p>
            <p className="text-muted-foreground">
              Your anonymous feedback helps create a culture of continuous improvement and growth.
            </p>
          </div>

          {/* Success Quote */}
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-6 my-6">
            <p className="text-lg font-medium italic">
              &quot;Feedback is the breakfast of champions.&quot;
            </p>
            <p className="text-sm text-muted-foreground mt-2">- Ken Blanchard</p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Link
              href="/dashboard"
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
            >
              Go to Dashboard
            </Link>
            <Link
              href={`/${slug}`}
              className="px-6 py-3 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors font-medium"
            >
              Give More Feedback
            </Link>
          </div>

          {/* Privacy Reminder */}
          <div className="mt-8 pt-6 border-t">
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <span>🔒</span>
              <span>Your feedback is completely anonymous and secure</span>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Want to receive feedback too?{' '}
            <Link href="/profile" className="text-primary hover:underline">
              Make sure your profile is active
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

import Link from 'next/link';
import { Button } from '@/components/ui';

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
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-100 via-background to-background dark:from-amber-950 dark:to-background flex items-center justify-center p-4">
      <div className="max-w-xl w-full animate-scale-in">

        {/* Success Card */}
        <div className="bg-white/60 dark:bg-zinc-900/60 backdrop-blur-2xl rounded-3xl p-8 md:p-12 border border-white/20 dark:border-zinc-800 shadow-xl text-center relative overflow-hidden">

          {/* Confetti Background Effect (CSS only placeholder) */}
          <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(circle,_#fbbf24_1px,_transparent_1px)] bg-[size:20px_20px]"></div>

          {/* Celebration Icon */}
          <div className="text-8xl mb-6 animate-bounce-gentle">🎉</div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-500 to-orange-600 mb-4">
            You're Awesome!
          </h1>

          {/* Message */}
          <div className="space-y-4 mb-8">
            <p className="text-xl font-medium text-foreground/80">
              Feedback successfully submitted.
            </p>
            <p className="text-muted-foreground">
              Your anonymous feedback helps spread good vibes and growth throughout the team.
            </p>
          </div>

          {/* Success Quote */}
          <div className="bg-background/50 border border-border/50 rounded-2xl p-6 mb-8 transform rotate-1 hover:rotate-0 transition-transform duration-300">
            <p className="text-lg font-medium italic text-foreground/90">
              &quot;Feedback is the breakfast of champions.&quot;
            </p>
            <p className="text-sm text-muted-foreground mt-2 font-bold uppercase tracking-wider">- Ken Blanchard</p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={`/${slug}`}>
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Give More Feedback
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="primary" size="lg" className="w-full sm:w-auto shadow-lg shadow-primary/25">
                Go to Dashboard
              </Button>
            </Link>
          </div>

          {/* Privacy Reminder */}
          <div className="mt-8 pt-6 border-t border-border/40">
            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground uppercase tracking-widest">
              <span>🔒</span>
              <span>100% Anonymous & Secure</span>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-8 text-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <p className="text-sm text-muted-foreground">
            Want to receive feedback too?{' '}
            <Link href="/profile" className="text-primary hover:underline font-medium">
              Activate your profile
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

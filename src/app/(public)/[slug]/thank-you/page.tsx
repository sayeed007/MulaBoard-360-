import Link from 'next/link';
import { Button } from '@/components/ui';

/**
 * Thank You Page
 *
 * Shown after successful feedback submission
 */

interface ThankYouPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export const metadata = {
  title: 'Thank You | MulaBoard',
  description: 'Thank you for your feedback!',
};

export default async function ThankYouPage({ params }: ThankYouPageProps) {
  const { slug } = await params;

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-100 via-background to-background dark:from-amber-950 dark:to-background flex items-center justify-center p-4">
      <div className="max-w-md w-full animate-scale-in">

        {/* Success Card */}
        <div className="bg-white/60 dark:bg-zinc-900/60 backdrop-blur-2xl rounded-2xl p-6 md:p-8 border border-white/20 dark:border-zinc-800 shadow-xl text-center relative overflow-hidden">

          {/* Confetti Background Effect */}
          <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(circle,_#fbbf24_1px,_transparent_1px)] bg-[size:16px_16px]"></div>

          {/* Celebration Icon */}
          <div className="text-6xl mb-4 animate-bounce-gentle">🎉</div>

          {/* Title */}
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-500 to-orange-600 mb-2">
            You're Awesome!
          </h1>

          {/* Message */}
          <div className="space-y-1 mb-6">
            <p className="text-lg font-medium text-foreground/80">
              Feedback successfully submitted.
            </p>
            <p className="text-sm text-muted-foreground">
              Your anonymous feedback helps spread good vibes.
            </p>
          </div>

          {/* Success Quote - More Compact */}
          <div className="bg-background/50 border border-border/50 rounded-xl p-4 mb-6 transform rotate-1 hover:rotate-0 transition-transform duration-300">
            <p className="text-base font-medium italic text-foreground/90">
              &quot;Feedback is the breakfast of champions.&quot;
            </p>
            <p className="text-xs text-muted-foreground mt-1 font-bold uppercase tracking-wider">- Ken Blanchard</p>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3 justify-center mb-6">
            <Link href={`/${slug}`} className="w-full">
              <Button variant="outline" className="w-full">
                Give More Feedback
              </Button>
            </Link>
            <Link href="/dashboard" className="w-full">
              <Button variant="primary" className="w-full shadow-lg shadow-primary/25">
                Go to Dashboard
              </Button>
            </Link>
          </div>

          {/* Footer & Privacy combined */}
          <div className="pt-4 border-t border-border/40 space-y-2">
            <div className="flex items-center justify-center gap-2 text-[10px] text-muted-foreground uppercase tracking-widest">
              <span>🔒</span>
              <span>100% Anonymous & Secure</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Want to receive feedback?{' '}
              <Link href="/profile" className="text-primary hover:underline font-medium">
                Activate your profile
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

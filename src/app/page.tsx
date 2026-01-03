import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth/helpers';

/**
 * Landing Page
 *
 * Main landing page for MulaBoard
 */

export const metadata = {
  title: 'MulaBoard 360° | Anonymous Feedback Platform',
  description: 'Collect honest, anonymous 360-degree feedback from your colleagues',
};

export default async function LandingPage() {
  const user = await getCurrentUser();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 py-20 sm:py-32">
          <div className="text-center">
            <h1 className="text-5xl sm:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
              MulaBoard 360°
            </h1>
            <p className="text-xl sm:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Collect honest, anonymous 360-degree feedback from your colleagues and grow together 🌿
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {user ? (
                <>
                  <Link
                    href="/dashboard"
                    className="px-8 py-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-semibold text-lg shadow-lg"
                  >
                    Go to Dashboard
                  </Link>
                  <Link
                    href="/profile"
                    className="px-8 py-4 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors font-semibold text-lg"
                  >
                    Edit Profile
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/register"
                    className="px-8 py-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-semibold text-lg shadow-lg"
                  >
                    Get Started
                  </Link>
                  <Link
                    href="/login"
                    className="px-8 py-4 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors font-semibold text-lg"
                  >
                    Sign In
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-card/50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16">Why MulaBoard?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon="🔒"
              title="100% Anonymous"
              description="Your feedback is completely anonymous. We use advanced fingerprinting to prevent duplicates while protecting your identity."
            />
            <FeatureCard
              icon="🎯"
              title="5 Key Metrics"
              description="Get feedback on Communication, Teamwork, Technical Skills, Problem Solving, and Work Attitude."
            />
            <FeatureCard
              icon="🌿"
              title="Mula Rating System"
              description="Fun gamification with Golden Mula, Fresh Carrot, and Rotten Tomato ratings to make feedback engaging."
            />
            <FeatureCard
              icon="🏆"
              title="Achievement Badges"
              description="Unlock badges for excellence, consistency, and improvement. Track your growth over time."
            />
            <FeatureCard
              icon="📊"
              title="Visual Dashboard"
              description="Beautiful charts and stats to help you understand your performance at a glance."
            />
            <FeatureCard
              icon="🚫"
              title="Spam Prevention"
              description="Multi-layer spam prevention ensures authentic feedback from real colleagues."
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <Step
              number="1"
              title="Create Your Profile"
              description="Sign up and set up your profile with your name, designation, and department."
            />
            <Step
              number="2"
              title="Share Your Link"
              description="Share your unique profile link with colleagues to collect feedback."
            />
            <Step
              number="3"
              title="Grow Together"
              description="View your feedback, earn badges, and improve based on honest insights."
            />
          </div>
        </div>
      </section>

      {/* Mula Rating Explanation */}
      <section className="py-20 bg-card/50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16">The Mula Rating System</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <RatingCard
              emoji="🌿✨"
              title="Golden Mula"
              score="4.5 - 5.0"
              description="Outstanding performance! You're a star!"
              bgColor="bg-yellow-50"
              textColor="text-yellow-700"
            />
            <RatingCard
              emoji="🥕"
              title="Fresh Carrot"
              score="3.0 - 4.49"
              description="Good work! Keep it up!"
              bgColor="bg-orange-50"
              textColor="text-orange-700"
            />
            <RatingCard
              emoji="🍅💀"
              title="Rotten Tomato"
              score="1.0 - 2.99"
              description="Room for improvement. Let's work on this!"
              bgColor="bg-red-50"
              textColor="text-red-700"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Get Feedback?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join your team on MulaBoard and start collecting honest, actionable feedback today.
          </p>
          {!user && (
            <Link
              href="/register"
              className="inline-block px-8 py-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-semibold text-lg shadow-lg"
            >
              Create Your Profile
            </Link>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t py-8">
        <div className="max-w-7xl mx-auto px-6 text-center text-sm text-muted-foreground">
          <p>MulaBoard 360° - Built with ❤️ for honest feedback</p>
          <p className="mt-2">May the Mula be with you! 🌿</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-card rounded-lg p-6 border hover:border-primary transition-all hover:shadow-lg">
      <div className="text-5xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}

function Step({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="text-center">
      <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
        {number}
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}

function RatingCard({
  emoji,
  title,
  score,
  description,
  bgColor,
  textColor,
}: {
  emoji: string;
  title: string;
  score: string;
  description: string;
  bgColor: string;
  textColor: string;
}) {
  return (
    <div className={`${bgColor} rounded-lg p-6 border-2 ${textColor} border-current`}>
      <div className="text-5xl mb-3">{emoji}</div>
      <h3 className="text-xl font-bold mb-1">{title}</h3>
      <p className="text-sm font-semibold mb-3">{score}</p>
      <p className="text-sm opacity-90">{description}</p>
    </div>
  );
}

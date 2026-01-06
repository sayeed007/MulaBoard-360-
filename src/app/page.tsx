import Link from 'next/link';
import Image from 'next/image';
import { getCurrentUser } from '@/lib/auth/helpers';
import { Button } from '@/components/ui';

export const metadata = {
  title: 'MulaBoard 360° | Anonymous Feedback Platform',
  description: 'Collect honest, anonymous 360-degree feedback from your colleagues',
};

export default async function LandingPage() {
  const user = await getCurrentUser();

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-100 via-background to-background dark:from-indigo-950 dark:to-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-12 md:pt-20 md:pb-16">
        <div className="container mx-auto px-4 sm:px-6 text-center z-10 relative">
          <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm font-medium text-primary mb-6 backdrop-blur-sm animate-fade-in">
            <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse"></span>
            Performance Reviews, Reimagined
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 text-foreground animate-slide-up">
            MulaBoard <span className="text-primary">360°</span>
          </h1>

          <p className="text-xl sm:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed animate-slide-up delay-100">
            Collect honest, anonymous feedback. <br className="hidden sm:block" />
            Grow with <span className="font-semibold text-foreground">Golden Mulas</span> 🌿 and real insights.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up delay-200">
            {user ? (
              <>
                <Link href="/dashboard">
                  <span className="h-14 px-8 text-lg rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-lg hover:shadow-primary/25 inline-flex items-center justify-center font-medium">
                    Go to Dashboard
                  </span>
                </Link>
                <Link href="/directory">
                  <span className="h-14 px-8 text-lg rounded-full bg-white/50 dark:bg-zinc-800/50 text-foreground hover:bg-white/80 dark:hover:bg-zinc-800/80 transition-all backdrop-blur-md border border-border inline-flex items-center justify-center font-medium">
                    Browse Directory 👥
                  </span>
                </Link>
              </>
            ) : (
              <>
                <Link href="/register">
                  <span className="h-14 px-8 text-lg rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-lg hover:shadow-primary/25 inline-flex items-center justify-center font-medium">
                    Get Started Free
                  </span>
                </Link>
                <Link href="/directory">
                  <span className="h-14 px-8 text-lg rounded-full bg-white/50 dark:bg-zinc-800/50 text-foreground hover:bg-white/80 dark:hover:bg-zinc-800/80 transition-all backdrop-blur-md border border-border inline-flex items-center justify-center font-medium">
                    Browse Directory 👥
                  </span>
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Background Decorations with Images */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 overflow-hidden pointer-events-none">
          <div className="absolute top-[10%] left-[20%] w-16 h-16 opacity-20 animate-bounce-gentle">
            <Image
              src="/images/golden_mula_transparent.png"
              alt="Golden Mula"
              width={64}
              height={64}
              className="object-contain"
            />
          </div>
          <div className="absolute top-[30%] right-[20%] w-14 h-14 opacity-20 animate-bounce-gentle" style={{ animationDelay: '1s' }}>
            <Image
              src="/images/fresh_carrot_transparent.png"
              alt="Fresh Carrot"
              width={56}
              height={56}
              className="object-contain"
            />
          </div>
          <div className="absolute bottom-[20%] left-[10%] w-12 h-12 opacity-10 animate-bounce-gentle" style={{ animationDelay: '0.5s' }}>
            <Image
              src="/images/rotten_tomato_transparent.png"
              alt="Rotten Tomato"
              width={48}
              height={48}
              className="object-contain"
            />
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why MulaBoard?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We combine professional 360° metrics with a fun, engaging interface that people actually want to use.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon="🔒"
              title="100% Anonymous"
              description="Advanced fingerprinting technology ensuring honest feedback without compromising identity."
            />
            <FeatureCard
              icon="🎯"
              title="5 Key Metrics"
              description="Rated on Work Quality, Communication, Teamwork, Technical Skills, and Attitude."
            />
            <FeatureCard
              icon="🌿"
              title="Gamified Ratings"
              description="From Golden Mulas to Rotten Tomatoes, visual ratings make feedback memorable."
            />
            <FeatureCard
              icon="🏆"
              title="Badges & Rewards"
              description="Earn achievements for consistency, improvement, and outstanding performance."
            />
            <FeatureCard
              icon="📊"
              title="Beautiful Controls"
              description="Visual dashboards that turn raw data into actionable personal insights."
            />
            <FeatureCard
              icon="🚫"
              title="Smart Moderation"
              description="Multi-layer spam protection and optional admin moderation keep things civil."
            />
          </div>
        </div>
      </section>

      {/* Mula Meter Showcase */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 text-white rounded-3xl p-8 md:p-12 relative overflow-hidden shadow-2xl">
            <div className="relative z-10 max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-8 text-white">The Mula Rating System</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                <RatingCard
                  imageSrc="/images/golden_mula_transparent.png"
                  title="Golden Mula"
                  score="4.5 - 5.0"
                  description="Outstanding! The office MVP."
                  color="text-[#FFD700]"
                  bg="bg-[#FFD700]/10"
                  border="border-[#FFD700]/20"
                />
                <RatingCard
                  imageSrc="/images/fresh_carrot_transparent.png"
                  title="Fresh Carrot"
                  score="3.0 - 4.4"
                  description="Solid work. Keep growing!"
                  color="text-[#FF6B35]"
                  bg="bg-[#FF6B35]/10"
                  border="border-[#FF6B35]/20"
                />
                <RatingCard
                  imageSrc="/images/rotten_tomato_transparent.png"
                  title="Rotten Tomato"
                  score="1.0 - 2.9"
                  description="Needs attention. Room to improve."
                  color="text-[#DC2626]"
                  bg="bg-[#DC2626]/10"
                  border="border-[#DC2626]/20"
                />
              </div>
            </div>

            {/* Dark Mode Decor */}
            <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-primary/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl"></div>
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="py-12 border-t border-border">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Grow? 🌿</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join your team on MulaBoard today.
          </p>
          {!user && (
            <Link href="/register">
              <span className="h-14 px-10 text-lg rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-xl hover:shadow-primary/25 inline-flex items-center justify-center font-bold tracking-wide">
                Start Your Journey
              </span>
            </Link>
          )}

          <footer className="mt-16 text-sm text-muted-foreground">
            <p>MulaBoard 360° &copy; {new Date().getFullYear()}</p>
          </footer>
        </div>
      </section>
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
    <div className="group bg-white/60 dark:bg-zinc-900/40 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
      <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">{icon}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}

function RatingCard({
  imageSrc,
  title,
  score,
  description,
  color,
  bg,
  border
}: {
  imageSrc: string;
  title: string;
  score: string;
  description: string;
  color: string;
  bg: string;
  border: string;
}) {
  return (
    <div className={`${bg} ${border} border backdrop-blur-sm rounded-xl p-6 transition-transform hover:scale-105`}>
      <div className="w-16 h-16 mb-4 relative">
        <Image
          src={imageSrc}
          alt={title}
          width={64}
          height={64}
          className="object-contain animate-bounce-gentle"
        />
      </div>
      <h3 className={`text-lg font-bold mb-1 ${color}`}>{title}</h3>
      <div className="text-2xl font-bold text-white mb-2">{score}</div>
      <p className="text-zinc-400 text-sm">{description}</p>
    </div>
  );
}

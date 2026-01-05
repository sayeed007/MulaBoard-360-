import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth/helpers';
import LoginForm from '@/components/auth/LoginForm';
import { Logo } from '@/components/ui';

export const metadata = {
  title: 'Login | MulaBoard',
  description: 'Sign in to your MulaBoard account',
};

export default async function LoginPage() {
  const session = await getSession();

  if (session?.user) {
    // Redirect based on user role
    if (session.user.role === 'admin') {
      redirect('/admin');
    } else {
      redirect('/dashboard');
    }
  }

  return (
    <div className="min-h-screen w-full grid grid-cols-1 md:grid-cols-2 overflow-hidden">

      {/* Left Column: Branding (Visible on md+) */}
      <div className="hidden md:flex flex-col justify-center items-center relative p-12 overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-100 via-zinc-50 to-white dark:from-emerald-950 dark:via-zinc-900 dark:to-zinc-950">

        {/* Floating Orbs (Adjusted for light theme) */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl animate-pulse mix-blend-multiply dark:mix-blend-normal"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-teal-400/20 rounded-full blur-3xl animate-pulse mix-blend-multiply dark:mix-blend-normal" style={{ animationDelay: '2s' }}></div>

        <div className="relative z-10 text-center space-y-8 animate-slide-up">
          {/* Logo Container */}
          <div className="relative w-48 h-48 mx-auto mb-4 transition-transform hover:scale-105 duration-500">
            <Logo size={192} priority />
          </div>

          <div className="space-y-4 max-w-lg">
            <h1 className="text-4xl lg:text-5xl font-bold tracking-tight text-zinc-900 dark:text-white">
              Welcome to MulaBoard
            </h1>
            <p className="text-lg text-zinc-600 dark:text-zinc-300 leading-relaxed font-light">
              "The only thing worse than being reviewed is not being reviewed at all."
            </p>
          </div>
        </div>

        <div className="absolute bottom-8 text-xs text-zinc-500 dark:text-zinc-600">
          © {new Date().getFullYear()} MulaBoard Inc.
        </div>
      </div>

      {/* Right Column: Form */}
      <div className="flex flex-col justify-center items-center p-8 bg-background relative">
        <div className="w-full max-w-[400px] animate-slide-up" style={{ animationDelay: '0.1s' }}>
          {/* Mobile Logo (Visible only on small screens) */}
          <div className="md:hidden flex flex-col items-center mb-8">
            <div className="w-20 h-20 relative mb-4 flex justify-center">
              <Logo size={80} />
            </div>
            <h2 className="text-2xl font-bold">MulaBoard</h2>
          </div>

          <LoginForm />
        </div>
      </div>
    </div>
  );
}

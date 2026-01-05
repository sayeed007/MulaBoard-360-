import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth/helpers';
import RegisterForm from '@/components/auth/RegisterForm';
import Image from 'next/image';

export const metadata = {
  title: 'Register | MulaBoard',
  description: 'Create your MulaBoard account',
};

export default async function RegisterPage() {
  const session = await getSession();

  if (session?.user) {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen w-full grid grid-cols-1 md:grid-cols-2 overflow-hidden">

      {/* Left Column: Branding (Visible on md+) */}
      <div className="hidden md:flex flex-col justify-center items-center relative p-12 overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-100 via-zinc-50 to-white dark:from-sky-950 dark:via-zinc-900 dark:to-zinc-950">

        {/* Floating Orbs */}
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl animate-pulse mix-blend-multiply dark:mix-blend-normal"></div>
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-indigo-400/20 rounded-full blur-3xl animate-pulse mix-blend-multiply dark:mix-blend-normal" style={{ animationDelay: '2s' }}></div>

        <div className="relative z-10 text-center space-y-8 animate-slide-up">
          {/* Logo Container */}
          <div className="relative w-40 h-40 mx-auto mb-4 transition-transform hover:scale-105 duration-500">
            {/* Light Mode Logo */}
            <Image
              src="/logo_black.png"
              alt="MulaBoard Logo"
              fill
              className="object-contain drop-shadow-sm dark:hidden"
              priority
            />
            {/* Dark Mode Logo */}
            <Image
              src="/logo.png"
              alt="MulaBoard Logo"
              fill
              className="object-contain drop-shadow-2xl hidden dark:block"
              priority
            />
          </div>

          <div className="space-y-4 max-w-lg">
            <h1 className="text-4xl lg:text-5xl font-bold tracking-tight text-zinc-900 dark:text-white">
              Join the Revolution
            </h1>
            <p className="text-lg text-zinc-600 dark:text-zinc-300 leading-relaxed font-light">
              "Building better workplaces, one honest review at a time."
            </p>
          </div>
        </div>

        <div className="absolute bottom-8 text-xs text-zinc-500 dark:text-zinc-600">
          © {new Date().getFullYear()} MulaBoard Inc.
        </div>
      </div>

      {/* Right Column: Form */}
      <div className="flex flex-col justify-center items-center p-8 bg-background relative h-full overflow-y-auto">
        <div className="w-full max-w-[500px] animate-slide-up my-auto" style={{ animationDelay: '0.1s' }}>
          {/* Mobile Logo (Visible only on small screens) */}
          <div className="md:hidden flex flex-col items-center mb-8">
            <div className="w-16 h-16 relative mb-4">
              <Image
                src="/logo_black.png"
                alt="MulaBoard"
                fill
                className="object-contain dark:hidden"
              />
              <Image
                src="/logo.png"
                alt="MulaBoard"
                fill
                className="object-contain hidden dark:block"
              />
            </div>
            <h2 className="text-2xl font-bold">MulaBoard</h2>
          </div>

          <RegisterForm />
        </div>
      </div>
    </div>
  );
}

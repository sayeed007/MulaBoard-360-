import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth/helpers';
import LoginForm from '@/components/auth/LoginForm';

/**
 * Login Page
 *
 * Public page for user authentication
 * Redirects to dashboard if already authenticated
 */

export const metadata = {
  title: 'Login | MulaBoard',
  description: 'Sign in to your MulaBoard account',
};

export default async function LoginPage() {
  // Check if user is already authenticated
  const session = await getSession();

  if (session?.user) {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-block text-6xl mb-4">🌿</div>
          <h1 className="text-2xl font-bold">MulaBoard</h1>
          <p className="text-sm text-muted-foreground mt-1">
            360° Anonymous Feedback Platform
          </p>
        </div>

        <div className="bg-card shadow-lg rounded-lg p-8 border">
          <LoginForm />
        </div>

        <p className="text-center text-xs text-muted-foreground mt-8">
          &quot;The only thing worse than being reviewed is not being reviewed at all.&quot;
        </p>
      </div>
    </div>
  );
}

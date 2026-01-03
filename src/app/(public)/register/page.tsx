import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth/helpers';
import RegisterForm from '@/components/auth/RegisterForm';

/**
 * Registration Page
 *
 * Public page for new user registration
 * Redirects to dashboard if already authenticated
 */

export const metadata = {
  title: 'Register | MulaBoard',
  description: 'Create your MulaBoard account',
};

export default async function RegisterPage() {
  // Check if user is already authenticated
  const session = await getSession();

  if (session?.user) {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4 py-12">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <div className="inline-block text-6xl mb-4">🌿</div>
          <h1 className="text-2xl font-bold">MulaBoard</h1>
          <p className="text-sm text-muted-foreground mt-1">
            360° Anonymous Feedback Platform
          </p>
        </div>

        <div className="bg-card shadow-lg rounded-lg p-8 border">
          <RegisterForm />
        </div>

        <p className="text-center text-xs text-muted-foreground mt-8">
          &quot;Building better workplaces, one honest review at a time.&quot;
        </p>
      </div>
    </div>
  );
}

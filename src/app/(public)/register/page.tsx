import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth/helpers';
import RegisterForm from '@/components/auth/RegisterForm';
import Image from 'next/image';

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
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4 py-4">
      <div className="w-full max-w-2xl">
        <div className="flex items-center justify-evenly text-center mb-4">
          <Image
            src={'/logo.png'}
            alt={'MulaBoard360'}
            width={164}
            height={128}
          />
          <div>
            <h1 className="text-2xl font-bold">MulaBoard</h1>
            <p className="text-sm text-muted-foreground mt-1">
              360° Anonymous Feedback Platform
            </p>
          </div>
        </div>

        <div className="bg-card shadow-lg rounded-lg px-8 py-2 border">
          <RegisterForm />
        </div>

        <p className="text-center text-xs text-muted-foreground mt-8">
          &quot;Building better workplaces, one honest review at a time.&quot;
        </p>
      </div>
    </div>
  );
}

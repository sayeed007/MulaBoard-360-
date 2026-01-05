'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginInput } from '@/validators/user';
import Link from 'next/link';
import { Button, Input, Alert } from '@/components/ui';

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string>('');

  useEffect(() => {
    if (searchParams.get('registered') === 'true') {
      setSuccessMessage('Registration successful! Your account is pending admin approval. You will receive an email once approved.');
    }
  }, [searchParams]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    setError('');
    setIsLoading(true);

    try {
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        switch (result.error) {
          case 'pending_approval':
            setError('Your account is pending admin approval. You will receive an email once approved.');
            break;
          case 'inactive_profile':
            setError('Your account is inactive. Please contact support.');
            break;
          case 'CredentialsSignin':
            // Fallback for generic credential errors
            setError('Invalid email or password.');
            break;
          case 'invalid_credentials':
            setError('ID or Password incorrect.');
            break;
          case 'rejected':
            setError('Your account has been rejected by an admin.');
            break;
          default:
            setError('Login failed. Please try again.');
        }
        setIsLoading(false);
        return;
      }

      // Fetch session to check user role and redirect accordingly
      const response = await fetch('/api/auth/session');
      const session = await response.json();

      if (session?.user?.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }
      router.refresh();
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Welcome Back</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Sign in to access your MulaBoard dashboard
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
        {successMessage && (
          <Alert variant="success" title="Registration Successful">
            {successMessage}
          </Alert>
        )}

        {error && (
          <Alert variant="danger" title="Login Failed">
            {error}
          </Alert>
        )}

        <div className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            id="email"
            autoComplete="email"
            placeholder="your.email@company.com"
            error={errors.email?.message}
            fullWidth
            {...register('email')}
          />

          <Input
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            placeholder="Enter your password"
            error={errors.password?.message}
            fullWidth
            {...register('password')}
          />
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          isLoading={isLoading}
        >
          Sign In
        </Button>

        <div className="text-center text-sm">
          <span className="text-muted-foreground">Don&apos;t have an account? </span>
          <Link
            href="/register"
            className="font-medium text-primary hover:text-primary/90 transition-colors"
          >
            Register here
          </Link>
        </div>
      </form>
    </div>
  );
}

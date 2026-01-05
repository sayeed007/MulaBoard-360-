'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, type RegisterInput } from '@/validators/user';
import Link from 'next/link';
import { Button, Input, Alert } from '@/components/ui';
import { User, Mail, Briefcase, Building2, Lock, Eye, EyeOff, Check } from 'lucide-react';

export default function RegisterForm() {
  const router = useRouter();
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    mode: 'onChange', // Validate on change for realtime feedback
  });

  const password = watch('password');

  // Password Validation Logic
  const validations = [
    { label: '8+ chars', valid: password?.length >= 8 },
    { label: 'Uppercase', valid: /[A-Z]/.test(password || '') },
    { label: 'Lowercase', valid: /[a-z]/.test(password || '') },
    { label: 'Number', valid: /[0-9]/.test(password || '') },
  ];

  const onSubmit = async (data: RegisterInput) => {
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || 'Registration failed. Please try again.');
        setIsLoading(false);
        return;
      }

      router.push('/login?registered=true');
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Create Account</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Join MulaBoard to receive anonymous feedback
        </p>
      </div>

      {/* Admin Approval Notice */}
      <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-lg p-4">
        <p className="text-sm text-blue-900 dark:text-blue-100 text-center">
          <strong>📋 Admin Approval Required:</strong> After registration, your account will be pending admin approval.
          You'll receive an email notification once your account is approved and you can log in.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {error && (
          <Alert variant="danger" title="Registration Failed">
            {error}
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Full Name"
            type="text"
            id="fullName"
            autoComplete="name"
            placeholder="John Doe"
            error={errors.fullName?.message}
            fullWidth
            leftIcon={<User className="h-4 w-4" />}
            {...register('fullName')}
          />

          <Input
            label="Email Address"
            type="email"
            id="email"
            autoComplete="email"
            placeholder="john@example.com"
            error={errors.email?.message}
            fullWidth
            leftIcon={<Mail className="h-4 w-4" />}
            {...register('email')}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Designation"
            type="text"
            id="designation"
            autoComplete="organization-title"
            placeholder="Engineer"
            error={errors.designation?.message}
            fullWidth
            leftIcon={<Briefcase className="h-4 w-4" />}
            {...register('designation')}
          />

          <Input
            label="Department"
            type="text"
            id="department"
            autoComplete="organization"
            placeholder="Product"
            error={errors.department?.message}
            fullWidth
            leftIcon={<Building2 className="h-4 w-4" />}
            {...register('department')}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            id="password"
            autoComplete="new-password"
            placeholder="********"
            error={errors.password?.message}
            fullWidth
            leftIcon={<Lock className="h-4 w-4" />}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            }
            {...register('password')}
          />

          <Input
            label="Confirm"
            type={showConfirmPassword ? 'text' : 'password'}
            id="confirmPassword"
            autoComplete="new-password"
            placeholder="********"
            error={errors.confirmPassword?.message}
            fullWidth
            leftIcon={<Lock className="h-4 w-4" />}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="hover:text-foreground transition-colors"
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            }
            {...register('confirmPassword')}
          />
        </div>

        {/* Compact Password Strength */}
        <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs bg-muted/40 p-3 rounded-lg border border-border/50">
          {validations.map((rule) => (
            <div key={rule.label} className={`flex items-center gap-1 ${rule.valid ? 'text-green-600 dark:text-green-500 font-medium' : 'text-muted-foreground'}`}>
              {rule.valid ? <Check className="h-3 w-3" /> : <div className="h-1.5 w-1.5 rounded-full bg-zinc-300 dark:bg-zinc-600" />}
              <span>{rule.label}</span>
            </div>
          ))}
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          isLoading={isLoading}
          className="mt-6"
        >
          Create Account
        </Button>

        <div className="text-center text-sm">
          <span className="text-muted-foreground">Already have an account? </span>
          <Link
            href="/login"
            className="font-medium text-primary hover:text-primary/90 transition-colors"
          >
            Sign in here
          </Link>
        </div>
      </form>
    </div>
  );
}

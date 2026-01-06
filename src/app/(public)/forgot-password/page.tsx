'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button, Input, Logo } from '@/components/ui';
import Link from 'next/link';

interface ForgotPasswordForm {
    email: string;
}

export default function ForgotPasswordPage() {
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ForgotPasswordForm>();

    const onSubmit = async (data: ForgotPasswordForm) => {
        setLoading(true);
        setError('');

        try {
            const response = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Something went wrong');
            }

            setSuccess(true);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-md space-y-8 animate-slide-up">
                {/* Header */}
                <div className="text-center">
                    <div className="flex justify-center mb-6">
                        <Logo size={60} />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">
                        Forgot password?
                    </h1>
                    <p className="mt-2 text-muted-foreground">
                        Enter your email address and we'll send you a link to reset your password.
                    </p>
                </div>

                {/* Card */}
                <div className="bg-card border border-white/10 dark:border-zinc-800 rounded-2xl p-8 shadow-xl backdrop-blur-sm">
                    {success ? (
                        <div className="text-center space-y-6">
                            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto text-3xl">
                                📨
                            </div>
                            <h3 className="text-xl font-semibold text-foreground">Check your email</h3>
                            <p className="text-muted-foreground">
                                We've sent a password reset link to your email address. Please check your inbox (and spam folder).
                            </p>
                            <div className="pt-4">
                                <Link href="/login">
                                    <Button variant="outline" className="w-full">
                                        Back to login
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            <Input
                                label="Email Address"
                                placeholder="name@company.com"
                                type="email"
                                fullWidth
                                error={errors.email?.message}
                                {...register('email', {
                                    required: 'Email is required',
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: 'Invalid email address',
                                    },
                                })}
                            />

                            {error && (
                                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm text-center">
                                    {error}
                                </div>
                            )}

                            <Button
                                type="submit"
                                variant="primary"
                                className="w-full"
                                disabled={loading}
                            >
                                {loading ? 'Sending link...' : 'Send Reset Link'}
                            </Button>

                            <div className="text-center">
                                <Link
                                    href="/login"
                                    className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                                >
                                    Back to login
                                </Link>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}

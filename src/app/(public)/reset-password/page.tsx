'use client';

import { useState, useEffect, Suspense } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button, Input, Logo } from '@/components/ui';
import Link from 'next/link';

interface ResetPasswordForm {
    password: string;
    confirmPassword: string;
}

function ResetPasswordContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // Validate token presence
    useEffect(() => {
        if (!token) {
            setError('Missing or invalid reset token.');
        }
    }, [token]);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<ResetPasswordForm>();

    const password = watch('password');

    const onSubmit = async (data: ResetPasswordForm) => {
        if (!token) return;

        setLoading(true);
        setError('');

        try {
            const response = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    token,
                    password: data.password,
                }),
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

    if (!token) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="w-full max-w-md text-center space-y-6 p-8 bg-card rounded-2xl border border-destructive/20 shadow-xl">
                    <div className="text-4xl">⚠️</div>
                    <h2 className="text-xl font-bold">Invalid Link</h2>
                    <p className="text-muted-foreground">
                        This password reset link is invalid or has expired. Please request a new one.
                    </p>
                    <Link href="/forgot-password">
                        <Button variant="primary">Request New Link</Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-md space-y-8 animate-slide-up">
                {/* Header */}
                <div className="text-center">
                    <div className="flex justify-center mb-6">
                        <Logo size={60} />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">
                        Reset Password
                    </h1>
                    <p className="mt-2 text-muted-foreground">
                        Enter your new password below.
                    </p>
                </div>

                {/* Card */}
                <div className="bg-card border border-white/10 dark:border-zinc-800 rounded-2xl p-8 shadow-xl backdrop-blur-sm">
                    {success ? (
                        <div className="text-center space-y-6">
                            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto text-3xl">
                                ✅
                            </div>
                            <h3 className="text-xl font-semibold text-foreground">Password Reset Successful</h3>
                            <p className="text-muted-foreground">
                                Your password has been updated. You can now use your new password to log in.
                            </p>
                            <div className="pt-4">
                                <Link href="/login">
                                    <Button variant="primary" className="w-full">
                                        Log In Now
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            <Input
                                label="New Password"
                                type={showPassword ? 'text' : 'password'}
                                fullWidth
                                error={errors.password?.message}
                                rightIcon={
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="focus:outline-none"
                                    >
                                        {showPassword ? '👁️' : '🔒'}
                                    </button>
                                }
                                {...register('password', {
                                    required: 'Password is required',
                                    minLength: {
                                        value: 8,
                                        message: 'Password must be at least 8 characters',
                                    },
                                })}
                            />

                            <Input
                                label="Confirm Password"
                                type={showPassword ? 'text' : 'password'}
                                fullWidth
                                error={errors.confirmPassword?.message}
                                {...register('confirmPassword', {
                                    required: 'Please confirm your password',
                                    validate: (val) =>
                                        val === password || 'Passwords do not match',
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
                                {loading ? 'Resetting...' : 'Reset Password'}
                            </Button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="w-full max-w-md text-center space-y-6 p-8">
                    <div className="text-4xl">⏳</div>
                    <p className="text-muted-foreground">Loading...</p>
                </div>
            </div>
        }>
            <ResetPasswordContent />
        </Suspense>
    );
}

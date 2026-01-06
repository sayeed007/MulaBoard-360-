'use client';

import { useState, useEffect, Suspense } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button, Input, Logo, Alert } from '@/components/ui';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';

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
            <div className="min-h-screen flex items-center justify-center p-4 bg-background">
                <div className="w-full max-w-md text-center space-y-6 p-8 bg-card rounded-2xl border border-destructive/20 shadow-xl">
                    <div className="text-4xl">⚠️</div>
                    <h2 className="text-xl font-bold">Invalid Link</h2>
                    <p className="text-muted-foreground">
                        This password reset link is invalid or has expired. Please request a new one.
                    </p>
                    <Link href="/forgot-password">
                        <Button variant="primary" fullWidth>Request New Link</Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full grid grid-cols-1 md:grid-cols-2 overflow-hidden">
            {/* Left Column: Branding */}
            <div className="hidden md:flex flex-col justify-center items-center relative p-12 overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-100 via-zinc-50 to-white dark:from-emerald-950 dark:via-zinc-900 dark:to-zinc-950">
                {/* Floating Orbs */}
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl animate-pulse mix-blend-multiply dark:mix-blend-normal"></div>
                <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-teal-400/20 rounded-full blur-3xl animate-pulse mix-blend-multiply dark:mix-blend-normal" style={{ animationDelay: '2s' }}></div>

                <div className="relative z-10 text-center space-y-8 animate-slide-up">
                    <div className="relative w-48 h-48 mx-auto mb-4 transition-transform hover:scale-105 duration-500">
                        <Logo size={192} priority />
                    </div>

                    <div className="space-y-4 max-w-lg">
                        <h1 className="text-4xl lg:text-5xl font-bold tracking-tight text-zinc-900 dark:text-white">
                            Secure Access
                        </h1>
                        <p className="text-lg text-zinc-600 dark:text-zinc-300 leading-relaxed font-light">
                            "A secure account is the foundation of trust."
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
                    {/* Mobile Logo */}
                    <div className="md:hidden flex flex-col items-center mb-8">
                        <div className="w-20 h-20 relative mb-4 flex justify-center">
                            <Logo size={80} />
                        </div>
                        <h2 className="text-2xl font-bold">MulaBoard</h2>
                    </div>

                    <div className="w-full max-w-md space-y-8">
                        {success ? (
                            <div className="text-center space-y-6">
                                <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto text-4xl animate-bounce">
                                    ✅
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-2xl font-bold text-foreground">Password Reset Successful</h3>
                                    <p className="text-muted-foreground">
                                        Your password has been updated. You can now use your new password to log in.
                                    </p>
                                </div>
                                <div className="pt-4">
                                    <Link href="/login">
                                        <Button variant="primary" className="w-full h-12">
                                            Log In Now
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="text-center">
                                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Reset Password</h1>
                                    <p className="mt-2 text-sm text-muted-foreground">
                                        Create a strong new password for your account
                                    </p>
                                </div>

                                <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
                                    {error && (
                                        <Alert variant="danger" title="Error">
                                            {error}
                                        </Alert>
                                    )}

                                    <div className="space-y-4">
                                        <div className="relative">
                                            <Input
                                                label="New Password"
                                                type={showPassword ? 'text' : 'password'}
                                                fullWidth
                                                error={errors.password?.message}
                                                {...register('password', {
                                                    required: 'Password is required',
                                                    minLength: {
                                                        value: 8,
                                                        message: 'Password must be at least 8 characters',
                                                    },
                                                })}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-9 text-muted-foreground hover:text-foreground transition-colors"
                                                tabIndex={-1}
                                            >
                                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                            </button>
                                        </div>

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
                                    </div>

                                    <Button
                                        type="submit"
                                        variant="primary"
                                        size="lg"
                                        fullWidth
                                        isLoading={loading}
                                    >
                                        Reset Password
                                    </Button>
                                </form>
                            </>
                        )}
                    </div>
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
                    <div className="text-4xl animate-spin">⏳</div>
                    <p className="text-muted-foreground">Loading...</p>
                </div>
            </div>
        }>
            <ResetPasswordContent />
        </Suspense>
    );
}

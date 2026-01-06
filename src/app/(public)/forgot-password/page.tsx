'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button, Input, Logo, Alert } from '@/components/ui';
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
                            Account Recovery
                        </h1>
                        <p className="text-lg text-zinc-600 dark:text-zinc-300 leading-relaxed font-light">
                            "Don't worry, even the best of us forget things sometimes."
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
                                    📨
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-2xl font-bold text-foreground">Check your email</h3>
                                    <p className="text-muted-foreground">
                                        We've sent a password reset link to your email address. Please check your inbox (and spam folder).
                                    </p>
                                </div>
                                <div className="pt-4">
                                    <Link href="/login">
                                        <Button variant="outline" className="w-full h-12">
                                            Back to login
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="text-center">
                                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Forgot Password?</h1>
                                    <p className="mt-2 text-sm text-muted-foreground">
                                        Enter your email below to reset your password
                                    </p>
                                </div>

                                <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
                                    {error && (
                                        <Alert variant="danger" title="Error">
                                            {error}
                                        </Alert>
                                    )}

                                    <div className="space-y-4">
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
                                    </div>

                                    <Button
                                        type="submit"
                                        variant="primary"
                                        size="lg"
                                        fullWidth
                                        isLoading={loading}
                                    >
                                        Send Reset Link
                                    </Button>

                                    <div className="text-center">
                                        <Link
                                            href="/login"
                                            className="text-sm font-medium text-primary hover:text-primary/90 transition-colors"
                                        >
                                            Back to login
                                        </Link>
                                    </div>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

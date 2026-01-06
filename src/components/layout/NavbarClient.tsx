'use client';

import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { Button, Logo } from '@/components/ui';
import NavLink from './NavLink';
import UserMobileMenu from './UserMobileMenu';

interface NavbarProps {
    user: {
        name: string;
        image?: string | null;
        publicSlug: string;
        role: 'employee' | 'admin';
    };
    isAdmin: boolean;
    pendingCount: number;
}

export default function NavbarClient({ user, isAdmin, pendingCount }: NavbarProps) {
    const handleSignOut = () => {
        signOut({ redirectTo: '/login' });
    };

    return (
        <div className="border-b border-border bg-card shadow-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
                {/* Logo & Main Nav */}
                <div className="flex items-center gap-8">
                    <Link href="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                        <Logo size={32} />
                        <span className="font-bold text-lg hidden sm:block bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-500">
                            MulaBoard
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-1">
                        <NavLink href="/dashboard">Dashboard</NavLink>
                        <NavLink href="/directory">Directory</NavLink>
                        <NavLink href="/my-reviews">My Reviews</NavLink>
                        <NavLink href="/profile">Profile</NavLink>
                        <NavLink href="/settings">Settings</NavLink>
                    </nav>
                </div>

                {/* User Actions */}
                <div className="flex items-center gap-4">
                    {/* Admin Panel Link - Desktop */}
                    {isAdmin && (
                        <div className="hidden sm:flex items-center gap-2">
                            <Link href="/admin">
                                <Button variant="ghost" size="sm" className="text-purple-600 hover:text-purple-700 hover:bg-purple-50 dark:text-purple-400 dark:hover:bg-purple-900/20">
                                    ⚡ Admin Panel
                                </Button>
                            </Link>
                            {pendingCount > 0 && (
                                <Link href="/admin/pending" className="relative">
                                    <Button variant="outline" size="sm" className="h-8 text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50 dark:text-yellow-400 dark:hover:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
                                        <span className="mr-1">✅</span>
                                        <span className="hidden sm:inline">Pending</span>
                                        <span className="ml-1.5 bg-yellow-500 text-yellow-950 text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                                            {pendingCount}
                                        </span>
                                    </Button>
                                </Link>
                            )}
                        </div>
                    )}

                    <div className="h-8 w-px bg-border/50 hidden sm:block"></div>

                    {/* Desktop Actions */}
                    <div className="hidden md:flex items-center gap-3">
                        <Link href={`/${user.publicSlug}`} target="_blank">
                            <Button variant="outline" size="sm" className="text-xs h-8">
                                View Public
                            </Button>
                        </Link>

                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:text-destructive hover:bg-destructive/10 h-8 border border-red-500 text-red-500"
                            onClick={handleSignOut}
                        >
                            Sign Out
                        </Button>

                        <Link href="/profile" className="flex-shrink-0">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center font-bold text-primary border-2 border-background shadow-sm hover:scale-105 transition-transform border border-primary">
                                {user.image ? (
                                    <img src={user.image} alt={user.name} className="w-full h-full rounded-full object-cover" />
                                ) : (
                                    user.name.charAt(0)
                                )}
                            </div>
                        </Link>
                    </div>

                    {/* Mobile Menu */}
                    <UserMobileMenu
                        userName={user.name}
                        userInitial={user.name.charAt(0)}
                        userImage={user.image}
                        publicSlug={user.publicSlug}
                        isAdmin={isAdmin}
                        pendingCount={pendingCount}
                        onSignOut={handleSignOut}
                    />
                </div>
            </div>
        </div>
    );
}

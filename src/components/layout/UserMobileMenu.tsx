'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, LogOut, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui';

interface MobileMenuLink {
    href: string;
    label: string;
    icon?: React.ReactNode;
}

interface UserMobileMenuProps {
    userName: string;
    userInitial: string;
    userImage?: string | null;
    publicSlug: string;
    isAdmin: boolean;
    pendingCount?: number;
    onSignOut: () => void;
}

export default function UserMobileMenu({
    userName,
    userInitial,
    userImage,
    publicSlug,
    isAdmin,
    pendingCount = 0,
    onSignOut,
}: UserMobileMenuProps) {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    const mainLinks: MobileMenuLink[] = [
        { href: '/dashboard', label: 'Dashboard' },
        { href: '/my-reviews', label: 'My Reviews' },
        { href: '/profile', label: 'Profile' },
        { href: '/settings', label: 'Settings' },
    ];

    const isActive = (href: string) => pathname === href;

    return (
        <>
            {/* Mobile Menu Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden p-2 hover:bg-muted rounded-lg transition-colors"
                aria-label="Toggle menu"
            >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Mobile Menu Overlay */}
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black/50 z-40 md:hidden"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Menu Panel */}
                    <div className="fixed top-[64px] left-0 right-0 bg-card border-b shadow-lg z-50 md:hidden animate-slide-down max-h-[calc(100vh-64px)] overflow-y-auto">
                        <div className="px-4 py-4 space-y-2">
                            {/* User Info */}
                            <div className="flex items-center gap-3 pb-3 border-b border-border mb-3">
                                <Link href="/profile" onClick={() => setIsOpen(false)}>
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center font-bold text-primary border-2 border-background shadow-sm">
                                        {userImage ? (
                                            <img
                                                src={userImage}
                                                alt={userName}
                                                className="w-full h-full rounded-full object-cover"
                                            />
                                        ) : (
                                            userInitial
                                        )}
                                    </div>
                                </Link>
                                <div className="flex-1">
                                    <p className="text-sm font-medium">{userName}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {isAdmin ? 'Admin' : 'Employee'}
                                    </p>
                                </div>
                            </div>

                            {/* Main Navigation Links */}
                            {mainLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setIsOpen(false)}
                                    className={`block px-4 py-3 rounded-lg font-medium transition-colors ${isActive(link.href)
                                            ? 'bg-primary text-primary-foreground'
                                            : 'hover:bg-muted'
                                        }`}
                                >
                                    {link.label}
                                </Link>
                            ))}

                            {/* Admin Section */}
                            {isAdmin && (
                                <div className="pt-3 border-t border-border mt-3 space-y-2">
                                    <Link
                                        href="/admin"
                                        onClick={() => setIsOpen(false)}
                                        className="block px-4 py-3 rounded-lg font-medium bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400 hover:bg-purple-200 dark:hover:bg-purple-900/30 transition-colors"
                                    >
                                        ⚡ Admin Panel
                                    </Link>

                                    {pendingCount > 0 && (
                                        <Link
                                            href="/admin/users/pending"
                                            onClick={() => setIsOpen(false)}
                                            className="block px-4 py-3 rounded-lg font-medium bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400 hover:bg-yellow-200 dark:hover:bg-yellow-900/30 transition-colors"
                                        >
                                            <div className="flex items-center justify-between">
                                                <span>✅ Pending Approvals</span>
                                                <span className="bg-yellow-500 text-yellow-950 text-xs font-bold px-2 py-1 rounded-full">
                                                    {pendingCount}
                                                </span>
                                            </div>
                                        </Link>
                                    )}
                                </div>
                            )}

                            {/* Secondary Actions */}
                            <div className="pt-3 border-t border-border mt-3 space-y-2">
                                <Link
                                    href={`/${publicSlug}`}
                                    target="_blank"
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center justify-between px-4 py-3 rounded-lg font-medium hover:bg-muted transition-colors"
                                >
                                    <span>View Public Profile</span>
                                    <ExternalLink size={16} />
                                </Link>

                                <button
                                    onClick={() => {
                                        setIsOpen(false);
                                        onSignOut();
                                    }}
                                    className="w-full flex items-center justify-between px-4 py-3 rounded-lg font-medium text-destructive hover:bg-destructive/10 transition-colors"
                                >
                                    <span>Sign Out</span>
                                    <LogOut size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    );
}

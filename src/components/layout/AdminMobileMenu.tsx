'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';

interface MobileMenuLink {
    href: string;
    label: string;
}

interface AdminMobileMenuProps {
    userName: string;
    userInitial: string;
}

export default function AdminMobileMenu({ userName, userInitial }: AdminMobileMenuProps) {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    const links: MobileMenuLink[] = [
        { href: '/admin', label: 'Dashboard' },
        { href: '/admin/users', label: 'Users' },
        { href: '/admin/pending', label: 'Pending' },
        { href: '/admin/feedbacks', label: 'Feedbacks' },
        { href: '/admin/periods', label: 'Periods' },
        { href: '/admin/quotes', label: 'Quotes' },
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
                    <div className="fixed top-[73px] left-0 right-0 bg-card border-b shadow-lg z-50 md:hidden animate-slide-down">
                        <div className="max-w-7xl mx-auto px-6 py-4 space-y-2">
                            {/* User Info */}
                            <div className="flex items-center gap-3 pb-3 border-b border-border mb-3">
                                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold">
                                    {userInitial}
                                </div>
                                <div>
                                    <p className="text-sm font-medium">{userName}</p>
                                    <p className="text-xs text-muted-foreground">Admin</p>
                                </div>
                            </div>

                            {/* Navigation Links */}
                            {links.map((link) => (
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

                            {/* Back to Dashboard Link */}
                            <Link
                                href="/dashboard"
                                onClick={() => setIsOpen(false)}
                                className="block px-4 py-3 mt-4 rounded-lg font-medium bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors text-center"
                            >
                                Back to Dashboard
                            </Link>
                        </div>
                    </div>
                </>
            )}
        </>
    );
}

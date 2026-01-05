'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils/helpers';

interface AdminNavLinkProps {
  href: string;
  children: React.ReactNode;
}

export default function AdminNavLink({ href, children }: AdminNavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href || (href !== '/admin' && pathname.startsWith(href + '/'));

  return (
    <Link
      href={href}
      className={cn(
        'px-3 py-2 text-sm font-medium rounded-lg transition-colors',
        isActive
          ? 'bg-primary text-primary-foreground'
          : 'hover:bg-muted'
      )}
    >
      {children}
    </Link>
  );
}

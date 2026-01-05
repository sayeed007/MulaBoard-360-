'use client';

import { cn } from '@/lib/utils/helpers';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
}

export default function NavLink({ href, children }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(href + '/');

  return (
    <Link
      href={href}
      className={cn(
        'px-4 py-2 text-sm font-medium rounded-lg transition-all',
        isActive
          ? 'text-foreground bg-primary/10 border border-primary/20'
          : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
      )}
    >
      {children}
    </Link>
  );
}

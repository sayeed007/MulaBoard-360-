/**
 * Authenticated Layout
 *
 * Layout for authenticated pages (dashboard, profile, my-reviews, settings)
 * Requires user to be logged in
 */

import Navbar from '@/components/layout/Navbar';

export default function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-50 via-background to-background dark:from-emerald-950/20 dark:to-background">
      <Navbar />
      <main>
        {children}
      </main>
    </div>
  );
}

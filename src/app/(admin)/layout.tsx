import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/helpers';
import Link from 'next/link';

/**
 * Admin Layout
 *
 * Protected layout for admin pages - requires admin role
 */

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  // Redirect if not authenticated or not admin
  if (!user) {
    redirect('/login');
  }

  if (user.role !== 'admin') {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Admin Header */}
      <header className="bg-card border-b sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Link href="/admin" className="flex items-center gap-2">
                <span className="text-2xl">👨‍💼</span>
                <h1 className="text-xl font-bold">Admin Panel</h1>
              </Link>

              {/* Admin Navigation */}
              <nav className="hidden md:flex items-center gap-4">
                <Link
                  href="/admin"
                  className="px-3 py-2 text-sm font-medium hover:bg-muted rounded-lg transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  href="/admin/users"
                  className="px-3 py-2 text-sm font-medium hover:bg-muted rounded-lg transition-colors"
                >
                  Users
                </Link>
                <Link
                  href="/admin/feedbacks"
                  className="px-3 py-2 text-sm font-medium hover:bg-muted rounded-lg transition-colors"
                >
                  Feedbacks
                </Link>
                <Link
                  href="/admin/periods"
                  className="px-3 py-2 text-sm font-medium hover:bg-muted rounded-lg transition-colors"
                >
                  Periods
                </Link>
                <Link
                  href="/admin/quotes"
                  className="px-3 py-2 text-sm font-medium hover:bg-muted rounded-lg transition-colors"
                >
                  Quotes
                </Link>
              </nav>
            </div>

            {/* User Info */}
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard"
                className="px-3 py-2 text-sm font-medium bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors"
              >
                Back to Dashboard
              </Link>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold">
                  {user.name.charAt(0)}
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-muted-foreground">Admin</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">{children}</main>
    </div>
  );
}

import { redirect } from 'next/navigation';
import { getCurrentUser, hasAdminRole } from '@/lib/auth/helpers';
import Link from 'next/link';
import { Logo } from '@/components/ui';
import AdminNavLink from '@/components/layout/AdminNavLink';
import AdminMobileMenu from '@/components/layout/AdminMobileMenu';

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

  if (!hasAdminRole(user.role)) {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Admin Header */}
      <header className="bg-card border-b sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Link href="/admin" className="flex items-center gap-2">
                <Logo size={48} />
                <h1 className="text-lg sm:text-xl font-bold">Admin Panel</h1>
              </Link>

              {/* Admin Navigation - Desktop */}
              <nav className="hidden md:flex items-center gap-2">
                <AdminNavLink href="/admin">Dashboard</AdminNavLink>
                <AdminNavLink href="/admin/users">Users</AdminNavLink>
                <AdminNavLink href="/admin/pending">Pending</AdminNavLink>
                <AdminNavLink href="/admin/feedbacks">Feedbacks</AdminNavLink>
                <AdminNavLink href="/admin/periods">Periods</AdminNavLink>
                <AdminNavLink href="/admin/quotes">Quotes</AdminNavLink>
              </nav>
            </div>

            {/* Right Side - User Info & Mobile Menu */}
            <div className="flex items-center gap-2">
              {/* Mobile Menu Button */}
              <AdminMobileMenu
                userName={user.name}
                userInitial={user.name.charAt(0)}
              />

              {/* Desktop Actions */}
              <Link
                href="/dashboard"
                className="hidden md:block px-3 py-2 text-sm font-medium bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors"
              >
                Back to Dashboard
              </Link>
              <div className="hidden md:flex items-center gap-2">
                <div className="w-8 h-8 rounded-full border border-primary bg-primary/20 flex items-center justify-center text-sm font-bold">
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">{children}</main>
    </div>
  );
}

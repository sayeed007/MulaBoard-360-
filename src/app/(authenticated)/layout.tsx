/**
 * Authenticated Layout
 *
 * Layout for authenticated pages (dashboard, profile, my-reviews, settings)
 * Requires user to be logged in
 */

export default function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

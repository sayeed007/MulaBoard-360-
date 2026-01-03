/**
 * Public Layout
 *
 * Layout for public pages (login, register, public profiles)
 * No authentication required
 */

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

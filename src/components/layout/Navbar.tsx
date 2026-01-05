import { getCurrentUser, hasAdminRole } from '@/lib/auth/helpers';
import connectDB from '@/lib/db/connect';
import User from '@/lib/db/models/User';
import NavbarClient from './NavbarClient';

export default async function Navbar() {
  const user = await getCurrentUser();

  if (!user) return null;

  // Get pending users count for admin
  let pendingCount = 0;
  const isAdmin = hasAdminRole(user.role);

  if (isAdmin) {
    try {
      await connectDB();
      pendingCount = await User.countDocuments({ accountStatus: 'pending' });
    } catch (error) {
      console.error('Error fetching pending users count:', error);
    }
  }

  return (
    <NavbarClient
      user={{
        name: user.name,
        image: user.image,
        publicSlug: user.publicSlug,
        role: user.role,
      }}
      isAdmin={isAdmin}
      pendingCount={pendingCount}
    />
  );
}

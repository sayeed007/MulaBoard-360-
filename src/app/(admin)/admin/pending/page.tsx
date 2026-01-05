import { redirect } from 'next/navigation';
import { getCurrentUser, hasAdminRole } from '@/lib/auth/helpers';
import connectDB from '@/lib/db/connect';
import User from '@/lib/db/models/User';
import PendingUsersTable from '@/components/admin/PendingUsersTable';
import Link from 'next/link';
import { Button } from '@/components/ui';

export const metadata = {
  title: 'Pending Users | Admin',
  description: 'Review and approve pending user registrations',
};

export default async function PendingUsersPage() {
  const currentUser = await getCurrentUser();

  if (!currentUser || !hasAdminRole(currentUser.role)) {
    redirect('/dashboard');
  }

  // Fetch all pending users
  await connectDB();
  const pendingUsers = await User.find({ accountStatus: 'pending' })
    .select('_id fullName email designation department createdAt')
    .sort({ createdAt: -1 })
    .lean();

  // Convert MongoDB documents to plain objects
  const users = pendingUsers.map((user) => ({
    ...user,
    _id: user._id.toString(),
    createdAt: user?.createdAt?.toISOString(),
    updatedAt: user?.updatedAt?.toISOString(),
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Pending User Approvals</h1>
          <p className="text-muted-foreground mt-1">
            Review and approve new user registrations
          </p>
        </div>
        <Link href="/admin/users">
          <Button variant="outline">
            View All Users
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="bg-card rounded-lg border p-6">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <p className="text-sm text-muted-foreground">Pending Approvals</p>
            <p className="text-3xl font-bold">{users.length}</p>
          </div>
          {users.length > 0 && (
            <div className="text-sm text-muted-foreground">
              Oldest request: {new Date(users[users.length - 1].createdAt).toLocaleDateString()}
            </div>
          )}
        </div>
      </div>

      {/* Pending Users Table */}
      {users.length === 0 ? (
        <div className="bg-card rounded-lg border p-12 text-center">
          <p className="text-lg text-muted-foreground">
            No pending user approvals at this time.
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            New user registrations will appear here for your review.
          </p>
        </div>
      ) : (
        <PendingUsersTable users={users} />
      )}
    </div>
  );
}

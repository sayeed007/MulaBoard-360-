import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCurrentUser, hasAdminRole } from '@/lib/auth/helpers';
import connectDB from '@/lib/db/connect';
import User from '@/lib/db/models/User';
import { Button, Badge } from '@/components/ui';

export const metadata = {
    title: 'Manage Users | MulaBoard Admin',
    description: 'Manage employee accounts and roles.',
};

export default async function AdminUsersPage() {
    const currentUser = await getCurrentUser();

    if (!currentUser || !hasAdminRole(currentUser.role)) {
        redirect('/dashboard');
    }

    await connectDB();

    // Fetch all users
    const users = await User.find({})
        .sort({ createdAt: -1 })
        .select('-password')
        .lean();

    return (
        <div className="space-y-8 animate-slide-up">
            {/* Header */}
            <div className="bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md rounded-2xl p-8 border border-white/20 dark:border-zinc-800 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Link href="/admin" className="text-muted-foreground hover:text-primary transition-colors">
                            Admin Dashboard
                        </Link>
                        <span className="text-muted-foreground">/</span>
                        <span className="font-semibold">Users</span>
                    </div>
                    <h1 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-600">
                        User Management
                    </h1>
                    <p className="text-muted-foreground">
                        View and manage {users.length} registered employees.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Link href="/admin/users/invite">
                        <Button variant="primary">
                            + Invite User
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md rounded-2xl border border-white/20 dark:border-zinc-800 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-muted/50 text-muted-foreground uppercase tracking-wider font-semibold">
                            <tr>
                                <th className="px-6 py-4">Employee</th>
                                <th className="px-6 py-4">Role</th>
                                <th className="px-6 py-4">Department</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Joined</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50">
                            {users.map((user: any) => (
                                <tr key={user._id} className="hover:bg-muted/30 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center font-bold text-primary">
                                                {user.profileImage ? (
                                                    <img src={user.profileImage} alt={user.fullName} className="w-full h-full rounded-full object-cover" />
                                                ) : (
                                                    user.fullName.charAt(0)
                                                )}
                                            </div>
                                            <div>
                                                <div className="font-medium text-foreground">{user.fullName}</div>
                                                <div className="text-xs text-muted-foreground">{user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Badge variant={user.role === 'admin' ? 'default' : 'info'} className="capitalize">
                                            {user.role}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-medium">{user.department}</div>
                                        <div className="text-xs text-muted-foreground">{user.designation}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {user.isProfileActive ? (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                                                <span className="w-1.5 h-1.5 rounded-full bg-green-600 dark:bg-green-400"></span>
                                                Active
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-400">
                                                <span className="w-1.5 h-1.5 rounded-full bg-zinc-500"></span>
                                                Hidden
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-muted-foreground">
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <Button variant="ghost" size="sm">Edit</Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui';
import { Check, X, Mail, User, Briefcase, Building2, Calendar } from 'lucide-react';

interface PendingUser {
  _id: string;
  fullName: string;
  email: string;
  designation?: string;
  department?: string;
  createdAt: string;
}

interface PendingUsersTableProps {
  users: PendingUser[];
}

export default function PendingUsersTable({ users: initialUsers }: PendingUsersTableProps) {
  const router = useRouter();
  const [users, setUsers] = useState(initialUsers);
  const [loadingUserId, setLoadingUserId] = useState<string | null>(null);
  const [rejectionUserId, setRejectionUserId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [error, setError] = useState('');

  const handleApprove = async (userId: string) => {
    setLoadingUserId(userId);
    setError('');

    try {
      const response = await fetch(`/api/admin/users/${userId}/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'approve' }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || 'Failed to approve user');
        setLoadingUserId(null);
        return;
      }

      // Remove user from list
      setUsers(users.filter((u) => u._id !== userId));
      router.refresh();
    } catch (err) {
      setError('An unexpected error occurred');
      setLoadingUserId(null);
    }
  };

  const handleReject = async (userId: string) => {
    if (!rejectionReason.trim()) {
      setError('Please provide a reason for rejection');
      return;
    }

    setLoadingUserId(userId);
    setError('');

    try {
      const response = await fetch(`/api/admin/users/${userId}/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'reject',
          rejectionReason,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || 'Failed to reject user');
        setLoadingUserId(null);
        return;
      }

      // Remove user from list and close modal
      setUsers(users.filter((u) => u._id !== userId));
      setRejectionUserId(null);
      setRejectionReason('');
      router.refresh();
    } catch (err) {
      setError('An unexpected error occurred');
      setLoadingUserId(null);
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      <div className="bg-card rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50 border-b">
              <tr>
                <th className="text-left p-4 font-medium text-sm">User Details</th>
                <th className="text-left p-4 font-medium text-sm">Position</th>
                <th className="text-left p-4 font-medium text-sm">Registered</th>
                <th className="text-right p-4 font-medium text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border-b last:border-b-0 hover:bg-muted/30 transition-colors">
                  <td className="p-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{user.fullName}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Mail className="h-3 w-3" />
                        <span>{user.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="space-y-1">
                      {user.designation && (
                        <div className="flex items-center gap-2 text-sm">
                          <Briefcase className="h-3 w-3 text-muted-foreground" />
                          <span>{user.designation}</span>
                        </div>
                      )}
                      {user.department && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Building2 className="h-3 w-3" />
                          <span>{user.department}</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(user.createdAt).toLocaleString()}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleApprove(user._id)}
                        disabled={loadingUserId === user._id}
                        className="text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900/20"
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setRejectionUserId(user._id)}
                        disabled={loadingUserId === user._id}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        <X className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Rejection Modal */}
      {rejectionUserId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg border shadow-lg max-w-md w-full p-6 space-y-4">
            <h3 className="text-lg font-bold">Reject User Registration</h3>
            <p className="text-sm text-muted-foreground">
              Please provide a reason for rejecting this user's registration. This will be visible to the user.
            </p>
            <textarea
              className="w-full min-h-[100px] p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter rejection reason..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
            />
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  setRejectionUserId(null);
                  setRejectionReason('');
                  setError('');
                }}
                disabled={loadingUserId === rejectionUserId}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleReject(rejectionUserId)}
                disabled={loadingUserId === rejectionUserId || !rejectionReason.trim()}
              >
                {loadingUserId === rejectionUserId ? 'Rejecting...' : 'Reject User'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

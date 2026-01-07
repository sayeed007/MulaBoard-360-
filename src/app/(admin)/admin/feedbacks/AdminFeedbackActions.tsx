'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui';

interface AdminFeedbackActionsProps {
    feedbackId: string;
    currentStatus: 'pending' | 'approved' | 'flagged';
}

export default function AdminFeedbackActions({
    feedbackId,
    currentStatus
}: AdminFeedbackActionsProps) {
    const router = useRouter();
    const [loading, setLoading] = useState<string | null>(null);

    const handleAction = async (action: 'approve' | 'flag' | 'reject') => {
        setLoading(action);
        try {
            const response = await fetch(`/api/admin/feedbacks/${feedbackId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ action: action }),
            });

            if (response.ok) {
                router.refresh();
            } else {
                const data = await response.json();
                alert('Action failed: ' + (data.error || 'Unknown error'));
            }
        } catch (error) {
            console.error('Action error:', error);
            alert('An error occurred.');
        } finally {
            setLoading(null);
        }
    };

    return (
        <div className="flex gap-2 w-full">
            {currentStatus !== 'approved' && (
                <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900/20 border-green-200"
                    onClick={() => handleAction('approve')}
                    disabled={!!loading}
                >
                    {loading === 'approve' ? '...' : 'Approve'}
                </Button>
            )}

            {currentStatus !== 'flagged' && (
                <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 border-red-200"
                    onClick={() => handleAction('flag')}
                    disabled={!!loading}
                >
                    {loading === 'flag' ? '...' : 'Flag'}
                </Button>
            )}
        </div>
    );
}

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Badge } from '@/components/ui';

interface Period {
    _id: string;
    name: string;
    slug: string;
    startDate: string;
    endDate: string;
    isActive: boolean;
    theme: {
        name: string;
        primaryEmoji: string;
        backgroundColor?: string;
    };
    createdAt: string;
}

interface PeriodCardProps {
    period: Period;
}

export default function PeriodCard({ period }: PeriodCardProps) {
    const router = useRouter();
    const [isActivating, setIsActivating] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const isUpcoming = new Date(period.startDate) > new Date();
    const isClosed = new Date(period.endDate) < new Date();

    const handleActivate = async () => {
        setIsActivating(true);

        try {
            const response = await fetch(`/api/periods/${period._id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isActive: true }),
            });

            if (response.ok) {
                router.refresh();
            }
        } catch (error) {
            console.error('Failed to activate period:', error);
        } finally {
            setIsActivating(false);
        }
    };

    const handleDeactivate = async () => {
        setIsActivating(true);

        try {
            const response = await fetch(`/api/periods/${period._id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isActive: false }),
            });

            if (response.ok) {
                router.refresh();
            }
        } catch (error) {
            console.error('Failed to deactivate period:', error);
        } finally {
            setIsActivating(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm(`Are you sure you want to delete "${period.name}"? This action cannot be undone.`)) {
            return;
        }

        setIsDeleting(true);

        try {
            const response = await fetch(`/api/periods/${period._id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                router.refresh();
            }
        } catch (error) {
            console.error('Failed to delete period:', error);
        } finally {
            setIsDeleting(false);
        }
    };

    let statusBadge;
    if (period.isActive) {
        statusBadge = <Badge variant="success" className="animate-pulse">Active Now</Badge>;
    } else if (isUpcoming) {
        statusBadge = <Badge variant="info">Upcoming</Badge>;
    } else if (isClosed) {
        statusBadge = <Badge variant="default">Closed</Badge>;
    } else {
        statusBadge = <Badge variant="default">Inactive</Badge>;
    }

    return (
        <div
            className={`bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md rounded-2xl p-6 border ${period.isActive
                    ? 'border-primary/50 shadow-md ring-2 ring-primary/20'
                    : 'border-white/20 dark:border-zinc-800 shadow-sm'
                } flex flex-col`}
        >
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
                <div className="text-5xl">{period.theme.primaryEmoji}</div>
                {statusBadge}
            </div>

            {/* Content */}
            <h3 className="text-xl font-bold mb-1">{period.name}</h3>
            {period.theme.name && (
                <p className="text-sm font-medium text-primary mb-4 italic">&quot;{period.theme.name}&quot;</p>
            )}

            <div className="space-y-2 text-sm text-muted-foreground mb-6">
                <div className="flex justify-between">
                    <span>Start:</span>
                    <span className="font-medium text-foreground">
                        {new Date(period.startDate).toLocaleDateString()}
                    </span>
                </div>
                <div className="flex justify-between">
                    <span>End:</span>
                    <span className="font-medium text-foreground">
                        {new Date(period.endDate).toLocaleDateString()}
                    </span>
                </div>
            </div>

            {/* Actions */}
            <div className="mt-auto flex gap-2">
                {period.isActive ? (
                    <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={handleDeactivate}
                        isLoading={isActivating}
                    >
                        Deactivate
                    </Button>
                ) : (
                    <Button
                        variant="primary"
                        size="sm"
                        className="flex-1"
                        onClick={handleActivate}
                        isLoading={isActivating}
                    >
                        Activate
                    </Button>
                )}
                <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={handleDelete}
                    isLoading={isDeleting}
                >
                    Delete
                </Button>
            </div>
        </div>
    );
}

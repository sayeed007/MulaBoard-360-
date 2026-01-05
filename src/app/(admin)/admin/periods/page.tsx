import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCurrentUser, hasAdminRole } from '@/lib/auth/helpers';
import connectDB from '@/lib/db/connect';
import ReviewPeriod from '@/lib/db/models/ReviewPeriod';
import { Button, Badge } from '@/components/ui';

export const metadata = {
    title: 'Review Periods | MulaBoard Admin',
    description: 'Manage performance review cycles.',
};

export default async function AdminPeriodsPage() {
    const currentUser = await getCurrentUser();

    if (!currentUser || !hasAdminRole(currentUser.role)) {
        redirect('/dashboard');
    }

    await connectDB();

    // Fetch all review periods
    const periods = await ReviewPeriod.find({})
        .sort({ startDate: -1 })
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
                        <span className="font-semibold">Review Periods</span>
                    </div>
                    <h1 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-teal-500 to-emerald-600">
                        Review Cycles
                    </h1>
                    <p className="text-muted-foreground">
                        Create and manage {periods.length} performance review periods.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Link href="/admin/periods/new">
                        <Button variant="primary">
                            + New Period
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Periods Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {periods.length > 0 ? periods.map((period: any) => {
                    const isActive = period.isActive;
                    const isUpcoming = new Date(period.startDate) > new Date();
                    const isClosed = new Date(period.endDate) < new Date();

                    let statusBadge;
                    if (isActive) {
                        statusBadge = <Badge variant="success" className="animate-pulse">Active Now</Badge>;
                    } else if (isUpcoming) {
                        statusBadge = <Badge variant="info">Upcoming</Badge>;
                    } else {
                        statusBadge = <Badge variant="default">Closed</Badge>;
                    }

                    return (
                        <div key={period._id} className={`bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md rounded-2xl p-6 border ${isActive ? 'border-primary/50 shadow-md ring-1 ring-primary/20' : 'border-white/20 dark:border-zinc-800 shadow-sm'} flex flex-col`}>
                            <div className="flex justify-between items-start mb-4">
                                <div className="text-4xl mb-2">📅</div>
                                {statusBadge}
                            </div>

                            <h3 className="text-xl font-bold mb-1">{period.name}</h3>
                            {period.theme && (
                                <p className="text-sm font-medium text-primary mb-4 italic">&quot;{period.theme}&quot;</p>
                            )}

                            <div className="space-y-2 text-sm text-muted-foreground mb-6">
                                <div className="flex justify-between">
                                    <span>Start Date:</span>
                                    <span className="font-medium text-foreground">{new Date(period.startDate).toLocaleDateString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>End Date:</span>
                                    <span className="font-medium text-foreground">{new Date(period.endDate).toLocaleDateString()}</span>
                                </div>
                            </div>

                            <div className="mt-auto flex gap-2">
                                <Button variant="outline" size="sm" className="w-full">Edit</Button>
                                <Button variant="ghost" size="sm" className="w-full">Stats</Button>
                            </div>
                        </div>
                    );
                }) : (
                    <div className="col-span-full text-center py-12 bg-card/50 rounded-2xl border border-dashed text-muted-foreground">
                        No review periods defined yet. Create one to get started!
                    </div>
                )}
            </div>
        </div>
    );
}

import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCurrentUser, hasAdminRole } from '@/lib/auth/helpers';
import connectDB from '@/lib/db/connect';
import ReviewPeriod from '@/lib/db/models/ReviewPeriod';
import CreatePeriodForm from '@/components/admin/CreatePeriodForm';
import PeriodCard from '@/components/admin/PeriodCard';
import { Button } from '@/components/ui';

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

    // Convert to plain objects for client components
    const periodsData = periods.map(p => ({
        _id: p._id.toString(),
        name: p.name,
        slug: p.slug,
        startDate: p.startDate.toISOString(),
        endDate: p.endDate.toISOString(),
        isActive: p.isActive,
        theme: p.theme,
        createdAt: p.createdAt.toISOString(),
    }));

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-2 text-sm">
                        <Link href="/admin" className="text-muted-foreground hover:text-primary transition-colors">
                            Admin Dashboard
                        </Link>
                        <span className="text-muted-foreground">/</span>
                        <span className="font-semibold">Review Periods</span>
                    </div>
                    <h1 className="text-3xl font-bold mb-1">Review Periods</h1>
                    <p className="text-muted-foreground">
                        Manage feedback collection cycles ({periodsData.length} total)
                    </p>
                </div>
                <Link href="/admin">
                    <Button variant="outline">
                        Back to Admin
                    </Button>
                </Link>
            </div>

            {/* Create Period Form */}
            <CreatePeriodForm />

            {/* Periods List */}
            <div className="space-y-4">
                <h2 className="text-xl font-semibold">
                    All Periods
                    {periodsData.filter(p => p.isActive).length > 0 && (
                        <span className="ml-2 text-sm font-normal text-muted-foreground">
                            ({periodsData.filter(p => p.isActive).length} active)
                        </span>
                    )}
                </h2>

                {periodsData.length === 0 ? (
                    <div className="col-span-full text-center py-12 bg-card/30 rounded-2xl border border-dashed">
                        <div className="text-6xl mb-4 grayscale opacity-50">📅</div>
                        <h3 className="text-xl font-bold mb-2">No Review Periods Yet</h3>
                        <p className="text-muted-foreground">
                            Create your first review period above to start collecting feedback
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {periodsData.map((period) => (
                            <PeriodCard key={period._id} period={period} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

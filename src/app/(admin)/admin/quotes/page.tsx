import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCurrentUser, hasAdminRole } from '@/lib/auth/helpers';
import connectDB from '@/lib/db/connect';
import Quote from '@/lib/db/models/Quote';
import { Button, Badge } from '@/components/ui';

export const metadata = {
    title: 'Manage Quotes | MulaBoard Admin',
    description: 'Manage fun quotes for the dashboard.',
};

export default async function AdminQuotesPage() {
    const currentUser = await getCurrentUser();

    if (!currentUser || !hasAdminRole(currentUser.role)) {
        redirect('/dashboard');
    }

    await connectDB();

    // Fetch all quotes
    const quotes = await Quote.find({})
        .sort({ createdAt: -1 })
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
                        <span className="font-semibold">Quotes</span>
                    </div>
                    <h1 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-amber-500 to-orange-600">
                        Fun Quotes
                    </h1>
                    <p className="text-muted-foreground">
                        Manage {quotes.length} motivational (or funny) quotes.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Link href="/admin/quotes/new">
                        <Button variant="primary">
                            + Add Quote
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Quotes Listing */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {quotes.length > 0 ? quotes.map((quote: any) => (
                    <div key={quote._id} className="bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md rounded-2xl p-6 border border-white/20 dark:border-zinc-800 shadow-sm flex flex-col hover:shadow-md transition-all">
                        <div className="flex-1 mb-4 flex items-start gap-3">
                            <span className="text-4xl text-primary/20 serif font-bold">“</span>
                            <p className="text-lg font-medium text-foreground/90 leading-relaxed italic">
                                {quote.text}
                            </p>
                        </div>
                        <div className="flex justify-between items-end">
                            <div>
                                <p className="text-sm font-semibold text-foreground capitalize">{quote.mood}</p>
                                <p className="text-xs text-muted-foreground">{quote.category || 'General'}</p>
                            </div>
                            <div>
                                {quote.isActive ? (
                                    <Badge variant="success">Active</Badge>
                                ) : (
                                    <Badge variant="default">Inactive</Badge>
                                )}
                            </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-border/50 flex justify-end gap-2">
                            <Button variant="ghost" size="sm">Edit</Button>
                            <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">Delete</Button>
                        </div>
                    </div>
                )) : (
                    <div className="col-span-full text-center py-12 bg-card/50 rounded-2xl border border-dashed text-muted-foreground">
                        No quotes added yet. Add some flavor to the dashboard!
                    </div>
                )}
            </div>
        </div>
    );
}

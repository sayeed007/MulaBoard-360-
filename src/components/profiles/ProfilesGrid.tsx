import ProfileCard from './ProfileCard';

interface ProfilesGridProps {
    users: Array<{
        _id: string;
        fullName: string;
        designation: string;
        department: string;
        profileImage?: string;
        bio?: string;
        publicSlug: string;
        stats?: {
            totalFeedbacks: number;
            averageRating: number;
            mulaDistribution: {
                golden_mula: number;
                fresh_carrot: number;
                rotten_tomato: number;
            };
        } | null;
    }>;
    isLoading?: boolean;
}

export default function ProfilesGrid({ users, isLoading = false }: ProfilesGridProps) {
    if (isLoading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.from({ length: 12 }).map((_, i) => (
                    <div
                        key={i}
                        className="bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl border border-white/20 dark:border-zinc-800 rounded-2xl p-6 animate-pulse"
                    >
                        <div className="flex justify-center mb-4">
                            <div className="w-24 h-24 rounded-full bg-muted"></div>
                        </div>
                        <div className="space-y-3">
                            <div className="h-6 bg-muted rounded w-3/4 mx-auto"></div>
                            <div className="h-4 bg-muted rounded w-1/2 mx-auto"></div>
                            <div className="h-4 bg-muted rounded w-2/3 mx-auto"></div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (users.length === 0) {
        return (
            <div className="text-center py-16">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-2xl font-bold mb-2">No Profiles Found</h3>
                <p className="text-muted-foreground mb-6">
                    Try adjusting your search or filters to find what you&apos;re looking for.
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {users.map((user) => (
                <ProfileCard key={user._id} user={user} />
            ))}
        </div>
    );
}

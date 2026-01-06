import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

interface ProfileCardProps {
    user: {
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
    };
}

export default function ProfileCard({ user }: ProfileCardProps) {
    const { fullName, designation, department, profileImage, bio, publicSlug, stats } = user;

    // Get dominant Mula rating
    const getDominantMula = () => {
        if (!stats) return null;
        const { mulaDistribution } = stats;
        const max = Math.max(mulaDistribution.golden_mula, mulaDistribution.fresh_carrot, mulaDistribution.rotten_tomato);
        if (max === 0) return null;
        if (mulaDistribution.golden_mula === max) return {
            image: '/images/golden_mula_transparent.png',
            label: 'Golden Mula',
            color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
        };
        if (mulaDistribution.fresh_carrot === max) return {
            image: '/images/fresh_carrot_transparent.png',
            label: 'Fresh Carrot',
            color: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
        };
        return {
            image: '/images/rotten_tomato_transparent.png',
            label: 'Rotten Tomato',
            color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
        };
    };

    const dominantMula = getDominantMula();

    return (
        <Link href={`/directory/${publicSlug}`} className="block group">
            <Card className="h-full transition-all duration-300 hover:shadow-xl hover:scale-[1.02] hover:border-primary/50" padding='sm'>
                <CardContent className="p-4">
                    {/* Profile Image */}
                    <div className="flex justify-center mb-3">
                        <div className="relative">
                            <div className="w-20 h-20 rounded-full p-1 bg-gradient-to-br from-primary via-purple-500 to-pink-500 shadow-lg">
                                {profileImage ? (
                                    <img
                                        src={profileImage}
                                        alt={fullName}
                                        className="w-full h-full rounded-full object-cover border-4 border-background"
                                    />
                                ) : (
                                    <div className="w-full h-full rounded-full bg-background flex items-center justify-center text-2xl font-bold text-primary border-4 border-background">
                                        {fullName.charAt(0)}
                                    </div>
                                )}
                            </div>

                            {/* Dominant Mula Badge */}
                            {dominantMula && (
                                <div className="absolute -bottom-1 -right-1 bg-background rounded-full p-1 shadow-md border-2 border-background">
                                    <Image
                                        src={dominantMula.image}
                                        alt={dominantMula.label}
                                        width={24}
                                        height={24}
                                        className="object-contain"
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Name */}
                    <h3 className="text-lg font-bold text-center mb-1 group-hover:text-primary transition-colors line-clamp-1">
                        {fullName}
                    </h3>

                    {/* Designation & Department */}
                    <div className="text-center space-y-0.5 mb-2">
                        <p className="text-xs font-medium text-muted-foreground line-clamp-1">
                            💼 {designation}
                        </p>
                        <p className="text-xs text-muted-foreground line-clamp-1">
                            🏢 {department}
                        </p>
                    </div>

                    {/* Bio */}
                    {bio && (
                        <p className="text-xs text-muted-foreground text-center mb-3 line-clamp-2 italic">
                            &quot;{bio}&quot;
                        </p>
                    )}

                    {/* Stats Section */}
                    {stats && stats.totalFeedbacks > 0 ? (
                        <div className="space-y-2 pt-2 border-t border-border">
                            {/* Feedback Count & Average Rating */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Badge variant="info" className="text-xs">
                                        {stats.totalFeedbacks} {stats.totalFeedbacks === 1 ? 'Review' : 'Reviews'}
                                    </Badge>
                                </div>
                                <div className="flex items-center gap-1">
                                    <span className="text-sm font-semibold text-foreground">
                                        {stats.averageRating.toFixed(1)}
                                    </span>
                                    <span className="text-yellow-500">⭐</span>
                                </div>
                            </div>

                            {/* Mula Distribution */}
                            <div className="flex items-center justify-center gap-3 text-xs">
                                {stats.mulaDistribution.golden_mula > 0 && (
                                    <span className="flex items-center gap-1">
                                        <Image
                                            src="/images/golden_mula_transparent.png"
                                            alt="Golden Mula"
                                            width={16}
                                            height={16}
                                            className="object-contain"
                                        />
                                        <span className="font-medium">{stats.mulaDistribution.golden_mula}</span>
                                    </span>
                                )}
                                {stats.mulaDistribution.fresh_carrot > 0 && (
                                    <span className="flex items-center gap-1">
                                        <Image
                                            src="/images/fresh_carrot_transparent.png"
                                            alt="Fresh Carrot"
                                            width={16}
                                            height={16}
                                            className="object-contain"
                                        />
                                        <span className="font-medium">{stats.mulaDistribution.fresh_carrot}</span>
                                    </span>
                                )}
                                {stats.mulaDistribution.rotten_tomato > 0 && (
                                    <span className="flex items-center gap-1">
                                        <Image
                                            src="/images/rotten_tomato_transparent.png"
                                            alt="Rotten Tomato"
                                            width={16}
                                            height={16}
                                            className="object-contain"
                                        />
                                        <span className="font-medium">{stats.mulaDistribution.rotten_tomato}</span>
                                    </span>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="pt-2 border-t border-border">
                            <p className="text-xs text-center text-muted-foreground italic">
                                {stats ? 'No reviews yet' : 'Stats hidden'}
                            </p>
                        </div>
                    )}

                    {/* View Profile CTA */}
                    <div className="mt-3 text-center">
                        <span className="text-xs font-medium text-primary group-hover:underline">
                            View Profile →
                        </span>
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}

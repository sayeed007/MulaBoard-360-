import { Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import connectDB from '@/lib/db/connect';
import User from '@/lib/db/models/User';
import SearchAndFilters from '@/components/profiles/SearchAndFilters';
import ProfilesGrid from '@/components/profiles/ProfilesGrid';
import { Button } from '@/components/ui';
import HeroSection from '@/components/layout/HeroSection';

export const metadata: Metadata = {
    title: 'Team Directory | MulaBoard',
    description: 'Explore team profiles and view public feedback on MulaBoard - 360° Anonymous Feedback Platform',
};

interface DirectoryPageProps {
    searchParams: Promise<{
        page?: string;
        search?: string;
        department?: string;
        sort?: string;
    }>;
}

async function DirectoryContent({ searchParams }: DirectoryPageProps) {
    const params = await searchParams;
    const page = params.page || '1';
    const search = params.search || '';
    const department = params.department || '';
    const sort = params.sort || 'newest';

    // Build API URL - use absolute URL for Server Components
    const apiParams = new URLSearchParams();
    apiParams.set('page', page);
    apiParams.set('limit', '12');
    if (search) apiParams.set('search', search);
    if (department) apiParams.set('department', department);
    if (sort) apiParams.set('sort', sort);

    // Construct absolute URL for fetch (required in Server Components)
    const baseUrl = process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : 'http://localhost:3000';
    const apiUrl = `${baseUrl}/api/users/public?${apiParams.toString()}`;

    // Fetch data
    let users = [];
    let pagination = {
        currentPage: 1,
        totalPages: 1,
        totalUsers: 0,
        hasNext: false,
        hasPrev: false,
    };
    let departments: string[] = [];

    try {
        const response = await fetch(apiUrl, {
            cache: 'no-store',
        });

        if (response.ok) {
            const data = await response.json();
            // Sanitize users data to ensure only plain objects are passed and remove unwanted fields
            users = (data.users || []).map((user: any) => ({
                _id: user._id,
                fullName: user.fullName,
                designation: user.designation,
                department: user.department,
                profileImage: user.profileImage,
                bio: user.bio,
                publicSlug: user.publicSlug,
                stats: user.stats
            }));
            pagination = data.pagination || pagination;
        }
    } catch (error) {
        console.error('Error fetching users:', error);
    }

    // Get all unique departments for filter
    try {
        await connectDB();
        const allDepartments = await User.distinct('department', {
            isProfileActive: true,
            accountStatus: 'approved',
        });
        departments = allDepartments.sort();
    } catch (error) {
        console.error('Error fetching departments:', error);
    }

    return (
        <>
            {/* Search and Filters */}
            <SearchAndFilters departments={departments} totalResults={pagination.totalUsers} />

            {/* Profiles Grid */}
            <div className="mt-8">
                <ProfilesGrid users={users} />
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
                <div className="mt-12 flex items-center justify-center gap-4">
                    <Link
                        href={`/directory?page=${pagination.currentPage - 1}${search ? `&search=${search}` : ''}${department ? `&department=${department}` : ''}${sort !== 'newest' ? `&sort=${sort}` : ''}`}
                        className={!pagination.hasPrev ? 'pointer-events-none opacity-50' : ''}
                    >
                        <Button variant="outline" disabled={!pagination.hasPrev}>
                            ← Previous
                        </Button>
                    </Link>

                    <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                            Page {pagination.currentPage} of {pagination.totalPages}
                        </span>
                    </div>

                    <Link
                        href={`/directory?page=${pagination.currentPage + 1}${search ? `&search=${search}` : ''}${department ? `&department=${department}` : ''}${sort !== 'newest' ? `&sort=${sort}` : ''}`}
                        className={!pagination.hasNext ? 'pointer-events-none opacity-50' : ''}
                    >
                        <Button variant="outline" disabled={!pagination.hasNext}>
                            Next →
                        </Button>
                    </Link>
                </div>
            )}
        </>
    );
}

export default async function DirectoryPage({ searchParams }: DirectoryPageProps) {
    return (
        <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-100 via-background to-background dark:from-indigo-950 dark:to-background pb-20">
            {/* Hero Section */}
            <HeroSection>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 relative z-10">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                            Team Directory 👥
                        </h1>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
                            Discover colleagues, view their public feedback, and contribute to our culture of transparency and growth.
                        </p>
                        <div className="flex items-center justify-center gap-4">
                            <Link href="/">
                                <Button variant="outline">← Back to Home</Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </HeroSection>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 -mt-8 relative z-10">
                <Suspense fallback={<ProfilesGrid users={[]} isLoading={true} />}>
                    <DirectoryContent searchParams={searchParams} />
                </Suspense>
            </div>
        </div>
    );
}

'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, X, Filter } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

interface SearchAndFiltersProps {
    departments: string[];
    totalResults: number;
}

export default function SearchAndFilters({ departments, totalResults }: SearchAndFiltersProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [search, setSearch] = useState(searchParams.get('search') || '');
    const [department, setDepartment] = useState(searchParams.get('department') || '');
    const [sort, setSort] = useState(searchParams.get('sort') || 'newest');

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            updateURL();
        }, 500);

        return () => clearTimeout(timer);
    }, [search, department, sort]);

    const updateURL = () => {
        const params = new URLSearchParams();
        if (search) params.set('search', search);
        if (department) params.set('department', department);
        if (sort !== 'newest') params.set('sort', sort);

        const queryString = params.toString();
        router.push(`/directory${queryString ? `?${queryString}` : ''}`);
    };

    const clearFilters = () => {
        setSearch('');
        setDepartment('');
        setSort('newest');
        router.push('/directory');
    };

    const hasActiveFilters = search || department || sort !== 'newest';

    return (
        <div className="bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl border border-white/20 dark:border-zinc-800 rounded-2xl p-4 sm:p-6 shadow-lg">
            {/* Single Row Layout */}
            <div className="flex flex-col lg:flex-row gap-3 items-start lg:items-center">
                {/* Search Input - Takes more space */}
                <div className="relative flex-1 w-full">
                    <Search
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground z-10 pointer-events-none"
                        size={18}
                    />
                    <Input
                        type="text"
                        placeholder="Search by name, designation, or department..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4"
                    />
                </div>

                {/* Department Filter */}
                <div className="relative w-full lg:w-48">
                    <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none z-10" size={16} />
                    <select
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 appearance-none cursor-pointer"
                    >
                        <option value="">All Departments</option>
                        {departments.map((dept) => (
                            <option key={dept} value={dept}>
                                {dept}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Sort Filter */}
                <div className="w-full lg:w-48">
                    <select
                        value={sort}
                        onChange={(e) => setSort(e.target.value)}
                        className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 appearance-none cursor-pointer"
                    >
                        <option value="newest">Newest Members</option>
                        <option value="most-reviewed">Most Reviewed</option>
                        <option value="highest-rated">Highest Rated</option>
                    </select>
                </div>

                {/* Clear Filters Icon Button */}
                {hasActiveFilters && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearFilters}
                        className="h-10 w-10 p-0 flex-shrink-0 hover:bg-destructive/10 hover:text-destructive"
                        title="Clear all filters"
                    >
                        <X size={20} />
                    </Button>
                )}
            </div>

            {/* Results Count - Below the filters */}
            <div className="text-sm text-muted-foreground mt-3 pt-3 border-t border-border/50">
                Found <span className="font-semibold text-foreground">{totalResults}</span> {totalResults === 1 ? 'profile' : 'profiles'}
            </div>
        </div>
    );
}

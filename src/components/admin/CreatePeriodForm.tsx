'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Input, Alert } from '@/components/ui';

export default function CreatePeriodForm() {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        startDate: '',
        endDate: '',
        themeName: 'The Mula Season',
        themeEmoji: '🌿',
        themeBackgroundColor: '#f0fdf4',
        isActive: false,
    });

    // Auto-generate slug from name
    const handleNameChange = (name: string) => {
        const slug = name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');

        setFormData({ ...formData, name, slug });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setIsLoading(true);

        try {
            const response = await fetch('/api/periods', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (!response.ok) {
                setError(result.error || 'Failed to create period');
                setIsLoading(false);
                return;
            }

            setSuccess('Period created successfully!');
            setIsLoading(false);

            // Reset form
            setFormData({
                name: '',
                slug: '',
                startDate: '',
                endDate: '',
                themeName: 'The Mula Season',
                themeEmoji: '🌿',
                themeBackgroundColor: '#f0fdf4',
                isActive: false,
            });

            // Refresh the page to show new period
            setTimeout(() => {
                router.refresh();
                setIsOpen(false);
                setSuccess('');
            }, 1500);
        } catch (err) {
            setError('An unexpected error occurred');
            setIsLoading(false);
        }
    };

    const commonEmojis = ['🌿', '🎄', '🎃', '🎉', '📅', '⭐', '🚀', '💼', '🏆', '🎯'];

    return (
        <div className="bg-card/50 backdrop-blur-sm rounded-2xl border shadow-sm">
            {/* Header Button */}
            <div className="p-6">
                <Button
                    variant={isOpen ? 'outline' : 'primary'}
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full justify-between"
                >
                    <span>+ {isOpen ? 'Cancel' : 'Create New Period'}</span>
                    <span className="text-xl">{isOpen ? '✕' : '📅'}</span>
                </Button>
            </div>

            {/* Expandable Form */}
            {isOpen && (
                <div className="px-6 pb-6 space-y-4 border-t pt-6 animate-slide-up">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && <Alert variant="danger" title="Error">{error}</Alert>}
                        {success && <Alert variant="success" title="Success">{success}</Alert>}

                        {/* Period Name */}
                        <Input
                            label="Period Name"
                            placeholder="e.g., Q1 2026 Review"
                            value={formData.name}
                            onChange={(e) => handleNameChange(e.target.value)}
                            required
                            fullWidth
                            disabled={isLoading}
                        />

                        {/* Auto-generated Slug */}
                        <Input
                            label="Slug (auto-generated)"
                            value={formData.slug}
                            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                            fullWidth
                            disabled={isLoading}
                            helperText="URL-friendly identifier"
                        />

                        {/* Date Range */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                label="Start Date"
                                type="date"
                                value={formData.startDate}
                                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                required
                                fullWidth
                                disabled={isLoading}
                            />
                            <Input
                                label="End Date"
                                type="date"
                                value={formData.endDate}
                                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                required
                                fullWidth
                                disabled={isLoading}
                            />
                        </div>

                        {/* Theme */}
                        <div className="space-y-3">
                            <label className="block text-sm font-medium">Theme</label>

                            <Input
                                placeholder="e.g., New Year Fresh Start"
                                value={formData.themeName}
                                onChange={(e) => setFormData({ ...formData, themeName: e.target.value })}
                                fullWidth
                                disabled={isLoading}
                            />

                            {/* Emoji Picker */}
                            <div className="flex gap-2 flex-wrap">
                                {commonEmojis.map((emoji) => (
                                    <button
                                        key={emoji}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, themeEmoji: emoji })}
                                        className={`w-12 h-12 rounded-lg text-2xl hover:scale-110 transition-transform ${formData.themeEmoji === emoji
                                                ? 'bg-primary/20 ring-2 ring-primary'
                                                : 'bg-muted hover:bg-muted/80'
                                            }`}
                                        disabled={isLoading}
                                    >
                                        {emoji}
                                    </button>
                                ))}
                            </div>

                            {/* Color Picker */}
                            <div className="flex items-center gap-3">
                                <label className="text-sm font-medium">Background Color:</label>
                                <input
                                    type="color"
                                    value={formData.themeBackgroundColor}
                                    onChange={(e) => setFormData({ ...formData, themeBackgroundColor: e.target.value })}
                                    className="w-16 h-10 rounded border cursor-pointer"
                                    disabled={isLoading}
                                />
                                <span className="text-sm text-muted-foreground font-mono">{formData.themeBackgroundColor}</span>
                            </div>
                        </div>

                        {/* Active Checkbox */}
                        <div className="flex items-start gap-3 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                            <input
                                type="checkbox"
                                id="isActive"
                                checked={formData.isActive}
                                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                className="mt-1 w-5 h-5 rounded border-input focus:ring-2 focus:ring-primary cursor-pointer"
                                disabled={isLoading}
                            />
                            <label htmlFor="isActive" className="flex-1 text-sm cursor-pointer">
                                <span className="font-semibold">Make this period active</span>
                                <p className="text-xs text-muted-foreground mt-1">
                                    This will automatically deactivate all other periods and allow feedback submission
                                </p>
                            </label>
                        </div>

                        {/* Submit Button */}
                        <div className="flex gap-3 pt-4">
                            <Button
                                type="submit"
                                variant="primary"
                                isLoading={isLoading}
                                className="flex-1"
                            >
                                Create Period
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsOpen(false)}
                                disabled={isLoading}
                            >
                                Cancel
                            </Button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateSettingsSchema, type UpdateSettingsInput } from '@/validators/user';
import type { User } from '@/types/user';

/**
 * Settings Form Component
 *
 * Allows users to manage their account settings (currently profile visibility)
 */

interface SettingsFormProps {
  user: User;
}

export default function SettingsForm({ user }: SettingsFormProps) {
  const router = useRouter();

  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateSettingsInput>({
    resolver: zodResolver(updateSettingsSchema),
    defaultValues: {
      isProfileActive: user.isProfileActive,
    },
  });

  const onSubmit = async (data: UpdateSettingsInput) => {
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      const response = await fetch(`/api/users/${user._id}/settings`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || 'Failed to update settings');
        setIsLoading(false);
        return;
      }

      setSuccess('Settings updated successfully!');
      setIsLoading(false);

      // Refresh the page to show updated data
      setTimeout(() => {
        router.refresh();
      }, 1000);
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {error && (
          <div className="rounded-md bg-destructive/10 p-4 text-sm text-destructive">
            {error}
          </div>
        )}

        {success && (
          <div className="rounded-md bg-primary/10 p-4 text-sm text-primary">
            {success}
          </div>
        )}

        {/* Profile Visibility Toggle */}
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <input
              id="isProfileActive"
              type="checkbox"
              disabled={isLoading}
              {...register('isProfileActive')}
              className="mt-1 w-5 h-5 rounded border-input focus:ring-2 focus:ring-primary cursor-pointer"
            />
            <div className="flex-1">
              <label
                htmlFor="isProfileActive"
                className="block font-medium cursor-pointer"
              >
                Make my profile visible
              </label>
              <p className="text-sm text-muted-foreground mt-1">
                When enabled, colleagues can find your profile and give you feedback.
                When disabled, your profile is hidden from the public directory.
              </p>
            </div>
          </div>
          {errors.isProfileActive && (
            <p className="text-sm text-destructive">
              {errors.isProfileActive.message}
            </p>
          )}
        </div>

        {/* Privacy Notice */}
        <div className="bg-muted/50 rounded-lg p-4 border">
          <h4 className="font-medium mb-2">Privacy Notice</h4>
          <ul className="text-sm text-muted-foreground space-y-2">
            <li className="flex gap-2">
              <span>•</span>
              <span>
                Your email address is never shown publicly on your profile
              </span>
            </li>
            <li className="flex gap-2">
              <span>•</span>
              <span>
                All feedback you receive is anonymous to protect reviewer privacy
              </span>
            </li>
            <li className="flex gap-2">
              <span>•</span>
              <span>
                Your profile visibility setting only affects whether colleagues can
                find and view your profile
              </span>
            </li>
            <li className="flex gap-2">
              <span>•</span>
              <span>
                Admins can always view your profile regardless of this setting
              </span>
            </li>
          </ul>
        </div>

        {/* Submit Button */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 bg-primary text-primary-foreground py-3 rounded-lg font-medium hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  );
}

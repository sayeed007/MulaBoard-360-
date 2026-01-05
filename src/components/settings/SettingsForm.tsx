'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateSettingsSchema, type UpdateSettingsInput } from '@/validators/user';
import type { User } from '@/types/user';
import { Button, Switch, Alert } from '@/components/ui';

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
    <div className="w-full">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {error && (
          <Alert variant="danger" title="Error">
            {error}
          </Alert>
        )}

        {success && (
          <Alert variant="success" title="Success">
            {success}
          </Alert>
        )}

        {/* Profile Visibility Toggle */}
        <div className="bg-background/50 rounded-xl p-6 border border-border/50">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <h3 className="font-semibold text-foreground">Public Profile Visibility</h3>
              <p className="text-sm text-muted-foreground">
                Allow colleagues to find your profile and send feedback.
              </p>
            </div>
            <Switch
              id="isProfileActive"
              disabled={isLoading}
              {...register('isProfileActive')}
            />
          </div>
          {errors.isProfileActive && (
            <p className="text-sm text-destructive mt-2">
              {errors.isProfileActive.message}
            </p>
          )}
        </div>

        {/* Privacy Notice */}
        <div className="bg-blue-50/50 dark:bg-blue-900/10 rounded-xl p-5 border border-blue-100 dark:border-blue-900/50">
          <h4 className="font-semibold text-blue-700 dark:text-blue-400 mb-3 flex items-center gap-2">
            <span>🛡️</span> Privacy & Security
          </h4>
          <ul className="text-sm text-muted-foreground space-y-2 pl-1">
            <li className="flex gap-2">
              <span className="text-blue-500">•</span>
              <span>
                Your email address is <span className="font-medium text-foreground">hidden</span> from public view.
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-blue-500">•</span>
              <span>
                Feedback is <span className="font-medium text-foreground">100% anonymous</span> to ensure honesty.
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-blue-500">•</span>
              <span>
                Admins can always access system data for moderation.
              </span>
            </li>
          </ul>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isLoading}
            className="w-full sm:w-auto"
          >
            Save Settings
          </Button>
        </div>
      </form>
    </div>
  );
}

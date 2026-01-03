'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateProfileSchema, type UpdateProfileInput } from '@/validators/user';
import { fileToBase64, validateImageFile } from '@/lib/cloudinary/upload';
import type { User } from '@/types/user';

/**
 * Profile Edit Form Component
 *
 * Allows users to edit their profile information and upload profile image
 */

interface ProfileFormProps {
  user: User;
}

export default function ProfileForm({ user }: ProfileFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [previewImage, setPreviewImage] = useState<string>(user.profileImage || '');

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<UpdateProfileInput>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      fullName: user.fullName,
      designation: user.designation,
      department: user.department,
      bio: user.bio || '',
      profileImage: user.profileImage || '',
    },
  });

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    const validation = validateImageFile(file);
    if (!validation.valid) {
      setError(validation.error || 'Invalid file');
      return;
    }

    setError('');
    setIsUploadingImage(true);

    try {
      // Convert to base64
      const base64 = await fileToBase64(file);
      setPreviewImage(base64);

      // Upload to server
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: base64 }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Upload failed');
      }

      // Update form value
      setValue('profileImage', result.url);
      setPreviewImage(result.url);
      setIsUploadingImage(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload image');
      setPreviewImage(user.profileImage || '');
      setIsUploadingImage(false);
    }
  };

  const onSubmit = async (data: UpdateProfileInput) => {
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      const response = await fetch(`/api/users/${user._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || 'Failed to update profile');
        setIsLoading(false);
        return;
      }

      setSuccess('Profile updated successfully!');
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
    <div className="w-full max-w-2xl space-y-6">
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

        {/* Profile Image Upload */}
        <div>
          <label className="block text-sm font-medium mb-2">Profile Image</label>
          <div className="flex items-center gap-4">
            <div className="relative">
              {previewImage ? (
                <img
                  src={previewImage}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover border-2 border-border"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center text-4xl border-2 border-border">
                  {user.fullName.charAt(0)}
                </div>
              )}
              {isUploadingImage && (
                <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                  <div className="animate-spin h-6 w-6 border-2 border-white border-t-transparent rounded-full" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleImageChange}
                className="hidden"
                disabled={isUploadingImage}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploadingImage}
                className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors disabled:opacity-50"
              >
                {isUploadingImage ? 'Uploading...' : 'Change Image'}
              </button>
              <p className="text-xs text-muted-foreground mt-2">
                JPG, PNG or WebP. Max size 5MB.
              </p>
            </div>
          </div>
        </div>

        {/* Full Name */}
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium mb-2">
            Full Name *
          </label>
          <input
            id="fullName"
            type="text"
            disabled={isLoading}
            {...register('fullName')}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
              errors.fullName ? 'border-destructive' : 'border-input'
            }`}
          />
          {errors.fullName && (
            <p className="mt-1 text-sm text-destructive">{errors.fullName.message}</p>
          )}
        </div>

        {/* Designation */}
        <div>
          <label htmlFor="designation" className="block text-sm font-medium mb-2">
            Designation *
          </label>
          <input
            id="designation"
            type="text"
            disabled={isLoading}
            {...register('designation')}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
              errors.designation ? 'border-destructive' : 'border-input'
            }`}
          />
          {errors.designation && (
            <p className="mt-1 text-sm text-destructive">{errors.designation.message}</p>
          )}
        </div>

        {/* Department */}
        <div>
          <label htmlFor="department" className="block text-sm font-medium mb-2">
            Department *
          </label>
          <input
            id="department"
            type="text"
            disabled={isLoading}
            {...register('department')}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
              errors.department ? 'border-destructive' : 'border-input'
            }`}
          />
          {errors.department && (
            <p className="mt-1 text-sm text-destructive">{errors.department.message}</p>
          )}
        </div>

        {/* Bio */}
        <div>
          <label htmlFor="bio" className="block text-sm font-medium mb-2">
            Bio
            <span className="text-muted-foreground font-normal ml-2">(Optional)</span>
          </label>
          <textarea
            id="bio"
            rows={3}
            disabled={isLoading}
            {...register('bio')}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none ${
              errors.bio ? 'border-destructive' : 'border-input'
            }`}
            placeholder="A short bio about yourself (max 200 characters)"
          />
          {errors.bio && (
            <p className="mt-1 text-sm text-destructive">{errors.bio.message}</p>
          )}
          <p className="mt-1 text-xs text-muted-foreground">
            {user.bio?.length || 0}/200 characters
          </p>
        </div>

        {/* Submit Button */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={isLoading || isUploadingImage}
            className="flex-1 bg-primary text-primary-foreground py-3 rounded-lg font-medium hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}

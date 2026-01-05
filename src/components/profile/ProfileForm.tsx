'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateProfileSchema, type UpdateProfileInput } from '@/validators/user';
import type { User } from '@/types/user';
import { Button, Input, Textarea, Alert } from '@/components/ui';

// Inline utility functions to avoid Cloudinary import chain
function validateImageFile(file: File): { valid: boolean; error?: string } {
  const MAX_SIZE = 5 * 1024 * 1024; // 5MB
  const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

  if (!ALLOWED_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: 'Invalid file type. Please upload a JPG, PNG, or WebP image.',
    };
  }

  if (file.size > MAX_SIZE) {
    return {
      valid: false,
      error: 'File is too large. Maximum size is 5MB.',
    };
  }

  return { valid: true };
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
}

interface ProfileFormProps {
  user: User;
}

export default function ProfileForm({ user }: ProfileFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isEditMode, setIsEditMode] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [previewImage, setPreviewImage] = useState<string>(user.profileImage || '');

  const {
    register,
    handleSubmit,
    setValue,
    reset,
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
      setIsEditMode(false);

      // Refresh the page to show updated data
      setTimeout(() => {
        router.refresh();
      }, 1000);
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditMode(false);
    setError('');
    setSuccess('');
    setPreviewImage(user.profileImage || '');
    reset();
  };

  // View Mode
  if (!isEditMode) {
    return (
      <div className="w-full max-w-2xl space-y-6">
        {success && (
          <Alert variant="success" title="Success">
            {success}
          </Alert>
        )}

        {/* Profile Display */}
        <div className="space-y-6">
          {/* Profile Image */}
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-border shadow-sm">
              {user.profileImage ? (
                <img
                  src={user.profileImage}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center text-4xl text-muted-foreground/50">
                  {user?.fullName?.charAt(0)}
                </div>
              )}
            </div>
            <div>
              <h3 className="text-2xl font-bold">{user.fullName}</h3>
              <p className="text-muted-foreground">{user.designation}</p>
            </div>
          </div>

          {/* Profile Info */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Department</label>
              <p className="text-lg mt-1">{user.department}</p>
            </div>

            {user.bio && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Bio</label>
                <p className="text-base mt-1 leading-relaxed">{user.bio}</p>
              </div>
            )}
          </div>

          {/* Edit Button */}
          <div className="pt-4">
            <Button
              variant="primary"
              size="lg"
              onClick={() => setIsEditMode(true)}
            >
              Edit Profile
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Edit Mode
  return (
    <div className="w-full max-w-2xl space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {error && (
          <Alert variant="danger" title="Error">
            {error}
          </Alert>
        )}

        {/* Profile Image Upload */}
        <div>
          <label className="block text-sm font-medium mb-4 text-foreground/80">Profile Photo</label>
          <div className="flex items-center gap-6">
            <div className="relative group">
              <div className={`w-24 h-24 rounded-full overflow-hidden border-2 border-border shadow-sm ${isUploadingImage ? 'opacity-50' : ''}`}>
                {previewImage ? (
                  <img
                    src={previewImage}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-muted flex items-center justify-center text-4xl text-muted-foreground/50">
                    {user?.fullName?.charAt(0)}
                  </div>
                )}
              </div>

              {isUploadingImage && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full" />
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
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploadingImage}
                >
                  {isUploadingImage ? 'Uploading...' : 'Change Photo'}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                JPG, PNG or WebP. Max size 5MB.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-6">
          <Input
            label="Full Name"
            id="fullName"
            placeholder="Your Full Name"
            fullWidth
            disabled={isLoading}
            error={errors.fullName?.message}
            {...register('fullName')}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Designation"
              id="designation"
              placeholder="e.g. Senior Developer"
              fullWidth
              disabled={isLoading}
              error={errors.designation?.message}
              {...register('designation')}
            />
            <Input
              label="Department"
              id="department"
              placeholder="e.g. Engineering"
              fullWidth
              disabled={isLoading}
              error={errors.department?.message}
              {...register('department')}
            />
          </div>

          <Textarea
            label="Bio"
            id="bio"
            placeholder="Tell us a little about yourself (max 200 characters)"
            fullWidth
            rows={4}
            disabled={isLoading}
            error={errors.bio?.message}
            helperText={`${user.bio?.length || 0}/200 characters`}
            {...register('bio')}
          />
        </div>

        <div className="pt-4 flex gap-3">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isLoading || isUploadingImage}
          >
            Save Changes
          </Button>
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={handleCancel}
            disabled={isLoading || isUploadingImage}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}

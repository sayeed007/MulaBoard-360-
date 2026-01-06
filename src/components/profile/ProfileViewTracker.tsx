'use client';

import { useEffect } from 'react';

interface ProfileViewTrackerProps {
  slug: string;
  isOwnProfile: boolean;
}

/**
 * Client component to track profile views
 * Only tracks when viewing someone else's profile
 */
export default function ProfileViewTracker({ slug, isOwnProfile }: ProfileViewTrackerProps) {
  useEffect(() => {
    // Don't track views on own profile
    if (isOwnProfile) return;

    // Track profile view
    const trackView = async () => {
      try {
        await fetch(`/api/profile/${slug}/view`, {
          method: 'POST',
        });
      } catch (error) {
        // Silently fail - view tracking shouldn't break the page
        console.error('Failed to track profile view:', error);
      }
    };

    trackView();
  }, [slug, isOwnProfile]);

  // This component doesn't render anything
  return null;
}

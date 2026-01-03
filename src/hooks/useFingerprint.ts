'use client';

import { useState, useEffect } from 'react';
import FingerprintJS from '@fingerprintjs/fingerprintjs';

/**
 * FingerprintJS Hook
 *
 * Gets a unique browser fingerprint for spam prevention
 */

export interface UseFingerprintResult {
  fingerprint: string | null;
  loading: boolean;
  error: Error | null;
}

export function useFingerprint(): UseFingerprintResult {
  const [fingerprint, setFingerprint] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function getFingerprint() {
      try {
        // Load FingerprintJS
        const fp = await FingerprintJS.load();

        // Get visitor identifier
        const result = await fp.get();

        if (isMounted) {
          setFingerprint(result.visitorId);
          setLoading(false);
        }
      } catch (err) {
        console.error('Fingerprint error:', err);
        if (isMounted) {
          setError(err instanceof Error ? err : new Error('Failed to get fingerprint'));
          setLoading(false);
        }
      }
    }

    getFingerprint();

    return () => {
      isMounted = false;
    };
  }, []);

  return { fingerprint, loading, error };
}

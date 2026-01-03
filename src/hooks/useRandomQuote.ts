import { useState, useEffect } from 'react';

/**
 * Quote Type
 */
export interface Quote {
  _id: string;
  text: string;
  textBn?: string;
  category: 'landing' | 'feedback_form' | 'success' | 'profile' | 'admin' | 'error' | 'loading';
  mood: 'funny' | 'motivational' | 'sarcastic' | 'wise';
  isActive: boolean;
  displayCount: number;
  createdAt: string;
}

/**
 * Hook Options
 */
interface UseRandomQuoteOptions {
  category: Quote['category'];
  mood?: Quote['mood'];
  autoFetch?: boolean;
}

/**
 * useRandomQuote Hook
 *
 * Fetches a random quote for the specified category and mood
 *
 * @example
 * ```tsx
 * const { quote, loading, error, refetch } = useRandomQuote({
 *   category: 'landing',
 *   mood: 'funny'
 * });
 * ```
 */
export function useRandomQuote(options: UseRandomQuoteOptions) {
  const { category, mood, autoFetch = true } = options;

  const [quote, setQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(autoFetch);
  const [error, setError] = useState<string>('');

  const fetchQuote = async () => {
    try {
      setLoading(true);
      setError('');

      const params = new URLSearchParams({ category });
      if (mood) {
        params.append('mood', mood);
      }

      const response = await fetch(`/api/quotes?${params.toString()}`);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch quote');
      }

      setQuote(result.data);
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch quote');
      setLoading(false);
    }
  };

  useEffect(() => {
    if (autoFetch) {
      fetchQuote();
    }
  }, [category, mood, autoFetch]);

  return {
    quote,
    loading,
    error,
    refetch: fetchQuote,
  };
}

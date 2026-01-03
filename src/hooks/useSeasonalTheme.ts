import { useState, useEffect } from 'react';
import { getCurrentSeasonalTheme, type SeasonalTheme } from '@/lib/themes/seasonal';

/**
 * useSeasonalTheme Hook
 *
 * Returns the current seasonal theme based on the date
 *
 * @example
 * ```tsx
 * const theme = useSeasonalTheme();
 *
 * return (
 *   <div style={{ backgroundColor: theme.backgroundColor }}>
 *     <h1>{theme.emoji} {theme.displayName}</h1>
 *     <p>{theme.description}</p>
 *   </div>
 * );
 * ```
 */
export function useSeasonalTheme(): SeasonalTheme {
  const [theme, setTheme] = useState<SeasonalTheme>(() => getCurrentSeasonalTheme());

  useEffect(() => {
    // Update theme on mount
    setTheme(getCurrentSeasonalTheme());

    // Check for theme changes every hour
    const interval = setInterval(() => {
      setTheme(getCurrentSeasonalTheme());
    }, 60 * 60 * 1000); // 1 hour

    return () => clearInterval(interval);
  }, []);

  return theme;
}

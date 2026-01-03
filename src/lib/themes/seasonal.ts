/**
 * Seasonal Themes Configuration
 *
 * Adds fun seasonal variations to the MulaBoard experience
 */

export interface SeasonalTheme {
  name: string;
  displayName: string;
  startDate: { month: number; day: number };
  endDate: { month: number; day: number };
  primaryColor: string;
  backgroundColor: string;
  accentColor: string;
  emoji: string;
  description: string;
}

/**
 * All seasonal themes
 */
export const SEASONAL_THEMES: SeasonalTheme[] = [
  {
    name: 'new-year',
    displayName: 'Happy New Year',
    startDate: { month: 1, day: 1 },
    endDate: { month: 1, day: 7 },
    primaryColor: '#FFD700',
    backgroundColor: '#1a1a2e',
    accentColor: '#ff6b6b',
    emoji: '🎉',
    description: 'Celebrate the new year with style!',
  },
  {
    name: 'valentine',
    displayName: "Valentine's Day",
    startDate: { month: 2, day: 10 },
    endDate: { month: 2, day: 14 },
    primaryColor: '#ff6b9d',
    backgroundColor: '#ffe0ec',
    accentColor: '#c9184a',
    emoji: '💝',
    description: 'Spread the love!',
  },
  {
    name: 'pohela-boishakh',
    displayName: 'Pohela Boishakh',
    startDate: { month: 4, day: 14 },
    endDate: { month: 4, day: 14 },
    primaryColor: '#ff6b35',
    backgroundColor: '#fff4e6',
    accentColor: '#d62828',
    emoji: '🌺',
    description: 'শুভ নববর্ষ! Celebrate Bengali New Year!',
  },
  {
    name: 'independence-day',
    displayName: 'Independence Day',
    startDate: { month: 3, day: 26 },
    endDate: { month: 3, day: 26 },
    primaryColor: '#006a4e',
    backgroundColor: '#f2f7f5',
    accentColor: '#dc143c',
    emoji: '🇧🇩',
    description: 'Celebrating Bangladesh Independence Day',
  },
  {
    name: 'victory-day',
    displayName: 'Victory Day',
    startDate: { month: 12, day: 16 },
    endDate: { month: 12, day: 16 },
    primaryColor: '#006a4e',
    backgroundColor: '#f2f7f5',
    accentColor: '#dc143c',
    emoji: '🏆',
    description: 'Celebrating Bangladesh Victory Day',
  },
  {
    name: 'eid-ul-fitr',
    displayName: 'Eid Mubarak',
    startDate: { month: 4, day: 10 }, // Approximate, changes yearly
    endDate: { month: 4, day: 12 },
    primaryColor: '#0ea5e9',
    backgroundColor: '#f0f9ff',
    accentColor: '#8b5cf6',
    emoji: '🌙',
    description: 'Eid Mubarak! Wishing you joy and blessings!',
  },
  {
    name: 'eid-ul-adha',
    displayName: 'Eid-ul-Adha',
    startDate: { month: 6, day: 16 }, // Approximate, changes yearly
    endDate: { month: 6, day: 18 },
    primaryColor: '#059669',
    backgroundColor: '#f0fdf4',
    accentColor: '#ea580c',
    emoji: '🕌',
    description: 'Eid Mubarak! May your sacrifices be appreciated!',
  },
  {
    name: 'halloween',
    displayName: 'Happy Halloween',
    startDate: { month: 10, day: 25 },
    endDate: { month: 10, day: 31 },
    primaryColor: '#ff6b35',
    backgroundColor: '#1a1a1a',
    accentColor: '#8b5cf6',
    emoji: '🎃',
    description: 'Spooky feedback season!',
  },
  {
    name: 'christmas',
    displayName: 'Merry Christmas',
    startDate: { month: 12, day: 20 },
    endDate: { month: 12, day: 26 },
    primaryColor: '#dc2626',
    backgroundColor: '#fef2f2',
    accentColor: '#15803d',
    emoji: '🎄',
    description: 'Wishing you a Merry Christmas!',
  },
  {
    name: 'winter',
    displayName: 'Winter Season',
    startDate: { month: 12, day: 1 },
    endDate: { month: 2, day: 28 },
    primaryColor: '#3b82f6',
    backgroundColor: '#eff6ff',
    accentColor: '#0ea5e9',
    emoji: '❄️',
    description: 'Cozy winter vibes',
  },
  {
    name: 'spring',
    displayName: 'Spring Season',
    startDate: { month: 3, day: 1 },
    endDate: { month: 5, day: 31 },
    primaryColor: '#ec4899',
    backgroundColor: '#fdf2f8',
    accentColor: '#10b981',
    emoji: '🌸',
    description: 'Bloom with fresh feedback!',
  },
  {
    name: 'summer',
    displayName: 'Summer Season',
    startDate: { month: 6, day: 1 },
    endDate: { month: 8, day: 31 },
    primaryColor: '#f59e0b',
    backgroundColor: '#fffbeb',
    accentColor: '#06b6d4',
    emoji: '☀️',
    description: 'Hot feedback season!',
  },
];

/**
 * Default theme (used when no seasonal theme is active)
 */
export const DEFAULT_THEME: SeasonalTheme = {
  name: 'default',
  displayName: 'MulaBoard',
  startDate: { month: 1, day: 1 },
  endDate: { month: 12, day: 31 },
  primaryColor: '#3b82f6',
  backgroundColor: '#f3f4f6',
  accentColor: '#8b5cf6',
  emoji: '📊',
  description: 'Your feedback matters!',
};

/**
 * Get the current active seasonal theme
 */
export function getCurrentSeasonalTheme(date: Date = new Date()): SeasonalTheme {
  const month = date.getMonth() + 1; // JavaScript months are 0-indexed
  const day = date.getDate();

  // Find matching seasonal theme
  const activeTheme = SEASONAL_THEMES.find((theme) => {
    const { startDate, endDate } = theme;

    // Handle themes that span across year boundary (e.g., Dec to Jan)
    if (startDate.month > endDate.month) {
      return (
        (month > startDate.month || month < endDate.month) ||
        (month === startDate.month && day >= startDate.day) ||
        (month === endDate.month && day <= endDate.day)
      );
    }

    // Handle normal themes
    if (month < startDate.month || month > endDate.month) {
      return false;
    }

    if (month === startDate.month && day < startDate.day) {
      return false;
    }

    if (month === endDate.month && day > endDate.day) {
      return false;
    }

    return true;
  });

  return activeTheme || DEFAULT_THEME;
}

/**
 * Get theme by name
 */
export function getThemeByName(name: string): SeasonalTheme {
  return SEASONAL_THEMES.find((theme) => theme.name === name) || DEFAULT_THEME;
}

/**
 * Get all theme names
 */
export function getAllThemeNames(): string[] {
  return SEASONAL_THEMES.map((theme) => theme.name);
}

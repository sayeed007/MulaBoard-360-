/**
 * Review Period Types
 */

export interface PeriodTheme {
  name: string;
  primaryEmoji: string;
  backgroundColor?: string;
}

export interface ReviewPeriod {
  _id: string;
  name: string;
  slug: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  theme: PeriodTheme;
  createdAt: string;
  updatedAt: string;
  // Virtuals
  isCurrentlyActive?: boolean;
  durationDays?: number;
  daysRemaining?: number;
}

// Form data types
export interface CreatePeriodFormData {
  name: string;
  slug: string;
  startDate: string;
  endDate: string;
  themeName: string;
  themeEmoji: string;
  themeBackgroundColor?: string;
}

export interface UpdatePeriodFormData {
  name: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  themeName: string;
  themeEmoji: string;
  themeBackgroundColor?: string;
}

// Seasonal Themes
export interface SeasonalTheme {
  id: string;
  name: string;
  emoji: string;
  quote: string;
  quoteBn: string;
  available: {
    month?: number[];
    date?: string;
  } | 'dynamic';
  colors: {
    primary: string;
    secondary: string;
  };
}

export const SEASONAL_THEMES: Record<string, SeasonalTheme> = {
  ramadan: {
    id: 'ramadan',
    name: 'Iftar Edition',
    emoji: '🌙',
    quote: 'Breaking fast, not breaking hearts with feedback',
    quoteBn: 'রোজা ভাঙছি, হৃদয় নয়',
    available: { month: [3, 4] },
    colors: {
      primary: '#1E3A5F',
      secondary: '#D4AF37',
    },
  },
  pohela_boishakh: {
    id: 'pohela_boishakh',
    name: 'নববর্ষ Special',
    emoji: '🎉',
    quote: 'নতুন বছর, নতুন feedback!',
    quoteBn: 'New year, new feedback!',
    available: { date: '04-14' },
    colors: {
      primary: '#E53E3E',
      secondary: '#F6E05E',
    },
  },
  eid: {
    id: 'eid',
    name: 'Eid Mubarak Edition',
    emoji: '🕌',
    quote: 'Eid feedback: More valuable than Eidi!',
    quoteBn: 'ঈদ ফিডব্যাক: ঈদির চেয়েও মূল্যবান!',
    available: 'dynamic',
    colors: {
      primary: '#2F855A',
      secondary: '#F6E05E',
    },
  },
  winter: {
    id: 'winter',
    name: 'Pitha Season',
    emoji: '🥮',
    quote: 'Feedback গরম পিঠার মতো serve করুন',
    quoteBn: 'Serve feedback like hot pitha',
    available: { month: [12, 1] },
    colors: {
      primary: '#744210',
      secondary: '#FBD38D',
    },
  },
  independence: {
    id: 'independence',
    name: 'Victory Day Edition',
    emoji: '🇧🇩',
    quote: 'স্বাধীন মতামত, স্বাধীন feedback!',
    quoteBn: 'Free opinion, free feedback!',
    available: { date: '12-16' },
    colors: {
      primary: '#006A4E',
      secondary: '#F42A41',
    },
  },
};

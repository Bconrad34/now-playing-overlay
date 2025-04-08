declare module "next-auth" {
  interface Session {
    accessToken?: string;
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

// Track type for the now playing information
export interface NowPlayingTrack {
  isPlaying: boolean;
  title?: string;
  artist?: string;
  album?: string;
  albumArt?: string;
  songUrl?: string;
}

// Theme types
export type ThemeName = 'dark' | 'light' | 'neon' | 'synthwave' | 'minimal' | 'retro' | 'glitch';

// User data
export interface User {
  id: string;
  email?: string;
  name?: string;
  image?: string;
  isPremium?: boolean;
}

// Payment record
export interface Payment {
  userId: string;
  amount: number;
  currency: string;
  paymentId: string;
  timestamp: string;
}

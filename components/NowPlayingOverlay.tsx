import { useState, useEffect } from 'react';
import { NowPlayingTrack, ThemeName } from '../types';
import styles from './NowPlayingOverlay.module.css';
import Image from 'next/image';

interface NowPlayingOverlayProps {
  theme?: ThemeName;
  userId?: string;
}

const themes: Record<ThemeName, string> = {
  dark: styles.darkTheme,
  light: styles.lightTheme,
  neon: styles.neonTheme,
  synthwave: styles.synthwaveTheme,
  minimal: styles.minimalTheme,
  retro: styles.retroTheme,
  glitch: styles.glitchTheme
};

export default function NowPlayingOverlay({ theme = 'dark', userId }: NowPlayingOverlayProps) {
  const [nowPlaying, setNowPlaying] = useState<NowPlayingTrack | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;
    
    const fetchNowPlaying = async () => {
      try {
        const res = await fetch(`/api/now-playing?userId=${userId}`);
        if (!res.ok) throw new Error('Failed to fetch');
        const data: NowPlayingTrack = await res.json();
        setNowPlaying(data);
        setLoading(false);
      } catch (e) {
        setError(JSON.stringify(e));
        setLoading(false);
      }
    };

    fetchNowPlaying();
    // Poll every 5 seconds for changes
    const intervalId = setInterval(fetchNowPlaying, 5000);
    
    return () => clearInterval(intervalId);
  }, [userId]);

  if (loading) return <div className={`${styles.overlay} ${themes[theme]}`}>Loading...</div>;
  if (error) return <div className={`${styles.overlay} ${themes[theme]}`}>{error}</div>;
  if (!nowPlaying || !nowPlaying.isPlaying) {
    return <div className={`${styles.overlay} ${themes[theme]}`}>Not playing</div>;
  }

  const { title, artist, albumArt } = nowPlaying;

  return (
    <div className={`${styles.overlay} ${themes[theme]}`}>
      {albumArt && (
        <div className={styles.albumArt}>
          {/* Using next/image for better performance */}
          <Image 
            src={albumArt} 
            alt={`${title} album art`}
            width={60}
            height={60}
            style={{ objectFit: 'cover', borderRadius: '4px' }}
          />
        </div>
      )}
      <div className={styles.trackInfo}>
        <div className={styles.title}>{title}</div>
        <div className={styles.artist}>{artist}</div>
      </div>
    </div>
  );
}
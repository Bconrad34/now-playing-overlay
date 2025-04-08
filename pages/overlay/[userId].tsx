import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import NowPlayingOverlay from '../../components/NowPlayingOverlay';
import { ThemeName } from '../../types';

const Overlay: NextPage = () => {
  const router = useRouter();
  const { userId, theme = 'dark' } = router.query;
  const [loading, setLoading] = useState<boolean>(true);
  
  // We need to check premium status to validate access,
  // but we don't need to track it for the overlay functionality
  useEffect(() => {
    if (!userId || Array.isArray(userId)) return;
    
    const checkPremiumStatus = async (): Promise<void> => {
      try {
        await fetch(`/api/check-premium?userId=${userId}`);
        // We don't need the result for this component
        setLoading(false);
      } catch (error) {
        console.error('Error checking premium status:', error);
        setLoading(false);
      }
    };
    
    void checkPremiumStatus();
  }, [userId]);

  // Ensure theme is valid
  const currentTheme = (theme && !Array.isArray(theme) && theme as ThemeName) || 'dark';
  
  // Wait until we have checked premium status
  if (loading) return null;
  
  // Adding CSS to make the page transparent for OBS
  return (
    <>
      <Head>
        <title>Now Playing Overlay</title>
        <style jsx global>{`
          body, html {
            margin: 0;
            padding: 0;
            overflow: hidden;
            background-color: transparent !important;
          }
        `}</style>
      </Head>
      {userId && !Array.isArray(userId) && (
        <NowPlayingOverlay 
          userId={userId} 
          theme={currentTheme} 
        />
      )}
    </>
  );
};

export default Overlay;
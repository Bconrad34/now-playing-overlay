import type { NextPage } from 'next';
import { useState, useEffect } from 'react';
import { useSession, signIn } from 'next-auth/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import NowPlayingOverlay from '../components/NowPlayingOverlay';
import styles from '../styles/Dashboard.module.css';
import { ThemeName } from '../types';

const Dashboard: NextPage = () => {
  const { data: session, status } = useSession();
  const [selectedTheme, setSelectedTheme] = useState<ThemeName>('dark');
  const [showPremiumMessage, setShowPremiumMessage] = useState<boolean>(false);
  const [isPremium, setIsPremium] = useState<boolean>(false);
  const router = useRouter();
  
  const isLoading = status === 'loading';
  const isAuthenticated = !!session;

  // Check for payment success/failure
  useEffect(() => {
    if (router.query.payment === 'success') {
      alert('Thank you for your purchase! Your premium features will be activated soon.');
    } else if (router.query.payment === 'cancelled') {
      alert('Payment cancelled. You can try again anytime.');
    }
    
    // Remove query params
    if (router.query.payment) {
      const { pathname } = router;
      void router.replace(pathname, undefined, { shallow: true });
    }
  }, [router]);
  
  // Check premium status when session is available
  useEffect(() => {
    if (session?.user?.id) {
      const checkPremiumStatus = async (): Promise<void> => {
        try {
          const res = await fetch(`/api/check-premium?userId=${session.user.id}`);
          const data = await res.json();
          setIsPremium(data.isPremium);
        } catch (error) {
          console.error('Error checking premium status:', error);
        }
      };
      
      void checkPremiumStatus();
    }
  }, [session]);

  const freeThemes: ThemeName[] = ['dark', 'light', 'neon'];
  const premiumThemes: ThemeName[] = ['synthwave', 'minimal', 'retro', 'glitch'];

  const handleThemeChange = (theme: ThemeName): void => {
    if (premiumThemes.includes(theme) && !isPremium) {
      setShowPremiumMessage(true);
    } else {
      setSelectedTheme(theme);
      setShowPremiumMessage(false);
    }
  };
  
  const handleUpgradeClick = async (): Promise<void> => {
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      if ('url' in data) {
        window.location.href = data.url;
      } else {
        throw new Error('Failed to get checkout URL');
      }
    } catch (error) {
      console.error('Error starting checkout:', error);
    }
  };

  const copyOverlayUrl = (): void => {
    if (!session?.user?.id) return;
    
    const url = `${window.location.origin}/overlay/${session.user.id}?theme=${selectedTheme}`;
    void navigator.clipboard.writeText(url);
    alert('Overlay URL copied to clipboard! Add this as a Browser Source in OBS or Streamlabs.');
  };

  if (isLoading) return <div className={styles.container}>Loading...</div>;

  if (!isAuthenticated) {
    return (
      <div className={styles.container}>
        <Head>
          <title>Now Playing Overlay - Sign In</title>
        </Head>
        <h1>Now Playing Overlay for Streamers</h1>
        <p>Connect your Spotify account to get started</p>
        <button 
          className={styles.spotifyButton} 
          onClick={() => void signIn('spotify')}
        >
          Sign in with Spotify
        </button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Now Playing Overlay - Dashboard</title>
      </Head>
      
      <h1>Your Now Playing Overlay</h1>
      
      <div className={styles.previewSection}>
        <h2>Preview</h2>
        <div className={styles.previewBox}>
          <NowPlayingOverlay theme={selectedTheme} userId={session.user.id} />
        </div>
      </div>
      
      <div className={styles.themeSection}>
        <h2>Select Theme</h2>
        <div className={styles.themeGrid}>
          {freeThemes.map(theme => (
            <div 
              key={theme}
              className={`${styles.themeCard} ${selectedTheme === theme ? styles.selectedTheme : ''}`}
              onClick={() => handleThemeChange(theme)}
            >
              <div className={styles.themePreview} data-theme={theme}></div>
              <span>{theme}</span>
            </div>
          ))}
          
          {premiumThemes.map(theme => (
            <div 
              key={theme}
              className={`${styles.themeCard} ${styles.premiumTheme} ${isPremium && selectedTheme === theme ? styles.selectedTheme : ''}`}
              onClick={() => handleThemeChange(theme)}
            >
              <div className={styles.themePreview} data-theme={theme}></div>
              <span>{theme}</span>
              <span className={styles.premiumBadge}>PRO</span>
            </div>
          ))}
        </div>
        
        {showPremiumMessage && (
          <div className={styles.premiumMessage}>
            <p>This is a premium theme. Upgrade to access premium themes!</p>
            <button 
              className={styles.upgradeButton}
              onClick={() => void handleUpgradeClick()}
            >
              Upgrade for $5
            </button>
          </div>
        )}
      </div>
      
      <div className={styles.integrationSection}>
        <h2>Add to OBS/Streamlabs</h2>
        <p>Use this URL as a Browser Source in your streaming software:</p>
        <div className={styles.urlBox}>
          {`${typeof window !== 'undefined' ? window.location.origin : ''}/overlay/${session?.user?.id}?theme=${selectedTheme}`}
        </div>
        <button className={styles.copyButton} onClick={copyOverlayUrl}>
          Copy URL
        </button>
        
        <div className={styles.instructionsBox}>
          <h3>How to add to OBS:</h3>
          <ol>
            <li>In OBS, add a new &quot;Browser Source&quot;</li>
            <li>Paste the URL above</li>
            <li>Set width to 300 and height to 80</li>
            <li>Check &quot;Refresh browser when scene becomes active&quot;</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
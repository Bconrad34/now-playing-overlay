import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import styles from '../styles/Home.module.css';

const Home: NextPage = () => {
  const { data: session } = useSession();

  return (
    <div className={styles.container}>
      <Head>
        <title>Now Playing Overlay for Streamers</title>
        <meta name="description" content="Show your Spotify music in your stream" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Now Playing Overlay for Streamers
        </h1>

        <p className={styles.description}>
          Display your current Spotify track on your stream with style
        </p>

        <div className={styles.features}>
          <div className={styles.feature}>
            <h3>Easy Setup</h3>
            <p>Connect with Spotify, copy your overlay URL, paste in OBS. Done!</p>
          </div>
          
          <div className={styles.feature}>
            <h3>Stylish Themes</h3>
            <p>Choose from free themes or upgrade for premium designs</p>
          </div>
          
          <div className={styles.feature}>
            <h3>Real-time Updates</h3>
            <p>Your overlay updates automatically when songs change</p>
          </div>
        </div>

        <div className={styles.cta}>
          {session ? (
            <Link href="/dashboard" className={styles.button}>
              Go to Dashboard
            </Link>
          ) : (
            <Link href="/dashboard" className={styles.button}>
              Get Started
            </Link>
          )}
        </div>

        <div className={styles.pricing}>
          <div className={styles.pricingTier}>
            <h3>Free</h3>
            <p className={styles.price}>$0</p>
            <ul>
              <li>✅ Basic Functionality</li>
              <li>✅ 3 Themes</li>
              <li>✅ Spotify Integration</li>
              <li>❌ Premium Themes</li>
              <li>❌ Custom Colors</li>
            </ul>
          </div>
          
          <div className={styles.pricingTier}>
            <h3>Premium</h3>
            <p className={styles.price}>$5</p>
            <ul>
              <li>✅ Everything in Free</li>
              <li>✅ 7+ Premium Themes</li>
              <li>✅ Custom Colors</li>
              <li>✅ No Watermark</li>
              <li>✅ Priority Support</li>
            </ul>
            <Link href="/dashboard" className={styles.upgradeButton}>
              Upgrade
            </Link>
          </div>
        </div>
      </main>

      <footer className={styles.footer}>
        <p>© 2025 Now Playing Overlay</p>
      </footer>
    </div>
  );
};

export default Home;
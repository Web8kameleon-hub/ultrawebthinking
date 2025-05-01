// HeroSection.js
import React from 'react';
import styles from '../styles/HeroSection.module.css';

const HeroSection = () => {
  return (
    <section className={styles.heroSection}>
      <div className={styles.heroOverlay}>
        <h1 className={styles.heroTitle}>Ultrawebthinking</h1>
        <p className={styles.heroSubtitle}>Zgjuarsi. Elegancë. Dominim.</p>
        <div className={styles.heroButtons}>
          <button className={`${styles.heroBtn} ${styles.primary}`}>Fillojmë</button>
          <button className={`${styles.heroBtn} ${styles.secondary}`}>Eksploro</button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;


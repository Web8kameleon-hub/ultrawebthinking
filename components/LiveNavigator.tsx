// components/LiveNavigator.tsx
import React from 'react';
import styles from '../styles/LiveNavigator.module.css';

const sections = [
  { id: 'hero', label: 'Kreu' },
  { id: 'features', label: 'Veçori' },
  { id: 'explore', label: 'Eksploro' },
  { id: 'contact', label: 'Kontakto' }
];

const LiveNavigator = () => {
  // Static active section
  const active = 'hero';

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      window.scrollTo({ top: el.offsetTop - 80, behavior: 'smooth' });
    }
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.indicator} style={{ top: `${sections.findIndex(sec => sec.id === active) * 50}px` }} />
      {sections.map((sec) => (
      <button
        key={sec.id}
        onClick={() => scrollTo(sec.id)}
        className={`${styles.link} ${active === sec.id ? styles.active : ''}`}
      >
        {sec.label}
      </button>
      ))}
    </nav>
  );
};

export default LiveNavigator;


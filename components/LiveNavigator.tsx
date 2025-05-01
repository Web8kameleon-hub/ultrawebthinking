// components/LiveNavigator.tsx
import React, { useEffect, useState } from 'react';
import styles from '../styles/LiveNavigator.module.css';

const sections = [
  { id: 'hero', label: 'Kreu' },
  { id: 'features', label: 'Veçori' },
  { id: 'explore', label: 'Eksploro' },
  { id: 'contact', label: 'Kontakto' }
];

const LiveNavigator = () => {
  const [active, setActive] = useState('hero');

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const sectionOffsets = sections.map(section => {
        const el = document.getElementById(section.id);
        return el ? { id: section.id, offset: el.offsetTop } : null;
      }).filter(Boolean);

      const current = sectionOffsets.reduce((closest, sec) => {
        if (!sec) return closest;
        return scrollY >= sec.offset - 100 ? sec.id : closest;
      }, 'hero');

      setActive(current);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

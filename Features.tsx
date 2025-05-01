// components/Features.tsx
import React from "react";
import { Zap, ShieldCheck, Globe, Brain } from "lucide-react";
import styles from "../styles/Features.module.css";

const features = [
  {
    icon: <Zap size={32} strokeWidth={2.5} />,
    title: "Shpejtësi Ekstreme",
    desc: "Arkitekturë ultra-performante për ngarkim të menjëhershëm.",
  },
  {
    icon: <ShieldCheck size={32} strokeWidth={2.5} />,
    title: "Siguri Absolute",
    desc: "Mbrojtje me firewall inteligjent dhe enkriptim post-kuantik.",
  },
  {
    icon: <Globe size={32} strokeWidth={2.5} />,
    title: "Lidhje Globale",
    desc: "Dekentralizim i plotë me akses global satelitor dhe tokësor.",
  },
  {
    icon: <Brain size={32} strokeWidth={2.5} />,
    title: "Inteligjencë AGI",
    desc: "Zgjuarsi që mëson, parashikon dhe vepron përpara çdo nevoje.",
  },
];

const Features = () => {
  return (
    <section className={styles.featuresSection}>
      <div className={styles.featuresTitleBlock}>
        <h2 className={styles.featuresTitle}>Veçori Diamanti</h2>
        <p className={styles.featuresSubtitle}>Thelbi i fuqisë Ultrawebthinking</p>
      </div>
      <div className={styles.featuresGrid}>
        {features.map((f, i) => (
          <div key={i} className={styles.featureCard}>
            <div className={styles.featureIcon}>{f.icon}</div>
            <h3 className={styles.featureName}>{f.title}</h3>
            <p className={styles.featureDesc}>{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;

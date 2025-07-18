// components/Features.tsx
import React from "react";
import { Zap, ShieldCheck, Globe, Brain } from "lucide-react";
import { css } from "..//css";

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
    <section className={styles.section}>
      <div className={styles.titleBlock}>
        <h2 className={styles.title}>Veçori Diamanti</h2>
        <p className={styles.subtitle}>Thelbi i fuqisë Ultrawebthinking</p>
      </div>
      <div className={styles.grid}>
        {features.map((feature, index) => (
          <div key={index} className={styles.card}>
            <div className={styles.icon}>{feature.icon}</div>
            <h3 className={styles.featureTitle}>{feature.title}</h3>
            <p className={styles.featureDesc}>{feature.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;

const styles = {
  section: css({
    paddingY: "16",
    paddingX: "6",
    backgroundColor: "gray.50",
    textAlign: "center",
  }),
  titleBlock: css({
    marginBottom: "10",
  }),
  title: css({
    fontSize: "4xl",
    fontWeight: "bold",
    color: "blue.800",
    marginBottom: "4",
  }),
  subtitle: css({
    fontSize: "lg",
    color: "gray.600",
    maxWidth: "600px",
    margin: "0 auto",
  }),
  grid: css({
    display: "grid",
    gridTemplateColumns: ["1fr", "1fr 1fr", "1fr 1fr 1fr"],
    gap: "8",
    marginTop: "8",
  }),
  card: css({
    backgroundColor: "white",
    padding: "6",
    borderRadius: "xl",
    boxShadow: "lg",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    _hover: {
      transform: "translateY(-4px)",
      boxShadow: "xl",
    },
  }),
  icon: css({
    fontSize: "3xl",
    color: "blue.600",
    marginBottom: "4",
  }),
  featureTitle: css({
    fontSize: "xl",
    fontWeight: "semibold",
    color: "gray.800",
    marginBottom: "2",
  }),
  featureDesc: css({
    fontSize: "md",
    color: "gray.600",
  }),
};


import React from "react";
import styles from "../styles/Hero.module.css";

const Hero = () => {
  return (
    <section className={styles.hero}>
      <div className={styles.overlay}></div>
      <h1 className={styles.title}>Welcome to Ultrawebthinking</h1>
      <p className={styles.subtitle}>
        Your next-level web experience starts here.
      </p>
      <button className={styles.cta}>Get Started</button>
    </section>
  );
};

export default Hero;


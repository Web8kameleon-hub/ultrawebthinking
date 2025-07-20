"use client";

import { motion } from 'framer-motion';
import styles from './Settings.module.css';

export const Settings = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={styles.container}
    >
      <div className={styles.header}>
        <h1 className={styles.title}>⚙️ Settings</h1>
        <p className={styles.subtitle}>
          Configure your EuroWeb Platform experience
        </p>
      </div>

      <div className={styles.sections}>
        <section className={styles.section}>
          <h2>🎨 Appearance</h2>
          <div className={styles.setting}>
            <label>Theme</label>
            <select className={styles.select}>
              <option>Dark</option>
              <option>Light</option>
              <option>Auto</option>
            </select>
          </div>
          <div className={styles.setting}>
            <label>Language</label>
            <select className={styles.select}>
              <option>Albanian</option>
              <option>English</option>
              <option>Italian</option>
            </select>
          </div>
        </section>

        <section className={styles.section}>
          <h2>🧠 AGI Settings</h2>
          <div className={styles.setting}>
            <label>AI Model</label>
            <select className={styles.select}>
              <option>GPT-4</option>
              <option>Claude</option>
              <option>Local Model</option>
            </select>
          </div>
          <div className={styles.setting}>
            <label>Analysis Depth</label>
            <select className={styles.select}>
              <option>Deep</option>
              <option>Standard</option>
              <option>Quick</option>
            </select>
          </div>
        </section>

        <section className={styles.section}>
          <h2>🔒 Privacy & Security</h2>
          <div className={styles.setting}>
            <label>
              <input type="checkbox" defaultChecked />
              Enable encryption
            </label>
          </div>
          <div className={styles.setting}>
            <label>
              <input type="checkbox" defaultChecked />
              Anonymous analytics
            </label>
          </div>
          <div className={styles.setting}>
            <label>
              <input type="checkbox" />
              Share usage data
            </label>
          </div>
        </section>

        <section className={styles.section}>
          <h2>⚡ Performance</h2>
          <div className={styles.setting}>
            <label>Cache Size</label>
            <select className={styles.select}>
              <option>1GB</option>
              <option>2GB</option>
              <option>4GB</option>
            </select>
          </div>
          <div className={styles.setting}>
            <label>
              <input type="checkbox" defaultChecked />
              Hardware acceleration
            </label>
          </div>
        </section>
      </div>

      <div className={styles.actions}>
        <button className={styles.saveButton}>
          Save Changes
        </button>
        <button className={styles.resetButton}>
          Reset to Defaults
        </button>
      </div>
    </motion.div>
  );
};

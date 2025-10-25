'use client';
'use strict';

import React from 'react';
import { motion } from '@/lib/web8-motion';
import { OpenMindInterface } from '@/components/OpenMindInterface';
import styles from './page.module.css';

const OpenMindDemoPage = () => {
  const handleResponse = (response: unknown) => {
    };

  return (
    <motion.main
      className={styles.main}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      data-web8-page="openmind-demo"
      data-web8-semantic="ai-interface demo interactive"
    >
      <motion.header
        className={styles.header}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <h1 className={styles.title}>
          <motion.span
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          >
            🧠
          </motion.span>
          OpenMind API Demo
        </h1>
        <p className={styles.description}>
          Multi-perspective AI reasoning system with advanced memory patterns and comprehensive analysis capabilities.
        </p>
      </motion.header>

      <motion.section
        className={styles.demoSection}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <OpenMindInterface
          theme="neural"
          mode="chat"
          showMetadata={true}
          onResponse={handleResponse}
        />
      </motion.section>

      <motion.section
        className={styles.featuresSection}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <h2 className={styles.featuresTitle}>🚀 Features</h2>
        <div className={styles.featuresGrid}>
          <motion.div
            className={styles.featureCard}
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className={styles.featureIcon}>🧠</div>
            <h3>Multi-Perspective Analysis</h3>
            <p>Logical, creative, emotional, and analytical reasoning in one response</p>
          </motion.div>

          <motion.div
            className={styles.featureCard}
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className={styles.featureIcon}>🧮</div>
            <h3>Memory Patterns</h3>
            <p>Advanced memory bank with connection strengthening and pattern recognition</p>
          </motion.div>

          <motion.div
            className={styles.featureCard}
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className={styles.featureIcon}>📊</div>
            <h3>Confidence Scoring</h3>
            <p>Real-time confidence levels and complexity analysis for every response</p>
          </motion.div>

          <motion.div
            className={styles.featureCard}
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className={styles.featureIcon}>⚡</div>
            <h3>Real-time Processing</h3>
            <p>Fast response times with detailed metadata and processing insights</p>
          </motion.div>

          <motion.div
            className={styles.featureCard}
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className={styles.featureIcon}>🎯</div>
            <h3>Depth Control</h3>
            <p>Surface, medium, deep, or profound analysis levels available</p>
          </motion.div>

          <motion.div
            className={styles.featureCard}
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className={styles.featureIcon}>🔗</div>
            <h3>Context Awareness</h3>
            <p>Conversation history and memory context integration</p>
          </motion.div>
        </div>
      </motion.section>

      <motion.section
        className={styles.examplesSection}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <h2 className={styles.examplesTitle}>💡 Example Queries</h2>
        <div className={styles.examplesGrid}>
          <div className={styles.exampleCard}>
            <strong>🧬 Scientific Analysis:</strong>
            <p>"What are the implications of CRISPR gene editing for future medicine?"</p>
          </div>
          <div className={styles.exampleCard}>
            <strong>🎨 Creative Thinking:</strong>
            <p>"How could we redesign cities to be more environmentally sustainable?"</p>
          </div>
          <div className={styles.exampleCard}>
            <strong>🧮 Problem Solving:</strong>
            <p>"What strategies could help reduce global inequality?"</p>
          </div>
          <div className={styles.exampleCard}>
            <strong>🤖 Technology Ethics:</strong>
            <p>"How should we approach AI consciousness and rights?"</p>
          </div>
        </div>
      </motion.section>

      <motion.footer
        className={styles.footer}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.0 }}
      >
        <p>
          🔬 Powered by TypeScript + Next.js API Routes + Web8 Motion + Advanced Memory Patterns |
          🧠 Industrial-grade multi-perspective AI reasoning system |
          ⚡ Real-time processing with confidence scoring and metadata analysis
        </p>
      </motion.footer>
    </motion.main>
  );
};

export default OpenMindDemoPage;

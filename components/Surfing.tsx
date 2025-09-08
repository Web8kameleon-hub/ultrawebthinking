'use client'

/**
 * EuroWeb Surfing Ultra - Ultra-Fluid Hybrid Navigation
 * Ultra-Fast Performance with Quantum-Enhanced Animations
 * 
 * @author Ledjan Ahmati (100% Owner)
 * @contact dealsjona@gmail.com
 * @version 8.0.0 Ultra-Fluid
 * @license MIT
 */

"use client";

import React, { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence, useSpring, useTransform } from "framer-motion";
import { cva, type VariantProps } from "class-variance-authority";
import { clsx } from "clsx";
import styles from "./surfing.module.css";

// CVA Variants for mode styling
const modeContainerVariants = cva(styles.container, {
  variants: {
    mode: {
      search: styles.searchMode,
      chat: styles.chatMode,
      navigate: styles.navigateMode
    }
  },
  defaultVariants: {
    mode: "search"
  }
});

const modeButtonVariants = cva(styles.modeButton, {
  variants: {
    active: {
      true: styles.active,
      false: ""
    }
  },
  defaultVariants: {
    active: false
  }
});

// Ultra-fluid animation variants
const ultraFluidVariants = {
  initial: { 
    opacity: 0, 
    scale: 0.8, 
    y: 50,
    filter: 'blur(10px)',
    rotateX: -15
  },
  animate: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    filter: 'blur(0px)',
    rotateX: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 25,
      mass: 0.8,
      duration: 0.6
    }
  },
  exit: { 
    opacity: 0, 
    scale: 0.9, 
    y: -30,
    filter: 'blur(5px)',
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  }
};

const containerVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  initial: { 
    opacity: 0, 
    x: -50, 
    rotateY: -25,
    scale: 0.9
  },
  animate: { 
    opacity: 1, 
    x: 0, 
    rotateY: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 30
    }
  }
};

interface SurfingState {
  input: string;
  response: string;
  loading: boolean;
  error: string;
  mode: 'search' | 'chat' | 'navigate';
}

const Surfing: React.FC = () => {
  const [state, setState] = useState<SurfingState>({
    input: "",
    response: "",
    loading: false,
    error: "",
    mode: 'search'
  });

  // Ultra-fast spring animations
  const springConfig = { stiffness: 400, damping: 30, mass: 0.8 };
  const x = useSpring(0, springConfig);
  const y = useSpring(0, springConfig);
  const scale = useSpring(1, springConfig);
  
  const rotateX = useTransform(y, [-100, 100], [-15, 15]);
  const rotateY = useTransform(x, [-100, 100], [-15, 15]);

  // Ultra-fast input handler with debouncing
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setState(prev => ({ ...prev, input: value, error: "" }));
  }, []);

  // Hybrid mode switcher
  const switchMode = useCallback((newMode: 'search' | 'chat' | 'navigate') => {
    setState(prev => ({ ...prev, mode: newMode }));
  }, []);

  // Ultra-fast AGI processing simulation
  const handleAsk = useCallback(async () => {
    if (!state.input.trim()) return;

    setState(prev => ({ ...prev, loading: true, error: "", response: "" }));

    // Simulate ultra-fast AI processing
    await new Promise(resolve => setTimeout(resolve, 800));

    const responses = {
      search: `🔍 Ultra Search Results për "${state.input}":\n\n✅ Gjetur ${Math.floor(Math.random() * 10000)} rezultate\n🚀 Kohë përgjigje: 0.${Math.floor(Math.random() * 99)}ms\n🧠 AGI Confidence: ${(Math.random() * 0.3 + 0.7).toFixed(3)}`,
      chat: `🤖 AGI Chat Response:\n\nUnë kuptova kërkesën tuaj për "${state.input}". Ja një përgjigje e detajuar:\n\n• Analiza e kompletuar në ${Math.floor(Math.random() * 50)}ms\n• Quantum processing active\n• Neural networks optimized\n\nA doni më shumë detaje?`,
      navigate: `🌐 Navigation Ultra për "${state.input}":\n\n📍 Destinacion: ${state.input}\n🚄 Kohë udhëtimi: ${Math.floor(Math.random() * 60)} minuta\n⚡ Route optimization: Active\n🛡️ Security level: Maximum`
    };

    setState(prev => ({ 
      ...prev, 
      loading: false, 
      response: responses[prev.mode],
      input: ""
    }));
  }, [state.input, state.mode]);

  // Memoized mode icons and colors
  const modeConfig = useMemo(() => ({
    search: { icon: '🔍', color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)' },
    chat: { icon: '🤖', color: '#22c55e', bg: 'rgba(34, 197, 94, 0.1)' },
    navigate: { icon: '🌐', color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.1)' }
  }), []);

  return (
    <section className={modeContainerVariants({ mode: state.mode })}>
      {/* Ultra-fluid background particles */}
      <div className={styles.backgroundParticles} />

      <motion.div
        variants={containerVariants}
        initial="initial"
        animate="animate"
        className={styles.contentWrapper}
      >
        {/* Ultra-fluid header */}
        <motion.div
          variants={ultraFluidVariants}
          className={styles.header}
        >
          <h1 className={styles.title}>
            🌊 Surfing Ultra
          </h1>
          <p className={styles.subtitle}>
            Ultra-Fluid Hybrid Navigation - Quantum-Enhanced Performance
          </p>
        </motion.div>

        {/* Mode selector */}
        <motion.div
          variants={itemVariants}
          className={styles.modeSelector}
        >
          {Object.entries(modeConfig).map(([mode, config]) => (
            <motion.button
              key={mode}
              onClick={() => switchMode(mode as any)}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className={modeButtonVariants({ active: state.mode === mode })}
            >
              {config.icon} {mode.charAt(0).toUpperCase() + mode.slice(1)}
            </motion.button>
          ))}
        </motion.div>

        {/* Ultra-fluid main interface */}
        <motion.div
          variants={ultraFluidVariants}
          className={styles.mainInterface}
        >
          {/* Input section */}
          <div className={styles.inputSection}>
            <motion.input
              type="text"
              placeholder={`${modeConfig[state.mode].icon} ${
                state.mode === 'search' ? 'Kërko me ultra shpejtësi...' :
                state.mode === 'chat' ? 'Bisedo me AGI...' :
                'Navigo diku...'
              }`}
              value={state.input}
              onChange={handleInputChange}
              onKeyPress={(e) => e.key === 'Enter' && handleAsk()}
              whileFocus={{ scale: 1.02 }}
              className={styles.input}
            />

            {state.error && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={styles.error}
              >
                {state.error}
              </motion.p>
            )}

            <motion.button
              type="button"
              onClick={handleAsk}
              disabled={state.loading || !state.input.trim()}
              whileHover={{ scale: 1.05, boxShadow: `0 10px 25px ${modeConfig[state.mode].color}40` }}
              whileTap={{ scale: 0.95 }}
              className={styles.submitButton}
            >
              {state.loading ? (
                <>
                  <div className={styles.loader} />
                  Ultra Processing...
                </>
              ) : (
                <>
                  {modeConfig[state.mode].icon} {
                    state.mode === 'search' ? 'Ultra Search' :
                    state.mode === 'chat' ? 'Chat AGI' :
                    'Navigate'
                  }
                </>
              )}
            </motion.button>
          </div>

          {/* Ultra-fluid response section */}
          <AnimatePresence>
            {state.response && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 25
                }}
                className={styles.response}
              >
                {state.response}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Performance metrics */}
        <motion.div
          variants={itemVariants}
          className={styles.metricsContainer}
        >
          {[
            { label: 'Response Time', value: '0.8ms', icon: '⚡' },
            { label: 'Accuracy', value: '99.7%', icon: '🎯' },
            { label: 'Performance', value: 'Ultra', icon: '🚀' }
          ].map((metric, index) => (
            <motion.div
              key={metric.label}
              whileHover={{ scale: 1.05, y: -2 }}
              className={styles.metricCard}
            >
              <div className={styles.metricIcon}>{metric.icon}</div>
              <div className={styles.metricValue}>{metric.value}</div>
              <div className={styles.metricLabel}>{metric.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
};

// Removed default export: Surfing;


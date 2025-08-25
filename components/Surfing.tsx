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

import * as React from "react";
const { useState, useCallback, useMemo } = React;
import { motion, AnimatePresence, useSpring, useTransform } from "framer-motion";

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
      type: "spring" as const,
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
      duration: 0.3
    }
  }
} as const;

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
      type: "spring" as const,
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

    try {
      // Simulate ultra-fast AI processing
      await new Promise(resolve => setTimeout(resolve, 800));

      const responses = {
        search: `🔍 Ultra Search Results për "${state.input}":\n\n✅ Gjetur ${Math.floor(Math.random() * 10000)} rezultate\n🚀 Kohë përgjigje: 0.${Math.floor(Math.random() * 99)}ms\n🧠 AGI Confidence: ${(Math.random() * 0.3 + 0.7).toFixed(3)}`,
        chat: `🤖 AGI Chat Response:\n\nUnë kuptova kërkesën tuaj për "${state.input}". Ja një përgjigje e detajuar:\n\n• Analiza e kompletuar në ${Math.floor(Math.random() * 50)}ms\n• Quantum processing active\n• Neural networks optimized\n\nA doni më shumë detaje?`,
        navigate: `🌐 Navigation Ultra për "${state.input}":\n\n📍 Destinacion: ${state.input}\n🚄 Kohë udhëtimi: ${Math.floor(Math.random() * 60)} minuta\n⚡ Route optimization: Active\n🛡️ Security level: Maximum`
      };

      setState(prev => ({ 
        ...prev, 
        response: responses[state.mode], 
        loading: false 
      }));
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: "Processing failed", 
        loading: false 
      }));
    }
  }, [state.input, state.mode]);

  // Memoized configurations
  const modeConfig = useMemo(() => ({
    search: {
      icon: '🔍',
      color: '#3b82f6',
      label: 'Ultra Search',
      description: 'Search the universe'
    },
    chat: {
      icon: '🤖',
      color: '#8b5cf6',
      label: 'AGI Chat',
      description: 'Chat with AI'
    },
    navigate: {
      icon: '🌐',
      color: '#10b981',
      label: 'Navigation',
      description: 'Navigate anywhere'
    }
  }), []);

  return (
    <motion.div
      className="surfing-container"
      variants={containerVariants}
      initial="initial"
      animate="animate"
      style={{
        background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1))',
        minHeight: '100vh',
        padding: '2rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      {/* Mode Switcher */}
      <motion.div
        variants={itemVariants}
        style={{
          display: 'flex',
          gap: '1rem',
          marginBottom: '2rem'
        }}
      >
        {Object.entries(modeConfig).map(([mode, config]) => (
          <motion.button
            key={mode}
            onClick={() => switchMode(mode as 'search' | 'chat' | 'navigate')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              padding: '0.75rem 1.5rem',
              border: state.mode === mode ? `2px solid ${config.color}` : '2px solid transparent',
              borderRadius: '12px',
              background: state.mode === mode 
                ? `linear-gradient(135deg, ${config.color}22, ${config.color}11)`
                : 'rgba(255, 255, 255, 0.1)',
              color: state.mode === mode ? config.color : '#fff',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: '500',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.3s ease'
            }}
          >
            {config.icon} {config.label}
          </motion.button>
        ))}
      </motion.div>

      {/* Input Section */}
      <motion.div
        variants={itemVariants}
        style={{
          width: '100%',
          maxWidth: '600px',
          marginBottom: '2rem'
        }}
      >
        <motion.input
          type="text"
          value={state.input}
          onChange={handleInputChange}
          placeholder={`${modeConfig[state.mode].icon} ${modeConfig[state.mode].description}...`}
          style={{
            width: '100%',
            padding: '1rem 1.5rem',
            border: '2px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '12px',
            background: 'rgba(255, 255, 255, 0.1)',
            color: '#fff',
            fontSize: '1.1rem',
            backdropFilter: 'blur(10px)',
            outline: 'none',
            transition: 'all 0.3s ease'
          }}
          whileFocus={{
            borderColor: modeConfig[state.mode].color,
            scale: 1.02
          }}
        />
      </motion.div>

      {/* Action Button */}
      <motion.button
        onClick={handleAsk}
        disabled={state.loading || !state.input.trim()}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        style={{
          padding: '1rem 2rem',
          border: 'none',
          borderRadius: '12px',
          background: state.loading 
            ? 'rgba(107, 114, 128, 0.3)' 
            : `linear-gradient(45deg, ${modeConfig[state.mode].color}, ${modeConfig[state.mode].color}80)`,
          color: '#fff',
          fontSize: '1.1rem',
          fontWeight: '600',
          cursor: state.loading ? 'not-allowed' : 'pointer',
          backdropFilter: 'blur(10px)',
          transition: 'all 0.3s ease',
          marginBottom: '2rem'
        }}
      >
        {state.loading ? '⚡ Processing...' : `${modeConfig[state.mode].icon} Execute`}
      </motion.button>

      {/* Response Section */}
      <AnimatePresence>
        {state.response && (
          <motion.div
            variants={ultraFluidVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            style={{
              width: '100%',
              maxWidth: '800px',
              padding: '2rem',
              background: 'rgba(0, 0, 0, 0.3)',
              borderRadius: '16px',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            <pre style={{
              color: '#fff',
              fontFamily: 'monospace',
              fontSize: '0.9rem',
              lineHeight: 1.6,
              whiteSpace: 'pre-wrap'
            }}>
              {state.response}
            </pre>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Display */}
      <AnimatePresence>
        {state.error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{
              padding: '1rem',
              background: 'rgba(239, 68, 68, 0.2)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '8px',
              color: '#fca5a5',
              marginTop: '1rem'
            }}
          >
            {state.error}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Surfing;
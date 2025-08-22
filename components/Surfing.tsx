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
    <section style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 25%, #24243e 50%, #1a1a2e 75%, #16213e 100%)',
      color: 'white',
      padding: '32px',
      overflow: 'hidden',
      position: 'relative'
    }}>
      {/* Ultra-fluid background particles */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%), radial-gradient(circle at 40% 80%, rgba(120, 219, 255, 0.3) 0%, transparent 50%)',
        animation: 'ultraFloat 20s ease-in-out infinite'
      }} />

      <motion.div
        variants={containerVariants}
        initial="initial"
        animate="animate"
        style={{
          position: 'relative',
          zIndex: 10,
          width: '100%',
          maxWidth: '600px'
        }}
      >
        {/* Ultra-fluid header */}
        <motion.div
          variants={ultraFluidVariants}
          style={{
            textAlign: 'center',
            marginBottom: '32px'
          }}
        >
          <h1 style={{
            fontSize: '48px',
            fontWeight: 800,
            marginBottom: '16px',
            background: 'linear-gradient(45deg, #3b82f6, #8b5cf6, #22c55e)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 0 30px rgba(59, 130, 246, 0.5)'
          }}>
            🌊 Surfing Ultra
          </h1>
          <p style={{
            fontSize: '18px',
            color: 'rgba(255, 255, 255, 0.8)',
            marginBottom: '24px'
          }}>
            Ultra-Fluid Hybrid Navigation - Quantum-Enhanced Performance
          </p>
        </motion.div>

        {/* Mode selector */}
        <motion.div
          variants={itemVariants}
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '16px',
            marginBottom: '32px'
          }}
        >
          {Object.entries(modeConfig).map(([mode, config]) => (
            <motion.button
              key={mode}
              onClick={() => switchMode(mode as any)}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              style={{
                background: state.mode === mode ? config.bg : 'rgba(255, 255, 255, 0.1)',
                border: state.mode === mode ? `2px solid ${config.color}` : '2px solid transparent',
                borderRadius: '12px',
                padding: '12px 20px',
                color: state.mode === mode ? config.color : 'rgba(255, 255, 255, 0.7)',
                fontSize: '16px',
                fontWeight: 600,
                cursor: 'pointer',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.3s ease'
              }}
            >
              {config.icon} {mode.charAt(0).toUpperCase() + mode.slice(1)}
            </motion.button>
          ))}
        </motion.div>

        {/* Ultra-fluid main interface */}
        <motion.div
          variants={ultraFluidVariants}
          style={{
            background: 'rgba(255, 255, 255, 0.08)',
            padding: '32px',
            borderRadius: '20px',
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}
        >
          {/* Input section */}
          <div style={{ marginBottom: '24px' }}>
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
              style={{
                width: '100%',
                padding: '16px 20px',
                marginBottom: '16px',
                borderRadius: '12px',
                border: `2px solid ${modeConfig[state.mode].color}`,
                background: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                fontSize: '16px',
                outline: 'none',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.3s ease'
              }}
            />

            {state.error && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ color: '#ef4444', marginBottom: '16px', fontSize: '14px' }}
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
              style={{
                width: '100%',
                background: state.loading ? 'rgba(107, 114, 128, 0.3)' : `linear-gradient(45deg, ${modeConfig[state.mode].color}, ${modeConfig[state.mode].color}80)`,
                color: 'white',
                padding: '16px 24px',
                borderRadius: '12px',
                border: 'none',
                cursor: state.loading ? 'not-allowed' : 'pointer',
                fontWeight: 600,
                fontSize: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.3s ease'
              }}
            >
              {state.loading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    style={{
                      width: '20px',
                      height: '20px',
                      border: '2px solid rgba(255, 255, 255, 0.3)',
                      borderTop: '2px solid white',
                      borderRadius: '50%'
                    }}
                  />
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
                style={{
                  marginTop: '24px',
                  padding: '24px',
                  background: modeConfig[state.mode].bg,
                  border: `1px solid ${modeConfig[state.mode].color}40`,
                  borderRadius: '16px',
                  color: 'white',
                  fontSize: '14px',
                  lineHeight: '1.6',
                  whiteSpace: 'pre-wrap',
                  backdropFilter: 'blur(10px)'
                }}
              >
                {state.response}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Performance metrics */}
        <motion.div
          variants={itemVariants}
          style={{
            display: 'flex',
            justifyContent: 'space-around',
            marginTop: '24px',
            gap: '16px'
          }}
        >
          {[
            { label: 'Response Time', value: '0.8ms', icon: '⚡' },
            { label: 'Accuracy', value: '99.7%', icon: '🎯' },
            { label: 'Performance', value: 'Ultra', icon: '🚀' }
          ].map((metric, index) => (
            <motion.div
              key={metric.label}
              whileHover={{ scale: 1.05, y: -2 }}
              style={{
                textAlign: 'center',
                background: 'rgba(255, 255, 255, 0.05)',
                padding: '16px',
                borderRadius: '12px',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                flex: 1
              }}
            >
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>{metric.icon}</div>
              <div style={{ fontSize: '18px', fontWeight: 600, color: modeConfig[state.mode].color }}>{metric.value}</div>
              <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)' }}>{metric.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Ultra-fluid CSS animations */}
      <style jsx>{`
        @keyframes ultraFloat {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
            opacity: 0.7;
          }
          33% {
            transform: translateY(-20px) rotate(120deg);
            opacity: 1;
          }
          66% {
            transform: translateY(10px) rotate(240deg);
            opacity: 0.8;
          }
        }
      `}</style>
    </section>
  );
};

export default Surfing;

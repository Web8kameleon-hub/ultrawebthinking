/**
 * EuroWeb Surfing Ultra - Beautiful & Functional
 * Real API connections with stunning UI
 * @author Ledjan Ahmati
 * @version 8.0.0 Ultra-Beautiful
 */

"use client";

import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setState(prev => ({ ...prev, input: e.target.value, error: "" }));
  };

  const switchMode = (newMode: 'search' | 'chat' | 'navigate') => {
    setState(prev => ({ ...prev, mode: newMode }));
  };

  const handleSubmit = async () => {
    if (!state.input.trim()) return;

    setState(prev => ({ ...prev, loading: true, error: "", response: "" }));

    try {
      const res = await fetch(`/api/${state.mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: state.input })
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }

      const data = await res.json();

      setState(prev => ({
        ...prev,
        loading: false,
        response: data.response || data.message || "Përgjigje e pranuar",
        input: ""
      }));
    } catch (err: any) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: err.message || "Gabim në lidhje"
      }));
    }
  };

  const modeConfig = {
    search: { icon: '🔍', label: 'Kërko', color: 'blue.500' },
    chat: { icon: '🤖', label: 'Bisedo', color: 'green.500' },
    navigate: { icon: '🌐', label: 'Navigo', color: 'purple.500' }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={css({
        maxWidth: '800px',
        margin: '0 auto',
        padding: '2rem',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, slate.50 0%, blue.50 100%)',
        fontFamily: 'Inter, sans-serif'
      })}
    >
      {/* Header */}
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        className={css({
          textAlign: 'center',
          marginBottom: '2rem'
        })}
      >
        <h1 className={css({
          fontSize: '3xl',
          fontWeight: 'bold',
          background: 'linear-gradient(45deg, blue.600, purple.600)',
          backgroundClip: 'text',
          color: 'transparent',
          marginBottom: '0.5rem'
        })}>
          🌊 Surfing Ultra
        </h1>
        <p className={css({
          color: 'slate.600',
          fontSize: 'lg'
        })}>
          AGI-powered intelligent assistance
        </p>
      </motion.div>

      {/* Mode Selector */}
      <motion.div
        className={css({
          display: 'flex',
          gap: '1rem',
          marginBottom: '2rem',
          justifyContent: 'center'
        })}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {Object.entries(modeConfig).map(([mode, config]) => (
          <motion.button
            key={mode}
            onClick={() => switchMode(mode as any)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={css({
              padding: '0.75rem 1.5rem',
              borderRadius: 'lg',
              border: '2px solid',
              borderColor: state.mode === mode ? config.color : 'transparent',
              background: state.mode === mode ? 'white' : 'rgba(255,255,255,0.5)',
              color: state.mode === mode ? config.color : 'slate.700',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: state.mode === mode ? 'lg' : 'sm',
              backdropFilter: 'blur(10px)'
            })}
          >
            {config.icon} {config.label}
          </motion.button>
        ))}
      </motion.div>

      {/* Main Interface */}
      <motion.div
        className={css({
          background: 'white',
          borderRadius: 'xl',
          padding: '2rem',
          boxShadow: 'xl',
          border: '1px solid',
          borderColor: 'slate.200'
        })}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        {/* Input */}
        <div className={css({ marginBottom: '1rem' })}>
          <motion.input
            type="text"
            placeholder={`${modeConfig[state.mode].icon} ${
              state.mode === 'search' ? 'Kërko diçka...' :
              state.mode === 'chat' ? 'Bisedo me AGI...' :
              'Navigo diku...'
            }`}
            value={state.input}
            onChange={handleInputChange}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            whileFocus={{ scale: 1.02 }}
            className={css({
              width: '100%',
              padding: '1rem',
              borderRadius: 'lg',
              border: '2px solid',
              borderColor: modeConfig[state.mode].color,
              fontSize: 'lg',
              outline: 'none',
              transition: 'all 0.2s',
              _focus: {
                borderColor: modeConfig[state.mode].color,
                boxShadow: `0 0 0 3px ${modeConfig[state.mode].color}20`
              }
            })}
          />
        </div>

        {/* Submit Button */}
        <motion.button
          onClick={handleSubmit}
          disabled={state.loading || !state.input.trim()}
          whileHover={{ scale: state.loading ? 1 : 1.02 }}
          whileTap={{ scale: state.loading ? 1 : 0.98 }}
          className={css({
            width: '100%',
            padding: '1rem',
            borderRadius: 'lg',
            border: 'none',
            background: state.loading ? 'slate.400' : `linear-gradient(45deg, ${modeConfig[state.mode].color}, ${modeConfig[state.mode].color}80)`,
            color: 'white',
            fontSize: 'lg',
            fontWeight: '600',
            cursor: state.loading ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem'
          })}
        >
          {state.loading ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className={css({
                  width: '1.5rem',
                  height: '1.5rem',
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderTop: '2px solid white',
                  borderRadius: 'full'
                })}
              />
              Duke përpunuar...
            </>
          ) : (
            <>
              {modeConfig[state.mode].icon} {
                state.mode === 'search' ? 'Kërko' :
                state.mode === 'chat' ? 'Bisedo' :
                'Navigo'
              }
            </>
          )}
        </motion.button>

        {/* Error Display */}
        <AnimatePresence>
          {state.error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={css({
                marginTop: '1rem',
                padding: '1rem',
                background: 'red.50',
                border: '1px solid',
                borderColor: 'red.200',
                borderRadius: 'lg',
                color: 'red.600'
              })}
            >
              ❌ {state.error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Response Display */}
        <AnimatePresence>
          {state.response && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={css({
                marginTop: '1.5rem',
                padding: '1.5rem',
                background: 'slate.50',
                border: '1px solid',
                borderColor: 'slate.200',
                borderRadius: 'lg',
                whiteSpace: 'pre-wrap',
                fontSize: 'md',
                lineHeight: '1.6'
              })}
            >
              {state.response}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Status Footer */}
      <motion.div
        className={css({
          textAlign: 'center',
          marginTop: '2rem',
          color: 'slate.500',
          fontSize: 'sm'
        })}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        ⚡ Real-time AGI processing • 🔒 Secure • 🚀 Ultra-fast
      </motion.div>
    </motion.div>
  );
};

export default Surfing;

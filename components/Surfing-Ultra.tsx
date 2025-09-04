/**
 * EuroWeb Surfing Ultra - Beautiful & Functional
 * Real API connections with stunning UI
 * @author Ledjan Ahmati
 * @version 8.0.0 Ultra-Beautiful
 */

"use client";

import { css } from "@emotion/css";
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
      let response;
      
      if (state.mode === 'search') {
        // Real AGI Memory search
        const res = await fetch('/api/agi/memory', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        });
        const data = await res.json();
        response = `Memory Status: ${data.blocks?.length || 0} active blocks\nTotal Memory: ${data.metrics?.totalMemory ? (data.metrics.totalMemory / 1024 / 1024 / 1024).toFixed(2) + 'GB' : 'N/A'}\nUptime: ${data.metrics?.uptime || 'N/A'}`;
      } else if (state.mode === 'chat') {
        // Real AGI Core processing
        const res = await fetch('/api/agi/command', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            command: 'ANALYZE', 
            binding: 'semantic',
            parameters: { text: state.input }
          })
        });
        const data = await res.json();
        response = data.success ? 
          `Analysis: ${data.data?.sentiment || 'neutral'}\nTokens: ${data.data?.tokens || 0}\nLanguage: ${data.data?.language || 'unknown'}` :
          `Error: ${data.error}`;
      } else {
        // Real AGI Core status
        const res = await fetch('/api/agi/core', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        });
        const data = await res.json();
        response = `System Status: ${data.status}\nAGI Modules: ${data.data?.agi?.modules?.join(', ') || 'none'}\nSystem Health: ${data.systemHealth}%\nCPU Usage: ${data.data?.cpu?.total || 0}ms`;
      }

      setState(prev => ({
        ...prev,
        loading: false,
        response: response,
        input: ""
      }));
    } catch (err: any) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: err.message || "Gabim në lidhje me AGI API"
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
      className={css`
        max-width: 800px;
        margin: 0 auto;
        padding: 2rem;
        min-height: 100vh;
        background: linear-gradient(135deg, #f8fafc 0%, #eff6ff 100%);
        font-family: Inter, sans-serif;
      `}
    >
      {/* Header */}
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        className={css`
          text-align: center;
          margin-bottom: 2rem;
        `}
      >
        <h1 className={css`
          font-size: 3rem;
          font-weight: bold;
          background: linear-gradient(45deg, #2563eb, #9333ea);
          background-clip: text;
          -webkit-background-clip: text;
          color: transparent;
          margin-bottom: 0.5rem;
        `}>
          🌊 Surfing Ultra
        </h1>
        <p className={css`
          color: #64748b;
          font-size: 1.125rem;
        `}>
          AGI-powered intelligent assistance
        </p>
      </motion.div>

      {/* Mode Selector */}
      <motion.div
        className={css`
          display: flex;
          gap: 1rem;
          margin-bottom: 2rem;
          justify-content: center;
        `}
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
            className={css`
              padding: 0.75rem 1.5rem;
              border-radius: 0.5rem;
              border: 2px solid ${state.mode === mode ? (config.color === 'blue.500' ? '#3b82f6' : config.color === 'green.500' ? '#10b981' : '#8b5cf6') : 'transparent'};
              background: ${state.mode === mode ? 'white' : 'rgba(255,255,255,0.5)'};
              color: ${state.mode === mode ? (config.color === 'blue.500' ? '#3b82f6' : config.color === 'green.500' ? '#10b981' : '#8b5cf6') : '#374151'};
              font-weight: 600;
              cursor: pointer;
              transition: all 0.2s;
              box-shadow: ${state.mode === mode ? '0 10px 15px -3px rgba(0, 0, 0, 0.1)' : '0 1px 3px 0 rgba(0, 0, 0, 0.1)'};
              backdrop-filter: blur(10px);
            `}
          >
            {config.icon} {config.label}
          </motion.button>
        ))}
      </motion.div>

      {/* Main Interface */}
      <motion.div
        className={css`
          background: white;
          border-radius: 0.75rem;
          padding: 2rem;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
          border: 1px solid #e2e8f0;
        `}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        {/* Input */}
        <div className={css`margin-bottom: 1rem;`}>
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
            className={css`
              width: 100%;
              padding: 1rem;
              border-radius: 0.5rem;
              border: 2px solid ${
                modeConfig[state.mode].color === 'blue.500' ? '#3b82f6' :
                modeConfig[state.mode].color === 'green.500' ? '#10b981' : '#8b5cf6'
              };
              font-size: 1.125rem;
              outline: none;
              transition: all 0.2s;
              &:focus {
                border-color: ${
                  modeConfig[state.mode].color === 'blue.500' ? '#3b82f6' :
                  modeConfig[state.mode].color === 'green.500' ? '#10b981' : '#8b5cf6'
                };
                box-shadow: 0 0 0 3px ${
                  modeConfig[state.mode].color === 'blue.500' ? '#3b82f620' :
                  modeConfig[state.mode].color === 'green.500' ? '#10b98120' : '#8b5cf620'
                };
              }
            `}
          />
        </div>

        {/* Submit Button */}
        <motion.button
          onClick={handleSubmit}
          disabled={state.loading || !state.input.trim()}
          whileHover={{ scale: state.loading ? 1 : 1.02 }}
          whileTap={{ scale: state.loading ? 1 : 0.98 }}
          className={css`
            width: 100%;
            padding: 1rem;
            border-radius: 0.5rem;
            border: none;
            background: ${state.loading ? '#94a3b8' : `linear-gradient(45deg, ${
              modeConfig[state.mode].color === 'blue.500' ? '#3b82f6' :
              modeConfig[state.mode].color === 'green.500' ? '#10b981' : '#8b5cf6'
            }, ${
              modeConfig[state.mode].color === 'blue.500' ? '#3b82f680' :
              modeConfig[state.mode].color === 'green.500' ? '#10b98180' : '#8b5cf680'
            })`};
            color: white;
            font-size: 1.125rem;
            font-weight: 600;
            cursor: ${state.loading ? 'not-allowed' : 'pointer'};
            transition: all 0.2s;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
          `}
        >
          {state.loading ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className={css`
                  width: 1.5rem;
                  height: 1.5rem;
                  border: 2px solid rgba(255,255,255,0.3);
                  border-top: 2px solid white;
                  border-radius: 50%;
                `}
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
              className={css`
                margin-top: 1rem;
                padding: 1rem;
                background: #fef2f2;
                border: 1px solid #fecaca;
                border-radius: 0.5rem;
                color: #dc2626;
              `}
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
              className={css`
                margin-top: 1.5rem;
                padding: 1.5rem;
                background: #f8fafc;
                border: 1px solid #e2e8f0;
                border-radius: 0.5rem;
                white-space: pre-wrap;
                font-size: 1rem;
                line-height: 1.6;
              `}
            >
              {state.response}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Status Footer */}
      <motion.div
        className={css`
          text-align: center;
          margin-top: 2rem;
          color: #64748b;
          font-size: 0.875rem;
        `}
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


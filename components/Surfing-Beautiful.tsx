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
    search: { icon: '🔍', label: 'Kërko', color: 'border-blue-500 text-blue-600 bg-blue-50' },
    chat: { icon: '🤖', label: 'Bisedo', color: 'border-green-500 text-green-600 bg-green-50' },
    navigate: { icon: '🌐', label: 'Navigo', color: 'border-purple-500 text-purple-600 bg-purple-50' }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto p-8 min-h-screen bg-gradient-to-br from-slate-50 to-blue-50"
    >
      {/* Header */}
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
          🌊 Surfing Ultra
        </h1>
        <p className="text-slate-600 text-lg">
          AGI-powered intelligent assistance
        </p>
      </motion.div>

      {/* Mode Selector */}
      <motion.div
        className="flex gap-4 mb-8 justify-center flex-wrap"
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
            className={`px-6 py-3 rounded-lg border-2 font-semibold transition-all duration-200 backdrop-blur-sm ${
              state.mode === mode 
                ? `${config.color} shadow-lg` 
                : 'border-transparent bg-white/50 text-slate-700 hover:bg-white/70'
            }`}
          >
            {config.icon} {config.label}
          </motion.button>
        ))}
      </motion.div>

      {/* Main Interface */}
      <motion.div
        className="bg-white rounded-2xl p-8 shadow-xl border border-slate-200"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        {/* Input */}
        <div className="mb-4">
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
            whileFocus={{ scale: 1.01 }}
            className={`w-full p-4 rounded-lg border-2 text-lg outline-none transition-all duration-200 ${
              state.mode === 'search' ? 'border-blue-500 focus:ring-4 focus:ring-blue-500/20' :
              state.mode === 'chat' ? 'border-green-500 focus:ring-4 focus:ring-green-500/20' :
              'border-purple-500 focus:ring-4 focus:ring-purple-500/20'
            }`}
          />
        </div>

        {/* Submit Button */}
        <motion.button
          onClick={handleSubmit}
          disabled={state.loading || !state.input.trim()}
          whileHover={{ scale: state.loading ? 1 : 1.02 }}
          whileTap={{ scale: state.loading ? 1 : 0.98 }}
          className={`w-full p-4 rounded-lg border-none text-white text-lg font-semibold cursor-pointer transition-all duration-200 flex items-center justify-center gap-2 ${
            state.loading 
              ? 'bg-slate-400 cursor-not-allowed' 
              : state.mode === 'search' ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700' :
                state.mode === 'chat' ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700' :
                'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700'
          }`}
        >
          {state.loading ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full"
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
              className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600"
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
              className="mt-6 p-6 bg-slate-50 border border-slate-200 rounded-lg whitespace-pre-wrap text-slate-800 leading-relaxed"
            >
              {state.response}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Status Footer */}
      <motion.div
        className="text-center mt-8 text-slate-500 text-sm"
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


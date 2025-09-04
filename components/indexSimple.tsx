/**
 * EuroWeb Web8 - Simple Index Component
 * Pure Panda CSS - No styled-system - Industrial Grade
 * 
 * @author Ledjan Ahmati (100% Owner)
 * @contact dealsjona@gmail.com
 * @version 8.0.0 Industrial
 * @license MIT
 */

'use client';

import { motion } from 'framer-motion';
import React from 'react';
import '../styles/globals.css';

// Pure TypeScript component - NO default export (forbidden)
const IndexSimple = (): React.ReactElement => {
  return (
    <motion.div
      className="flex justify-center items-center min-h-screen text-2xl font-bold text-white bg-gradient-to-br from-blue-700 to-blue-900 text-center p-8 font-inter"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        className="flex flex-col gap-4"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <motion.h1
          className="text-4xl font-bold text-white drop-shadow-lg"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          Web8 UltraThinking
        </motion.h1>
        <motion.p
          className="text-xl text-blue-100 font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          Kristal Engine Ready
        </motion.p>
        <motion.div
          className="flex gap-2 justify-center items-center mt-4"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
          <span className="text-sm text-green-300 font-medium">
            System Active
          </span>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

// Named export (required by EuroWeb Web8 standards)
export { IndexSimple };



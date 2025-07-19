'use client';

/**
 * EuroWeb Web8 - Loading Component
 * CVA + Framer Motion Industrial Loading
 */

import React from 'react';
import { motion } from 'framer-motion';

const Loading = (): React.ReactElement => {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '2rem',
      padding: '2rem',
      background: 'linear-gradient(135deg, #1a1d29 0%, #2d2a45 50%, #1e2a4a 100%)',
      color: '#f8fafc'
    }}>
      
      {/* Spinner */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        style={{
          width: '60px',
          height: '60px',
          border: '3px solid #d4af37',
          borderTop: '3px solid transparent',
          borderRadius: '50%'
        }}
      />
      
      {/* Text */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        style={{ textAlign: 'center' }}
      >
        <h2 style={{ 
          fontSize: '1.5rem', 
          fontWeight: 'bold', 
          marginBottom: '0.5rem',
          background: 'linear-gradient(45deg, #d4af37, #4f46e5)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          🚀 EuroWeb Platform
        </h2>
        
        <p style={{ fontSize: '1rem', color: '#cbd5e1' }}>
          AGI Core po inicializohet...
        </p>
      </motion.div>
      
    </div>
  );
};

export default Loading;

/**
 * EuroWeb Web8 Platform - Client Component Wrapper
 * Ensures proper hydration for dynamic AGI interface
 * 
 * @author Ledjan Ahmati (100% Owner)
 * @contact dealsjona@gmail.com
 * @version 8.0.0 Industrial
 * @license MIT
 */

'use client';

import React from 'react';
import dynamic from 'next/dynamic';

// Dynamically import Web8TabSystem with no SSR to prevent hydration issues
const Web8TabSystem = dynamic(() => import('./Web8TabSystem'), {
  ssr: false,
  loading: () => (
    <div className="loading-container">
      <div className="loading-content">
        <div className="loading-spinner"></div>
        <h2>🚀 EuroWeb Web8 Loading...</h2>
        <p>AGI-Powered Browser Interface Initializing</p>
      </div>
    </div>
  )
});

/**
 * Client-side wrapper component without hooks
 * Pure functional component for proper TypeScript compliance
 */
const Web8ClientWrapper: React.FC = () => {
  return (
    <div className="web8-client-wrapper">
      <Web8TabSystem />
    </div>
  );
};

export { Web8ClientWrapper };

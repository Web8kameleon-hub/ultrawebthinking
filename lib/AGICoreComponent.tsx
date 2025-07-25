/**
 * AGICoreComponent - React Component Wrapper for AGICore
 * Provides UI interface for the AGI Core system
 * 
 * @author Ledjan Ahmati
 * @version 8.0.0-AGI-COMPONENT
 * @license MIT
 */

'use client';

import React, { useState, useEffect } from 'react';
import { AGICore } from './AGICore';
import styles from './AGICoreComponent.module.css';

interface AGICoreComponentProps {
  className?: string;
}

export const AGICoreComponent: React.FC<AGICoreComponentProps> = ({ className }) => {
  const [agiCore, setAgiCore] = useState<AGICore | null>(null);
  const [status, setStatus] = useState<string>('Initializing...');
  const [memory, setMemory] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Mark as client-side only
    setIsClient(true);
    
    // Initialize AGICore
    const core = new AGICore();
    setAgiCore(core);
    setStatus('AGI Core Active');
    
    // Get initial memory state
    setMemory(core.getMemory());

    // Subscribe to memory changes
    const unsubscribe = core.subscribe(() => {
      setMemory(core.getMemory());
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Don't render dynamic content until client-side
  if (!isClient) {
    return (
      <div className={`${styles.agiContainer} ${className || ''}`}>
        <div className={styles.header}>
          <h1 className={styles.title}>🧠 AGI Core System</h1>
          <div className={styles.status}>
            <span className={styles.statusIndicator}></span>
            Loading...
          </div>
        </div>
        <div className={styles.loading}>
          <div className={styles.loadingSpinner}></div>
          <p>Initializing AGI Core...</p>
        </div>
      </div>
    );
  }

  const handleQuery = async (query: string) => {
    if (!agiCore) return;
    
    setIsProcessing(true);
    setStatus('Processing...');
    
    try {
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      agiCore.updateMemory('agi', {
        lastQuery: query,
        responses: [...(memory?.agi?.responses || []), `Response to: ${query}`],
        brainActive: true
      });
      
      setStatus('Query Processed');
    } catch (error) {
      setStatus('Error Processing Query');
    } finally {
      setIsProcessing(false);
    }
  };

  const toggleTheme = () => {
    if (!agiCore) return;
    
    const themes = ['light', 'dark', 'nature'];
    const currentTheme = memory?.ui?.theme || 'dark';
    const currentIndex = themes.indexOf(currentTheme);
    const nextTheme = themes[(currentIndex + 1) % themes.length];
    
    agiCore.updateMemory('ui', { ...memory?.ui, theme: nextTheme });
  };

  return (
    <div className={`${styles.agiContainer} ${className || ''}`} data-theme={memory?.ui?.theme || 'dark'}>
      <div className={styles.header}>
        <h1 className={styles.title}>🧠 AGI Core System</h1>
        <div className={styles.status}>
          <span className={`${styles.statusIndicator} ${isProcessing ? styles.processing : ''}`}></span>
          {status}
        </div>
      </div>

      {memory && (
        <div className={styles.dashboard}>
          <div className={styles.section}>
            <h3>UI State</h3>
            <div className={styles.stateGrid}>
              <div className={styles.stateItem}>
                <label>Active Tab:</label>
                <span>{memory.ui?.activeTab || 'none'}</span>
              </div>
              <div className={styles.stateItem}>
                <label>Theme:</label>
                <span>{memory.ui?.theme || 'dark'}</span>
              </div>
              <div className={styles.stateItem}>
                <label>Scroll Position:</label>
                <span>{memory.ui?.scrollPosition || 0}px</span>
              </div>
            </div>
          </div>

          <div className={styles.section}>
            <h3>AGI State</h3>
            <div className={styles.stateGrid}>
              <div className={styles.stateItem}>
                <label>Status:</label>
                <span className={styles.agiStatus}>{memory.agi?.status || 'IDLE'}</span>
              </div>
              <div className={styles.stateItem}>
                <label>Brain Active:</label>
                <span>{memory.agi?.brainActive ? '🟢 Yes' : '🔴 No'}</span>
              </div>
              <div className={styles.stateItem}>
                <label>Last Query:</label>
                <span>{memory.agi?.lastQuery || 'None'}</span>
              </div>
            </div>
          </div>

          <div className={styles.section}>
            <h3>Recent Responses</h3>
            <div className={styles.responsesList}>
              {memory.agi?.responses?.slice(-3).map((response: string, index: number) => (
                <div key={index} className={styles.responseItem}>
                  {response}
                </div>
              )) || <div className={styles.noResponses}>No responses yet</div>}
            </div>
          </div>
        </div>
      )}

      <div className={styles.controls}>
        <div className={styles.querySection}>
          <input
            type="text"
            placeholder="Enter AGI query..."
            className={styles.queryInput}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                handleQuery(e.currentTarget.value.trim());
                e.currentTarget.value = '';
              }
            }}
            disabled={isProcessing}
          />
          <button
            className={styles.button}
            onClick={() => {
              const input = document.querySelector(`.${styles.queryInput}`) as HTMLInputElement;
              if (input && input.value.trim()) {
                handleQuery(input.value.trim());
                input.value = '';
              }
            }}
            disabled={isProcessing}
          >
            {isProcessing ? 'Processing...' : 'Send Query'}
          </button>
        </div>

        <div className={styles.actionButtons}>
          <button className={styles.button} onClick={toggleTheme}>
            Change Theme
          </button>
          
          <button 
            className={styles.button}
            onClick={() => agiCore?.updateMemory('agi', { status: 'ACTIVE', brainActive: true })}
          >
            Activate Brain
          </button>
          
          <button 
            className={styles.button}
            onClick={() => {
              // Reset AGI memory manually since clearMemory doesn't exist
              agiCore?.updateMemory('agi', {
                status: 'IDLE',
                lastQuery: '',
                responses: [],
                brainActive: false
              });
              agiCore?.updateMemory('user', {
                preferences: {},
                history: [],
                currentTime: new Date().toLocaleString()
              });
            }}
          >
            Reset Memory
          </button>
        </div>
      </div>

      <div className={styles.footer}>
        <small>
          {isClient && memory?.user?.currentTime ? (
            `Current Time: ${memory.user.currentTime}`
          ) : (
            'AGI Core System Ready'
          )}
        </small>
      </div>
    </div>
  );
};

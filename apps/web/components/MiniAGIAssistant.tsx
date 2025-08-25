import React from 'react';
import { useAGI, useAGIState } from '../lib/AGIContext';
import { motion } from 'framer-motion';
import styles from '../styles/MiniAGIAssistant.module.css';

const MiniAGIAssistant: React.FC = () => {
  const { actions, ui } = useAGI();
  
  // Get AGI state from context (no  needed!)
  const agiStatus = useAGIState(memory => memory.agi.status);
  const lastQuery = useAGIState(memory => memory.agi.lastQuery);
  const responses = useAGIState(memory => memory.agi.responses);
  const brainActive = useAGIState(memory => memory.agi.brainActive);

  const handleQuery = (query: string) => {
    if (!query.trim()) {return;}
    
    // Add to AGI memory instead of local state
    actions.addAGIResponse(query, `Processing: ${query}`);
    actions.setAGIStatus('PROCESSING');
    
    // Simulate AGI response
    setTimeout(() => {
      const response = `AGI Response: I've analyzed "${query}" and here's my intelligent response.`;
      actions.addAGIResponse(query, response);
      actions.setAGIStatus('ACTIVE');
    }, 2000);
  };

  React.useEffect(() => {
    // Activate UI element when component mounts
    ui.activateElement('mini-agi-assistant');
    
    // Add pulse effect when brain is active
    if (brainActive) {
      ui.pulseElement('agi-brain-indicator');
    }
  }, [ui, brainActive]);

  return (
    <motion.div 
      id="mini-agi-assistant"
      className={`${styles.container} agi-reactive agi-bg`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className={styles.header}>
        <h3>
          🤖 Mini AGI Assistant
          <span 
            id="agi-brain-indicator" 
            className={`${styles.statusIndicator} ${agiStatus === 'PROCESSING' ? styles.processing : ''}`}
          >
            {agiStatus}
          </span>
        </h3>
        <p>Intelligent assistance powered by AGI memory</p>
      </div>
      
      <div className={styles.chatArea}>
        <div className={styles.messages}>
          {responses.length > 0 ? (
            responses.slice(-3).map((response, index) => (
              <motion.div 
                key={index}
                className={`${styles.response} agi-accent`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {response}
              </motion.div>
            ))
          ) : (
            <div className={styles.systemMessage}>
              AGI Assistant ready. Memory system active.
            </div>
          )}
          
          {agiStatus === 'PROCESSING' && (
            <motion.div 
              className={styles.loading}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 1 }}
            >
              AGI is thinking...
            </motion.div>
          )}
        </div>
      </div>

      <div className={styles.inputArea}>
        <input
          type="text"
          placeholder="Ask the AGI something..."
          className={`${styles.inputField} agi-reactive`}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              const target = e.target as HTMLInputElement;
              handleQuery(target.value);
              target.value = '';
            }
          }}
          disabled={agiStatus === 'PROCESSING'}
        />
        <button 
          className={`${styles.sendButton} agi-reactive ${agiStatus === 'PROCESSING' ? styles.disabled : ''}`}
          onClick={(e) => {
            const input = (e.target as HTMLElement).previousElementSibling as HTMLInputElement;
            if (input) {
              handleQuery(input.value);
              input.value = '';
            }
          }}
          disabled={agiStatus === 'PROCESSING'}
        >
          {agiStatus === 'PROCESSING' ? 'Processing...' : 'Send'}
        </button>
      </div>

      <div className={styles.memoryInfo}>
        <small>
          Last query: {lastQuery ?? 'None'} | 
          Responses: {responses.length} | 
          Brain: {brainActive ? '🟢 Active' : '🔴 Inactive'}
        </small>
      </div>
    </motion.div>
  );
};

// Removed default export: MiniAGIAssistant;


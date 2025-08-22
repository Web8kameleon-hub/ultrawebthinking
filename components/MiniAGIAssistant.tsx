import React, { useState } from 'react';
import { useAGI } from '../lib/AGIContext';
import { motion } from 'framer-motion';
import styles from '../styles/MiniAGIAssistant.module.css';

const MiniAGIAssistant: React.FC = () => {
  const { memory, actions } = useAGI();
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleQuery = async (query: string) => {
    if (!query.trim() || isProcessing) return;
    
    setIsProcessing(true);
    actions.setAGIStatus('PROCESSING' as any);
    
    try {
      // Process the query
      const response = await actions.processQuery(query);
      actions.addAGIResponse(query, response);
    } catch (error) {
      actions.addAGIResponse(query, `Error: ${(error as Error).message}`);
    } finally {
      setIsProcessing(false);
      setInputValue('');
      actions.setAGIStatus('ACTIVE' as any);
    }
  };

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
            className={`${styles.statusIndicator} ${isProcessing ? styles.processing : ''}`}
          >
            {isProcessing ? 'Processing' : memory.agi.status !== 'IDLE' ? 'Active' : 'Inactive'}
          </span>
        </h3>
        <p>Intelligent assistance powered by AGI Core</p>
      </div>
      
      <div className={styles.chatArea}>
        <div className={styles.messages}>
          {memory.agi.responses.length > 0 ? (
            <motion.div 
              className={`${styles.response} agi-accent`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {JSON.stringify(memory.agi.responses[memory.agi.responses.length - 1]) || 'No response yet'}
            </motion.div>
          ) : (
            <div className={styles.systemMessage}>
              AGI Assistant ready. Core system {memory.agi.status !== 'IDLE' ? 'active' : 'inactive'}.
            </div>
          )}
          
          {isProcessing && (
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
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Ask the AGI something..."
          className={`${styles.inputField} agi-reactive`}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleQuery(inputValue);
            }
          }}
          disabled={isProcessing}
        />
        <button 
          className={`${styles.sendButton} agi-reactive ${isProcessing ? styles.disabled : ''}`}
          onClick={() => handleQuery(inputValue)}
          disabled={isProcessing}
        >
          {isProcessing ? 'Processing...' : 'Send'}
        </button>
      </div>

      <div className={styles.memoryInfo}>
        <small>
          Last query: {memory.agi.lastQuery || 'None'} | 
          Status: {memory.agi.status !== 'IDLE' ? '🟢 Active' : '🔴 Inactive'} |
          Tasks: {memory.agi.responses.length}
        </small>
      </div>
    </motion.div>
  );
};

export default MiniAGIAssistant;

/**
 * AGICoreComponent - React Component Wrapper for AGICore
 * Provides UI interface for the AGI Core system
 * 
 * @author Ledjan Ahmati
 * @version 8.0.0-AGI-COMPONENT
 * @license MIT
 */

'use client';

import * as React from "react";
import { useState, useEffect } from "react";
import { AGICore } from './AGICore';

interface AGICoreComponentProps {
  className?: string;
}

export const AGICoreComponent: React.FC<AGICoreComponentProps> = ({ className }: AGICoreComponentProps) => {
  const [agiCore, setAgiCore] = useState<AGICore | null>(null);
  const [status, setStatus] = useState<string>('Initializing...');
  const [memory, setMemory] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isClient, setIsClient] = useState<boolean>(false);
  const [query, setQuery] = useState<string>('');

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

  const handleQuery = async (inputQuery: string) => {
    if (!agiCore || !inputQuery.trim()) return;
    
    setIsProcessing(true);
    setQuery(inputQuery);
    
    try {
      // Process query with AGI Core using available methods
      agiCore.setAGIStatus('PROCESSING');
      
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Add response using the available method
      const response = `Processed: ${inputQuery} at ${new Date().toLocaleTimeString()}`
      agiCore.addAGIResponse(inputQuery, response);
      
      agiCore.setAGIStatus('ACTIVE');
      setMemory(agiCore.getMemory());
    } catch (error) {
      console.error('AGI processing error:', error);
      agiCore.setAGIStatus('IDLE');
    } finally {
      setIsProcessing(false);
    }
  };

  // Don't render dynamic content until client-side
  if (!isClient) {
    return (
      <div className={`agi-container ${className || ''}`}>
        <div className="loading">Initializing AGI Core...</div>
      </div>
    );
  }

  return (
    <div className={`agi-container ${className || ''}`}>
      <div className="agi-header">
        <h2>AGI Core System</h2>
        <span className={`status-indicator ${isProcessing ? 'processing' : 'active'}`}>
          {status}
        </span>
      </div>

      <div className="agi-content">
        <div className="memory-display">
          <h3>Memory State</h3>
          <div className="memory-info">
            {memory && (
              <>
                <div className="memory-section">
                  <strong>AGI Status:</strong> {memory.agi?.status || 'Unknown'}
                </div>
                <div className="memory-section">
                  <strong>Processing:</strong> {memory.agi?.processing ? 'Active' : 'Idle'}
                </div>
                <div className="memory-section">
                  <strong>Current Time:</strong> {memory.user?.currentTime || new Date().toISOString()}
                </div>
                <div className="memory-section">
                  <strong>Responses:</strong> {memory.agi?.responses?.length || 0}
                </div>
              </>
            )}
          </div>
        </div>

        <div className="query-interface">
          <h3>Query Interface</h3>
          <div className="query-form">
            <input
              type="text"
              className="query-input"
              placeholder="Enter your query for AGI processing..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleQuery(query);
                }
              }}
              disabled={isProcessing}
            />
            <button
              className="query-submit"
              onClick={() => handleQuery(query)}
              disabled={isProcessing || !query.trim()}
            >
              {isProcessing ? 'Processing...' : 'Process Query'}
            </button>
          </div>
        </div>

        {memory?.agi?.responses && memory.agi.responses.length > 0 && (
          <div className="responses-display">
            <h3>AGI Responses</h3>
            <div className="responses-list">
              {memory.agi.responses.slice(-5).map((response: any, index: number) => (
                <div key={index} className="response-item">
                  <div className="response-timestamp">
                    {new Date().toLocaleTimeString()}
                  </div>
                  <div className="response-content">
                    {typeof response === 'string' ? response : JSON.stringify(response)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .agi-container {
          padding: 20px;
          border: 1px solid #ddd;
          border-radius: 8px;
          background: #f9f9f9;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        
        .agi-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          padding-bottom: 10px;
          border-bottom: 1px solid #eee;
        }
        
        .agi-header h2 {
          margin: 0;
          color: #333;
        }
        
        .status-indicator {
          padding: 4px 12px;
          border-radius: 4px;
          font-size: 0.9em;
          font-weight: bold;
        }
        
        .status-indicator.active {
          background: #4CAF50;
          color: white;
        }
        
        .status-indicator.processing {
          background: #FF9800;
          color: white;
          animation: pulse 1s infinite;
        }
        
        .memory-display, .query-interface, .responses-display {
          margin-bottom: 20px;
          padding: 15px;
          background: white;
          border-radius: 6px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .memory-display h3, .query-interface h3, .responses-display h3 {
          margin: 0 0 15px 0;
          color: #333;
          font-size: 1.1em;
        }
        
        .memory-section {
          margin-bottom: 8px;
          padding: 8px;
          background: #f5f5f5;
          border-radius: 4px;
        }
        
        .query-form {
          display: flex;
          gap: 10px;
        }
        
        .query-input {
          flex: 1;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 1em;
        }
        
        .query-submit {
          padding: 10px 20px;
          background: #2196F3;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 1em;
        }
        
        .query-submit:hover:not(:disabled) {
          background: #1976D2;
        }
        
        .query-submit:disabled {
          background: #ccc;
          cursor: not-allowed;
        }
        
        .responses-list {
          max-height: 300px;
          overflow-y: auto;
        }
        
        .response-item {
          margin-bottom: 10px;
          padding: 10px;
          background: #f8f9fa;
          border-left: 3px solid #2196F3;
          border-radius: 4px;
        }
        
        .response-timestamp {
          font-size: 0.8em;
          color: #666;
          margin-bottom: 5px;
        }
        
        .response-content {
          font-size: 0.9em;
          line-height: 1.4;
        }
        
        .loading {
          text-align: center;
          padding: 40px;
          color: #666;
          font-style: italic;
        }
        
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.7; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  );
};
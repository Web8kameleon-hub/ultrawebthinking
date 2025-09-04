/**
 * AGI Core Component - Main AGI Interface
 * Real production-grade AGI component
 */

import React, { useEffect, useState } from 'react'
import { getAGIMemory } from './AGICore'

interface AGICoreComponentProps {
  title?: string
  onQuerySubmit?: (query: string, response: string) => void
}

export const AGICoreComponent: React.FC<AGICoreComponentProps> = ({
  title = "EuroWeb Ultra AGI",
  onQuerySubmit
}) => {
  const agiHook = getAGIMemory()
  const { memory, subscribe, actions } = agiHook
  const [query, setQuery] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    // Subscribe to memory changes
    const unsubscribe = subscribe()
    // Set AGI as ready when component mounts
    actions.setAGIStatus('ready')
    
    return unsubscribe
  }, [actions, subscribe])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim() || isProcessing) return

    setIsProcessing(true)
    actions.setAGIStatus('processing')

    try {
      // Process the query through AGI core
      const response = await actions.processQuery(query)
      
      // Add response to memory
      actions.addAGIResponse(query, response)
      
      // Notify parent component
      if (onQuerySubmit) {
        onQuerySubmit(query, response)
      }

      setQuery('')
    } catch (error) {
      console.error('AGI processing error:', error)
      actions.setAGIStatus('error')
      actions.addAGIResponse(query, 'Error processing query')
    } finally {
      setIsProcessing(false)
      actions.setAGIStatus('ready')
    }
  }

  return (
    <div className="agi-core-container">
      <div className="agi-header">
        <h1>{title}</h1>
        <div className="agi-status">
          Status: <span className={`status-${memory.agi.status}`}>
            {memory.agi.status.toUpperCase()}
          </span>
        </div>
      </div>

      <div className="agi-chat">
        <div className="agi-responses">
          {memory.agi.responses.map((response, index) => (
            <div key={index} className="response-item">
              <div className="query">
                <strong>Q:</strong> {response.query}
              </div>
              <div className="response">
                <strong>A:</strong> {response.response}
              </div>
              <div className="metadata">
                Confidence: {(response.confidence * 100).toFixed(1)}% | 
                {new Date(response.timestamp).toLocaleTimeString()}
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="agi-input-form">
          <div className="input-group">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask AGI anything..."
              disabled={isProcessing}
              className="agi-input"
            />
            <button 
              type="submit" 
              disabled={isProcessing || !query.trim()}
              className="agi-submit"
            >
              {isProcessing ? 'Processing...' : 'Ask AGI'}
            </button>
          </div>
        </form>
      </div>

      <div className="agi-stats">
        <div className="stat-item">
          <span className="stat-label">Total Queries:</span>
          <span className="stat-value">{memory.agi.responses.length}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Session ID:</span>
          <span className="stat-value">{memory.agi.context.sessionId}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Memory Usage:</span>
          <span className="stat-value">{memory.performance.memoryUsage.toFixed(1)} MB</span>
        </div>
      </div>

      <style jsx>{`
        .agi-core-container {
          padding: 2rem;
          max-width: 1000px;
          margin: 0 auto;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 12px;
          color: white;
        }

        .agi-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .agi-header h1 {
          margin: 0 0 1rem 0;
          font-size: 2.5rem;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }

        .agi-status {
          font-size: 1.1rem;
        }

        .status-ready { color: #4ade80; }
        .status-processing { color: #fbbf24; }
        .status-thinking { color: #60a5fa; }
        .status-error { color: #f87171; }
        .status-idle { color: #9ca3af; }

        .agi-chat {
          background: rgba(255,255,255,0.1);
          border-radius: 8px;
          padding: 1.5rem;
          margin-bottom: 2rem;
        }

        .agi-responses {
          max-height: 400px;
          overflow-y: auto;
          margin-bottom: 1rem;
        }

        .response-item {
          background: rgba(255,255,255,0.1);
          border-radius: 6px;
          padding: 1rem;
          margin-bottom: 1rem;
        }

        .response-item:last-child {
          margin-bottom: 0;
        }

        .query, .response {
          margin-bottom: 0.5rem;
        }

        .metadata {
          font-size: 0.9rem;
          opacity: 0.8;
        }

        .agi-input-form {
          border-top: 1px solid rgba(255,255,255,0.2);
          padding-top: 1rem;
        }

        .input-group {
          display: flex;
          gap: 1rem;
        }

        .agi-input {
          flex: 1;
          padding: 0.75rem;
          border: none;
          border-radius: 6px;
          font-size: 1rem;
          background: rgba(255,255,255,0.9);
          color: #333;
        }

        .agi-input:disabled {
          opacity: 0.6;
        }

        .agi-submit {
          padding: 0.75rem 1.5rem;
          background: #0070f3;
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 1rem;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .agi-submit:hover:not(:disabled) {
          background: #0051cc;
        }

        .agi-submit:disabled {
          background: #6c757d;
          cursor: not-allowed;
        }

        .agi-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
          background: rgba(0,0,0,0.2);
          border-radius: 8px;
          padding: 1.5rem;
        }

        .stat-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .stat-label {
          font-weight: 500;
        }

        .stat-value {
          font-weight: bold;
          color: #4ade80;
        }
      `}</style>
    </div>
  )
}

export default AGICoreComponent

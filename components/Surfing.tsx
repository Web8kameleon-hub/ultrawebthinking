/**
 * EuroWeb Surfing - Pure Real Functions Only
 * @author Ledjan Ahmati (100% Owner)
 * @version 8.0.0 Real-Only
 */

"use client";

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

  return (
    <div className="surfing-container">
      <h1>🌊 Surfing Real</h1>

      <div className="mode-buttons">
        <button
          onClick={() => switchMode('search')}
          className={state.mode === 'search' ? 'active' : ''}
        >
          🔍 Kërko
        </button>
        <button
          onClick={() => switchMode('chat')}
          className={state.mode === 'chat' ? 'active' : ''}
        >
          🤖 Bisedo
        </button>
        <button
          onClick={() => switchMode('navigate')}
          className={state.mode === 'navigate' ? 'active' : ''}
        >
          🌐 Navigo
        </button>
      </div>

      <input
        type="text"
        placeholder="Shkruaj komandën..."
        value={state.input}
        onChange={handleInputChange}
        onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
      />

      <button
        onClick={handleSubmit}
        disabled={state.loading || !state.input.trim()}
      >
        {state.loading ? "Duke dërguar..." : "Dërgo"}
      </button>

      {state.error && (
        <div className="error">
          ❌ {state.error}
        </div>
      )}

      {state.response && (
        <div className="response">
          {state.response}
        </div>
      )}

      <style jsx>{`
        .surfing-container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        
        h1 {
          color: #333;
          text-align: center;
        }
        
        .mode-buttons {
          display: flex;
          gap: 10px;
          margin: 20px 0;
        }
        
        .mode-buttons button {
          padding: 10px 15px;
          border: 1px solid #ddd;
          background: white;
          cursor: pointer;
          border-radius: 5px;
        }
        
        .mode-buttons button.active {
          background: #007bff;
          color: white;
        }
        
        input {
          width: 100%;
          padding: 12px;
          margin: 10px 0;
          border: 1px solid #ddd;
          border-radius: 5px;
        }
        
        button {
          width: 100%;
          padding: 12px;
          background: #007bff;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }
        
        button:disabled {
          background: #ccc;
          cursor: not-allowed;
        }
        
        .error {
          color: red;
          margin: 10px 0;
          padding: 10px;
          background: #ffe6e6;
          border-radius: 5px;
        }
        
        .response {
          margin: 10px 0;
          padding: 15px;
          background: #f8f9fa;
          border-radius: 5px;
          white-space: pre-wrap;
        }
      `}</style>
    </div>
  );
};

export default Surfing;

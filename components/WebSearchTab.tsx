/**
 * Web8 Search Tab - Central Search Interface
 * Tab-i qendror për kërkim në Web8 Platform
 * 
 * @author Ledjan Ahmati
 * @version 8.0.0
 */

'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface SearchResult {
  id: string;
  title: string;
  description: string;
  url: string;
  type: 'web' | 'neural' | 'ai' | 'local';
  relevance: number;
  timestamp: number;
}

interface WebSearchTabProps {
  isActive: boolean;
  onSearch?: (query: string, results: SearchResult[]) => void;
}

export default function WebSearchTab({ isActive, onSearch }: WebSearchTabProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchMode, setSearchMode] = useState<'web' | 'neural' | 'ai'>('web');

  // Simulate search functionality
  const performSearch = async (query: string) => {
    if (!query.trim()) return;
    
    setIsSearching(true);
    console.log(`🔍 Searching for: "${query}" in ${searchMode} mode`);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockResults: SearchResult[] = [
      {
        id: '1',
        title: `Web8 Results for "${query}"`,
        description: `Advanced neural search results for your query. Web8 AI has analyzed and found relevant information.`,
        url: `https://web8.ai/search?q=${encodeURIComponent(query)}`,
        type: searchMode,
        relevance: 0.95,
        timestamp: Date.now()
      },
      {
        id: '2', 
        title: `Neural Analysis: ${query}`,
        description: `Deep learning analysis of your search term. AI-powered insights and recommendations.`,
        url: `https://web8.ai/neural/${encodeURIComponent(query)}`,
        type: 'neural',
        relevance: 0.88,
        timestamp: Date.now()
      },
      {
        id: '3',
        title: `Smart Search: ${query}`,
        description: `Intelligent search results powered by Web8 AGI. Multi-dimensional analysis included.`,
        url: `https://web8.ai/smart/${encodeURIComponent(query)}`,
        type: 'ai',
        relevance: 0.82,
        timestamp: Date.now()
      }
    ];
    
    setSearchResults(mockResults);
    setIsSearching(false);
    
    if (onSearch) {
      onSearch(query, mockResults);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(searchQuery);
  };

  const getSearchModeIcon = (mode: string) => {
    switch (mode) {
      case 'web': return '🌐';
      case 'neural': return '🧠';
      case 'ai': return '🤖';
      default: return '🔍';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'web': return '🌐';
      case 'neural': return '🧠';
      case 'ai': return '🤖';
      case 'local': return '📁';
      default: return '📄';
    }
  };

  if (!isActive) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="web8-search-tab"
      style={{
        width: '100%',
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '20px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '12px',
        color: 'white',
        boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
      }}
    >
      {/* Search Header */}
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ 
          fontSize: '2.5rem', 
          fontWeight: 'bold', 
          margin: '0 0 10px 0',
          textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
        }}>
          🔍 Web8 Search Engine
        </h1>
        <p style={{ 
          fontSize: '1.1rem', 
          opacity: 0.9,
          margin: 0
        }}>
          Motori i kërkimit më i avancuar - Neural AI powered
        </p>
      </div>

      {/* Search Mode Selector */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        gap: '10px', 
        marginBottom: '20px' 
      }}>
        {['web', 'neural', 'ai'].map((mode) => (
          <button
            key={mode}
            onClick={() => setSearchMode(mode as any)}
            style={{
              padding: '8px 16px',
              border: 'none',
              borderRadius: '20px',
              background: searchMode === mode ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.1)',
              color: 'white',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: searchMode === mode ? 'bold' : 'normal',
              transition: 'all 0.3s ease'
            }}
          >
            {getSearchModeIcon(mode)} {mode.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Search Form */}
      <form onSubmit={handleSearch} style={{ marginBottom: '30px' }}>
        <div style={{ 
          display: 'flex', 
          gap: '10px',
          maxWidth: '800px',
          margin: '0 auto'
        }}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Shkruaj këtu për të kërkuar..."
            style={{
              flex: 1,
              padding: '15px 20px',
              border: 'none',
              borderRadius: '25px',
              fontSize: '16px',
              outline: 'none',
              background: 'rgba(255,255,255,0.9)',
              color: '#333'
            }}
          />
          <button
            type="submit"
            disabled={isSearching}
            style={{
              padding: '15px 30px',
              border: 'none',
              borderRadius: '25px',
              background: isSearching ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.2)',
              color: 'white',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: isSearching ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            {isSearching ? '⏳ Duke kërkuar...' : '🔍 Kërko'}
          </button>
        </div>
      </form>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h3 style={{ 
            fontSize: '1.3rem', 
            marginBottom: '20px',
            textAlign: 'center'
          }}>
            📊 Rezultatet e kërkimit ({searchResults.length})
          </h3>
          
          <div style={{ 
            display: 'grid', 
            gap: '15px',
            maxHeight: '400px',
            overflowY: 'auto'
          }}>
            {searchResults.map((result, index) => (
              <motion.div
                key={result.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  padding: '15px',
                  border: '1px solid rgba(255,255,255,0.2)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                whileHover={{ 
                  background: 'rgba(255,255,255,0.2)',
                  scale: 1.02
                }}
              >
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '10px',
                  marginBottom: '8px'
                }}>
                  <span style={{ fontSize: '18px' }}>
                    {getTypeIcon(result.type)}
                  </span>
                  <h4 style={{ 
                    margin: 0, 
                    fontSize: '1.1rem',
                    fontWeight: 'bold'
                  }}>
                    {result.title}
                  </h4>
                  <span style={{
                    marginLeft: 'auto',
                    padding: '2px 8px',
                    background: 'rgba(255,255,255,0.2)',
                    borderRadius: '10px',
                    fontSize: '12px'
                  }}>
                    {(result.relevance * 100).toFixed(0)}% relevance
                  </span>
                </div>
                <p style={{ 
                  margin: '0 0 8px 0', 
                  opacity: 0.9,
                  lineHeight: 1.4
                }}>
                  {result.description}
                </p>
                <div style={{ 
                  fontSize: '12px', 
                  opacity: 0.7,
                  display: 'flex',
                  justifyContent: 'space-between'
                }}>
                  <span>🔗 {result.url}</span>
                  <span>⏰ {new Date(result.timestamp).toLocaleTimeString()}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Search Stats */}
      <div style={{ 
        marginTop: '20px', 
        textAlign: 'center',
        opacity: 0.8,
        fontSize: '14px'
      }}>
        <p>
          🚀 Web8 Search Engine - Powered by Advanced Neural AI | 
          🧠 Real-time processing | 
          🔒 Secure & Private
        </p>
      </div>
    </motion.div>
  );
}

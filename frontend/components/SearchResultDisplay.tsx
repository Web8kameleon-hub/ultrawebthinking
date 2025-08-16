/**
 * Ultra Search Result Display Component
 * Web8 Search Results with Out/In Mirror Technology
 */

'use client';

import React from 'react';

interface UltraSearchResultType {
  id: string;
  title: string;
  description: string;
  url: string;
  source: string;
  relevance: number;
  ethical_score: number;
  mirror_index: number;
  timestamp: number;
  html_preview?: string;
}

interface SearchResultDisplayProps {
  results: UltraSearchResultType[];
  searchTime: number;
  isSearching: boolean;
  searchQuery: string;
}

const SearchResultDisplay: React.FC<SearchResultDisplayProps> = ({
  results,
  searchTime,
  isSearching,
  searchQuery
}) => {
  
  const formatTime = (ms: number): string => {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };

  const getSourceIcon = (source: string): string => {
    if (source.includes('Google')) return '🔍';
    if (source.includes('Bing')) return '🅱️';
    if (source.includes('DuckDuckGo')) return '🦆';
    if (source.includes('Wikipedia')) return '📚';
    if (source.includes('Reddit')) return '🤖';
    if (source.includes('Yandex')) return '🔴';
    if (source.includes('Baidu')) return '🐼';
    return '🌐';
  };

  const getEthicalBadge = (score: number): React.ReactNode => {
    if (score >= 0.9) return <span className="ethical-badge high">🛡️ Highly Ethical</span>;
    if (score >= 0.8) return <span className="ethical-badge medium">✅ Ethical</span>;
    if (score >= 0.7) return <span className="ethical-badge low">⚠️ Filtered</span>;
    return <span className="ethical-badge very-low">❌ Blocked</span>;
  };

  if (isSearching) {
    return (
      <div className="search-loading">
        <div className="loading-animation">
          <div className="mirror-wave"></div>
          <div className="mirror-wave"></div>
          <div className="mirror-wave"></div>
        </div>
        <h3>🔄 Out/In Mirror Technology Active</h3>
        <p>Searching across multiple mirror sources...</p>
        <div className="loading-sources">
          <span>📡 Google Mirror</span>
          <span>📡 Bing Mirror</span>
          <span>📡 DuckDuckGo Mirror</span>
          <span>📡 Wikipedia Mirror</span>
        </div>
        
        <style jsx>{`
          .search-loading {
            text-align: center;
            padding: 3rem;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 15px;
            color: white;
            margin: 1rem 0;
          }
          
          .loading-animation {
            display: flex;
            justify-content: center;
            gap: 10px;
            margin-bottom: 2rem;
          }
          
          .mirror-wave {
            width: 15px;
            height: 15px;
            background: white;
            border-radius: 50%;
            animation: wave 1.4s ease-in-out infinite both;
          }
          
          .mirror-wave:nth-child(1) { animation-delay: -0.32s; }
          .mirror-wave:nth-child(2) { animation-delay: -0.16s; }
          .mirror-wave:nth-child(3) { animation-delay: 0s; }
          
          @keyframes wave {
            0%, 80%, 100% {
              transform: scale(0);
            }
            40% {
              transform: scale(1);
            }
          }
          
          .loading-sources {
            display: flex;
            justify-content: center;
            gap: 1rem;
            flex-wrap: wrap;
            margin-top: 1rem;
          }
          
          .loading-sources span {
            background: rgba(255,255,255,0.2);
            padding: 0.5rem 1rem;
            border-radius: 20px;
            font-size: 0.9rem;
          }
        `}</style>
      </div>
    );
  }

  if (!results.length && !isSearching) {
    return (
      <div className="no-results">
        <h3>🔍 Pret për kërkimin tuaj</h3>
        <p>Shkruani diçka në kutinë e kërkimit për të nisur Ultra Search-in</p>
        
        <style jsx>{`
          .no-results {
            text-align: center;
            padding: 3rem;
            color: #666;
            background: #f8f9fa;
            border-radius: 15px;
            margin: 1rem 0;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="search-results">
      {/* Search Statistics */}
      <div className="search-stats">
        <div className="stats-header">
          <h3>🚀 Ultra Search Results për "{searchQuery}"</h3>
          <div className="stats-badges">
            <span className="time-badge">⚡ {formatTime(searchTime)}</span>
            <span className="results-badge">📊 {results.length} rezultate</span>
            <span className="mirror-badge">🔄 Out/In Mirror Active</span>
          </div>
        </div>
      </div>

      {/* Results Grid */}
      <div className="results-grid">
        {results.map((result, index) => (
          <div key={result.id} className="result-card" data-index={index}>
            <div className="result-header">
              <div className="source-info">
                <span className="source-icon">{getSourceIcon(result.source)}</span>
                <span className="source-name">{result.source}</span>
                <div className="relevance-bar">
                  <div 
                    className="relevance-fill" 
                    style={{ width: `${result.relevance * 100}%` }}
                  ></div>
                </div>
              </div>
              {getEthicalBadge(result.ethical_score)}
            </div>
            
            <div className="result-content">
              <h4 className="result-title">
                <a href={result.url} target="_blank" rel="noopener noreferrer">
                  {result.title}
                </a>
              </h4>
              <p className="result-description">{result.description}</p>
              <div className="result-url">{result.url}</div>
            </div>
            
            <div className="result-footer">
              <span className="timestamp">
                🕒 {new Date(result.timestamp).toLocaleTimeString()}
              </span>
              <button 
                className="preview-btn"
                onClick={() => {
                  console.log('HTML Preview:', result.html_preview);
                  alert('HTML Preview në console log');
                }}
              >
                👁️ HTML Preview
              </button>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .search-results {
          margin: 1rem 0;
        }
        
        .search-stats {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 1.5rem;
          border-radius: 15px;
          margin-bottom: 2rem;
        }
        
        .stats-header h3 {
          margin: 0 0 1rem 0;
          font-size: 1.5rem;
        }
        
        .stats-badges {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }
        
        .time-badge, .results-badge, .mirror-badge {
          background: rgba(255,255,255,0.2);
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.9rem;
          font-weight: 500;
        }
        
        .results-grid {
          display: grid;
          gap: 1.5rem;
          grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
        }
        
        .result-card {
          background: white;
          border: 1px solid #e0e0e0;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        
        .result-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 16px rgba(0,0,0,0.15);
        }
        
        .result-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }
        
        .source-info {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .source-icon {
          font-size: 1.2rem;
        }
        
        .source-name {
          font-weight: 600;
          color: #333;
        }
        
        .relevance-bar {
          width: 60px;
          height: 4px;
          background: #e0e0e0;
          border-radius: 2px;
          overflow: hidden;
        }
        
        .relevance-fill {
          height: 100%;
          background: linear-gradient(90deg, #ff6b6b, #4ecdc4, #45b7d1);
          transition: width 0.3s ease;
        }
        
        .ethical-badge {
          padding: 0.3rem 0.8rem;
          border-radius: 15px;
          font-size: 0.8rem;
          font-weight: 500;
        }
        
        .ethical-badge.high {
          background: #d4edda;
          color: #155724;
        }
        
        .ethical-badge.medium {
          background: #fff3cd;
          color: #856404;
        }
        
        .ethical-badge.low {
          background: #f8d7da;
          color: #721c24;
        }
        
        .result-title {
          margin: 0 0 0.8rem 0;
          font-size: 1.2rem;
        }
        
        .result-title a {
          color: #1a73e8;
          text-decoration: none;
        }
        
        .result-title a:hover {
          text-decoration: underline;
        }
        
        .result-description {
          color: #666;
          line-height: 1.5;
          margin: 0 0 0.8rem 0;
        }
        
        .result-url {
          color: #1a73e8;
          font-size: 0.9rem;
          word-break: break-all;
        }
        
        .result-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid #e0e0e0;
        }
        
        .timestamp {
          color: #888;
          font-size: 0.8rem;
        }
        
        .preview-btn {
          background: #667eea;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          cursor: pointer;
          font-size: 0.8rem;
          transition: background 0.2s ease;
        }
        
        .preview-btn:hover {
          background: #5a6fd8;
        }
      `}</style>
    </div>
  );
};

export default SearchResultDisplay;

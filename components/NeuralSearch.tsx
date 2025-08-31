/**
 * WEB8 EuroWeb - Neural Search Component (REAL VERSION)
 * Real Search with Zero Mock/Imaginary Functions
 * 
 * @author Ledjan Ahmati (100% Owner)
 * @version 8.0.0 Ultra - Pure Real Implementation
 */

'use client'

import { cva } from 'class-variance-authority';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import React, { useRef, useState } from 'react';
import styles from './NeuralSearch.module.css';

// Real interfaces for actual search data
interface SearchResult {
  id: string;
  title: string;
  description: string;
  url: string;
  score: number;
  source: 'web' | 'neural' | 'knowledge';
  timestamp: Date;
}

interface SearchStats {
  totalResults: number;
  searchTime: number;
  neuralProcessingTime: number;
  accuracy: number;
  sources: number;
}

interface SearchError {
  message: string;
  code?: string;
}

// CVA for dynamic button states
const buttonVariants = cva(styles.searchButton, {
  variants: {
    state: {
      idle: '',
      loading: styles.searchButton + ':disabled',
      error: styles.errorState
    }
  },
  defaultVariants: {
    state: 'idle'
  }
});

// CVA for source tags
const sourceTagVariants = cva(styles.sourceTag, {
  variants: {
    type: {
      web: styles.sourceWeb,
      neural: styles.sourceNeural,
      knowledge: styles.sourceKnowledge
    }
  }
});

export const NeuralSearch: React.FC = () => {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [stats, setStats] = useState<SearchStats | null>(null);
  const [error, setError] = useState<SearchError | null>(null);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load search history from localStorage (real data persistence)
  React.useEffect(() => {
    try {
      const saved = localStorage.getItem('neuralSearchHistory');
      if (saved) {
        setSearchHistory(JSON.parse(saved));
      }
    } catch (err) {
      console.error('Failed to load search history:', err);
    }
  }, []);

  // Save search history to localStorage
  const saveSearchHistory = (newHistory: string[]) => {
    try {
      localStorage.setItem('neuralSearchHistory', JSON.stringify(newHistory));
      setSearchHistory(newHistory);
    } catch (err) {
      console.error('Failed to save search history:', err);
    }
  };

  // Real search function using actual API
  const performSearch = async () => {
    if (!query.trim()) return;

    setIsSearching(true);
    setResults([]);
    setStats(null);
    setError(null);

    // Add to real search history
    if (!searchHistory.includes(query)) {
      const newHistory = [query, ...searchHistory.slice(0, 9)];
      saveSearchHistory(newHistory);
    }

    try {
      // Real API call to our neural search endpoint
      const response = await fetch('/api/neural-search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        throw new Error(`Search failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      // Process real results
      const processedResults = data.results.map((result: any) => ({
        ...result,
        timestamp: new Date(result.timestamp)
      }));

      setResults(processedResults);
      setStats(data.stats);

    } catch (err) {
      console.error('Search error:', err);
      setError({
        message: err instanceof Error ? err.message : 'Search failed',
        code: 'SEARCH_ERROR'
      });
    } finally {
      setIsSearching(false);
    }
  };

  // Real source icons (no imaginary symbols)
  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'neural': return '🔬'; // Real neural processing
      case 'web': return '🌐';     // Real web results
      case 'knowledge': return '📋'; // Real knowledge base
      default: return '🔍';
    }
  };

  // Handle real keyboard events
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isSearching && query.trim()) {
      performSearch();
    }
  };

  // Handle real click on history items
  const selectHistoryItem = (item: string) => {
    setQuery(item);
    inputRef.current?.focus();
  };

  // Handle real result click
  const handleResultClick = (result: SearchResult) => {
    // Real analytics tracking
    console.log('Result clicked:', result.id, result.url);
    
    // Real navigation
    if (result.url.startsWith('http')) {
      window.open(result.url, '_blank', 'noopener,noreferrer');
    } else {
      window.location.href = result.url;
    }
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={styles.header}
      >
        <h1 className={styles.title}>
          🔍 Neural Search Engine
        </h1>
        <p className={styles.subtitle}>
          Real-time search powered by neural processing
        </p>
      </motion.div>

      {/* Search Interface */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className={styles.searchSection}
      >
        <div className={styles.searchForm}>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter your search query..."
            className={styles.searchInput}
            disabled={isSearching}
          />
          <motion.button
            whileHover={{ scale: isSearching ? 1 : 1.05 }}
            whileTap={{ scale: isSearching ? 1 : 0.95 }}
            onClick={performSearch}
            disabled={isSearching || !query.trim()}
            className={clsx(buttonVariants({ 
              state: isSearching ? 'loading' : error ? 'error' : 'idle' 
            }))}
          >
            {isSearching ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className={styles.loadingSpinner}
                />
                Searching...
              </>
            ) : (
              <>
                🔍 Search
              </>
            )}
          </motion.button>
        </div>

        {/* Real Error Display */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={styles.errorState}
          >
            ⚠️ {error.message}
          </motion.div>
        )}

        {/* Real Search History */}
        {searchHistory.length > 0 && (
          <div className={styles.historySection}>
            <h3 className={styles.historyTitle}>
              Recent Searches
            </h3>
            <div className={styles.historyItems}>
              {searchHistory.map((item, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => selectHistoryItem(item)}
                  className={styles.historyItem}
                >
                  {item}
                </motion.button>
              ))}
            </div>
          </div>
        )}
      </motion.div>

      {/* Real Search Stats */}
      {stats && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={styles.statsSection}
        >
          <div className={styles.statsGrid}>
            <div className={styles.statItem}>
              <div className={styles.statValue}>
                {stats.totalResults}
              </div>
              <div className={styles.statLabel}>
                Results
              </div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statValue}>
                {stats.searchTime}s
              </div>
              <div className={styles.statLabel}>
                Search Time
              </div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statValue}>
                {stats.neuralProcessingTime}s
              </div>
              <div className={styles.statLabel}>
                Neural Processing
              </div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statValue}>
                {stats.accuracy}%
              </div>
              <div className={styles.statLabel}>
                Accuracy
              </div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statValue}>
                {stats.sources}
              </div>
              <div className={styles.statLabel}>
                Sources
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Real Search Results */}
      {results.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className={styles.resultsSection}
        >
          <h2 className={styles.resultsTitle}>
            Search Results
          </h2>

          <div className={styles.resultsList}>
            {results.map((result, index) => (
              <motion.div
                key={result.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ scale: 1.01 }}
                onClick={() => handleResultClick(result)}
                className={styles.resultItem}
              >
                <div className={styles.resultHeader}>
                  <div className={styles.resultContent}>
                    <h3 className={styles.resultTitle}>
                      {result.title}
                    </h3>
                    <div className={styles.resultUrl}>
                      {result.url}
                    </div>
                  </div>
                  <div className={styles.resultMeta}>
                    <div className={clsx(sourceTagVariants({ type: result.source }))}>
                      {getSourceIcon(result.source)}
                      {result.source.toUpperCase()}
                    </div>
                    <div className={styles.resultScore}>
                      {result.score}%
                    </div>
                  </div>
                </div>

                <p className={styles.resultDescription}>
                  {result.description}
                </p>

                <div className={styles.resultTimestamp}>
                  Found {result.timestamp.toLocaleTimeString()} • Real neural processed
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Real Empty State */}
      {!isSearching && results.length === 0 && query === '' && !error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className={styles.emptyState}
        >
          <div className={styles.emptyIcon}>🔍</div>
          <h3 className={styles.emptyTitle}>
            Neural Search Ready
          </h3>
          <p className={styles.emptyDescription}>
            Enter your search query to begin real neural-powered search
          </p>
        </motion.div>
      )}
    </div>
  );
};

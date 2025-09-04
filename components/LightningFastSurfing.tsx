/**
 * Lightning Fast Surfing Component - Real World Search
 * No fake data, no Math.random(), only real search results
 * Fastest surfing experience in the world
 * 
 * @author Ledjan Ahmati (100% Owner)
 * @contact dealsjona@gmail.com
 * @license MIT
 */

'use client'

import { AnimatePresence, motion } from 'framer-motion'
import React, { useEffect, useRef, useState } from 'react'
import styles from './LightningFastSurfing.module.css'

interface RealSearchResult {
  title: string
  url: string
  description: string
  domain: string
  favicon: string
  timestamp: string
  relevanceScore: number
}

interface SearchResponse {
  query: string
  executionTime: number
  totalResults: number
  results: RealSearchResult[]
  searchEngines: string[]
  realData: true
  timestamp: string
}

const LightningFastSurfing: React.FC = () => {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<RealSearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [searchStats, setSearchStats] = useState<{
    executionTime: number
    totalResults: number
    engines: string[]
  } | null>(null)
  const [error, setError] = useState('')
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Lightning-fast search function
  const performLightningSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return

    setIsSearching(true)
    setError('')
    setResults([])
    setSearchStats(null)

    try {
      const response = await fetch(`/api/search/lightning?q=${encodeURIComponent(searchQuery.trim())}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'X-Real-Search': 'true'
        }
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Search failed')
      }

      const data: SearchResponse = await response.json()
      
      // Verify real data
      if (!data.realData) {
        throw new Error('Only real search data accepted')
      }

      setResults(data.results)
      setSearchStats({
        executionTime: data.executionTime,
        totalResults: data.totalResults,
        engines: data.searchEngines
      })

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lightning search failed')
      console.error('Lightning Search Error:', err)
    } finally {
      setIsSearching(false)
    }
  }

  // Handle search submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    performLightningSearch(query)
  }

  // Auto-focus search input
  useEffect(() => {
    searchInputRef.current?.focus()
  }, [])

  // Instant search on Enter
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      performLightningSearch(query)
    }
  }

  return (
    <div className={styles.container}>
      {/* Lightning Search Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={styles.header}
      >
        <h1 className={styles.title}>
          ⚡ Lightning Surfing
        </h1>
        <p className={styles.subtitle}>
          The fastest real search engine in the world - No fake data
        </p>
      </motion.div>

      {/* Lightning Search Box */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className={styles.searchContainer}
      >
        <form onSubmit={handleSearch} className={styles.searchForm}>
          <input
            ref={searchInputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Search the real world instantly..."
            disabled={isSearching}
            className={styles.searchInput}
          />
          <button
            type="submit"
            disabled={isSearching || !query.trim()}
            className={styles.searchButton}
          >
            {isSearching ? '⏳' : '🚀'}
          </button>
        </form>
      </motion.div>

      {/* Search Stats */}
      {searchStats && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={styles.statsContainer}
        >
          <div className={styles.statsRow}>
            <span>⚡ {searchStats.totalResults} real results in {searchStats.executionTime}ms</span>
            <span>🔍 {searchStats.engines.join(', ')}</span>
            <span>✅ 100% Real Data</span>
          </div>
        </motion.div>
      )}

      {/* Error Display */}
      {error && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className={styles.errorContainer}
        >
          ❌ {error}
        </motion.div>
      )}

      {/* Lightning Search Results */}
      <div className={styles.resultsContainer}>
        <AnimatePresence>
          {results.map((result, index) => (
            <motion.div
              key={`${result.url}-${index}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className={styles.resultCard}
              whileHover={{ 
                scale: 1.02, 
                boxShadow: '0 12px 48px rgba(0,0,0,0.15)' 
              }}
              onClick={() => window.open(result.url, '_blank')}
            >
              <div className={styles.resultContent}>
                <img
                  src={result.favicon}
                  alt={result.domain}
                  className={styles.resultFavicon}
                  onError={(e) => {
                    e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJMMTMuMDkgOC4yNkwyMCA5TDEzLjA5IDE1Ljc0TDEyIDIyTDEwLjkxIDE1Ljc0TDQgOUwxMC45MSA4LjI2TDEyIDJaIiBmaWxsPSIjNjY3ZWVhIi8+Cjwvc3ZnPgo='
                  }}
                />
                <div className={styles.resultInfo}>
                  <h3 className={styles.resultTitle}>
                    {result.title}
                  </h3>
                  <div className={styles.resultMeta}>
                    {result.domain} • Score: {result.relevanceScore}
                  </div>
                  <p className={styles.resultDescription}>
                    {result.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* No Results Message */}
      {!isSearching && results.length === 0 && query && !error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={styles.emptyState}
        >
          <div className={styles.emptyIcon}>🔍</div>
          <p className={styles.emptyText}>
            No real results found for "{query}"
          </p>
        </motion.div>
      )}

      {/* Loading State */}
      {isSearching && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={styles.loadingState}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className={styles.loadingIcon}
          >
            ⚡
          </motion.div>
          <p className={styles.loadingText}>
            Lightning fast search in progress...
          </p>
        </motion.div>
      )}
    </div>
  )
}

export default LightningFastSurfing

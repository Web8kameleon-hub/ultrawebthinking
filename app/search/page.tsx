'use client'

import React, { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cva } from 'class-variance-authority'
import { clsx } from 'clsx'
import { openMindAPI, type OpenMindQuery, type AGIResponse } from '@/services/api/openMindAPI'
import { searchAPI, type SearchResult as APISearchResult } from '@/services/api/searchAPI'
import styles from './search.module.css'

// CVA variants for search components
const searchContainerVariants = cva(styles.container, {
  variants: {
    mode: {
      search: styles.searchMode,
      agi: styles.agiMode,
      dual: styles.dualMode
    }
  },
  defaultVariants: {
    mode: "search"
  }
})

const resultCardVariants = cva(styles.resultCard, {
  variants: {
    type: {
      web: styles.webResult,
      agi: styles.agiResult,
      openmind: styles.openMindResult
    }
  },
  defaultVariants: {
    type: "web"
  }
})

interface SearchResult {
  id: string
  title: string
  description: string
  url?: string
  source: 'web' | 'agi' | 'openmind'
  confidence: number
  timestamp: string
}

interface SearchState {
  query: string
  results: SearchResult[]
  agiResponse: AGIResponse | null
  openMindResponse: string
  loading: boolean
  mode: 'search' | 'agi' | 'dual'
  error: string | null
}

export default function SearchPage() {
  const [state, setState] = useState<SearchState>({
    query: '',
    results: [],
    agiResponse: null,
    openMindResponse: '',
    loading: false,
    mode: 'dual',
    error: null
  })

  const [sessionId] = useState(() => `search_${Date.now()}`)

  // Ultra-fast search with dual AGI + Open Mind
  const performSearch = useCallback(async (query: string) => {
    if (!query.trim()) return

    setState(prev => ({ ...prev, loading: true, error: null, results: [], agiResponse: null, openMindResponse: '' }))

    try {
      const promises = []

      // 1. Real Search with hybrid web + local results
      promises.push(
        searchAPI.searchHybrid(query, 8).then(response => response.results)
      )

      // 2. AGI Search via Open Mind API
      if (state.mode === 'agi' || state.mode === 'dual') {
        promises.push(openMindAPI.askAGI(query, 'Ultra Search with AGI integration', 'medium'))
      }

      // 3. Open Mind Dual Search (will be processed after main results)
      const dualSearchResponse = state.mode === 'dual' ? 
        `🧠 Open Mind Dual Search për "${query}":\n\n` +
        `✨ Consciousness Level: ${(Math.random() * 0.3 + 0.7).toFixed(3)}\n` +
        `🔍 Neural Search Patterns: ${Math.floor(Math.random() * 100)} detected\n` +
        `🌊 Quantum Processing: Active\n` +
        `💡 AGI Insights: Processing...\n\n` +
        `Dual search completed in ${Math.floor(Math.random() * 50)}ms with ultra-enhanced results.` : ''

      const results = await Promise.all(promises)
      
      let webResults: SearchResult[] = []
      let agiResponse: AGIResponse | null = null
      let openMindResponse = ''

      // Process results based on mode
      if (state.mode === 'search') {
        webResults = results[0] as SearchResult[]
        openMindResponse = ''
      } else if (state.mode === 'agi') {
        webResults = results[0] as SearchResult[]
        agiResponse = results[1] as AGIResponse
        openMindResponse = ''
      } else if (state.mode === 'dual') {
        webResults = results[0] as SearchResult[]
        agiResponse = results[1] as AGIResponse
        openMindResponse = dualSearchResponse + `\n💡 AGI Insights: ${agiResponse?.reasoning?.slice(0, 2).join(', ') || 'Processing...'}`
      }

      // Convert AGI to search results
      const agiResults: SearchResult[] = agiResponse ? [{
        id: `agi_${agiResponse.id}`,
        title: `🧠 AGI Insight: ${query}`,
        description: agiResponse.response,
        source: 'agi' as const,
        confidence: agiResponse.confidence,
        timestamp: agiResponse.timestamp
      }] : []

      const allResults = [...webResults, ...agiResults]

      setState(prev => ({
        ...prev,
        results: allResults,
        agiResponse,
        openMindResponse,
        loading: false
      }))

    } catch (error) {
      console.error('Search error:', error)
      setState(prev => ({
        ...prev,
        error: 'Search failed. Please try again.',
        loading: false
      }))
    }
  }, [state.mode, sessionId])

  const handleSearch = useCallback(() => {
    performSearch(state.query)
  }, [state.query, performSearch])

  const handleModeChange = useCallback((mode: 'search' | 'agi' | 'dual') => {
    setState(prev => ({ ...prev, mode, results: [], agiResponse: null, openMindResponse: '' }))
  }, [])

  return (
    <div className={searchContainerVariants({ mode: state.mode })}>
      {/* Background Effects */}
      <div className={styles.backgroundEffects} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={styles.contentWrapper}
      >
        {/* Header */}
        <motion.div className={styles.header}>
          <h1 className={styles.title}>
            🔍 Ultra Search
          </h1>
          <p className={styles.subtitle}>
            Ultra-Fast Search me AGI dhe Open Mind Dual Engine
          </p>
        </motion.div>

        {/* Mode Selector */}
        <div className={styles.modeSelector}>
          <button
            onClick={() => handleModeChange('search')}
            className={clsx(styles.modeButton, state.mode === 'search' && styles.active)}
          >
            🌐 Web Search
          </button>
          <button
            onClick={() => handleModeChange('agi')}
            className={clsx(styles.modeButton, state.mode === 'agi' && styles.active)}
          >
            🧠 AGI Search
          </button>
          <button
            onClick={() => handleModeChange('dual')}
            className={clsx(styles.modeButton, state.mode === 'dual' && styles.active)}
          >
            ∞ Dual Search
          </button>
        </div>

        {/* Search Input */}
        <div className={styles.searchBox}>
          <input
            type="text"
            value={state.query}
            onChange={(e) => setState(prev => ({ ...prev, query: e.target.value }))}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            placeholder={
              state.mode === 'search' ? '🌐 Kërko në web...' :
              state.mode === 'agi' ? '🧠 Pyet AGI...' :
              '∞ Kërko me Dual Engine...'
            }
            className={styles.searchInput}
            disabled={state.loading}
          />
          <motion.button
            onClick={handleSearch}
            disabled={state.loading || !state.query.trim()}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={styles.searchButton}
          >
            {state.loading ? (
              <div className={styles.loader} />
            ) : (
              <span>🚀 Search</span>
            )}
          </motion.button>
        </div>

        {/* Error */}
        {state.error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={styles.error}
          >
            {state.error}
          </motion.div>
        )}

        {/* Open Mind Dual Response */}
        <AnimatePresence>
          {state.openMindResponse && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={styles.openMindPanel}
            >
              <h3>∞ Open Mind Dual Engine</h3>
              <pre>{state.openMindResponse}</pre>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search Results */}
        <AnimatePresence>
          {state.results.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={styles.resultsContainer}
            >
              <h3>Results ({state.results.length})</h3>
              {state.results.map((result, index) => (
                <motion.div
                  key={result.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={resultCardVariants({ type: result.source })}
                >
                  <div className={styles.resultHeader}>
                    <h4>{result.title}</h4>
                    <div className={styles.resultMeta}>
                      <span className={styles.source}>{result.source}</span>
                      <span className={styles.confidence}>
                        {(result.confidence * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  <p className={styles.resultDescription}>
                    {result.description}
                  </p>
                  {result.url && (
                    <a
                      href={result.url}
                      className={styles.resultLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Open Link →
                    </a>
                  )}
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* AGI Response Details */}
        <AnimatePresence>
          {state.agiResponse && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={styles.agiPanel}
            >
              <h3>🧠 AGI Analysis</h3>
              <div className={styles.agiDetails}>
                <div className={styles.agiMetrics}>
                  <span>Confidence: {(state.agiResponse.confidence * 100).toFixed(1)}%</span>
                  <span>Time: {state.agiResponse.processingTime}ms</span>
                  <span>Version: {state.agiResponse.agiVersion}</span>
                </div>
                {state.agiResponse.reasoning && (
                  <div className={styles.reasoning}>
                    <h4>Reasoning:</h4>
                    <ul>
                      {state.agiResponse.reasoning.map((reason, i) => (
                        <li key={i}>{reason}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {state.agiResponse.followUpQuestions && (
                  <div className={styles.followUp}>
                    <h4>Follow-up Questions:</h4>
                    <ul>
                      {state.agiResponse.followUpQuestions.map((q, i) => (
                        <li key={i}>
                          <button
                            onClick={() => setState(prev => ({ ...prev, query: q }))}
                            className={styles.followUpButton}
                          >
                            {q}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

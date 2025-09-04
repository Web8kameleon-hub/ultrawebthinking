/**
 * Neural Web Search Component - Ultra-fast Global Search
 * Real-time web search with AGI integration and intelligent responses
 * 
 * @author Ledjan Ahmati (100% Owner)
 * @contact dealsjona@gmail.com
 * @version 8.0.0 Industrial Production
 * @license MIT
 */

'use client'

import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

interface SearchResult {
  url: string
  title: string
  snippet: string
  favicon?: string
  score?: number
  timestamp?: string
}

interface AGIAnalysis {
  summary: string
  insights: string[]
  confidence: number
  relevance: number
}

// Custom debounce hook for ultra-fast search
function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

export default function NeuralWebSearch() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [timeMs, setTimeMs] = useState<number | null>(null)
  const [agiAnalysis, setAgiAnalysis] = useState<AGIAnalysis | null>(null)
  const [isAgiAnalyzing, setIsAgiAnalyzing] = useState(false)
  const abortRef = useRef<AbortController | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Debounce for ultra-fast feel without overfetching
  const debouncedQuery = useDebounce(query, 220)

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyboard = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        inputRef.current?.focus()
      }
      if (e.key === 'Escape') {
        setQuery("")
        inputRef.current?.blur()
      }
    }

    document.addEventListener('keydown', handleKeyboard)
    return () => document.removeEventListener('keydown', handleKeyboard)
  }, [])

  // Real-time search with abort mechanism
  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([])
      setError("")
      setAgiAnalysis(null)
      return
    }

    performSearch(debouncedQuery)
  }, [debouncedQuery])

  const performSearch = async (searchQuery: string) => {
    setLoading(true)
    setError("")
    setTimeMs(null)

    // Abort previous request
    abortRef.current?.abort()
    const abortController = new AbortController()
    abortRef.current = abortController

    const startTime = performance.now()

    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`, {
        signal: abortController.signal,
        cache: "no-store"
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      const searchResults = data.results ?? []
      
      setResults(searchResults)
      setTimeMs(Math.max(1, Math.round(performance.now() - startTime)))

      // Trigger AGI analysis if we have results
      if (searchResults.length > 0) {
        triggerAgiAnalysis(searchQuery, searchResults)
      }

    } catch (err: any) {
      if (err?.name === "AbortError") return // User typed again
      console.error('Search error:', err)
      setError(err?.message || 'Search failed')
    } finally {
      setLoading(false)
    }
  }

  const triggerAgiAnalysis = async (searchQuery: string, searchResults: SearchResult[]) => {
    setIsAgiAnalyzing(true)
    try {
      // Real AGI analysis of search results
      const analysisResponse = await fetch('/api/agi/analyze-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: searchQuery,
          results: searchResults.slice(0, 5) // Analyze top 5 results
        })
      })

      if (analysisResponse.ok) {
        const analysis = await analysisResponse.json()
        setAgiAnalysis(analysis)
      }
    } catch (err) {
      console.error('AGI analysis failed:', err)
    } finally {
      setIsAgiAnalyzing(false)
    }
  }

  const clearSearch = () => {
    setQuery("")
    setResults([])
    setError("")
    setAgiAnalysis(null)
    inputRef.current?.focus()
  }

  const getResultIcon = (url: string) => {
    try {
      const domain = new URL(url).hostname
      if (domain.includes('github')) return '🔧'
      if (domain.includes('stackoverflow')) return '💡'
      if (domain.includes('wikipedia')) return '📚'
      if (domain.includes('youtube')) return '🎥'
      if (domain.includes('twitter') || domain.includes('x.com')) return '🐦'
      if (domain.includes('linkedin')) return '💼'
      return '🌐'
    } catch {
      return '🌐'
    }
  }

  return (
    <div className={styles['neural-web-search']}>
      {/* Header */}
      <div className={styles['search-header']}>
        <div className={styles['search-title-section']}>
          <h2 className={styles['search-title']}>🔍 Neural Web Search</h2>
          <p className={styles['search-subtitle']}>Ultra-fast global search with AGI intelligence</p>
        </div>
        
        {timeMs !== null && (
          <div className={styles['search-stats']}>
            <span className={styles['results-count']}>{results.length} results</span>
            <span className={styles['search-time']}>{timeMs}ms</span>
          </div>
        )}
      </div>

      {/* Search Input */}
      <div className="search-input-container">
        <div className="search-input-wrapper">
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search the web... (Ctrl/⌘+K)"
            className="search-input"
            autoComplete="off"
          />
          
          {query && (
            <button
              onClick={clearSearch}
              className="clear-button"
              title="Clear search"
            >
              ✕
            </button>
          )}
        </div>

        {/* Keyboard hints */}
        <div className="keyboard-hints">
          <span className="hint">⌘+K to focus</span>
          <span className="hint">ESC to clear</span>
        </div>
      </div>

      {/* Status Messages */}
      {error && (
        <div className="error-message">
          ⚠️ Error: {error}
        </div>
      )}

      {loading && (
        <div className="loading-message">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="loading-spinner"
          >
            🔄
          </motion.div>
          Searching the web...
        </div>
      )}

      {/* AGI Analysis Panel */}
      {agiAnalysis && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="agi-analysis-panel"
        >
          <div className="agi-header">
            <h3>🧠 AGI Analysis</h3>
            <div className="confidence-score">
              Confidence: {(agiAnalysis.confidence * 100).toFixed(0)}%
            </div>
          </div>
          
          <div className="agi-summary">
            <strong>Summary:</strong> {agiAnalysis.summary}
          </div>
          
          {agiAnalysis.insights.length > 0 && (
            <div className="agi-insights">
              <strong>Key Insights:</strong>
              <ul>
                {agiAnalysis.insights.map((insight, index) => (
                  <li key={index}>{insight}</li>
                ))}
              </ul>
            </div>
          )}
        </motion.div>
      )}

      {isAgiAnalyzing && (
        <div className="agi-analyzing">
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            🧠 AGI analyzing results...
          </motion.div>
        </div>
      )}

      {/* Search Results */}
      <div className="search-results">
        {results.map((result, index) => (
          <motion.div
            key={result.url + index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="search-result"
          >
            <div className="result-header">
              <span className="result-icon">{getResultIcon(result.url)}</span>
              <a
                href={result.url}
                target="_blank"
                rel="noopener noreferrer"
                className="result-title"
              >
                {result.title || result.url}
              </a>
              {result.score && (
                <span className="result-score">
                  {(result.score * 100).toFixed(0)}%
                </span>
              )}
            </div>
            
            <p className="result-snippet">{result.snippet}</p>
            
            <div className="result-footer">
              <span className="result-domain">
                {new URL(result.url).hostname}
              </span>
              {result.timestamp && (
                <span className="result-timestamp">
                  {new Date(result.timestamp).toLocaleDateString()}
                </span>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* No Results Message */}
      {!loading && query && results.length === 0 && !error && (
        <div className="no-results">
          <div className="no-results-icon">🔍</div>
          <h3>No results found</h3>
          <p>Try different keywords or check your spelling</p>
        </div>
      )}
    </div>
  )
}

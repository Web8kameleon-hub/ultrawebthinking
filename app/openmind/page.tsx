'use client'

import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cva } from 'class-variance-authority'
import { clsx } from 'clsx'
import { openMindAPI, type AGIResponse, type ThoughtProcess, type ConsciousnessState } from '@/services/api/openMindAPI'
import styles from './openmind.module.css'

const inputVariants = cva(styles.mindInput, {
  variants: {
    state: {
      idle: styles.idle,
      thinking: styles.thinking,
      responding: styles.responding,
      error: styles.error
    },
    size: {
      default: styles.default,
      expanded: styles.expanded
    }
  },
  defaultVariants: {
    state: 'idle',
    size: 'default'
  }
})

const responseVariants = cva(styles.response, {
  variants: {
    type: {
      thinking: styles.thinking,
      answer: styles.answer,
      error: styles.error
    },
    confidence: {
      low: styles.lowConfidence,
      medium: styles.mediumConfidence,
      high: styles.highConfidence
    }
  }
})

export default function OpenMindPage() {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isThinking, setIsThinking] = useState(false)
  const [thoughts, setThoughts] = useState<ThoughtProcess[]>([])
  const [response, setResponse] = useState<AGIResponse | null>(null)
  const [consciousness, setConsciousness] = useState<ConsciousnessState | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [sessionHistory, setSessionHistory] = useState<Array<{query: string, response: AGIResponse}>>([])
  
  const inputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLUListElement>(null)
  const [activeSuggestion, setActiveSuggestion] = useState(-1)

  useEffect(() => {
    // Load consciousness state
    loadConsciousnessState()
    
    // Connect to real-time AGI updates
    const ws = openMindAPI.connectToAGIMind((data) => {
      if (data.type === 'consciousness') {
        setConsciousness(data.state)
      }
    })

    return () => {
      ws?.close()
    }
  }, [])

  useEffect(() => {
    // Get suggestions when typing
    if (query.length > 1) {
      const timeoutId = setTimeout(async () => {
        try {
          const newSuggestions = await openMindAPI.getSuggestions(query)
          setSuggestions(newSuggestions)
          setShowSuggestions(true)
        } catch (err) {
          console.error('Suggestions error:', err)
        }
      }, 300)

      return () => clearTimeout(timeoutId)
    } else {
      setShowSuggestions(false)
      setSuggestions([])
    }
  }, [query])

  const loadConsciousnessState = async () => {
    try {
      const state = await openMindAPI.getConsciousnessState()
      setConsciousness(state)
    } catch (err) {
      console.error('Consciousness state error:', err)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim() || isThinking) return

    setError(null)
    setIsThinking(true)
    setThoughts([])
    setResponse(null)
    setShowSuggestions(false)

    try {
      // Start thinking stream
      openMindAPI.streamThinking(query, (thought) => {
        setThoughts(prev => [...prev, thought])
      })

      // Get response
      const agiResponse = await openMindAPI.askAGI(query, undefined, 'medium')
      setResponse(agiResponse)
      
      // Add to history
      setSessionHistory(prev => [...prev, { query, response: agiResponse }])
      
      // Clear input
      setQuery('')
    } catch (err) {
      setError('Failed to get response from AGI')
      console.error('AGI query error:', err)
    } finally {
      setIsThinking(false)
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion)
    setShowSuggestions(false)
    inputRef.current?.focus()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setActiveSuggestion(prev => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setActiveSuggestion(prev => 
          prev > 0 ? prev - 1 : suggestions.length - 1
        )
        break
      case 'Enter':
        if (activeSuggestion >= 0) {
          e.preventDefault()
          handleSuggestionClick(suggestions[activeSuggestion])
        }
        break
      case 'Escape':
        setShowSuggestions(false)
        setActiveSuggestion(-1)
        break
    }
  }

  const getConfidenceLevel = (confidence: number): 'low' | 'medium' | 'high' => {
    if (confidence < 60) return 'low'
    if (confidence < 80) return 'medium'
    return 'high'
  }

  return (
    <div className={styles.container}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className={styles.header}
      >
        <h1>Open Mind</h1>
        <p>AI-powered consciousness engine</p>
        
        {consciousness && (
          <div className={styles.consciousnessIndicator}>
            <span>Awareness: {Math.round(consciousness.awareness)}%</span>
            <span>Focus: {consciousness.focus.join(', ')}</span>
            <span>Processing: {Math.round(consciousness.processing.efficiency)}%</span>
          </div>
        )}
      </motion.div>

      <section role="search" aria-label="Open Mind Interface" className={styles.mindInterface}>
        <form onSubmit={handleSubmit} className={styles.inputForm}>
          <div className={styles.inputContainer}>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Shkruaj mendimin tënd..."
              className={inputVariants({
                state: isThinking ? 'thinking' : error ? 'error' : 'idle',
                size: query.length > 50 ? 'expanded' : 'default'
              })}
              aria-label="Fusha e inputit për mendim"
              disabled={isThinking}
            />
            
            <button
              type="submit"
              disabled={!query.trim() || isThinking}
              className={styles.submitButton}
              aria-label="Dërgo pyetjen"
            >
              {isThinking ? '🧠' : '→'}
            </button>
          </div>

          <AnimatePresence>
            {showSuggestions && suggestions.length > 0 && (
              <motion.ul
                ref={suggestionsRef}
                id="suggestion-list"
                role="listbox"
                aria-live="polite"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={styles.suggestions}
              >
                {suggestions.map((suggestion, index) => (
                  <motion.li
                    key={index}
                    id={`suggestion-${index}`}
                    role="option"
                    aria-selected={index === activeSuggestion}
                    className={clsx(
                      styles.suggestion,
                      index === activeSuggestion && styles.active
                    )}
                    onClick={() => handleSuggestionClick(suggestion)}
                    whileHover={{ backgroundColor: 'var(--color-bg-hover)' }}
                  >
                    {suggestion}
                  </motion.li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </form>

        <div className={styles.responseArea}>
          <AnimatePresence>
            {isThinking && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className={styles.thinkingProcess}
                aria-busy="true"
                aria-live="assertive"
              >
                <h3>Duke menduar...</h3>
                {thoughts.map((thought, index) => (
                  <motion.div
                    key={thought.step}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={styles.thought}
                  >
                    <span className={styles.step}>{thought.step}</span>
                    <span className={styles.text}>{thought.thought}</span>
                    <span className={styles.confidence}>
                      {Math.round(thought.confidence)}%
                    </span>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {response && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={responseVariants({
                  type: 'answer',
                  confidence: getConfidenceLevel(response.confidence)
                })}
              >
                <div className={styles.responseHeader}>
                  <h3>Përgjigja AGI</h3>
                  <div className={styles.metadata}>
                    <span>Besueshmëria: {Math.round(response.confidence)}%</span>
                    <span>Koha: {response.processingTime}ms</span>
                  </div>
                </div>
                
                <div className={styles.responseContent}>
                  <p>{response.response}</p>
                </div>

                {response.reasoning.length > 0 && (
                  <details className={styles.reasoning}>
                    <summary>Arsyetimi</summary>
                    <ul>
                      {response.reasoning.map((reason, index) => (
                        <li key={index}>{reason}</li>
                      ))}
                    </ul>
                  </details>
                )}

                {response.relatedTopics.length > 0 && (
                  <div className={styles.relatedTopics}>
                    <h4>Tema të lidhura:</h4>
                    <div className={styles.topics}>
                      {response.relatedTopics.map((topic, index) => (
                        <span key={index} className={styles.topic}>
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {response.followUpQuestions && response.followUpQuestions.length > 0 && (
                  <div className={styles.followUp}>
                    <h4>Pyetje vijuese:</h4>
                    <ul>
                      {response.followUpQuestions.map((question, index) => (
                        <li
                          key={index}
                          className={styles.followUpQuestion}
                          onClick={() => setQuery(question)}
                        >
                          {question}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </motion.div>
            )}

            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className={responseVariants({ type: 'error' })}
              >
                <h3>Error</h3>
                <p>{error}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {sessionHistory.length > 0 && (
          <div className={styles.sessionHistory}>
            <h3>Historia e sesionit</h3>
            <div className={styles.historyList}>
              {sessionHistory.slice(-3).map((item, index) => (
                <div key={index} className={styles.historyItem}>
                  <div className={styles.historyQuery}>{item.query}</div>
                  <div className={styles.historyResponse}>
                    {item.response.response.substring(0, 100)}...
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  )
}

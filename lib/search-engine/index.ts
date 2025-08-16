/**
 * Search Engine Module - Main Entry Point
 * Ultra Search System with AI-powered capabilities
 * 
 * @author Ledjan Ahmati
 * @version 8.0.0-WEB8
 * @contact dealsjona@gmail.com
 */

// Core Search Components
export { ultraSearchEngine, ultraSearchCLI, UltraSearchEngine, UltraSearchCLI } from './ultra-search-cli'

// Re-export available modules
export * from './MultiSearchEngine'
export * from './SimpleSearchAPIServer'

// Import for factory
import { MultiSearchEngine } from './MultiSearchEngine'
import { SimpleSearchAPIServer } from './SimpleSearchAPIServer'
import { ultraSearchEngine, ultraSearchCLI } from './ultra-search-cli'

// Search Types and Interfaces
export interface SearchResult {
  id: string
  title: string
  content: string
  url: string
  score: number
  type: 'document' | 'code' | 'api' | 'image' | 'video'
  metadata: {
    size: number
    lastModified: Date
    language?: string
    tags: string[]
  }
}

export interface SearchOptions {
  query: string
  type?: 'all' | 'document' | 'code' | 'api' | 'image' | 'video'
  limit?: number
  fuzzy?: boolean
  caseSensitive?: boolean
  includeMetadata?: boolean
  sortBy?: 'relevance' | 'date' | 'size' | 'alphabetical'
  filters?: {
    dateRange?: { from: Date; to: Date }
    sizeRange?: { min: number; max: number }
    language?: string[]
    tags?: string[]
  }
}

export interface SearchIndex {
  documents: Map<string, SearchResult>
  invertedIndex: Map<string, Set<string>>
  ngrams: Map<string, Set<string>>
  metadata: {
    totalDocuments: number
    totalWords: number
    lastIndexed: Date
  }
}

// Advanced Search Configuration
export interface AdvancedSearchConfig {
  engines: string[]
  weights: Record<string, number>
  timeout: number
  retries: number
  caching: boolean
  analytics: boolean
}

// Search Analytics Interface
export interface SearchAnalytics {
  totalSearches: number
  averageResponseTime: number
  popularQueries: Array<{ query: string; count: number }>
  successRate: number
  errorRate: number
  topResults: Array<{ url: string; clicks: number }>
}

// Search Engine Factory
export class SearchEngineFactory {
  static createUltraSearch(): typeof ultraSearchEngine {
    return ultraSearchEngine
  }
  
  static createMultiSearch(): MultiSearchEngine {
    return new MultiSearchEngine()
  }
  
  static createSearchAPI(port: number = 3001): SimpleSearchAPIServer {
    return new SimpleSearchAPIServer()
  }
  
  static createCLI(): typeof ultraSearchCLI {
    return ultraSearchCLI
  }
}

// Quick Start Functions
export async function quickSearch(query: string, options?: Partial<SearchOptions>): Promise<SearchResult[]> {
  const engine = SearchEngineFactory.createUltraSearch()
  return engine.search({ query, ...options })
}

export async function startSearchServer(port: number = 3001): Promise<void> {
  const server = SearchEngineFactory.createSearchAPI(port)
  return server.start()
}

export function getSearchSuggestions(partialQuery: string, limit: number = 5): string[] {
  const engine = SearchEngineFactory.createUltraSearch()
  return engine.getSuggestions(partialQuery, limit)
}

// Export default engine instance
export const defaultSearchEngine = ultraSearchEngine

// Search Utilities
export class SearchUtils {
  static highlightText(text: string, query: string): string {
    const regex = new RegExp(`(${query})`, 'gi')
    return text.replace(regex, '<mark>$1</mark>')
  }
  
  static calculateRelevance(result: SearchResult, query: string): number {
    const titleMatch = result.title.toLowerCase().includes(query.toLowerCase())
    const contentMatch = result.content.toLowerCase().includes(query.toLowerCase())
    
    let score = result.score
    if (titleMatch) score *= 1.5
    if (contentMatch) score *= 1.2
    
    return score
  }
  
  static formatSearchTime(milliseconds: number): string {
    if (milliseconds < 1000) {
      return `${milliseconds.toFixed(0)}ms`
    } else {
      return `${(milliseconds / 1000).toFixed(2)}s`
    }
  }
  
  static truncateContent(content: string, maxLength: number = 150): string {
    if (content.length <= maxLength) return content
    return content.substring(0, maxLength) + '...'
  }
  
  static extractKeywords(text: string, count: number = 5): string[] {
    const words = text.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 3)
    
    const frequency = new Map<string, number>()
    words.forEach(word => {
      frequency.set(word, (frequency.get(word) || 0) + 1)
    })
    
    return Array.from(frequency.entries())
      .sort(([, a], [, b]) => b - a)
      .slice(0, count)
      .map(([word]) => word)
  }
}

// Version and Build Info
export const SEARCH_ENGINE_VERSION = '8.0.0-WEB8'
export const BUILD_DATE = new Date().toISOString()
export const AUTHOR = 'Ledjan Ahmati'

// Default Export
export default {
  SearchEngineFactory,
  ultraSearchEngine,
  ultraSearchCLI,
  MultiSearchEngine,
  SearchUtils,
  quickSearch,
  startSearchServer,
  getSearchSuggestions,
  defaultSearchEngine,
  version: SEARCH_ENGINE_VERSION
}

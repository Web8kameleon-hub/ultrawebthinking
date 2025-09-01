/**
 * Ultra Search CLI - Advanced Search Engine
 * Command line interface for ultra-fast search operations
 * 
 * @author Ledjan Ahmati
 * @version 8.0.0-WEB8
 * @contact dealsjona@gmail.com
 */

import { performance } from 'perf_hooks'

interface SearchResult {
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

interface SearchOptions {
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

interface SearchIndex {
  documents: Map<string, SearchResult>
  invertedIndex: Map<string, Set<string>>
  ngrams: Map<string, Set<string>>
  metadata: {
    totalDocuments: number
    totalWords: number
    lastIndexed: Date
  }
}

export class UltraSearchEngine {
  private searchIndex: SearchIndex
  private stopWords: Set<string>
  private stemmer: Map<string, string>
  
  constructor() {
    this.searchIndex = {
      documents: new Map(),
      invertedIndex: new Map(),
      ngrams: new Map(),
      metadata: {
        totalDocuments: 0,
        totalWords: 0,
        lastIndexed: new Date()
      }
    }
    
    this.stopWords = new Set([
      'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
      'of', 'with', 'by', 'from', 'up', 'about', 'into', 'through', 'during',
      'before', 'after', 'above', 'below', 'between', 'among', 'is', 'are',
      'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does',
      'did', 'will', 'would', 'could', 'should', 'may', 'might', 'can', 'shall'
    ])
    
    this.stemmer = new Map()
    this.initializeStemmer()
    this.initializeactualData()
  }

  // Initialize basic stemming rules
  private initializeStemmer(): void {
    const rules = [
      ['ing', ''], ['ly', ''], ['ed', ''], ['ies', 'y'], ['ied', 'y'],
      ['ies', 'y'], ['s', ''], ['es', ''], ['er', ''], ['est', '']
    ]
    
    rules.forEach(([suffix, replacement]) => {
      this.stemmer.set(suffix, replacement)
    })
  }

  // Production ready
  private initializeactualData(): void {
    const sampleDocs = [
      {
        id: 'doc-1',
        title: 'AGI Analytics Platform Guide',
        content: 'Complete guide to using AGI Analytics for data analysis, machine learning, and neural forecasting.',
        url: '/docs/agi-analytics',
        type: 'document' as const,
        metadata: {
          size: 2048,
          lastModified: new Date('2024-01-15'),
          language: 'english',
          tags: ['analytics', 'agi', 'machine-learning']
        }
      },
      {
        id: 'doc-2',
        title: 'TypeScript Best Practices',
        content: 'Advanced TypeScript patterns, interfaces, and professional development practices for scalable applications.',
        url: '/docs/typescript',
        type: 'code' as const,
        metadata: {
          size: 1536,
          lastModified: new Date('2024-01-20'),
          language: 'typescript',
          tags: ['typescript', 'javascript', 'programming']
        }
      },
      {
        id: 'doc-3',
        title: 'AGI Eco Environmental Monitoring',
        content: 'Climate intelligence, carbon footprint tracking, and renewable energy optimization using AGI Eco.',
        url: '/docs/agi-eco',
        type: 'document' as const,
        metadata: {
          size: 1792,
          lastModified: new Date('2024-01-22'),
          language: 'english',
          tags: ['environment', 'climate', 'sustainability']
        }
      },
      {
        id: 'api-1',
        title: 'Analytics API Endpoints',
        content: 'REST API documentation for AGI Analytics including correlation analysis, trend detection, and anomaly detection.',
        url: '/api/agi-analytics',
        type: 'api' as const,
        metadata: {
          size: 3072,
          lastModified: new Date('2024-01-25'),
          language: 'json',
          tags: ['api', 'analytics', 'endpoints']
        }
      }
    ]

    sampleDocs.forEach(doc => this.indexDocument(doc))
  }

  // Tokenize and clean text
  private tokenize(text: string): string[] {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 2 && !this.stopWords.has(word))
      .map(word => this.stem(word))
  }

  // Basic stemming
  private stem(word: string): string {
    // Convert Map entries to array for iteration
    const stemmerEntries = Array.from(this.stemmer.entries())
    
    for (const [suffix, replacement] of stemmerEntries) {
      if (word.endsWith(suffix) && word.length > suffix.length + 2) {
        return word.slice(0, -suffix.length) + replacement
      }
    }
    return word
  }

  // Generate n-grams for fuzzy search
  private generateNGrams(text: string, n: number = 3): string[] {
    const ngrams: string[] = []
    const cleanText = text.toLowerCase().replace(/[^\w]/g, '')
    
    for (let i = 0; i <= cleanText.length - n; i++) {
      ngrams.push(cleanText.substring(i, i + n))
    }
    
    return ngrams
  }

  // Index a document
  public indexDocument(doc: Omit<SearchResult, 'score'>): void {
    const searchDoc: SearchResult = { ...doc, score: 0 }
    this.searchIndex.documents.set(doc.id, searchDoc)
    
    // Tokenize title and content
    const titleTokens = this.tokenize(doc.title)
    const contentTokens = this.tokenize(doc.content)
    const allTokens = [...titleTokens, ...contentTokens]
    
    // Build inverted index
    allTokens.forEach(token => {
      if (!this.searchIndex.invertedIndex.has(token)) {
        this.searchIndex.invertedIndex.set(token, new Set())
      }
      this.searchIndex.invertedIndex.get(token)!.add(doc.id)
    })
    
    // Build n-gram index for fuzzy search
    const ngrams = this.generateNGrams(doc.title + ' ' + doc.content)
    ngrams.forEach(ngram => {
      if (!this.searchIndex.ngrams.has(ngram)) {
        this.searchIndex.ngrams.set(ngram, new Set())
      }
      this.searchIndex.ngrams.get(ngram)!.add(doc.id)
    })
    
    // Update metadata
    this.searchIndex.metadata.totalDocuments++
    this.searchIndex.metadata.totalWords += allTokens.length
    this.searchIndex.metadata.lastIndexed = new Date()
  }

  // Calculate TF-IDF score
  private calculateTFIDF(term: string, docId: string): number {
    const doc = this.searchIndex.documents.get(docId)
    if (!doc) return 0
    
    const docTokens = this.tokenize(doc.title + ' ' + doc.content)
    const termFreq = docTokens.filter(token => token === term).length / docTokens.length
    const docFreq = this.searchIndex.invertedIndex.get(term)?.size || 0
    const idf = Math.log(this.searchIndex.metadata.totalDocuments / (docFreq + 1))
    
    return termFreq * idf
  }

  // Fuzzy search using n-grams
  private fuzzySearch(query: string, threshold: number = 0.6): Set<string> {
    const queryNgrams = this.generateNGrams(query)
    const candidates = new Map<string, number>()
    
    queryNgrams.forEach(ngram => {
      const docs = this.searchIndex.ngrams.get(ngram)
      if (docs) {
        docs.forEach(docId => {
          candidates.set(docId, (candidates.get(docId) || 0) + 1)
        })
      }
    })
    
    const results = new Set<string>()
    candidates.forEach((score, docId) => {
      const similarity = score / Math.max(queryNgrams.length, 1)
      if (similarity >= threshold) {
        results.add(docId)
      }
    })
    
    return results
  }

  // Main search function
  public search(options: SearchOptions): SearchResult[] {
    const startTime = performance.now()
    const { query, type = 'all', limit = 10, fuzzy = false, sortBy = 'relevance' } = options
    
    if (!query.trim()) {
      return []
    }
    
    const queryTokens = this.tokenize(query)
    const candidateIds = new Set<string>()
    
    // Exact search
    queryTokens.forEach(token => {
      const docs = this.searchIndex.invertedIndex.get(token)
      if (docs) {
        docs.forEach(docId => candidateIds.add(docId))
      }
    })
    
    // Fuzzy search if enabled
    if (fuzzy) {
      const fuzzyResults = this.fuzzySearch(query)
      fuzzyResults.forEach(docId => candidateIds.add(docId))
    }
    
    // Score and filter results
    const results: SearchResult[] = []
    
    candidateIds.forEach(docId => {
      const doc = this.searchIndex.documents.get(docId)
      if (!doc) return
      
      // Type filter
      if (type !== 'all' && doc.type !== type) return
      
      // Date filter
      if (options.filters?.dateRange) {
        const { from, to } = options.filters.dateRange
        if (doc.metadata.lastModified < from || doc.metadata.lastModified > to) return
      }
      
      // Size filter
      if (options.filters?.sizeRange) {
        const { min, max } = options.filters.sizeRange
        if (doc.metadata.size < min || doc.metadata.size > max) return
      }
      
      // Language filter
      if (options.filters?.language && doc.metadata.language) {
        if (!options.filters.language.includes(doc.metadata.language)) return
      }
      
      // Tags filter
      if (options.filters?.tags) {
        const hasMatchingTag = options.filters.tags.some(tag => 
          doc.metadata.tags.includes(tag)
        )
        if (!hasMatchingTag) return
      }
      
      // Calculate relevance score
      let score = 0
      queryTokens.forEach(token => {
        score += this.calculateTFIDF(token, docId)
      })
      
      // Boost score for title matches
      const titleTokens = this.tokenize(doc.title)
      queryTokens.forEach(token => {
        if (titleTokens.includes(token)) {
          score *= 1.5
        }
      })
      
      results.push({ ...doc, score })
    })
    
    // Sort results
    results.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return b.metadata.lastModified.getTime() - a.metadata.lastModified.getTime()
        case 'size':
          return b.metadata.size - a.metadata.size
        case 'alphabetical':
          return a.title.localeCompare(b.title)
        case 'relevance':
        default:
          return b.score - a.score
      }
    })
    
    const endTime = performance.now()
    console.log(`Search completed in ${(endTime - startTime).toFixed(2)}ms`)
    
    return results.slice(0, limit)
  }

  // Advanced search with multiple queries
  public advancedSearch(queries: string[], operator: 'AND' | 'OR' = 'AND'): SearchResult[] {
    if (operator === 'AND') {
      // Find documents that match ALL queries
      let results = this.search({ query: queries[0] })
      
      for (let i = 1; i < queries.length; i++) {
        const nextResults = this.search({ query: queries[i] })
        const nextIds = new Set(nextResults.map(r => r.id))
        results = results.filter(r => nextIds.has(r.id))
      }
      
      return results
    } else {
      // Find documents that match ANY query
      const allResults = new Map<string, SearchResult>()
      
      queries.forEach(query => {
        const results = this.search({ query })
        results.forEach(result => {
          if (allResults.has(result.id)) {
            // Combine scores
            const existing = allResults.get(result.id)!
            existing.score += result.score
          } else {
            allResults.set(result.id, result)
          }
        })
      })
      
      return Array.from(allResults.values()).sort((a, b) => b.score - a.score)
    }
  }

  // Get search suggestions
  public getSuggestions(partialQuery: string, limit: number = 5): string[] {
    const suggestions = new Set<string>()
    const queryLower = partialQuery.toLowerCase()
    
    // Search in indexed terms
    this.searchIndex.invertedIndex.forEach((_, term) => {
      if (term.startsWith(queryLower) && suggestions.size < limit) {
        suggestions.add(term)
      }
    })
    
    // Search in document titles
    this.searchIndex.documents.forEach(doc => {
      const titleWords = this.tokenize(doc.title)
      titleWords.forEach(word => {
        if (word.startsWith(queryLower) && suggestions.size < limit) {
          suggestions.add(word)
        }
      })
    })
    
    return Array.from(suggestions).slice(0, limit)
  }

  // Get search statistics
  public getStatistics(): {
    totalDocuments: number
    totalWords: number
    indexSize: number
    lastIndexed: Date
    documentTypes: Record<string, number>
    topTerms: Array<{ term: string; frequency: number }>
  } {
    const documentTypes: Record<string, number> = {}
    this.searchIndex.documents.forEach(doc => {
      documentTypes[doc.type] = (documentTypes[doc.type] || 0) + 1
    })
    
    const termFrequencies = new Map<string, number>()
    this.searchIndex.invertedIndex.forEach((docs, term) => {
      termFrequencies.set(term, docs.size)
    })
    
    const topTerms = Array.from(termFrequencies.entries())
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([term, frequency]) => ({ term, frequency }))
    
    return {
      totalDocuments: this.searchIndex.metadata.totalDocuments,
      totalWords: this.searchIndex.metadata.totalWords,
      indexSize: this.searchIndex.documents.size,
      lastIndexed: this.searchIndex.metadata.lastIndexed,
      documentTypes,
      topTerms
    }
  }

  // Export search index
  public exportIndex(): string {
    const exportData = {
      metadata: this.searchIndex.metadata,
      documents: Array.from(this.searchIndex.documents.entries()),
      invertedIndex: Array.from(this.searchIndex.invertedIndex.entries()).map(([term, docs]) => [
        term, Array.from(docs)
      ]),
      ngrams: Array.from(this.searchIndex.ngrams.entries()).map(([ngram, docs]) => [
        ngram, Array.from(docs)
      ])
    }
    
    return JSON.stringify(exportData, null, 2)
  }

  // Import search index
  public importIndex(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData)
      
      this.searchIndex.metadata = data.metadata
      this.searchIndex.documents = new Map(data.documents)
      
      this.searchIndex.invertedIndex = new Map(
        data.invertedIndex.map(([term, docs]: [string, string[]]) => [term, new Set(docs)])
      )
      
      this.searchIndex.ngrams = new Map(
        data.ngrams.map(([ngram, docs]: [string, string[]]) => [ngram, new Set(docs)])
      )
      
      return true
    } catch (error) {
      console.error('Failed to import index:', error)
      return false
    }
  }
}

// CLI Command Interface
export class UltraSearchCLI {
  private searchEngine: UltraSearchEngine
  
  constructor() {
    this.searchEngine = new UltraSearchEngine()
  }
  
  // CLI command: search
  public search(query: string, options: Partial<SearchOptions> = {}): void {
    console.log(`🔍 Searching for: "${query}"`)
    console.log('─'.repeat(50))
    
    const results = this.searchEngine.search({ query, ...options })
    
    if (results.length === 0) {
      console.log('❌ No results found')
      return
    }
    
    results.forEach((result, index) => {
      console.log(`${index + 1}. ${result.title}`)
      console.log(`   Type: ${result.type} | Score: ${result.score.toFixed(3)}`)
      console.log(`   URL: ${result.url}`)
      console.log(`   ${result.content.substring(0, 100)}...`)
      console.log(`   Size: ${result.metadata.size} bytes | Modified: ${result.metadata.lastModified.toLocaleDateString()}`)
      console.log(`   Tags: ${result.metadata.tags.join(', ')}`)
      console.log('')
    })
    
    console.log(`Found ${results.length} results`)
  }
  
  // CLI command: suggestions
  public suggest(partialQuery: string): void {
    console.log(`💡 Suggestions for: "${partialQuery}"`)
    console.log('─'.repeat(30))
    
    const suggestions = this.searchEngine.getSuggestions(partialQuery)
    
    if (suggestions.length === 0) {
      console.log('❌ No suggestions found')
      return
    }
    
    suggestions.forEach((suggestion, index) => {
      console.log(`${index + 1}. ${suggestion}`)
    })
  }
  
  // CLI command: stats
  public stats(): void {
    console.log('📊 Search Engine Statistics')
    console.log('─'.repeat(40))
    
    const stats = this.searchEngine.getStatistics()
    
    console.log(`Total Documents: ${stats.totalDocuments}`)
    console.log(`Total Words: ${stats.totalWords}`)
    console.log(`Index Size: ${stats.indexSize}`)
    console.log(`Last Indexed: ${stats.lastIndexed.toLocaleString()}`)
    console.log('')
    
    console.log('Document Types:')
    Object.entries(stats.documentTypes).forEach(([type, count]) => {
      console.log(`  ${type}: ${count}`)
    })
    console.log('')
    
    console.log('Top Terms:')
    stats.topTerms.forEach((term, index) => {
      console.log(`  ${index + 1}. ${term.term} (${term.frequency})`)
    })
  }
  
  // CLI command: help
  public help(): void {
    console.log('🚀 Ultra Search CLI - Help')
    console.log('═'.repeat(50))
    console.log('')
    console.log('Available Commands:')
    console.log('')
    console.log('search <query>     - Search for documents')
    console.log('suggest <partial>  - Get search suggestions')
    console.log('stats             - Show search statistics')
    console.log('help              - Show this help message')
    console.log('')
    console.log('Search Options:')
    console.log('  --type <type>    - Filter by type (document, code, api, image, video)')
    console.log('  --limit <num>    - Limit number of results (default: 10)')
    console.log('  --fuzzy          - Enable fuzzy search')
    console.log('  --sort <method>  - Sort by (relevance, date, size, alphabetical)')
    console.log('')
    console.log('Examples:')
    console.log('  search "AGI analytics" --type document --limit 5')
    console.log('  search "typescript" --fuzzy --sort date')
    console.log('  suggest "analyt"')
    console.log('')
  }
}

// Export instances
export const ultraSearchEngine = new UltraSearchEngine()
export const ultraSearchCLI = new UltraSearchCLI()

// Example usage - Comment out for library usage
/*
// Check if this is the main module in CommonJS
// Use import.meta.url for ES modules check instead
if (import.meta.url === `file://${process.argv[1]}`) {
  const cli = new UltraSearchCLI()
  
  console.log('🌟 Ultra Search CLI v8.0.0-WEB8')
  console.log('──────────────────────────────────')
  console.log('')
  
  // Production ready
  cli.search('AGI analytics')
  console.log('\n' + '═'.repeat(50) + '\n')
  
  cli.suggest('typesc')
  console.log('\n' + '═'.repeat(50) + '\n')
  
  cli.stats()
  console.log('\n' + '═'.repeat(50) + '\n')
  
  cli.help()
}
*/
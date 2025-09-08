/**
 * Web8 Open Knowledge Database
 * Historik dhe linke të hapur për informacione shkencore dhe të gjitha fushave
 */

export interface KnowledgeLink {
  id: string
  title: string
  url: string
  category: string
  subcategory: string
  description: string
  language: string
  type: 'database' | 'journal' | 'repository' | 'platform' | 'encyclopedia' | 'news'
  accessLevel: 'free' | 'limited' | 'premium'
  lastUpdated: string
}

export interface HistoryEntry {
  id: string
  query: string
  timestamp: string
  sources: string[]
  resultCount: number
  category: string
}

/**
 * Open Knowledge Links Database
 */
export const OPEN_KNOWLEDGE_LINKS: KnowledgeLink[] = [
  // Scientific Research & Academia
  {
    id: 'arxiv',
    title: 'arXiv.org',
    url: 'https://arxiv.org',
    category: 'science',
    subcategory: 'research',
    description: 'Open access to e-prints in Physics, Mathematics, Computer Science, Quantitative Biology, Quantitative Finance and Statistics',
    language: 'en',
    type: 'repository',
    accessLevel: 'free',
    lastUpdated: '2025-09-07'
  },
  {
    id: 'pubmed',
    title: 'PubMed',
    url: 'https://pubmed.ncbi.nlm.nih.gov',
    category: 'science',
    subcategory: 'medicine',
    description: 'Free search engine accessing primarily the MEDLINE database of references and abstracts on life sciences and biomedical topics',
    language: 'en',
    type: 'database',
    accessLevel: 'free',
    lastUpdated: '2025-09-07'
  },
  {
    id: 'doaj',
    title: 'Directory of Open Access Journals',
    url: 'https://doaj.org',
    category: 'science',
    subcategory: 'journals',
    description: 'Community-curated online directory that indexes and provides access to high quality, open access, peer-reviewed journals',
    language: 'multi',
    type: 'database',
    accessLevel: 'free',
    lastUpdated: '2025-09-07'
  },
  {
    id: 'github',
    title: 'GitHub',
    url: 'https://github.com',
    category: 'technology',
    subcategory: 'code',
    description: 'World\'s largest platform for open source code, collaboration and version control',
    language: 'multi',
    type: 'repository',
    accessLevel: 'free',
    lastUpdated: '2025-09-07'
  },
  {
    id: 'kaggle',
    title: 'Kaggle',
    url: 'https://kaggle.com',
    category: 'technology',
    subcategory: 'data-science',
    description: 'Platform for data science competitions, datasets, and machine learning models',
    language: 'en',
    type: 'platform',
    accessLevel: 'free',
    lastUpdated: '2025-09-07'
  },

  // AI & Machine Learning
  {
    id: 'huggingface',
    title: 'Hugging Face',
    url: 'https://huggingface.co',
    category: 'ai',
    subcategory: 'models',
    description: 'Open platform for machine learning models, datasets, and applications',
    language: 'en',
    type: 'platform',
    accessLevel: 'free',
    lastUpdated: '2025-09-07'
  },
  {
    id: 'papers-with-code',
    title: 'Papers With Code',
    url: 'https://paperswithcode.com',
    category: 'ai',
    subcategory: 'research',
    description: 'Free and open resource with Machine Learning papers, code, datasets and benchmarks',
    language: 'en',
    type: 'repository',
    accessLevel: 'free',
    lastUpdated: '2025-09-07'
  },
  {
    id: 'openai-research',
    title: 'OpenAI Research',
    url: 'https://openai.com/research',
    category: 'ai',
    subcategory: 'research',
    description: 'OpenAI research papers and findings in artificial intelligence',
    language: 'en',
    type: 'repository',
    accessLevel: 'free',
    lastUpdated: '2025-09-07'
  },

  // Encyclopedias & Knowledge Bases
  {
    id: 'wikipedia',
    title: 'Wikipedia',
    url: 'https://wikipedia.org',
    category: 'general',
    subcategory: 'encyclopedia',
    description: 'Free encyclopedia that anyone can edit, with articles in hundreds of languages',
    language: 'multi',
    type: 'encyclopedia',
    accessLevel: 'free',
    lastUpdated: '2025-09-07'
  },
  {
    id: 'wikidata',
    title: 'Wikidata',
    url: 'https://wikidata.org',
    category: 'general',
    subcategory: 'database',
    description: 'Free and open knowledge base that can be read and edited by both humans and machines',
    language: 'multi',
    type: 'database',
    accessLevel: 'free',
    lastUpdated: '2025-09-07'
  },
  {
    id: 'britannica',
    title: 'Britannica',
    url: 'https://britannica.com',
    category: 'general',
    subcategory: 'encyclopedia',
    description: 'Comprehensive encyclopedia with expert-written articles',
    language: 'en',
    type: 'encyclopedia',
    accessLevel: 'limited',
    lastUpdated: '2025-09-07'
  },

  // News & Current Events
  {
    id: 'reuters',
    title: 'Reuters',
    url: 'https://reuters.com',
    category: 'news',
    subcategory: 'international',
    description: 'International news agency providing business, financial, national and international news',
    language: 'multi',
    type: 'news',
    accessLevel: 'limited',
    lastUpdated: '2025-09-07'
  },
  {
    id: 'bbc-news',
    title: 'BBC News',
    url: 'https://bbc.com/news',
    category: 'news',
    subcategory: 'international',
    description: 'British public service broadcaster with global news coverage',
    language: 'multi',
    type: 'news',
    accessLevel: 'free',
    lastUpdated: '2025-09-07'
  },
  {
    id: 'nature-news',
    title: 'Nature News',
    url: 'https://nature.com/news',
    category: 'science',
    subcategory: 'news',
    description: 'Breaking news and analysis from the world of science and technology',
    language: 'en',
    type: 'news',
    accessLevel: 'limited',
    lastUpdated: '2025-09-07'
  },

  // Specialized Databases
  {
    id: 'worldbank-data',
    title: 'World Bank Open Data',
    url: 'https://data.worldbank.org',
    category: 'economics',
    subcategory: 'statistics',
    description: 'Free and open access to global development data',
    language: 'multi',
    type: 'database',
    accessLevel: 'free',
    lastUpdated: '2025-09-07'
  },
  {
    id: 'nasa-data',
    title: 'NASA Open Data Portal',
    url: 'https://data.nasa.gov',
    category: 'science',
    subcategory: 'space',
    description: 'NASA\'s data portal providing access to datasets from various missions and research projects',
    language: 'en',
    type: 'database',
    accessLevel: 'free',
    lastUpdated: '2025-09-07'
  },
  {
    id: 'gutenberg',
    title: 'Project Gutenberg',
    url: 'https://gutenberg.org',
    category: 'literature',
    subcategory: 'books',
    description: 'Library of over 70,000 free eBooks with expired copyrights',
    language: 'multi',
    type: 'repository',
    accessLevel: 'free',
    lastUpdated: '2025-09-07'
  },

  // Academic Platforms
  {
    id: 'coursera',
    title: 'Coursera',
    url: 'https://coursera.org',
    category: 'education',
    subcategory: 'courses',
    description: 'Online learning platform offering courses from universities and companies worldwide',
    language: 'multi',
    type: 'platform',
    accessLevel: 'limited',
    lastUpdated: '2025-09-07'
  },
  {
    id: 'edx',
    title: 'edX',
    url: 'https://edx.org',
    category: 'education',
    subcategory: 'courses',
    description: 'Massive open online course provider founded by Harvard and MIT',
    language: 'multi',
    type: 'platform',
    accessLevel: 'limited',
    lastUpdated: '2025-09-07'
  },
  {
    id: 'khan-academy',
    title: 'Khan Academy',
    url: 'https://khanacademy.org',
    category: 'education',
    subcategory: 'courses',
    description: 'Free online courses, lessons and practice in various subjects',
    language: 'multi',
    type: 'platform',
    accessLevel: 'free',
    lastUpdated: '2025-09-07'
  },

  // Technology & Programming
  {
    id: 'stackoverflow',
    title: 'Stack Overflow',
    url: 'https://stackoverflow.com',
    category: 'technology',
    subcategory: 'programming',
    description: 'Question and answer site for programmers and developers',
    language: 'multi',
    type: 'platform',
    accessLevel: 'free',
    lastUpdated: '2025-09-07'
  },
  {
    id: 'mdn',
    title: 'MDN Web Docs',
    url: 'https://developer.mozilla.org',
    category: 'technology',
    subcategory: 'web-development',
    description: 'Resources for developers, by developers, covering web technologies',
    language: 'multi',
    type: 'encyclopedia',
    accessLevel: 'free',
    lastUpdated: '2025-09-07'
  },

  // Open Government Data
  {
    id: 'data-gov',
    title: 'Data.gov',
    url: 'https://data.gov',
    category: 'government',
    subcategory: 'statistics',
    description: 'US government open data repository',
    language: 'en',
    type: 'database',
    accessLevel: 'free',
    lastUpdated: '2025-09-07'
  },
  {
    id: 'eurostat',
    title: 'Eurostat',
    url: 'https://ec.europa.eu/eurostat',
    category: 'government',
    subcategory: 'statistics',
    description: 'Statistical office of the European Union',
    language: 'multi',
    type: 'database',
    accessLevel: 'free',
    lastUpdated: '2025-09-07'
  }
]

/**
 * Web8 Knowledge Manager
 */
export class Web8KnowledgeManager {
  private static instance: Web8KnowledgeManager
  private searchHistory: HistoryEntry[] = []
  private favorites: string[] = []

  private constructor() {}

  static getInstance(): Web8KnowledgeManager {
    if (!Web8KnowledgeManager.instance) {
      Web8KnowledgeManager.instance = new Web8KnowledgeManager()
    }
    return Web8KnowledgeManager.instance
  }

  /**
   * Search në knowledge base
   */
  searchKnowledge(query: string, category?: string): {
    results: KnowledgeLink[]
    suggestions: string[]
    totalFound: number
  } {
    const normalizedQuery = query.toLowerCase()
    
    let results = OPEN_KNOWLEDGE_LINKS.filter(link => {
      const matchesQuery = 
        link.title.toLowerCase().includes(normalizedQuery) ||
        link.description.toLowerCase().includes(normalizedQuery) ||
        link.category.toLowerCase().includes(normalizedQuery) ||
        link.subcategory.toLowerCase().includes(normalizedQuery)
      
      const matchesCategory = !category || link.category === category
      
      return matchesQuery && matchesCategory
    })

    // Sort by relevance (free access first, then by category match)
    results.sort((a, b) => {
      if (a.accessLevel === 'free' && b.accessLevel !== 'free') return -1
      if (a.accessLevel !== 'free' && b.accessLevel === 'free') return 1
      return 0
    })

    // Generate suggestions
    const suggestions = this.generateSuggestions(query)

    // Add to history
    this.addToHistory(query, results.map(r => r.id), category || 'general')

    return {
      results,
      suggestions,
      totalFound: results.length
    }
  }

  /**
   * Get links by category
   */
  getLinksByCategory(category: string): KnowledgeLink[] {
    return OPEN_KNOWLEDGE_LINKS.filter(link => link.category === category)
  }

  /**
   * Get all categories
   */
  getAllCategories(): { category: string; count: number }[] {
    const categories = OPEN_KNOWLEDGE_LINKS.reduce((acc, link) => {
      acc[link.category] = (acc[link.category] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return Object.entries(categories).map(([category, count]) => ({
      category,
      count
    }))
  }

  /**
   * Get recommended links based on AGI interests
   */
  getAGIRecommendations(): KnowledgeLink[] {
    const agiKeywords = ['ai', 'science', 'technology', 'research']
    
    return OPEN_KNOWLEDGE_LINKS.filter(link =>
      agiKeywords.some(keyword => 
        link.category.includes(keyword) || 
        link.subcategory.includes(keyword)
      )
    ).slice(0, 10)
  }

  /**
   * Add to search history
   */
  private addToHistory(query: string, sources: string[], category: string): void {
    const entry: HistoryEntry = {
      id: Date.now().toString(),
      query,
      timestamp: new Date().toISOString(),
      sources,
      resultCount: sources.length,
      category
    }

    this.searchHistory.unshift(entry)
    
    // Keep only last 100 searches
    if (this.searchHistory.length > 100) {
      this.searchHistory = this.searchHistory.slice(0, 100)
    }
  }

  /**
   * Get search history
   */
  getSearchHistory(limit: number = 20): HistoryEntry[] {
    return this.searchHistory.slice(0, limit)
  }

  /**
   * Generate search suggestions
   */
  private generateSuggestions(query: string): string[] {
    const queryLower = query.toLowerCase()
    const suggestions = new Set<string>()

    // Add category suggestions
    OPEN_KNOWLEDGE_LINKS.forEach(link => {
      if (link.category.includes(queryLower)) {
        suggestions.add(link.category)
      }
      if (link.subcategory.includes(queryLower)) {
        suggestions.add(link.subcategory)
      }
    })

    // Add common search terms
    const commonTerms = [
      'artificial intelligence', 'machine learning', 'research papers',
      'open data', 'scientific journals', 'programming', 'education',
      'statistics', 'news', 'government data'
    ]

    commonTerms.forEach(term => {
      if (term.includes(queryLower) && term !== queryLower) {
        suggestions.add(term)
      }
    })

    return Array.from(suggestions).slice(0, 5)
  }

  /**
   * Add to favorites
   */
  addToFavorites(linkId: string): void {
    if (!this.favorites.includes(linkId)) {
      this.favorites.push(linkId)
    }
  }

  /**
   * Remove from favorites
   */
  removeFromFavorites(linkId: string): void {
    this.favorites = this.favorites.filter(id => id !== linkId)
  }

  /**
   * Get favorite links
   */
  getFavoriteLinks(): KnowledgeLink[] {
    return OPEN_KNOWLEDGE_LINKS.filter(link => 
      this.favorites.includes(link.id)
    )
  }

  /**
   * Get statistics
   */
  getStats(): {
    totalLinks: number
    totalCategories: number
    freeLinks: number
    searchHistoryCount: number
    favoritesCount: number
    lastSearch: string | null
  } {
    return {
      totalLinks: OPEN_KNOWLEDGE_LINKS.length,
      totalCategories: this.getAllCategories().length,
      freeLinks: OPEN_KNOWLEDGE_LINKS.filter(l => l.accessLevel === 'free').length,
      searchHistoryCount: this.searchHistory.length,
      favoritesCount: this.favorites.length,
      lastSearch: this.searchHistory[0]?.query || null
    }
  }
}

// Global instance
export const knowledgeManager = Web8KnowledgeManager.getInstance()

// Utility functions
export const searchKnowledge = (query: string, category?: string) => 
  knowledgeManager.searchKnowledge(query, category)

export const getAGIRecommendations = () => 
  knowledgeManager.getAGIRecommendations()

export const getAllCategories = () => 
  knowledgeManager.getAllCategories()

export const getKnowledgeStats = () => 
  knowledgeManager.getStats()

/**
 * @author Ledjan Ahmati
 * @version 8.0.0-WEB8
 * @contact dealsjona@gmail.com
 * Industrial Web Search Engine - Neural-Enhanced Search with Real APIs
 */

import { braveSearch, SearchResult, WebSearchResponse, searchUtils } from './provider';
import { analyzeWithNeuralEngine } from '../../../lib/neuralAnalyzer';

export interface SearchAnalytics {
  query: string;
  timestamp: string;
  processingTime: number;
  resultCount: number;
  sources: string[];
  categories: Record<string, number>;
  neuralScore: number;
  sentiment: 'positive' | 'neutral' | 'negative';
  complexity: 'simple' | 'moderate' | 'complex';
  language: string;
  topics: string[];
}

export interface EnhancedSearchResult extends SearchResult {
  neural_score: number;
  category: string;
  sentiment: number;
  relevance: number;
  credibility: number;
  readability: number;
  keywords: string[];
  summary?: string;
}

export interface IndustrialSearchResponse {
  query: {
    original: string;
    processed: string;
    suggestions: string[];
    intent: string;
  };
  results: EnhancedSearchResult[];
  analytics: SearchAnalytics;
  meta: {
    total_results: number;
    search_time: number;
    api_provider: string;
    neural_processing: boolean;
    cache_hit: boolean;
    rate_limit_remaining?: number;
  };
  filters: {
    applied: string[];
    available: string[];
  };
  clustering: {
    by_domain: Record<string, number>;
    by_category: Record<string, number>;
    by_language: Record<string, number>;
  };
}

class IndustrialWebSearch {
  private cache = new Map<string, { data: IndustrialSearchResponse; expires: number }>();
  private searchHistory: SearchAnalytics[] = [];
  private readonly cacheTimeout = 30 * 60 * 1000; // 30 minutes

  async search(
    query: string,
    options: {
      count?: number;
      filters?: {
        domains?: string[];
        excludeDomains?: string[];
        categories?: string[];
        timeRange?: 'hour' | 'day' | 'week' | 'month' | 'year';
        language?: string;
        safeSearch?: boolean;
      };
      enhancement?: {
        summarize?: boolean;
        extractKeywords?: boolean;
        analyzeSentiment?: boolean;
        scoreCredibility?: boolean;
      };
      neural?: {
        processIntent?: boolean;
        generateSuggestions?: boolean;
        clusterResults?: boolean;
      };
    } = {}
  ): Promise<IndustrialSearchResponse> {
    const startTime = Date.now();
    const cacheKey = this.generateCacheKey(query, options);
    
    // Check cache first
    const cached = this.cache.get(cacheKey);
    if (cached && cached.expires > Date.now()) {
      cached.data.meta.cache_hit = true;
      return cached.data;
    }

    try {
      // Process query with neural engine
      const neuralAnalysis = await analyzeWithNeuralEngine([{
        query: query,
        type: 'search_query',
        timestamp: Date.now(),
        metadata: { 
          extractKeywords: true, 
          analyzeSentiment: true,
          detectIntent: true 
        }
      }]);

      const processedQuery = this.preprocessQuery(query, neuralAnalysis);
      
      // Get search suggestions if requested
      const suggestions = options.neural?.generateSuggestions 
        ? await braveSearch.getSuggestions(processedQuery)
        : [];

      // Execute search with Brave API
      const searchOptions = this.buildSearchOptions(options);
      const rawResults = await braveSearch.search(processedQuery, searchOptions);

      // Enhanced processing of results
      const enhancedResults = await this.enhanceResults(
        rawResults.results || [],
        options.enhancement || {}
      );

      // Apply filters
      const filteredResults = this.applyFilters(enhancedResults, options.filters || {});

      // Generate analytics
      const analytics = this.generateAnalytics(
        query,
        filteredResults,
        Date.now() - startTime,
        neuralAnalysis
      );

      // Create industrial response
      const response: IndustrialSearchResponse = {
        query: {
          original: query,
          processed: processedQuery,
          suggestions,
          intent: 'informational' // Default intent since neural analysis structure is different
        },
        results: filteredResults,
        analytics,
        meta: {
          total_results: filteredResults.length,
          search_time: Date.now() - startTime,
          api_provider: 'brave_search',
          neural_processing: true,
          cache_hit: false
        },
        filters: {
          applied: this.getAppliedFilters(options.filters || {}),
          available: ['domain', 'category', 'time', 'language', 'safety']
        },
        clustering: this.clusterResults(filteredResults)
      };

      // Cache response
      this.cache.set(cacheKey, {
        data: response,
        expires: Date.now() + this.cacheTimeout
      });

      // Store in history
      this.searchHistory.push(analytics);
      if (this.searchHistory.length > 1000) {
        this.searchHistory = this.searchHistory.slice(-500);
      }

      return response;

    } catch (error) {
      console.error('🔍 Industrial search error:', error);
      throw new Error(`Search failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private preprocessQuery(query: string, neuralAnalysis: any): string {
    // Clean and optimize query based on neural analysis
    let processed = query.trim();
    
    // Remove redundant words for better search results
    const stopWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'];
    const words = processed.split(' ').filter(word => 
      word.length > 2 && !stopWords.includes(word.toLowerCase())
    );
    
    // Add relevant keywords from neural analysis
    if (neuralAnalysis.keywords) {
      const relevantKeywords = neuralAnalysis.keywords
        .filter((keyword: string) => !processed.toLowerCase().includes(keyword.toLowerCase()))
        .slice(0, 2);
      words.push(...relevantKeywords);
    }
    
    return words.join(' ');
  }

  private buildSearchOptions(options: any) {
    const searchOptions: any = {
      count: options.count || 20,
      extra_snippets: true,
      text_decorations: true,
      summary: false
    };

    if (options.filters?.timeRange) {
      const timeMap = {
        hour: 'pd',
        day: 'pd', 
        week: 'pw',
        month: 'pm',
        year: 'py'
      };
      searchOptions.freshness = timeMap[options.filters.timeRange];
    }

    if (options.filters?.safeSearch !== undefined) {
      searchOptions.safesearch = options.filters.safeSearch ? 'strict' : 'off';
    }

    return searchOptions;
  }

  private async enhanceResults(
    results: SearchResult[],
    enhancement: any
  ): Promise<EnhancedSearchResult[]> {
    const enhanced: EnhancedSearchResult[] = [];

    for (const result of results) {
      const enhancedResult: EnhancedSearchResult = {
        ...result,
        neural_score: (result as any).neural_score || 0.5,
        category: searchUtils.categorizeResult(result),
        sentiment: 0,
        relevance: 0,
        credibility: 0,
        readability: 0,
        keywords: []
      };

      // Extract keywords if requested
      if (enhancement.extractKeywords) {
        enhancedResult.keywords = this.extractKeywords(
          `${result.title} ${result.description}`
        );
      }

      // Analyze sentiment if requested
      if (enhancement.analyzeSentiment) {
        enhancedResult.sentiment = this.analyzeSentiment(result.description);
      }

      // Calculate relevance score
      enhancedResult.relevance = this.calculateRelevance(result);

      // Score credibility if requested
      if (enhancement.scoreCredibility) {
        enhancedResult.credibility = this.scoreCredibility(result);
      }

      // Calculate readability
      enhancedResult.readability = this.calculateReadability(result.description);

      // Generate summary if requested
      if (enhancement.summarize && result.description) {
        enhancedResult.summary = this.generateSummary(result.description);
      }

      enhanced.push(enhancedResult);
    }

    return enhanced;
  }

  private extractKeywords(text: string): string[] {
    // Simple keyword extraction - can be enhanced with NLP libraries
    const words = text.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 3);
    
    const frequency: Record<string, number> = {};
    words.forEach(word => {
      frequency[word] = (frequency[word] || 0) + 1;
    });
    
    return Object.entries(frequency)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([word]) => word);
  }

  private analyzeSentiment(text: string): number {
    // Simple sentiment analysis - can be enhanced with ML models
    const positive = ['good', 'great', 'excellent', 'amazing', 'wonderful', 'best', 'love', 'perfect'];
    const negative = ['bad', 'terrible', 'awful', 'hate', 'worst', 'horrible', 'disappointing'];
    
    const words = text.toLowerCase().split(/\s+/);
    let score = 0;
    
    words.forEach(word => {
      if (positive.includes(word)) score += 1;
      if (negative.includes(word)) score -= 1;
    });
    
    return Math.max(-1, Math.min(1, score / words.length * 10));
  }

  private calculateRelevance(result: SearchResult): number {
    let score = 0.5;
    
    // Title length and quality
    if (result.title.length > 10 && result.title.length < 100) score += 0.1;
    
    // Description quality
    if (result.description && result.description.length > 50) score += 0.1;
    if (result.description && result.description.length > 200) score += 0.1;
    
    // Extra snippets availability
    if (result.extra_snippets && result.extra_snippets.length > 0) score += 0.1;
    
    // Neural score influence
    if ((result as any).neural_score) {
      score = (score + (result as any).neural_score) / 2;
    }
    
    return Math.min(1, score);
  }

  private scoreCredibility(result: SearchResult): number {
    const url = result.url.toLowerCase();
    let score = 0.5;
    
    // Domain credibility
    const credibleDomains = [
      'wikipedia.org', 'britannica.com', 'edu', 'gov', 'nature.com',
      'science.org', 'ieee.org', 'acm.org', 'pubmed.ncbi.nlm.nih.gov'
    ];
    
    if (credibleDomains.some(domain => url.includes(domain))) score += 0.3;
    if (url.includes('.edu') || url.includes('.gov')) score += 0.2;
    if (url.includes('https://')) score += 0.1;
    
    // Content indicators
    if (result.description && result.description.includes('research')) score += 0.1;
    if (result.description && result.description.includes('study')) score += 0.1;
    
    return Math.min(1, score);
  }

  private calculateReadability(text: string): number {
    if (!text) return 0;
    
    const words = text.split(/\s+/).length;
    const sentences = text.split(/[.!?]+/).length;
    const avgWordsPerSentence = words / sentences;
    
    // Simple readability score (higher is more readable)
    let score = 1;
    if (avgWordsPerSentence > 20) score -= 0.3;
    if (avgWordsPerSentence > 30) score -= 0.3;
    if (text.length > 500) score -= 0.2;
    
    return Math.max(0, score);
  }

  private generateSummary(text: string): string {
    // Simple extractive summary - take first sentence or truncate
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 10);
    if (sentences.length > 0) {
      return sentences[0].trim() + '.';
    }
    return searchUtils.truncateDescription(text, 100);
  }

  private applyFilters(results: EnhancedSearchResult[], filters: any): EnhancedSearchResult[] {
    let filtered = [...results];

    if (filters.domains && filters.domains.length > 0) {
      filtered = filtered.filter(result => 
        filters.domains.some((domain: string) => 
          result.url.toLowerCase().includes(domain.toLowerCase())
        )
      );
    }

    if (filters.excludeDomains && filters.excludeDomains.length > 0) {
      filtered = filtered.filter(result => 
        !filters.excludeDomains.some((domain: string) => 
          result.url.toLowerCase().includes(domain.toLowerCase())
        )
      );
    }

    if (filters.categories && filters.categories.length > 0) {
      filtered = filtered.filter(result => 
        filters.categories.includes(result.category)
      );
    }

    return filtered;
  }

  private generateAnalytics(
    query: string,
    results: EnhancedSearchResult[],
    processingTime: number,
    neuralAnalysis: any
  ): SearchAnalytics {
    const sources = Array.from(new Set(
      results.map(r => searchUtils.extractDomain(r.url))
    ));

    const categories = results.reduce((acc, result) => {
      acc[result.category] = (acc[result.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      query,
      timestamp: new Date().toISOString(),
      processingTime,
      resultCount: results.length,
      sources,
      categories,
      neuralScore: neuralAnalysis.score || 0.5,
      sentiment: 'neutral', // Default since neural analysis structure is different
      complexity: query.split(' ').length > 5 ? 'complex' : 
                 query.split(' ').length > 2 ? 'moderate' : 'simple',
      language: 'en', // Default language
      topics: [] // Default empty topics
    };
  }

  private getAppliedFilters(filters: any): string[] {
    const applied: string[] = [];
    if (filters.domains?.length) applied.push('domain_filter');
    if (filters.excludeDomains?.length) applied.push('domain_exclusion');
    if (filters.categories?.length) applied.push('category_filter');
    if (filters.timeRange) applied.push('time_filter');
    if (filters.language) applied.push('language_filter');
    if (filters.safeSearch !== undefined) applied.push('safety_filter');
    return applied;
  }

  private clusterResults(results: EnhancedSearchResult[]) {
    const byDomain: Record<string, number> = {};
    const byCategory: Record<string, number> = {};
    const byLanguage: Record<string, number> = {};

    results.forEach(result => {
      const domain = searchUtils.extractDomain(result.url);
      byDomain[domain] = (byDomain[domain] || 0) + 1;
      byCategory[result.category] = (byCategory[result.category] || 0) + 1;
      byLanguage[result.language || 'unknown'] = (byLanguage[result.language || 'unknown'] || 0) + 1;
    });

    return { by_domain: byDomain, by_category: byCategory, by_language: byLanguage };
  }

  private generateCacheKey(query: string, options: any): string {
    return `search:${query}:${JSON.stringify(options)}`;
  }

  // Public methods for analytics
  getSearchHistory(): SearchAnalytics[] {
    return [...this.searchHistory];
  }

  getPopularQueries(limit = 10): Array<{ query: string; count: number }> {
    const queryCount: Record<string, number> = {};
    this.searchHistory.forEach(analytics => {
      queryCount[analytics.query] = (queryCount[analytics.query] || 0) + 1;
    });

    return Object.entries(queryCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, limit)
      .map(([query, count]) => ({ query, count }));
  }

  clearCache(): void {
    this.cache.clear();
  }

  getCacheStats(): { size: number; hitRate: number } {
    // Simple cache stats - can be enhanced
    return {
      size: this.cache.size,
      hitRate: 0 // Would need to track hits vs misses
    };
  }
}

// Export singleton instance
export const industrialWebSearch = new IndustrialWebSearch();

// Export for direct usage
export { IndustrialWebSearch };

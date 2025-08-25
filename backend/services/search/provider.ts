/**
 * @author Ledjan Ahmati
 * @version 8.0.0-WEB8
 * @contact dealsjona@gmail.com
 * Industrial Search Provider - Real Brave Search API Integration
 */

import { fetch } from 'undici';

export interface SearchResult {
  title: string;
  url: string;
  description: string;
  age?: string;
  extra_snippets?: string[];
  language?: string;
  family_friendly?: boolean;
  type?: 'search_result' | 'faq' | 'infobox' | 'news' | 'videos';
  meta_url?: {
    scheme: string;
    netloc: string;
    hostname: string;
    favicon: string;
    path: string;
  };
}

export interface WebSearchResponse {
  query: {
    original: string;
    show_strict_warning: boolean;
    altered?: string;
    safesearch: boolean;
    is_navigational: boolean;
    is_news_breaking: boolean;
    spellcheck_off: boolean;
    country: string;
    bad_results: boolean;
    should_fallback: boolean;
    postal_code: string;
    city: string;
    header_country: string;
    more_results_available: boolean;
    custom_location_label: string;
    reddit_cluster: string;
  };
  mixed: {
    type: string;
    main: SearchResult[];
    top: SearchResult[];
    side: SearchResult[];
  };
  type: string;
  results: SearchResult[];
  faq?: {
    type: string;
    results: Array<{
      question: string;
      answer: string;
      title: string;
      url: string;
    }>;
  };
  infobox?: {
    type: string;
    position: number;
    label: string;
    category: string;
    long_desc: string;
    thumbnail: {
      src: string;
      original: string;
    };
    attributes: Array<{
      label: string;
      value: string;
    }>;
    profiles: Array<{
      name: string;
      url: string;
    }>;
    website: {
      name: string;
      url: string;
      domain: string;
    };
    ratings: Array<{
      name: string;
      rating: string;
      count: number;
      url: string;
    }>;
  };
}

export class BraveSearchProvider {
  private readonly apiKey: string;
  private readonly baseUrl = 'https://api.search.brave.com/res/v1/web/search';
  private readonly userAgent = 'UltraWebAGI/8.0.0 (Industrial; Neural-Engine)';

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.BRAVE_SEARCH_API_KEY || '';
    if (!this.apiKey) {
      console.warn('🔑 Brave Search API key not found. Set BRAVE_SEARCH_API_KEY environment variable.');
    }
  }

  async search(
    query: string,
    options: {
      count?: number;
      offset?: number;
      mkt?: string;
      safesearch?: 'strict' | 'moderate' | 'off';
      freshness?: 'pd' | 'pw' | 'pm' | 'py';
      text_decorations?: boolean;
      spellcheck?: boolean;
      result_filter?: string;
      goggles_id?: string;
      units?: 'metric' | 'imperial';
      extra_snippets?: boolean;
      summary?: boolean;
    } = {}
  ): Promise<WebSearchResponse> {
    if (!this.apiKey) {
      throw new Error('Brave Search API key is required. Please set BRAVE_SEARCH_API_KEY environment variable.');
    }

    const params = new URLSearchParams({
      q: query,
      count: String(options.count || 20),
      offset: String(options.offset || 0),
      mkt: options.mkt || 'en-US',
      safesearch: options.safesearch || 'moderate',
      text_decorations: String(options.text_decorations ?? true),
      spellcheck: String(options.spellcheck ?? true),
      extra_snippets: String(options.extra_snippets ?? true),
      summary: String(options.summary ?? false),
      units: options.units || 'metric',
    });

    // Add optional parameters
    if (options.freshness) params.append('freshness', options.freshness);
    if (options.result_filter) params.append('result_filter', options.result_filter);
    if (options.goggles_id) params.append('goggles_id', options.goggles_id);

    try {
      const response = await fetch(`${this.baseUrl}?${params}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Accept-Encoding': 'gzip',
          'X-Subscription-Token': this.apiKey,
          'User-Agent': this.userAgent,
        },
      });

      if (!response.ok) {
        throw new Error(`Brave Search API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json() as WebSearchResponse;
      
      // Enhanced neural processing of results
      this.enhanceResults(data);
      
      return data;
    } catch (error) {
      console.error('🔍 Brave Search API Error:', error);
      throw error;
    }
  }

  private enhanceResults(data: WebSearchResponse): void {
    // Add neural relevance scoring
    if (data.results) {
      data.results.forEach((result, index) => {
        // Calculate relevance score based on position and content quality
        const positionScore = Math.max(0, 1 - (index * 0.05));
        const contentScore = this.calculateContentScore(result);
        
        // Add computed score (not part of API response but useful for ranking)
        (result as any).neural_score = (positionScore + contentScore) / 2;
        (result as any).enhanced_at = new Date().toISOString();
      });
    }
  }

  private calculateContentScore(result: SearchResult): number {
    let score = 0.5; // Base score
    
    // Title quality
    if (result.title && result.title.length > 10) score += 0.1;
    if (result.title && result.title.length > 30) score += 0.1;
    
    // Description quality
    if (result.description && result.description.length > 50) score += 0.1;
    if (result.description && result.description.length > 150) score += 0.1;
    
    // Extra content
    if (result.extra_snippets && result.extra_snippets.length > 0) score += 0.1;
    
    // Language preference
    if (result.language === 'en') score += 0.05;
    
    // Family friendly content
    if (result.family_friendly) score += 0.05;
    
    return Math.min(1, score);
  }

  async searchWithFallback(query: string, options = {}): Promise<WebSearchResponse> {
    try {
      return await this.search(query, options);
    } catch (error) {
      console.warn('🔄 Primary search failed, attempting fallback...');
      
      // Fallback to simplified query
      const simplifiedQuery = query.split(' ').slice(0, 3).join(' ');
      try {
        return await this.search(simplifiedQuery, { 
          ...options, 
          count: 10,
          extra_snippets: false 
        });
      } catch (fallbackError) {
        console.error('💥 Both primary and fallback searches failed');
        throw fallbackError;
      }
    }
  }

  // Industrial-grade batch search
  async batchSearch(
    queries: string[],
    options = {},
    maxConcurrent = 3
  ): Promise<Array<{ query: string; results?: WebSearchResponse; error?: string }>> {
    const results: Array<{ query: string; results?: WebSearchResponse; error?: string }> = [];
    
    // Process in batches to respect rate limits
    for (let i = 0; i < queries.length; i += maxConcurrent) {
      const batch = queries.slice(i, i + maxConcurrent);
      const batchPromises = batch.map(async (query) => {
        try {
          const results = await this.searchWithFallback(query, options);
          return { query, results };
        } catch (error) {
          return { 
            query, 
            error: error instanceof Error ? error.message : 'Unknown search error' 
          };
        }
      });
      
      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults);
      
      // Rate limiting delay between batches
      if (i + maxConcurrent < queries.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    return results;
  }

  // Get search suggestions (mock implementation - Brave doesn't provide this)
  async getSuggestions(query: string): Promise<string[]> {
    // This would typically use a different endpoint or service
    // For now, return query variations
    const words = query.split(' ');
    const suggestions = [
      query,
      `${query} tutorial`,
      `${query} guide`,
      `${query} examples`,
      `how to ${query}`,
    ];
    
    // Add word variations
    if (words.length > 1) {
      suggestions.push(words.slice(0, -1).join(' '));
      suggestions.push(words.slice(1).join(' '));
    }
    
    return suggestions.slice(0, 8);
  }
}

// Export singleton instance
export const braveSearch = new BraveSearchProvider();

// Export utility functions
export const searchUtils = {
  extractDomain: (url: string): string => {
    try {
      return new URL(url).hostname;
    } catch {
      return url;
    }
  },
  
  truncateDescription: (text: string, maxLength = 160): string => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).replace(/\s+\S*$/, '') + '...';
  },
  
  categorizeResult: (result: SearchResult): string => {
    const url = result.url.toLowerCase();
    const title = result.title.toLowerCase();
    
    if (url.includes('wikipedia.org')) return 'encyclopedia';
    if (url.includes('github.com')) return 'code';
    if (url.includes('stackoverflow.com')) return 'technical';
    if (url.includes('reddit.com')) return 'community';
    if (url.includes('youtube.com')) return 'video';
    if (title.includes('tutorial') || title.includes('guide')) return 'educational';
    if (title.includes('news') || title.includes('breaking')) return 'news';
    
    return 'general';
  },
  
  filterResults: (
    results: SearchResult[], 
    filters: {
      excludeDomains?: string[];
      includeTypes?: string[];
      minDescriptionLength?: number;
      familyFriendlyOnly?: boolean;
    }
  ): SearchResult[] => {
    return results.filter(result => {
      if (filters.excludeDomains) {
        const domain = searchUtils.extractDomain(result.url);
        if (filters.excludeDomains.some(excluded => domain.includes(excluded))) {
          return false;
        }
      }
      
      if (filters.includeTypes && result.type) {
        if (!filters.includeTypes.includes(result.type)) return false;
      }
      
      if (filters.minDescriptionLength && result.description) {
        if (result.description.length < filters.minDescriptionLength) return false;
      }
      
      if (filters.familyFriendlyOnly && result.family_friendly === false) {
        return false;
      }
      
      return true;
    });
  }
};

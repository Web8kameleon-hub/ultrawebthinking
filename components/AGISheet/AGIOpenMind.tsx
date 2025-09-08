'use client'

/**
 * AGI OpenMind Knowledge Module
 * Integrates with Web8 Knowledge Base for real scientific data
 */

import { motion } from 'framer-motion';
import { cva } from 'class-variance-authority';
import { useCallback, useEffect, useRef, useState } from 'react';
import styles from './AGIOpenMind.module.css';

const containerVariants = cva(styles.container, {
  variants: {
    mode: {
      search: styles.searchMode,
      browse: styles.browseMode,
      favorites: styles.favoritesMode,
      history: styles.historyMode
    },
    layout: {
      grid: styles.gridLayout,
      list: styles.listLayout,
      cards: styles.cardsLayout
    }
  }
});

const knowledgeItemVariants = cva(styles.knowledgeItem, {
  variants: {
    type: {
      scientific: styles.scientificItem,
      technical: styles.technicalItem,
      research: styles.researchItem,
      educational: styles.educationalItem
    },
    priority: {
      high: styles.highPriority,
      medium: styles.mediumPriority,
      low: styles.lowPriority
    }
  }
});

interface KnowledgeLink {
  readonly id: string;
  readonly title: string;
  readonly url: string;
  readonly description: string;
  readonly category: string;
  readonly tags: readonly string[];
  readonly priority: 'high' | 'medium' | 'low';
  readonly reliability: number;
  readonly lastUpdated: Date;
  readonly isFavorite: boolean;
}

interface SearchResult {
  readonly results: readonly KnowledgeLink[];
  readonly totalFound: number;
  readonly searchTime: number;
  readonly suggestions: readonly string[];
}

interface AGIOpenMindProps {
  readonly mode?: 'search' | 'browse' | 'favorites' | 'history';
  readonly layout?: 'grid' | 'list' | 'cards';
  readonly enableAGIRecommendations?: boolean;
  readonly maxResults?: number;
}

interface ComponentState {
  currentSearch: string;
  searchResults: SearchResult | null;
  favoriteLinks: readonly KnowledgeLink[];
  searchHistory: readonly string[];
  selectedCategory: string;
  isLoading: boolean;
  recommendations: readonly KnowledgeLink[];
  knowledgeStats: {
    totalLinks: number;
    categoriesCount: number;
    favoritesCount: number;
    searchesCount: number;
  } | null;
}

export const AGIOpenMind = ({
  mode = 'search',
  layout = 'grid',
  enableAGIRecommendations = true,
  maxResults = 20
}: AGIOpenMindProps) => {
  const [state, setState] = useState<ComponentState>({
    currentSearch: '',
    searchResults: null,
    favoriteLinks: [],
    searchHistory: [],
    selectedCategory: 'all',
    isLoading: false,
    recommendations: [],
    knowledgeStats: null
  });

  // Initialize knowledge base
  const initializeKnowledgeBase = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      
      const [statsResponse, favoritesResponse, historyResponse, recommendationsResponse] = await Promise.all([
        fetch('/api/knowledge?action=stats'),
        fetch('/api/knowledge?action=favorites'),
        fetch('/api/knowledge?action=history&limit=10'),
        enableAGIRecommendations ? fetch('/api/knowledge?action=recommendations') : Promise.resolve(null)
      ]);

      const stats = await statsResponse.json();
      const favorites = await favoritesResponse.json();
      const history = await historyResponse.json();
      const recommendations = recommendationsResponse ? await recommendationsResponse.json() : { data: { recommendations: [] } };

      setState(prev => ({
        ...prev,
        knowledgeStats: stats.success ? stats.data.stats : null,
        favoriteLinks: favorites.success ? favorites.data.favorites : [],
        searchHistory: history.success ? history.data.history.map((h: any) => h.query) : [],
        recommendations: recommendations.data.recommendations || [],
        isLoading: false
      }));
    } catch (error) {
      console.error('Knowledge base initialization failed:', error);
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, [enableAGIRecommendations]);

  // Search knowledge base
  const performSearch = useCallback(async (query: string, category?: string) => {
    if (!query.trim()) return;

    try {
      setState(prev => ({ ...prev, isLoading: true }));

      const params = new URLSearchParams({
        action: 'search',
        q: query,
        limit: maxResults.toString()
      });

      if (category && category !== 'all') {
        params.set('category', category);
      }

      const response = await fetch(`/api/knowledge?${params}`);
      const result = await response.json();

      if (result.success) {
        setState(prev => ({
          ...prev,
          searchResults: {
            results: result.data.results || [],
            totalFound: result.data.totalFound || 0,
            searchTime: result.data.searchTime || 0,
            suggestions: result.data.suggestions || []
          },
          currentSearch: query,
          searchHistory: [query, ...prev.searchHistory.filter(h => h !== query)].slice(0, 10),
          isLoading: false
        }));
      } else {
        throw new Error(result.error || 'Search failed');
      }
    } catch (error) {
      console.error('Knowledge search failed:', error);
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, [maxResults]);

  // Toggle favorite
  const toggleFavorite = useCallback(async (linkId: string, isFavorite: boolean) => {
    try {
      const response = await fetch('/api/knowledge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: isFavorite ? 'unfavorite' : 'favorite',
          linkId
        })
      });

      if (response.ok) {
        // Update local state
        setState(prev => ({
          ...prev,
          favoriteLinks: isFavorite 
            ? prev.favoriteLinks.filter(link => link.id !== linkId)
            : [...prev.favoriteLinks],
          searchResults: prev.searchResults ? {
            ...prev.searchResults,
            results: prev.searchResults.results.map(link => 
              link.id === linkId ? { ...link, isFavorite: !isFavorite } : link
            )
          } : null
        }));
      }
    } catch (error) {
      console.error('Toggle favorite failed:', error);
    }
  }, []);

  useEffect(() => {
    initializeKnowledgeBase();
  }, [initializeKnowledgeBase]);

  const renderSearchInterface = () => (
    <div className={styles.searchInterface}>
      <div className={styles.searchInputGroup}>
        <input
          type="text"
          placeholder="Search scientific knowledge, research papers, databases..."
          value={state.currentSearch}
          onChange={(e) => setState(prev => ({ ...prev, currentSearch: e.target.value }))}
          onKeyPress={(e) => e.key === 'Enter' && performSearch(state.currentSearch, state.selectedCategory)}
          className={styles.searchInput}
        />
        <button
          onClick={() => performSearch(state.currentSearch, state.selectedCategory)}
          disabled={state.isLoading}
          className={styles.searchButton}
        >
          {state.isLoading ? 'Searching...' : 'Search'}
        </button>
      </div>

      <div className={styles.categoryFilter}>
        <label htmlFor="categorySelect" className={styles.categoryLabel}>
          Category:
        </label>
        <select
          id="categorySelect"
          value={state.selectedCategory}
          onChange={(e) => setState(prev => ({ ...prev, selectedCategory: e.target.value }))}
          className={styles.categorySelect}
          title="Select knowledge category"
        >
          <option value="all">All Categories</option>
          <option value="biology">Biology</option>
          <option value="chemistry">Chemistry</option>
          <option value="physics">Physics</option>
          <option value="medicine">Medicine</option>
          <option value="environmental">Environmental</option>
          <option value="technology">Technology</option>
          <option value="research">Research</option>
        </select>
      </div>
    </div>
  );

  const renderKnowledgeItem = (link: KnowledgeLink) => (
    <motion.div
      key={link.id}
      className={knowledgeItemVariants({
        type: link.category as any,
        priority: link.priority
      })}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
    >
      <div className={styles.itemHeader}>
        <h3 className={styles.itemTitle}>
          <a href={link.url} target="_blank" rel="noopener noreferrer">
            {link.title}
          </a>
        </h3>
        <button
          onClick={() => toggleFavorite(link.id, link.isFavorite)}
          className={`${styles.favoriteButton} ${link.isFavorite ? styles.favorited : ''}`}
          aria-label={link.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          ★
        </button>
      </div>

      <p className={styles.itemDescription}>{link.description}</p>

      <div className={styles.itemMeta}>
        <span className={styles.category}>{link.category}</span>
        <span className={styles.reliability} data-reliability={Math.round(link.reliability * 100)}>
          {Math.round(link.reliability * 100)}% reliable
        </span>
        <span className={styles.lastUpdated}>
          Updated: {link.lastUpdated.toLocaleDateString()}
        </span>
      </div>

      <div className={styles.itemTags}>
        {link.tags.map(tag => (
          <span key={tag} className={styles.tag}>{tag}</span>
        ))}
      </div>
    </motion.div>
  );

  const renderContent = () => {
    switch (mode) {
      case 'favorites':
        return (
          <div className={styles.favoritesContent}>
            <h2>Favorite Knowledge Links</h2>
            <div className={styles.knowledgeGrid}>
              {state.favoriteLinks.map(renderKnowledgeItem)}
            </div>
          </div>
        );

      case 'history':
        return (
          <div className={styles.historyContent}>
            <h2>Search History</h2>
            <div className={styles.historyList}>
              {state.searchHistory.map((query, index) => (
                <button
                  key={index}
                  onClick={() => performSearch(query, state.selectedCategory)}
                  className={styles.historyItem}
                >
                  {query}
                </button>
              ))}
            </div>
          </div>
        );

      case 'browse':
        return (
          <div className={styles.browseContent}>
            <h2>AGI Recommendations</h2>
            <div className={styles.knowledgeGrid}>
              {state.recommendations.map(renderKnowledgeItem)}
            </div>
          </div>
        );

      case 'search':
      default:
        return (
          <div className={styles.searchContent}>
            {renderSearchInterface()}
            
            {state.searchResults && (
              <div className={styles.searchResults}>
                <div className={styles.resultsHeader}>
                  <h3>
                    Found {state.searchResults.totalFound} results 
                    ({state.searchResults.searchTime}ms)
                  </h3>
                </div>
                
                <div className={styles.knowledgeGrid}>
                  {state.searchResults.results.map(renderKnowledgeItem)}
                </div>

                {state.searchResults.suggestions.length > 0 && (
                  <div className={styles.suggestions}>
                    <h4>Related searches:</h4>
                    <div className={styles.suggestionsList}>
                      {state.searchResults.suggestions.map(suggestion => (
                        <button
                          key={suggestion}
                          onClick={() => performSearch(suggestion, state.selectedCategory)}
                          className={styles.suggestionButton}
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <motion.div
      className={containerVariants({ mode, layout })}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className={styles.header}>
        <h1>AGI OpenMind Knowledge Base</h1>
        {state.knowledgeStats && (
          <div className={styles.stats}>
            <span>{state.knowledgeStats.totalLinks} links</span>
            <span>{state.knowledgeStats.categoriesCount} categories</span>
            <span>{state.knowledgeStats.favoritesCount} favorites</span>
            <span>{state.knowledgeStats.searchesCount} searches</span>
          </div>
        )}
      </div>

      <div className={styles.modeSelector}>
        <button
          onClick={() => setState(prev => ({ ...prev }))}
          className={`${styles.modeButton} ${mode === 'search' ? styles.active : ''}`}
        >
          Search
        </button>
        <button
          onClick={() => setState(prev => ({ ...prev }))}
          className={`${styles.modeButton} ${mode === 'browse' ? styles.active : ''}`}
        >
          Browse
        </button>
        <button
          onClick={() => setState(prev => ({ ...prev }))}
          className={`${styles.modeButton} ${mode === 'favorites' ? styles.active : ''}`}
        >
          Favorites
        </button>
        <button
          onClick={() => setState(prev => ({ ...prev }))}
          className={`${styles.modeButton} ${mode === 'history' ? styles.active : ''}`}
        >
          History
        </button>
      </div>

      {renderContent()}
    </motion.div>
  );
};

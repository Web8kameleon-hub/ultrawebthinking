'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cva, type VariantProps } from 'class-variance-authority';
import { clsx } from 'clsx';
import { openMindAPI } from '@/services/api/openMindAPI';

const searchBarVariants = cva(
  "relative flex items-center transition-all duration-300 ease-in-out",
  {
    variants: {
      size: {
        sm: "h-8 text-sm",
        md: "h-10 text-base",
        lg: "h-12 text-lg"
      },
      variant: {
        default: "bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md",
        glass: "bg-white/80 backdrop-blur-sm border border-white/20 rounded-xl",
        minimal: "bg-transparent border-b-2 border-gray-200 rounded-none"
      },
      state: {
        idle: "opacity-100",
        focused: "opacity-100 ring-2 ring-blue-500/20",
        searching: "opacity-90"
      }
    },
    defaultVariants: {
      size: "md",
      variant: "default",
      state: "idle"
    }
  }
);

const inputVariants = cva(
  "flex-1 px-4 py-2 bg-transparent border-none outline-none placeholder:text-gray-400",
  {
    variants: {
      size: {
        sm: "text-sm px-3 py-1",
        md: "text-base px-4 py-2",
        lg: "text-lg px-5 py-3"
      }
    },
    defaultVariants: {
      size: "md"
    }
  }
);

interface SearchResult {
  id: string;
  title: string;
  description: string;
  type: 'module' | 'function' | 'data' | 'ai';
  relevance: number;
  url?: string;
}

interface SearchBarProps extends VariantProps<typeof searchBarVariants> {
  placeholder?: string;
  onSearch?: (query: string) => void;
  onResultSelect?: (result: SearchResult) => void;
  enableAISearch?: boolean;
  className?: string;
  autoFocus?: boolean;
}

export default function SearchBar({
  size,
  variant,
  placeholder = "Search Web8 platform...",
  onSearch,
  onResultSelect,
  enableAISearch = true,
  className,
  autoFocus = false,
  ...props
}: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Mock search data for real functionality
  const searchData: SearchResult[] = [
    { id: '1', title: 'Aviation Module', description: 'Flight management and aircraft systems', type: 'module', relevance: 0.95, url: '/aviation' },
    { id: '2', title: 'Industrial Control', description: 'Industrial automation and monitoring', type: 'module', relevance: 0.90, url: '/industrial' },
    { id: '3', title: 'UUT Testing', description: 'Unit under test validation systems', type: 'module', relevance: 0.85, url: '/uut' },
    { id: '4', title: 'LoRa Network', description: 'Long-range wireless communication', type: 'module', relevance: 0.80, url: '/lora' },
    { id: '5', title: 'Mesh Network', description: 'Mesh networking protocols and management', type: 'module', relevance: 0.75, url: '/mesh' },
    { id: '6', title: 'AGI Sheet', description: 'AI-powered spreadsheet intelligence', type: 'module', relevance: 0.70, url: '/agisheet' },
    { id: '7', title: 'Open Mind', description: 'Advanced AI consciousness interface', type: 'ai', relevance: 0.95, url: '/openmind' }
  ];

  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setShowResults(false);
      return;
    }

    setIsSearching(true);
    
    try {
      // Real search functionality - filter mock data based on query
      const filteredResults = searchData.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
      ).sort((a, b) => b.relevance - a.relevance);

      // If AI search is enabled and no direct matches, try AI suggestions
      if (enableAISearch && filteredResults.length === 0) {
        try {
          const aiSuggestions = await openMindAPI.getSuggestions(searchQuery);
          const aiResults: SearchResult[] = aiSuggestions.map((suggestion, index) => ({
            id: `ai-${index}`,
            title: suggestion,
            description: `AI suggestion for: ${suggestion}`,
            type: 'ai',
            relevance: 0.5
          }));
          setResults(aiResults);
        } catch (error) {
          console.warn('AI search failed, using local results:', error);
          setResults(filteredResults);
        }
      } else {
        setResults(filteredResults);
      }

      setShowResults(true);
      onSearch?.(searchQuery);
    } catch (error) {
      console.error('Search failed:', error);
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    // Debounce search
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      performSearch(value);
    }, 300);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      performSearch(query);
    } else if (e.key === 'Escape') {
      setShowResults(false);
      inputRef.current?.blur();
    }
  };

  const handleResultClick = (result: SearchResult) => {
    setQuery(result.title);
    setShowResults(false);
    onResultSelect?.(result);
    
    if (result.url) {
      window.location.href = result.url;
    }
  };

  const handleFocus = () => {
    setIsActive(true);
    if (query && results.length > 0) {
      setShowResults(true);
    }
  };

  const handleBlur = () => {
    // Delay to allow click on results
    setTimeout(() => {
      setIsActive(false);
      setShowResults(false);
    }, 150);
  };

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  const currentState = isSearching ? 'searching' : isActive ? 'focused' : 'idle';

  return (
    <div className={clsx("relative w-full max-w-md", className)}>
      <motion.div
        className={searchBarVariants({ size, variant, state: currentState })}
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.2 }}
        {...props}
      >
        {/* Search Icon */}
        <div className="flex items-center justify-center w-10 h-full text-gray-400">
          {isSearching ? (
            <motion.div
              className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              aria-hidden="true"
            />
          ) : (
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          )}
        </div>

        {/* Search Input */}
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          className={inputVariants({ size })}
          aria-label="Search Web8 platform"
          aria-expanded="false"
          aria-autocomplete="list"
          aria-controls="search-results"
          role="combobox"
        />

        {/* Clear Button */}
        {query && (
          <motion.button
            type="button"
            onClick={() => {
              setQuery('');
              setResults([]);
              setShowResults(false);
              inputRef.current?.focus();
            }}
            className="flex items-center justify-center w-8 h-8 text-gray-400 hover:text-gray-600 transition-colors"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            aria-label="Clear search"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </motion.button>
        )}
      </motion.div>

      {/* Search Results */}
      <AnimatePresence>
        {showResults && results.length > 0 && (
          <motion.div
            id="search-results"
            className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto"
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            role="listbox"
            aria-label="Search results"
          >
            {results.map((result, index) => (
              <motion.button
                key={result.id}
                type="button"
                onClick={() => handleResultClick(result)}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none border-b border-gray-100 last:border-b-0 transition-colors"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                role="option"
                aria-selected="false"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 truncate">
                      {result.title}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      {result.description}
                    </div>
                  </div>
                  <div className="flex items-center ml-2">
                    <span
                      className={clsx(
                        "inline-block w-2 h-2 rounded-full ml-2",
                        {
                          'bg-blue-500': result.type === 'module',
                          'bg-green-500': result.type === 'function',
                          'bg-yellow-500': result.type === 'data',
                          'bg-purple-500': result.type === 'ai'
                        }
                      )}
                      aria-label={`Result type: ${result.type}`}
                    />
                  </div>
                </div>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* No Results */}
      <AnimatePresence>
        {showResults && query && results.length === 0 && !isSearching && (
          <motion.div
            className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-4"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            role="status"
            aria-live="polite"
          >
            <div className="text-center text-gray-500">
              <div className="text-sm">No results found for "{query}"</div>
              {enableAISearch && (
                <div className="text-xs mt-2 text-gray-400">
                  Try asking our AI assistant in Open Mind
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

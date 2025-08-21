// Virtual Scrolling Component for Large Lists - TypeScript
// High-performance rendering for AGI data lists

'use client';

import React, { 
  useState, 
  useEffect, 
  useRef, 
  useCallback, 
  useMemo,
  ReactNode 
} from 'react';

interface VirtualScrollItem {
  id: string | number;
  height?: number;
  data?: any;
}

interface VirtualScrollProps<T extends VirtualScrollItem> {
  items: T[];
  itemHeight: number | ((item: T, index: number) => number);
  containerHeight: number;
  renderItem: (item: T, index: number, style: React.CSSProperties) => ReactNode;
  overscan?: number;
  onScroll?: (scrollTop: number, scrollLeft: number) => void;
  className?: string;
  loading?: boolean;
  loadingComponent?: ReactNode;
  emptyComponent?: ReactNode;
  onEndReached?: () => void;
  endReachedThreshold?: number;
}

interface ScrollState {
  scrollTop: number;
  startIndex: number;
  endIndex: number;
  visibleItems: any[];
}

export function VirtualScrollList<T extends VirtualScrollItem>({
  items,
  itemHeight,
  containerHeight,
  renderItem,
  overscan = 5,
  onScroll,
  className = '',
  loading = false,
  loadingComponent,
  emptyComponent,
  onEndReached,
  endReachedThreshold = 200
}: VirtualScrollProps<T>) {
  const [scrollState, setScrollState] = useState<ScrollState>({
    scrollTop: 0,
    startIndex: 0,
    endIndex: 0,
    visibleItems: []
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Calculate item heights
  const itemHeights = useMemo(() => {
    if (typeof itemHeight === 'number') {
      return items.map(() => itemHeight);
    }
    return items.map((item, index) => itemHeight(item, index));
  }, [items, itemHeight]);

  // Calculate total height and cumulative heights
  const { totalHeight, cumulativeHeights } = useMemo(() => {
    const cumulative: number[] = [0];
    let total = 0;
    
    itemHeights.forEach(height => {
      total += height;
      cumulative.push(total);
    });
    
    return {
      totalHeight: total,
      cumulativeHeights: cumulative
    };
  }, [itemHeights]);

  // Binary search for start index
  const findStartIndex = useCallback((scrollTop: number): number => {
    let left = 0;
    let right = cumulativeHeights.length - 1;
    
    while (left < right) {
      const mid = Math.floor((left + right) / 2);
      if (cumulativeHeights[mid] < scrollTop) {
        left = mid + 1;
      } else {
        right = mid;
      }
    }
    
    return Math.max(0, left - 1);
  }, [cumulativeHeights]);

  // Calculate visible range
  const calculateVisibleRange = useCallback((scrollTop: number) => {
    const startIndex = Math.max(0, findStartIndex(scrollTop) - overscan);
    let endIndex = startIndex;
    
    // Find end index
    let currentHeight = 0;
    const viewportBottom = scrollTop + containerHeight;
    
    for (let i = startIndex; i < items.length; i++) {
      if (cumulativeHeights[i] >= viewportBottom) {
        endIndex = Math.min(items.length - 1, i + overscan);
        break;
      }
      endIndex = i;
    }
    
    return { startIndex, endIndex };
  }, [findStartIndex, containerHeight, overscan, items.length, cumulativeHeights]);

  // Update visible items when scroll changes
  const updateVisibleItems = useCallback((scrollTop: number) => {
    const { startIndex, endIndex } = calculateVisibleRange(scrollTop);
    const visibleItems = items.slice(startIndex, endIndex + 1);
    
    setScrollState({
      scrollTop,
      startIndex,
      endIndex,
      visibleItems
    });

    // Check if we're near the end for infinite loading
    if (onEndReached && endReachedThreshold) {
      const scrollBottom = scrollTop + containerHeight;
      const distanceFromEnd = totalHeight - scrollBottom;
      
      if (distanceFromEnd <= endReachedThreshold) {
        onEndReached();
      }
    }
  }, [
    calculateVisibleRange,
    items,
    onEndReached,
    endReachedThreshold,
    containerHeight,
    totalHeight
  ]);

  // Handle scroll events
  const handleScroll = useCallback((event: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = event.currentTarget.scrollTop;
    const scrollLeft = event.currentTarget.scrollLeft;
    
    updateVisibleItems(scrollTop);
    onScroll?.(scrollTop, scrollLeft);
  }, [updateVisibleItems, onScroll]);

  // Initialize visible items
  useEffect(() => {
    updateVisibleItems(0);
  }, [updateVisibleItems]);

  // Auto-scroll to maintain position when items change
  useEffect(() => {
    if (containerRef.current && scrollState.scrollTop > 0) {
      containerRef.current.scrollTop = scrollState.scrollTop;
    }
  }, [items.length]);

  // Render loading state
  if (loading && items.length === 0) {
    return (
      <div className={`virtual-scroll-container ${className}`} style={{ height: containerHeight }}>
        {loadingComponent || (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <span className="ml-2 text-gray-600">Loading AGI data...</span>
          </div>
        )}
      </div>
    );
  }

  // Render empty state
  if (items.length === 0) {
    return (
      <div className={`virtual-scroll-container ${className}`} style={{ height: containerHeight }}>
        {emptyComponent || (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <div className="text-4xl mb-2">📊</div>
              <div>No AGI data available</div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className={`virtual-scroll-container overflow-auto ${className}`}
      style={{ height: containerHeight }}
      onScroll={handleScroll}
    >
      <div 
        ref={contentRef}
        className="virtual-scroll-content relative"
        style={{ height: totalHeight }}
      >
        {scrollState.visibleItems.map((item, virtualIndex) => {
          const actualIndex = scrollState.startIndex + virtualIndex;
          const top = cumulativeHeights[actualIndex];
          const height = itemHeights[actualIndex];
          
          const style: React.CSSProperties = {
            position: 'absolute',
            top,
            left: 0,
            right: 0,
            height,
            zIndex: 1
          };
          
          return (
            <div key={item.id} style={style}>
              {renderItem(item, actualIndex, style)}
            </div>
          );
        })}
        
        {/* Loading indicator for infinite loading */}
        {loading && items.length > 0 && (
          <div 
            className="absolute left-0 right-0 flex items-center justify-center py-4"
            style={{ top: totalHeight, height: 60 }}
          >
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
            <span className="ml-2 text-sm text-gray-600">Loading more...</span>
          </div>
        )}
      </div>
    </div>
  );
}

// AGI-specific Virtual List for Economic Data
interface AGIDataItem extends VirtualScrollItem {
  type: 'economic' | 'crypto' | 'market' | 'pattern';
  timestamp: number;
  value: number;
  confidence: number;
  metadata?: Record<string, any>;
}

interface AGIVirtualListProps {
  data: AGIDataItem[];
  onItemClick?: (item: AGIDataItem, index: number) => void;
  onLoadMore?: () => void;
  loading?: boolean;
  className?: string;
  containerHeight?: number;
}

export function AGIVirtualList({
  data,
  onItemClick,
  onLoadMore,
  loading = false,
  className = '',
  containerHeight = 400
}: AGIVirtualListProps) {
  const renderAGIItem = useCallback((
    item: AGIDataItem, 
    index: number, 
    style: React.CSSProperties
  ) => {
    const getTypeIcon = (type: string) => {
      switch (type) {
        case 'economic': return '💰';
        case 'crypto': return '₿';
        case 'market': return '📈';
        case 'pattern': return '🔍';
        default: return '📊';
      }
    };

    const getConfidenceColor = (confidence: number) => {
      if (confidence >= 0.8) return 'text-green-600';
      if (confidence >= 0.6) return 'text-yellow-600';
      return 'text-red-600';
    };

    return (
      <div 
        className={`
          bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 
          hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors
          px-4 py-3 flex items-center justify-between
        `}
        onClick={() => onItemClick?.(item, index)}
      >
        <div className="flex items-center space-x-3">
          <div className="text-2xl">{getTypeIcon(item.type)}</div>
          <div>
            <div className="font-medium text-gray-900 dark:text-gray-100">
              {item.type.charAt(0).toUpperCase() + item.type.slice(1)} Analysis #{item.id}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {new Date(item.timestamp).toLocaleString()}
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <div className="font-bold text-lg text-gray-900 dark:text-gray-100">
              {typeof item.value === 'number' ? item.value.toFixed(2) : item.value}
            </div>
            <div className={`text-sm font-medium ${getConfidenceColor(item.confidence)}`}>
              {(item.confidence * 100).toFixed(1)}% confidence
            </div>
          </div>
          <div className="w-2 h-2 rounded-full bg-blue-500"></div>
        </div>
      </div>
    );
  }, [onItemClick]);

  return (
    <VirtualScrollList
      items={data}
      itemHeight={80}
      containerHeight={containerHeight}
      renderItem={renderAGIItem}
      className={`border border-gray-200 dark:border-gray-700 rounded-lg ${className}`}
      onEndReached={onLoadMore}
      loading={loading}
      loadingComponent={
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <div className="text-gray-600 dark:text-gray-400">Loading AGI analysis data...</div>
          </div>
        </div>
      }
      emptyComponent={
        <div className="flex items-center justify-center h-full">
          <div className="text-center text-gray-500 dark:text-gray-400">
            <div className="text-6xl mb-4">🤖</div>
            <div className="text-lg font-medium">No AGI data available</div>
            <div className="text-sm">Start an analysis to see results here</div>
          </div>
        </div>
      }
    />
  );
}

// Hook for managing virtual scroll state
export function useVirtualScroll<T extends VirtualScrollItem>(
  items: T[],
  itemHeight: number,
  containerHeight: number
) {
  const [scrollTop, setScrollTop] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleScroll = useCallback((newScrollTop: number) => {
    setScrollTop(newScrollTop);
    setIsScrolling(true);
    
    // Clear existing timeout
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    
    // Set scrolling to false after 150ms of no scrolling
    scrollTimeoutRef.current = setTimeout(() => {
      setIsScrolling(false);
    }, 150);
  }, []);

  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  const visibleRange = useMemo(() => {
    const startIndex = Math.floor(scrollTop / itemHeight);
    const endIndex = Math.min(
      items.length - 1,
      Math.ceil((scrollTop + containerHeight) / itemHeight)
    );
    
    return { startIndex, endIndex };
  }, [scrollTop, itemHeight, containerHeight, items.length]);

  return {
    scrollTop,
    isScrolling,
    visibleRange,
    handleScroll,
    totalHeight: items.length * itemHeight
  };
}

export default VirtualScrollList;

// EuroWeb Ultra Performance Monitor - TypeScript
// Real-time performance tracking dhe optimization

interface PerformanceMetrics {
  pageLoadTime: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
  firstInputDelay: number;
  totalBlockingTime: number;
  timeToInteractive: number;
}

interface AGIPerformanceMetrics {
  responseTime: number;
  processingTime: number;
  cacheHitRate: number;
  errorRate: number;
  throughput: number;
}

interface NetworkMetrics {
  connectionType: string;
  effectiveType: string;
  rtt: number;
  downlink: number;
}

class EuroWebPerformanceMonitor {
  private metrics: PerformanceMetrics | null = null;
  private agiMetrics: AGIPerformanceMetrics | null = null;
  private networkMetrics: NetworkMetrics | null = null;
  private observer: PerformanceObserver | null = null;

  constructor() {
    this.initializeMonitoring();
  }

  private initializeMonitoring(): void {
    // Web Vitals monitoring
    this.observeWebVitals();
    
    // Network monitoring
    this.observeNetworkConditions();
    
    // AGI performance monitoring
    this.observeAGIPerformance();
    
    // Resource monitoring
    this.observeResourceTiming();
  }

  private observeWebVitals(): void {
    try {
      // Largest Contentful Paint
      this.observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        for (const entry of entries) {
          if (entry.entryType === 'largest-contentful-paint') {
            this.updateMetric('largestContentfulPaint', entry.startTime);
          }
          
          if (entry.entryType === 'first-input') {
            this.updateMetric('firstInputDelay', (entry as any).processingStart - entry.startTime);
          }
          
          if (entry.entryType === 'layout-shift' && !(entry as any).hadRecentInput) {
            this.updateMetric('cumulativeLayoutShift', (entry as any).value);
          }
        }
      });

      this.observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] });
    } catch (error) {
      console.warn('[Performance] Web Vitals observation failed:', error);
    }
  }

  private observeNetworkConditions(): void {
    try {
      const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
      
      if (connection) {
        this.networkMetrics = {
          connectionType: connection.type || 'unknown',
          effectiveType: connection.effectiveType || 'unknown',
          rtt: connection.rtt || 0,
          downlink: connection.downlink || 0
        };

        connection.addEventListener('change', () => {
          this.updateNetworkMetrics();
        });
      }
    } catch (error) {
      console.warn('[Performance] Network monitoring failed:', error);
    }
  }

  private observeAGIPerformance(): void {
    // Monitor AGI API calls
    const originalFetch = window.fetch;
    
    window.fetch = async (...args: Parameters<typeof fetch>): Promise<Response> => {
      const [resource, config] = args;
      const url = resource.toString();
      
      if (url.includes('/api/agi/')) {
        const startTime = performance.now();
        
        try {
          const response = await originalFetch(...args);
          const endTime = performance.now();
          
          this.trackAGIRequest({
            url,
            responseTime: endTime - startTime,
            status: response.status,
            success: response.ok
          });
          
          return response;
        } catch (error) {
          const endTime = performance.now();
          
          this.trackAGIRequest({
            url,
            responseTime: endTime - startTime,
            status: 0,
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
          });
          
          throw error;
        }
      }
      
      return originalFetch(...args);
    };
  }

  private observeResourceTiming(): void {
    try {
      const resourceObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        
        for (const entry of entries) {
          if (entry.entryType === 'resource') {
            const resourceEntry = entry as PerformanceResourceTiming;
            
            // Monitor slow resources
            if (resourceEntry.duration > 1000) {
              console.warn('[Performance] Slow resource detected:', {
                name: resourceEntry.name,
                duration: resourceEntry.duration,
                type: resourceEntry.initiatorType
              });
            }
            
            // Monitor failed resources
            if (resourceEntry.transferSize === 0 && resourceEntry.duration > 0) {
              console.warn('[Performance] Resource failed to load:', resourceEntry.name);
            }
          }
        }
      });

      resourceObserver.observe({ entryTypes: ['resource'] });
    } catch (error) {
      console.warn('[Performance] Resource timing observation failed:', error);
    }
  }

  private updateMetric(metric: keyof PerformanceMetrics, value: number): void {
    if (!this.metrics) {
      this.metrics = {
        pageLoadTime: 0,
        firstContentfulPaint: 0,
        largestContentfulPaint: 0,
        cumulativeLayoutShift: 0,
        firstInputDelay: 0,
        totalBlockingTime: 0,
        timeToInteractive: 0
      };
    }

    this.metrics[metric] = value;
    this.reportMetrics();
  }

  private updateNetworkMetrics(): void {
    try {
      const connection = (navigator as any).connection;
      if (connection && this.networkMetrics) {
        this.networkMetrics.connectionType = connection.type || 'unknown';
        this.networkMetrics.effectiveType = connection.effectiveType || 'unknown';
        this.networkMetrics.rtt = connection.rtt || 0;
        this.networkMetrics.downlink = connection.downlink || 0;
      }
    } catch (error) {
      console.warn('[Performance] Network metrics update failed:', error);
    }
  }

  private trackAGIRequest(data: {
    url: string;
    responseTime: number;
    status: number;
    success: boolean;
    error?: string;
  }): void {
    if (!this.agiMetrics) {
      this.agiMetrics = {
        responseTime: 0,
        processingTime: 0,
        cacheHitRate: 0,
        errorRate: 0,
        throughput: 0
      };
    }

    // Update AGI metrics
    this.agiMetrics.responseTime = data.responseTime;
    
    if (!data.success) {
      this.agiMetrics.errorRate += 1;
    }

    // Log për debugging
    console.log('[Performance] AGI Request tracked:', {
      url: data.url,
      responseTime: `${data.responseTime.toFixed(2)}ms`,
      status: data.status,
      success: data.success
    });
  }

  private reportMetrics(): void {
    // Send metrics to analytics (në një implementim real)
    if (this.metrics) {
      console.log('[Performance] Current metrics:', this.metrics);
      
      // Optimize based on metrics
      this.optimizeBasedOnMetrics();
    }
  }

  private optimizeBasedOnMetrics(): void {
    if (!this.metrics) return;

    // Auto-optimization based on performance
    if (this.metrics.largestContentfulPaint > 2500) {
      console.warn('[Performance] LCP is slow, considering optimizations');
      this.suggestOptimizations('lcp');
    }

    if (this.metrics.firstInputDelay > 100) {
      console.warn('[Performance] FID is slow, considering optimizations');
      this.suggestOptimizations('fid');
    }

    if (this.metrics.cumulativeLayoutShift > 0.1) {
      console.warn('[Performance] CLS is high, considering optimizations');
      this.suggestOptimizations('cls');
    }
  }

  private suggestOptimizations(metric: string): void {
    const optimizations = {
      lcp: [
        'Preload critical resources',
        'Optimize images',
        'Use CDN for static assets',
        'Implement resource prioritization'
      ],
      fid: [
        'Code splitting',
        'Reduce JavaScript execution time', 
        'Use web workers for heavy tasks',
        'Defer non-critical JavaScript'
      ],
      cls: [
        'Set dimensions for images and videos',
        'Avoid inserting content above existing content',
        'Use CSS transforms instead of layout changes',
        'Preload web fonts'
      ]
    };

    console.log(`[Performance] Suggested optimizations for ${metric.toUpperCase()}:`, optimizations[metric as keyof typeof optimizations]);
  }

  // Public API
  public getMetrics(): {
    performance: PerformanceMetrics | null;
    agi: AGIPerformanceMetrics | null;
    network: NetworkMetrics | null;
  } {
    return {
      performance: this.metrics,
      agi: this.agiMetrics,
      network: this.networkMetrics
    };
  }

  public clearMetrics(): void {
    this.metrics = null;
    this.agiMetrics = null;
  }

  public startContinuousMonitoring(): void {
    setInterval(() => {
      this.reportMetrics();
    }, 30000); // Report every 30 seconds
  }

  public dispose(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}

// Global instance
export const performanceMonitor = new EuroWebPerformanceMonitor();

// Auto-start monitoring
if (typeof window !== 'undefined') {
  performanceMonitor.startContinuousMonitoring();
  
  // Expose për debugging
  (window as any).eurowebPerformance = performanceMonitor;
}

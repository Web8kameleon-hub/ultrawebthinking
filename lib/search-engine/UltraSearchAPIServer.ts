/**
 * WEB8 Search API Server - Clean TypeScript Implementation
 * Real-time statistics, ESLint compliant, optimized
 * 
 * @version 8.0.0-CLEAN
 * @author Ledjan Ahmati (100% Owner)
 * @contact dealsjona@gmail.com
 */

import { Request, Response, NextFunction, Application } from 'express';
import { MultiSearchEngine } from './MultiSearchEngine';

// CommonJS imports for middleware
// eslint-disable-next-line @typescript-eslint/no-var-requires
const express = require('express');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const cors = require('cors');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const helmet = require('helmet');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const compression = require('compression');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const rateLimit = require('express-rate-limit');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const winston = require('winston');

// Global extensions
declare global {
  namespace Express {
    interface Request {
      requestId?: string;
      startTime?: number;
      userId?: string;
    }
  }
}

// Types & Interfaces
export interface SearchAPIConfig {
  port: number;
  host: string;
  enableCors: boolean;
  enableSecurity: boolean;
  enableCompression: boolean;
  enableRateLimit: boolean;
  rateLimit: {
    windowMs: number;
    max: number;
  };
  enableAuth: boolean;
  apiKey?: string;
  enableLogging: boolean;
  enableMetrics: boolean;
  enableCache: boolean;
  cacheSize: number;
}

export interface APIResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: number;
  requestId: string;
  performance?: {
    queryTime: number;
    resultCount: number;
    engines: string[];
    cached?: boolean;
  };
  pagination?: {
    page: number;
    limit: number;
    total: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface RealTimeMetrics {
  totalQueries: number;
  successfulQueries: number;
  failedQueries: number;
  averageResponseTime: number;
  currentRPS: number;
  peakRPS: number;
  popularQueries: Record<string, number>;
  engineStats: Record<string, {
    queries: number;
    successRate: number;
    avgResponseTime: number;
  }>;
  errorRate: number;
  uptime: number;
  memoryUsage: NodeJS.MemoryUsage;
  activeConnections: number;
  cacheHitRate: number;
  topErrors: Record<string, number>;
}

export interface CacheEntry {
  timestamp: number;
  results: Record<string, unknown>;
  hits: number;
}

/**
 * Clean Search API Server
 */
export class UltraSearchAPIServer {
  private app!: Application;
  private readonly config: SearchAPIConfig;
  private readonly searchEngine: MultiSearchEngine;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private logger!: any;
  private metrics!: RealTimeMetrics;
  private readonly startTime: number;
  private requestCount = 0;
  private errorCount = 0;
  private successCount = 0;
  private readonly queryCache = new Map<string, CacheEntry>();
  private readonly rpsCounter = new Map<number, number>();
  private activeConnections = 0;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private server!: any;

  public constructor(config: Partial<SearchAPIConfig> = {}) {
    this.config = {
      port: 3001,
      host: '0.0.0.0',
      enableCors: true,
      enableSecurity: true,
      enableCompression: true,
      enableRateLimit: true,
      rateLimit: {
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 1000 // requests per windowMs
      },
      enableAuth: false,
      enableLogging: true,
      enableMetrics: true,
      enableCache: true,
      cacheSize: 1000,
      ...config
    };

    this.startTime = Date.now();
    this.searchEngine = new MultiSearchEngine();
    this.initializeLogger();
    this.initializeMetrics();
    this.initializeApp();
    this.setupCleanupTasks();
  }

  /**
   * Initialize Winston Logger
   */
  private initializeLogger(): void {
    this.logger = winston.createLogger({
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json()
      ),
      defaultMeta: { service: 'ultra-search-api' },
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
          )
        })
      ]
    });
  }

  /**
   * Initialize Real-time Metrics
   */
  private initializeMetrics(): void {
    this.metrics = {
      totalQueries: 0,
      successfulQueries: 0,
      failedQueries: 0,
      averageResponseTime: 0,
      currentRPS: 0,
      peakRPS: 0,
      popularQueries: {},
      engineStats: {},
      errorRate: 0,
      uptime: 0,
      memoryUsage: process.memoryUsage(),
      activeConnections: 0,
      cacheHitRate: 0,
      topErrors: {}
    };

    // Update metrics every second
    setInterval(() => {
      this.updateRealTimeMetrics();
    }, 1000);
  }

  /**
   * Initialize Express App
   */
  private initializeApp(): void {
    this.app = express();
    this.setupMiddleware();
    this.setupRoutes();
    this.setupErrorHandling();
  }

  /**
   * Setup Express Middleware
   */
  private setupMiddleware(): void {
    // Security
    if (this.config.enableSecurity) {
      this.app.use(helmet());
    }

    // Compression
    if (this.config.enableCompression) {
      this.app.use(compression());
    }

    // CORS
    if (this.config.enableCors) {
      this.app.use(cors({
        origin: true,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key', 'X-Request-ID']
      }));
    }

    // Body parsing
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Rate limiting
    if (this.config.enableRateLimit) {
      const limiter = rateLimit({
        windowMs: this.config.rateLimit.windowMs,
        max: this.config.rateLimit.max,
        message: {
          success: false,
          error: 'Too many requests from this IP, please try again later.',
          timestamp: Date.now(),
          requestId: 'rate-limited'
        },
        standardHeaders: true,
        legacyHeaders: false
      });
      this.app.use('/api/', limiter);
    }

    // Request tracking
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      this.requestCount++;
      this.activeConnections++;
      req.requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      req.startTime = Date.now();

      // Track RPS
      const currentSecond = Math.floor(Date.now() / 1000);
      this.rpsCounter.set(currentSecond, (this.rpsCounter.get(currentSecond) || 0) + 1);

      // Cleanup old RPS data
      const cutoff = currentSecond - 60;
      const keysToDelete: number[] = [];
      this.rpsCounter.forEach((value, key) => {
        if (key < cutoff) {
          keysToDelete.push(key);
        }
      });
      keysToDelete.forEach(key => this.rpsCounter.delete(key));

      // Cleanup on response finish
      res.on('finish', () => {
        this.activeConnections--;
        if (res.statusCode >= 400) {
          this.errorCount++;
        } else {
          this.successCount++;
        }
      });

      next();
    });
  }

  /**
   * Setup API Routes
   */
  private setupRoutes(): void {
    // Health check
    this.app.get('/health', (req: Request, res: Response) => {
      res.json(this.createResponse(true, {
        status: 'healthy',
        uptime: Date.now() - this.startTime,
        version: '8.0.0-CLEAN',
        timestamp: Date.now(),
        memory: process.memoryUsage(),
        activeConnections: this.activeConnections
      }, undefined, req.requestId || 'unknown'));
    });

    // Multi-engine search
    this.app.route('/api/search')
      .get(this.handleSearch.bind(this))
      .post(this.handleSearch.bind(this));

    // Real-time metrics
    this.app.get('/api/metrics', this.handleGetMetrics.bind(this));

    // Search engines management
    this.app.get('/api/engines', this.handleGetEngines.bind(this));

    // Cache management
    this.app.get('/api/cache/stats', this.handleCacheStats.bind(this));
    this.app.delete('/api/cache', this.handleClearCache.bind(this));

    // Export functionality
    this.app.post('/api/export', this.handleExport.bind(this));

    // Search suggestions
    this.app.get('/api/suggest', this.handleSuggestions.bind(this));
  }

  /**
   * Handle Search Request
   */
  private async handleSearch(req: Request, res: Response): Promise<void> {
    try {
      const startTime = Date.now();
      const query = req.body.q || req.query['q'] as string;

      if (!query || query.trim().length === 0) {
        res.status(400).json(this.createResponse(
          false,
          null,
          'Query parameter is required and cannot be empty',
          req.requestId || 'unknown'
        ));
        return;
      }

      // Parse parameters
      const engines = this.parseEngines(req.body.engines || req.query['engines']);
      const maxResults = Math.min(parseInt(req.body.maxResults || req.query['maxResults'] as string) || 50, 200);

      // Check cache first
      const cacheKey = `search_${query}_${engines.join(',')}_${maxResults}`;
      const cached = this.queryCache.get(cacheKey);
      
      if (cached && this.config.enableCache && (Date.now() - cached.timestamp < 300000)) {
        cached.hits++;
        const responseTime = Date.now() - startTime;
        
        this.updateSearchMetrics(query, responseTime, engines);
        
        res.json(this.createResponse(
          true,
          { ...cached.results, cached: true, cacheHits: cached.hits },
          undefined,
          req.requestId || 'unknown',
          { queryTime: responseTime, resultCount: (cached.results as { results?: unknown[] }).results?.length || 0, engines, cached: true }
        ));
        return;
      }

      // Execute search
      const searchOptions = {
        maxResults,
        engines: engines.length > 0 ? engines : undefined
      };

      const searchResult = await this.searchEngine.search(query, searchOptions);

      const response = {
        results: searchResult,
        totalResults: searchResult.length,
        searchTime: Date.now() - startTime,
        engines: engines.length > 0 ? engines : ['default'],
        query: query.trim()
      };

      // Cache results
      if (this.config.enableCache) {
        if (this.queryCache.size >= this.config.cacheSize) {
          const oldestKey = this.queryCache.keys().next().value;
          if (oldestKey) {
            this.queryCache.delete(oldestKey);
          }
        }
        this.queryCache.set(cacheKey, { timestamp: Date.now(), results: response, hits: 1 });
      }

      const responseTime = Date.now() - startTime;
      this.updateSearchMetrics(query, responseTime, engines);

      res.json(this.createResponse(
        true,
        response,
        undefined,
        req.requestId || 'unknown',
        { queryTime: responseTime, resultCount: searchResult.length, engines }
      ));

    } catch (error) {
      this.handleError(error, req, res);
    }
  }

  /**
   * Handle Export
   */
  private async handleExport(req: Request, res: Response): Promise<void> {
    try {
      const { data, format = 'json' }: { data: unknown[]; format: string } = req.body;

      if (!data || !Array.isArray(data)) {
        res.status(400).json(this.createResponse(
          false,
          null,
          'Data array is required for export',
          req.requestId || 'unknown'
        ));
        return;
      }

      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      let content: string;
      let mimeType: string;
      let filename: string;

      switch (format.toLowerCase()) {
        case 'csv':
          content = this.convertToCSV(data);
          mimeType = 'text/csv';
          filename = `search-export-${timestamp}.csv`;
          break;

        case 'xml':
          content = this.convertToXML(data);
          mimeType = 'application/xml';
          filename = `search-export-${timestamp}.xml`;
          break;

        default:
          content = JSON.stringify(data, null, 2);
          mimeType = 'application/json';
          filename = `search-export-${timestamp}.json`;
      }

      res.setHeader('Content-Type', mimeType);
      res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
      res.send(content);

    } catch (error) {
      this.handleError(error, req, res);
    }
  }

  /**
   * Convert data to CSV
   */
  private convertToCSV(data: unknown[]): string {
    if (data.length === 0) return '';
    
    const firstItem = data[0];
    if (typeof firstItem !== 'object' || firstItem === null) return '';
    
    const headers = Object.keys(firstItem);
    const csvRows = [
      headers.join(','),
      ...data.map(row => {
        if (typeof row !== 'object' || row === null) return '';
        return headers.map(header => {
          const value = (row as Record<string, unknown>)[header];
          const stringValue = String(value ?? '');
          return stringValue.includes(',') ? `"${stringValue.replace(/"/g, '""')}"` : stringValue;
        }).join(',');
      })
    ];
    
    return csvRows.join('\n');
  }

  /**
   * Convert data to XML
   */
  private convertToXML(data: unknown[]): string {
    const xmlRows = data.map(item => {
      if (typeof item !== 'object' || item === null) return '<item></item>';
      
      const fields = Object.entries(item).map(([key, value]) => 
        `<${key}>${this.escapeXML(String(value ?? ''))}</${key}>`
      ).join('');
      return `<item>${fields}</item>`;
    }).join('');
    
    return `<?xml version="1.0" encoding="UTF-8"?><data>${xmlRows}</data>`;
  }

  /**
   * Update Real-time Metrics
   */
  private updateRealTimeMetrics(): void {
    this.metrics.uptime = Date.now() - this.startTime;
    this.metrics.totalQueries = this.requestCount;
    this.metrics.successfulQueries = this.successCount;
    this.metrics.failedQueries = this.errorCount;
    this.metrics.errorRate = this.requestCount > 0 ? (this.errorCount / this.requestCount) * 100 : 0;
    this.metrics.memoryUsage = process.memoryUsage();
    this.metrics.activeConnections = this.activeConnections;

    // Calculate current RPS
    const currentSecond = Math.floor(Date.now() / 1000);
    this.metrics.currentRPS = this.rpsCounter.get(currentSecond) || 0;
    
    // Calculate peak RPS
    let maxRPS = 0;
    this.rpsCounter.forEach(value => {
      if (value > maxRPS) maxRPS = value;
    });
    this.metrics.peakRPS = Math.max(this.metrics.peakRPS, maxRPS);

    // Calculate cache hit rate
    let totalCacheHits = 0;
    this.queryCache.forEach(cache => {
      totalCacheHits += cache.hits;
    });
    this.metrics.cacheHitRate = this.requestCount > 0 ? (totalCacheHits / this.requestCount) * 100 : 0;
  }

  /**
   * Update Search Metrics
   */
  private updateSearchMetrics(query: string, responseTime: number, engines: string[]): void {
    // Update popular queries
    this.metrics.popularQueries[query] = (this.metrics.popularQueries[query] || 0) + 1;

    // Update average response time
    this.metrics.averageResponseTime = (this.metrics.averageResponseTime + responseTime) / 2;

    // Update engine stats
    engines.forEach(engine => {
      if (!this.metrics.engineStats[engine]) {
        this.metrics.engineStats[engine] = {
          queries: 0,
          successRate: 0,
          avgResponseTime: 0
        };
      }
      
      const stats = this.metrics.engineStats[engine];
      stats.queries++;
      stats.avgResponseTime = (stats.avgResponseTime + responseTime) / 2;
      stats.successRate = 100; // Simplified for now
    });
  }

  /**
   * Handler methods
   */
  private async handleGetMetrics(req: Request, res: Response): Promise<void> {
    this.updateRealTimeMetrics();
    res.json(this.createResponse(true, this.metrics, undefined, req.requestId || 'unknown'));
  }

  private async handleGetEngines(req: Request, res: Response): Promise<void> {
    const engines = this.searchEngine.getEngines();
    res.json(this.createResponse(true, engines, undefined, req.requestId || 'unknown'));
  }

  private async handleCacheStats(req: Request, res: Response): Promise<void> {
    const stats = {
      size: this.queryCache.size,
      maxSize: this.config.cacheSize,
      hitRate: this.metrics.cacheHitRate
    };
    res.json(this.createResponse(true, stats, undefined, req.requestId || 'unknown'));
  }

  private async handleClearCache(req: Request, res: Response): Promise<void> {
    this.queryCache.clear();
    res.json(this.createResponse(true, { message: 'Cache cleared successfully' }, undefined, req.requestId || 'unknown'));
  }

  private async handleSuggestions(req: Request, res: Response): Promise<void> {
    const query = req.query['q'] as string;
    if (!query || query.length < 2) {
      res.json(this.createResponse(true, [], undefined, req.requestId || 'unknown'));
      return;
    }

    const suggestions = await this.searchEngine.suggest(query);
    res.json(this.createResponse(true, suggestions, undefined, req.requestId || 'unknown'));
  }

  /**
   * Error Handling
   */
  private handleError(error: unknown, req: Request, res: Response): void {
    this.errorCount++;
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    // Log error
    this.logger.error('API Error', {
      requestId: req.requestId,
      error: errorMessage,
      url: req.url,
      method: req.method,
      ip: req.ip
    });

    // Update error metrics
    this.metrics.topErrors[errorMessage] = (this.metrics.topErrors[errorMessage] || 0) + 1;

    // Send error response
    res.status(500).json(this.createResponse(
      false,
      null,
      errorMessage,
      req.requestId || 'unknown'
    ));
  }

  /**
   * Setup Error Handling
   */
  private setupErrorHandling(): void {
    // 404 handler
    this.app.use('*', (req: Request, res: Response) => {
      res.status(404).json(this.createResponse(
        false,
        null,
        'Endpoint not found',
        req.requestId || 'unknown'
      ));
    });
  }

  /**
   * Helper Methods
   */
  private createResponse<T>(
    success: boolean,
    data: T | null,
    error?: string,
    requestId?: string,
    performance?: {
      queryTime: number;
      resultCount: number;
      engines: string[];
      cached?: boolean;
    }
  ): APIResponse<T> {
    const response: APIResponse<T> = {
      success,
      timestamp: Date.now(),
      requestId: requestId || 'unknown'
    };

    if (success && data !== null) response.data = data;
    if (!success && error) response.error = error;
    if (performance) response.performance = performance;

    return response;
  }

  private parseEngines(engines: unknown): string[] {
    if (!engines) return [];
    if (typeof engines === 'string') return engines.split(',').map(e => e.trim());
    if (Array.isArray(engines)) return engines;
    return [];
  }

  private escapeXML(str: string): string {
    return str.replace(/[<>&'"]/g, (c) => {
      switch (c) {
        case '<': return '&lt;';
        case '>': return '&gt;';
        case '&': return '&amp;';
        case "'": return '&apos;';
        case '"': return '&quot;';
        default: return c;
      }
    });
  }

  /**
   * Cleanup Tasks
   */
  private setupCleanupTasks(): void {
    // Cleanup old cache entries every hour
    setInterval(() => {
      const cutoff = Date.now() - (60 * 60 * 1000); // 1 hour
      const keysToDelete: string[] = [];
      this.queryCache.forEach((cache, key) => {
        if (cache.timestamp < cutoff) {
          keysToDelete.push(key);
        }
      });
      keysToDelete.forEach(key => this.queryCache.delete(key));
    }, 60 * 60 * 1000);
  }

  /**
   * Server Lifecycle
   */
  public async start(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.server = this.app.listen(this.config.port, this.config.host, () => {
          this.logger.info(`🚀 WEB8 Clean Search API Server started`, {
            port: this.config.port,
            host: this.config.host,
            version: '8.0.0-CLEAN'
          });
          
          // eslint-disable-next-line no-console
          console.log(`🚀 Clean Search API Server running on http://${this.config.host}:${this.config.port}`);
          // eslint-disable-next-line no-console
          console.log(`💚 Health Check: http://${this.config.host}:${this.config.port}/health`);
          // eslint-disable-next-line no-console
          console.log(`📊 Metrics: http://${this.config.host}:${this.config.port}/api/metrics`);
          
          resolve();
        });

        this.server.on('error', (error: Error) => {
          this.logger.error('Server error', { error: error.message, stack: error.stack });
          reject(error);
        });

      } catch (error) {
        this.logger.error('Failed to start server', { error });
        reject(error);
      }
    });
  }

  public async stop(): Promise<void> {
    return new Promise((resolve) => {
      if (this.server && this.server.close) {
        this.server.close(() => {
          this.logger.info('🛑 Clean Search API Server stopped');
          // eslint-disable-next-line no-console
          console.log('🛑 Server stopped gracefully');
          resolve();
        });
      } else {
        resolve();
      }
    });
  }

  public getStatus(): Record<string, unknown> {
    return {
      isRunning: !!this.server,
      config: this.config,
      metrics: this.metrics,
      engines: this.searchEngine.getEngines()
    };
  }
}

// Export singleton instance
export const ultraSearchAPIServer = new UltraSearchAPIServer();

// @ts-strict
// TypeScript-Only Enforcer - No JavaScript Allowed
// This file is part of WEB8 Pure TypeScript Ecosystem
// JavaScript execution is explicitly forbidden
if (typeof window !== 'undefined' && (window as any).__JS_FORBIDDEN) {
  throw new Error('🚫 JavaScript execution forbidden - TypeScript-only zone');
}

/**
 * Search API Server - API RESTful për motorin e kërkimit
 * WEB8 Platform - Pure TypeScript Search API Server
 * Express.js server with comprehensive search endpoints
 * 
 * @strictNullChecks true
 * @noImplicitAny true
 * @noImplicitReturns true
 * @version 8.0.0-TS-STRICT
 * @author Ledjan Ahmati (100% Owner)
 */

const express = require('express');
import { Request, Response, NextFunction } from 'express';
import { MultiSearchEngine } from './MultiSearchEngine';

// TypeScript-only validation
interface TypeScriptOnlyMarker {
  readonly __TS_ONLY__: true;
  readonly version: '8.0.0-TS-STRICT';
}

const TS_MARKER: TypeScriptOnlyMarker = {
  __TS_ONLY__: true,
  version: '8.0.0-TS-STRICT'
} as const;

// Real-time search statistics interface
export interface SearchStats {
  readonly totalQueries: number;
  readonly successCount: number;
  readonly errorCount: number;
  readonly averageResponseTime: number;
  readonly uptime: number;
  readonly popularQueries: Readonly<Record<string, number>>;
  readonly lastUpdated: number;
  readonly engines: readonly string[];
}

// API Response wrapper
export interface APIResponse<T = unknown> {
  readonly success: boolean;
  readonly data?: T;
  readonly error?: string;
  readonly timestamp: number;
  readonly stats?: {
    readonly queryTime: number;
    readonly resultCount: number;
  };
}

/**
 * Pure TypeScript Search API Server
 * Zero JavaScript tolerance - TypeScript only
 */
export class SearchAPIServer {
  private readonly app = express();
  private readonly searchEngine = new MultiSearchEngine();
  private readonly startTime = Date.now();
  private stats: SearchStats;

  constructor() {
    // Validate TypeScript-only environment
    if (!TS_MARKER.__TS_ONLY__) {
      throw new Error('TypeScript validation failed');
    }

    this.stats = {
      totalQueries: 0,
      successCount: 0,
      errorCount: 0,
      averageResponseTime: 0,
      uptime: 0,
      popularQueries: {},
      lastUpdated: Date.now(),
      engines: ['google', 'bing', 'duckduckgo', 'yandex']
    };

    this.setupMiddleware();
    this.setupRoutes();
  }

  private setupMiddleware(): void {
    // JSON parsing
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true }));

    // CORS headers
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
      res.header('X-Powered-By', 'WEB8-TypeScript-Only');
      
      if (req.method === 'OPTIONS') {
        res.sendStatus(200);
      } else {
        next();
      }
    });

    // Request timing
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      const startTime = Date.now();
      
      res.on('finish', () => {
        const responseTime = Date.now() - startTime;
        this.updateStats(responseTime, res.statusCode >= 400);
      });

      next();
    });
  }

  private setupRoutes(): void {
    // Health check
    this.app.get('/health', (req: Request, res: Response) => {
      this.sendResponse(res, true, {
        status: 'healthy',
        typescript: TS_MARKER,
        uptime: Date.now() - this.startTime,
        memory: process.memoryUsage(),
        version: '8.0.0-TS-STRICT'
      });
    });

    // Search endpoint
    this.app.get('/api/search', this.handleSearch.bind(this));
    this.app.post('/api/search', this.handleSearch.bind(this));

    // Real-time statistics
    this.app.get('/api/stats', (req: Request, res: Response) => {
      this.updateUptime();
      this.sendResponse(res, true, this.stats);
    });

    // Search engines info
    this.app.get('/api/engines', (req: Request, res: Response) => {
      const engines = this.searchEngine.getEngines();
      this.sendResponse(res, true, {
        engines,
        typescript: TS_MARKER
      });
    });

    // Search suggestions
    this.app.get('/api/suggest', this.handleSuggestions.bind(this));

    // Export functionality
    this.app.post('/api/export', this.handleExport.bind(this));

    // 404 handler
    this.app.use('*', (req: Request, res: Response) => {
      this.sendResponse(res, false, null, 'Endpoint not found', 404);
    });

    // Error handler
    this.app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
      console.error('API Error:', error);
      this.stats = {
        ...this.stats,
        errorCount: this.stats.errorCount + 1
      };
      this.sendResponse(res, false, null, error.message, 500);
    });
  }

  private async handleSearch(req: Request, res: Response): Promise<void> {
    try {
      const startTime = Date.now();
      const query = (req.body?.q || req.query.q) as string;

      if (!query || typeof query !== 'string' || query.trim().length === 0) {
        return this.sendResponse(res, false, null, 'Query parameter is required', 400);
      }

      const maxResults = Math.min(
        parseInt((req.body?.maxResults || req.query.maxResults) as string) || 50, 
        200
      );

      const results = await this.searchEngine.search(query.trim(), { maxResults });
      const queryTime = Date.now() - startTime;

      // Update statistics
      this.stats = {
        ...this.stats,
        totalQueries: this.stats.totalQueries + 1,
        successCount: this.stats.successCount + 1,
        popularQueries: {
          ...this.stats.popularQueries,
          [query]: (this.stats.popularQueries[query] || 0) + 1
        }
      };

      this.sendResponse(res, true, {
        results,
        query: query.trim(),
        totalResults: results.length,
        searchTime: queryTime,
        typescript: TS_MARKER
      }, undefined, 200, {
        queryTime,
        resultCount: results.length
      });

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Search failed';
      this.stats = {
        ...this.stats,
        errorCount: this.stats.errorCount + 1
      };
      this.sendResponse(res, false, null, errorMessage, 500);
    }
  }

  private async handleSuggestions(req: Request, res: Response): Promise<void> {
    try {
      const query = req.query.q as string;
      
      if (!query || typeof query !== 'string' || query.length < 2) {
        return this.sendResponse(res, true, []);
      }

      const suggestions = await this.searchEngine.suggest(query);
      this.sendResponse(res, true, {
        suggestions,
        typescript: TS_MARKER
      });

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Suggestions failed';
      this.sendResponse(res, false, null, errorMessage, 500);
    }
  }

  private async handleExport(req: Request, res: Response): Promise<void> {
    try {
      const { data, format = 'json' } = req.body;

      if (!data || !Array.isArray(data)) {
        return this.sendResponse(res, false, null, 'Data array is required', 400);
      }

      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      let content: string;
      let mimeType: string;
      let filename: string;

      switch (format.toLowerCase()) {
        case 'csv':
          content = this.convertToCSV(data);
          mimeType = 'text/csv';
          filename = `web8-search-export-${timestamp}.csv`;
          break;

        case 'xml':
          content = this.convertToXML(data);
          mimeType = 'application/xml';
          filename = `web8-search-export-${timestamp}.xml`;
          break;

        default:
          content = JSON.stringify({
            data,
            typescript: TS_MARKER,
            exported: timestamp
          }, null, 2);
          mimeType = 'application/json';
          filename = `web8-search-export-${timestamp}.json`;
      }

      res.setHeader('Content-Type', mimeType);
      res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
      res.send(content);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Export failed';
      this.sendResponse(res, false, null, errorMessage, 500);
    }
  }

  private convertToCSV(data: readonly unknown[]): string {
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

  private convertToXML(data: readonly unknown[]): string {
    const xmlItems = data.map(item => {
      if (typeof item !== 'object' || item === null) return '<item></item>';
      
      const fields = Object.entries(item).map(([key, value]) => 
        `<${key}>${this.escapeXML(String(value ?? ''))}</${key}>`
      ).join('');
      return `<item>${fields}</item>`;
    }).join('');
    
    return `<?xml version="1.0" encoding="UTF-8"?><data typescript="true">${xmlItems}</data>`;
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

  private updateStats(responseTime: number, isError: boolean): void {
    const newErrorCount = isError ? this.stats.errorCount + 1 : this.stats.errorCount;
    const newSuccessCount = isError ? this.stats.successCount : this.stats.successCount + 1;
    const totalRequests = newSuccessCount + newErrorCount;
    
    this.stats = {
      ...this.stats,
      errorCount: newErrorCount,
      successCount: newSuccessCount,
      averageResponseTime: (this.stats.averageResponseTime * (totalRequests - 1) + responseTime) / totalRequests,
      lastUpdated: Date.now()
    };
  }

  private updateUptime(): void {
    this.stats = {
      ...this.stats,
      uptime: Date.now() - this.startTime
    };
  }

  private sendResponse<T>(
    res: Response,
    success: boolean,
    data?: T,
    error?: string,
    statusCode = 200,
    stats?: { readonly queryTime: number; readonly resultCount: number }
  ): void {
    const response: APIResponse<T> = {
      success,
      timestamp: Date.now(),
      ...(success && data !== undefined && { data }),
      ...(!success && error && { error }),
      ...(stats && { stats })
    };

    res.status(statusCode).json(response);
  }

  /**
   * Start the TypeScript-only server
   */
  public async start(port = 3001, host = '0.0.0.0'): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const server = this.app.listen(port, host, () => {
          console.log(`🚀 WEB8 TypeScript-Only Search API Server`);
          console.log(`📍 Running on http://${host}:${port}`);
          console.log(`🔧 Version: ${TS_MARKER.version}`);
          console.log(`📊 Health: http://${host}:${port}/health`);
          console.log(`🔍 Search: http://${host}:${port}/api/search?q=test`);
          console.log(`📈 Stats: http://${host}:${port}/api/stats`);
          resolve();
        });

        server.on('error', (error: Error) => {
          console.error('Server error:', error);
          reject(error);
        });

      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Get current server status
   */
  public getStatus(): {
    readonly isRunning: boolean;
    readonly stats: SearchStats;
    readonly typescript: TypeScriptOnlyMarker;
  } {
    this.updateUptime();
    return {
      isRunning: true,
      stats: this.stats,
      typescript: TS_MARKER
    };
  }
}

// Export singleton instance
export const searchAPIServer = new SearchAPIServer();

// TypeScript-only module validation
export default SearchAPIServer;

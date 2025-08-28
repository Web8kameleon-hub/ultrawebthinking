/**
 * WEB8 Simple Search API Server - Clean Working Implementation
 * Real statistics, minimal dependencies, TypeScript-first
 * 
 * @version 8.0.0-SIMPLE
 * @author Ledjan Ahmati (100% Owner)
 * @contact dealsjona@gmail.com
 */

const express = require('express');
import { Request, Response, NextFunction } from 'express';
import { MultiSearchEngine } from './MultiSearchEngine';

// Simple interfaces
export interface SearchStats {
  totalQueries: number;
  successCount: number;
  errorCount: number;
  averageResponseTime: number;
  uptime: number;
  popularQueries: Record<string, number>;
  lastUpdated: number;
}

export interface SearchResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  stats?: {
    queryTime: number;
    resultCount: number;
  };
  timestamp: number;
}

/**
 * Simple Search API Server
 */
export class SimpleSearchAPIServer {
  private readonly app = express();
  private readonly searchEngine = new MultiSearchEngine();
  private readonly stats: SearchStats;
  private readonly startTime = Date.now();

  constructor() {
    this.stats = {
      totalQueries: 0,
      successCount: 0,
      errorCount: 0,
      averageResponseTime: 0,
      uptime: 0,
      popularQueries: {},
      lastUpdated: Date.now()
    };

    this.setupMiddleware();
    this.setupRoutes();
  }

  private setupMiddleware(): void {
    // Basic middleware
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true }));

    // CORS - simple version
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
      if (req.method === 'OPTIONS') {
        res.sendStatus(200);
      } else {
        next();
      }
    });

    // Request tracking
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
        uptime: Date.now() - this.startTime,
        version: '8.0.0-SIMPLE',
        memory: process.memoryUsage()
      });
    });

    // Search endpoint
    this.app.get('/api/search', this.handleSearch.bind(this));
    this.app.post('/api/search', this.handleSearch.bind(this));

    // Statistics
    this.app.get('/api/stats', (req: Request, res: Response) => {
      this.updateUptime();
      this.sendResponse(res, true, this.stats);
    });

    // Engines info
    this.app.get('/api/engines', (req: Request, res: Response) => {
      const engines = this.searchEngine.getEngines();
      this.sendResponse(res, true, engines);
    });

    // Export results
    this.app.post('/api/export', this.handleExport.bind(this));

    // Suggestions
    this.app.get('/api/suggest', this.handleSuggestions.bind(this));

    // 404 handler
    this.app.use('*', (req: Request, res: Response) => {
      this.sendResponse(res, false, null, 'Endpoint not found', 404);
    });

    // Error handler
    this.app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
      console.error('API Error:', error);
      this.stats.errorCount++;
      this.sendResponse(res, false, null, error.message, 500);
    });
  }

  private async handleSearch(req: Request, res: Response): Promise<void> {
    try {
      const startTime = Date.now();
      const query = req.body.q || req.query.q as string;

      if (!query || query.trim().length === 0) {
        return this.sendResponse(res, false, null, 'Query parameter is required', 400);
      }

      // Parse options
      const maxResults = Math.min(parseInt(req.body.maxResults || req.query.maxResults as string) || 50, 200);
      const engines = this.parseArray(req.body.engines || req.query.engines);

      // Execute search
      const searchOptions = {
        maxResults,
        ...(engines.length > 0 && { engines })
      };

      const results = await this.searchEngine.search(query.trim(), searchOptions);
      const queryTime = Date.now() - startTime;

      // Update popular queries
      this.stats.popularQueries[query] = (this.stats.popularQueries[query] || 0) + 1;
      this.stats.totalQueries++;
      this.stats.successCount++;

      this.sendResponse(res, true, {
        results,
        query: query.trim(),
        totalResults: results.length,
        searchTime: queryTime
      }, undefined, 200, {
        queryTime,
        resultCount: results.length
      });

    } catch (error) {
      this.stats.errorCount++;
      const errorMessage = error instanceof Error ? error.message : 'Search failed';
      this.sendResponse(res, false, null, errorMessage, 500);
    }
  }

  private async handleSuggestions(req: Request, res: Response): Promise<void> {
    try {
      const query = req.query.q as string;
      
      if (!query || query.length < 2) {
        return this.sendResponse(res, true, []);
      }

      const suggestions = await this.searchEngine.suggest(query);
      this.sendResponse(res, true, suggestions);

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
          filename = `search-export-${timestamp}.csv`;
          break;

        case 'xml':
          content = this.convertToXML(data);
          mimeType = 'application/xml';
          filename = `search-export-${timestamp}.xml`;
          break;

        default: // json
          content = JSON.stringify(data, null, 2);
          mimeType = 'application/json';
          filename = `search-export-${timestamp}.json`;
      }

      res.setHeader('Content-Type', mimeType);
      res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
      res.send(content);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Export failed';
      this.sendResponse(res, false, null, errorMessage, 500);
    }
  }

  private convertToCSV(data: any[]): string {
    if (data.length === 0) return '';
    
    const headers = Object.keys(data[0]);
    const csvRows = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header];
          const stringValue = String(value || '');
          return stringValue.includes(',') ? `"${stringValue.replace(/"/g, '""')}"` : stringValue;
        }).join(',')
      )
    ];
    
    return csvRows.join('\\n');
  }

  private convertToXML(data: any[]): string {
    const xmlItems = data.map(item => {
      const fields = Object.entries(item).map(([key, value]) => 
        `<${key}>${this.escapeXML(String(value || ''))}</${key}>`
      ).join('');
      return `<item>${fields}</item>`;
    }).join('');
    
    return `<?xml version="1.0" encoding="UTF-8"?><data>${xmlItems}</data>`;
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

  private parseArray(value: any): string[] {
    if (!value) return [];
    if (typeof value === 'string') return value.split(',').map(s => s.trim());
    if (Array.isArray(value)) return value;
    return [];
  }

  private updateStats(responseTime: number, isError: boolean): void {
    if (isError) {
      this.stats.errorCount++;
    } else {
      this.stats.successCount++;
    }

    // Update average response time
    const totalRequests = this.stats.successCount + this.stats.errorCount;
    this.stats.averageResponseTime = (this.stats.averageResponseTime * (totalRequests - 1) + responseTime) / totalRequests;
    
    this.stats.lastUpdated = Date.now();
  }

  private updateUptime(): void {
    this.stats.uptime = Date.now() - this.startTime;
  }

  private sendResponse<T>(
    res: Response,
    success: boolean,
    data?: T,
    error?: string,
    statusCode = 200,
    stats?: { queryTime: number; resultCount: number }
  ): void {
    const response: SearchResponse<T> = {
      success,
      timestamp: Date.now()
    };

    if (success && data !== undefined) {
      response.data = data;
    }

    if (!success && error) {
      response.error = error;
    }

    if (stats) {
      response.stats = stats;
    }

    res.status(statusCode).json(response);
  }

  /**
   * Start the server
   */
  public async start(port = 3001, host = '0.0.0.0'): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const server = this.app.listen(port, host, () => {
          console.log(`🚀 Simple Search API Server running on http://${host}:${port}`);
          console.log(`📚 Health Check: http://${host}:${port}/health`);
          console.log(`📊 Statistics: http://${host}:${port}/api/stats`);
          console.log(`🔍 Search: http://${host}:${port}/api/search?q=test`);
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
   * Get current status
   */
  public getStatus(): any {
    this.updateUptime();
    return {
      isRunning: true,
      stats: this.stats,
      engines: this.searchEngine.getEngines(),
      version: '8.0.0-SIMPLE'
    };
  }
}

// Export singleton
export const simpleSearchAPIServer = new SimpleSearchAPIServer();

// Start server if run directly
if (require.main === module) {
  simpleSearchAPIServer.start()
    .then(() => console.log('✅ Server started successfully'))
    .catch((error) => console.error('❌ Failed to start server:', error));
}

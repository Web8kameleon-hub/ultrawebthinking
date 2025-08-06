/**
 * Ultra Search API Server - Simple & Clean
 * WEB8 Platform - Minimal Search API
 * 
 * @version 8.0.0-CLEAN
 * @author Ledjan Ahmati
 * @contact dealsjona@gmail.com
 */

import express from 'express';
import type { Request, Response } from 'express';
import cors from 'cors';

interface SearchResult {
  url: string;
  title: string;
  description: string;
  score: number;
  source: string;
}

interface SearchResponse {
  success: boolean;
  results: SearchResult[];
  query: string;
  total: number;
  timestamp: number;
  responseTime: number;
}

export class UltraSearchAPI {
  private readonly app = express();
  private readonly port = 3001;
  private readonly startTime = Date.now();

  constructor() {
    this.setupMiddleware();
    this.setupRoutes();
  }

  private setupMiddleware(): void {
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use((req, res, next) => {
      console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
      next();
    });
  }

  private setupRoutes(): void {
    // Health check
    this.app.get('/health', (req: Request, res: Response) => {
      res.json({
        status: 'healthy',
        uptime: Date.now() - this.startTime,
        version: '8.0.0-CLEAN',
        timestamp: Date.now()
      });
    });

    // Simple search endpoint
    this.app.get('/api/search', (req: Request, res: Response) => {
      const startTime = Date.now();
      const query = req.query.q as string;
      
      if (!query) {
        res.status(400).json({
          success: false,
          error: 'Query parameter required',
          timestamp: Date.now()
        });
        return;
      }

      // Mock search results
      const mockResults: SearchResult[] = [
        {
          url: `https://example.com/result1?q=${encodeURIComponent(query)}`,
          title: `Search Result for "${query}"`,
          description: `This is a mock search result for your query: ${query}`,
          score: 0.95,
          source: 'Ultra Engine'
        },
        {
          url: `https://another.com/page?search=${encodeURIComponent(query)}`,
          title: `Related: ${query}`,
          description: `Additional information about ${query} from our search index`,
          score: 0.87,
          source: 'Web Crawler'
        }
      ];

      const response: SearchResponse = {
        success: true,
        results: mockResults,
        query,
        total: mockResults.length,
        timestamp: Date.now(),
        responseTime: Date.now() - startTime
      };

      res.json(response);
    });

    // Bulk search
    this.app.post('/api/search/bulk', (req: Request, res: Response) => {
      const { queries } = req.body;
      
      if (!Array.isArray(queries)) {
        res.status(400).json({
          success: false,
          error: 'Queries array required',
          timestamp: Date.now()
        });
        return;
      }

      const results = queries.map((query: string) => ({
        query,
        results: [
          {
            url: `https://example.com/bulk/${encodeURIComponent(query)}`,
            title: `Bulk Result: ${query}`,
            description: `Bulk search result for ${query}`,
            score: 0.9,
            source: 'Bulk Engine'
          }
        ],
        total: 1
      }));

      res.json({
        success: true,
        results,
        timestamp: Date.now()
      });
    });

    // API info
    this.app.get('/api/info', (req: Request, res: Response) => {
      res.json({
        name: 'Ultra Search API',
        version: '8.0.0-CLEAN',
        endpoints: {
          health: '/health',
          search: '/api/search?q=your_query',
          bulk: '/api/search/bulk (POST)',
          info: '/api/info'
        },
        uptime: Date.now() - this.startTime,
        timestamp: Date.now()
      });
    });

    // 404 handler
    this.app.use('*', (req: Request, res: Response) => {
      res.status(404).json({
        success: false,
        error: 'Endpoint not found',
        path: req.path,
        timestamp: Date.now()
      });
    });
  }

  start(): Promise<void> {
    return new Promise((resolve) => {
      this.app.listen(this.port, '0.0.0.0', () => {
        console.log(`🚀 Ultra Search API running on http://localhost:${this.port}`);
        console.log(`📖 API Info: http://localhost:${this.port}/api/info`);
        console.log(`💚 Health: http://localhost:${this.port}/health`);
        resolve();
      });
    });
  }

  getApp() {
    return this.app;
  }
}

// Export instance
export const ultraSearchAPI = new UltraSearchAPI();

// Start if run directly
if (require.main === module) {
  ultraSearchAPI.start().catch(console.error);
}

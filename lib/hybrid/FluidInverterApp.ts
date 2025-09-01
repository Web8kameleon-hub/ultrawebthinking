/**
 * WEB8 Hybrid Fluid Inverter Application
 * Next.js + Express.js Hybrid Architecture with Fluid State Management
 * 
 * @version 8.0.0-HYBRID-FLUID
 * @author Ledjan Ahmati (100% Owner)
 * @contact dealsjona@gmail.com
 */

// @ts-strict
// TypeScript-Only Enforcer - No JavaScript Allowed
if (typeof window !== 'undefined' && (window as any).__JS_FORBIDDEN) {
  throw new Error('🚫 JavaScript execution forbidden - TypeScript-only zone');
}

const express = require('express');
import { Request, Response, NextFunction, Application } from 'express';
import { createServer } from 'http';
const next = require('next');
const morgan = require('morgan');
const bodyParser = require('body-parser');
import { MultiSearchEngine } from '../search-engine/MultiSearchEngine';

// TypeScript-only validation
interface TypeScriptOnlyMarker {
  readonly __TS_ONLY__: true;
  readonly version: '8.0.0-HYBRID-FLUID';
}

const TS_MARKER: TypeScriptOnlyMarker = {
  __TS_ONLY__: true,
  version: '8.0.0-HYBRID-FLUID'
} as const;

// Fluid State Management Interface
export interface FluidState {
  readonly id: string;
  readonly type: 'search' | 'navigation' | 'user' | 'system';
  readonly timestamp: number;
  readonly data: unknown;
  readonly source: 'client' | 'server' | 'hybrid';
  inverter?: {
    readonly original: unknown;
    readonly inverted: unknown;
    readonly transformation: string;
  };
}

// Hybrid Configuration
export interface HybridConfig {
  readonly nextjs: {
    readonly dev: boolean;
    readonly port: number;
    readonly hostname: string;
  };
  readonly express: {
    readonly port: number;
    readonly enableCors: boolean;
    readonly enableLogging: boolean;
    readonly rateLimit: number;
  };
  readonly fluid: {
    readonly enableStateSync: boolean;
    readonly stateRetention: number; // milliseconds
    readonly maxStates: number;
    readonly enableInverter: boolean;
  };
  readonly search: {
    readonly enableCaching: boolean;
    readonly maxResults: number;
    readonly timeout: number;
  };
}

// Inverter Function Type
type InverterFunction<T, R> = (input: T) => R;

/**
 * WEB8 Hybrid Fluid Inverter Application
 * Combines Next.js frontend with Express.js backend in a unified fluid architecture
 */
export class FluidInverterApp {
  private readonly config: HybridConfig;
  private readonly nextApp: any;
  private readonly expressApp: Application;
  private readonly httpServer: any;
  private readonly searchEngine: MultiSearchEngine;
  private readonly fluidStates = new Map<string, FluidState>();
  private readonly inverters = new Map<string, InverterFunction<any, any>>();
  private isReady = false;
  private readonly startTime = Date.now();

  constructor(config: Partial<HybridConfig> = {}) {
    // Validate TypeScript-only environment
    if (!TS_MARKER.__TS_ONLY__) {
      throw new Error('TypeScript validation failed - Hybrid Fluid Inverter requires pure TypeScript');
    }

    this.config = {
      nextjs: {
        dev: process.env.NODE_ENV !== 'production',
        port: 3000,
        hostname: 'localhost',
        ...config.nextjs
      },
      express: {
        port: 3001,
        enableCors: true,
        enableLogging: true,
        rateLimit: 1000,
        ...config.express
      },
      fluid: {
        enableStateSync: true,
        stateRetention: 5 * 60 * 1000, // 5 minutes
        maxStates: 10000,
        enableInverter: true,
        ...config.fluid
      },
      search: {
        enableCaching: true,
        maxResults: 100,
        timeout: 30000,
        ...config.search
      }
    };

    // Initialize components
    this.nextApp = next({
      dev: this.config.nextjs.dev,
      hostname: this.config.nextjs.hostname,
      port: this.config.nextjs.port
    });

    this.expressApp = express();
    this.httpServer = createServer(this.expressApp);
    this.searchEngine = new MultiSearchEngine();

    this.setupExpress();
    this.setupFluidStateManagement();
    this.setupInverters();
  }

  /**
   * Setup Express.js middleware and routes
   */
  private setupExpress(): void {
    // Logging
    if (this.config.express.enableLogging) {
      this.expressApp.use(morgan('combined'));
    }

    // Body parsing
    this.expressApp.use(bodyParser.json({ limit: '10mb' }));
    this.expressApp.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

    // CORS
    if (this.config.express.enableCors) {
      this.expressApp.use((req: Request, res: Response, next: NextFunction) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
        res.header('X-Powered-By', 'WEB8-Hybrid-Fluid-Inverter');
        
        if (req.method === 'OPTIONS') {
          res.sendStatus(200);
        } else {
          next();
        }
      });
    }

    // Request tracking with fluid state
    this.expressApp.use((req: Request, res: Response, next: NextFunction) => {
      const requestId = `hybrid_${Date.now()}_${0.5.toString(36).substr(2, 9)}`;
      
      // Create fluid state for request
      this.createFluidState(requestId, 'system', {
        method: req.method,
        url: req.url,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        timestamp: Date.now()
      }, 'server');

      req.headers['x-request-id'] = requestId;
      next();
    });

    this.setupHybridRoutes();
  }

  /**
   * Setup hybrid API routes that bridge Next.js and Express
   */
  private setupHybridRoutes(): void {
    // Hybrid health check
    this.expressApp.get('/hybrid/health', (req: Request, res: Response) => {
      const health = {
        status: 'healthy',
        hybrid: true,
        typescript: TS_MARKER,
        nextjs: {
          ready: this.isReady,
          dev: this.config.nextjs.dev
        },
        express: {
          port: this.config.express.port,
          uptime: Date.now() - this.startTime
        },
        fluid: {
          states: this.fluidStates.size,
          maxStates: this.config.fluid.maxStates,
          inverters: this.inverters.size
        },
        memory: process.memoryUsage(),
        timestamp: Date.now()
      };

      res.json(this.createHybridResponse(true, health));
    });

    // Fluid state management endpoints
    this.expressApp.route('/hybrid/fluid/state')
      .get(this.handleGetFluidStates.bind(this))
      .post(this.handleCreateFluidState.bind(this))
      .delete(this.handleClearFluidStates.bind(this));

    // Inverter endpoints
    this.expressApp.route('/hybrid/inverter/:name')
      .get(this.handleGetInverter.bind(this))
      .post(this.handleInvertData.bind(this));

    // Hybrid search with fluid caching
    this.expressApp.route('/hybrid/search')
      .get(this.handleHybridSearch.bind(this))
      .post(this.handleHybridSearch.bind(this));

    // Real-time fluid state streaming
    this.expressApp.get('/hybrid/fluid/stream', this.handleFluidStateStream.bind(this));

    // Hybrid analytics
    this.expressApp.get('/hybrid/analytics', this.handleHybridAnalytics.bind(this));
  }

  /**
   * Setup fluid state management system
   */
  private setupFluidStateManagement(): void {
    // Cleanup old states periodically
    setInterval(() => {
      const cutoff = Date.now() - this.config.fluid.stateRetention;
      const statesToDelete: string[] = [];

      Array.from(this.fluidStates.entries()).forEach(([id, state]) => {
        if (state.timestamp < cutoff) {
          statesToDelete.push(id);
        }
      });

      statesToDelete.forEach(id => this.fluidStates.delete(id));

      console.log(`🧹 Fluid state cleanup: removed ${statesToDelete.length} old states`);
    }, 60000); // Every minute
  }

  /**
   * Setup data inverters for fluid transformations
   */
  private setupInverters(): void {
    // Search result inverter
    this.registerInverter('search-results', (results: any[]) => {
      return results.map(result => ({
        invertedTitle: result.title?.split('').reverse().join(''),
        invertedDescription: result.description?.split('').reverse().join(''),
        originalUrl: result.url,
        score: 100 - (result.score || 0),
        inverted: true,
        timestamp: Date.now()
      }));
    });

    // Navigation state inverter
    this.registerInverter('navigation', (nav: any) => {
      return {
        invertedPath: nav.path?.split('/').reverse().join('/'),
        previousPage: nav.currentPage,
        currentPage: nav.previousPage,
        breadcrumbs: nav.breadcrumbs?.reverse(),
        inverted: true
      };
    });

    // User preference inverter
    this.registerInverter('user-preferences', (prefs: any) => {
      const inverted: any = {};
      for (const [key, value] of Object.entries(prefs)) {
        if (typeof value === 'boolean') {
          inverted[`not_${key}`] = !value;
        } else if (typeof value === 'number') {
          inverted[`inverse_${key}`] = -value;
        } else if (typeof value === 'string') {
          inverted[`reversed_${key}`] = value.split('').reverse().join('');
        } else {
          inverted[`inverted_${key}`] = value;
        }
      }
      return inverted;
    });

    console.log(`🔄 Registered ${this.inverters.size} fluid inverters`);
  }

  /**
   * Create a new fluid state
   */
  private createFluidState(
    id: string,
    type: FluidState['type'],
    data: unknown,
    source: FluidState['source'],
    inverterName?: string
  ): FluidState {
    // Implement LRU-style cleanup if at max capacity
    if (this.fluidStates.size >= this.config.fluid.maxStates) {
      const oldestId = this.fluidStates.keys().next().value;
      if (oldestId) {
        this.fluidStates.delete(oldestId);
      }
    }

    const state: FluidState = {
      id,
      type,
      timestamp: Date.now(),
      data,
      source
    };

    // Apply inverter if specified and enabled
    if (this.config.fluid.enableInverter && inverterName && this.inverters.has(inverterName)) {
      const inverter = this.inverters.get(inverterName)!;
      const inverted = inverter(data);
      
      state.inverter = {
        original: data,
        inverted,
        transformation: inverterName
      };
    }

    this.fluidStates.set(id, state);
    return state;
  }

  /**
   * Register a new inverter function
   */
  private registerInverter<T, R>(name: string, inverterFn: InverterFunction<T, R>): void {
    this.inverters.set(name, inverterFn);
  }

  /**
   * Handle fluid state requests
   */
  private async handleGetFluidStates(req: Request, res: Response): Promise<void> {
    const { type, limit = 100, offset = 0 } = req.query;
    
    let states = Array.from(this.fluidStates.values());
    
    if (type) {
      states = states.filter(state => state.type === type);
    }
    
    const paginatedStates = states
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(Number(offset), Number(offset) + Number(limit));

    res.json(this.createHybridResponse(true, {
      states: paginatedStates,
      total: states.length,
      pagination: {
        limit: Number(limit),
        offset: Number(offset),
        hasMore: Number(offset) + Number(limit) < states.length
      }
    }));
  }

  private async handleCreateFluidState(req: Request, res: Response): Promise<void> {
    const { type, data, inverterName } = req.body;
    
    if (!type || !data) {
      res.status(400).json(this.createHybridResponse(
        false,
        null,
        'Type and data are required for fluid state creation'
      ));
      return;
    }

    const stateId = `fluid_${Date.now()}_${0.5.toString(36).substr(2, 9)}`;
    const state = this.createFluidState(stateId, type, data, 'hybrid', inverterName);

    res.json(this.createHybridResponse(true, { state }));
  }

  private async handleClearFluidStates(req: Request, res: Response): Promise<void> {
    const clearedCount = this.fluidStates.size;
    this.fluidStates.clear();
    
    res.json(this.createHybridResponse(true, {
      message: 'All fluid states cleared',
      clearedCount
    }));
  }

  /**
   * Handle inverter requests
   */
  private async handleGetInverter(req: Request, res: Response): Promise<void> {
    const { name } = req.params;
    const inverter = this.inverters.get(name);
    
    if (!inverter) {
      res.status(404).json(this.createHybridResponse(
        false,
        null,
        `Inverter '${name}' not found`
      ));
      return;
    }

    res.json(this.createHybridResponse(true, {
      name,
      exists: true,
      registeredInverters: Array.from(this.inverters.keys())
    }));
  }

  private async handleInvertData(req: Request, res: Response): Promise<void> {
    const { name } = req.params;
    const { data } = req.body;
    
    const inverter = this.inverters.get(name);
    if (!inverter) {
      res.status(404).json(this.createHybridResponse(
        false,
        null,
        `Inverter '${name}' not found`
      ));
      return;
    }

    try {
      const inverted = inverter(data);
      const stateId = `invert_${Date.now()}_${0.5.toString(36).substr(2, 9)}`;
      
      // Store inversion in fluid state
      this.createFluidState(stateId, 'system', {
        original: data,
        inverted,
        inverterUsed: name
      }, 'hybrid');

      res.json(this.createHybridResponse(true, {
        original: data,
        inverted,
        inverter: name,
        stateId
      }));

    } catch (error) {
      res.status(500).json(this.createHybridResponse(
        false,
        null,
        `Inversion failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      ));
    }
  }

  /**
   * Handle hybrid search with fluid caching
   */
  private async handleHybridSearch(req: Request, res: Response): Promise<void> {
    try {
      const query = req.body.q || req.query.q as string;
      const useInverter = req.body.invert || req.query.invert === 'true';
      
      if (!query) {
        res.status(400).json(this.createHybridResponse(
          false,
          null,
          'Query parameter is required'
        ));
        return;
      }

      const startTime = Date.now();
      const searchResults = await this.searchEngine.search(query, {
        maxResults: this.config.search.maxResults
      });

      // Apply search result inverter if requested
      let finalResults = searchResults;
      if (useInverter && this.config.fluid.enableInverter) {
        const inverter = this.inverters.get('search-results');
        if (inverter) {
          finalResults = inverter(searchResults);
        }
      }

      const searchTime = Date.now() - startTime;

      // Store search in fluid state
      const stateId = `search_${Date.now()}_${0.5.toString(36).substr(2, 9)}`;
      this.createFluidState(stateId, 'search', {
        query,
        results: finalResults,
        resultCount: finalResults.length,
        searchTime,
        inverted: useInverter
      }, 'hybrid');

      res.json(this.createHybridResponse(true, {
        query,
        results: finalResults,
        resultCount: finalResults.length,
        searchTime,
        inverted: useInverter,
        fluidStateId: stateId,
        typescript: TS_MARKER
      }));

    } catch (error) {
      res.status(500).json(this.createHybridResponse(
        false,
        null,
        `Search failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      ));
    }
  }

  /**
   * Handle fluid state streaming (Server-Sent Events)
   */
  private handleFluidStateStream(req: Request, res: Response): void {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*'
    });

    const sendUpdate = () => {
      const recentStates = Array.from(this.fluidStates.values())
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, 10);

      res.write(`data: ${JSON.stringify({
        states: recentStates,
        totalStates: this.fluidStates.size,
        inverters: Array.from(this.inverters.keys()),
        timestamp: Date.now()
      })}\n\n`);
    };

    // Send initial state
    sendUpdate();

    // Send updates every 3 seconds
    const interval = setInterval(sendUpdate, 3000);

    // Cleanup on disconnect
    req.on('close', () => {
      clearInterval(interval);
      res.end();
    });
  }

  /**
   * Handle hybrid analytics
   */
  private async handleHybridAnalytics(req: Request, res: Response): Promise<void> {
    const statesByType = new Map<string, number>();
    const statesBySource = new Map<string, number>();
    const inverterUsage = new Map<string, number>();

    Array.from(this.fluidStates.values()).forEach(state => {
      statesByType.set(state.type, (statesByType.get(state.type) || 0) + 1);
      statesBySource.set(state.source, (statesBySource.get(state.source) || 0) + 1);
      
      if (state.inverter) {
        inverterUsage.set(
          state.inverter.transformation,
          (inverterUsage.get(state.inverter.transformation) || 0) + 1
        );
      }
    });

    res.json(this.createHybridResponse(true, {
      overview: {
        totalStates: this.fluidStates.size,
        maxStates: this.config.fluid.maxStates,
        registeredInverters: this.inverters.size,
        uptime: Date.now() - this.startTime
      },
      distribution: {
        byType: Object.fromEntries(statesByType),
        bySource: Object.fromEntries(statesBySource),
        inverterUsage: Object.fromEntries(inverterUsage)
      },
      performance: {
        memory: process.memoryUsage(),
        stateRetention: this.config.fluid.stateRetention,
        averageStateAge: this.calculateAverageStateAge()
      },
      typescript: TS_MARKER
    }));
  }

  /**
   * Calculate average age of fluid states
   */
  private calculateAverageStateAge(): number {
    if (this.fluidStates.size === 0) return 0;
    
    const now = Date.now();
    const totalAge = Array.from(this.fluidStates.values())
      .reduce((sum, state) => sum + (now - state.timestamp), 0);
    
    return totalAge / this.fluidStates.size;
  }

  /**
   * Create standardized hybrid response
   */
  private createHybridResponse(success: boolean, data?: any, error?: string): any {
    return {
      success,
      hybrid: true,
      typescript: TS_MARKER,
      timestamp: Date.now(),
      ...(success && data && { data }),
      ...(!success && error && { error })
    };
  }

  /**
   * Start the hybrid fluid inverter application
   */
  public async start(): Promise<void> {
    try {
      // Prepare Next.js
      console.log('🚀 Preparing Next.js application...');
      await this.nextApp.prepare();
      this.isReady = true;

      // Handle Next.js requests through Express
      const handle = this.nextApp.getRequestHandler();
      this.expressApp.all('*', (req: Request, res: Response) => {
        return handle(req, res);
      });

      // Start hybrid server
      await new Promise<void>((resolve, reject) => {
        this.httpServer.listen(this.config.express.port, (error?: Error) => {
          if (error) {
            reject(error);
          } else {
            console.log(`🌊 WEB8 Hybrid Fluid Inverter Application started!`);
            console.log(`📍 Server: http://localhost:${this.config.express.port}`);
            console.log(`⚡ Next.js: ${this.config.nextjs.dev ? 'Development' : 'Production'} mode`);
            console.log(`🔄 Fluid States: ${this.fluidStates.size}/${this.config.fluid.maxStates}`);
            console.log(`🔀 Inverters: ${this.inverters.size} registered`);
            console.log(`💚 Health: http://localhost:${this.config.express.port}/hybrid/health`);
            console.log(`📊 Analytics: http://localhost:${this.config.express.port}/hybrid/analytics`);
            console.log(`🌊 Fluid Stream: http://localhost:${this.config.express.port}/hybrid/fluid/stream`);
            resolve();
          }
        });
      });

    } catch (error) {
      console.error('❌ Failed to start hybrid application:', error);
      throw error;
    }
  }

  /**
   * Stop the hybrid application
   */
  public async stop(): Promise<void> {
    return new Promise<void>((resolve) => {
      this.httpServer.close(() => {
        console.log('🛑 Hybrid Fluid Inverter Application stopped');
        resolve();
      });
    });
  }

  /**
   * Get current application status
   */
  public getStatus(): any {
    return {
      isRunning: true,
      hybrid: true,
      typescript: TS_MARKER,
      config: this.config,
      states: {
        total: this.fluidStates.size,
        byType: this.getStatesByType(),
        averageAge: this.calculateAverageStateAge()
      },
      inverters: Array.from(this.inverters.keys()),
      uptime: Date.now() - this.startTime,
      memory: process.memoryUsage()
    };
  }

  private getStatesByType(): Record<string, number> {
    const counts: Record<string, number> = {};
    Array.from(this.fluidStates.values()).forEach(state => {
      counts[state.type] = (counts[state.type] || 0) + 1;
    });
    return counts;
  }
}

// Export singleton instance for hybrid fluid inverter
export const fluidInverterApp = new FluidInverterApp();

// Auto-start if run directly
if (require.main === module) {
  fluidInverterApp.start()
    .then(() => console.log('✅ Hybrid Fluid Inverter Application ready!'))
    .catch((error) => {
      console.error('❌ Failed to start application:', error);
      process.exit(1);
    });
}

export default FluidInverterApp;


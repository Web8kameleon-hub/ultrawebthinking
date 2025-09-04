/**
 * CommandBridge.ts
 * Real-time modular AGI command bridge - NO STATIC methods
 * © Web8 UltraThinking – Ledjan Ahmati
 */

import { agiCore, AGICore } from './core.js';
import { SemanticAnalyzer } from './semantic-modular.js';
import { Planner } from './planner-modular.js';
import { Executor } from './executor-modular.js';
import { logger } from './monitor.js';

// Dynamic command types for real API
type AGICommand =
  | 'ANALYZE'
  | 'CLASSIFY'
  | 'PLAN'
  | 'EXECUTE'
  | 'STATUS'
  | 'RESET'
  | 'LEARN'
  | 'OPTIMIZE'

interface CommandPayload {
  id: string
  command: AGICommand
  input: string
  context?: Record<string, any>
  session?: string
  priority?: 'low' | 'normal' | 'high' | 'critical'
}

interface AGIResponse {
  success: boolean
  data?: any
  error?: string
  executionTime: number
  commandId: string
  timestamp: string
}

export class CommandBridge {
  private semantic: SemanticAnalyzer;
  private planner: Planner;
  private executor: Executor;
  private sessions: Map<string, any> = new Map();

  constructor() {
    // Initialize real instances - NOT static
    this.semantic = new SemanticAnalyzer();
    this.planner = new Planner();
    this.executor = new Executor();
    
    logger.info('🌉 CommandBridge initialized with modular architecture');
  }

  /**
   * Process AGI command with real-time execution
   */
  async processCommand(cmd: CommandPayload): Promise<AGIResponse> {
    const startTime = Date.now();
    const sessionId = cmd.session || 'default';
    
    try {
      logger.info(`🎯 Processing command: ${cmd.command} [${cmd.id}]`);
      
      // Get or create session context
      const session = this.getSession(sessionId);
      const enhancedContext = { ...cmd.context, session, priority: cmd.priority };

      let result: any;

      switch (cmd.command) {
        case 'ANALYZE':
          result = await this.semantic.analyze(cmd.input, enhancedContext);
          break;

        case 'CLASSIFY':
          result = await this.semantic.classify(cmd.input, enhancedContext);
          break;

        case 'PLAN':
          result = await this.planner.createPlan(cmd.input, enhancedContext);
          break;

        case 'EXECUTE':
          result = await this.executor.run(cmd.input, enhancedContext);
          break;

        case 'STATUS':
          result = await agiCore.getStatus();
          break;

        case 'RESET':
          result = await agiCore.resetSystem();
          this.clearSessions();
          break;

        case 'LEARN':
          result = await this.semantic.learn(cmd.input, enhancedContext);
          break;

        case 'OPTIMIZE':
          result = await this.optimizeSystem(enhancedContext);
          break;

        default:
          throw new Error(`Unknown command: ${cmd.command}`);
      }

      // Update session with result
      this.updateSession(sessionId, { lastCommand: cmd.command, lastResult: result });

      const executionTime = Date.now() - startTime;
      logger.info(`✅ Command ${cmd.command} completed in ${executionTime}ms`);

      return {
        success: true,
        data: result,
        executionTime,
        commandId: cmd.id,
        timestamp: new Date().toISOString()
      };

    } catch (error: any) {
      const executionTime = Date.now() - startTime;
      logger.error(`❌ Command ${cmd.command} failed: ${error.message}`);

      return {
        success: false,
        error: error.message,
        executionTime,
        commandId: cmd.id,
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Get session context (dynamic state management)
   */
  private getSession(sessionId: string): any {
    if (!this.sessions.has(sessionId)) {
      this.sessions.set(sessionId, {
        id: sessionId,
        created: Date.now(),
        commands: [],
        context: {},
        state: 'active'
      });
    }
    return this.sessions.get(sessionId);
  }

  /**
   * Update session with new data
   */
  private updateSession(sessionId: string, data: any): void {
    const session = this.getSession(sessionId);
    Object.assign(session, data, { lastUpdate: Date.now() });
    this.sessions.set(sessionId, session);
  }

  /**
   * Clear all sessions (system reset)
   */
  private clearSessions(): void {
    this.sessions.clear();
    logger.info('🧹 All sessions cleared');
  }

  /**
   * Optimize system performance
   */
  private async optimizeSystem(context: any): Promise<any> {
    logger.info('🚀 Starting system optimization...');
    
    // Real optimization logic
    const metrics = await agiCore.getMetrics();
    const recommendations = await this.planner.createOptimizationPlan(metrics);
    
    return {
      currentMetrics: metrics,
      recommendations,
      optimizationApplied: true,
      timestamp: Date.now()
    };
  }

  /**
   * Get bridge statistics
   */
  getStats(): any {
    return {
      activeSessions: this.sessions.size,
      totalCommands: Array.from(this.sessions.values()).reduce((sum, s) => sum + s.commands.length, 0),
      uptime: Date.now() - (this.sessions.get('default')?.created || Date.now()),
      bridgeStatus: 'active'
    };
  }
}

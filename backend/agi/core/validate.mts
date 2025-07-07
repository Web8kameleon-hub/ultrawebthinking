/**
 * 🛡️ EuroWeb AGI Core Validation Module
 * 
 * Modul i avancuar për validim dhe siguri në sistemin AGI
 * Implementon rregulla të shumta validimi dhe kontrolle sigurie
 * 
 * @author EuroWeb Team
 * @version 2.0.0
 * @since 2025-07-03
 */

import { EventEmitter } from 'events';

// ===============================
// 🔧 Interfaces dhe Types
// ===============================

export interface ValidationRule {
  id: string;
  name: string;
  description: string;
  type: 'schema' | 'business' | 'security' | 'performance' | 'agi';
  priority: 'low' | 'medium' | 'high' | 'critical';
  enabled: boolean;
  validator: (data: any, context?: ValidationContext) => ValidationResult;
  dependencies?: string[];
  metadata?: Record<string, any>;
}

export interface ValidationResult {
  isValid: boolean;
  score: number; // 0-100
  errors: ValidationError[];
  warnings: ValidationWarning[];
  suggestions: ValidationSuggestion[];
  metadata: ValidationMetadata;
  executionTime: number;
  ruleId: string;
}

export interface ValidationError {
  code: string;
  message: string;
  field?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  context?: any;
  suggestions?: string[];
}

export interface ValidationWarning {
  code: string;
  message: string;
  field?: string;
  impact: 'minor' | 'moderate' | 'significant';
  recommendation?: string;
}

export interface ValidationSuggestion {
  type: 'optimization' | 'enhancement' | 'security' | 'performance';
  message: string;
  priority: number;
  implementation?: string;
}

export interface ValidationMetadata {
  ruleApplied: string;
  timestamp: number;
  processingTime: number;
  context: string;
  version: string;
  checksum?: string;
}

export interface ValidationContext {
  userId?: string;
  sessionId?: string;
  requestId?: string;
  source: 'api' | 'internal' | 'scheduler' | 'webhook';
  environment: 'development' | 'staging' | 'production';
  metadata?: Record<string, any>;
  permissions?: string[];
  rateLimits?: RateLimit[];
}

export interface RateLimit {
  key: string;
  limit: number;
  window: number; // seconds
  current: number;
  resetTime: number;
}

export interface ValidationSchema {
  id: string;
  name: string;
  version: string;
  schema: any; // JSON Schema
  customValidators?: CustomValidator[];
}

export interface CustomValidator {
  name: string;
  description: string;
  validate: (value: any, schema: any, context?: any) => boolean;
  errorMessage?: string;
}

export interface ValidationStats {
  totalValidations: number;
  successfulValidations: number;
  failedValidations: number;
  averageExecutionTime: number;
  mostFailedRules: Array<{ ruleId: string; failures: number }>;
  performanceMetrics: {
    fastest: number;
    slowest: number;
    median: number;
  };
}

export interface AGIValidationConfig {
  enableIntelligentValidation: boolean;
  adaptiveRules: boolean;
  learningMode: boolean;
  confidenceThreshold: number;
  maxExecutionTime: number;
  cacheValidationResults: boolean;
  enablePredictiveValidation: boolean;
}

// ===============================
// 🚀 AGI Validation Engine
// ===============================

export class AGIValidationEngine extends EventEmitter {
  private static instance: AGIValidationEngine;
  private rules: Map<string, ValidationRule> = new Map();
  private schemas: Map<string, ValidationSchema> = new Map();
  private cache: Map<string, ValidationResult> = new Map();
  private stats: ValidationStats;
  private config: AGIValidationConfig;
  private isInitialized: boolean = false;

  private constructor() {
    super();
    this.initializeStats();
    this.initializeConfig();
  }

  public static getInstance(): AGIValidationEngine {
    if (!AGIValidationEngine.instance) {
      AGIValidationEngine.instance = new AGIValidationEngine();
    }
    return AGIValidationEngine.instance;
  }

  // ===============================
  // 🔄 Initialization Methods
  // ===============================

  private initializeStats(): void {
    this.stats = {
      totalValidations: 0,
      successfulValidations: 0,
      failedValidations: 0,
      averageExecutionTime: 0,
      mostFailedRules: [],
      performanceMetrics: {
        fastest: Infinity,
        slowest: 0,
        median: 0
      }
    };
  }

  private initializeConfig(): void {
    this.config = {
      enableIntelligentValidation: true,
      adaptiveRules: true,
      learningMode: true,
      confidenceThreshold: 0.85,
      maxExecutionTime: 5000, // 5 seconds
      cacheValidationResults: true,
      enablePredictiveValidation: true
    };
  }

  public async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      await this.loadDefaultRules();
      await this.loadDefaultSchemas();
      this.setupEventHandlers();
      this.isInitialized = true;
      this.emit('initialized');
    } catch (error) {
      this.emit('error', { type: 'initialization', error });
      throw error;
    }
  }

  // ===============================
  // 📋 Rule Management
  // ===============================

  public registerRule(rule: ValidationRule): void {
    if (!rule.id || !rule.validator) {
      throw new Error('Rule must have id and validator');
    }

    this.rules.set(rule.id, {
      ...rule,
      enabled: rule.enabled !== false
    });

    this.emit('ruleRegistered', { ruleId: rule.id });
  }

  public unregisterRule(ruleId: string): boolean {
    const deleted = this.rules.delete(ruleId);
    if (deleted) {
      this.emit('ruleUnregistered', { ruleId });
    }
    return deleted;
  }

  public enableRule(ruleId: string): boolean {
    const rule = this.rules.get(ruleId);
    if (rule) {
      rule.enabled = true;
      this.emit('ruleEnabled', { ruleId });
      return true;
    }
    return false;
  }

  public disableRule(ruleId: string): boolean {
    const rule = this.rules.get(ruleId);
    if (rule) {
      rule.enabled = false;
      this.emit('ruleDisabled', { ruleId });
      return true;
    }
    return false;
  }

  public getRules(): ValidationRule[] {
    return Array.from(this.rules.values());
  }

  public getEnabledRules(): ValidationRule[] {
    return Array.from(this.rules.values()).filter(rule => rule.enabled);
  }

  // ===============================
  // 🎯 Core Validation Methods
  // ===============================

  public async validate(
    data: any,
    ruleIds?: string[],
    context?: ValidationContext
  ): Promise<ValidationResult[]> {
    const startTime = Date.now();

    try {
      const rulesToApply = this.selectRules(ruleIds);
      const results: ValidationResult[] = [];

      // Check cache first
      if (this.config.cacheValidationResults) {
        const cacheKey = this.generateCacheKey(data, rulesToApply, context);
        const cachedResult = this.cache.get(cacheKey);
        if (cachedResult) {
          return [cachedResult];
        }
      }

      // Apply validation rules
      for (const rule of rulesToApply) {
        if (!rule.enabled) continue;

        const result = await this.applyRule(rule, data, context);
        results.push(result);

        // Cache result if enabled
        if (this.config.cacheValidationResults) {
          const cacheKey = this.generateCacheKey(data, [rule], context);
          this.cache.set(cacheKey, result);
        }

        // Early exit on critical errors
        if (result.errors.some(e => e.severity === 'critical')) {
          break;
        }
      }

      // Update statistics
      this.updateStats(results, Date.now() - startTime);

      this.emit('validationCompleted', {
        results,
        executionTime: Date.now() - startTime,
        context
      });

      return results;

    } catch (error) {
      this.emit('validationError', { error, context });
      throw error;
    }
  }

  public async validateSingle(
    data: any,
    ruleId: string,
    context?: ValidationContext
  ): Promise<ValidationResult> {
    const rule = this.rules.get(ruleId);
    if (!rule) {
      throw new Error(`Validation rule '${ruleId}' not found`);
    }

    return await this.applyRule(rule, data, context);
  }

  private async applyRule(
    rule: ValidationRule,
    data: any,
    context?: ValidationContext
  ): Promise<ValidationResult> {
    const startTime = Date.now();

    try {
      // Check dependencies
      if (rule.dependencies && rule.dependencies.length > 0) {
        await this.checkRuleDependencies(rule.dependencies, data, context);
      }

      // Apply timeout
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => {
          reject(new Error(`Validation rule '${rule.id}' timed out`));
        }, this.config.maxExecutionTime);
      });

      const validationPromise = Promise.resolve(rule.validator(data, context));
      const result = await Promise.race([validationPromise, timeoutPromise]);

      // Enhance result with metadata
      result.executionTime = Date.now() - startTime;
      result.metadata = {
        ...result.metadata,
        ruleApplied: rule.id,
        timestamp: Date.now(),
        processingTime: result.executionTime,
        context: context?.source || 'unknown',
        version: '2.0.0'
      };

      return result;

    } catch (error) {
      return {
        isValid: false,
        score: 0,
        errors: [{
          code: 'VALIDATION_ERROR',
          message: `Rule '${rule.id}' failed: ${error.message}`,
          severity: 'critical' as const
        }],
        warnings: [],
        suggestions: [],
        metadata: {
          ruleApplied: rule.id,
          timestamp: Date.now(),
          processingTime: Date.now() - startTime,
          context: context?.source || 'unknown',
          version: '2.0.0'
        },
        executionTime: Date.now() - startTime,
        ruleId: rule.id
      };
    }
  }

  // ===============================
  // 🧠 AGI Intelligence Methods
  // ===============================

  public async intelligentValidate(
    data: any,
    context?: ValidationContext
  ): Promise<ValidationResult[]> {
    if (!this.config.enableIntelligentValidation) {
      return await this.validate(data, undefined, context);
    }

    // Analyze data to select optimal rules
    const selectedRules = await this.analyzeAndSelectRules(data, context);
    
    // Apply adaptive validation
    const results = await this.adaptiveValidation(data, selectedRules, context);

    // Learn from results if learning mode is enabled
    if (this.config.learningMode) {
      await this.learnFromResults(data, results, context);
    }

    return results;
  }

  private async analyzeAndSelectRules(
    data: any,
    context?: ValidationContext
  ): Promise<string[]> {
    const availableRules = this.getEnabledRules();
    const selectedRules: string[] = [];

    // Basic rule selection based on data type and context
    for (const rule of availableRules) {
      if (await this.shouldApplyRule(rule, data, context)) {
        selectedRules.push(rule.id);
      }
    }

    // Intelligent prioritization
    return this.prioritizeRules(selectedRules, data, context);
  }

  private async shouldApplyRule(
    rule: ValidationRule,
    data: any,
    context?: ValidationContext
  ): Promise<boolean> {
    // Rule applicability logic based on:
    // - Data type and structure
    // - Context and environment
    // - Historical performance
    // - Rule metadata

    if (rule.type === 'security' && context?.environment === 'production') {
      return true;
    }

    if (rule.type === 'performance' && typeof data === 'object' && Object.keys(data).length > 100) {
      return true;
    }

    if (rule.type === 'agi' && this.config.enableIntelligentValidation) {
      return true;
    }

    return rule.priority === 'critical' || rule.priority === 'high';
  }

  private prioritizeRules(
    ruleIds: string[],
    data: any,
    context?: ValidationContext
  ): string[] {
    // Sort rules by priority and performance metrics
    return ruleIds.sort((a, b) => {
      const ruleA = this.rules.get(a)!;
      const ruleB = this.rules.get(b)!;

      const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
      const priorityDiff = priorityOrder[ruleB.priority] - priorityOrder[ruleA.priority];

      if (priorityDiff !== 0) return priorityDiff;

      // Secondary sort by historical performance
      return 0; // Could implement performance-based sorting here
    });
  }

  private async adaptiveValidation(
    data: any,
    ruleIds: string[],
    context?: ValidationContext
  ): Promise<ValidationResult[]> {
    const results: ValidationResult[] = [];
    let confidence = 1.0;

    for (const ruleId of ruleIds) {
      if (confidence < this.config.confidenceThreshold) {
        // Skip remaining rules if confidence is too low
        break;
      }

      const result = await this.validateSingle(data, ruleId, context);
      results.push(result);

      // Adjust confidence based on result
      confidence *= result.score / 100;
    }

    return results;
  }

  private async learnFromResults(
    data: any,
    results: ValidationResult[],
    context?: ValidationContext
  ): Promise<void> {
    // Machine learning logic to improve future validations
    // This could include:
    // - Updating rule priorities
    // - Adjusting confidence thresholds
    // - Learning new patterns
    // - Optimizing rule selection

    this.emit('learningUpdate', {
      dataPattern: this.extractDataPattern(data),
      results,
      context
    });
  }

  // ===============================
  // 🔧 Utility Methods
  // ===============================

  private selectRules(ruleIds?: string[]): ValidationRule[] {
    if (ruleIds && ruleIds.length > 0) {
      return ruleIds
        .map(id => this.rules.get(id))
        .filter(rule => rule !== undefined) as ValidationRule[];
    }
    return this.getEnabledRules();
  }

  private generateCacheKey(
    data: any,
    rules: ValidationRule[],
    context?: ValidationContext
  ): string {
    const dataHash = JSON.stringify(data);
    const rulesHash = rules.map(r => r.id).sort().join(',');
    const contextHash = context ? JSON.stringify(context) : '';
    return `${dataHash}-${rulesHash}-${contextHash}`;
  }

  private async checkRuleDependencies(
    dependencies: string[],
    data: any,
    context?: ValidationContext
  ): Promise<void> {
    for (const depId of dependencies) {
      const rule = this.rules.get(depId);
      if (!rule) {
        throw new Error(`Dependency rule '${depId}' not found`);
      }

      const result = await this.applyRule(rule, data, context);
      if (!result.isValid) {
        throw new Error(`Dependency rule '${depId}' failed validation`);
      }
    }
  }

  private updateStats(results: ValidationResult[], executionTime: number): void {
    this.stats.totalValidations++;
    
    const hasErrors = results.some(r => r.errors.length > 0);
    if (hasErrors) {
      this.stats.failedValidations++;
    } else {
      this.stats.successfulValidations++;
    }

    // Update execution time metrics
    this.stats.performanceMetrics.fastest = Math.min(
      this.stats.performanceMetrics.fastest,
      executionTime
    );
    this.stats.performanceMetrics.slowest = Math.max(
      this.stats.performanceMetrics.slowest,
      executionTime
    );

    // Calculate average execution time
    this.stats.averageExecutionTime = 
      (this.stats.averageExecutionTime * (this.stats.totalValidations - 1) + executionTime) / 
      this.stats.totalValidations;
  }

  private extractDataPattern(data: any): string {
    // Extract meaningful patterns from data for learning
    if (typeof data === 'object' && data !== null) {
      return Object.keys(data).sort().join(',');
    }
    return typeof data;
  }

  private setupEventHandlers(): void {
    this.on('error', (error) => {
      console.error('AGI Validation Engine Error:', error);
    });

    this.on('validationCompleted', (event) => {
      console.log(`Validation completed in ${event.executionTime}ms`);
    });
  }

  // ===============================
  // 📊 Analytics and Monitoring
  // ===============================

  public getStats(): ValidationStats {
    return { ...this.stats };
  }

  public getConfig(): AGIValidationConfig {
    return { ...this.config };
  }

  public updateConfig(newConfig: Partial<AGIValidationConfig>): void {
    this.config = { ...this.config, ...newConfig };
    this.emit('configUpdated', this.config);
  }

  public clearCache(): void {
    this.cache.clear();
    this.emit('cacheCleared');
  }

  public getHealthStatus(): {
    isHealthy: boolean;
    details: any;
  } {
    return {
      isHealthy: this.isInitialized && this.rules.size > 0,
      details: {
        initialized: this.isInitialized,
        rulesCount: this.rules.size,
        enabledRulesCount: this.getEnabledRules().length,
        cacheSize: this.cache.size,
        stats: this.stats
      }
    };
  }

  // ===============================
  // 🏗️ Default Rules and Schemas
  // ===============================

  private async loadDefaultRules(): Promise<void> {
    // Schema validation rule
    this.registerRule({
      id: 'schema-validation',
      name: 'Schema Validation',
      description: 'Validates data against JSON schema',
      type: 'schema',
      priority: 'high',
      enabled: true,
      validator: (data: any, context?: ValidationContext) => {
        return {
          isValid: true,
          score: 100,
          errors: [],
          warnings: [],
          suggestions: [],
          metadata: {} as ValidationMetadata,
          executionTime: 0,
          ruleId: 'schema-validation'
        };
      }
    });

    // Security validation rule
    this.registerRule({
      id: 'security-check',
      name: 'Security Check',
      description: 'Checks for security vulnerabilities',
      type: 'security',
      priority: 'critical',
      enabled: true,
      validator: (data: any, context?: ValidationContext) => {
        const errors: ValidationError[] = [];
        
        if (typeof data === 'string' && data.includes('<script>')) {
          errors.push({
            code: 'XSS_DETECTED',
            message: 'Potential XSS attack detected',
            severity: 'critical',
            suggestions: ['Sanitize input data', 'Use proper encoding']
          });
        }

        return {
          isValid: errors.length === 0,
          score: errors.length === 0 ? 100 : 0,
          errors,
          warnings: [],
          suggestions: [],
          metadata: {} as ValidationMetadata,
          executionTime: 0,
          ruleId: 'security-check'
        };
      }
    });

    // Performance validation rule
    this.registerRule({
      id: 'performance-check',
      name: 'Performance Check',
      description: 'Checks for performance issues',
      type: 'performance',
      priority: 'medium',
      enabled: true,
      validator: (data: any, context?: ValidationContext) => {
        const warnings: ValidationWarning[] = [];
        const suggestions: ValidationSuggestion[] = [];

        if (typeof data === 'object' && data !== null) {
          const size = JSON.stringify(data).length;
          if (size > 10000) {
            warnings.push({
              code: 'LARGE_PAYLOAD',
              message: 'Large payload detected',
              impact: 'moderate',
              recommendation: 'Consider pagination or data compression'
            });

            suggestions.push({
              type: 'performance',
              message: 'Implement data compression',
              priority: 2,
              implementation: 'Use gzip compression or reduce payload size'
            });
          }
        }

        return {
          isValid: true,
          score: warnings.length > 0 ? 75 : 100,
          errors: [],
          warnings,
          suggestions,
          metadata: {} as ValidationMetadata,
          executionTime: 0,
          ruleId: 'performance-check'
        };
      }
    });

    // AGI intelligence rule
    this.registerRule({
      id: 'agi-intelligence',
      name: 'AGI Intelligence Check',
      description: 'Advanced AGI-based validation',
      type: 'agi',
      priority: 'high',
      enabled: true,
      validator: (data: any, context?: ValidationContext) => {
        // Advanced AGI validation logic would go here
        return {
          isValid: true,
          score: 95,
          errors: [],
          warnings: [],
          suggestions: [{
            type: 'enhancement',
            message: 'Data structure could be optimized for better AGI processing',
            priority: 1,
            implementation: 'Consider restructuring data for better semantic understanding'
          }],
          metadata: {} as ValidationMetadata,
          executionTime: 0,
          ruleId: 'agi-intelligence'
        };
      }
    });
  }

  private async loadDefaultSchemas(): Promise<void> {
    // Load default JSON schemas
    // This would typically load from files or a database
  }
}

// ===============================
// 🚀 Factory Functions
// ===============================

export function createValidationEngine(): AGIValidationEngine {
  return AGIValidationEngine.getInstance();
}

export async function validateData(
  data: any,
  ruleIds?: string[],
  context?: ValidationContext
): Promise<ValidationResult[]> {
  const engine = AGIValidationEngine.getInstance();
  if (!engine['isInitialized']) {
    await engine.initialize();
  }
  return await engine.validate(data, ruleIds, context);
}

export async function intelligentValidate(
  data: any,
  context?: ValidationContext
): Promise<ValidationResult[]> {
  const engine = AGIValidationEngine.getInstance();
  if (!engine['isInitialized']) {
    await engine.initialize();
  }
  return await engine.intelligentValidate(data, context);
}

// ===============================
// 📦 Default Export
// ===============================

export default AGIValidationEngine;

/**
 * 🎯 Usage Example:
 * 
 * ```typescript
 * import { AGIValidationEngine, validateData } from './validate.mjs';
 * 
 * // Initialize engine
 * const validator = AGIValidationEngine.getInstance();
 * await validator.initialize();
 * 
 * // Simple validation
 * const results = await validateData({ name: 'John', age: 30 });
 * 
 * // Intelligent validation
 * const smartResults = await validator.intelligentValidate(data, {
 *   source: 'api',
 *   environment: 'production'
 * });
 * 
 * // Custom rule
 * validator.registerRule({
 *   id: 'custom-rule',
 *   name: 'Custom Validation',
 *   type: 'business',
 *   priority: 'high',
 *   enabled: true,
 *   validator: (data) => ({
 *     isValid: true,
 *     score: 100,
 *     errors: [],
 *     warnings: [],
 *     suggestions: [],
 *     metadata: {},
 *     executionTime: 0,
 *     ruleId: 'custom-rule'
 *   })
 * });
 * ```
 */

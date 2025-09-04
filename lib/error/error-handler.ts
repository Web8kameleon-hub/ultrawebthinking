// Advanced Error Handling System for EuroWeb Ultra
import { NextResponse } from 'next/server';

// Error Types
export enum ErrorType {
  VALIDATION = 'VALIDATION_ERROR',
  AUTHENTICATION = 'AUTHENTICATION_ERROR',
  AUTHORIZATION = 'AUTHORIZATION_ERROR',
  NOT_FOUND = 'NOT_FOUND_ERROR',
  RATE_LIMIT = 'RATE_LIMIT_ERROR',
  INTERNAL = 'INTERNAL_SERVER_ERROR',
  NETWORK = 'NETWORK_ERROR',
  DATABASE = 'DATABASE_ERROR',
  AGI_MODULE = 'AGI_MODULE_ERROR',
  CACHE = 'CACHE_ERROR',
  SECURITY = 'SECURITY_ERROR',
}

export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

// Error Interface
export interface AppError {
  type: ErrorType;
  severity: ErrorSeverity;
  message: string;
  code: string;
  details?: Record<string, any>;
  stack?: string;
  timestamp: number;
  requestId?: string;
  userId?: string;
  locale?: string;
  recoverable: boolean;
  retryable: boolean;
  suggestions?: string[];
}

// Error Context
interface ErrorContext {
  requestId?: string;
  userId?: string;
  locale?: string;
  endpoint?: string;
  userAgent?: string;
  ip?: string;
  method?: string;
  body?: any;
  headers?: Record<string, string>;
}

// Recovery Strategy
interface RecoveryStrategy {
  type: 'retry' | 'fallback' | 'graceful_degradation' | 'circuit_breaker';
  maxRetries?: number;
  retryDelay?: number;
  fallbackValue?: any;
  fallbackFunction?: () => any;
  circuitBreakerThreshold?: number;
}

class ErrorHandler {
  private errorLogs: AppError[] = [];
  private circuitBreakers: Map<string, { failures: number; lastFailure: number; isOpen: boolean }> = new Map();
  private readonly maxErrorLogs = 10000;
  private readonly circuitBreakerTimeout = 60000; // 1 minute

  // Create standardized errors
  createError(
    type: ErrorType,
    message: string,
    code: string,
    severity: ErrorSeverity = ErrorSeverity.MEDIUM,
    details?: Record<string, any>,
    context?: ErrorContext
  ): AppError {
    const error: AppError = {
      type,
      severity,
      message,
      code,
      details,
      timestamp: Date.now(),
      requestId: context?.requestId,
      userId: context?.userId,
      locale: context?.locale || 'sq',
      recoverable: this.isRecoverable(type),
      retryable: this.isRetryable(type),
      suggestions: this.generateSuggestions(type, code),
    };

    this.logError(error, context);
    return error;
  }

  // Handle different error types
  handleValidationError(
    message: string,
    field?: string,
    value?: any,
    context?: ErrorContext
  ): AppError {
    return this.createError(
      ErrorType.VALIDATION,
      message,
      'VALIDATION_FAILED',
      ErrorSeverity.LOW,
      { field, value },
      context
    );
  }

  handleAuthenticationError(
    message: string = 'Authentication required',
    context?: ErrorContext
  ): AppError {
    return this.createError(
      ErrorType.AUTHENTICATION,
      message,
      'AUTH_REQUIRED',
      ErrorSeverity.MEDIUM,
      undefined,
      context
    );
  }

  handleAuthorizationError(
    message: string = 'Insufficient permissions',
    requiredPermission?: string,
    context?: ErrorContext
  ): AppError {
    return this.createError(
      ErrorType.AUTHORIZATION,
      message,
      'INSUFFICIENT_PERMISSIONS',
      ErrorSeverity.MEDIUM,
      { requiredPermission },
      context
    );
  }

  handleNotFoundError(
    resource: string,
    id?: string,
    context?: ErrorContext
  ): AppError {
    return this.createError(
      ErrorType.NOT_FOUND,
      `${resource} not found`,
      'RESOURCE_NOT_FOUND',
      ErrorSeverity.LOW,
      { resource, id },
      context
    );
  }

  handleRateLimitError(
    limit: number,
    resetTime: number,
    context?: ErrorContext
  ): AppError {
    return this.createError(
      ErrorType.RATE_LIMIT,
      'Rate limit exceeded',
      'RATE_LIMIT_EXCEEDED',
      ErrorSeverity.MEDIUM,
      { limit, resetTime },
      context
    );
  }

  handleDatabaseError(
    operation: string,
    originalError: Error,
    context?: ErrorContext
  ): AppError {
    return this.createError(
      ErrorType.DATABASE,
      `Database ${operation} failed`,
      'DATABASE_OPERATION_FAILED',
      ErrorSeverity.HIGH,
      { operation, originalMessage: originalError.message },
      context
    );
  }

  handleAGIModuleError(
    module: string,
    operation: string,
    originalError: Error,
    context?: ErrorContext
  ): AppError {
    return this.createError(
      ErrorType.AGI_MODULE,
      `AGI ${module} module failed during ${operation}`,
      'AGI_MODULE_FAILED',
      ErrorSeverity.HIGH,
      { module, operation, originalMessage: originalError.message },
      context
    );
  }

  handleNetworkError(
    endpoint: string,
    originalError: Error,
    context?: ErrorContext
  ): AppError {
    return this.createError(
      ErrorType.NETWORK,
      `Network request to ${endpoint} failed`,
      'NETWORK_REQUEST_FAILED',
      ErrorSeverity.MEDIUM,
      { endpoint, originalMessage: originalError.message },
      context
    );
  }

  handleSecurityError(
    threat: string,
    details: Record<string, any>,
    context?: ErrorContext
  ): AppError {
    return this.createError(
      ErrorType.SECURITY,
      `Security threat detected: ${threat}`,
      'SECURITY_THREAT',
      ErrorSeverity.HIGH,
      details,
      context
    );
  }

  // Error Recovery
  async handleWithRecovery<T>(
    operation: () => Promise<T>,
    recoveryStrategy: RecoveryStrategy,
    context?: ErrorContext
  ): Promise<T> {
    const operationKey = context?.endpoint || 'unknown';
    
    // Check circuit breaker
    if (this.isCircuitBreakerOpen(operationKey)) {
      throw this.createError(
        ErrorType.INTERNAL,
        'Service temporarily unavailable',
        'CIRCUIT_BREAKER_OPEN',
        ErrorSeverity.HIGH,
        { strategy: recoveryStrategy.type },
        context
      );
    }

    let lastError: Error;
    let attempts = 0;
    const maxRetries = recoveryStrategy.maxRetries || 3;

    while (attempts <= maxRetries) {
      try {
        const result = await operation();
        
        // Reset circuit breaker on success
        this.resetCircuitBreaker(operationKey);
        
        return result;
      } catch (error) {
        lastError = error as Error;
        attempts++;

        // Record failure for circuit breaker
        this.recordFailure(operationKey);

        if (attempts <= maxRetries && recoveryStrategy.type === 'retry') {
          const delay = recoveryStrategy.retryDelay || 1000 * attempts;
          await this.delay(delay);
          continue;
        }

        break;
      }
    }

    // Apply recovery strategy
    switch (recoveryStrategy.type) {
      case 'fallback':
        if (recoveryStrategy.fallbackFunction) {
          return recoveryStrategy.fallbackFunction();
        }
        return recoveryStrategy.fallbackValue as T;

      case 'graceful_degradation':
        // Return simplified/cached version
        return this.getGracefulDegradationValue<T>(operationKey, context);

      case 'circuit_breaker':
        this.openCircuitBreaker(operationKey);
        throw this.createError(
          ErrorType.INTERNAL,
          'Service circuit breaker activated',
          'CIRCUIT_BREAKER_ACTIVATED',
          ErrorSeverity.HIGH,
          { attempts, maxRetries },
          context
        );

      default:
        throw lastError!;
    }
  }

  // Convert AppError to HTTP Response
  toHttpResponse(error: AppError): NextResponse {
    const statusCode = this.getHttpStatusCode(error.type);
    
    const responseBody = {
      error: {
        type: error.type,
        code: error.code,
        message: this.getLocalizedMessage(error.message, error.locale),
        severity: error.severity,
        timestamp: error.timestamp,
        requestId: error.requestId,
        recoverable: error.recoverable,
        retryable: error.retryable,
        suggestions: error.suggestions,
        ...(process.env.NODE_ENV === 'development' && { details: error.details }),
      },
    };

    return NextResponse.json(responseBody, { status: statusCode });
  }

  // Get user-friendly error messages
  getLocalizedMessage(message: string, locale: string = 'sq'): string {
    const messages: Record<string, Record<string, string>> = {
      sq: {
        'Authentication required': 'Autentifikimi është i nevojshëm',
        'Insufficient permissions': 'Nuk keni leje të mjaftueshme',
        'Rate limit exceeded': 'Kufiri i kërkesave është tejkaluar',
        'Validation failed': 'Verifikimi dështoi',
        'Resource not found': 'Resursi nuk u gjet',
        'Internal server error': 'Gabim i brendshëm i serverit',
        'Network request failed': 'Kërkesa e rrjetit dështoi',
        'Database operation failed': 'Operacioni i bazës së të dhënave dështoi',
        'AGI module failed': 'Moduli AGI dështoi',
        'Security threat detected': 'U zbulua kërcënim sigurie',
      },
      en: {
        'Authentication required': 'Authentication required',
        'Insufficient permissions': 'Insufficient permissions',
        'Rate limit exceeded': 'Rate limit exceeded',
        'Validation failed': 'Validation failed',
        'Resource not found': 'Resource not found',
        'Internal server error': 'Internal server error',
        'Network request failed': 'Network request failed',
        'Database operation failed': 'Database operation failed',
        'AGI module failed': 'AGI module failed',
        'Security threat detected': 'Security threat detected',
      },
    };

    return messages[locale]?.[message] || message;
  }

  // Error Analytics
  getErrorAnalytics(timeWindow: number = 3600000): {
    summary: any;
    trends: any;
    critical: AppError[];
  } {
    const now = Date.now();
    const cutoff = now - timeWindow;
    const recentErrors = this.errorLogs.filter(err => err.timestamp > cutoff);

    const errorTypes = recentErrors.reduce((acc, err) => {
      acc[err.type] = (acc[err.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const severityCounts = recentErrors.reduce((acc, err) => {
      acc[err.severity] = (acc[err.severity] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const criticalErrors = recentErrors.filter(err => err.severity === ErrorSeverity.CRITICAL);

    return {
      summary: {
        totalErrors: recentErrors.length,
        errorTypes,
        severityBreakdown: severityCounts,
        timeWindow: timeWindow / 1000 / 60, // minutes
      },
      trends: this.calculateErrorTrends(recentErrors),
      critical: criticalErrors.slice(-10), // Last 10 critical errors
    };
  }

  // Private Methods
  private logError(error: AppError, context?: ErrorContext): void {
    this.errorLogs.push(error);

    // Keep only recent errors
    if (this.errorLogs.length > this.maxErrorLogs) {
      this.errorLogs = this.errorLogs.slice(-this.maxErrorLogs);
    }

    // Log to console based on severity
    const logLevel = error.severity === ErrorSeverity.CRITICAL ? 'error' : 
                    error.severity === ErrorSeverity.HIGH ? 'error' :
                    error.severity === ErrorSeverity.MEDIUM ? 'warn' : 'info';

    console[logLevel](`[${error.severity.toUpperCase()}] ${error.type}: ${error.message}`, {
      code: error.code,
      requestId: error.requestId,
      details: error.details,
      context,
    });
  }

  private isRecoverable(type: ErrorType): boolean {
    const recoverableTypes = [
      ErrorType.NETWORK,
      ErrorType.RATE_LIMIT,
      ErrorType.CACHE,
    ];
    return recoverableTypes.includes(type);
  }

  private isRetryable(type: ErrorType): boolean {
    const retryableTypes = [
      ErrorType.NETWORK,
      ErrorType.DATABASE,
      ErrorType.INTERNAL,
    ];
    return retryableTypes.includes(type);
  }

  private generateSuggestions(type: ErrorType, code: string): string[] {
    const suggestions: Record<string, string[]> = {
      [ErrorType.VALIDATION]: ['Check input format', 'Verify required fields', 'Review validation rules'],
      [ErrorType.AUTHENTICATION]: ['Login with valid credentials', 'Check token expiration', 'Contact support'],
      [ErrorType.AUTHORIZATION]: ['Request necessary permissions', 'Contact administrator', 'Verify user role'],
      [ErrorType.RATE_LIMIT]: ['Wait before retrying', 'Reduce request frequency', 'Contact support for limits'],
      [ErrorType.NETWORK]: ['Check internet connection', 'Retry request', 'Contact support if persistent'],
      [ErrorType.NOT_FOUND]: ['Verify resource ID', 'Check resource exists', 'Try different parameters'],
    };

    return suggestions[type] || ['Contact support for assistance'];
  }

  private getHttpStatusCode(type: ErrorType): number {
    const statusCodes: Record<ErrorType, number> = {
      [ErrorType.VALIDATION]: 400,
      [ErrorType.AUTHENTICATION]: 401,
      [ErrorType.AUTHORIZATION]: 403,
      [ErrorType.NOT_FOUND]: 404,
      [ErrorType.RATE_LIMIT]: 429,
      [ErrorType.INTERNAL]: 500,
      [ErrorType.NETWORK]: 502,
      [ErrorType.DATABASE]: 503,
      [ErrorType.AGI_MODULE]: 503,
      [ErrorType.CACHE]: 503,
      [ErrorType.SECURITY]: 403,
    };

    return statusCodes[type] || 500;
  }

  private isCircuitBreakerOpen(key: string): boolean {
    const breaker = this.circuitBreakers.get(key);
    if (!breaker) return false;

    if (breaker.isOpen && Date.now() - breaker.lastFailure > this.circuitBreakerTimeout) {
      breaker.isOpen = false;
      breaker.failures = 0;
    }

    return breaker.isOpen;
  }

  private recordFailure(key: string): void {
    let breaker = this.circuitBreakers.get(key);
    if (!breaker) {
      breaker = { failures: 0, lastFailure: 0, isOpen: false };
      this.circuitBreakers.set(key, breaker);
    }

    breaker.failures++;
    breaker.lastFailure = Date.now();
  }

  private openCircuitBreaker(key: string): void {
    const breaker = this.circuitBreakers.get(key);
    if (breaker) {
      breaker.isOpen = true;
    }
  }

  private resetCircuitBreaker(key: string): void {
    const breaker = this.circuitBreakers.get(key);
    if (breaker) {
      breaker.failures = 0;
      breaker.isOpen = false;
    }
  }

  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private getGracefulDegradationValue<T>(operationKey: string, context?: ErrorContext): T {
    // Return cached or simplified version
    // This would integrate with your cache system
    return {} as T;
  }

  private calculateErrorTrends(errors: AppError[]): any {
    // Group errors by hour for trend analysis
    const hourlyErrors = errors.reduce((acc, err) => {
      const hour = new Date(err.timestamp).getHours();
      acc[hour] = (acc[hour] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);

    return { hourlyDistribution: hourlyErrors };
  }
}

// Singleton instance
export const errorHandler = new ErrorHandler();
export default errorHandler;

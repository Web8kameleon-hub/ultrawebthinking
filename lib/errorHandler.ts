/**
 * Web8 Industrial Error Handling & Monitoring
 * Production-ready error management system
 * 
 * @author UltraWeb Industrial Team
 * @version 8.0.0-ERROR-HANDLING
 */

import { NextRequest, NextResponse } from 'next/server';

// Error Types
export enum ErrorType {
  VALIDATION = 'VALIDATION_ERROR',
  AUTHENTICATION = 'AUTH_ERROR', 
  AUTHORIZATION = 'AUTHZ_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  RATE_LIMIT = 'RATE_LIMIT_EXCEEDED',
  EXTERNAL_API = 'EXTERNAL_API_ERROR',
  DATABASE = 'DATABASE_ERROR',
  NEURAL_ENGINE = 'NEURAL_ENGINE_ERROR',
  SYSTEM = 'SYSTEM_ERROR',
  UNKNOWN = 'UNKNOWN_ERROR'
}

// Error Severity Levels
export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

// Industrial Error Interface
export interface IndustrialError {
  id: string;
  type: ErrorType;
  severity: ErrorSeverity;
  message: string;
  details?: unknown;
  timestamp: string;
  requestId?: string | undefined;
  userId?: string | undefined;
  userAgent?: string | undefined;
  ip?: string | undefined;
  endpoint?: string | undefined;
  method?: string | undefined;
  stack?: string | undefined;
  context?: Record<string, any> | undefined;
}

// Error Statistics
interface ErrorStats {
  total: number;
  byType: Record<ErrorType, number>;
  bySeverity: Record<ErrorSeverity, number>;
  last24h: number;
  avgResponseTime: number;
}

class IndustrialErrorHandler {
  private errors: IndustrialError[] = [];
  private readonly maxErrors = 1000; // Keep last 1000 errors in memory
  
  /**
   * Log and track industrial error
   */
  logError(
    error: Error | any,
    type: ErrorType = ErrorType.UNKNOWN,
    severity: ErrorSeverity = ErrorSeverity.MEDIUM,
    context?: {
      request?: NextRequest;
      userId?: string;
      additionalContext?: Record<string, any>;
    }
  ): IndustrialError {
    const errorId = this.generateErrorId();
    const timestamp = new Date().toISOString();
    
    const industrialError: IndustrialError = {
      id: errorId,
      type,
      severity,
      message: error?.message || 'Unknown error occurred',
      details: error?.cause || error?.details,
      timestamp,
      requestId: context?.request?.headers.get('x-request-id') || undefined,
      userId: context?.userId,
      userAgent: context?.request?.headers.get('user-agent') || undefined,
      ip: this.extractClientIP(context?.request),
      endpoint: context?.request?.nextUrl?.pathname,
      method: context?.request?.method,
      stack: error?.stack,
      context: context?.additionalContext
    };
    
    // Add to in-memory storage
    this.errors.unshift(industrialError);
    if (this.errors.length > this.maxErrors) {
      this.errors = this.errors.slice(0, this.maxErrors);
    }
    
    // Log to console with appropriate level
    this.logToConsole(industrialError);
    
    // Send to monitoring services in production
    this.sendToMonitoring(industrialError);
    
    return industrialError;
  }
  
  /**
   * Create standardized error response
   */
  createErrorResponse(
    error: IndustrialError,
    publicMessage?: string
  ): NextResponse {
    const isProduction = process.env.NODE_ENV === 'production';
    
    const responseData = {
      success: false,
      error: {
        id: error.id,
        type: error.type,
        message: publicMessage || (isProduction ? this.getPublicMessage(error.type) : error.message),
        timestamp: error.timestamp,
        ...(isProduction ? {} : {
          details: error.details,
          stack: error.stack
        })
      }
    };
    
    const statusCode = this.getStatusCodeForErrorType(error.type);
    
    return NextResponse.json(responseData, {
      status: statusCode,
      headers: {
        'X-Error-Id': error.id,
        'X-Error-Type': error.type
      }
    });
  }
  
  /**
   * Get error statistics
   */
  getErrorStats(): ErrorStats {
    const now = Date.now();
    const last24h = this.errors.filter(
      err => (now - new Date(err.timestamp).getTime()) < 24 * 60 * 60 * 1000
    );
    
    const byType: Record<ErrorType, number> = {} as any;
    const bySeverity: Record<ErrorSeverity, number> = {} as any;
    
    // Initialize counters
    Object.values(ErrorType).forEach(type => byType[type] = 0);
    Object.values(ErrorSeverity).forEach(severity => bySeverity[severity] = 0);
    
    // Count errors
    this.errors.forEach(error => {
      byType[error.type]++;
      bySeverity[error.severity]++;
    });
    
    return {
      total: this.errors.length,
      byType,
      bySeverity,
      last24h: last24h.length,
      avgResponseTime: 150 // Simulated
    };
  }
  
  /**
   * Get recent errors
   */
  getRecentErrors(limit = 50): IndustrialError[] {
    return this.errors.slice(0, limit);
  }
  
  /**
   * Clear error history
   */
  clearErrors(): void {
    this.errors = [];
    }
  
  // Private methods
  
    private generateErrorId(): string {
      return `ERR_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    
    private extractClientIP(request?: NextRequest): string | undefined {
      if (!request) return undefined;
      
      // Check for common IP headers
      const xForwardedFor = request.headers.get('x-forwarded-for');
      const xRealIp = request.headers.get('x-real-ip');
      const cfConnectingIp = request.headers.get('cf-connecting-ip');
      
      if (xForwardedFor) {
        // X-Forwarded-For can contain multiple IPs, take the first one
        return xForwardedFor.split(',')[0]?.trim();
      }
      
      if (xRealIp) return xRealIp;
      if (cfConnectingIp) return cfConnectingIp;
      
      return undefined;
    }
    
    private logToConsole(error: IndustrialError): void {
      const logMessage = `[${error.type}] ${error.message}`;
      
      switch (error.severity) {
        case ErrorSeverity.CRITICAL:
        case ErrorSeverity.HIGH:
          console.error(`❌ ${logMessage}`);
          break;
        case ErrorSeverity.MEDIUM:
          console.warn(`⚠️ ${logMessage}`);
          break;
        default:
          console.log(`ℹ️ ${logMessage}`);
      }
    }
    
    private sendToMonitoring(error: IndustrialError): void {
      // In production, send to monitoring services like Sentry, DataDog, etc.
      if (process.env.NODE_ENV === 'production') {
        // Implementation would go here
      }
    }
    
    private getPublicMessage(type: ErrorType): string {
      const messages = {
        [ErrorType.VALIDATION]: 'Invalid request data',
        [ErrorType.AUTHENTICATION]: 'Authentication required',
        [ErrorType.AUTHORIZATION]: 'Access denied',
        [ErrorType.NOT_FOUND]: 'Resource not found',
        [ErrorType.RATE_LIMIT]: 'Too many requests',
        [ErrorType.EXTERNAL_API]: 'External service unavailable',
        [ErrorType.DATABASE]: 'Database error',
        [ErrorType.NEURAL_ENGINE]: 'AI processing error',
        [ErrorType.SYSTEM]: 'Internal server error',
        [ErrorType.UNKNOWN]: 'An unexpected error occurred'
      };
      
      return messages[type] || 'An error occurred';
    }
    
    private getStatusCodeForErrorType(type: ErrorType): number {
      const statusCodes = {
        [ErrorType.VALIDATION]: 400,
        [ErrorType.AUTHENTICATION]: 401,
        [ErrorType.AUTHORIZATION]: 403,
        [ErrorType.NOT_FOUND]: 404,
        [ErrorType.RATE_LIMIT]: 429,
        [ErrorType.EXTERNAL_API]: 502,
        [ErrorType.DATABASE]: 500,
        [ErrorType.NEURAL_ENGINE]: 500,
        [ErrorType.SYSTEM]: 500,
        [ErrorType.UNKNOWN]: 500
      };
      
      return statusCodes[type] || 500;
    }
  }
  
  // Export singleton instance
  export const errorHandler = new IndustrialErrorHandler();
  
  // Export utility functions
  export const logError = errorHandler.logError.bind(errorHandler);
  export const createErrorResponse = errorHandler.createErrorResponse.bind(errorHandler);
  export const getErrorStats = errorHandler.getErrorStats.bind(errorHandler);
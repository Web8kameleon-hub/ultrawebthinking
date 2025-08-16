/**
 * Web8 Guardian - Functional Security System
 * Pure TypeScript + Functional Architecture + Dynamic Exports
 * 
 * @author Ledjan Ahmati (100% Owner)
 * @version 8.0.0-WEB8
 * @contact dealsjona@gmail.com
 */

import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import type { Request, Response, NextFunction } from 'express';

// Web8 Types - Pure interfaces
export interface ThreatLog {
  readonly timestamp: string;
  readonly ip: string;
  readonly reason: string;
  readonly userAgent?: string;
  readonly path?: string;
  readonly payloadSize?: number;
  readonly severity: 'low' | 'medium' | 'high' | 'critical';
  readonly country?: string;
  readonly blocked: boolean;
}

export interface GuardianConfig {
  readonly maxRequestsPerMinute: number;
  readonly maxPayloadSize: number;
  readonly blockDuration: number;
  readonly logPath: string;
  readonly blocklistPath: string;
  readonly enableGeoBlocking: boolean;
  readonly blockedCountries: readonly string[];
  readonly suspiciousUserAgents: readonly RegExp[];
  readonly rateLimitWindowMs: number;
  readonly maxConnections: number;
}

export interface GuardianStats {
  readonly totalRequests: number;
  readonly blockedRequests: number;
  readonly uniqueIPs: number;
  readonly blockedIPs: number;
  readonly avgResponseTime: number;
  readonly topThreats: ReadonlyArray<{ readonly type: string; readonly count: number }>;
  readonly activeConnections: number;
  readonly systemHealth: 'healthy' | 'degraded' | 'critical';
}

export interface GuardianState {
  readonly config: GuardianConfig;
  readonly requestMap: Map<string, number>;
  readonly ipConnections: Map<string, number>;
  readonly blockedIPs: Set<string>;
  readonly threatLogs: ThreatLog[];
  stats: GuardianStats; // Mutable for updates
  readonly isActive: boolean;
}

// Web8 Internal State - Functional module state
let guardianState: GuardianState | null = null;

// Web8 Pure Functions
export function createDefaultConfig(overrides: Partial<GuardianConfig> = {}): GuardianConfig {
  return {
    maxRequestsPerMinute: 100,
    maxPayloadSize: 512000,
    blockDuration: 3600000,
    logPath: path.join(process.cwd(), 'logs', 'guardian.log'),
    blocklistPath: path.join(process.cwd(), 'data', 'blocklist.json'),
    enableGeoBlocking: true,
    blockedCountries: ['CN', 'RU', 'KP'] as const,
    suspiciousUserAgents: [
      /python|curl|wget|scanner|bot|crawler/i,
      /sqlmap|nikto|nmap|masscan/i,
      /burp|zap|metasploit/i
    ] as const,
    rateLimitWindowMs: 60000,
    maxConnections: 1000,
    ...overrides
  } as const;
}

export function createInitialStats(): GuardianStats {
  return {
    totalRequests: 0,
    blockedRequests: 0,
    uniqueIPs: 0,
    blockedIPs: 0,
    avgResponseTime: 0,
    topThreats: [],
    activeConnections: 0,
    systemHealth: 'healthy'
  } as const;
}

// Web8 Guardian Initialization
export function initializeGuardian(config: Partial<GuardianConfig> = {}): GuardianState {
  const fullConfig = createDefaultConfig(config);
  
  guardianState = {
    config: fullConfig,
    requestMap: new Map(),
    ipConnections: new Map(),
    blockedIPs: new Set(),
    threatLogs: [],
    stats: createInitialStats(),
    isActive: true
  };
  
  return guardianState;
}

// Web8 Core Security Functions
export function detectSQLInjection(input: string): boolean {
  const sqlPatterns = [
    /(\bUNION\b|\bSELECT\b|\bINSERT\b|\bDELETE\b|\bDROP\b|\bCREATE\b)/i,
    /(\bOR\s+\d+\s*=\s*\d+)/i,
    /('|(\\')|(\"|\\\")|(;)|(\%27)|(\%22)|(\-\-)|(\%3D))/,
    /(\b(exec|execute|sp_executesql)\b)/i
  ];
  
  return sqlPatterns.some(pattern => pattern.test(input));
}

export function detectXSS(input: string): boolean {
  const xssPatterns = [
    /<script[^>]*>.*?<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=\s*["'][^"']*["']/gi,
    /<iframe[^>]*>.*?<\/iframe>/gi,
    /<object[^>]*>.*?<\/object>/gi
  ];
  
  return xssPatterns.some(pattern => pattern.test(input));
}

export function detectPathTraversal(path: string): boolean {
  const traversalPatterns = [
    /\.\.\//g,
    /\.\.\\/g,
    /%2e%2e%2f/gi,
    /%2e%2e%5c/gi,
    /\.\.\%2f/gi,
    /\.\.\%5c/gi
  ];
  
  return traversalPatterns.some(pattern => pattern.test(path));
}

export function isSuspiciousUserAgent(userAgent: string, patterns: readonly RegExp[]): boolean {
  return patterns.some(pattern => pattern.test(userAgent));
}

export function extractClientIP(req: Request): string {
  return req.ip || 
         req.connection?.remoteAddress || 
         req.headers['x-forwarded-for'] as string ||
         req.headers['x-real-ip'] as string ||
         '127.0.0.1';
}

// Web8 Rate Limiting
export function checkRateLimit(ip: string, state: GuardianState): boolean {
  const now = Date.now();
  const requests = state.requestMap.get(ip) || 0;
  
  if (requests >= state.config.maxRequestsPerMinute) {
    return false;
  }
  
  state.requestMap.set(ip, requests + 1);
  
  // Cleanup old entries
  setTimeout(() => {
    state.requestMap.delete(ip);
  }, state.config.rateLimitWindowMs);
  
  return true;
}

// Web8 Threat Logging
export function logThreat(threat: Omit<ThreatLog, 'timestamp' | 'blocked'>, blocked: boolean, state: GuardianState): void {
  const log: ThreatLog = {
    ...threat,
    timestamp: new Date().toISOString(),
    blocked
  };
  
  state.threatLogs.push(log);
  
  // Keep only recent logs (last 1000)
  if (state.threatLogs.length > 1000) {
    state.threatLogs.splice(0, state.threatLogs.length - 1000);
  }
}

// Web8 Statistics Functions
export function getStats(): GuardianStats {
  if (!guardianState) {
    throw new Error('Guardian not initialized. Call initializeGuardian() first.');
  }
  
  return {
    ...guardianState.stats,
    uniqueIPs: guardianState.requestMap.size,
    blockedIPs: guardianState.blockedIPs.size,
  };
}

export function getThreatLogs(): readonly ThreatLog[] {
  if (!guardianState) return [];
  return [...guardianState.threatLogs];
}

export function getDashboard() {
  if (!guardianState) {
    throw new Error('Guardian not initialized');
  }
  
  return {
    status: guardianState.isActive ? 'active' : 'inactive',
    stats: getStats(),
    recentThreats: guardianState.threatLogs.slice(-10),
    blockedIPs: Array.from(guardianState.blockedIPs),
    config: guardianState.config
  } as const;
}

// Web8 IP Management
export function manualBlockIP(ip: string, reason: string): void {
  if (!guardianState) return;
  
  guardianState.blockedIPs.add(ip);
  logThreat({
    ip,
    reason: `Manual block: ${reason}`,
    severity: 'high'
  }, true, guardianState);
}

export function manualUnblockIP(ip: string): void {
  if (!guardianState) return;
  
  guardianState.blockedIPs.delete(ip);
}

export function setActive(active: boolean): void {
  if (!guardianState) return;
  
  guardianState = {
    ...guardianState,
    isActive: active
  };
}

// Web8 Main Middleware Function
export function createGuardianMiddleware() {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!guardianState || !guardianState.isActive) {
      return next();
    }
    
    const startTime = Date.now();
    const clientIP = extractClientIP(req);
    const userAgent = req.get('User-Agent') || '';
    
    // Update stats
    guardianState.stats = {
      ...guardianState.stats,
      totalRequests: guardianState.stats.totalRequests + 1
    };
    
    // Check if IP is manually blocked
    if (guardianState.blockedIPs.has(clientIP)) {
      logThreat({
        ip: clientIP,
        reason: 'IP Blacklisted',
        severity: 'high',
        userAgent,
        path: req.path
      }, true, guardianState);
      
      return res.status(403).json({
        error: 'Access Denied',
        reason: 'IP Blacklisted',
        timestamp: new Date().toISOString()
      });
    }
    
    // Rate limiting
    if (!checkRateLimit(clientIP, guardianState)) {
      logThreat({
        ip: clientIP,
        reason: 'Rate Limit Exceeded',
        severity: 'medium',
        userAgent,
        path: req.path
      }, true, guardianState);
      
      return res.status(403).json({
        error: 'Access Denied',
        reason: 'Rate Limit Exceeded',
        timestamp: new Date().toISOString()
      });
    }
    
    // User agent check
    if (isSuspiciousUserAgent(userAgent, guardianState.config.suspiciousUserAgents)) {
      logThreat({
        ip: clientIP,
        reason: 'Suspicious User Agent',
        severity: 'medium',
        userAgent,
        path: req.path
      }, true, guardianState);
      
      return res.status(403).json({
        error: 'Access Denied',
        reason: 'Suspicious User Agent',
        timestamp: new Date().toISOString()
      });
    }
    
    // Security scans
    const checkParams = (params: any): boolean => {
      if (!params) return false;
      
      const paramString = JSON.stringify(params);
      return detectSQLInjection(paramString) || 
             detectXSS(paramString) || 
             detectPathTraversal(paramString);
    };
    
    if (checkParams(req.query) || checkParams(req.body) || detectPathTraversal(req.path)) {
      logThreat({
        ip: clientIP,
        reason: 'Security Violation',
        severity: 'high',
        userAgent,
        path: req.path
      }, true, guardianState);
      
      return res.status(403).json({
        error: 'Access Denied',
        reason: 'Security Violation',
        timestamp: new Date().toISOString()
      });
    }
    
    // Add security headers
    res.setHeader('X-Guardian-Status', 'Active');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    
    // Calculate response time
    res.on('finish', () => {
      const responseTime = Date.now() - startTime;
      // Update average response time logic here if needed
    });
    
    next();
  };
}

// Web8 Compatibility Export
export function Guardian(config?: Partial<GuardianConfig>) {
  const state = initializeGuardian(config);
  
  return {
    middleware: () => createGuardianMiddleware(),
    getStats,
    getThreatLogs,
    getDashboard,
    manualBlockIP,
    manualUnblockIP,
    setActive
  };
}

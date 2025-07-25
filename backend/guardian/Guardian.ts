/**
 * EuroWeb Guardian - Advanced DDoS & Threat Protection System
 * Industrial-grade security middleware for Web8 platform
 * 
 * @author Ledjan Ahmati
 * @version 8.0.0
 * @contact dealsjona@gmail.com
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { Request, Response, NextFunction } from 'express';

export interface ThreatLog {
  timestamp: string;
  ip: string;
  reason: string;
  userAgent?: string;
  path?: string;
  payloadSize?: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  country?: string;
  blocked: boolean;
}

export interface GuardianConfig {
  maxRequestsPerMinute: number;
  maxPayloadSize: number;
  blockDuration: number;
  logPath: string;
  blocklistPath: string;
  enableGeoBlocking: boolean;
  blockedCountries: string[];
  suspiciousUserAgents: RegExp[];
  rateLimitWindowMs: number;
  maxConnections: number;
}

export interface GuardianStats {
  totalRequests: number;
  blockedRequests: number;
  uniqueIPs: number;
  blockedIPs: number;
  avgResponseTime: number;
  topThreats: Array<{ type: string; count: number }>;
  activeConnections: number;
  systemHealth: 'healthy' | 'degraded' | 'critical';
}

export class Guardian {
  private config: GuardianConfig;
  private requestMap = new Map<string, number>();
  private ipConnections = new Map<string, number>();
  private blockedIPs = new Set<string>();
  private threatLogs: ThreatLog[] = [];
  private stats: GuardianStats;
  private isActive = true;

  constructor(config: Partial<GuardianConfig> = {}) {
    this.config = {
      maxRequestsPerMinute: 100,
      maxPayloadSize: 512000, // 500KB
      blockDuration: 3600000, // 1 hour in ms
      logPath: path.join(process.cwd(), 'logs', 'guardian.log'),
      blocklistPath: path.join(process.cwd(), 'data', 'blocklist.json'),
      enableGeoBlocking: true,
      blockedCountries: ['CN', 'RU', 'KP'], // Example blocked countries
      suspiciousUserAgents: [
        /python|curl|wget|scanner|bot|crawler/i,
        /sqlmap|nikto|nmap|masscan/i,
        /burp|zap|metasploit/i
      ],
      rateLimitWindowMs: 60000, // 1 minute
      maxConnections: 1000,
      ...config
    };

    this.stats = this.initializeStats();
    this.initializeGuardian();
  }

  /**
   * Initialize Guardian system
   */
  private initializeGuardian(): void {
    this.ensureDirectories();
    this.loadBlocklist();
    this.startCleanupInterval();
    this.logActivity('Guardian initialized', 'system', 'low');
  }

  /**
   * Create necessary directories
   */
  private ensureDirectories(): void {
    const logsDir = path.dirname(this.config.logPath);
    const dataDir = path.dirname(this.config.blocklistPath);
    
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
    }
    
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
  }

  /**
   * Load blocked IPs from persistent storage
   */
  private loadBlocklist(): void {
    try {
      if (fs.existsSync(this.config.blocklistPath)) {
        const raw = fs.readFileSync(this.config.blocklistPath, 'utf-8');
        const list = JSON.parse(raw) as string[];
        list.forEach(ip => this.blockedIPs.add(ip));
        console.log(`🛡️ Guardian: Loaded ${list.length} blocked IPs`);
      }
    } catch (error) {
      console.error('Guardian: Failed to load blocklist:', error);
    }
  }

  /**
   * Save blocklist to persistent storage
   */
  private saveBlocklist(): void {
    try {
      const list = Array.from(this.blockedIPs);
      fs.writeFileSync(this.config.blocklistPath, JSON.stringify(list, null, 2));
    } catch (error) {
      console.error('Guardian: Failed to save blocklist:', error);
    }
  }

  /**
   * Initialize statistics
   */
  private initializeStats(): GuardianStats {
    return {
      totalRequests: 0,
      blockedRequests: 0,
      uniqueIPs: 0,
      blockedIPs: 0,
      avgResponseTime: 0,
      topThreats: [],
      activeConnections: 0,
      systemHealth: 'healthy'
    };
  }

  /**
   * Main middleware function
   */
  public middleware() {
    return (req: Request, res: Response, next: NextFunction) => {
      if (!this.isActive) {
        return next();
      }

      const startTime = Date.now();
      const ip = this.getClientIP(req);
      const userAgent = req.get('User-Agent') || '';
      const urlPath = req.path;

      // Update statistics
      this.stats.totalRequests++;
      this.updateConnectionCount(ip, 1);

      try {
        // Check if IP is blocked
        if (this.isIPBlocked(ip)) {
          this.logThreat(ip, 'IP Blacklisted', urlPath, userAgent, 'high', true);
          this.stats.blockedRequests++;
          return this.sendBlockedResponse(res, 'IP Blacklisted');
        }

        // Rate limiting check
        if (this.isRateLimited(ip)) {
          this.blockIP(ip, 'Rate Limit Exceeded');
          this.logThreat(ip, 'Rate Limit Exceeded', urlPath, userAgent, 'medium', true);
          this.stats.blockedRequests++;
          return this.sendBlockedResponse(res, 'Rate Limit Exceeded');
        }

        // User agent check
        if (this.isSuspiciousUserAgent(userAgent)) {
          this.blockIP(ip, `Suspicious User Agent: ${userAgent}`);
          this.logThreat(ip, 'Suspicious User Agent', urlPath, userAgent, 'medium', true);
          this.stats.blockedRequests++;
          return this.sendBlockedResponse(res, 'Suspicious User Agent');
        }

        // Payload size check
        req.on('data', (chunk: Buffer) => {
          const currentSize = (req as any).payloadSize || 0;
          (req as any).payloadSize = currentSize + chunk.length;

          if ((req as any).payloadSize > this.config.maxPayloadSize) {
            this.blockIP(ip, 'Large Payload Attack');
            this.logThreat(ip, 'Large Payload Attack', urlPath, userAgent, 'high', true);
            this.stats.blockedRequests++;
            req.destroy();
            return;
          }
        });

        // SQL Injection detection
        if (this.detectSQLInjection(req)) {
          this.blockIP(ip, 'SQL Injection Attempt');
          this.logThreat(ip, 'SQL Injection Attempt', urlPath, userAgent, 'critical', true);
          this.stats.blockedRequests++;
          return this.sendBlockedResponse(res, 'Security Violation');
        }

        // XSS detection
        if (this.detectXSS(req)) {
          this.blockIP(ip, 'XSS Attempt');
          this.logThreat(ip, 'XSS Attempt', urlPath, userAgent, 'high', true);
          this.stats.blockedRequests++;
          return this.sendBlockedResponse(res, 'Security Violation');
        }

        // Path traversal detection
        if (this.detectPathTraversal(urlPath)) {
          this.blockIP(ip, 'Path Traversal Attempt');
          this.logThreat(ip, 'Path Traversal Attempt', urlPath, userAgent, 'high', true);
          this.stats.blockedRequests++;
          return this.sendBlockedResponse(res, 'Security Violation');
        }

        // Log normal request
        this.logActivity(`Request from ${ip}`, urlPath, 'low');

        // Add security headers
        this.addSecurityHeaders(res);

        // Override end to measure response time
        const originalEnd = res.end;
        const guardian = this;
        res.end = function(this: Response, ...args: any[]) {
          const responseTime = Date.now() - startTime;
          guardian.updateResponseTime(responseTime);
          guardian.updateConnectionCount(ip, -1);
          return originalEnd.apply(this, args as any);
        };
        next();

      } catch (error) {
        console.error('Guardian middleware error:', error);
        next();
      }
    };
  }

  /**
   * Get client IP address
   */
  private getClientIP(req: Request): string {
    return (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
           req.headers['x-real-ip'] as string ||
           req.ip ||
           req.connection.remoteAddress ||
           'unknown';
  }

  /**
   * Check if IP is blocked
   */
  private isIPBlocked(ip: string): boolean {
    return this.blockedIPs.has(ip);
  }

  /**
   * Check rate limiting
   */
  private isRateLimited(ip: string): boolean {
    const now = Date.now();
    const windowStart = now - this.config.rateLimitWindowMs;
    const key = `${ip}-${Math.floor(now / this.config.rateLimitWindowMs)}`;
    
    const count = this.requestMap.get(key) || 0;
    this.requestMap.set(key, count + 1);

    // Clean old entries
    for (const [mapKey] of this.requestMap) {
      const keyTime = parseInt(mapKey.split('-')[1]) * this.config.rateLimitWindowMs;
      if (keyTime < windowStart) {
        this.requestMap.delete(mapKey);
      }
    }

    return count >= this.config.maxRequestsPerMinute;
  }

  /**
   * Check for suspicious user agents
   */
  private isSuspiciousUserAgent(userAgent: string): boolean {
    return this.config.suspiciousUserAgents.some(pattern => pattern.test(userAgent));
  }

  /**
   * Detect SQL injection attempts
   */
  private detectSQLInjection(req: Request): boolean {
    const sqlPatterns = [
      /(\b(union|select|insert|update|delete|drop|create|alter|exec|execute)\b)/i,
      /(--|\/\*|\*\/|;|'|"|\||&)/,
      /(\b(or|and)\b.*=.*)/i,
      /(1=1|1=0|true|false)/i
    ];

    const checkString = JSON.stringify(req.query) + JSON.stringify(req.body) + req.url;
    return sqlPatterns.some(pattern => pattern.test(checkString));
  }

  /**
   * Detect XSS attempts
   */
  private detectXSS(req: Request): boolean {
    const xssPatterns = [
      /<script[^>]*>.*?<\/script>/gi,
      /javascript:/gi,
      /vbscript:/gi,
      /onload|onerror|onclick|onmouseover/gi,
      /<iframe[^>]*>.*?<\/iframe>/gi
    ];

    const checkString = JSON.stringify(req.query) + JSON.stringify(req.body) + req.url;
    return xssPatterns.some(pattern => pattern.test(checkString));
  }

  /**
   * Detect path traversal attempts
   */
  private detectPathTraversal(path: string): boolean {
    const traversalPatterns = [
      /\.\.\//g,
      /\.\.\\/g,
      /%2e%2e%2f/gi,
      /%2e%2e\//gi,
      /\.\.%2f/gi
    ];

    return traversalPatterns.some(pattern => pattern.test(path));
  }

  /**
   * Block an IP address
   */
  private blockIP(ip: string, reason: string): void {
    if (!this.blockedIPs.has(ip)) {
      this.blockedIPs.add(ip);
      this.saveBlocklist();
      this.stats.blockedIPs++;
      console.log(`🚫 Guardian: Blocked IP ${ip} - ${reason}`);
      
      // Auto-unblock after configured duration
      setTimeout(() => {
        this.unblockIP(ip);
      }, this.config.blockDuration);
    }
  }

  /**
   * Unblock an IP address
   */
  private unblockIP(ip: string): void {
    if (this.blockedIPs.has(ip)) {
      this.blockedIPs.delete(ip);
      this.saveBlocklist();
      this.stats.blockedIPs--;
      console.log(`✅ Guardian: Unblocked IP ${ip}`);
    }
  }

  /**
   * Log threat activity
   */
  private logThreat(
    ip: string, 
    reason: string, 
    path?: string, 
    userAgent?: string, 
    severity: ThreatLog['severity'] = 'medium',
    blocked = false
  ): void {
    const threat: ThreatLog = {
      timestamp: new Date().toISOString(),
      ip,
      reason,
      path,
      userAgent,
      severity,
      blocked
    };

    this.threatLogs.push(threat);
    
    // Keep only last 1000 logs in memory
    if (this.threatLogs.length > 1000) {
      this.threatLogs = this.threatLogs.slice(-1000);
    }

    // Write to log file
    const logLine = `[${threat.timestamp}] ${severity.toUpperCase()} ${blocked ? 'BLOCKED' : 'DETECTED'} ${ip} - ${reason} ${path || ''} ${userAgent || ''}\n`;
    fs.appendFileSync(this.config.logPath, logLine);
  }

  /**
   * Log normal activity
   */
  private logActivity(message: string, context?: string, level: 'low' | 'medium' | 'high' = 'low'): void {
    if (level !== 'low') { // Only log medium and high level activities
      const logLine = `[${new Date().toISOString()}] ${level.toUpperCase()} ${message} ${context || ''}\n`;
      fs.appendFileSync(this.config.logPath, logLine);
    }
  }

  /**
   * Add security headers to response
   */
  private addSecurityHeaders(res: Response): void {
    res.setHeader('X-Guardian-Status', 'Active');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'");
  }

  /**
   * Send blocked response
   */
  private sendBlockedResponse(res: Response, reason: string): void {
    res.status(403).json({
      error: 'Access Denied',
      reason,
      guardian: 'EuroWeb Guardian v8.0.0',
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Update connection count
   */
  private updateConnectionCount(ip: string, delta: number): void {
    const current = this.ipConnections.get(ip) || 0;
    const newCount = Math.max(0, current + delta);
    
    if (newCount === 0) {
      this.ipConnections.delete(ip);
    } else {
      this.ipConnections.set(ip, newCount);
    }

    this.stats.activeConnections = Array.from(this.ipConnections.values()).reduce((sum, count) => sum + count, 0);
  }

  /**
   * Update response time statistics
   */
  private updateResponseTime(responseTime: number): void {
    // Simple moving average
    this.stats.avgResponseTime = (this.stats.avgResponseTime * 0.9) + (responseTime * 0.1);
  }

  /**
   * Start cleanup interval
   */
  private startCleanupInterval(): void {
    setInterval(() => {
      this.cleanupOldData();
      this.updateSystemHealth();
    }, 300000); // Every 5 minutes
  }

  /**
   * Cleanup old data
   */
  private cleanupOldData(): void {
    const now = Date.now();
    const cutoff = now - this.config.rateLimitWindowMs * 2;

    // Clean request map
    for (const [key] of this.requestMap) {
      const keyTime = parseInt(key.split('-')[1]) * this.config.rateLimitWindowMs;
      if (keyTime < cutoff) {
        this.requestMap.delete(key);
      }
    }

    // Update unique IPs count
    this.stats.uniqueIPs = this.ipConnections.size;
  }

  /**
   * Update system health
   */
  private updateSystemHealth(): void {
    const errorRate = this.stats.totalRequests > 0 ? this.stats.blockedRequests / this.stats.totalRequests : 0;
    
    if (errorRate > 0.5 || this.stats.avgResponseTime > 5000) {
      this.stats.systemHealth = 'critical';
    } else if (errorRate > 0.2 || this.stats.avgResponseTime > 2000) {
      this.stats.systemHealth = 'degraded';
    } else {
      this.stats.systemHealth = 'healthy';
    }
  }

  /**
   * Get Guardian statistics
   */
  public getStats(): GuardianStats {
    return { ...this.stats };
  }

  /**
   * Get recent threat logs
   */
  public getThreatLogs(limit = 100): ThreatLog[] {
    return this.threatLogs.slice(-limit);
  }

  /**
   * Get dashboard data
   */
  public getDashboard() {
    return {
      status: this.isActive ? 'active' : 'inactive',
      stats: this.getStats(),
      recentThreats: this.getThreatLogs(10),
      blockedIPs: Array.from(this.blockedIPs).slice(0, 20),
      config: {
        maxRequestsPerMinute: this.config.maxRequestsPerMinute,
        maxPayloadSize: this.config.maxPayloadSize,
        blockDuration: this.config.blockDuration
      }
    };
  }

  /**
   * Activate/Deactivate Guardian
   */
  public setActive(active: boolean): void {
    this.isActive = active;
    this.logActivity(`Guardian ${active ? 'activated' : 'deactivated'}`, 'system', 'medium');
  }

  /**
   * Manual IP management
   */
  public manualBlockIP(ip: string, reason: string): void {
    this.blockIP(ip, `Manual block: ${reason}`);
  }

  public manualUnblockIP(ip: string): void {
    this.unblockIP(ip);
    this.logActivity(`Manual unblock: ${ip}`, 'system', 'medium');
  }
}

// Export singleton instance
export const guardian = new Guardian();
export default guardian;

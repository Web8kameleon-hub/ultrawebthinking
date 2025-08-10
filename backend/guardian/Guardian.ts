/**
 * Guardian Security System
 * Advanced threat detection and real-time monitoring
 * 
 * @version 8.0.0 Ultra
 * @author Ledjan Ahmati (100% Owner)
 * @contact dealsjona@gmail.com
 */

import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

interface BlockedIPData {
  reason: string;
  blockedAt: number;
  attempts: number;
  userAgent?: string;
  country?: string;
  threatLevel: 'low' | 'medium' | 'high' | 'critical';
}

export interface SecurityEvent {
  id: string;
  timestamp: number;
  type: 'block' | 'unblock' | 'attack_attempt' | 'suspicious_activity' | 'login_failure' | 'rate_limit';
  ip: string;
  details: string;
  severity: 'info' | 'warning' | 'danger' | 'critical';
  userAgent?: string;
  endpoint?: string;
}

export interface GuardianSettings {
  maxAttempts: number;
  timeWindow: number; // milliseconds
  blockDuration: number; // milliseconds
  autoUnblock: boolean;
  threatDetection: boolean;
  geoBlocking: boolean;
  logRetention: number; // days
}

export class Guardian {
  private isActive: boolean = true;
  private blockedIPs: Map<string, BlockedIPData> = new Map();
  private recentActivity: SecurityEvent[] = [];
  private ipAttempts: Map<string, number[]> = new Map();
  
  // 🛡️ Advanced Security Settings
  private settings: GuardianSettings = {
    maxAttempts: 5,
    timeWindow: 15 * 60 * 1000, // 15 minutes
    blockDuration: 60 * 60 * 1000, // 1 hour
    autoUnblock: true,
    threatDetection: true,
    geoBlocking: false,
    logRetention: 30 // 30 days
  };

  // 🚨 Threat patterns for detection
  private threatPatterns = [
    /\/admin/i,
    /\/wp-admin/i,
    /\.php$/i,
    /\/api\/.*\/.*\/.*\/.*\//, // Deep API probing
    /sql|union|select|drop|delete|insert|update/i,
    /<script|javascript:|vbscript:/i,
    /\.\.\/|\.\.\\/
  ];

  // 📍 Geo-blocking (high-risk countries)
  private blockedCountries = ['CN', 'RU', 'KP', 'IR'];

  constructor() {
    this.startCleanupTimer();
    this.loadPersistedData();
  }

  // 🔍 THREAT DETECTION & ANALYSIS
  public analyzeRequest(ip: string, userAgent: string, url: string, headers: Record<string, string>): boolean {
    if (!this.isActive) return false;

    const threatLevel = this.calculateThreatLevel(ip, userAgent, url, headers);
    
    if (threatLevel >= 3) {
      this.blockIP(ip, `High threat level detected: ${threatLevel}/5`, userAgent);
      return true;
    }

    return this.checkRateLimit(ip, userAgent, url);
  }

  private calculateThreatLevel(ip: string, userAgent: string, url: string, headers: Record<string, string>): number {
    let threatLevel = 0;

    // Check for malicious patterns in URL
    if (this.threatPatterns.some(pattern => pattern.test(url))) {
      threatLevel += 2;
    }

    // Suspicious user agents
    if (!userAgent || userAgent.length < 10 || /bot|crawler|spider|scan/i.test(userAgent)) {
      threatLevel += 1;
    }

    // Missing essential headers
    if (!headers['accept'] || !headers['accept-language']) {
      threatLevel += 1;
    }

    // Rate limiting check
    if (this.isRateLimited(ip)) {
      threatLevel += 1;
    }

    return Math.min(threatLevel, 5);
  }

  // ⚡ RATE LIMITING
  private checkRateLimit(ip: string, userAgent: string, url: string): boolean {
    const now = Date.now();
    const attempts = this.ipAttempts.get(ip) || [];
    
    // Clean old attempts
    const recentAttempts = attempts.filter(time => now - time < this.settings.timeWindow);
    
    if (recentAttempts.length >= this.settings.maxAttempts) {
      this.blockIP(ip, `Rate limit exceeded: ${recentAttempts.length} requests in ${this.settings.timeWindow / 1000}s`, userAgent);
      return true;
    }

    // Track this attempt
    recentAttempts.push(now);
    this.ipAttempts.set(ip, recentAttempts);
    
    return false;
  }

  private isRateLimited(ip: string): boolean {
    const attempts = this.ipAttempts.get(ip) || [];
    const now = Date.now();
    const recentAttempts = attempts.filter(time => now - time < this.settings.timeWindow);
    return recentAttempts.length >= this.settings.maxAttempts;
  }

  // 🚫 IP BLOCKING SYSTEM
  public blockIP(ip: string, reason: string, userAgent?: string): void {
    if (!this.isValidIP(ip)) return;

    const threatLevel = this.assessThreatLevel(reason);
    
    const blockedData: BlockedIPData = {
      reason,
      blockedAt: Date.now(),
      attempts: (this.blockedIPs.get(ip)?.attempts || 0) + 1,
      threatLevel
    };
    
    if (userAgent) {
      blockedData.userAgent = userAgent;
    }
    
    this.blockedIPs.set(ip, blockedData);

    const securityEvent: SecurityEvent = {
      id: this.generateEventId(),
      timestamp: Date.now(),
      type: 'block',
      ip,
      details: reason,
      severity: this.getSeverityFromThreatLevel(threatLevel),
    };
    
    if (userAgent) {
      securityEvent.userAgent = userAgent;
    }
    
    this.addSecurityEvent(securityEvent);

    console.log(`🛡️ Guardian: Blocked IP ${ip} - ${reason}`);
  }

  public unblockIP(ip: string): boolean {
    if (this.blockedIPs.has(ip)) {
      this.blockedIPs.delete(ip);
      this.ipAttempts.delete(ip);
      
      this.addSecurityEvent({
        id: this.generateEventId(),
        timestamp: Date.now(),
        type: 'unblock',
        ip,
        details: 'IP manually unblocked',
        severity: 'info'
      });

      console.log(`🛡️ Guardian: Unblocked IP ${ip}`);
      return true;
    }
    return false;
  }

  public isBlocked(ip: string): boolean {
    if (!this.isActive) return false;
    
    const blockedData = this.blockedIPs.get(ip);
    if (!blockedData) return false;

    // Auto-unblock if duration has passed
    if (this.settings.autoUnblock && 
        Date.now() - blockedData.blockedAt > this.settings.blockDuration) {
      this.unblockIP(ip);
      return false;
    }

    return true;
  }

  // 📊 DASHBOARD DATA
  public getDashboard() {
    const now = Date.now();
    const last24h = now - (24 * 60 * 60 * 1000);
    const last1h = now - (60 * 60 * 1000);

    return {
      status: this.isActive ? 'active' : 'inactive',
      timestamp: now,
      
      // 📈 Statistics
      stats: {
        totalBlocked: this.blockedIPs.size,
        blockedLast24h: this.countBlockedSince(last24h),
        blockedLastHour: this.countBlockedSince(last1h),
        activeThreats: this.getActiveThreats(),
        topThreatCountries: this.getTopThreatCountries(),
        riskLevel: this.calculateOverallRiskLevel()
      },

      // 🚫 Blocked IPs
      blockedIPs: Array.from(this.blockedIPs.entries())
        .map(([ip, data]) => ({
          ip,
          reason: data.reason,
          blockedAt: data.blockedAt,
          attempts: data.attempts,
          threatLevel: data.threatLevel,
          timeRemaining: this.settings.autoUnblock 
            ? Math.max(0, this.settings.blockDuration - (now - data.blockedAt))
            : null,
          userAgent: data.userAgent
        }))
        .sort((a, b) => b.blockedAt - a.blockedAt),

      // 📋 Recent Activity
      recentActivity: this.getRecentActivity(50),

      // ⚙️ Settings
      settings: this.settings,

      // 🔧 System Health
      systemHealth: {
        memoryUsage: this.getMemoryUsage(),
        uptime: this.getUptime(),
        lastCleanup: this.lastCleanup || 0,
        eventsRetained: this.recentActivity.length
      }
    };
  }

  private getRecentActivity(limit: number = 20): SecurityEvent[] {
    return this.recentActivity
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, limit);
  }

  // 🎛️ CONFIGURATION METHODS
  public setActive(active: boolean): void {
    this.isActive = active;
    this.addSecurityEvent({
      id: this.generateEventId(),
      timestamp: Date.now(),
      type: active ? 'block' : 'unblock',
      ip: 'system',
      details: `Guardian ${active ? 'activated' : 'deactivated'}`,
      severity: 'info'
    });
  }

  public updateSettings(newSettings: Partial<GuardianSettings>): void {
    this.settings = { ...this.settings, ...newSettings };
    this.addSecurityEvent({
      id: this.generateEventId(),
      timestamp: Date.now(),
      type: 'suspicious_activity',
      ip: 'system',
      details: 'Guardian settings updated',
      severity: 'info'
    });
  }

  // 🧹 MAINTENANCE METHODS
  private lastCleanup: number = 0;

  private startCleanupTimer(): void {
    setInterval(() => {
      this.cleanup();
    }, 60 * 60 * 1000); // Run every hour
  }

  private cleanup(): void {
    const now = Date.now();
    this.lastCleanup = now;

    // Auto-unblock expired IPs
    if (this.settings.autoUnblock) {
      const toUnblock: string[] = [];
      this.blockedIPs.forEach((data, ip) => {
        if (now - data.blockedAt > this.settings.blockDuration) {
          toUnblock.push(ip);
        }
      });
      toUnblock.forEach(ip => this.unblockIP(ip));
    }

    // Clean old events
    const retentionTime = this.settings.logRetention * 24 * 60 * 60 * 1000;
    this.recentActivity = this.recentActivity.filter(
      event => now - event.timestamp < retentionTime
    );

    // Clean old rate limit data
    this.ipAttempts.forEach((attempts, ip) => {
      const recentAttempts = attempts.filter(time => now - time < this.settings.timeWindow);
      if (recentAttempts.length === 0) {
        this.ipAttempts.delete(ip);
      } else {
        this.ipAttempts.set(ip, recentAttempts);
      }
    });

    console.log(`🧹 Guardian: Cleanup completed. Events: ${this.recentActivity.length}, Blocked IPs: ${this.blockedIPs.size}`);
  }

  // 🔧 UTILITY METHODS
  private addSecurityEvent(event: SecurityEvent): void {
    this.recentActivity.push(event);
    
    // Keep only recent events in memory (last 1000)
    if (this.recentActivity.length > 1000) {
      this.recentActivity = this.recentActivity.slice(-1000);
    }
  }

  private generateEventId(): string {
    return `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private isValidIP(ip: string): boolean {
    const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
    const ipv6Regex = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
    return ipv4Regex.test(ip) || ipv6Regex.test(ip);
  }

  private assessThreatLevel(reason: string): 'low' | 'medium' | 'high' | 'critical' {
    if (reason.includes('SQL') || reason.includes('XSS') || reason.includes('critical')) {
      return 'critical';
    }
    if (reason.includes('High threat') || reason.includes('attack')) {
      return 'high';
    }
    if (reason.includes('Rate limit') || reason.includes('suspicious')) {
      return 'medium';
    }
    return 'low';
  }

  private getSeverityFromThreatLevel(threatLevel: 'low' | 'medium' | 'high' | 'critical'): 'info' | 'warning' | 'danger' | 'critical' {
    const mapping = {
      'low': 'info' as const,
      'medium': 'warning' as const,
      'high': 'danger' as const,
      'critical': 'critical' as const
    };
    return mapping[threatLevel];
  }

  private countBlockedSince(timestamp: number): number {
    return Array.from(this.blockedIPs.values())
      .filter(data => data.blockedAt >= timestamp).length;
  }

  private getActiveThreats(): number {
    return Array.from(this.blockedIPs.values())
      .filter(data => data.threatLevel === 'high' || data.threatLevel === 'critical').length;
  }

  private getTopThreatCountries(): string[] {
    // Simplified - in reality you'd use GeoIP lookup
    return ['Unknown'];
  }

  private calculateOverallRiskLevel(): 'low' | 'medium' | 'high' | 'critical' {
    const activeThreats = this.getActiveThreats();
    const totalBlocked = this.blockedIPs.size;
    
    if (activeThreats > 10 || totalBlocked > 100) return 'critical';
    if (activeThreats > 5 || totalBlocked > 50) return 'high';
    if (activeThreats > 2 || totalBlocked > 20) return 'medium';
    return 'low';
  }

  private getMemoryUsage(): number {
    // Simplified memory usage calculation
    return (this.blockedIPs.size + this.recentActivity.length) * 0.1; // KB estimate
  }

  private getUptime(): number {
    return Date.now() - (this.startTime || Date.now());
  }

  private startTime: number = Date.now();

  private loadPersistedData(): void {
    // In a real implementation, load from database or file
    console.log('🛡️ Guardian: Initialized security system');
  }

  // 📤 EXPORT/IMPORT METHODS
  exportData() {
    return {
      blockedIPs: Array.from(this.blockedIPs.entries()),
      recentActivity: this.recentActivity,
      settings: this.settings,
      timestamp: Date.now()
    };
  }

  importData(data: any): void {
    if (data.blockedIPs) {
      this.blockedIPs = new Map(data.blockedIPs);
    }
    if (data.recentActivity) {
      this.recentActivity = data.recentActivity;
    }
    if (data.settings) {
      this.settings = { ...this.settings, ...data.settings };
    }
  }
}
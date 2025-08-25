/**
 * EuroWeb Ultra - Industrial DDoS Protection Shield
 * Military-grade protection against distributed attacks
 * 
 * @author Ledjan Ahmati
 * @version Ultra 2.0.0 DDoS Shield
 * @license MIT
 */

import { RateLimiter } from 'limiter'
import { LRUCache } from 'lru-cache'

export interface DDoSConfig {
    // Rate limiting
    rateLimit: {
        windowMs: number
        maxRequests: number
        skipSuccessfulRequests: boolean
    }

    // IP reputation
    ipReputation: {
        blacklistTTL: number
        suspiciousThreshold: number
        autoBlacklistEnabled: boolean
    }

    // Traffic analysis
    trafficAnalysis: {
        enableBehaviorAnalysis: boolean
        anomalyThreshold: number
        sampleRate: number
    }

    // Response strategies
    response: {
        enableTarpit: boolean
        tarpitDelay: number
        enableCaptcha: boolean
        enableGeoBlocking: boolean
        allowedCountries: string[]
    }
}

export interface AttackMetrics {
    requestsPerSecond: number
    uniqueIPs: number
    topUserAgents: Map<string, number>
    topPaths: Map<string, number>
    geoDistribution: Map<string, number>
    attackVectors: string[]
    severity: 'low' | 'medium' | 'high' | 'critical'
}

export interface IPReputation {
    ip: string
    score: number // 0-100 (0 = malicious, 100 = trusted)
    lastSeen: number
    requestCount: number
    violations: string[]
    country?: string
    asn?: string
    isTor?: boolean
    isVPN?: boolean
}

export class DDoSShield {
    private config: DDoSConfig
    private ipCache: LRUCache<string, IPReputation>
    private rateLimiters: Map<string, RateLimiter>
    private blacklist: Set<string>
    private whitelist: Set<string>
    private metrics: AttackMetrics

    constructor(config: DDoSConfig) {
        this.config = config
        this.ipCache = new LRUCache<string, IPReputation>({ max: 100000, ttl: 3600000 })
        this.rateLimiters = new Map()
        this.blacklist = new Set()
        this.whitelist = new Set()
        this.metrics = this.initMetrics()

        // Start background tasks
        this.startMetricsCollection()
        this.startCleanupTasks()
    }

    /**
     * Main request validation pipeline
     */
    async validateRequest(request: {
        ip: string
        userAgent: string
        path: string
        method: string
        headers: Record<string, string>
        timestamp: number
    }): Promise<{
        allowed: boolean
        reason?: string
        action?: 'block' | 'tarpit' | 'captcha' | 'allow'
        delay?: number
    }> {
        const { ip, userAgent, path, method, headers } = request

        // 1. Check whitelist first
        if (this.whitelist.has(ip)) {
            return { allowed: true, action: 'allow' }
        }

        // 2. Check blacklist
        if (this.blacklist.has(ip)) {
            return {
                allowed: false,
                reason: 'IP blacklisted',
                action: 'block'
            }
        }

        // 3. Rate limiting check
        const rateLimitResult = await this.checkRateLimit(ip)
        if (!rateLimitResult.allowed) {
            return rateLimitResult
        }

        // 4. IP reputation check
        const reputationResult = await this.checkIPReputation(ip)
        if (!reputationResult.allowed) {
            return reputationResult
        }

        // 5. Behavior analysis
        const behaviorResult = await this.analyzeBehavior(request)
        if (!behaviorResult.allowed) {
            return behaviorResult
        }

        // 6. Geo-blocking check
        const geoResult = await this.checkGeoBlocking(ip)
        if (!geoResult.allowed) {
            return geoResult
        }

        // 7. Content analysis (malicious patterns)
        const contentResult = await this.analyzeContent(request)
        if (!contentResult.allowed) {
            return contentResult
        }

        // Update metrics and reputation
        await this.updateIPReputation(ip, 'legitimate_request')
        this.updateMetrics(request)

        return { allowed: true, action: 'allow' }
    }

    /**
     * Rate limiting with sliding window
     */
    private async checkRateLimit(ip: string): Promise<{
        allowed: boolean
        reason?: string
        action?: 'block' | 'tarpit'
        delay?: number
    }> {
        const key = `rate_limit:${ip}`
        let limiter = this.rateLimiters.get(key)

        if (!limiter) {
            limiter = new RateLimiter({
                tokensPerInterval: this.config.rateLimit.maxRequests,
                interval: this.config.rateLimit.windowMs
            })
            this.rateLimiters.set(key, limiter)
        }

        const remaining = await limiter.removeTokens(1)

        if (remaining < 0) {
            // Rate limit exceeded
            await this.updateIPReputation(ip, 'rate_limit_exceeded')

            if (this.config.response.enableTarpit) {
                return {
                    allowed: false,
                    reason: 'Rate limit exceeded',
                    action: 'tarpit',
                    delay: this.config.response.tarpitDelay
                }
            }

            return {
                allowed: false,
                reason: 'Rate limit exceeded',
                action: 'block'
            }
        }

        return { allowed: true }
    }

    /**
     * IP reputation scoring and checking
     */
    private async checkIPReputation(ip: string): Promise<{
        allowed: boolean
        reason?: string
        action?: 'block' | 'captcha'
    }> {
        let reputation = this.ipCache.get(ip)

        if (!reputation) {
            reputation = await this.fetchIPReputation(ip)
            this.ipCache.set(ip, reputation)
        }

        // Block highly malicious IPs
        if (reputation.score < 20) {
            return {
                allowed: false,
                reason: 'Low IP reputation score',
                action: 'block'
            }
        }

        // Require CAPTCHA for suspicious IPs
        if (reputation.score < 50 && this.config.response.enableCaptcha) {
            return {
                allowed: false,
                reason: 'Suspicious IP reputation',
                action: 'captcha'
            }
        }

        return { allowed: true }
    }

    /**
     * Behavioral pattern analysis
     */
    private async analyzeBehavior(request: {
        ip: string
        userAgent: string
        path: string
        method: string
        headers: Record<string, string>
    }): Promise<{
        allowed: boolean
        reason?: string
        action?: 'block'
    }> {
        const suspiciousPatterns = [
            // Bot signatures
            /bot|crawler|spider|scraper/i.test(request.userAgent),

            // Suspicious paths
            /\.(php|asp|jsp|cgi)$/i.test(request.path),
            /wp-admin|admin|login|phpmyadmin/i.test(request.path),

            // SQL injection patterns
            /'|"|;|union|select|insert|update|delete|drop/i.test(request.path),

            // XSS patterns
            /<script|javascript:|onload=|onerror=/i.test(request.path),

            // Missing common headers
            !request.headers['accept'] ?? !request.headers['user-agent']
        ]

        const suspiciousCount = suspiciousPatterns.filter(Boolean).length

        if (suspiciousCount >= 3) {
            await this.updateIPReputation(request.ip, 'suspicious_behavior')
            return {
                allowed: false,
                reason: 'Suspicious behavioral patterns detected',
                action: 'block'
            }
        }

        return { allowed: true }
    }

    /**
     * Geographic blocking
     */
    private async checkGeoBlocking(ip: string): Promise<{
        allowed: boolean
        reason?: string
        action?: 'block'
    }> {
        if (!this.config.response.enableGeoBlocking) {
            return { allowed: true }
        }

        const country = await this.getCountryForIP(ip)

        if (country && !this.config.response.allowedCountries.includes(country)) {
            return {
                allowed: false,
                reason: `Requests from ${country} are not allowed`,
                action: 'block'
            }
        }

        return { allowed: true }
    }

    /**
     * Content and payload analysis
     */
    private async analyzeContent(request: {
        path: string
        method: string
        headers: Record<string, string>
    }): Promise<{
        allowed: boolean
        reason?: string
        action?: 'block'
    }> {
        // Check for common attack patterns
        const maliciousPatterns = [
            // Directory traversal
            /\.\.|\/\.\./g.test(request.path),

            // Command injection
            /\??&&|;|`|\$\(/g.test(request.path),

            // Large request (potential DoS)
            parseInt(request.headers['content-length'] ?? '0') > 10 * 1024 * 1024, // 10MB

            // Suspicious file extensions
            /\.(exe|bat|sh|ps1|dll)$/i.test(request.path)
        ]

        if (maliciousPatterns.some(Boolean)) {
            return {
                allowed: false,
                reason: 'Malicious content detected',
                action: 'block'
            }
        }

        return { allowed: true }
    }

    /**
     * Update IP reputation based on behavior
     */
    private async updateIPReputation(ip: string, event: string): Promise<void> {
        let reputation = this.ipCache.get(ip)

        if (!reputation) {
            reputation = await this.fetchIPReputation(ip)
        }

        reputation.lastSeen = Date.now()
        reputation.requestCount++

        // Adjust score based on event
        switch (event) {
            case 'rate_limit_exceeded':
                reputation.score = Math.max(0, reputation.score - 10)
                reputation.violations.push(event)
                break
            case 'suspicious_behavior':
                reputation.score = Math.max(0, reputation.score - 20)
                reputation.violations.push(event)
                break
            case 'legitimate_request':
                reputation.score = Math.min(100, reputation.score + 1)
                break
        }

        // Auto-blacklist if score too low
        if (reputation.score < 10 && this.config.ipReputation.autoBlacklistEnabled) {
            this.blacklist.add(ip)
        }

        this.ipCache.set(ip, reputation)
    }

    /**
     * Fetch IP reputation from external sources
     */
    private async fetchIPReputation(ip: string): Promise<IPReputation> {
        // In production, integrate with reputation services like:
        // - VirusTotal
        // - AbuseIPDB
        // - MaxMind
        // - Shodan

        return {
            ip,
            score: 75, // Default neutral score
            lastSeen: Date.now(),
            requestCount: 0,
            violations: [],
            country: await this.getCountryForIP(ip),
            isTor: await this.checkTorExit(ip),
            isVPN: await this.checkVPN(ip)
        }
    }

    /**
     * Get country for IP (mock implementation)
     */
    private async getCountryForIP(ip: string): Promise<string | undefined> {
        // In production, use GeoIP database like MaxMind
        return 'DE' // Default to Germany
    }

    /**
     * Check if IP is Tor exit node
     */
    private async checkTorExit(ip: string): Promise<boolean> {
        // In production, check against Tor exit node list
        return false
    }

    /**
     * Check if IP is VPN/proxy
     */
    private async checkVPN(ip: string): Promise<boolean> {
        // In production, use VPN detection service
        return false
    }

    /**
     * Initialize metrics collection
     */
    private initMetrics(): AttackMetrics {
        return {
            requestsPerSecond: 0,
            uniqueIPs: 0,
            topUserAgents: new Map(),
            topPaths: new Map(),
            geoDistribution: new Map(),
            attackVectors: [],
            severity: 'low'
        }
    }

    /**
     * Update real-time metrics
     */
    private updateMetrics(request: any): void {
        // Update user agents
        const count = this.metrics.topUserAgents.get(request.userAgent) ?? 0
        this.metrics.topUserAgents.set(request.userAgent, count + 1)

        // Update paths
        const pathCount = this.metrics.topPaths.get(request.path) ?? 0
        this.metrics.topPaths.set(request.path, pathCount + 1)
    }

    /**
     * Start background metrics collection
     */
    private startMetricsCollection(): void {
        setInterval(() => {
            // Calculate current RPS, severity, etc.
            this.calculateSeverity()
        }, 1000)
    }

    /**
     * Calculate attack severity
     */
    private calculateSeverity(): void {
        const rps = this.metrics.requestsPerSecond
        const blacklistedCount = this.blacklist.size

        if (rps > 10000 ?? blacklistedCount > 1000) {
            this.metrics.severity = 'critical'
        } else if (rps > 5000 ?? blacklistedCount > 500) {
            this.metrics.severity = 'high'
        } else if (rps > 1000 ?? blacklistedCount > 100) {
            this.metrics.severity = 'medium'
        } else {
            this.metrics.severity = 'low'
        }
    }

    /**
     * Start cleanup tasks
     */
    private startCleanupTasks(): void {
        // Clean up old rate limiters
        setInterval(() => {
            // Remove inactive rate limiters to prevent memory leaks
            for (const [key, limiter] of this.rateLimiters.entries()) {
                // Remove limiters that haven't been used recently
                this.rateLimiters.delete(key)
            }
        }, 300000) // Every 5 minutes
    }

    /**
     * Get current shield status
     */
    getShieldStatus(): {
        enabled: boolean
        metrics: AttackMetrics
        blacklistedIPs: number
        whitelistedIPs: number
        activeRateLimiters: number
    } {
        return {
            enabled: true,
            metrics: this.metrics,
            blacklistedIPs: this.blacklist.size,
            whitelistedIPs: this.whitelist.size,
            activeRateLimiters: this.rateLimiters.size
        }
    }

    /**
     * Manually add IP to whitelist
     */
    addToWhitelist(ip: string): void {
        this.whitelist.add(ip)
        this.blacklist.delete(ip) // Remove from blacklist if present
    }

    /**
     * Manually add IP to blacklist
     */
    addToBlacklist(ip: string): void {
        this.blacklist.add(ip)
        this.whitelist.delete(ip) // Remove from whitelist if present
    }
}

// Default production configuration
export const DEFAULT_DDOS_CONFIG: DDoSConfig = {
    rateLimit: {
        windowMs: 60000, // 1 minute
        maxRequests: 100,
        skipSuccessfulRequests: false
    },
    ipReputation: {
        blacklistTTL: 3600000, // 1 hour
        suspiciousThreshold: 50,
        autoBlacklistEnabled: true
    },
    trafficAnalysis: {
        enableBehaviorAnalysis: true,
        anomalyThreshold: 3,
        sampleRate: 0.1
    },
    response: {
        enableTarpit: true,
        tarpitDelay: 5000, // 5 seconds
        enableCaptcha: true,
        enableGeoBlocking: false,
        allowedCountries: ['DE', 'FR', 'IT', 'ES', 'NL', 'BE', 'AT', 'CH']
    }
}

// Export main shield instance
export const ddosShield = new DDoSShield(DEFAULT_DDOS_CONFIG)

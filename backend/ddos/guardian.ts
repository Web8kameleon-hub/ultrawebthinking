/**
 * Guardian Engine – Web8 DDoS Defense & Network Integrity Monitor
 * Location: backend/ddos/guardian.ts
 * 
 * @author Ledjan Ahmati (100% Owner)
 * @contact dealsjona@gmail.com
 * @version 8.0.0 Industrial
 * @license MIT
 */

import * as os from 'os'
import { createHash } from 'crypto'
import { writeFileSync, existsSync, mkdirSync } from 'fs'
import * as path from 'path'

interface GuardianLog {
  timestamp: number
  ip: string
  reason: string
  level: 'info' | 'warn' | 'critical'
  userAgent?: string
  requestPath?: string
  payloadSize?: number
  requestRate?: number
}

interface GuardianStats {
  totalRequests: number
  blockedIPs: number
  alertsGenerated: number
  criticalThreats: number
  uptime: number
  startTime: number
}

interface GuardianConfig {
  maxPayloadSize: number
  maxRequestRate: number
  blockDuration: number
  logRetentionDays: number
  enableAutoBlock: boolean
}

const guardianLogs: GuardianLog[] = []
const blockedIPs = new Set<string>()
const requestCounts = new Map<string, number[]>()

const defaultConfig: GuardianConfig = {
  maxPayloadSize: 512000, // 512KB
  maxRequestRate: 100, // requests per minute
  blockDuration: 3600000, // 1 hour in ms
  logRetentionDays: 30,
  enableAutoBlock: true
}

let guardianStats: GuardianStats = {
  totalRequests: 0,
  blockedIPs: 0,
  alertsGenerated: 0,
  criticalThreats: 0,
  uptime: 0,
  startTime: Date.now()
}

// Ensure blocked directory exists
const blockedDir = path.join(process.cwd(), 'blocked')
if (!existsSync(blockedDir)) {
  mkdirSync(blockedDir, { recursive: true })
}

/**
 * Monitor incoming request for suspicious activity
 */
export function monitorRequest(
  ip: string, 
  payloadSize: number, 
  requestRate: number,
  userAgent?: string,
  requestPath?: string
): boolean {
  const now = Date.now()
  guardianStats.totalRequests++
  guardianStats.uptime = now - guardianStats.startTime

  // Check if IP is already blocked
  if (blockedIPs.has(ip)) {
    addLog(ip, 'Request from blocked IP', 'critical', {
      userAgent,
      requestPath,
      payloadSize,
      requestRate
    })
    return false
  }

  let reason = ''
  let level: GuardianLog['level'] = 'info'
  let shouldBlock = false

  // Check payload size
  if (payloadSize > defaultConfig.maxPayloadSize) {
    reason = `Large payload size detected: ${payloadSize} bytes`
    level = 'critical'
    shouldBlock = true
  }

  // Check request rate
  const currentRate = calculateRequestRate(ip)
  if (currentRate > defaultConfig.maxRequestRate) {
    reason = `High request rate detected: ${currentRate} req/min`
    level = 'critical'
    shouldBlock = true
  }

  // Check suspicious user agent
  if (userAgent && isSuspiciousUserAgent(userAgent)) {
    reason = `Suspicious user agent: ${userAgent}`
    level = 'warn'
    shouldBlock = defaultConfig.enableAutoBlock
  }

  // Check suspicious request path
  if (requestPath && isSuspiciousPath(requestPath)) {
    reason = `Suspicious request path: ${requestPath}`
    level = 'warn'
    shouldBlock = defaultConfig.enableAutoBlock
  }

  // Block IP if necessary
  if (shouldBlock) {
    blockIP(ip, reason)
    addLog(ip, reason, level, {
      userAgent,
      requestPath,
      payloadSize,
      requestRate
    })
    return false
  }

  // Log normal request
  if (reason) {
    addLog(ip, reason, level, {
      userAgent,
      requestPath,
      payloadSize,
      requestRate
    })
  }

  return true
}

/**
 * Add log entry
 */
function addLog(
  ip: string, 
  reason: string, 
  level: GuardianLog['level'], 
  details?: {
    userAgent?: string
    requestPath?: string
    payloadSize?: number
    requestRate?: number
  }
): void {
  const log: GuardianLog = {
    timestamp: Date.now(),
    ip,
    reason,
    level,
    userAgent: details?.userAgent,
    requestPath: details?.requestPath,
    payloadSize: details?.payloadSize,
    requestRate: details?.requestRate
  }

  guardianLogs.push(log)
  guardianStats.alertsGenerated++

  if (level === 'critical') {
    guardianStats.criticalThreats++
  }

  // Clean old logs
  cleanOldLogs()
}

/**
 * Block an IP address
 */
function blockIP(ip: string, reason: string): void {
  blockedIPs.add(ip)
  guardianStats.blockedIPs++

  const hash = createHash('md5').update(ip).digest('hex')
  const blockFile = path.join(blockedDir, `${hash}.block`)
  
  try {
    writeFileSync(blockFile, JSON.stringify({
      ip,
      reason,
      blockedAt: Date.now(),
      expiresAt: Date.now() + defaultConfig.blockDuration
    }))
    console.log(`🛡️ Guardian: Blocked IP ${ip} - ${reason}`)
  } catch (error) {
    console.error('Error in guardian blocking:', error)
  }
}

/**
 * Calculate request rate for an IP
 */
function calculateRequestRate(ip: string): number {
  const now = Date.now()
  const oneMinuteAgo = now - 60000

  if (!requestCounts.has(ip)) {
    requestCounts.set(ip, [])
  }

  const timestamps = requestCounts.get(ip)!
  timestamps.push(now)

  // Remove old timestamps
  const recentTimestamps = timestamps.filter(t => t > oneMinuteAgo)
  requestCounts.set(ip, recentTimestamps)

  return recentTimestamps.length
}

/**
 * Check if user agent is suspicious
 */
function isSuspiciousUserAgent(userAgent: string): boolean {
  const suspiciousPatterns = [
    /bot/i,
    /crawler/i,
    /scanner/i,
    /hack/i,
    /exploit/i,
    /attack/i,
    /nikto/i,
    /sqlmap/i
  ]

  return suspiciousPatterns.some(pattern => pattern.test(userAgent))
}

/**
 * Check if request path is suspicious
 */
function isSuspiciousPath(path: string): boolean {
  const suspiciousPaths = [
    /\.\.\//, // Directory traversal
    /\/admin\//, // Admin paths
    /\/wp-admin\//, // WordPress admin
    /\/phpmyadmin\//, // phpMyAdmin
    /\.php$/, // PHP files
    /\.asp$/, // ASP files
    /\/api\/v\d+\/admin/, // API admin endpoints
    /\/\.env/, // Environment files
    /\/config/, // Config files
    /sql/i, // SQL injection attempts
    /script/i, // Script injection
    /union/i, // SQL union attacks
    /select.*from/i, // SQL select statements
    /insert.*into/i, // SQL insert statements
    /drop.*table/i // SQL drop statements
  ]

  return suspiciousPaths.some(pattern => pattern.test(path))
}

/**
 * Clean old log entries
 */
function cleanOldLogs(): void {
  const maxAge = defaultConfig.logRetentionDays * 24 * 60 * 60 * 1000
  const cutoffTime = Date.now() - maxAge

  while (guardianLogs.length > 0 && guardianLogs[0].timestamp < cutoffTime) {
    guardianLogs.shift()
  }
}

/**
 * Get Guardian statistics
 */
export function getGuardianStats(): GuardianStats {
  return { ...guardianStats }
}

/**
 * Get Guardian logs
 */
export function getGuardianLogs(limit = 100): GuardianLog[] {
  return guardianLogs.slice(-limit)
}

/**
 * Check if IP is blocked
 */
export function isIPBlocked(ip: string): boolean {
  return blockedIPs.has(ip)
}

/**
 * Unblock an IP address
 */
export function unblockIP(ip: string): boolean {
  if (blockedIPs.has(ip)) {
    blockedIPs.delete(ip)
    guardianStats.blockedIPs--

    const hash = createHash('md5').update(ip).digest('hex')
    const blockFile = path.join(blockedDir, `${hash}.block`)
    
    try {
      if (existsSync(blockFile)) {
        require('fs').unlinkSync(blockFile)
      }
      console.log(`🛡️ Guardian: Unblocked IP ${ip}`)
      return true
    } catch (error) {
      console.error('Error unblocking IP:', error)
      return false
    }
  }
  return false
}
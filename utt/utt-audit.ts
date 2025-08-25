/**
 * UTT Audit & Security Layer
 * @author Ledjan Ahmati
 * @version 8.0.0-WEB8
 * @contact dealsjona@gmail.com
 */

import { PublicKey } from '@solana/web3.js';
import { ALB_TOKEN } from './albion-token';

export interface AuditLogEntry {
  id: string;
  timestamp: number;
  type: 'transfer' | 'mint' | 'burn' | 'verify' | 'error' | 'security';
  from?: string;
  to?: string;
  amount?: number;
  signature?: string;
  tokenId?: string;
  status: 'success' | 'failed' | 'pending';
  details: string;
  hash: string;
  blockHeight?: number;
  fee?: number;
  gasUsed?: number;
}

export interface SecurityReport {
  timestamp: number;
  totalTransactions: number;
  suspiciousActivity: number;
  failedTransactions: number;
  uniqueAddresses: number;
  totalVolume: number;
  averageTransactionSize: number;
  securityLevel: 'low' | 'medium' | 'high' | 'critical';
  threats: string[];
  recommendations: string[];
}

export interface IdentityMapping {
  address: string;
  did?: string; // Decentralized Identifier
  verified: boolean;
  kycLevel: 'none' | 'basic' | 'enhanced' | 'institutional';
  createdAt: number;
  lastVerified?: number;
  metadata?: {
    name?: string;
    country?: string;
    organization?: string;
    publicKey?: string;
  };
}

/**
 * Generate audit log entry ID
 */
function generateAuditId(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 10);
  return `AUDIT_${timestamp}_${random}`.toUpperCase();
}

/**
 * Generate SHA256 hash (browser-compatible)
 */
async function generateHash(data: string): Promise<string> {
  // Use Web Crypto API if available (browser)
  if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', dataBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }
  
  // Fallback for Node.js environment
  if (typeof require !== 'undefined') {
    const crypto = require('crypto');
    return crypto.createHash('sha256').update(data).digest('hex');
  }
  
  // Simple hash fallback
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16);
}

/**
 * Create audit log entry
 */
export async function createAuditEntry(
  type: AuditLogEntry['type'],
  details: string,
  metadata: Partial<AuditLogEntry> = {}
): Promise<AuditLogEntry> {
  const entry: AuditLogEntry = {
    id: generateAuditId(),
    timestamp: Date.now(),
    type,
    status: 'success',
    details,
    hash: '', // Will be set below
    ...metadata
  };
  
  // Generate hash of the entry (excluding the hash field itself)
  const entryForHash = { ...entry };
  delete (entryForHash as any).hash;
  entry.hash = await generateHash(JSON.stringify(entryForHash));
  
  return entry;
}

/**
 * Log transaction audit
 */
export async function logTransaction(
  from: string,
  to: string,
  amount: number,
  signature: string,
  status: 'success' | 'failed' | 'pending',
  blockHeight?: number,
  fee?: number
): Promise<AuditLogEntry> {
  const entry = await createAuditEntry(
    'transfer',
    `Transfer ${amount} ALB from ${from.slice(0, 8)}... to ${to.slice(0, 8)}...`,
    {
      from,
      to,
      amount,
      signature,
      status,
      blockHeight,
      fee
    }
  );
  
  await saveAuditEntry(entry);
  return entry;
}

/**
 * Log security event
 */
export async function logSecurityEvent(
  type: 'verification' | 'suspicious_activity' | 'failed_auth' | 'rate_limit',
  details: string,
  address?: string
): Promise<AuditLogEntry> {
  const entry = await createAuditEntry(
    'security',
    `Security event: ${type} - ${details}`,
    {
      from: address,
      status: 'success'
    }
  );
  
  await saveAuditEntry(entry);
  return entry;
}

/**
 * Log error event
 */
export async function logError(
  error: string,
  context?: string,
  address?: string
): Promise<AuditLogEntry> {
  const entry = await createAuditEntry(
    'error',
    `Error: ${error}${context ? ` Context: ${context}` : ''}`,
    {
      from: address,
      status: 'failed'
    }
  );
  
  await saveAuditEntry(entry);
  return entry;
}

/**
 * Save audit entry (implement storage backend)
 */
async function saveAuditEntry(entry: AuditLogEntry): Promise<void> {
  try {
    // Try to save to API endpoint
    if (typeof fetch !== 'undefined') {
      const response = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry)
      });
      
      if (response.ok) {
        console.log('✅ Audit entry saved to server:', entry.id);
        return;
      }
    }
    
    // Fallback: save to localStorage (browser)
    if (typeof window !== 'undefined' && window.localStorage) {
      const existing = localStorage.getItem('utt_audit_log');
      const auditLog = existing ? JSON.parse(existing) : [];
      auditLog.push(entry);
      
      // Keep only last 1000 entries
      if (auditLog.length > 1000) {
        auditLog.splice(0, auditLog.length - 1000);
      }
      
      localStorage.setItem('utt_audit_log', JSON.stringify(auditLog));
      console.log('💾 Audit entry saved to localStorage:', entry.id);
      return;
    }
    
    // Fallback: console log
    console.log('📝 Audit entry:', entry);
  } catch (error) {
    console.error('❌ Failed to save audit entry:', error);
  }
}

/**
 * Get audit entries
 */
export async function getAuditEntries(
  limit: number = 100,
  type?: AuditLogEntry['type'],
  address?: string
): Promise<AuditLogEntry[]> {
  try {
    // Try to fetch from API
    if (typeof fetch !== 'undefined') {
      const params = new URLSearchParams({
        limit: limit.toString(),
        ...(type && { type }),
        ...(address && { address })
      });
      
      const response = await fetch(`/api/audit?${params}`);
      if (response.ok) {
        const data = await response.json();
        return data.entries || [];
      }
    }
    
    // Fallback: read from localStorage
    if (typeof window !== 'undefined' && window.localStorage) {
      const existing = localStorage.getItem('utt_audit_log');
      if (existing) {
        let entries = JSON.parse(existing) as AuditLogEntry[];
        
        // Filter by type
        if (type) {
          entries = entries.filter(e => e.type === type);
        }
        
        // Filter by address
        if (address) {
          entries = entries.filter(e => e.from === address || e.to === address);
        }
        
        // Return latest entries
        return entries.slice(-limit).reverse();
      }
    }
    
    return [];
  } catch (error) {
    console.error('❌ Failed to get audit entries:', error);
    return [];
  }
}

/**
 * Verify audit entry integrity
 */
export async function verifyAuditEntry(entry: AuditLogEntry): Promise<boolean> {
  try {
    const entryForHash = { ...entry };
    delete (entryForHash as any).hash;
    const expectedHash = await generateHash(JSON.stringify(entryForHash));
    
    return entry.hash === expectedHash;
  } catch {
    return false;
  }
}

/**
 * Generate security report
 */
export async function generateSecurityReport(
  periodDays: number = 7
): Promise<SecurityReport> {
  try {
    const since = Date.now() - (periodDays * 24 * 60 * 60 * 1000);
    const entries = await getAuditEntries(10000); // Get large batch
    const relevantEntries = entries.filter(e => e.timestamp >= since);
    
    const transfers = relevantEntries.filter(e => e.type === 'transfer');
    const failed = relevantEntries.filter(e => e.status === 'failed');
    const security = relevantEntries.filter(e => e.type === 'security');
    
    const addresses = new Set([
      ...transfers.map(e => e.from).filter(Boolean),
      ...transfers.map(e => e.to).filter(Boolean)
    ]);
    
    const totalVolume = transfers
      .filter(e => e.amount)
      .reduce((sum, e) => sum + (e.amount || 0), 0);
    
    const avgTransactionSize = transfers.length > 0 ? totalVolume / transfers.length : 0;
    
    // Simple security analysis
    const suspiciousActivity = security.length + failed.length;
    let securityLevel: SecurityReport['securityLevel'] = 'low';
    
    if (suspiciousActivity > 10) securityLevel = 'high';
    else if (suspiciousActivity > 5) securityLevel = 'medium';
    
    const threats: string[] = [];
    const recommendations: string[] = [];
    
    if (failed.length > transfers.length * 0.1) {
      threats.push('High failure rate detected');
      recommendations.push('Investigate transaction failures');
    }
    
    if (avgTransactionSize > 1000) {
      recommendations.push('Monitor large transactions');
    }
    
    return {
      timestamp: Date.now(),
      totalTransactions: transfers.length,
      suspiciousActivity,
      failedTransactions: failed.length,
      uniqueAddresses: addresses.size,
      totalVolume,
      averageTransactionSize: avgTransactionSize,
      securityLevel,
      threats,
      recommendations
    };
  } catch (error) {
    console.error('❌ Failed to generate security report:', error);
    
    return {
      timestamp: Date.now(),
      totalTransactions: 0,
      suspiciousActivity: 0,
      failedTransactions: 0,
      uniqueAddresses: 0,
      totalVolume: 0,
      averageTransactionSize: 0,
      securityLevel: 'low',
      threats: ['Failed to generate report'],
      recommendations: ['Check audit system']
    };
  }
}

/**
 * Create identity mapping for address
 */
export function createIdentityMapping(
  address: string,
  kycLevel: IdentityMapping['kycLevel'] = 'none',
  metadata?: IdentityMapping['metadata']
): IdentityMapping {
  return {
    address,
    verified: kycLevel !== 'none',
    kycLevel,
    createdAt: Date.now(),
    metadata
  };
}

/**
 * Generate DID (Decentralized Identifier)
 */
export function generateDID(address: string, method: string = 'solana'): string {
  return `did:${method}:${address}`;
}

export default {
  createAuditEntry,
  logTransaction,
  logSecurityEvent,
  logError,
  getAuditEntries,
  verifyAuditEntry,
  generateSecurityReport,
  createIdentityMapping,
  generateDID
};

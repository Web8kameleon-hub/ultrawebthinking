/**
 * UTT Physical Token Interface - NFC & QR Integration
 * @author Ledjan Ahmati
 * @version 8.0.0-WEB8
 * @contact dealsjona@gmail.com
 */

import { PublicKey } from '@solana/web3.js';
import { ALB_TOKEN, toEurValue } from './albion-token';
import { getExplorerUrl, getCurrentCluster } from './albion-connection';

export interface PhysicalTokenData {
  tokenId: string;
  mint: string;
  amount: number;
  valueEUR: number;
  ownerAddress?: string | undefined;
  createdAt: number;
  lastTransfer?: number | undefined;
  isActive: boolean;
}

export interface NFCPayload {
  type: 'albion_token';
  tokenId: string;
  mint: string;
  amount: number;
  valueEUR: number;
  timestamp: number;
  signature: string;
}

export interface QRCodeData {
  protocol: 'solana';
  mint: string;
  amount?: number | undefined;
  recipient?: string | undefined;
  message?: string | undefined;
  cluster?: string | undefined;
}

/**
 * Generate unique physical token ID
 */
export function generateTokenId(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `UTT_${timestamp}_${random}`.toUpperCase();
}

/**
 * Create physical token data structure
 */
export function createPhysicalToken(
  amount: number,
  ownerAddress?: string
): PhysicalTokenData {
  const now = Date.now();
  
  return {
    tokenId: generateTokenId(),
    mint: ALB_TOKEN.mint,
    amount,
    valueEUR: toEurValue(amount),
    ownerAddress,
    createdAt: now,
    isActive: true
  };
}

/**
 * Build NFC payload for physical token
 */
export function buildNfcPayload(tokenData: PhysicalTokenData): NFCPayload {
  const payload = {
    type: 'albion_token' as const,
    tokenId: tokenData.tokenId,
    mint: tokenData.mint,
    amount: tokenData.amount,
    valueEUR: tokenData.valueEUR,
    timestamp: Date.now()
  };
  
  // Generate simple signature (in production, use proper cryptographic signing)
  const signature = generateTokenSignature(payload);
  
  return {
    ...payload,
    signature
  };
}

/**
 * Generate simple token signature for anti-counterfeit
 */
function generateTokenSignature(data: Omit<NFCPayload, 'signature'>): string {
  // Simple hash for demo - in production use proper cryptographic signing
  const dataString = JSON.stringify(data);
  let hash = 0;
  
  for (let i = 0; i < dataString.length; i++) {
    const char = dataString.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  return Math.abs(hash).toString(16).toUpperCase();
}

/**
 * Verify NFC token authenticity
 */
export function verifyNfcToken(payload: NFCPayload): { valid: boolean; error?: string } {
  try {
    // Check signature
    const expectedSignature = generateTokenSignature({
      type: payload.type,
      tokenId: payload.tokenId,
      mint: payload.mint,
      amount: payload.amount,
      valueEUR: payload.valueEUR,
      timestamp: payload.timestamp
    });
    
    if (payload.signature !== expectedSignature) {
      return { valid: false, error: 'Invalid token signature - possible counterfeit' };
    }
    
    // Check token type
    if (payload.type !== 'albion_token') {
      return { valid: false, error: 'Invalid token type' };
    }
    
    // Check mint address
    if (payload.mint !== ALB_TOKEN.mint) {
      return { valid: false, error: 'Invalid mint address' };
    }
    
    // Check amount
    if (payload.amount <= 0) {
      return { valid: false, error: 'Invalid token amount' };
    }
    
    // Check timestamp (not too old)
    const maxAge = 30 * 24 * 60 * 60 * 1000; // 30 days
    if (Date.now() - payload.timestamp > maxAge) {
      return { valid: false, error: 'Token data is too old' };
    }
    
    return { valid: true };
  } catch (error) {
    return { valid: false, error: 'Failed to verify token' };
  }
}

/**
 * Build QR code deep link for Albion transfer
 */
export function buildQrDeepLink(
  amount?: number,
  recipient?: string,
  message?: string
): string {
  const params = new URLSearchParams();
  
  if (amount) {
    params.append('amount', amount.toString());
  }
  
  if (recipient) {
    params.append('recipient', recipient);
  }
  
  if (message) {
    params.append('message', message);
  }
  
  const cluster = getCurrentCluster();
  if (cluster !== 'mainnet-beta') {
    params.append('cluster', cluster);
  }
  
  const queryString = params.toString();
  return `solana:${ALB_TOKEN.mint}${queryString ? `?${queryString}` : ''}`;
}

/**
 * Parse QR code deep link
 */
export function parseQrDeepLink(deepLink: string): QRCodeData | null {
  try {
    const url = new URL(deepLink);
    
    if (url.protocol !== 'solana:') {
      return null;
    }
    
    const mint = url.pathname;
    const searchParams = url.searchParams;
    
    return {
      protocol: 'solana',
      mint,
      amount: searchParams.get('amount') ? parseFloat(searchParams.get('amount')!) : undefined,
      recipient: searchParams.get('recipient') || undefined,
      message: searchParams.get('message') || undefined,
      cluster: searchParams.get('cluster') || undefined
    };
  } catch {
    return null;
  }
}

/**
 * Generate QR code for wallet address
 */
export function buildWalletQr(address: string | PublicKey): string {
  const addressString = typeof address === 'string' ? address : address.toString();
  return buildQrDeepLink(undefined, addressString);
}

/**
 * Generate QR code for specific payment request
 */
export function buildPaymentQr(
  recipient: string | PublicKey,
  amount: number,
  message?: string
): string {
  const recipientString = typeof recipient === 'string' ? recipient : recipient.toString();
  return buildQrDeepLink(amount, recipientString, message);
}

/**
 * Get Solana Explorer link for physical token
 */
export function getTokenExplorerLink(tokenData: PhysicalTokenData): string {
  return getExplorerUrl(tokenData.mint, 'address');
}

/**
 * Format physical token for display
 */
export function formatPhysicalToken(tokenData: PhysicalTokenData): string {
  return `${tokenData.tokenId}: ${tokenData.amount} ALB (€${tokenData.valueEUR.toLocaleString()})`;
}

/**
 * Convert physical token to JSON for storage
 */
export function serializePhysicalToken(tokenData: PhysicalTokenData): string {
  return JSON.stringify(tokenData, null, 2);
}

/**
 * Parse physical token from JSON
 */
export function deserializePhysicalToken(json: string): PhysicalTokenData | null {
  try {
    const data = JSON.parse(json);
    
    // Validate required fields
    if (!data.tokenId || !data.mint || !data.amount || !data.createdAt) {
      return null;
    }
    
    return data as PhysicalTokenData;
  } catch {
    return null;
  }
}

/**
 * Generate anti-counterfeit hologram data
 */
export function generateHologramData(tokenData: PhysicalTokenData): {
  pattern: string;
  checksum: string;
  security: string;
} {
  const pattern = tokenData.tokenId.split('_').map(part => 
    part.split('').reverse().join('')
  ).join('-');
  
  const checksum = generateTokenSignature({
    type: 'albion_token',
    tokenId: tokenData.tokenId,
    mint: tokenData.mint,
    amount: tokenData.amount,
    valueEUR: tokenData.valueEUR,
    timestamp: tokenData.createdAt
  });
  
  const security = `ALB${tokenData.amount}EUR${Math.floor(tokenData.valueEUR)}`;
  
  return {
    pattern,
    checksum,
    security
  };
}

export default {
  generateTokenId,
  createPhysicalToken,
  buildNfcPayload,
  verifyNfcToken,
  buildQrDeepLink,
  parseQrDeepLink,
  buildWalletQr,
  buildPaymentQr,
  getTokenExplorerLink,
  formatPhysicalToken,
  serializePhysicalToken,
  deserializePhysicalToken,
  generateHologramData
};

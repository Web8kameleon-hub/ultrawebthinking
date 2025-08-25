/**
 * UTT-Albion Token Definition & Utilities
 * @author Ledjan Ahmati
 * @version 8.0.0-WEB8
 * @contact dealsjona@gmail.com
 */

import { PublicKey } from '@solana/web3.js';

export const ALB_TOKEN = {
  mint: "HSEcf132J4dNz46gw5fsVV7xfgedeFyTZXMSHcroz3BU", // Albion token mint
  symbol: "ALB",
  name: "Albion Token",
  decimals: 6,
  authority: "AuGX5kaG3ydcJLaGTUptSKnbC4y3MeUp1qds8mYJt9ua",
  valueEUR: 1000, // 1 ALB = €1000
  totalSupply: 1000000, // 1M ALB max supply
  website: "https://albion.utt.al",
  description: "UTT Industrial Token - €1000 per ALB"
} as const;

export interface AlbionTokenInfo {
  mint: string;
  symbol: string;
  name: string;
  decimals: number;
  authority: string;
  valueEUR: number;
  totalSupply: number;
  website: string;
  description: string;
}

/**
 * Convert ALB amount to base units (with decimals)
 * Example: 1.5 ALB → 1,500,000 (base units)
 */
export function toBaseUnits(albAmount: number): number {
  return Math.floor(albAmount * Math.pow(10, ALB_TOKEN.decimals));
}

/**
 * Convert base units to ALB amount
 * Example: 1,500,000 (base units) → 1.5 ALB
 */
export function toUiAmount(baseUnits: number): number {
  return baseUnits / Math.pow(10, ALB_TOKEN.decimals);
}

/**
 * Calculate EUR value of ALB amount
 */
export function toEurValue(albAmount: number): number {
  return albAmount * ALB_TOKEN.valueEUR;
}

/**
 * Calculate ALB amount from EUR value
 */
export function fromEurValue(eurAmount: number): number {
  return eurAmount / ALB_TOKEN.valueEUR;
}

/**
 * Format ALB amount for display
 */
export function formatAlbAmount(amount: number, decimals: number = 3): string {
  return `${amount.toFixed(decimals)} ALB`;
}

/**
 * Format EUR value for display
 */
export function formatEurValue(amount: number): string {
  return `€${amount.toLocaleString('de-DE', { minimumFractionDigits: 2 })}`;
}

/**
 * Get ALB token mint as PublicKey
 */
export function getAlbMint(): PublicKey {
  return new PublicKey(ALB_TOKEN.mint);
}

/**
 * Get ALB authority as PublicKey
 */
export function getAlbAuthority(): PublicKey {
  return new PublicKey(ALB_TOKEN.authority);
}

/**
 * Validate ALB amount (must be positive and within supply)
 */
export function validateAlbAmount(amount: number): { valid: boolean; error?: string } {
  if (amount <= 0) {
    return { valid: false, error: "Amount must be positive" };
  }
  
  if (amount > ALB_TOKEN.totalSupply) {
    return { valid: false, error: `Amount exceeds max supply (${ALB_TOKEN.totalSupply} ALB)` };
  }
  
  return { valid: true };
}

/**
 * Generate ALB transaction memo
 */
export function generateAlbMemo(
  type: 'transfer' | 'mint' | 'burn' | 'audit',
  amount: number,
  from?: string,
  to?: string
): string {
  const timestamp = Date.now();
  const memo = {
    token: ALB_TOKEN.symbol,
    type,
    amount,
    from,
    to,
    timestamp,
    valueEUR: toEurValue(amount)
  };
  
  return JSON.stringify(memo);
}

export default ALB_TOKEN;

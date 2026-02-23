// Phantom Wallet Integration
// Stub implementation for build compatibility

import type { Connection, Transaction } from '@solana/web3.js';

interface PhantomProvider {
  publicKey: { toBase58: () => string };
  connect: () => Promise<{ publicKey: { toBase58: () => string } }>;
  signAndSendTransaction: (tx: Transaction) => Promise<{ signature: string }>;
}

declare global {
  interface Window {
    solana?: PhantomProvider;
  }
}

export async function connectPhantom(): Promise<PhantomProvider | null> {
  if (typeof window === 'undefined') return null;
  
  const provider = window.solana;
  if (!provider) {
    console.warn('Phantom wallet not installed');
    return null;
  }
  
  try {
    await provider.connect();
    return provider;
  } catch (error) {
    console.error('Failed to connect to Phantom:', error);
    return null;
  }
}

export async function signAndSendWithPhantom(
  connection: Connection,
  transaction: Transaction
): Promise<string> {
  const provider = window.solana;
  if (!provider) {
    throw new Error('Phantom wallet not available');
  }
  
  const result = await provider.signAndSendTransaction(transaction);
  return result.signature;
}

export function isPhantomInstalled(): boolean {
  if (typeof window === 'undefined') return false;
  return !!window.solana;
}

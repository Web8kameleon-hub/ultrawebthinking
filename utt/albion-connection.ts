/**
 * UTT-Albion Solana Connection Manager
 * @author Ledjan Ahmati
 * @version 8.0.0-WEB8
 * @contact dealsjona@gmail.com
 */

import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';

export type SolanaCluster = 'mainnet-beta' | 'testnet' | 'devnet' | 'localnet';

// Default RPC endpoints
const RPC_ENDPOINTS = {
  'mainnet-beta': 'https://api.mainnet-beta.solana.com',
  'testnet': 'https://api.testnet.solana.com',
  'devnet': 'https://api.devnet.solana.com',
  'localnet': 'http://localhost:8899'
} as const;

/**
 * Get Solana connection based on environment variables
 */
export function getConnection(): Connection {
  // Try custom RPC URL first
  const customRpcUrl = process.env.NEXT_PUBLIC_SOLANA_RPC_URL;
  if (customRpcUrl) {
    console.log('🌐 Using custom Solana RPC:', customRpcUrl);
    return new Connection(customRpcUrl, 'confirmed');
  }

  // Use cluster-based connection
  const cluster = (process.env.NEXT_PUBLIC_SOLANA_CLUSTER as SolanaCluster) || 'devnet';
  const rpcUrl = RPC_ENDPOINTS[cluster] || clusterApiUrl(cluster === 'localnet' ? 'devnet' : cluster);
  
  console.log('🌐 Using Solana cluster:', cluster, rpcUrl);
  return new Connection(rpcUrl, 'confirmed');
}

/**
 * Get current cluster name
 */
export function getCurrentCluster(): SolanaCluster {
  return (process.env.NEXT_PUBLIC_SOLANA_CLUSTER as SolanaCluster) || 'devnet';
}

/**
 * Check if we're on mainnet
 */
export function isMainnet(): boolean {
  return getCurrentCluster() === 'mainnet-beta';
}

/**
 * Check if we're on devnet/testnet
 */
export function isTestnet(): boolean {
  const cluster = getCurrentCluster();
  return cluster === 'devnet' || cluster === 'testnet';
}

/**
 * Get explorer URL for address/transaction
 */
export function getExplorerUrl(addressOrSignature: string, type: 'address' | 'tx' = 'address'): string {
  const cluster = getCurrentCluster();
  const clusterParam = cluster === 'mainnet-beta' ? '' : `?cluster=${cluster}`;
  
  return `https://explorer.solana.com/${type}/${addressOrSignature}${clusterParam}`;
}

/**
 * Create PublicKey from string with validation
 */
export function pubkeyFrom(address: string): PublicKey {
  try {
    return new PublicKey(address);
  } catch (error) {
    throw new Error(`Invalid Solana address: ${address}`);
  }
}

/**
 * Validate Solana address format
 */
export function isValidSolanaAddress(address: string): boolean {
  try {
    new PublicKey(address);
    return true;
  } catch {
    return false;
  }
}

/**
 * Get connection health status
 */
export async function getConnectionHealth(): Promise<{
  healthy: boolean;
  cluster: string;
  version?: string;
  blockHeight?: number;
  latency: number;
}> {
  const startTime = Date.now();
  const connection = getConnection();
  const cluster = getCurrentCluster();

  try {
    const [version, blockHeight] = await Promise.all([
      connection.getVersion(),
      connection.getBlockHeight()
    ]);

    const latency = Date.now() - startTime;

    return {
      healthy: true,
      cluster,
      version: version['solana-core'],
      blockHeight,
      latency
    };
  } catch (error) {
    return {
      healthy: false,
      cluster,
      latency: Date.now() - startTime
    };
  }
}

/**
 * Get account info with error handling
 */
export async function getAccountInfo(address: PublicKey | string) {
  const connection = getConnection();
  const pubkey = typeof address === 'string' ? pubkeyFrom(address) : address;
  
  try {
    return await connection.getAccountInfo(pubkey);
  } catch (error) {
    console.error('Failed to get account info:', error);
    return null;
  }
}

/**
 * Check if account exists
 */
export async function accountExists(address: PublicKey | string): Promise<boolean> {
  const accountInfo = await getAccountInfo(address);
  return accountInfo !== null;
}

/**
 * Get SOL balance for address
 */
export async function getSolBalance(address: PublicKey | string): Promise<number> {
  const connection = getConnection();
  const pubkey = typeof address === 'string' ? pubkeyFrom(address) : address;
  
  try {
    const balance = await connection.getBalance(pubkey);
    return balance / 1000000000; // Convert lamports to SOL
  } catch (error) {
    console.error('Failed to get SOL balance:', error);
    return 0;
  }
}

/**
 * Wait for transaction confirmation with timeout
 */
export async function confirmTransaction(
  signature: string,
  timeoutMs: number = 30000
): Promise<boolean> {
  const connection = getConnection();
  
  try {
    const result = await connection.confirmTransaction(signature, 'confirmed');
    return !result.value.err;
  } catch (error) {
    console.error('Transaction confirmation failed:', error);
    return false;
  }
}

export default getConnection;

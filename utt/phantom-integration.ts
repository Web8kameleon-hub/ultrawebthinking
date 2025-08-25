/**
 * UTT-Phantom Wallet Integration
 * @author Ledjan Ahmati
 * @version 8.0.0-WEB8
 * @contact dealsjona@gmail.com
 */

import { Connection, PublicKey, Transaction, sendAndConfirmTransaction } from '@solana/web3.js';

interface PhantomWallet {
  isPhantom: boolean;
  publicKey: PublicKey | null;
  isConnected: boolean;
  connect(): Promise<{ publicKey: PublicKey }>;
  disconnect(): Promise<void>;
  signAndSendTransaction(transaction: Transaction): Promise<{ signature: string }>;
  signTransaction(transaction: Transaction): Promise<Transaction>;
  signAllTransactions(transactions: Transaction[]): Promise<Transaction[]>;
}

declare global {
  interface Window {
    solana?: PhantomWallet;
    phantom?: {
      solana?: PhantomWallet;
    };
  }
}

/**
 * Check if Phantom wallet is available
 */
export function isPhantomAvailable(): boolean {
  if (typeof window === 'undefined') return false;
  return !!(window.solana?.isPhantom || window.phantom?.solana?.isPhantom);
}

/**
 * Get Phantom wallet provider
 */
export function getPhantomProvider(): PhantomWallet | null {
  if (typeof window === 'undefined') return null;
  
  // Try window.solana first (newer Phantom versions)
  if (window.solana?.isPhantom) {
    return window.solana;
  }
  
  // Fallback to window.phantom.solana
  if (window.phantom?.solana?.isPhantom) {
    return window.phantom.solana;
  }
  
  return null;
}

/**
 * Connect to Phantom wallet
 */
export async function connectPhantom(): Promise<{ publicKey: PublicKey } | null> {
  try {
    const provider = getPhantomProvider();
    
    if (!provider) {
      throw new Error('Phantom wallet not found. Please install Phantom extension.');
    }
    
    const response = await provider.connect();
    console.log('🔗 Connected to Phantom:', response.publicKey.toString());
    
    return response;
  } catch (error: any) {
    console.error('❌ Failed to connect to Phantom:', error);
    
    if (error.code === 4001) {
      throw new Error('User rejected the connection request');
    }
    
    throw error;
  }
}

/**
 * Disconnect from Phantom wallet
 */
export async function disconnectPhantom(): Promise<void> {
  try {
    const provider = getPhantomProvider();
    
    if (provider && provider.isConnected) {
      await provider.disconnect();
      console.log('🔌 Disconnected from Phantom');
    }
  } catch (error) {
    console.error('❌ Failed to disconnect from Phantom:', error);
    throw error;
  }
}

/**
 * Get current connected Phantom wallet
 */
export function getConnectedPhantom(): { publicKey: PublicKey } | null {
  const provider = getPhantomProvider();
  
  if (provider && provider.isConnected && provider.publicKey) {
    return { publicKey: provider.publicKey };
  }
  
  return null;
}

/**
 * Sign and send transaction with Phantom
 */
export async function signAndSendWithPhantom(
  connection: Connection,
  transaction: Transaction
): Promise<string> {
  try {
    const provider = getPhantomProvider();
    
    if (!provider || !provider.isConnected) {
      throw new Error('Phantom wallet not connected');
    }
    
    // Get recent blockhash
    const { blockhash } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = provider.publicKey!;
    
    // Sign and send with Phantom
    const { signature } = await provider.signAndSendTransaction(transaction);
    
    console.log('✅ Transaction sent via Phantom:', signature);
    return signature;
  } catch (error: any) {
    console.error('❌ Failed to sign and send transaction:', error);
    
    if (error.code === 4001) {
      throw new Error('User rejected the transaction');
    }
    
    throw error;
  }
}

/**
 * Sign transaction with Phantom (without sending)
 */
export async function signWithPhantom(transaction: Transaction): Promise<Transaction> {
  try {
    const provider = getPhantomProvider();
    
    if (!provider || !provider.isConnected) {
      throw new Error('Phantom wallet not connected');
    }
    
    const signedTransaction = await provider.signTransaction(transaction);
    console.log('✅ Transaction signed with Phantom');
    
    return signedTransaction;
  } catch (error: any) {
    console.error('❌ Failed to sign transaction:', error);
    
    if (error.code === 4001) {
      throw new Error('User rejected the transaction signing');
    }
    
    throw error;
  }
}

/**
 * Sign multiple transactions with Phantom
 */
export async function signAllWithPhantom(transactions: Transaction[]): Promise<Transaction[]> {
  try {
    const provider = getPhantomProvider();
    
    if (!provider || !provider.isConnected) {
      throw new Error('Phantom wallet not connected');
    }
    
    const signedTransactions = await provider.signAllTransactions(transactions);
    console.log(`✅ ${transactions.length} transactions signed with Phantom`);
    
    return signedTransactions;
  } catch (error: any) {
    console.error('❌ Failed to sign transactions:', error);
    
    if (error.code === 4001) {
      throw new Error('User rejected the transaction signing');
    }
    
    throw error;
  }
}

/**
 * Send signed transaction and confirm
 */
export async function sendAndConfirmSignedTransaction(
  connection: Connection,
  signedTransaction: Transaction
): Promise<string> {
  try {
    const signature = await sendAndConfirmTransaction(
      connection,
      signedTransaction,
      [], // No additional signers needed as transaction is already signed
      { commitment: 'confirmed' }
    );
    
    console.log('✅ Transaction confirmed:', signature);
    return signature;
  } catch (error) {
    console.error('❌ Failed to send and confirm transaction:', error);
    throw error;
  }
}

/**
 * Check wallet connection status
 */
export function getWalletStatus(): {
  isAvailable: boolean;
  isConnected: boolean;
  publicKey: string | null;
  provider: string;
} {
  const provider = getPhantomProvider();
  
  return {
    isAvailable: isPhantomAvailable(),
    isConnected: !!(provider?.isConnected),
    publicKey: provider?.publicKey?.toString() || null,
    provider: 'Phantom'
  };
}

/**
 * Auto-connect to Phantom if previously connected
 */
export async function autoConnectPhantom(): Promise<{ publicKey: PublicKey } | null> {
  try {
    const provider = getPhantomProvider();
    
    if (provider && provider.publicKey) {
      // Wallet is already connected
      return { publicKey: provider.publicKey };
    }
    
    // Try to connect silently (only works if user previously connected)
    if (provider) {
      try {
        const response = await provider.connect();
        return response;
      } catch {
        // Silent fail if not previously connected
        return null;
      }
    }
    
    return null;
  } catch (error) {
    // Silent fail for auto-connect
    console.log('🔇 Auto-connect to Phantom failed (expected if not previously connected)');
    return null;
  }
}

export default {
  isPhantomAvailable,
  connectPhantom,
  disconnectPhantom,
  getConnectedPhantom,
  signAndSendWithPhantom,
  signWithPhantom,
  signAllWithPhantom,
  getWalletStatus,
  autoConnectPhantom
};

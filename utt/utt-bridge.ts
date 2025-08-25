/**
 * UTT Token Bridge - SPL Token Operations for Albion (ALB)
 * @author Ledjan Ahmati
 * @version 8.0.0-WEB8
 * @contact dealsjona@gmail.com
 */

import {
  Connection,
  PublicKey,
  Transaction,
  SystemProgram,
  TransactionInstruction
} from '@solana/web3.js';
import {
  TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
  createTransferInstruction,
  getAccount,
  TokenAccountNotFoundError,
  TokenInvalidAccountOwnerError
} from '@solana/spl-token';
import { getConnection, pubkeyFrom } from './albion-connection';
import { ALB_TOKEN, toBaseUnits, toUiAmount } from './albion-token';

export interface AlbTransferParams {
  from: PublicKey;
  to: PublicKey;
  amount: number; // Amount in ALB (UI units)
  memo?: string;
}

export interface AlbBalanceResult {
  balance: number; // Balance in ALB (UI units)
  balanceRaw: bigint; // Raw balance in base units
  address: string;
  tokenAccount: string;
}

/**
 * Get ALB token balance for a wallet
 */
export async function getAlbBalance(
  connection: Connection,
  walletAddress: PublicKey | string
): Promise<AlbBalanceResult | null> {
  try {
    const wallet = typeof walletAddress === 'string' ? pubkeyFrom(walletAddress) : walletAddress;
    const mint = pubkeyFrom(ALB_TOKEN.mint);
    
    // Get associated token account
    const tokenAccount = await getAssociatedTokenAddress(mint, wallet);
    
    try {
      // Get token account info
      const accountInfo = await getAccount(connection, tokenAccount);
      
      const balanceRaw = accountInfo.amount;
      const balance = toUiAmount(Number(balanceRaw));
      
      return {
        balance,
        balanceRaw,
        address: wallet.toString(),
        tokenAccount: tokenAccount.toString()
      };
    } catch (error) {
      if (error instanceof TokenAccountNotFoundError) {
        // Token account doesn't exist yet
        return {
          balance: 0,
          balanceRaw: BigInt(0),
          address: wallet.toString(),
          tokenAccount: tokenAccount.toString()
        };
      }
      throw error;
    }
  } catch (error) {
    console.error('❌ Failed to get ALB balance:', error);
    return null;
  }
}

/**
 * Check if wallet has associated token account for ALB
 */
export async function hasAlbTokenAccount(
  connection: Connection,
  walletAddress: PublicKey | string
): Promise<boolean> {
  try {
    const wallet = typeof walletAddress === 'string' ? pubkeyFrom(walletAddress) : walletAddress;
    const mint = pubkeyFrom(ALB_TOKEN.mint);
    const tokenAccount = await getAssociatedTokenAddress(mint, wallet);
    
    try {
      await getAccount(connection, tokenAccount);
      return true;
    } catch (error) {
      if (error instanceof TokenAccountNotFoundError) {
        return false;
      }
      throw error;
    }
  } catch (error) {
    console.error('❌ Failed to check ALB token account:', error);
    return false;
  }
}

/**
 * Build ALB transfer transaction
 */
export async function buildAlbTransferTx(
  connection: Connection,
  from: PublicKey,
  to: PublicKey,
  amount: number, // Amount in ALB
  memo?: string
): Promise<Transaction> {
  try {
    const mint = pubkeyFrom(ALB_TOKEN.mint);
    const amountBaseUnits = toBaseUnits(amount);
    
    // Get associated token accounts
    const fromTokenAccount = await getAssociatedTokenAddress(mint, from);
    const toTokenAccount = await getAssociatedTokenAddress(mint, to);
    
    const transaction = new Transaction();
    
    // Check if destination token account exists
    const toAccountExists = await hasAlbTokenAccount(connection, to);
    
    if (!toAccountExists) {
      // Create associated token account for destination
      const createAccountInstruction = createAssociatedTokenAccountInstruction(
        from, // payer
        toTokenAccount, // associated token account
        to, // owner
        mint // mint
      );
      transaction.add(createAccountInstruction);
    }
    
    // Create transfer instruction
    const transferInstruction = createTransferInstruction(
      fromTokenAccount, // source
      toTokenAccount, // destination
      from, // owner
      amountBaseUnits // amount in base units
    );
    transaction.add(transferInstruction);
    
    // Add memo if provided
    if (memo) {
      const memoInstruction = new TransactionInstruction({
        keys: [],
        programId: new PublicKey('MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr'),
        data: Buffer.from(memo, 'utf-8')
      });
      transaction.add(memoInstruction);
    }
    
    // Set fee payer and recent blockhash
    transaction.feePayer = from;
    const { blockhash } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    
    return transaction;
  } catch (error) {
    console.error('❌ Failed to build ALB transfer transaction:', error);
    throw error;
  }
}

/**
 * Transfer ALB tokens (simplified interface)
 */
export async function transferAlb(params: AlbTransferParams): Promise<string> {
  const connection = getConnection();
  
  try {
    // Build transaction
    const transaction = await buildAlbTransferTx(
      connection,
      params.from,
      params.to,
      params.amount,
      params.memo
    );
    
    // Note: This requires the transaction to be signed externally
    // In practice, use signAndSendWithPhantom() from phantom-integration.ts
    throw new Error('Transaction built but not signed. Use signAndSendWithPhantom() to complete.');
  } catch (error) {
    console.error('❌ ALB transfer failed:', error);
    throw error;
  }
}

/**
 * Get ALB token account address for wallet
 */
export async function getAlbTokenAccount(walletAddress: PublicKey | string): Promise<PublicKey> {
  const wallet = typeof walletAddress === 'string' ? pubkeyFrom(walletAddress) : walletAddress;
  const mint = pubkeyFrom(ALB_TOKEN.mint);
  
  return await getAssociatedTokenAddress(mint, wallet);
}

/**
 * Estimate transaction fee for ALB transfer
 */
export async function estimateAlbTransferFee(
  from: PublicKey,
  to: PublicKey,
  amount: number
): Promise<number> {
  try {
    const connection = getConnection();
    const transaction = await buildAlbTransferTx(connection, from, to, amount);
    
    // Get fee for transaction
    const fee = await connection.getFeeForMessage(transaction.compileMessage());
    return fee && fee.value ? fee.value / 1000000000 : 0.00001; // Convert lamports to SOL
  } catch (error) {
    console.error('❌ Failed to estimate transfer fee:', error);
    return 0.00001; // Default fee estimate
  }
}

/**
 * Validate ALB transfer parameters
 */
export function validateAlbTransfer(params: AlbTransferParams): { valid: boolean; error?: string } {
  // Check amount
  if (params.amount <= 0) {
    return { valid: false, error: 'Amount must be greater than 0' };
  }
  
  // Check addresses
  if (params.from.equals(params.to)) {
    return { valid: false, error: 'Cannot transfer to same address' };
  }
  
  // Check memo length
  if (params.memo && params.memo.length > 566) {
    return { valid: false, error: 'Memo too long (max 566 characters)' };
  }
  
  return { valid: true };
}

/**
 * Format transfer for display
 */
export function formatAlbTransfer(params: AlbTransferParams): string {
  const { amount, from, to, memo } = params;
  return `Transfer ${amount} ALB from ${from.toString().slice(0, 8)}... to ${to.toString().slice(0, 8)}...${memo ? ` (${memo})` : ''}`;
}

/**
 * Get all ALB holders (requires indexing service)
 */
export async function getAlbHolders(connection: Connection): Promise<Array<{ address: string; balance: number }>> {
  try {
    // This would require a proper indexing service in production
    // For now, return empty array
    console.log('ℹ️ ALB holders query requires indexing service');
    return [];
  } catch (error) {
    console.error('❌ Failed to get ALB holders:', error);
    return [];
  }
}

export default {
  getAlbBalance,
  hasAlbTokenAccount,
  buildAlbTransferTx,
  transferAlb,
  getAlbTokenAccount,
  estimateAlbTransferFee,
  validateAlbTransfer,
  formatAlbTransfer,
  getAlbHolders
};

// UTT Bridge - Token Transfer Utilities
// Stub implementation for build compatibility

import { 
  Connection, 
  PublicKey, 
  Transaction, 
  SystemProgram,
  LAMPORTS_PER_SOL
} from '@solana/web3.js';

export async function buildAlbTransferTx(
  connection: Connection,
  sender: PublicKey,
  recipient: PublicKey,
  amount: number
): Promise<Transaction> {
  const lamports = Math.floor(amount * LAMPORTS_PER_SOL);
  
  const transaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: sender,
      toPubkey: recipient,
      lamports,
    })
  );

  const { blockhash } = await connection.getLatestBlockhash();
  transaction.recentBlockhash = blockhash;
  transaction.feePayer = sender;

  return transaction;
}

export async function getBalance(
  connection: Connection,
  publicKey: PublicKey
): Promise<number> {
  const balance = await connection.getBalance(publicKey);
  return balance / LAMPORTS_PER_SOL;
}

export function lamportsToSol(lamports: number): number {
  return lamports / LAMPORTS_PER_SOL;
}

export function solToLamports(sol: number): number {
  return Math.floor(sol * LAMPORTS_PER_SOL);
}

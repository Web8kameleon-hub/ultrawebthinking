/**
 * Solana Blockchain Integrator for LoRa Data
 * @author Ledjan Ahmati
 * @version 8.0.0-WEB8
 * @contact dealsjona@gmail.com
 */

import {
  Connection,
  PublicKey,
  Keypair,
  Transaction,
  SystemProgram,
  sendAndConfirmTransaction,
  LAMPORTS_PER_SOL,
  TransactionInstruction,
  AccountInfo
} from '@solana/web3.js';
import { LoRaMessage, LoRaDevice } from './LoRaGateway';
import * as crypto from 'crypto';

export interface SolanaLoRaData {
  messageId: string;
  deviceId: string;
  payload: string;
  rssi: number;
  snr: number;
  timestamp: number;
  txSignature?: string;
  blockNumber?: number;
}

export interface AlbionToken {
  mint: string;
  decimals: number;
  symbol: string;
  name: string;
}

export class SolanaLoRaIntegrator {
  private connection: Connection;
  private walletKeypair: Keypair | null = null;
  private albionTokenMint: PublicKey | null = null;
  
  constructor(
    private rpcUrl: string = 'https://api.devnet.solana.com',
    private commitment: 'confirmed' | 'finalized' = 'confirmed'
  ) {
    this.connection = new Connection(rpcUrl, commitment);
  }

  async initialize(privateKeyBytes?: Uint8Array): Promise<void> {
    try {
      // Initialize wallet
      if (privateKeyBytes) {
        this.walletKeypair = Keypair.fromSecretKey(privateKeyBytes);
      } else {
        // Generate new keypair for testing
        this.walletKeypair = Keypair.generate();
        console.log('🔑 Generated new Solana keypair:', this.walletKeypair.publicKey.toString());
      }

      // Check wallet balance
      const balance = await this.connection.getBalance(this.walletKeypair.publicKey);
      console.log('💰 Wallet balance:', balance / LAMPORTS_PER_SOL, 'SOL');

      // Search for Albion token
      await this.findAlbionToken();

      console.log('✅ Solana LoRa Integrator initialized');
    } catch (error) {
      console.error('❌ Failed to initialize Solana integrator:', error);
      throw error;
    }
  }

  private async findAlbionToken(): Promise<void> {
    try {
      // Search for Albion token by common patterns
      const possibleMints = [
        'ALBionxxx...', // Placeholder - need to search for actual Albion token
        // Add more potential Albion token mint addresses
      ];

      console.log('🔍 Searching for Albion token...');
      
      // For now, we'll use a mock address until we find the real one
      // In production, you would query token registries or search by symbol
      
      console.log('ℹ️ Albion token search pending - manual configuration required');
    } catch (error) {
      console.log('⚠️ Albion token not found, continuing without token integration');
    }
  }

  async storeLoRaMessage(message: LoRaMessage): Promise<string | null> {
    if (!this.walletKeypair) {
      throw new Error('Solana wallet not initialized');
    }

    try {
      // Create data payload for blockchain storage
      const dataPayload = JSON.stringify({
        messageId: message.id,
        deviceId: message.deviceId,
        payload: message.payload,
        rssi: message.rssi,
        snr: message.snr,
        timestamp: message.timestamp.getTime(),
        frequency: message.frequency,
        dataRate: message.dataRate
      });

      // Create transaction with memo instruction
      const transaction = new Transaction();
      
      // Add memo instruction with LoRa data
      const memoInstruction = new TransactionInstruction({
        keys: [],
        programId: new PublicKey('MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr'),
        data: Buffer.from(dataPayload, 'utf-8')
      });

      transaction.add(memoInstruction);

      // Get recent blockhash
      const { blockhash } = await this.connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = this.walletKeypair.publicKey;

      // Sign and send transaction
      const signature = await sendAndConfirmTransaction(
        this.connection,
        transaction,
        [this.walletKeypair],
        { commitment: this.commitment }
      );

      console.log('📤 LoRa data stored on Solana:', signature);
      return signature;

    } catch (error) {
      console.error('❌ Failed to store LoRa message on Solana:', error);
      return null;
    }
  }

  async getStoredMessages(deviceId?: string): Promise<SolanaLoRaData[]> {
    try {
      // Get transaction signatures for the wallet
      const signatures = await this.connection.getSignaturesForAddress(
        this.walletKeypair!.publicKey,
        { limit: 100 }
      );

      const messages: SolanaLoRaData[] = [];

      for (const sigInfo of signatures) {
        try {
          const tx = await this.connection.getTransaction(sigInfo.signature, {
            commitment: 'confirmed'
          });

          if (tx?.meta?.logMessages) {
            // Parse memo data from transaction logs
            for (const log of tx.meta.logMessages) {
              if (log.includes('Program data:')) {
                try {
                  const dataStr = log.split('Program data: ')[1];
                  const decoded = Buffer.from(dataStr, 'base64').toString('utf-8');
                  const data = JSON.parse(decoded);

                  if (data.messageId && (!deviceId || data.deviceId === deviceId)) {
                    messages.push({
                      ...data,
                      txSignature: sigInfo.signature,
                      blockNumber: sigInfo.slot
                    });
                  }
                } catch (parseError) {
                  // Skip invalid data
                }
              }
            }
          }
        } catch (txError) {
          // Skip failed transaction lookups
        }
      }

      return messages.sort((a, b) => b.timestamp - a.timestamp);

    } catch (error) {
      console.error('❌ Failed to retrieve stored messages:', error);
      return [];
    }
  }

  async sendAlbionReward(deviceId: string, amount: number): Promise<string | null> {
    if (!this.walletKeypair || !this.albionTokenMint) {
      console.log('⚠️ Albion token not configured');
      return null;
    }

    try {
      // Implement Albion token transfer
      // This would require the actual Albion token mint address and program
      console.log(`💰 Sending ${amount} ALBION to device ${deviceId}`);
      
      // Placeholder for actual token transfer implementation
      return 'pending_albion_integration';
    } catch (error) {
      console.error('❌ Failed to send Albion reward:', error);
      return null;
    }
  }

  async getWalletInfo() {
    if (!this.walletKeypair) {
      return null;
    }

    const balance = await this.connection.getBalance(this.walletKeypair.publicKey);
    
    return {
      publicKey: this.walletKeypair.publicKey.toString(),
      balance: balance / LAMPORTS_PER_SOL,
      network: this.rpcUrl.includes('devnet') ? 'devnet' : 'mainnet',
      albionTokenConfigured: !!this.albionTokenMint
    };
  }

  async airdropSol(amount: number = 1): Promise<string> {
    if (!this.walletKeypair) {
      throw new Error('Wallet not initialized');
    }

    const signature = await this.connection.requestAirdrop(
      this.walletKeypair.publicKey,
      amount * LAMPORTS_PER_SOL
    );

    await this.connection.confirmTransaction(signature);
    console.log(`💧 Airdropped ${amount} SOL to wallet`);
    return signature;
  }
}

// Singleton instance
export const solanaIntegrator = new SolanaLoRaIntegrator();

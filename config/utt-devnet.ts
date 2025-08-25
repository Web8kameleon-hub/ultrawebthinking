/**
 * UTT Devnet Configuration
 * EuroWeb Platform - Solana ALB Integration
 * 
 * @author Ledjan Ahmati (100% Owner)
 * @contact dealsjona@gmail.com
 * @version 8.1.0 Ultra
 * @license MIT
 */

import { Keypair } from '@solana/web3.js'
import bs58 from 'bs58'

// Devnet ALB Token Mint Address (you need to create this)
export const DEVNET_ALB_MINT = 'ALBDevnetMintAddressHere12345678901234567890123'

// Bridge Keypair for Devnet (generate new one for security)
export const DEVNET_BRIDGE_KEYPAIR = (() => {
  // Generate a new keypair for devnet testing
  // In production, this should be loaded from secure storage
  const keypair = Keypair.generate()
  
  console.log('🔑 DEVNET BRIDGE KEYPAIR GENERATED:')
  console.log('Public Key:', keypair.publicKey.toString())
  console.log('Private Key (base58):', bs58.encode(keypair.secretKey))
  console.log('⚠️  SAVE THIS PRIVATE KEY SECURELY FOR DEVNET TESTING!')
  
  return keypair
})()

// Devnet Configuration
export const DEVNET_CONFIG = {
  // Network
  rpcUrl: 'https://api.devnet.solana.com',
  
  // Token
  mintAddress: DEVNET_ALB_MINT,
  decimals: 6,
  
  // Bridge
  bridgeKeypair: DEVNET_BRIDGE_KEYPAIR,
  bridgePublicKey: DEVNET_BRIDGE_KEYPAIR.publicKey.toString(),
  
  // Economics (devnet rates)
  euroPerALB: 100.0, // 1 ALB = €100 on devnet for testing
  
  // Rate limiting (more permissive on devnet)
  rateLimits: {
    transfersPerHour: 100,
    transfersPerDay: 1000,
    maxTransferAmountALB: 1000.0
  },
  
  // Security (relaxed for devnet)
  allowlist: {
    enabled: false, // Disabled for devnet testing
    addresses: []
  },
  
  // Features
  features: {
    transfersEnabled: true, // Enable transfers on devnet
    physicalTokensEnabled: true,
    auditLoggingEnabled: true,
    shadowMode: false // Disable shadow mode for devnet
  }
}

// Devnet Airdrop Helper
export const requestDevnetAirdrop = async (publicKey: string, amount = 1) => {
  try {
    const response = await fetch('https://api.devnet.solana.com', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'requestAirdrop',
        params: [publicKey, amount * 1e9] // Convert SOL to lamports
      })
    })
    
    const data = await response.json()
    return data.result // Transaction signature
  } catch (error) {
    console.error('Devnet airdrop failed:', error)
    throw error
  }
}

// Test Wallet Generator
export const generateTestWallet = () => {
  const keypair = Keypair.generate()
  return {
    publicKey: keypair.publicKey.toString(),
    privateKey: bs58.encode(keypair.secretKey),
    keypair
  }
}

// Environment Check
export const isDevnetMode = () => {
  return process.env.NEXT_PUBLIC_SOLANA_NETWORK === 'devnet'
}

export default DEVNET_CONFIG

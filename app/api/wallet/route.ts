/**
 * Wallet Connection API - Phantom & Solana Wallet Adapter
 * EuroWeb Platform - Web3 Integration
 *
 * @author Ledjan Ahmati (100% Owner)
 * @contact dealsjona@gmail.com
 * @version 8.1.0 Ultra
 * @license MIT
 */

import { NextRequest, NextResponse } from 'next/server'

interface WalletSession {
  publicKey: string
  connectedAt: string
  walletType: 'phantom' | 'solflare' | 'backpack' | 'other'
  network: string
  verified: boolean
}

// In production, use Redis or database
const WALLET_SESSIONS = new Map<string, WalletSession>()

// GET - Wallet info
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const publicKey = searchParams.get('publicKey')

  if (publicKey) {
    // Get specific wallet session
    const session = WALLET_SESSIONS.get(publicKey)
    if (session) {
      return NextResponse.json({
        success: true,
        connected: true,
        session
      })
    }
    return NextResponse.json({
      success: true,
      connected: false,
      message: 'Wallet not connected'
    })
  }

  // Return supported wallets info
  return NextResponse.json({
    success: true,
    supportedWallets: [
      {
        name: 'Phantom',
        icon: 'https://phantom.app/img/phantom-icon-purple.svg',
        url: 'https://phantom.app',
        adapter: 'phantom',
        recommended: true
      },
      {
        name: 'Solflare',
        icon: 'https://solflare.com/favicon.ico',
        url: 'https://solflare.com',
        adapter: 'solflare',
        recommended: false
      },
      {
        name: 'Backpack',
        icon: 'https://backpack.app/favicon.ico',
        url: 'https://backpack.app',
        adapter: 'backpack',
        recommended: false
      }
    ],
    network: process.env.SOLANA_NETWORK || 'devnet',
    features: {
      signMessage: true,
      signTransaction: true,
      signAllTransactions: true,
      connect: true,
      disconnect: true
    },
    albToken: {
      mint: process.env.SOLANA_ALB_MINT || 'ALBDevnetMintAddressHere12345678901234567890123',
      symbol: 'ALB',
      name: 'Albion Token',
      decimals: 6,
      logo: '/tokens/alb.png'
    }
  })
}

// POST - Wallet actions
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, publicKey, signature, message, walletType } = body

    switch (action) {
      case 'connect':
        if (!publicKey) {
          return NextResponse.json(
            { success: false, error: 'Public key required' },
            { status: 400 }
          )
        }

        const session: WalletSession = {
          publicKey,
          connectedAt: new Date().toISOString(),
          walletType: walletType || 'phantom',
          network: process.env.SOLANA_NETWORK || 'devnet',
          verified: false
        }

        WALLET_SESSIONS.set(publicKey, session)

        return NextResponse.json({
          success: true,
          action: 'connected',
          session,
          message: `Wallet ${publicKey.substring(0, 8)}... connected`
        })

      case 'verify':
        // Verify wallet ownership via signed message
        if (!publicKey || !signature || !message) {
          return NextResponse.json(
            { success: false, error: 'Public key, signature, and message required' },
            { status: 400 }
          )
        }

        // In production, verify signature using @solana/web3.js
        // const verified = nacl.sign.detached.verify(...)

        const existingSession = WALLET_SESSIONS.get(publicKey)
        if (existingSession) {
          existingSession.verified = true
          WALLET_SESSIONS.set(publicKey, existingSession)
        }

        return NextResponse.json({
          success: true,
          action: 'verified',
          verified: true,
          publicKey
        })

      case 'disconnect':
        if (!publicKey) {
          return NextResponse.json(
            { success: false, error: 'Public key required' },
            { status: 400 }
          )
        }

        WALLET_SESSIONS.delete(publicKey)

        return NextResponse.json({
          success: true,
          action: 'disconnected',
          message: 'Wallet disconnected'
        })

      case 'balance':
        if (!publicKey) {
          return NextResponse.json(
            { success: false, error: 'Public key required' },
            { status: 400 }
          )
        }

        // In production, fetch real balance from Solana
        // const connection = new Connection(...)
        // const balance = await connection.getBalance(new PublicKey(publicKey))

        return NextResponse.json({
          success: true,
          publicKey,
          balances: {
            SOL: {
              amount: 1.5,
              lamports: 1500000000,
              usd: 236.25
            },
            ALB: {
              amount: 10.5,
              raw: 10500000,
              eur: 1050.00
            }
          },
          network: process.env.SOLANA_NETWORK || 'devnet',
          lastUpdated: new Date().toISOString()
        })

      default:
        return NextResponse.json(
          { success: false, error: 'Unknown action' },
          { status: 400 }
        )
    }

  } catch (error: any) {
    console.error('Wallet API error:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

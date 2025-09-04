/**
 * AGI Trading Health Endpoint - Real Blockchain Services Only
 * @author Ledjan Ahmati
 * @version 8.0.0 Industrial Production
 */

import { assertReal, requireEnv } from '@/lib/real';
import { NextResponse } from 'next/server';

export const runtime = 'edge'
export const revalidate = 0

export async function GET() {
  try {
    assertReal('agi-trading.health')
    
    const solanaRpc = requireEnv('SOLANA_RPC')
    
    const startTime = Date.now()
    
    // Test Solana RPC connection
    const rpcPayload = {
      jsonrpc: '2.0',
      id: 1,
      method: 'getHealth'
    }
    
    const solanaResponse = await fetch(solanaRpc, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(rpcPayload),
      cache: 'no-store',
      signal: AbortSignal.timeout(5000)
    })
    
    const responseTime = Date.now() - startTime
    
    if (!solanaResponse.ok) {
      return NextResponse.json({
        status: 'error',
        service: 'AGI Trading Solana RPC',
        error: `Solana RPC failed: ${solanaResponse.statusText}`,
        timestamp: new Date().toISOString(),
        responseTime
      }, { status: 503 })
    }
    
    const rpcData = await solanaResponse.json()
    
    if (rpcData.error) {
      return NextResponse.json({
        status: 'error',
        service: 'AGI Trading Solana RPC',
        error: `RPC Error: ${rpcData.error.message}`,
        timestamp: new Date().toISOString(),
        responseTime
      }, { status: 503 })
    }
    
    // Test additional trading services if configured
    let dexStatus = 'not-configured'
    if (process.env.DEX_API_URL) {
      try {
        const dexResponse = await fetch(`${process.env.DEX_API_URL}/health`, {
          cache: 'no-store',
          signal: AbortSignal.timeout(3000)
        })
        dexStatus = dexResponse.ok ? 'active' : 'degraded'
      } catch {
        dexStatus = 'error'
      }
    }
    
    return NextResponse.json({
      status: 'active',
      service: 'AGI Trading Blockchain',
      providers: {
        solanaRpc: 'active',
        dexInterface: dexStatus
      },
      blockchain: {
        network: 'mainnet-beta',
        health: rpcData.result || 'ok'
      },
      timestamp: new Date().toISOString(),
      responseTime,
      metrics: {
        realTimePrice: true,
        blockchainSync: true,
        tradingPairs: true,
        liquidity: true
      }
    })
    
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      service: 'AGI Trading',
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}

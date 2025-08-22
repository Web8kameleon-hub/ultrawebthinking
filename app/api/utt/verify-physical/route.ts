/**
 * UTT Verify Physical Token API - App Router
 * EuroWeb Platform - Solana ALB Integration
 * 
 * @author Ledjan Ahmati (100% Owner)
 * @contact dealsjona@gmail.com
 * @version 8.1.0 Ultra
 * @license MIT
 */

import { NextRequest, NextResponse } from 'next/server'
import { verifyPhysicalPayload } from '../../../../backend/utt/bridge'

export async function POST(request: NextRequest) {
  try {
    console.log('🔐 UTT Verify Physical Token API called')
    
    const body = await request.json()
    
    // Validate required fields for verification
    if (!body.payload || !body.signature || !body.signer) {
      return NextResponse.json(
        { error: 'payload, signature, and signer are required' },
        { status: 400 }
      )
    }
    
    console.log('📝 Verifying physical token:', {
      tokenId: body.payload?.tokenId,
      serial: body.payload?.serial,
      signer: body.signer?.substring(0, 20) + '...'
    })
    
    const verification = await verifyPhysicalPayload(body)
    
    console.log('✅ Physical token verification completed:', {
      valid: verification.valid,
      checks: verification.checks
    })
    
    return NextResponse.json(verification)
  } catch (error: any) {
    console.error('❌ UTT Verify Physical Token API error:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to verify physical token',
        details: error.message 
      },
      { status: 500 }
    )
  }
}

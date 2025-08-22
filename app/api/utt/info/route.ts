/**
 * UTT Info API - App Router
 * EuroWeb Platform - Solana ALB Integration
 * 
 * @author Ledjan Ahmati (100% Owner)
 * @contact dealsjona@gmail.com
 * @version 8.1.0 Ultra
 * @license MIT
 */

import { NextRequest, NextResponse } from 'next/server'
import { uttInfo } from '../../../../backend/utt/bridge'

export async function GET(request: NextRequest) {
  try {
    console.log('📊 UTT Info API called')
    
    const info = await uttInfo()
    
    console.log('✅ UTT Info response:', {
      network: info.network,
      status: info.status,
      transfersEnabled: info.transfersEnabled
    })
    
    return NextResponse.json(info)
  } catch (error: any) {
    console.error('❌ UTT Info API error:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to get UTT info',
        details: error.message 
      },
      { status: 500 }
    )
  }
}

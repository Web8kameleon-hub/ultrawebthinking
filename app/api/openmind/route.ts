/**
 * Open Mind API Route
 * AGI Consciousness and Neural Processing
 */

import { NextRequest, NextResponse } from 'next/server'
import { openMindAPI } from '@/services/api/openMindAPI'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action') || 'status'
    
    switch (action) {
      case 'status':
        const consciousness = await openMindAPI.getConsciousnessState()
        return NextResponse.json({
          success: true,
          data: consciousness,
          timestamp: new Date().toISOString()
        })
      
      case 'suggestions':
        const query = searchParams.get('query') || ''
        const suggestions = await openMindAPI.getSuggestions(query)
        return NextResponse.json({
          success: true,
          data: { suggestions },
          timestamp: new Date().toISOString()
        })
      
      default:
        return NextResponse.json({
          success: false,
          error: 'Unknown action',
          timestamp: new Date().toISOString()
        }, { status: 400 })
    }
  } catch (error) {
    console.error('Open Mind API GET error:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Failed to retrieve Open Mind data',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, query, context, complexity = 'medium' } = body
    
    switch (action) {
      case 'ask':
        if (!query) {
          return NextResponse.json({
            success: false,
            error: 'Query is required',
            timestamp: new Date().toISOString()
          }, { status: 400 })
        }
        
        const response = await openMindAPI.askAGI(query, context, complexity)
        return NextResponse.json({
          success: true,
          data: response,
          timestamp: new Date().toISOString()
        })
      
      case 'think':
        if (!query) {
          return NextResponse.json({
            success: false,
            error: 'Query is required',
            timestamp: new Date().toISOString()
          }, { status: 400 })
        }
        
        // For REST API, we'll return a simulated thinking process
        const thoughts: any[] = []
        const thinkingPromise = openMindAPI.streamThinking(query, (thought) => {
          thoughts.push(thought)
        })
        
        await thinkingPromise
        
        return NextResponse.json({
          success: true,
          data: { thoughts },
          timestamp: new Date().toISOString()
        })
      
      case 'consciousness':
        const { level, focus, emotions } = body
        // Simulate consciousness update
        await new Promise(resolve => setTimeout(resolve, 500))
        
        return NextResponse.json({
          success: true,
          message: 'Consciousness state updated',
          timestamp: new Date().toISOString()
        })
      
      default:
        return NextResponse.json({
          success: false,
          error: 'Unknown action',
          timestamp: new Date().toISOString()
        }, { status: 400 })
    }
  } catch (error) {
    console.error('Open Mind API POST error:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Failed to process Open Mind request',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}

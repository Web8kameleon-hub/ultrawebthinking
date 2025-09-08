/**
 * Search API Route
 * Ultra Search with AGI integration
 */

import { NextRequest, NextResponse } from 'next/server'
import { searchAPI } from '@/services/api/searchAPI'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q') || searchParams.get('query')
    const limit = parseInt(searchParams.get('limit') || '10')
    const type = searchParams.get('type') || 'hybrid'
    
    if (!query) {
      return NextResponse.json({
        success: false,
        error: 'Query parameter is required',
        timestamp: new Date().toISOString()
      }, { status: 400 })
    }
    
    let results
    switch (type) {
      case 'web':
        results = await searchAPI.searchWeb(query, limit)
        break
      case 'local':
        results = await searchAPI.searchLocal(query, limit)
        break
      case 'hybrid':
      default:
        results = await searchAPI.searchHybrid(query, limit)
        break
    }
    
    return NextResponse.json({
      success: true,
      data: results,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Search API error:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Search failed',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { query, type = 'hybrid', limit = 10, filters } = body
    
    if (!query) {
      return NextResponse.json({
        success: false,
        error: 'Query is required',
        timestamp: new Date().toISOString()
      }, { status: 400 })
    }
    
    const results = await searchAPI.searchHybrid(query, limit)
    
    return NextResponse.json({
      success: true,
      data: results,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Search API POST error:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Search failed',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}

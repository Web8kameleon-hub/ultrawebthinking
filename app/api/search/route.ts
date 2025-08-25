/**
 * WEB8 Search API Route
 * Multi-engine search endpoint
 * 
 * @version 8.0.0
 * @author Ledjan Ahmati
 * @contact dealsjona@gmail.com
 */

import { NextRequest, NextResponse } from 'next/server';
import { MultiSearchEngine } from '../../../lib/search-engine/MultiSearchEngine';

const searchEngine = new MultiSearchEngine();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q');
    const maxResults = parseInt(searchParams.get('maxResults') || '20');
    const engines = searchParams.get('engines')?.split(',') || undefined;
    
    if (!q) {
      return NextResponse.json({
        success: false,
        error: 'Missing query parameter'
      }, { status: 400 });
    }

    const results = await searchEngine.search(q, {
      maxResults,
      engines,
      safeSearch: true
    });

    return NextResponse.json({
      success: true,
      query: q,
      totalResults: results.length,
      data: results,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Search API Error:', error);
    return NextResponse.json({
      success: false,
      error: 'Search failed',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, options = {} } = body;
    
    if (!query) {
      return NextResponse.json({
        success: false,
        error: 'Missing query in request body'
      }, { status: 400 });
    }

    const results = await searchEngine.search(query, {
      maxResults: 50,
      safeSearch: true,
      ...options
    });

    return NextResponse.json({
      success: true,
      query,
      totalResults: results.length,
      data: results,
      engines: searchEngine.getEngines(),
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Search API POST Error:', error);
    return NextResponse.json({
      success: false,
      error: 'Search failed',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}

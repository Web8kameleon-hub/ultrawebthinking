import { NextRequest, NextResponse } from 'next/server'
import { 
  searchKnowledge, 
  getAGIRecommendations, 
  getAllCategories, 
  getKnowledgeStats,
  knowledgeManager 
} from '@/lib/web8-knowledge-base'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action') || 'stats'
    const query = searchParams.get('q')
    const category = searchParams.get('category')
    const limit = parseInt(searchParams.get('limit') || '20')

    switch (action) {
      case 'search':
        if (!query) {
          return NextResponse.json({
            success: false,
            error: 'Query parameter required for search'
          }, { status: 400 })
        }
        
        const searchResults = searchKnowledge(query, category || undefined)
        return NextResponse.json({
          success: true,
          data: {
            query,
            category,
            ...searchResults
          },
          timestamp: new Date().toISOString()
        })

      case 'categories':
        const categories = getAllCategories()
        return NextResponse.json({
          success: true,
          data: { categories },
          timestamp: new Date().toISOString()
        })

      case 'recommendations':
        const recommendations = getAGIRecommendations()
        return NextResponse.json({
          success: true,
          data: { recommendations },
          timestamp: new Date().toISOString()
        })

      case 'history':
        const history = knowledgeManager.getSearchHistory(limit)
        return NextResponse.json({
          success: true,
          data: { history },
          timestamp: new Date().toISOString()
        })

      case 'favorites':
        const favorites = knowledgeManager.getFavoriteLinks()
        return NextResponse.json({
          success: true,
          data: { favorites },
          timestamp: new Date().toISOString()
        })

      case 'stats':
      default:
        const stats = getKnowledgeStats()
        return NextResponse.json({
          success: true,
          data: { stats },
          timestamp: new Date().toISOString()
        })
    }
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Knowledge base query failed',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, linkId, query, category } = body

    switch (action) {
      case 'favorite':
        if (!linkId) {
          return NextResponse.json({
            success: false,
            error: 'Link ID required'
          }, { status: 400 })
        }
        
        knowledgeManager.addToFavorites(linkId)
        return NextResponse.json({
          success: true,
          message: 'Added to favorites',
          timestamp: new Date().toISOString()
        })

      case 'unfavorite':
        if (!linkId) {
          return NextResponse.json({
            success: false,
            error: 'Link ID required'
          }, { status: 400 })
        }
        
        knowledgeManager.removeFromFavorites(linkId)
        return NextResponse.json({
          success: true,
          message: 'Removed from favorites',
          timestamp: new Date().toISOString()
        })

      case 'bulk_search':
        if (!query) {
          return NextResponse.json({
            success: false,
            error: 'Query required for bulk search'
          }, { status: 400 })
        }

        // Perform multiple searches with related terms
        const queries = [query, ...query.split(' ').slice(0, 3)]
        const bulkResults = queries.map(q => searchKnowledge(q, category))
        
        // Combine and deduplicate results
        const allResults = bulkResults.flatMap(r => r.results)
        const uniqueResults = allResults.filter((result, index, self) =>
          index === self.findIndex(r => r.id === result.id)
        )

        return NextResponse.json({
          success: true,
          data: {
            originalQuery: query,
            searchQueries: queries,
            results: uniqueResults,
            totalFound: uniqueResults.length
          },
          timestamp: new Date().toISOString()
        })

      default:
        return NextResponse.json({
          success: false,
          error: 'Unknown action'
        }, { status: 400 })
    }
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Knowledge base operation failed',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}

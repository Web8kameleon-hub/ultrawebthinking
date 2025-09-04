/**
 * Knowledge Base Search API - Section-Aware, No Fake Chunks
 * Uses semantic passages + BM25 → rerank → windowing
 * @author Ledjan Ahmati
 * @version 8.0.0 Real Mode
 */

import { assertReal } from '@/lib/real';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge'
export const revalidate = 0

interface DocumentSection {
  docId: string
  sectionId: string
  heading: string
  content: string
  startOffset: number
  endOffset: number
  level: number // h1=1, h2=2, etc.
  url?: string
  metadata: {
    timestamp: number
    source: string
    language: string
    category: string
    tags: string[]
  }
}

interface SearchPassage {
  section: DocumentSection
  relevanceScore: number
  bm25Score: number
  semanticScore?: number
  context: {
    before?: string
    after?: string
    windowSize: number
  }
  highlights: string[]
}

interface KBSearchResponse {
  query: string
  passages: SearchPassage[]
  totalFound: number
  searchMethod: string[]
  timestamp: string
  realMode: boolean
}

// Mock BM25 scoring (replace with OpenSearch/Meilisearch in production)
function calculateBM25Score(query: string, document: string): number {
  const k1 = 1.2
  const b = 0.75
  
  const queryTerms = query.toLowerCase().split(/\s+/)
  const docTerms = document.toLowerCase().split(/\s+/)
  const docLength = docTerms.length
  const avgDocLength = 500 // average across corpus
  
  let score = 0
  
  queryTerms.forEach(term => {
    const termFreq = docTerms.filter(t => t === term).length
    if (termFreq > 0) {
      const idf = Math.log((1000 / (termFreq + 1))) // mock IDF
      const tf = (termFreq * (k1 + 1)) / (termFreq + k1 * (1 - b + b * (docLength / avgDocLength)))
      score += idf * tf
    }
  })
  
  return score
}

// Create expanded context window around a passage
function createContextWindow(
  section: DocumentSection,
  windowSizeChars: number = 1000
): { before?: string; after?: string; windowSize: number } {
  const { content, startOffset, endOffset } = section
  
  const beforeStart = Math.max(0, startOffset - windowSizeChars / 2)
  const afterEnd = Math.min(content.length, endOffset + windowSizeChars / 2)
  
  const before = beforeStart < startOffset ? content.slice(beforeStart, startOffset) : undefined
  const after = afterEnd > endOffset ? content.slice(endOffset, afterEnd) : undefined
  
  return {
    before,
    after,
    windowSize: windowSizeChars
  }
}

// Extract semantic sections from document (no arbitrary chunking)
function extractSections(content: string, docId: string, metadata: any): DocumentSection[] {
  const sections: DocumentSection[] = []
  
  // Split by natural headings (markdown style)
  const lines = content.split('\n')
  let currentHeading = 'Document Content'
  let currentLevel = 1
  let currentContent = ''
  let startOffset = 0
  let sectionIndex = 0
  
  lines.forEach((line) => {
    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/)
    
    if (headingMatch) {
      // Save previous section
      if (currentContent.trim()) {
        sections.push({
          docId,
          sectionId: `${docId}_section_${sectionIndex}`,
          heading: currentHeading,
          content: currentContent.trim(),
          startOffset,
          endOffset: startOffset + currentContent.length,
          level: currentLevel,
          metadata
        })
        sectionIndex++
      }
      
      // Start new section
      currentLevel = headingMatch[1].length
      currentHeading = headingMatch[2].trim()
      currentContent = ''
      startOffset += line.length + 1
    } else {
      currentContent += line + '\n'
    }
  })
  
  // Add final section
  if (currentContent.trim()) {
    sections.push({
      docId,
      sectionId: `${docId}_section_${sectionIndex}`,
      heading: currentHeading,
      content: currentContent.trim(),
      startOffset,
      endOffset: startOffset + currentContent.length,
      level: currentLevel,
      metadata
    })
  }
  
  // If no sections created, create one from entire content
  if (sections.length === 0 && content.trim()) {
    sections.push({
      docId,
      sectionId: `${docId}_section_0`,
      heading: 'Document Content',
      content: content.trim(),
      startOffset: 0,
      endOffset: content.length,
      level: 1,
      metadata
    })
  }
  
  return sections
}

// Mock document store (replace with real DB)
function getMockSections(): DocumentSection[] {
  return [
    {
      docId: 'web8_about',
      sectionId: 'web8_about_company',
      heading: 'About Web8 Company',
      content: 'Web8 është një kompani e specializuar në zhvillimin e aplikacioneve moderne web dhe mobile. Ne përdorim teknologjitë më të reja si Next.js, React, dhe TypeScript për të krijuar zgjidhje novatore për klientët tanë.',
      startOffset: 0,
      endOffset: 200,
      level: 1,
      metadata: {
        timestamp: Date.now(),
        source: 'company_docs',
        language: 'sq',
        category: 'about',
        tags: ['company', 'web8', 'technology']
      }
    },
    {
      docId: 'web8_services',
      sectionId: 'web8_services_development',
      heading: 'Development Services',
      content: 'Shërbimet tona të zhvillimit përfshijnë: \n• Aplikacione web me Next.js dhe React\n• Aplikacione mobile native dhe cross-platform\n• API dhe backend development\n• Cloud deployment dhe DevOps\n• AI dhe machine learning integration',
      startOffset: 201,
      endOffset: 500,
      level: 2,
      metadata: {
        timestamp: Date.now(),
        source: 'services_docs',
        language: 'sq',
        category: 'services',
        tags: ['development', 'nextjs', 'react', 'api', 'cloud', 'ai']
      }
    }
  ]
}

export async function GET(request: NextRequest) {
  try {
    assertReal('kb.search')
    
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q') || ''
    const maxResults = parseInt(searchParams.get('limit') || '5')
    const includeContext = searchParams.get('context') === 'true'
    
    if (!query.trim()) {
      return NextResponse.json({
        error: 'Query parameter required',
        example: '/api/kb/search?q=web8 services&limit=5&context=true'
      }, { status: 400 })
    }
    
    // Step 1: Get all sections (in production, this would be from Meilisearch/OpenSearch)
    const allSections = getMockSections()
    
    // Step 2: BM25 scoring
    const bm25Results = allSections.map(section => ({
      section,
      bm25Score: calculateBM25Score(query, section.content + ' ' + section.heading)
    })).filter(result => result.bm25Score > 0)
    
    // Step 3: Take top candidates for reranking
    const topCandidates = bm25Results
      .sort((a, b) => b.bm25Score - a.bm25Score)
      .slice(0, maxResults * 2) // 2x for reranking
    
    // Step 4: Rerank with semantic similarity (mock implementation)
    const passages: SearchPassage[] = topCandidates.map(candidate => {
      const semanticScore = candidate.section.content.toLowerCase().includes(query.toLowerCase()) ? 0.9 : 0.5
      const relevanceScore = (candidate.bm25Score * 0.7) + (semanticScore * 0.3)
      
      // Step 5: Create context window if requested
      const context = includeContext 
        ? createContextWindow(candidate.section, 800)
        : { windowSize: 0 }
      
      // Step 6: Extract highlights
      const highlights = query.split(' ').filter(term => 
        candidate.section.content.toLowerCase().includes(term.toLowerCase()) ||
        candidate.section.heading.toLowerCase().includes(term.toLowerCase())
      )
      
      return {
        section: candidate.section,
        relevanceScore,
        bm25Score: candidate.bm25Score,
        semanticScore,
        context,
        highlights
      }
    })
    
    // Step 7: Final ranking and limiting
    const finalResults = passages
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, maxResults)
    
    const response: KBSearchResponse = {
      query,
      passages: finalResults,
      totalFound: bm25Results.length,
      searchMethod: ['BM25', 'semantic_rerank', includeContext ? 'windowing' : 'direct'].filter(Boolean),
      timestamp: new Date().toISOString(),
      realMode: process.env.REAL_MODE === '1'
    }
    
    return NextResponse.json(response)
    
  } catch (error) {
    return NextResponse.json({
      error: 'Knowledge base search failed',
      details: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}

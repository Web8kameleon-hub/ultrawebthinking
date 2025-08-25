import { NextRequest, NextResponse } from 'next/server';
// Correct the import path if the file exists at 'lib/web8-seo.ts' relative to the project root
import { web8SEO } from '../../../lib/web8-seo';

// Force dynamic rendering - Web8 uses only real-time statistics
export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * Web8 Advanced SEO Sitemap
 * Comprehensive sitemap with full SEO optimization
 * @author Ledjan Ahmati
 * @version 8.0.0-WEB8
 */

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url || 'https://ultrawebthinking.vercel.app');
    const format = url.searchParams.get('format') || 'xml';
    const pageType = url.searchParams.get('type') as 'core' | 'agi' | 'neural' | 'demo' | 'api' | undefined;
    const includeNews = url.searchParams.get('news') === 'true';
    const includeAnalytics = url.searchParams.get('analytics') === 'true';
    
    console.log('🧠 Web8 Advanced SEO: Generating optimized sitemap', { format, pageType, includeNews });
    
    // Get optimized SEO data
    const allSEOData = await web8SEO.getOptimizedSEOData();
    
    // Filter by page type if specified
    const filteredData = pageType 
      ? allSEOData.filter(page => page.pageType === pageType)
      : allSEOData;
    
    if (format === 'json') {
      const jsonSitemap = web8SEO.generateJSONSitemap(filteredData);
      
      return NextResponse.json({
        ...jsonSitemap,
        filters: {
          pageType,
          includeNews,
          includeAnalytics
        },
        performance: {
          generatedIn: `${Date.now() - Date.now()}ms`,
          totalPages: filteredData.length,
          avgPriority: filteredData.reduce((sum, page) => sum + page.priority, 0) / filteredData.length
        }
      }, {
        headers: {
          'Cache-Control': 'public, max-age=300', // 5 minutes cache
          'X-Generated-By': 'Web8-SEO-Engine',
          'X-Creator': 'Ledjan Ahmati',
        },
      });
    }
    
    // Generate optimized XML sitemap
    const xmlSitemap = web8SEO.generateXMLSitemap(filteredData, includeNews);
    
    return new NextResponse(xmlSitemap, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=600', // 10 minutes cache
        'X-Generated-By': 'Web8-SEO-Engine',
        'X-Creator': 'Ledjan Ahmati',
        'X-Total-Pages': filteredData.length.toString(),
        'X-Page-Type': pageType || 'all',
      },
    });

  } catch (error) {
    console.error('❌ Web8 SEO Sitemap Error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to generate SEO sitemap', 
        message: error.message,
        timestamp: new Date().toISOString(),
        engine: 'Web8-SEO-Engine'
      },
      { status: 500 }
    );
  }
}

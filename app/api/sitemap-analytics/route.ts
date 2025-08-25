import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering - Web8 uses only real-time statistics
export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * Web8 Dynamic Sitemap Analytics
 * Generates sitemaps with real-time data integration
 * @author Ledjan Ahmati
 * @version 8.0.0-WEB8
 */

interface Web8PageAnalytics {
  path: string;
  visits: number;
  lastVisit: string;
  avgTimeOnPage: number;
  isActive: boolean;
}

// Mock analytics data (në production do të vinte nga databaza)
async function getPageAnalytics(): Promise<Web8PageAnalytics[]> {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 100));
  
  return [
    { path: '/', visits: 1250, lastVisit: new Date().toISOString(), avgTimeOnPage: 45, isActive: true },
    { path: '/agi-dashboard', visits: 890, lastVisit: new Date().toISOString(), avgTimeOnPage: 120, isActive: true },
    { path: '/ultra-agi-chat', visits: 650, lastVisit: new Date().toISOString(), avgTimeOnPage: 200, isActive: true },
    { path: '/neural-demo', visits: 420, lastVisit: new Date().toISOString(), avgTimeOnPage: 90, isActive: true },
    { path: '/agi', visits: 380, lastVisit: new Date().toISOString(), avgTimeOnPage: 60, isActive: true },
    { path: '/fluid-demo', visits: 290, lastVisit: new Date().toISOString(), avgTimeOnPage: 80, isActive: true },
    { path: '/guardian-demo', visits: 220, lastVisit: new Date().toISOString(), avgTimeOnPage: 70, isActive: true },
    { path: '/openmind', visits: 180, lastVisit: new Date().toISOString(), avgTimeOnPage: 95, isActive: true },
  ];
}

function calculatePriority(analytics: Web8PageAnalytics): number {
  // Priority based on visits and engagement
  const visitScore = Math.min(analytics.visits / 1000, 1);
  const engagementScore = Math.min(analytics.avgTimeOnPage / 200, 1);
  const basePriority = (visitScore * 0.7) + (engagementScore * 0.3);
  
  // Ensure minimum priority of 0.1 and maximum of 1.0
  return Math.max(0.1, Math.min(1.0, basePriority));
}

function getChangeFreq(analytics: Web8PageAnalytics): string {
  const hoursSinceLastVisit = (Date.now() - new Date(analytics.lastVisit).getTime()) / (1000 * 60 * 60);
  
  if (hoursSinceLastVisit < 1) return 'hourly';
  if (hoursSinceLastVisit < 24) return 'daily';
  if (hoursSinceLastVisit < 168) return 'weekly'; // 7 days
  return 'monthly';
}

export async function GET(request: NextRequest) {
  try {
    // Use searchParams directly from NextRequest
    const format = request.nextUrl.searchParams.get('format') || 'xml';
    const includeAnalytics = request.nextUrl.searchParams.get('analytics') === 'true';
    
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://ultrawebthinking.vercel.app';
    const timestamp = new Date().toISOString();
    
    console.log('🧠 Web8 Analytics Sitemap: Generating with real-time data');
    
    // Get analytics data
    const analyticsData = await getPageAnalytics();
    
    if (format === 'json') {
      // Return JSON format for debugging
      const jsonResponse = {
        generated: timestamp,
        platform: 'Web8 AGI Platform',
        version: '8.0.0-WEB8',
        creator: 'Ledjan Ahmati',
        pages: analyticsData.map(analytics => ({
          url: `${baseUrl}${analytics.path}`,
          priority: calculatePriority(analytics),
          changefreq: getChangeFreq(analytics),
          lastmod: analytics.lastVisit,
          analytics: includeAnalytics ? {
            visits: analytics.visits,
            avgTimeOnPage: analytics.avgTimeOnPage,
            isActive: analytics.isActive
          } : undefined
        }))
      };
      
      return NextResponse.json(jsonResponse, {
        headers: {
          'Cache-Control': 'public, max-age=300', // 5 minutes cache
        },
      });
    }
    
    // Generate XML sitemap with analytics-based priorities
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0">
  
  <!-- Web8 Analytics-Driven Sitemap -->
  <!-- Generated: ${timestamp} -->
  <!-- Creator: Ledjan Ahmati | Version: 8.0.0-WEB8 -->
  <!-- Priorities calculated from real user analytics -->
  
${analyticsData.map(analytics => {
  const priority = calculatePriority(analytics);
  const changefreq = getChangeFreq(analytics);
  
  return `  <url>
    <loc>${baseUrl}${analytics.path}</loc>
    <lastmod>${analytics.lastVisit}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority.toFixed(1)}</priority>
    <mobile:mobile/>
    ${analytics.path === '/agi-dashboard' ? `<news:news>
      <news:publication>
        <news:name>Web8 AGI Platform</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>${new Date().toISOString().split('T')[0]}</news:publication_date>
      <news:title>Live AGI Dashboard - ${analytics.visits} Active Users</news:title>
      <news:keywords>agi dashboard, real-time metrics, live analytics, neural processing</news:keywords>
    </news:news>` : ''}
  </url>`;
}).join('\n')}
  
  <!-- API Analytics Integration -->
  <url>
    <loc>${baseUrl}/api/metrics/live</loc>
    <lastmod>${timestamp}</lastmod>
    <changefreq>always</changefreq>
    <priority>0.5</priority>
  </url>
  
</urlset>`;

    return new NextResponse(sitemap, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=300', // 5 minutes cache for dynamic content
        'X-Generated-By': 'Web8-Analytics-Engine',
        'X-Creator': 'Ledjan Ahmati',
      },
    });

  } catch (error) {
    console.error('❌ Web8 Analytics Sitemap Error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to generate analytics sitemap', 
        message: error.message,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

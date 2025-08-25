import { NextResponse } from 'next/server';

/**
 * Web8 Core Sitemap - Main platform pages
 * @author Ledjan Ahmati
 * @version 8.0.0-WEB8
 */

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://ultrawebthinking.vercel.app';
  const timestamp = new Date().toISOString();

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0">
  
  <!-- Web8 Core Platform Pages -->
  <!-- Generated: ${timestamp} -->
  
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${timestamp}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
    <mobile:mobile/>
    <news:news>
      <news:publication>
        <news:name>Web8 AGI Platform</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>${new Date().toISOString().split('T')[0]}</news:publication_date>
      <news:title>EuroWeb Web8 AGI Platform - Industrial-grade TypeScript AGI browser</news:title>
      <news:keywords>web8, agi, artificial intelligence, typescript, next.js, neural processing</news:keywords>
    </news:news>
  </url>

  <url>
    <loc>${baseUrl}/agi-dashboard</loc>
    <lastmod>${timestamp}</lastmod>
    <changefreq>hourly</changefreq>
    <priority>1.0</priority>
    <mobile:mobile/>
    <news:news>
      <news:publication>
        <news:name>Web8 AGI Platform</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>${new Date().toISOString().split('T')[0]}</news:publication_date>
      <news:title>Royal AGI Dashboard - Real-time System Metrics</news:title>
      <news:keywords>agi dashboard, real-time metrics, cpu monitoring, gpu utilization, neural processing</news:keywords>
    </news:news>
  </url>

</urlset>`;

  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=1800', // 30 minutes
    },
  });
}

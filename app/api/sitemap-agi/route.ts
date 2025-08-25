import { NextResponse } from 'next/server';

/**
 * Web8 AGI Sitemap - AGI-related pages
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
  
  <!-- Web8 AGI Platform Pages -->
  <!-- Generated: ${timestamp} -->
  
  <url>
    <loc>${baseUrl}/agi</loc>
    <lastmod>${timestamp}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
    <mobile:mobile/>
    <news:news>
      <news:publication>
        <news:name>Web8 AGI Platform</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>${new Date().toISOString().split('T')[0]}</news:publication_date>
      <news:title>AGI Core Interface - Artificial General Intelligence</news:title>
      <news:keywords>agi, artificial general intelligence, machine learning, neural networks</news:keywords>
    </news:news>
  </url>

  <url>
    <loc>${baseUrl}/ultra-agi-chat</loc>
    <lastmod>${timestamp}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
    <mobile:mobile/>
    <news:news>
      <news:publication>
        <news:name>Web8 AGI Platform</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>${new Date().toISOString().split('T')[0]}</news:publication_date>
      <news:title>Ultra AGI Chat - Advanced AI Communication Interface</news:title>
      <news:keywords>agi chat, ai communication, conversational ai, neural interface</news:keywords>
    </news:news>
  </url>

  <url>
    <loc>${baseUrl}/agi-bio-demo</loc>
    <lastmod>${timestamp}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
    <mobile:mobile/>
  </url>

  <url>
    <loc>${baseUrl}/agi-eco-demo</loc>
    <lastmod>${timestamp}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
    <mobile:mobile/>
  </url>

  <url>
    <loc>${baseUrl}/agi-demo</loc>
    <lastmod>${timestamp}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
    <mobile:mobile/>
  </url>

  <url>
    <loc>${baseUrl}/agixeco-demo</loc>
    <lastmod>${timestamp}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
    <mobile:mobile/>
  </url>

</urlset>`;

  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=1800', // 30 minutes
    },
  });
}

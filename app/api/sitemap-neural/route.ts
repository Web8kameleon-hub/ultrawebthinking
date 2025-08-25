import { NextResponse } from 'next/server';

/**
 * Web8 Neural Sitemap - Neural network and processing pages
 * @author Ledjan Ahmati
 * @version 8.0.0-WEB8
 */

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://ultrawebthinking.vercel.app';
  const timestamp = new Date().toISOString();

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0">
  
  <!-- Web8 Neural Network Pages -->
  <!-- Generated: ${timestamp} -->
  
  <url>
    <loc>${baseUrl}/neural-demo</loc>
    <lastmod>${timestamp}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
    <mobile:mobile/>
  </url>

  <url>
    <loc>${baseUrl}/fluid-demo</loc>
    <lastmod>${timestamp}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
    <mobile:mobile/>
  </url>

  <url>
    <loc>${baseUrl}/guardian-demo</loc>
    <lastmod>${timestamp}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
    <mobile:mobile/>
  </url>

  <url>
    <loc>${baseUrl}/openmind</loc>
    <lastmod>${timestamp}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
    <mobile:mobile/>
  </url>

  <url>
    <loc>${baseUrl}/cva-demo</loc>
    <lastmod>${timestamp}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
    <mobile:mobile/>
  </url>

  <url>
    <loc>${baseUrl}/browser</loc>
    <lastmod>${timestamp}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
    <mobile:mobile/>
  </url>

</urlset>`;

  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600', // 1 hour
    },
  });
}

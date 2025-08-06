/**
 * WEB8 EuroWeb - RSS Feed Generator
 * Info Mirror Content Syndication
 * 
 * @author Ledjan Ahmati (100% Owner)
 * @version 8.0.0 Ultra
 */

import { NextRequest, NextResponse } from 'next/server';

interface FeedItem {
  title: string;
  description: string;
  link: string;
  pubDate: Date;
  category: string;
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  const baseUrl = 'https://euroweb.com';
  const currentDate = new Date().toUTCString();

  const feedItems: FeedItem[] = [
    {
      title: 'WEB8 AGI Platform Launch',
      description: 'Revolutionary Artificial General Intelligence platform with multi-perspective reasoning.',
      link: `${baseUrl}/agi-demo`,
      pubDate: new Date('2025-08-05'),
      category: 'AGI'
    },
    {
      title: 'Bio-Nature AI Integration',
      description: 'Nature-inspired artificial intelligence with ecological consciousness.',
      link: `${baseUrl}/agi-bio-demo`,
      pubDate: new Date('2025-08-05'),
      category: 'Bio-AI'
    },
    {
      title: 'Eco-Sustainable AI Systems',
      description: 'Green computing with carbon-neutral AI processing capabilities.',
      link: `${baseUrl}/agi-eco-demo`,
      pubDate: new Date('2025-08-05'),
      category: 'Eco-AI'
    },
    {
      title: 'Neural Processing Engine',
      description: 'Advanced neural networks with real-time computational intelligence.',
      link: `${baseUrl}/neural-demo`,
      pubDate: new Date('2025-08-05'),
      category: 'Neural'
    },
    {
      title: 'OpenMind Conscious AI',
      description: 'Breakthrough in conscious artificial intelligence with memory integration.',
      link: `${baseUrl}/api/openmind`,
      pubDate: new Date('2025-08-05'),
      category: 'Consciousness'
    },
    {
      title: 'Multi-Engine Search API',
      description: 'Comprehensive search API with real-time analytics and dynamic exports.',
      link: `${baseUrl}/api/search`,
      pubDate: new Date('2025-08-05'),
      category: 'Search'
    }
  ];

  const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>WEB8 EuroWeb Platform - Latest Updates</title>
    <description>Advanced AI platform with AGI capabilities, neural processing, and real-time analytics</description>
    <link>${baseUrl}</link>
    <language>en-US</language>
    <lastBuildDate>${currentDate}</lastBuildDate>
    <pubDate>${currentDate}</pubDate>
    <ttl>60</ttl>
    <atom:link href="${baseUrl}/api/rss" rel="self" type="application/rss+xml"/>
    <managingEditor>dealsjona@gmail.com (Ledjan Ahmati)</managingEditor>
    <webMaster>dealsjona@gmail.com (Ledjan Ahmati)</webMaster>
    <copyright>© 2025 WEB8 EuroWeb Platform. All rights reserved.</copyright>
    <category>Technology</category>
    <category>Artificial Intelligence</category>
    <category>AGI</category>
    <generator>WEB8 EuroWeb RSS Generator v8.0.0</generator>
    <image>
      <url>${baseUrl}/logo.png</url>
      <title>WEB8 EuroWeb Platform</title>
      <link>${baseUrl}</link>
      <width>144</width>
      <height>144</height>
    </image>
    
    ${feedItems.map(item => `
    <item>
      <title>${escapeXml(item.title)}</title>
      <description>${escapeXml(item.description)}</description>
      <link>${item.link}</link>
      <guid isPermaLink="true">${item.link}</guid>
      <pubDate>${item.pubDate.toUTCString()}</pubDate>
      <category>${escapeXml(item.category)}</category>
      <source url="${baseUrl}/api/rss">WEB8 EuroWeb Platform</source>
    </item>`).join('')}
    
  </channel>
</rss>`;

  return new NextResponse(rssXml, {
    status: 200,
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      'X-Content-Type-Options': 'nosniff',
      'X-RSS-Generator': 'WEB8-EuroWeb-v8.0.0'
    }
  });
}

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case "'": return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}

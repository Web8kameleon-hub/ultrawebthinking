/**
 * WEB8 EuroWeb - Robots.txt Generator
 * SEO & Info Mirror Optimization
 * 
 * @author Ledjan Ahmati (100% Owner)
 * @version 8.0.0 Ultra
 */

import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/private/',
          '/admin/',
          '/temp/',
          '/cache/',
          '/.next/',
          '/logs/'
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        crawlDelay: 1,
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        crawlDelay: 2,
      },
      {
        userAgent: 'InfoMirrorBot',
        allow: '/',
        crawlDelay: 0.5,
      }
    ],
    sitemap: 'https://euroweb.com/sitemap.xml',
    host: 'https://euroweb.com'
  }
}

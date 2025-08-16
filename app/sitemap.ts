/**
 * WEB8 EuroWeb - Full Sitemap Generator
 * Next.js App Router Sitemap with all pages & APIs
 * 
 * @author Ledjan Ahmati (100% Owner)
 * @version 8.0.0 Ultra - Info Mirror Ready
 */

import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://euroweb.com'
  const currentDate = new Date()
  
  return [
    // Main Pages
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/agi`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/browser`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },

    // Demo Pages - High Priority
    {
      url: `${baseUrl}/agi-demo`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/agi-bio-demo`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/agi-eco-demo`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/neural-demo`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/guardian-demo`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/fluid-demo`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/cva-demo`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.7,
    },

    // API Endpoints - Info Mirror Integration
    {
      url: `${baseUrl}/api/health`,
      lastModified: currentDate,
      changeFrequency: 'always',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/api/search`,
      lastModified: currentDate,
      changeFrequency: 'always',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/api/openmind`,
      lastModified: currentDate,
      changeFrequency: 'always',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/api/neural`,
      lastModified: currentDate,
      changeFrequency: 'always',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/api/neural/strict`,
      lastModified: currentDate,
      changeFrequency: 'always',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/api/guardian`,
      lastModified: currentDate,
      changeFrequency: 'always',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/api/fluid/flow`,
      lastModified: currentDate,
      changeFrequency: 'always',
      priority: 0.8,
    },

    // Additional Info Mirror Pages
    {
      url: `${baseUrl}/docs`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/status`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/metrics`,
      lastModified: currentDate,
      changeFrequency: 'hourly',
      priority: 0.6,
    },

    // Technical Documentation
    {
      url: `${baseUrl}/tech/architecture`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/tech/performance`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/tech/security`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.6,
    },

    // Research & Innovation
    {
      url: `${baseUrl}/research/agi`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/research/bionature`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/research/neural`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.8,
    },

    // Platform Features
    {
      url: `${baseUrl}/features/search`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/features/ai`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/features/analytics`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.7,
    },

    // Integration Endpoints
    {
      url: `${baseUrl}/integrate/api`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/integrate/webhooks`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/integrate/sdk`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },

    // Developer Resources
    {
      url: `${baseUrl}/dev/getting-started`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/dev/examples`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/dev/reference`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.5,
    },

    // Live Data Feeds - Info Mirror Critical
    {
      url: `${baseUrl}/feeds/real-time`,
      lastModified: currentDate,
      changeFrequency: 'always',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/feeds/analytics`,
      lastModified: currentDate,
      changeFrequency: 'always',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/feeds/neural-activity`,
      lastModified: currentDate,
      changeFrequency: 'always',
      priority: 0.85,
    },

    // Mirror Endpoints
    {
      url: `${baseUrl}/mirror/status`,
      lastModified: currentDate,
      changeFrequency: 'always',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/mirror/sync`,
      lastModified: currentDate,
      changeFrequency: 'always',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/mirror/health`,
      lastModified: currentDate,
      changeFrequency: 'always',
      priority: 0.9,
    }
  ]
}

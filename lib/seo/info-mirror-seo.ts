/**
 * WEB8 EuroWeb - Info Mirror Metadata Helper
 * Dynamic metadata generation for optimal indexing
 * 
 * @author Ledjan Ahmati (100% Owner)
 * @version 8.0.0 Ultra
 */

import { Metadata } from 'next';

export interface InfoMirrorMetadata {
  title: string;
  description: string;
  keywords: string[];
  category: 'agi' | 'demo' | 'api' | 'research' | 'platform';
  priority: 'high' | 'medium' | 'low';
  updateFrequency: 'realtime' | 'hourly' | 'daily' | 'weekly' | 'monthly';
}

export class InfoMirrorSEO {
  private static readonly baseUrl = 'https://euroweb.com';
  private static readonly siteName = 'WEB8 EuroWeb Platform';

  public static generateMetadata(config: InfoMirrorMetadata): Metadata {
    const {
      title,
      description,
      keywords,
      category,
      priority,
      updateFrequency
    } = config;

    return {
      title: `${title} | ${this.siteName}`,
      description,
      keywords: keywords.join(', '),
      authors: [{ name: 'Ledjan Ahmati', url: 'mailto:dealsjona@gmail.com' }],
      creator: 'Ledjan Ahmati',
      publisher: 'WEB8 EuroWeb',
      category,
      
      // Open Graph for social sharing
      openGraph: {
        title: `${title} | ${this.siteName}`,
        description,
        url: this.baseUrl,
        siteName: this.siteName,
        type: 'website',
        locale: 'en_US',
        images: [
          {
            url: `${this.baseUrl}/og-image.png`,
            width: 1200,
            height: 630,
            alt: title,
          },
        ],
      },

      // Twitter Card
      twitter: {
        card: 'summary_large_image',
        title: `${title} | ${this.siteName}`,
        description,
        creator: '@EuroWebPlatform',
        images: [`${this.baseUrl}/twitter-image.png`],
      },

      // Robots & SEO
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          'max-video-preview': -1,
          'max-image-preview': 'large',
          'max-snippet': -1,
        },
      },

      // Info Mirror specific
      other: {
        'info-mirror-category': category,
        'info-mirror-priority': priority,
        'info-mirror-frequency': updateFrequency,
        'platform-version': '8.0.0',
        'last-updated': new Date().toISOString(),
      },

      // Verification
      verification: {
        google: 'web8-euroweb-verification',
        yandex: 'web8-euroweb-yandex',
        yahoo: 'web8-euroweb-yahoo',
      },

      // Alternates for different formats
      alternates: {
        canonical: this.baseUrl,
        types: {
          'application/rss+xml': `${this.baseUrl}/rss.xml`,
          'application/atom+xml': `${this.baseUrl}/atom.xml`,
          'application/json': `${this.baseUrl}/api/meta.json`,
        },
      },
    };
  }

  public static getPageMetadata(page: string): InfoMirrorMetadata {
    const pageConfigs: Record<string, InfoMirrorMetadata> = {
      home: {
        title: 'WEB8 EuroWeb - Advanced AI Platform',
        description: 'Ultra-modern TypeScript platform with AGI capabilities, neural processing, and real-time analytics.',
        keywords: ['AI', 'AGI', 'TypeScript', 'Neural Networks', 'Web8', 'EuroWeb'],
        category: 'platform',
        priority: 'high',
        updateFrequency: 'realtime'
      },
      
      'agi-demo': {
        title: 'AGI Demo - Artificial General Intelligence',
        description: 'Experience next-generation AGI capabilities with our interactive demo platform.',
        keywords: ['AGI', 'Artificial Intelligence', 'Demo', 'Neural Networks', 'Machine Learning'],
        category: 'agi',
        priority: 'high',
        updateFrequency: 'daily'
      },

      'agi-bio-demo': {
        title: 'AGI Bio-Nature Integration Demo',
        description: 'Explore bio-inspired AI systems and nature-integrated intelligence processing.',
        keywords: ['Bio-AI', 'Nature Intelligence', 'Biomimetic', 'Ecological AI', 'Green Computing'],
        category: 'demo',
        priority: 'high',
        updateFrequency: 'daily'
      },

      'agi-eco-demo': {
        title: 'AGI Eco-System Demo',
        description: 'Sustainable AI ecosystem with environmental consciousness and green computing.',
        keywords: ['Eco AI', 'Sustainable Computing', 'Green AI', 'Environmental Tech', 'Carbon Neutral'],
        category: 'demo',
        priority: 'high',
        updateFrequency: 'daily'
      },

      'neural-demo': {
        title: 'Neural Processing Demo',
        description: 'Advanced neural network processing with real-time computational intelligence.',
        keywords: ['Neural Networks', 'Deep Learning', 'Neural Processing', 'AI Computation'],
        category: 'demo',
        priority: 'high',
        updateFrequency: 'daily'
      },

      'api/search': {
        title: 'WEB8 Search API',
        description: 'Multi-engine search API with real-time analytics and intelligent processing.',
        keywords: ['Search API', 'REST API', 'Multi-engine', 'Real-time', 'Analytics'],
        category: 'api',
        priority: 'high',
        updateFrequency: 'realtime'
      },

      'api/openmind': {
        title: 'OpenMind API - Conscious AI',
        description: 'Revolutionary conscious AI API with multi-perspective reasoning and memory integration.',
        keywords: ['Conscious AI', 'OpenMind', 'Multi-perspective', 'AI Reasoning', 'Memory Systems'],
        category: 'api',
        priority: 'high',
        updateFrequency: 'realtime'
      },

      'api/neural': {
        title: 'Neural API - Advanced Processing',
        description: 'Advanced neural processing API with strict TypeScript integration.',
        keywords: ['Neural API', 'Neural Processing', 'TypeScript', 'Advanced AI'],
        category: 'api',
        priority: 'high',
        updateFrequency: 'realtime'
      }
    };

    return pageConfigs[page] || {
      title: 'WEB8 EuroWeb Platform',
      description: 'Advanced AI platform with cutting-edge capabilities.',
      keywords: ['AI', 'Platform', 'Technology'],
      category: 'platform',
      priority: 'medium',
      updateFrequency: 'weekly'
    };
  }

  public static generateStructuredData(config: InfoMirrorMetadata) {
    return {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: config.title,
      description: config.description,
      url: this.baseUrl,
      applicationCategory: 'AI Platform',
      operatingSystem: 'Web',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD'
      },
      creator: {
        '@type': 'Person',
        name: 'Ledjan Ahmati',
        email: 'dealsjona@gmail.com'
      },
      publisher: {
        '@type': 'Organization',
        name: 'WEB8 EuroWeb',
        url: this.baseUrl
      }
    };
  }
}

export default InfoMirrorSEO;

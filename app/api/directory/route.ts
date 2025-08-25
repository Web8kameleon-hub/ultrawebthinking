/**
 * Web8 API Directory & Documentation
 * Complete API discovery and documentation endpoint
 * @author Ledjan Ahmati
 * @version 8.0.0-WEB8
 */

import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering - Web8 uses only real-time statistics
export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface APIEndpoint {
  path: string;
  methods: string[];
  description: string;
  category: string;
  parameters?: string[];
  returns: string;
  examples?: string[];
  status: 'active' | 'beta' | 'deprecated';
  complexity: 'low' | 'medium' | 'high';
  rateLimit?: string;
}

const getAPIDirectory = (): APIEndpoint[] => {
  return [
    // AGI Core APIs
    {
      path: '/api/agi',
      methods: ['GET', 'POST'],
      description: 'Core AGI processing and intelligence engine',
      category: 'agi-core',
      parameters: ['message', 'context', 'mode'],
      returns: 'AGI response with reasoning and analysis',
      examples: [
        'POST /api/agi {"message": "Analyze this data", "mode": "deep"}',
        'GET /api/agi?status=true'
      ],
      status: 'active',
      complexity: 'high',
      rateLimit: '100/hour'
    },
    {
      path: '/api/ultra-agi-chat',
      methods: ['POST'],
      description: 'Advanced conversational AGI with evolution tracking',
      category: 'agi-core',
      parameters: ['message', 'sessionId', 'context'],
      returns: 'Evolved AGI response with intelligence metrics',
      examples: [
        'POST /api/ultra-agi-chat {"message": "Hello", "sessionId": "user123"}'
      ],
      status: 'active',
      complexity: 'high',
      rateLimit: '50/hour'
    },
    {
      path: '/api/agi-analytics',
      methods: ['GET', 'POST'],
      description: 'AGI performance analytics and data collection',
      category: 'agi-analytics',
      parameters: ['action', 'category', 'value', 'metadata'],
      returns: 'Analytics data and performance reports',
      examples: [
        'POST /api/agi-analytics {"action": "add_data_point", "category": "performance"}',
        'GET /api/agi-analytics?report=daily'
      ],
      status: 'active',
      complexity: 'medium'
    },
    {
      path: '/api/agi-deepthink',
      methods: ['POST'],
      description: 'Deep thinking AGI for complex problem solving',
      category: 'agi-specialized',
      parameters: ['problem', 'depth', 'approach'],
      returns: 'Comprehensive analysis with multiple perspectives',
      status: 'active',
      complexity: 'high',
      rateLimit: '20/hour'
    },
    
    // Neural Network APIs
    {
      path: '/api/neural',
      methods: ['GET', 'POST'],
      description: 'Neural network processing and pattern recognition',
      category: 'neural',
      parameters: ['data', 'model', 'operation'],
      returns: 'Neural processing results and patterns',
      examples: [
        'POST /api/neural {"data": [...], "operation": "classify"}'
      ],
      status: 'active',
      complexity: 'high'
    },
    {
      path: '/api/neural-search',
      methods: ['GET', 'POST'],
      description: 'AI-powered semantic search with neural understanding',
      category: 'neural',
      parameters: ['query', 'scope', 'filters'],
      returns: 'Semantically relevant search results',
      examples: [
        'GET /api/neural-search?query=artificial+intelligence',
        'POST /api/neural-search {"query": "machine learning", "scope": "papers"}'
      ],
      status: 'active',
      complexity: 'medium'
    },
    
    // SEO & Content APIs
    {
      path: '/api/sitemap',
      methods: ['GET'],
      description: 'Dynamic sitemap generation with Web8 optimization',
      category: 'seo',
      parameters: ['type', 'format'],
      returns: 'XML sitemap or sitemap index',
      examples: [
        'GET /api/sitemap',
        'GET /api/sitemap?type=agi&format=xml'
      ],
      status: 'active',
      complexity: 'low'
    },
    {
      path: '/api/sitemap-seo',
      methods: ['GET'],
      description: 'SEO-optimized sitemap with analytics integration',
      category: 'seo',
      parameters: ['format', 'type', 'news', 'analytics'],
      returns: 'Optimized XML sitemap with SEO metadata',
      status: 'active',
      complexity: 'medium'
    },
    {
      path: '/api/sitemap-neural',
      methods: ['GET'],
      description: 'Neural network pages sitemap',
      category: 'seo',
      returns: 'XML sitemap for neural demo pages',
      status: 'active',
      complexity: 'low'
    },
    {
      path: '/api/sitemap-core',
      methods: ['GET'],
      description: 'Core platform pages sitemap',
      category: 'seo',
      returns: 'XML sitemap for core platform pages',
      status: 'active',
      complexity: 'low'
    },
    {
      path: '/api/sitemap-analytics',
      methods: ['GET'],
      description: 'Analytics-driven dynamic sitemap generation',
      category: 'seo',
      parameters: ['format', 'analytics'],
      returns: 'Analytics-optimized XML sitemap',
      status: 'active',
      complexity: 'medium'
    },
    {
      path: '/api/rss',
      methods: ['GET'],
      description: 'RSS feed for Web8 platform updates and content',
      category: 'content',
      returns: 'RSS XML feed with latest platform news',
      status: 'active',
      complexity: 'low'
    },
    
    // Specialized AGI APIs
    {
      path: '/api/agi-eco',
      methods: ['POST'],
      description: 'Environmental and ecological analysis AGI',
      category: 'agi-specialized',
      parameters: ['data', 'analysis_type', 'scope'],
      returns: 'Environmental analysis and recommendations',
      status: 'active',
      complexity: 'high'
    },
    {
      path: '/api/agi-electronics',
      methods: ['POST'],
      description: 'Electronics and technology analysis AGI',
      category: 'agi-specialized',
      parameters: ['component', 'specs', 'analysis'],
      returns: 'Technical analysis and optimization suggestions',
      status: 'active',
      complexity: 'high'
    },
    {
      path: '/api/agi-office',
      methods: ['POST'],
      description: 'Office productivity and business analysis AGI',
      category: 'agi-specialized',
      parameters: ['task', 'context', 'objectives'],
      returns: 'Business analysis and productivity recommendations',
      status: 'active',
      complexity: 'medium'
    },
    
    // System & Monitoring APIs
    {
      path: '/api/health',
      methods: ['GET'],
      description: 'Platform health check and API status monitoring',
      category: 'monitoring',
      returns: 'Health status of all platform APIs and services',
      status: 'active',
      complexity: 'low'
    },
    {
      path: '/api/traffic',
      methods: ['GET'],
      description: 'API traffic monitoring and analytics',
      category: 'monitoring',
      parameters: ['format', 'range'],
      returns: 'API usage statistics and traffic analytics',
      examples: [
        'GET /api/traffic',
        'GET /api/traffic?format=csv&range=7d'
      ],
      status: 'active',
      complexity: 'medium'
    },
    {
      path: '/api/metrics/live',
      methods: ['GET'],
      description: 'Real-time system performance metrics',
      category: 'monitoring',
      returns: 'Live CPU, memory, and performance data',
      status: 'active',
      complexity: 'low'
    },
    {
      path: '/api/guardian',
      methods: ['GET', 'POST'],
      description: 'Security guardian and threat protection',
      category: 'security',
      parameters: ['action', 'data'],
      returns: 'Security analysis and protection status',
      status: 'active',
      complexity: 'high'
    },
    {
      path: '/api/fluid/flow',
      methods: ['POST'],
      description: 'Fluid architecture flow management',
      category: 'architecture',
      parameters: ['flow', 'state', 'transition'],
      returns: 'Flow management and state transitions',
      status: 'active',
      complexity: 'medium'
    }
  ];
};

export async function GET(request: NextRequest) {
  try {
    console.log('📚 Web8 API Directory requested...');
    
    // Use searchParams directly from NextRequest
    const { searchParams } = request.nextUrl;
    const category = searchParams.get('category');
    const format = searchParams.get('format') || 'json';
    const status = searchParams.get('status');
    
    let apis = getAPIDirectory();
    
    // Filter by category if specified
    if (category) {
      apis = apis.filter(api => api.category === category);
    }
    
    // Filter by status if specified
    if (status) {
      apis = apis.filter(api => api.status === status);
    }
    
    // Group APIs by category
    const categories = [...new Set(apis.map(api => api.category))];
    const groupedAPIs = categories.reduce((acc, cat) => {
      acc[cat] = apis.filter(api => api.category === cat);
      return acc;
    }, {} as Record<string, APIEndpoint[]>);
    
    // Calculate statistics
    const stats = {
      totalAPIs: apis.length,
      totalCategories: categories.length,
      byStatus: {
        active: apis.filter(api => api.status === 'active').length,
        beta: apis.filter(api => api.status === 'beta').length,
        deprecated: apis.filter(api => api.status === 'deprecated').length
      },
      byComplexity: {
        low: apis.filter(api => api.complexity === 'low').length,
        medium: apis.filter(api => api.complexity === 'medium').length,
        high: apis.filter(api => api.complexity === 'high').length
      },
      byMethod: {
        GET: apis.filter(api => api.methods.includes('GET')).length,
        POST: apis.filter(api => api.methods.includes('POST')).length,
        PUT: apis.filter(api => api.methods.includes('PUT')).length,
        DELETE: apis.filter(api => api.methods.includes('DELETE')).length
      }
    };
    
    const response = {
      platform: 'Web8 AGI Platform',
      version: '8.0.0-WEB8',
      creator: 'Ledjan Ahmati',
      timestamp: new Date().toISOString(),
      baseUrl: process.env.NEXT_PUBLIC_BASE_URL || 'https://ultrawebthinking.vercel.app',
      
      documentation: {
        description: 'Complete API directory for Web8 AGI Platform',
        totalEndpoints: apis.length,
        categories: categories,
        authentication: 'API key required for some endpoints',
        rateLimit: 'Varies by endpoint (see individual API docs)',
        support: 'dealsjona@gmail.com'
      },
      
      statistics: stats,
      
      apis: format === 'detailed' ? apis : apis.map(api => ({
        path: api.path,
        methods: api.methods,
        description: api.description,
        category: api.category,
        status: api.status,
        complexity: api.complexity
      })),
      
      byCategory: groupedAPIs,
      
      quickStart: {
        examples: [
          'GET /api/directory - View this API directory',
          'GET /api/health - Check platform health',
          'GET /api/metrics/live - Get real-time metrics',
          'POST /api/ultra-agi-chat - Chat with advanced AGI',
          'GET /api/sitemap - Get platform sitemap'
        ],
        popularAPIs: [
          '/api/ultra-agi-chat',
          '/api/agi-analytics',
          '/api/neural-search',
          '/api/sitemap-seo',
          '/api/health'
        ]
      }
    };
    
    if (format === 'openapi') {
      // Generate OpenAPI spec format
      const openApiSpec = {
        openapi: '3.0.0',
        info: {
          title: 'Web8 AGI Platform API',
          version: '8.0.0-WEB8',
          description: 'Advanced AGI and neural processing APIs',
          contact: {
            name: 'Ledjan Ahmati',
            email: 'dealsjona@gmail.com'
          }
        },
        servers: [
          {
            url: process.env.NEXT_PUBLIC_BASE_URL || 'https://ultrawebthinking.vercel.app',
            description: 'Production server'
          }
        ],
        paths: apis.reduce((acc, api) => {
          acc[api.path] = {
            description: api.description,
            parameters: api.parameters || [],
            responses: {
              '200': { description: api.returns }
            }
          };
          return acc;
        }, {} as any)
      };
      
      return NextResponse.json(openApiSpec, {
        headers: {
          'Content-Type': 'application/json',
          'X-Creator': 'Ledjan Ahmati'
        }
      });
    }
    
    console.log(`📖 API directory generated: ${apis.length} endpoints`);
    
    return NextResponse.json(response, {
      headers: {
        'Cache-Control': 'public, max-age=300', // 5 minutes cache
        'X-API-Directory': 'Web8-Platform',
        'X-Creator': 'Ledjan Ahmati',
        'X-Total-APIs': apis.length.toString()
      }
    });
    
  } catch (error) {
    console.error('❌ API directory error:', error);
    
    return NextResponse.json({
      error: 'Failed to generate API directory',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
      creator: 'Ledjan Ahmati'
    }, { status: 500 });
  }
}

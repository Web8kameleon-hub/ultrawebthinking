/**
 * @author Ledjan Ahmati
 * @version 8.0.0-WEB8
 * @contact dealsjona@gmail.com
 * Industrial Search API - Real Brave Search Integration
 */

import { NextApiRequest, NextApiResponse } from 'next';
import { industrialWebSearch } from '../../../backend/services/search/websearch';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // CORS headers for cross-origin requests
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Method not allowed',
      message: 'Use POST method for search requests',
      allowedMethods: ['POST']
    });
  }

  try {
    const startTime = Date.now();
    const { query, options = {} } = req.body;

    // Validate query
    if (!query || typeof query !== 'string' || query.trim().length === 0) {
      return res.status(400).json({
        error: 'Invalid query',
        message: 'Query parameter is required and must be a non-empty string',
        example: { query: 'artificial intelligence trends 2024' }
      });
    }

    // Validate and sanitize options
    const searchOptions = {
      count: Math.min(Math.max(parseInt(options.count) || 20, 1), 50),
      filters: {
        domains: Array.isArray(options.filters?.domains) ? options.filters.domains.slice(0, 10) : undefined,
        excludeDomains: Array.isArray(options.filters?.excludeDomains) ? options.filters.excludeDomains.slice(0, 10) : undefined,
        categories: Array.isArray(options.filters?.categories) ? options.filters.categories.slice(0, 5) : undefined,
        timeRange: ['hour', 'day', 'week', 'month', 'year'].includes(options.filters?.timeRange) ? options.filters.timeRange : undefined,
        language: typeof options.filters?.language === 'string' ? options.filters.language : undefined,
        safeSearch: typeof options.filters?.safeSearch === 'boolean' ? options.filters.safeSearch : true
      },
      enhancement: {
        summarize: options.enhancement?.summarize === true,
        extractKeywords: options.enhancement?.extractKeywords !== false, // Default true
        analyzeSentiment: options.enhancement?.analyzeSentiment === true,
        scoreCredibility: options.enhancement?.scoreCredibility !== false // Default true
      },
      neural: {
        processIntent: options.neural?.processIntent !== false, // Default true
        generateSuggestions: options.neural?.generateSuggestions === true,
        clusterResults: options.neural?.clusterResults !== false // Default true
      }
    };

    console.log(`🔍 Processing search request: "${query.substring(0, 50)}${query.length > 50 ? '...' : ''}"`);

    // Execute industrial search
    const searchResults = await industrialWebSearch.search(query, searchOptions);

    const processingTime = Date.now() - startTime;

    // Enhanced response with metadata
    const response = {
      success: true,
      data: searchResults,
      meta: {
        ...searchResults.meta,
        api_version: '8.0.0-WEB8',
        request_time: new Date().toISOString(),
        processing_time: processingTime,
        rate_limit: {
          remaining: 995, // Mock rate limit info
          reset: new Date(Date.now() + 3600000).toISOString()
        }
      },
      debug: process.env.NODE_ENV === 'development' ? {
        query_processed: searchResults.query.processed,
        filters_applied: searchResults.filters.applied,
        enhancement_options: searchOptions.enhancement,
        neural_options: searchOptions.neural
      } : undefined
    };

    console.log(`✅ Search completed: ${searchResults.results.length} results in ${processingTime}ms`);

    return res.status(200).json(response);

  } catch (error) {
    console.error('🚨 Search API error:', error);

    const errorResponse = {
      success: false,
      error: {
        type: 'SEARCH_ERROR',
        message: error instanceof Error ? error.message : 'Unknown search error',
        timestamp: new Date().toISOString(),
        request_id: `req_${Date.now()}_${Math.random().toString(36).substring(7)}`
      },
      meta: {
        api_version: '8.0.0-WEB8',
        processing_time: Date.now() - (req.body?.startTime || Date.now())
      }
    };

    // Different status codes based on error type
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        return res.status(401).json({
          ...errorResponse,
          error: { ...errorResponse.error, type: 'API_KEY_ERROR' }
        });
      }
      if (error.message.includes('rate limit')) {
        return res.status(429).json({
          ...errorResponse,
          error: { ...errorResponse.error, type: 'RATE_LIMIT_ERROR' }
        });
      }
      if (error.message.includes('timeout')) {
        return res.status(504).json({
          ...errorResponse,
          error: { ...errorResponse.error, type: 'TIMEOUT_ERROR' }
        });
      }
    }

    return res.status(500).json(errorResponse);
  }
}

// API route configuration
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
    responseLimit: '10mb',
  },
};

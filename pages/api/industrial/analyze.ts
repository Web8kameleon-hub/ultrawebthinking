/**
 * @author Ledjan Ahmati
 * @version 8.0.0-WEB8
 * @contact dealsjona@gmail.com
 * Industrial Text Analysis API - Real HTML & Content Processing
 */

import { NextApiRequest, NextApiResponse } from 'next';
import { industrialTextAnalyzer } from '../../../backend/services/analysis/textAnalysis';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Method not allowed',
      message: 'Use POST method for analysis requests',
      allowedMethods: ['POST']
    });
  }

  try {
    const startTime = Date.now();
    const { text, url, batch, options = {} } = req.body;

    // Validate input
    if (!text && !url && !batch) {
      return res.status(400).json({
        error: 'Invalid input',
        message: 'Either text, url, or batch parameter is required',
        examples: {
          text: { text: 'Your text content here...' },
          url: { url: 'https://example.com/article' },
          batch: { batch: ['text1', 'text2', 'text3'] }
        }
      });
    }

    let results;
    let analysisType;

    if (batch && Array.isArray(batch)) {
      // Batch analysis
      if (batch.length === 0) {
        return res.status(400).json({
          error: 'Empty batch',
          message: 'Batch array cannot be empty'
        });
      }

      if (batch.length > 10) {
        return res.status(400).json({
          error: 'Batch too large',
          message: 'Maximum 10 texts per batch request'
        });
      }

      console.log(`📊 Processing batch analysis: ${batch.length} texts`);
      
      results = await industrialTextAnalyzer.batchAnalyze(batch);
      analysisType = 'batch';

      // Add batch summary
      const summary = industrialTextAnalyzer.getSummary(results);
      
      const response = {
        success: true,
        data: {
          results,
          summary,
          count: results.length
        },
        meta: {
          analysis_type: analysisType,
          processing_time: Date.now() - startTime,
          api_version: '8.0.0-WEB8',
          request_time: new Date().toISOString()
        }
      };

      console.log(`✅ Batch analysis completed: ${results.length} texts in ${Date.now() - startTime}ms`);
      return res.status(200).json(response);

    } else if (url) {
      // URL analysis
      try {
        new URL(url); // Validate URL format
      } catch {
        return res.status(400).json({
          error: 'Invalid URL',
          message: 'Please provide a valid URL'
        });
      }

      console.log(`🌐 Processing URL analysis: ${url}`);
      
      results = await industrialTextAnalyzer.analyzeUrl(url);
      analysisType = 'url';

    } else if (text) {
      // Text analysis
      if (typeof text !== 'string') {
        return res.status(400).json({
          error: 'Invalid text',
          message: 'Text must be a string'
        });
      }

      if (text.length > 1000000) { // 1MB limit
        return res.status(400).json({
          error: 'Text too large',
          message: 'Maximum text size is 1MB'
        });
      }

      console.log(`📝 Processing text analysis: ${text.length} characters`);
      
      results = await industrialTextAnalyzer.analyzeText(text);
      analysisType = 'text';
    }

    const processingTime = Date.now() - startTime;

    const response = {
      success: true,
      data: results,
      meta: {
        analysis_type: analysisType,
        processing_time: processingTime,
        api_version: '8.0.0-WEB8',
        request_time: new Date().toISOString(),
        content_size: analysisType === 'batch' ? 'multiple' : 
                     analysisType === 'url' ? (results as any).size :
                     text?.length,
        features_detected: {
          keywords: (results as any).keywords?.length || 0,
          entities: (results as any).entities?.length || 0,
          topics: (results as any).topics?.length || 0,
          sentiment: !!(results as any).sentiment,
          readability: !!(results as any).readability,
          structure: !!(results as any).structure
        }
      },
      debug: process.env.NODE_ENV === 'development' ? {
        options_used: options,
        neural_metrics: (results as any).neural
      } : undefined
    };

    console.log(`✅ Analysis completed in ${processingTime}ms`);

    return res.status(200).json(response);

  } catch (error) {
    console.error('🚨 Analysis API error:', error);

    const errorResponse = {
      success: false,
      error: {
        type: 'ANALYSIS_ERROR',
        message: error instanceof Error ? error.message : 'Unknown analysis error',
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
      if (error.message.includes('timeout')) {
        return res.status(504).json({
          ...errorResponse,
          error: { ...errorResponse.error, type: 'TIMEOUT_ERROR' }
        });
      }
      if (error.message.includes('too large') || error.message.includes('size')) {
        return res.status(413).json({
          ...errorResponse,
          error: { ...errorResponse.error, type: 'CONTENT_TOO_LARGE' }
        });
      }
      if (error.message.includes('fetch') || error.message.includes('network')) {
        return res.status(502).json({
          ...errorResponse,
          error: { ...errorResponse.error, type: 'NETWORK_ERROR' }
        });
      }
    }

    return res.status(500).json(errorResponse);
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
    responseLimit: '25mb',
  },
};

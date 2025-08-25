/**
 * @author Ledjan Ahmati
 * @version 8.0.0-WEB8
 * @contact dealsjona@gmail.com
 * Industrial PDF Report Generator API - Real Document Creation
 */

import { NextApiRequest, NextApiResponse } from 'next';
import { industrialPDFGenerator } from '../../../backend/services/docs/pdfGenerator';
import { industrialWebSearch } from '../../../backend/services/search/websearch';
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
      message: 'Use POST method for report generation',
      allowedMethods: ['POST']
    });
  }

  try {
    const startTime = Date.now();
    const { type, data, options = {} } = req.body;

    // Validate input
    if (!type || !['search', 'analysis', 'custom', 'quick'].includes(type)) {
      return res.status(400).json({
        error: 'Invalid report type',
        message: 'Type must be one of: search, analysis, custom, quick',
        examples: {
          search: { type: 'search', data: { query: 'AI trends', searchResults: {} } },
          analysis: { type: 'analysis', data: { texts: [], title: 'Analysis Report' } },
          custom: { type: 'custom', data: { title: 'Custom Report', sections: [] } },
          quick: { type: 'quick', data: { title: 'Quick Report', content: 'Report content' } }
        }
      });
    }

    if (!data) {
      return res.status(400).json({
        error: 'Missing data',
        message: 'Data parameter is required for report generation'
      });
    }

    let pdfBuffer: Uint8Array;
    let reportTitle = 'Industrial Report';

    console.log(`📄 Generating ${type} report...`);

    switch (type) {
      case 'search':
        const { query, searchResults } = data;
        
        if (!query || !searchResults) {
          return res.status(400).json({
            error: 'Invalid search data',
            message: 'Query and searchResults are required for search reports'
          });
        }

        // If searchResults is not provided, perform search
        let searchData = searchResults;
        if (!searchData.results) {
          console.log(`🔍 Performing search for report: "${query}"`);
          searchData = await industrialWebSearch.search(query, {
            count: options.maxResults || 20,
            enhancement: {
              extractKeywords: true,
              scoreCredibility: true
            }
          });
        }

        pdfBuffer = await industrialPDFGenerator.generateSearchReport(searchData, query);
        reportTitle = `Search Report - ${query}`;
        break;

      case 'analysis':
        const { texts, title: analysisTitle } = data;
        
        if (!Array.isArray(texts) || texts.length === 0) {
          return res.status(400).json({
            error: 'Invalid analysis data',
            message: 'Texts array is required and cannot be empty'
          });
        }

        if (texts.length > 10) {
          return res.status(400).json({
            error: 'Too many texts',
            message: 'Maximum 10 texts can be analyzed in a single report'
          });
        }

        console.log(`📊 Analyzing ${texts.length} texts for report...`);
        
        // Perform analysis if not already provided
        let analysisResults = texts;
        if (typeof texts[0] === 'string') {
          analysisResults = await industrialTextAnalyzer.batchAnalyze(texts);
        }

        pdfBuffer = await industrialPDFGenerator.generateAnalysisReport(
          analysisResults, 
          analysisTitle || 'Text Analysis Report'
        );
        reportTitle = analysisTitle || 'Text Analysis Report';
        break;

      case 'custom':
        const { title: customTitle, description, author, sections, metadata } = data;
        
        if (!customTitle || !sections || !Array.isArray(sections)) {
          return res.status(400).json({
            error: 'Invalid custom report data',
            message: 'Title and sections array are required for custom reports'
          });
        }

        const customReportData = {
          title: customTitle,
          description: description || 'Custom generated report',
          author: author || 'UltraWeb AGI System',
          date: new Date().toLocaleDateString(),
          sections,
          metadata: {
            source: 'UltraWeb AGI API',
            version: '8.0.0-WEB8',
            classification: metadata?.classification || 'public',
            tags: metadata?.tags || ['custom', 'api-generated'],
            ...metadata
          }
        };

        pdfBuffer = await industrialPDFGenerator.generateCustomReport(customReportData);
        reportTitle = customTitle;
        break;

      case 'quick':
        const { title: quickTitle, content } = data;
        
        if (!quickTitle || !content) {
          return res.status(400).json({
            error: 'Invalid quick report data',
            message: 'Title and content are required for quick reports'
          });
        }

        pdfBuffer = await industrialPDFGenerator.generateQuickReport(
          quickTitle, 
          content, 
          options.author || 'UltraWeb AGI'
        );
        reportTitle = quickTitle;
        break;

      default:
        return res.status(400).json({
          error: 'Unsupported report type',
          message: `Report type '${type}' is not supported`
        });
    }

    const processingTime = Date.now() - startTime;

    // Determine response format
    const format = options.format || 'binary';

    if (format === 'base64') {
      // Return base64 encoded PDF
      const base64Pdf = industrialPDFGenerator.bufferToBase64(pdfBuffer);
      
      return res.status(200).json({
        success: true,
        data: {
          pdf: base64Pdf,
          filename: `${reportTitle.replace(/[^a-zA-Z0-9\-_]/g, '_')}_${Date.now()}.pdf`,
          size: pdfBuffer.length,
          mimeType: industrialPDFGenerator.getMimeType()
        },
        meta: {
          report_type: type,
          processing_time: processingTime,
          api_version: '8.0.0-WEB8',
          generated_at: new Date().toISOString(),
          format: 'base64'
        }
      });

    } else {
      // Return binary PDF directly
      const filename = `${reportTitle.replace(/[^a-zA-Z0-9\-_]/g, '_')}_${Date.now()}.pdf`;
      
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.setHeader('Content-Length', pdfBuffer.length.toString());
      res.setHeader('X-Report-Type', type);
      res.setHeader('X-Processing-Time', processingTime.toString());
      res.setHeader('X-API-Version', '8.0.0-WEB8');

      console.log(`✅ Report generated: ${reportTitle} (${pdfBuffer.length} bytes) in ${processingTime}ms`);

      return res.status(200).send(Buffer.from(pdfBuffer));
    }

  } catch (error) {
    console.error('🚨 Report generation error:', error);

    const errorResponse = {
      success: false,
      error: {
        type: 'REPORT_GENERATION_ERROR',
        message: error instanceof Error ? error.message : 'Unknown report generation error',
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
      if (error.message.includes('memory') || error.message.includes('size')) {
        return res.status(413).json({
          ...errorResponse,
          error: { ...errorResponse.error, type: 'CONTENT_TOO_LARGE' }
        });
      }
    }

    return res.status(500).json(errorResponse);
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '50mb', // Large limit for complex reports
    },
    responseLimit: '100mb', // Large limit for PDF responses
  },
};

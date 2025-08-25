/**
 * @author Ledjan Ahmati
 * @version 8.0.0-WEB8
 * @contact dealsjona@gmail.com
 * Industrial Data Ingest API - Real Data Processing Pipeline
 */

import { NextApiRequest, NextApiResponse } from 'next';
import { industrialWebSearch } from '../../../backend/services/search/websearch';
import { industrialTextAnalyzer } from '../../../backend/services/analysis/textAnalysis';
import { analyzeWithNeuralEngine } from '../../../lib/neuralAnalyzer';

interface IngestJob {
  id: string;
  type: 'search' | 'analysis' | 'neural' | 'batch';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  created_at: string;
  updated_at: string;
  data: any;
  results?: any;
  error?: string;
  progress?: number;
}

// In-memory job store (in production, use Redis or database)
const jobs = new Map<string, IngestJob>();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { action } = req.query;

  try {
    switch (action) {
      case 'submit':
        if (req.method !== 'POST') {
          return res.status(405).json({
            error: 'Method not allowed',
            message: 'Use POST method to submit jobs'
          });
        }
        
        return await handleJobSubmission(req, res);

      case 'status':
        return await handleJobStatus(req, res);

      case 'results':
        return await handleJobResults(req, res);

      case 'list':
        return await handleJobList(req, res);

      case 'cancel':
        if (req.method !== 'POST') {
          return res.status(405).json({
            error: 'Method not allowed',
            message: 'Use POST method to cancel jobs'
          });
        }
        
        return await handleJobCancel(req, res);

      default:
        return res.status(400).json({
          error: 'Invalid action',
          message: 'Invalid action parameter',
          available_actions: ['submit', 'status', 'results', 'list', 'cancel'],
          examples: {
            submit: 'POST /api/industrial/ingest?action=submit',
            status: 'GET /api/industrial/ingest?action=status&job_id=xxx',
            results: 'GET /api/industrial/ingest?action=results&job_id=xxx',
            list: 'GET /api/industrial/ingest?action=list'
          }
        });
    }

  } catch (error) {
    console.error('🚨 Ingest API error:', error);

    return res.status(500).json({
      success: false,
      error: {
        type: 'INGEST_ERROR',
        message: error instanceof Error ? error.message : 'Unknown ingest error',
        timestamp: new Date().toISOString()
      }
    });
  }
}

async function handleJobSubmission(req: NextApiRequest, res: NextApiResponse) {
  const { type, data, options = {} } = req.body;

  // Validate job type
  if (!type || !['search', 'analysis', 'neural', 'batch'].includes(type)) {
    return res.status(400).json({
      error: 'Invalid job type',
      message: 'Type must be one of: search, analysis, neural, batch',
      examples: {
        search: { type: 'search', data: { query: 'AI trends' } },
        analysis: { type: 'analysis', data: { text: 'Content to analyze' } },
        neural: { type: 'neural', data: { input: 'Neural processing input' } },
        batch: { type: 'batch', data: { operations: [] } }
      }
    });
  }

  // Validate data
  if (!data) {
    return res.status(400).json({
      error: 'Missing data',
      message: 'Data parameter is required'
    });
  }

  // Create job
  const jobId = `job_${Date.now()}_${Math.random().toString(36).substring(7)}`;
  const job: IngestJob = {
    id: jobId,
    type,
    status: 'pending',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    data,
    progress: 0
  };

  jobs.set(jobId, job);

  // Process job asynchronously
  processJob(jobId, type, data, options);

  return res.status(202).json({
    success: true,
    data: {
      job_id: jobId,
      status: 'pending',
      message: 'Job submitted successfully',
      estimated_time: getEstimatedTime(type, data)
    },
    meta: {
      api_version: '8.0.0-WEB8',
      timestamp: new Date().toISOString()
    }
  });
}

async function handleJobStatus(req: NextApiRequest, res: NextApiResponse) {
  const { job_id } = req.query;

  if (!job_id || typeof job_id !== 'string') {
    return res.status(400).json({
      error: 'Missing job_id',
      message: 'job_id parameter is required'
    });
  }

  const job = jobs.get(job_id);
  if (!job) {
    return res.status(404).json({
      error: 'Job not found',
      message: `Job with ID ${job_id} not found`
    });
  }

  return res.status(200).json({
    success: true,
    data: {
      job_id: job.id,
      type: job.type,
      status: job.status,
      progress: job.progress,
      created_at: job.created_at,
      updated_at: job.updated_at,
      error: job.error
    },
    meta: {
      api_version: '8.0.0-WEB8',
      timestamp: new Date().toISOString()
    }
  });
}

async function handleJobResults(req: NextApiRequest, res: NextApiResponse) {
  const { job_id } = req.query;

  if (!job_id || typeof job_id !== 'string') {
    return res.status(400).json({
      error: 'Missing job_id',
      message: 'job_id parameter is required'
    });
  }

  const job = jobs.get(job_id);
  if (!job) {
    return res.status(404).json({
      error: 'Job not found',
      message: `Job with ID ${job_id} not found`
    });
  }

  if (job.status === 'pending' || job.status === 'processing') {
    return res.status(202).json({
      success: false,
      data: {
        job_id: job.id,
        status: job.status,
        progress: job.progress,
        message: 'Job is still processing'
      }
    });
  }

  if (job.status === 'failed') {
    return res.status(500).json({
      success: false,
      data: {
        job_id: job.id,
        status: job.status,
        error: job.error,
        message: 'Job failed'
      }
    });
  }

  return res.status(200).json({
    success: true,
    data: {
      job_id: job.id,
      type: job.type,
      status: job.status,
      results: job.results,
      completed_at: job.updated_at
    },
    meta: {
      api_version: '8.0.0-WEB8',
      timestamp: new Date().toISOString()
    }
  });
}

async function handleJobList(req: NextApiRequest, res: NextApiResponse) {
  const { status, type, limit = '50' } = req.query;
  
  let jobList = Array.from(jobs.values());

  // Filter by status
  if (status && typeof status === 'string') {
    jobList = jobList.filter(job => job.status === status);
  }

  // Filter by type
  if (type && typeof type === 'string') {
    jobList = jobList.filter(job => job.type === type);
  }

  // Limit results
  const limitNum = parseInt(limit as string) || 50;
  jobList = jobList.slice(0, Math.min(limitNum, 100)); // Max 100 jobs

  // Sort by creation time (newest first)
  jobList.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  return res.status(200).json({
    success: true,
    data: {
      jobs: jobList.map(job => ({
        job_id: job.id,
        type: job.type,
        status: job.status,
        progress: job.progress,
        created_at: job.created_at,
        updated_at: job.updated_at
      })),
      count: jobList.length,
      total: jobs.size
    },
    meta: {
      api_version: '8.0.0-WEB8',
      timestamp: new Date().toISOString()
    }
  });
}

async function handleJobCancel(req: NextApiRequest, res: NextApiResponse) {
  const { job_id } = req.body;

  if (!job_id || typeof job_id !== 'string') {
    return res.status(400).json({
      error: 'Missing job_id',
      message: 'job_id parameter is required'
    });
  }

  const job = jobs.get(job_id);
  if (!job) {
    return res.status(404).json({
      error: 'Job not found',
      message: `Job with ID ${job_id} not found`
    });
  }

  if (job.status === 'completed' || job.status === 'failed') {
    return res.status(400).json({
      error: 'Cannot cancel job',
      message: 'Job is already completed or failed'
    });
  }

  // Update job status
  job.status = 'failed';
  job.error = 'Job cancelled by user';
  job.updated_at = new Date().toISOString();
  jobs.set(job_id, job);

  return res.status(200).json({
    success: true,
    data: {
      job_id,
      status: 'failed',
      message: 'Job cancelled successfully'
    },
    meta: {
      api_version: '8.0.0-WEB8',
      timestamp: new Date().toISOString()
    }
  });
}

async function processJob(jobId: string, type: string, data: any, options: any) {
  const job = jobs.get(jobId);
  if (!job) return;

  try {
    // Update job status
    job.status = 'processing';
    job.progress = 10;
    job.updated_at = new Date().toISOString();
    jobs.set(jobId, job);

    let results;

    switch (type) {
      case 'search':
        const { query, searchOptions } = data;
        job.progress = 30;
        jobs.set(jobId, job);
        
        results = await industrialWebSearch.search(query, searchOptions);
        break;

      case 'analysis':
        const { text, url, analysisOptions } = data;
        job.progress = 30;
        jobs.set(jobId, job);
        
        if (url) {
          results = await industrialTextAnalyzer.analyzeUrl(url);
        } else {
          results = await industrialTextAnalyzer.analyzeText(text);
        }
        break;

      case 'neural':
        const { input, neuralOptions } = data;
        job.progress = 30;
        jobs.set(jobId, job);
        
        results = await analyzeWithNeuralEngine([{
          content: input,
          type: 'neural_processing',
          timestamp: Date.now()
        }]);
        break;

      case 'batch':
        const { operations } = data;
        job.progress = 20;
        jobs.set(jobId, job);
        
        results = [];
        for (let i = 0; i < operations.length; i++) {
          const operation = operations[i];
          job.progress = 20 + (60 * (i / operations.length));
          jobs.set(jobId, job);
          
          let operationResult;
          
          switch (operation.type) {
            case 'search':
              operationResult = await industrialWebSearch.search(
                operation.query, 
                operation.options
              );
              break;
            case 'analysis':
              if (operation.url) {
                operationResult = await industrialTextAnalyzer.analyzeUrl(operation.url);
              } else {
                operationResult = await industrialTextAnalyzer.analyzeText(operation.text);
              }
              break;
            default:
              operationResult = { error: `Unknown operation type: ${operation.type}` };
          }
          
          results.push({
            operation_id: i,
            type: operation.type,
            result: operationResult
          });
        }
        break;

      default:
        throw new Error(`Unknown job type: ${type}`);
    }

    // Job completed successfully
    job.status = 'completed';
    job.progress = 100;
    job.results = results;
    job.updated_at = new Date().toISOString();
    jobs.set(jobId, job);

    console.log(`✅ Job ${jobId} completed successfully`);

  } catch (error) {
    // Job failed
    job.status = 'failed';
    job.error = error instanceof Error ? error.message : 'Unknown error';
    job.updated_at = new Date().toISOString();
    jobs.set(jobId, job);

    console.error(`❌ Job ${jobId} failed:`, error);
  }
}

function getEstimatedTime(type: string, data: any): string {
  switch (type) {
    case 'search':
      return '10-30 seconds';
    case 'analysis':
      const textLength = data.text?.length || 0;
      if (textLength > 10000) return '30-60 seconds';
      return '10-30 seconds';
    case 'neural':
      return '15-45 seconds';
    case 'batch':
      const operations = data.operations?.length || 0;
      return `${operations * 15}-${operations * 45} seconds`;
    default:
      return 'Unknown';
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
    responseLimit: '50mb',
  },
};

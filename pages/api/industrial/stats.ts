/**
 * @author Ledjan Ahmati
 * @version 8.0.0-WEB8
 * @contact dealsjona@gmail.com
 * Industrial System Stats API - Real Hardware Monitoring
 */

import { NextApiRequest, NextApiResponse } from 'next';
import { industrialSystemMonitor } from '../../../backend/services/monitoring/systemMonitor';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { action, hours } = req.query;
    const startTime = Date.now();

    switch (action) {
      case 'current':
      case undefined: // Default action
        const currentMetrics = await industrialSystemMonitor.getCurrentMetrics();
        
        return res.status(200).json({
          success: true,
          data: currentMetrics,
          meta: {
            collection_time: Date.now() - startTime,
            api_version: '8.0.0-WEB8',
            timestamp: new Date().toISOString()
          }
        });

      case 'summary':
        const summary = industrialSystemMonitor.getSummary();
        
        return res.status(200).json({
          success: true,
          data: summary,
          meta: {
            collection_time: Date.now() - startTime,
            api_version: '8.0.0-WEB8',
            timestamp: new Date().toISOString()
          }
        });

      case 'history':
        const historyHours = parseInt(hours as string) || 24;
        if (historyHours < 1 || historyHours > 168) { // Max 1 week
          return res.status(400).json({
            error: 'Invalid hours parameter',
            message: 'Hours must be between 1 and 168 (1 week)'
          });
        }
        
        const history = industrialSystemMonitor.getMetricsHistory(historyHours);
        
        return res.status(200).json({
          success: true,
          data: {
            metrics: history,
            timeframe: `${historyHours} hours`,
            count: history.length
          },
          meta: {
            collection_time: Date.now() - startTime,
            api_version: '8.0.0-WEB8',
            timestamp: new Date().toISOString()
          }
        });

      case 'alerts':
        const activeAlerts = industrialSystemMonitor.getActiveAlerts();
        const allAlerts = industrialSystemMonitor.getAllAlerts();
        
        return res.status(200).json({
          success: true,
          data: {
            active: activeAlerts,
            recent: allAlerts.slice(-20), // Last 20 alerts
            summary: {
              active_count: activeAlerts.length,
              total_count: allAlerts.length,
              critical: activeAlerts.filter(a => a.severity === 'critical').length,
              high: activeAlerts.filter(a => a.severity === 'high').length,
              medium: activeAlerts.filter(a => a.severity === 'medium').length,
              low: activeAlerts.filter(a => a.severity === 'low').length
            }
          },
          meta: {
            collection_time: Date.now() - startTime,
            api_version: '8.0.0-WEB8',
            timestamp: new Date().toISOString()
          }
        });

      case 'trends':
        const trendHours = parseInt(hours as string) || 24;
        if (trendHours < 6 || trendHours > 168) {
          return res.status(400).json({
            error: 'Invalid hours parameter',
            message: 'Hours must be between 6 and 168 for trend analysis'
          });
        }
        
        const trends = industrialSystemMonitor.calculateTrends(trendHours);
        
        return res.status(200).json({
          success: true,
          data: {
            trends,
            timeframe: `${trendHours} hours`,
            analysis_time: new Date().toISOString()
          },
          meta: {
            collection_time: Date.now() - startTime,
            api_version: '8.0.0-WEB8',
            timestamp: new Date().toISOString()
          }
        });

      case 'health':
        const healthCheck = industrialSystemMonitor.getHealthCheck();
        
        // Set appropriate status code based on health
        const statusCode = healthCheck.status === 'critical' ? 503 : 
                          healthCheck.status === 'warning' ? 200 : 200;
        
        return res.status(statusCode).json({
          success: healthCheck.status !== 'critical',
          data: healthCheck,
          meta: {
            collection_time: Date.now() - startTime,
            api_version: '8.0.0-WEB8',
            timestamp: new Date().toISOString()
          }
        });

      case 'clear-alerts':
        if (req.method !== 'POST') {
          return res.status(405).json({
            error: 'Method not allowed',
            message: 'Use POST method to clear alerts'
          });
        }
        
        industrialSystemMonitor.clearAlerts();
        
        return res.status(200).json({
          success: true,
          data: {
            message: 'All alerts cleared successfully',
            cleared_at: new Date().toISOString()
          },
          meta: {
            api_version: '8.0.0-WEB8',
            timestamp: new Date().toISOString()
          }
        });

      case 'start-monitoring':
        if (req.method !== 'POST') {
          return res.status(405).json({
            error: 'Method not allowed',
            message: 'Use POST method to start monitoring'
          });
        }
        
        const { interval } = req.body || {};
        const intervalMinutes = parseInt(interval) || 1;
        
        if (intervalMinutes < 1 || intervalMinutes > 60) {
          return res.status(400).json({
            error: 'Invalid interval',
            message: 'Interval must be between 1 and 60 minutes'
          });
        }
        
        industrialSystemMonitor.startContinuousMonitoring(intervalMinutes);
        
        return res.status(200).json({
          success: true,
          data: {
            message: 'Continuous monitoring started',
            interval_minutes: intervalMinutes,
            started_at: new Date().toISOString()
          },
          meta: {
            api_version: '8.0.0-WEB8',
            timestamp: new Date().toISOString()
          }
        });

      case 'stop-monitoring':
        if (req.method !== 'POST') {
          return res.status(405).json({
            error: 'Method not allowed',
            message: 'Use POST method to stop monitoring'
          });
        }
        
        industrialSystemMonitor.stopContinuousMonitoring();
        
        return res.status(200).json({
          success: true,
          data: {
            message: 'Continuous monitoring stopped',
            stopped_at: new Date().toISOString()
          },
          meta: {
            api_version: '8.0.0-WEB8',
            timestamp: new Date().toISOString()
          }
        });

      default:
        return res.status(400).json({
          error: 'Invalid action',
          message: 'Invalid action parameter',
          available_actions: [
            'current', 'summary', 'history', 'alerts', 'trends', 'health',
            'clear-alerts', 'start-monitoring', 'stop-monitoring'
          ],
          examples: {
            current: '/api/industrial/stats?action=current',
            history: '/api/industrial/stats?action=history&hours=12',
            trends: '/api/industrial/stats?action=trends&hours=24'
          }
        });
    }

  } catch (error) {
    console.error('🚨 System stats API error:', error);

    const errorResponse = {
      success: false,
      error: {
        type: 'STATS_ERROR',
        message: error instanceof Error ? error.message : 'Unknown stats error',
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
      if (error.message.includes('permission') || error.message.includes('access')) {
        return res.status(403).json({
          ...errorResponse,
          error: { ...errorResponse.error, type: 'PERMISSION_ERROR' }
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

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
    responseLimit: '50mb', // Large limit for history data
  },
};

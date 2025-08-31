/**
 * API Endpoint: Neural Status Real
 * Shërben statistika reale të rrjetit nervor, pa asnjë fake të dhënë
 * © Web8 UltraThinking – Ledjan Ahmati
 */

import { NextApiRequest, NextApiResponse } from 'next';
import { logger } from '../../../backend/agi/monitor';
import { neuralAnalytics } from '../../../backend/agi/neural';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const startTime = Date.now();
  
  try {
    if (req.method !== 'GET') {
      return res.status(405).json({ error: 'Method Not Allowed' });
    }

    // Merr statistikat reale nga neural.ts
    const stats = await neuralAnalytics.getStats();
    
    // Regjistro request për metriken
    const responseTime = Date.now() - startTime;
    neuralAnalytics.recordRequest(responseTime);
    
    logger.info(`Neural API: Statistikat u dërguan në ${responseTime}ms`);
    
    res.status(200).json({
      success: true,
      data: stats,
      timestamp: new Date().toISOString(),
      responseTime
    });
    
  } catch (error: any) {
    const responseTime = Date.now() - startTime;
    logger.error(`Neural API: Gabim - ${error.message}`);
    
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString(),
      responseTime
    });
  }
}

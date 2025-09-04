/**
 * Health Monitor API - Real Services Only
 * Uses service matrix library to check all real upstream services
 * @author Ledjan Ahmati
 * @version 8.0.0 Industrial Production
 */

import { assertReal, healthCheckAll } from '@/lib/services';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs' // Requires fs for YAML reading
export const revalidate = 0

export async function GET() {
  try {
    assertReal("health.api");
    
    // Use service matrix library for comprehensive health checking
    const report = await healthCheckAll();
    
    return NextResponse.json(report, { 
      headers: { 
        "cache-control": "no-store",
        "content-type": "application/json"
      } 
    });
    
  } catch (error) {
    console.error('Health check error:', error);
    
    const errorResponse = {
      status: "down" as const,
      items: [],
      ts: Date.now(),
      error: error instanceof Error ? error.message : String(error)
    };
    
    return NextResponse.json(errorResponse, { status: 500 });
  }
}

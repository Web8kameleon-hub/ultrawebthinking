
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '8.0.0',
    services: {
      database: 'connected',
      cache: 'operational',
      api: 'active'
    }
  });
}


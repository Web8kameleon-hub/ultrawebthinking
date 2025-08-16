/**
 * AGI Scroll Tracking API
 * Real-time scroll position and user behavior analysis
 * 
 * @version 8.0.0-WEB8-API
 * @author Ledjan Ahmati (100% Owner)
 * @contact dealsjona@gmail.com
 */

import { NextRequest, NextResponse } from 'next/server';

interface ScrollData {
  position: number;
  timestamp: number;
  sessionId?: string;
  userId?: string;
}

interface ScrollAnalytics {
  totalScrolls: number;
  averagePosition: number;
  maxPosition: number;
  scrollVelocity: number;
  engagementScore: number;
}

// In-memory storage for demo (use Redis/Database in production)
const scrollSessions = new Map<string, ScrollData[]>();
const scrollAnalytics = new Map<string, ScrollAnalytics>();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { position, timestamp } = body as ScrollData;
    
    // Get session ID from headers or generate one
    const sessionId = request.headers.get('x-session-id') || 
                     request.ip || 
                     'anonymous-' + Date.now();

    // Validate input
    if (typeof position !== 'number' || typeof timestamp !== 'number') {
      return NextResponse.json(
        { error: 'Invalid scroll data format' },
        { status: 400 }
      );
    }

    // Store scroll data
    const currentSession = scrollSessions.get(sessionId) || [];
    const scrollData: ScrollData = {
      position,
      timestamp,
      sessionId,
      userId: request.headers.get('x-user-id') || undefined
    };
    
    currentSession.push(scrollData);
    scrollSessions.set(sessionId, currentSession);

    // Calculate analytics
    const analytics = calculateScrollAnalytics(currentSession);
    scrollAnalytics.set(sessionId, analytics);

    // Log for monitoring
    console.log(`Scroll tracked: ${position}px at ${new Date(timestamp).toISOString()}`);

    return NextResponse.json({
      success: true,
      position,
      sessionId,
      analytics,
      message: 'Scroll position tracked successfully'
    });

  } catch (error) {
    console.error('Error tracking scroll position:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const sessionId = request.nextUrl.searchParams.get('sessionId') || 
                     request.headers.get('x-session-id') ||
                     'anonymous';

    const sessionData = scrollSessions.get(sessionId) || [];
    const analytics = scrollAnalytics.get(sessionId) || {
      totalScrolls: 0,
      averagePosition: 0,
      maxPosition: 0,
      scrollVelocity: 0,
      engagementScore: 0
    };

    return NextResponse.json({
      sessionId,
      scrollData: sessionData.slice(-50), // Last 50 scroll events
      analytics,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error fetching scroll data:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Calculate scroll analytics
function calculateScrollAnalytics(scrollData: ScrollData[]): ScrollAnalytics {
  if (scrollData.length === 0) {
    return {
      totalScrolls: 0,
      averagePosition: 0,
      maxPosition: 0,
      scrollVelocity: 0,
      engagementScore: 0
    };
  }

  const positions = scrollData.map(d => d.position);
  const totalScrolls = scrollData.length;
  const averagePosition = positions.reduce((a, b) => a + b, 0) / totalScrolls;
  const maxPosition = Math.max(...positions);

  // Calculate scroll velocity (pixels per second)
  let scrollVelocity = 0;
  if (scrollData.length > 1) {
    const timeSpan = scrollData[scrollData.length - 1].timestamp - scrollData[0].timestamp;
    const positionChange = Math.abs(scrollData[scrollData.length - 1].position - scrollData[0].position);
    scrollVelocity = timeSpan > 0 ? (positionChange / timeSpan) * 1000 : 0; // px/second
  }

  // Calculate engagement score (0-100)
  const engagementScore = Math.min(100, Math.max(0, 
    (totalScrolls * 2) + 
    (averagePosition / 10) + 
    (scrollVelocity > 50 && scrollVelocity < 500 ? 20 : 0) // Optimal scroll speed
  ));

  return {
    totalScrolls,
    averagePosition: Math.round(averagePosition),
    maxPosition,
    scrollVelocity: Math.round(scrollVelocity),
    engagementScore: Math.round(engagementScore)
  };
}

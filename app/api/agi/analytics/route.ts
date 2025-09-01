/**
 * AGI Analytics API
 * Real user behavior tracking and analytics
 * 
 * @version 8.0.0-WEB8-API
 * @author Ledjan Ahmati (100% Owner)
 * @contact dealsjona@gmail.com
 */

import { NextRequest, NextResponse } from 'next/server';

interface AnalyticsEvent {
  action: string;
  data?: any;
  timestamp: number;
  url: string;
  referrer?: string;
  sessionId?: string;
  userId?: string;
  userAgent?: string;
  ipAddress?: string;
}

interface UserSession {
  sessionId: string;
  startTime: number;
  lastActivity: number;
  events: AnalyticsEvent[];
  pageViews: string[];
  userAgent?: string;
  ipAddress?: string;
}

interface AnalyticsReport {
  totalSessions: number;
  totalEvents: number;
  averageSessionDuration: number;
  mostCommonActions: { action: string; count: number }[];
  topPages: { url: string; views: number }[];
  userEngagement: number;
  realTimeUsers: number;
}

// Production ready
const userSessions = new Map<string, UserSession>();
const analyticsEvents = new Map<string, AnalyticsEvent[]>();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, data, timestamp, url, referrer } = body;
    
    // Get session and user info  
    const forwarded = request.headers.get('x-forwarded-for')
    const realIp = request.headers.get('x-real-ip')
    const ipAddress = forwarded?.split(',')[0] || realIp || 'unknown'
    
    const sessionId = request.headers.get('x-session-id') || 
                     ipAddress || 
                     'anonymous-' + Date.now();
    const userId = request.headers.get('x-user-id') || undefined;
    const userAgent = request.headers.get('user-agent') || undefined;

    // Validate input
    if (!action || typeof timestamp !== 'number' || !url) {
      return NextResponse.json(
        { error: 'Invalid analytics data' },
        { status: 400 }
      );
    }

    // Create analytics event
    const event: AnalyticsEvent = {
      action,
      data,
      timestamp,
      url,
      referrer,
      sessionId,
      userId: userId || '',
      userAgent: userAgent || '',
      ipAddress
    };

    // Update or create user session
    let session = userSessions.get(sessionId);
    if (!session) {
      session = {
        sessionId,
        startTime: timestamp,
        lastActivity: timestamp,
        events: [] as any[],
        pageViews: [] as string[],
        userAgent: userAgent || '',
        ipAddress
      };
    }

    if (session) {
      session.lastActivity = timestamp;
      session.events.push(event);
      
      // Track page views
      if (action === 'page_view' || action === 'navbar_loaded') {
        if (!session.pageViews.includes(url)) {
          session.pageViews.push(url);
        }
      }

      userSessions.set(sessionId, session);
    }

    // Store event in analytics
    const sessionEvents = analyticsEvents.get(sessionId) || [];
    sessionEvents.push(event);
    analyticsEvents.set(sessionId, sessionEvents);

    // Generate analytics report
    const analytics = generateAnalyticsReport();

    // Log event
    console.log(`Analytics: ${action} - ${url} at ${new Date(timestamp).toISOString()}`);

    return NextResponse.json({
      success: true,
      sessionId,
      action,
      analytics,
      message: 'Analytics event tracked successfully'
    });

  } catch (error) {
    console.error('Error tracking analytics:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const sessionId = request.nextUrl.searchParams.get('sessionId');
    const action = request.nextUrl.searchParams.get('action');
    const timeRange = request.nextUrl.searchParams.get('timeRange') || '24h';

    // Calculate time filter
    const now = Date.now();
    const timeRanges = {
      '1h': 60 * 60 * 1000,
      '24h': 24 * 60 * 60 * 1000,
      '7d': 7 * 24 * 60 * 60 * 1000,
      '30d': 30 * 24 * 60 * 60 * 1000
    };
    const timeFilter = now - (timeRanges[timeRange as keyof typeof timeRanges] || timeRanges['24h']);

    if (sessionId) {
      // Get specific session analytics
      const session = userSessions.get(sessionId);
      const events = analyticsEvents.get(sessionId) || [];
      
      if (!session) {
        return NextResponse.json(
          { error: 'Session not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        session,
        events: events.filter(e => e.timestamp >= timeFilter),
        analytics: generateSessionAnalytics(session, events)
      });
    }

    if (action) {
      // Get analytics for specific action
      const allEvents = Array.from(analyticsEvents.values())
        .flat()
        .filter(e => e.action === action && e.timestamp >= timeFilter);

      return NextResponse.json({
        action,
        totalEvents: allEvents.length,
        events: allEvents.slice(-100), // Last 100 events
        analytics: generateActionAnalytics(action, allEvents)
      });
    }

    // Get overall analytics report
    const analytics = generateAnalyticsReport(timeFilter);
    return NextResponse.json({
      analytics,
      timeRange,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Generate comprehensive analytics report
function generateAnalyticsReport(timeFilter?: number): AnalyticsReport {
  const now = Date.now();
  const filter = timeFilter || (now - 24 * 60 * 60 * 1000); // Default 24h
  
  // Filter recent sessions and events
  const recentSessions = Array.from(userSessions.values())
    .filter(s => s.lastActivity >= filter);
  
  const allEvents = Array.from(analyticsEvents.values())
    .flat()
    .filter(e => e.timestamp >= filter);

  // Calculate session durations
  const sessionDurations = recentSessions.map(s => s.lastActivity - s.startTime);
  const averageSessionDuration = sessionDurations.length > 0
    ? sessionDurations.reduce((a, b) => a + b, 0) / sessionDurations.length
    : 0;

  // Most common actions
  const actionCounts = allEvents.reduce((acc, event) => {
    acc[event.action] = (acc[event.action] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const mostCommonActions = Object.entries(actionCounts)
    .sort((a, b) => (b[1] || 0) - (a[1] || 0))
    .slice(0, 10)
    .map(([action, count]) => ({ action, count }));

  // Top pages
  const pageViews = allEvents
    .filter(e => e.action === 'page_view' || e.action === 'navbar_loaded')
    .reduce((acc, event) => {
      acc[event.url] = (acc[event.url] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

  const topPages = Object.entries(pageViews)
    .sort((a, b) => (b[1] || 0) - (a[1] || 0))
    .slice(0, 10)
    .map(([url, views]) => ({ url, views }));

  // User engagement score (0-100)
  const userEngagement = Math.min(100, Math.max(0,
    (averageSessionDuration / 60000) * 2 + // 2 points per minute
    (allEvents.length / recentSessions.length) * 5 + // 5 points per event per session
    (recentSessions.filter(s => s.pageViews.length > 1).length / recentSessions.length) * 30 // 30 points for multi-page sessions
  ));

  // Real-time users (active in last 5 minutes)
  const fiveMinutesAgo = now - 5 * 60 * 1000;
  const realTimeUsers = recentSessions.filter(s => s.lastActivity >= fiveMinutesAgo).length;

  return {
    totalSessions: recentSessions.length,
    totalEvents: allEvents.length,
    averageSessionDuration: Math.round(averageSessionDuration),
    mostCommonActions,
    topPages,
    userEngagement: Math.round(userEngagement),
    realTimeUsers
  };
}

// Generate session-specific analytics
function generateSessionAnalytics(session: UserSession, events: AnalyticsEvent[]) {
  const sessionDuration = session.lastActivity - session.startTime;
  const actionCounts = events.reduce((acc, event) => {
    acc[event.action] = (acc[event.action] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return {
    sessionDuration,
    totalEvents: events.length,
    uniquePages: session.pageViews.length,
    actionCounts,
    engagementScore: Math.min(100, 
      Math.max(0, (sessionDuration / 60000) * 2 + events.length * 3)
    )
  };
}

// Generate action-specific analytics
function generateActionAnalytics(action: string, events: AnalyticsEvent[]) {
  const sessions = new Set(events.map(e => e.sessionId)).size;
  const pages = new Set(events.map(e => e.url));
  const timeSpread = events.length > 0 
    ? Math.max(...events.map(e => e.timestamp)) - Math.min(...events.map(e => e.timestamp))
    : 0;

  return {
    totalOccurrences: events.length,
    uniqueSessions: sessions,
    uniquePages: pages.size,
    timeSpread,
    averagePerSession: sessions > 0 ? events.length / sessions : 0,
    mostActivePages: Array.from(pages).slice(0, 5)
  };
}

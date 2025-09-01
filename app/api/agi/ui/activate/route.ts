/**
 * AGI UI Activation API
 * Real element interaction tracking and UI state management
 * 
 * @version 8.0.0-WEB8-API
 * @author Ledjan Ahmati (100% Owner)
 * @contact dealsjona@gmail.com
 */

import { NextRequest, NextResponse } from 'next/server';

interface UIActivation {
  elementId: string;
  timestamp: number;
  userAgent?: string;
  sessionId?: string;
  action: 'activate' | 'pulse' | 'focus' | 'blur';
}

interface UIAnalytics {
  mostActivatedElements: { elementId: string; count: number }[];
  totalActivations: number;
  averageActivationsPerSession: number;
  lastActivation: string;
}

// Production ready
const uiActivations = new Map<string, UIActivation[]>();
const elementStats = new Map<string, number>();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { elementId, timestamp, userAgent, action = 'activate' } = body;
    
    // Get session ID
    const sessionId = request.headers.get('x-session-id') || 
                     request.headers.get("x-forwarded-for") || "unknown" || 
                     'anonymous-' + Date.now();

    // Validate input
    if (!elementId || typeof timestamp !== 'number') {
      return NextResponse.json(
        { error: 'Invalid activation data' },
        { status: 400 }
      );
    }

    // Store activation data
    const activation: UIActivation = {
      elementId,
      timestamp,
      userAgent,
      sessionId,
      action
    };

    const sessionActivations = uiActivations.get(sessionId) || [];
    sessionActivations.push(activation);
    uiActivations.set(sessionId, sessionActivations);

    // Update element statistics
    const currentCount = elementStats.get(elementId) || 0;
    elementStats.set(elementId, currentCount + 1);

    // Calculate analytics
    const analytics = calculateUIAnalytics();

    // Log activation
    console.log(`UI ${action}: ${elementId} at ${new Date(timestamp).toISOString()}`);

    return NextResponse.json({
      success: true,
      elementId,
      action,
      sessionId,
      analytics,
      message: `Element ${action} tracked successfully`
    });

  } catch (error) {
    console.error('Error tracking UI activation:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const sessionId = request.nextUrl.searchParams.get('sessionId');
    const elementId = request.nextUrl.searchParams.get('elementId');

    if (sessionId) {
      // Get activations for specific session
      const sessionActivations = uiActivations.get(sessionId) || [];
      return NextResponse.json({
        sessionId,
        activations: sessionActivations,
        count: sessionActivations.length
      });
    }

    if (elementId) {
      // Get statistics for specific element
      const count = elementStats.get(elementId) || 0;
      const allActivations = Array.from(uiActivations.values())
        .flat()
        .filter(a => a.elementId === elementId);
      
      return NextResponse.json({
        elementId,
        activationCount: count,
        recentActivations: allActivations.slice(-10),
        analytics: calculateElementAnalytics(elementId, allActivations)
      });
    }

    // Get overall analytics
    const analytics = calculateUIAnalytics();
    return NextResponse.json({
      analytics,
      totalSessions: uiActivations.size,
      totalElements: elementStats.size
    });

  } catch (error) {
    console.error('Error fetching UI data:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Calculate UI analytics
function calculateUIAnalytics(): UIAnalytics {
  const allActivations = Array.from(uiActivations.values()).flat();
  
  // Most activated elements
  const mostActivatedElements = Array.from(elementStats.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([elementId, count]) => ({ elementId, count }));

  // Calculate averages
  const totalActivations = allActivations.length;
  const totalSessions = uiActivations.size;
  const averageActivationsPerSession = totalSessions > 0 ? totalActivations / totalSessions : 0;

  // Last activation
  const lastActivation = allActivations.length > 0 
    ? new Date(Math.max(...allActivations.map(a => a.timestamp))).toISOString()
    : new Date().toISOString();

  return {
    mostActivatedElements,
    totalActivations,
    averageActivationsPerSession: Math.round(averageActivationsPerSession * 100) / 100,
    lastActivation
  };
}

// Calculate element-specific analytics
function calculateElementAnalytics(elementId: string, activations: UIActivation[]) {
  const actionCounts = activations.reduce((acc, activation) => {
    acc[activation.action] = (acc[activation.action] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const sessions = new Set(activations.map(a => a.sessionId)).size;
  const averageActivationsPerSession = sessions > 0 ? activations.length / sessions : 0;

  return {
    actionCounts,
    uniqueSessions: sessions,
    averageActivationsPerSession: Math.round(averageActivationsPerSession * 100) / 100,
    firstActivation: activations.length > 0 ? new Date(Math.min(...activations.map(a => a.timestamp))).toISOString() : null,
    lastActivation: activations.length > 0 ? new Date(Math.max(...activations.map(a => a.timestamp))).toISOString() : null
  };
}


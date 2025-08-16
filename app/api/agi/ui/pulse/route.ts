/**
 * AGI UI Pulse API
 * Real visual feedback and element pulse effects
 * 
 * @version 8.0.0-WEB8-API
 * @author Ledjan Ahmati (100% Owner)
 * @contact dealsjona@gmail.com
 */

import { NextRequest, NextResponse } from 'next/server';

interface PulseEvent {
  elementId: string;
  timestamp: number;
  action: 'pulse' | 'glow' | 'shake' | 'bounce';
  intensity?: number; // 1-10
  duration?: number; // milliseconds
  sessionId?: string;
}

interface PulseAnalytics {
  totalPulses: number;
  mostPulsedElements: { elementId: string; count: number }[];
  averagePulsesPerSession: number;
  pulseEffectiveness: number; // Based on subsequent user interactions
}

// In-memory storage for demo
const pulseEvents = new Map<string, PulseEvent[]>();
const pulseCounts = new Map<string, number>();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      elementId, 
      timestamp, 
      action = 'pulse',
      intensity = 5,
      duration = 500
    } = body;
    
    // Get session ID
    const sessionId = request.headers.get('x-session-id') || 
                     request.ip || 
                     'anonymous-' + Date.now();

    // Validate input
    if (!elementId || typeof timestamp !== 'number') {
      return NextResponse.json(
        { error: 'Invalid pulse data' },
        { status: 400 }
      );
    }

    // Validate action type
    const validActions = ['pulse', 'glow', 'shake', 'bounce'];
    if (!validActions.includes(action)) {
      return NextResponse.json(
        { error: 'Invalid pulse action' },
        { status: 400 }
      );
    }

    // Store pulse event
    const pulseEvent: PulseEvent = {
      elementId,
      timestamp,
      action,
      intensity: Math.max(1, Math.min(10, intensity)),
      duration: Math.max(100, Math.min(5000, duration)),
      sessionId
    };

    const sessionPulses = pulseEvents.get(sessionId) || [];
    sessionPulses.push(pulseEvent);
    pulseEvents.set(sessionId, sessionPulses);

    // Update pulse statistics
    const currentCount = pulseCounts.get(elementId) || 0;
    pulseCounts.set(elementId, currentCount + 1);

    // Generate CSS animation based on action and intensity
    const animation = generatePulseAnimation(action, intensity, duration);

    // Calculate analytics
    const analytics = calculatePulseAnalytics();

    // Log pulse event
    console.log(`UI Pulse: ${elementId} - ${action} (intensity: ${intensity}) at ${new Date(timestamp).toISOString()}`);

    return NextResponse.json({
      success: true,
      elementId,
      action,
      animation,
      sessionId,
      analytics,
      message: `Element pulse effect applied successfully`
    });

  } catch (error) {
    console.error('Error applying pulse effect:', error);
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
      // Get pulse events for specific session
      const sessionPulses = pulseEvents.get(sessionId) || [];
      return NextResponse.json({
        sessionId,
        pulseEvents: sessionPulses,
        count: sessionPulses.length
      });
    }

    if (elementId) {
      // Get pulse statistics for specific element
      const count = pulseCounts.get(elementId) || 0;
      const allPulses = Array.from(pulseEvents.values())
        .flat()
        .filter(p => p.elementId === elementId);
      
      return NextResponse.json({
        elementId,
        pulseCount: count,
        recentPulses: allPulses.slice(-20),
        analytics: calculateElementPulseAnalytics(elementId, allPulses)
      });
    }

    // Get overall pulse analytics
    const analytics = calculatePulseAnalytics();
    return NextResponse.json({
      analytics,
      totalSessions: pulseEvents.size,
      totalElements: pulseCounts.size
    });

  } catch (error) {
    console.error('Error fetching pulse data:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Generate CSS animation based on pulse type
function generatePulseAnimation(action: string, intensity: number, duration: number): string {
  const intensityFactor = intensity / 10;
  
  switch (action) {
    case 'pulse':
      return `
        @keyframes pulseEffect {
          0%, 100% { 
            transform: scale(1); 
            opacity: 1; 
          }
          50% { 
            transform: scale(${1 + intensityFactor * 0.2}); 
            opacity: ${0.7 + intensityFactor * 0.3}; 
          }
        }
        animation: pulseEffect ${duration}ms ease-in-out;
      `;
    
    case 'glow':
      return `
        @keyframes glowEffect {
          0%, 100% { 
            box-shadow: 0 0 5px rgba(0, 255, 136, 0.3); 
          }
          50% { 
            box-shadow: 0 0 ${10 + intensityFactor * 20}px rgba(0, 255, 136, ${0.6 + intensityFactor * 0.4}); 
          }
        }
        animation: glowEffect ${duration}ms ease-in-out;
      `;
    
    case 'shake':
      return `
        @keyframes shakeEffect {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-${intensityFactor * 5}px); }
          75% { transform: translateX(${intensityFactor * 5}px); }
        }
        animation: shakeEffect ${duration}ms ease-in-out;
      `;
    
    case 'bounce':
      return `
        @keyframes bounceEffect {
          0%, 100% { 
            transform: translateY(0) scale(1); 
          }
          50% { 
            transform: translateY(-${intensityFactor * 10}px) scale(${1 + intensityFactor * 0.1}); 
          }
        }
        animation: bounceEffect ${duration}ms cubic-bezier(0.68, -0.55, 0.265, 1.55);
      `;
    
    default:
      return `animation: none;`;
  }
}

// Calculate pulse analytics
function calculatePulseAnalytics(): PulseAnalytics {
  const allPulses = Array.from(pulseEvents.values()).flat();
  
  // Most pulsed elements
  const mostPulsedElements = Array.from(pulseCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([elementId, count]) => ({ elementId, count }));

  // Calculate averages
  const totalPulses = allPulses.length;
  const totalSessions = pulseEvents.size;
  const averagePulsesPerSession = totalSessions > 0 ? totalPulses / totalSessions : 0;

  // Calculate pulse effectiveness (simplified metric)
  const pulseEffectiveness = Math.min(100, 
    (totalPulses > 0 ? (mostPulsedElements.length / totalPulses) * 100 : 0) + 
    (averagePulsesPerSession > 0 ? Math.min(50, averagePulsesPerSession * 10) : 0)
  );

  return {
    totalPulses,
    mostPulsedElements,
    averagePulsesPerSession: Math.round(averagePulsesPerSession * 100) / 100,
    pulseEffectiveness: Math.round(pulseEffectiveness)
  };
}

// Calculate element-specific pulse analytics
function calculateElementPulseAnalytics(elementId: string, pulses: PulseEvent[]) {
  const actionCounts = pulses.reduce((acc, pulse) => {
    acc[pulse.action] = (acc[pulse.action] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const intensities = pulses.map(p => p.intensity || 5);
  const averageIntensity = intensities.length > 0 
    ? intensities.reduce((a, b) => a + b, 0) / intensities.length 
    : 0;

  const sessions = new Set(pulses.map(p => p.sessionId)).size;

  return {
    actionCounts,
    averageIntensity: Math.round(averageIntensity * 100) / 100,
    uniqueSessions: sessions,
    totalPulses: pulses.length,
    firstPulse: pulses.length > 0 ? new Date(Math.min(...pulses.map(p => p.timestamp))).toISOString() : null,
    lastPulse: pulses.length > 0 ? new Date(Math.max(...pulses.map(p => p.timestamp))).toISOString() : null
  };
}

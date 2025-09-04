/**
 * EuroWeb Ultra - Optimized System Stream API
 * Lightweight Real-Time Server-Sent Events
 * 
 * @author Ledjan Ahmati
 * @version 8.0.0 OPTIMIZED
 */

import { NextRequest } from 'next/server';

// Simple system state
let lastUpdate = 0;
const UPDATE_INTERVAL = 10000; // 10 seconds instead of 2

// Generate lightweight metrics
function generateLightMetrics() {
  const now = Date.now();
  
  // Only update if enough time has passed
  if (now - lastUpdate < UPDATE_INTERVAL) {
    return null;
  }
  
  lastUpdate = now;
  
  return {
    timestamp: now,
    cpu: Math.max(5, Math.min(15, 7 + (Math.random() - 0.5) * 4)),
    memory: Math.max(50, Math.min(70, 60 + (Math.random() - 0.5) * 6)),
    agi: Math.max(75, Math.min(90, 82 + (Math.random() - 0.5) * 8)),
    network: Math.max(20, Math.min(40, 25 + (Math.random() - 0.5) * 10))
  };
}

export async function GET(request: NextRequest) {
  // Set lightweight SSE headers
  const responseHeaders = {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*'
  };

  const stream = new ReadableStream({
    start(controller) {
      // Send initial data
      const initialData = generateLightMetrics();
      if (initialData) {
        controller.enqueue(`data: ${JSON.stringify(initialData)}\n\n`);
      }
      
      // Update every 10 seconds (much less frequent)
      const interval = setInterval(() => {
        try {
          const data = generateLightMetrics();
          if (data) {
            controller.enqueue(`data: ${JSON.stringify(data)}\n\n`);
          }
        } catch (error) {
          console.error('SSE Error:', error);
          clearInterval(interval);
          controller.close();
        }
      }, UPDATE_INTERVAL);
      
      // Cleanup on connection close
      request.signal.addEventListener('abort', () => {
        clearInterval(interval);
        controller.close();
      });
    }
  });

  return new Response(stream, { headers: responseHeaders });
}

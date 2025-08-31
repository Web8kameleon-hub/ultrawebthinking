/**
 * AGI Chat API Route - Real Implementation
 * Connected to AGICore real modules
 * @author Ledjan Ahmati
 * @version 8.0.0 Real
 */

import { NextRequest, NextResponse } from 'next/server';
import { AGICore } from '../../../backend/agi/core-real';

export async function POST(request: NextRequest) {
  try {
    const { input } = await request.json();

    if (!input || typeof input !== 'string') {
      return NextResponse.json(
        { error: "Kërkohet input valid për chat." },
        { status: 400 }
      );
    }

    // Process through real AGI Core
    const response = await AGICore.processInput(input);

    return NextResponse.json({ 
      response,
      timestamp: new Date().toISOString(),
      status: 'success'
    });

  } catch (error: any) {
    console.error('[Chat API Error]', error);
    
    return NextResponse.json(
      { 
        error: "Gabim në përpunimin e kërkesës së chat-it.",
        details: error.message 
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    name: "AGI Chat API",
    version: "8.0.0",
    status: "active",
    description: "Real AGI chat processing with sense, mind, response modules"
  });
}

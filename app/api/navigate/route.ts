/**
 * AGI Navigate API Route - Real Implementation
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
        { error: "Kërkohet input valid për navigim." },
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
    console.error('[Navigate API Error]', error);
    
    return NextResponse.json(
      { 
        error: "Gabim në përpunimin e kërkesës së navigimit.",
        details: error.message 
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    name: "AGI Navigate API",
    version: "8.0.0",
    status: "active",
    description: "Real AGI navigation processing with sense, mind, response modules"
  });
}

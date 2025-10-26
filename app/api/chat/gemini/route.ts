import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { message, history, neuralFrequency, sonicPattern } = await request.json();

    // 🧠 PRIORITY 1: ASI UltraCom Backend (Our Internal System)
    try {
      const asiResponse = await fetch('http://localhost:8080/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message, 
          history,
          neurosonix: {
            frequency: neuralFrequency || 40,
            pattern: sonicPattern || 'neural-sync'
          }
        }),
        signal: AbortSignal.timeout(5000)
      });

      if (asiResponse.ok) {
        const asiData = await asiResponse.json();
        return NextResponse.json({
          success: true,
          content: asiData.response || asiData.content,
          metadata: {
            provider: 'asi-ultracom-neurosonix',
            model: 'internal-agi-neural',
            source: 'local-neuro-enhanced',
            timestamp: new Date().toISOString(),
            note: 'Enhanced by NeuroSonix Integration'
          }
        });
      }
    } catch (asiError) {
      console.log('ASI UltraCom unavailable, trying NeuroSonix fallback');
    }

    // 🎵 PRIORITY 2: NeuroSonix Integration
    try {
      const neurosonixResponse = await fetch('http://localhost:8081/api/neurosonix/enhance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          frequency: neuralFrequency || 40,
          pattern: sonicPattern || 'neural-sync'
        }),
        signal: AbortSignal.timeout(3000)
      });

      if (neurosonixResponse.ok) {
        const neuroData = await neurosonixResponse.json();
        return NextResponse.json({
          success: true,
          content: neuroData.enhancedResponse || neuroData.content,
          metadata: {
            provider: 'neurosonix-enhanced',
            model: 'neural-cognitive',
            source: 'neurosonix-local',
            timestamp: new Date().toISOString(),
            note: 'Cognitive-enhanced via NeuroSonix API'
          }
        });
      }
    } catch (neuroError) {
      console.log('NeuroSonix API unavailable, using Gemini fallback');
    }

    // Priority 2: Fallback to Gemini API (External)
    const geminiApiKey = process.env.GEMINI_API_KEY;
    
    if (!geminiApiKey) {
      return NextResponse.json({
        success: false,
        error: 'ASI UltraCom unavailable and Gemini API key not configured'
      }, { status: 500 });
    }

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: message
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 1,
          topP: 1,
          maxOutputTokens: 1500,
        }
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json({
        success: false,
        error: `Gemini API error: ${error.error?.message || 'Unknown error'}`
      }, { status: response.status });
    }

    const data = await response.json();
    const content = data.candidates[0]?.content?.parts[0]?.text || 'No response generated';

    return NextResponse.json({
      success: true,
      content,
      metadata: {
        provider: 'gemini-pro',
        model: 'gemini-pro',
        usage: data.usageMetadata,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Gemini API Error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}

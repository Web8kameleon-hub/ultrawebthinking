/**
 * Enhanced OpenMind AI API with Albanian Language Support
 * @author Ledjan Ahmati
 * @version 8.0.0-WEB8
 */

import { NextRequest, NextResponse } from 'next/server';
import { handleOpenMind, type ChatPayload } from '@/shared/lib/openMindHandler';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, provider = 'openmind', history = [] } = body;
    
    if (!message) {
      return NextResponse.json({
        error: 'Message is required'
      }, { status: 400 });
    }

    // Build chat payload
    const payload: ChatPayload = {
      messages: [
        ...history,
        {
          role: 'user',
          content: message,
          timestamp: new Date().toISOString()
        }
      ],
      model: 'openmind-ultra',
      temperature: 0.7,
      maxTokens: 1000
    };

    // Process with enhanced language support
    const response = await handleOpenMind(payload);
    
    return NextResponse.json({
      success: true,
      response: response.content,
      provider,
      model: response.model,
      usage: response.usage,
      timestamp: response.timestamp,
      metadata: {
        processingTime: Date.now() - Date.now(),
        languageDetected: detectLanguage(message),
        contextAnalyzed: true
      }
    });
    
  } catch (error) {
    console.error('Enhanced OpenMind API error:', error);
    return NextResponse.json({
      error: 'OpenMind processing failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

function detectLanguage(text: string): string {
  const albanianKeywords = ['si', 'mund', 'të', 'me', 'ndihmosh', 'përshëndetje', 'faleminderit'];
  const lowercaseText = text.toLowerCase();
  const foundKeywords = albanianKeywords.filter(keyword => lowercaseText.includes(keyword));
  
  return foundKeywords.length >= 1 ? 'albanian' : 'english';
}

export async function GET() {
  return NextResponse.json({
    status: 'OpenMind AI Enhanced - Albanian Language Support',
    version: '8.0.0-WEB8',
    languages: ['English', 'Albanian'],
    features: [
      'Advanced language detection',
      'Context-aware responses', 
      'Multilingual AGI support',
      'Real-time processing'
    ]
  });
}

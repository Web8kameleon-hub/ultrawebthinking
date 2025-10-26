import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { message, history } = await request.json();

    // Claude API integration (Anthropic)
    const claudeApiKey = process.env.CLAUDE_API_KEY;
    
    if (!claudeApiKey) {
      return NextResponse.json({
        success: false,
        error: 'Claude API key not configured'
      }, { status: 500 });
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': claudeApiKey,
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 1500,
        messages: [
          ...history?.map((msg: any) => ({
            role: msg.role === 'assistant' ? 'assistant' : 'user',
            content: msg.content
          })) || [],
          {
            role: 'user',
            content: message
          }
        ]
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json({
        success: false,
        error: `Claude API error: ${error.error?.message || 'Unknown error'}`
      }, { status: response.status });
    }

    const data = await response.json();
    const content = data.content[0]?.text || 'No response generated';

    return NextResponse.json({
      success: true,
      content,
      metadata: {
        provider: 'claude-3',
        model: 'claude-3-sonnet',
        usage: data.usage,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Claude API Error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}

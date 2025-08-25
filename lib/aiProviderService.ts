/**
 * Real AI Provider Integration for DualMind Engine
 * Enables connection to OpenAI, Anthropic, and other AI services
 */

export interface AIProvider {
  name: string;
  apiKey?: string;
  baseUrl: string;
  model: string;
}

export interface AIResponse {
  content: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export class AIProviderService {
  private static instance: AIProviderService;
  private providers: Map<string, AIProvider> = new Map();

  private constructor() {
    this.initializeProviders();
  }

  static getInstance(): AIProviderService {
    if (!AIProviderService.instance) {
      AIProviderService.instance = new AIProviderService();
    }
    return AIProviderService.instance;
  }

  private initializeProviders() {
    // OpenAI Configuration
    this.providers.set('openai', {
      name: 'OpenAI GPT',
      baseUrl: 'https://api.openai.com/v1',
      model: 'gpt-4',
      apiKey: process.env.OPENAI_API_KEY
    });

    // Anthropic Configuration
    this.providers.set('anthropic', {
      name: 'Anthropic Claude',
      baseUrl: 'https://api.anthropic.com/v1',
      model: 'claude-3-sonnet-20240229',
      apiKey: process.env.ANTHROPIC_API_KEY
    });

    // Google Gemini Configuration
    this.providers.set('gemini', {
      name: 'Google Gemini',
      baseUrl: 'https://generativelanguage.googleapis.com/v1',
      model: 'gemini-pro',
      apiKey: process.env.GOOGLE_API_KEY
    });
  }

  /**
   * Generate AI response using specified provider
   */
  async generateResponse(
    provider: string,
    prompt: string,
    systemPrompt?: string
  ): Promise<AIResponse | null> {
    const config = this.providers.get(provider);
    if (!config || !config.apiKey) {
      console.log(`Provider ${provider} not configured or missing API key`);
      return null;
    }

    try {
      switch (provider) {
        case 'openai':
          return await this.callOpenAI(config, prompt, systemPrompt);
        case 'anthropic':
          return await this.callAnthropic(config, prompt, systemPrompt);
        case 'gemini':
          return await this.callGemini(config, prompt, systemPrompt);
        default:
          console.log(`Unknown provider: ${provider}`);
          return null;
      }
    } catch (error) {
      console.error(`Error calling ${provider}:`, error);
      return null;
    }
  }

  /**
   * OpenAI API Integration
   */
  private async callOpenAI(
    config: AIProvider,
    prompt: string,
    systemPrompt?: string
  ): Promise<AIResponse | null> {
    const messages = [];
    
    if (systemPrompt) {
      messages.push({ role: 'system', content: systemPrompt });
    }
    messages.push({ role: 'user', content: prompt });

    const response = await fetch(`${config.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: config.model,
        messages,
        max_tokens: 500,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      content: data.choices[0]?.message?.content || '',
      usage: data.usage
    };
  }

  /**
   * Anthropic API Integration
   */
  private async callAnthropic(
    config: AIProvider,
    prompt: string,
    systemPrompt?: string
  ): Promise<AIResponse | null> {
    const fullPrompt = systemPrompt 
      ? `${systemPrompt}\n\nHuman: ${prompt}\n\nAssistant:`
      : `Human: ${prompt}\n\nAssistant:`;

    const response = await fetch(`${config.baseUrl}/messages`, {
      method: 'POST',
      headers: {
        'x-api-key': config.apiKey!,
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: config.model,
        max_tokens: 500,
        messages: [{ role: 'user', content: fullPrompt }]
      })
    });

    if (!response.ok) {
      throw new Error(`Anthropic API error: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      content: data.content[0]?.text || '',
      usage: data.usage
    };
  }

  /**
   * Google Gemini API Integration
   */
  private async callGemini(
    config: AIProvider,
    prompt: string,
    systemPrompt?: string
  ): Promise<AIResponse | null> {
    const fullPrompt = systemPrompt ? `${systemPrompt}\n\n${prompt}` : prompt;

    const response = await fetch(
      `${config.baseUrl}/models/${config.model}:generateContent?key=${config.apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: fullPrompt }]
          }],
          generationConfig: {
            maxOutputTokens: 500,
            temperature: 0.7
          }
        })
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      content: data.candidates[0]?.content?.parts[0]?.text || ''
    };
  }

  /**
   * Check which providers are available
   */
  getAvailableProviders(): string[] {
    return Array.from(this.providers.keys()).filter(
      key => this.providers.get(key)?.apiKey
    );
  }
}

export default AIProviderService;

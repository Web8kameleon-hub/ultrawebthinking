// backend/agi/semantic.ts
/**
 * SemanticAnalyzer.ts
 * Analizues semantik për procesimine e gjuhës natyrore
 * © Web8 UltraThinking – Ledjan Ahmati
 */

export class SemanticAnalyzer {
  /**
   * Analizon një tekst dhe kthen strukturën semantike
   */
  static async parse(input: string): Promise<any> {
    const tokens = input.split(/\s+/);
    
    const analysis = {
      tokens,
      entities: this.extractEntities(input),
      intent: this.detectIntent(input),
      sentiment: this.analyzeSentiment(input),
      keywords: this.extractKeywords(tokens),
      complexity: this.measureComplexity(input)
    };
    
    return {
      success: true,
      data: analysis,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Klasifikon një tekst në kategori
   */
  static async classify(input: string): Promise<any> {
    const categories = {
      technical: /\b(code|programming|software|algorithm|database)\b/i,
      business: /\b(revenue|profit|market|customer|sales)\b/i,
      creative: /\b(design|art|creative|innovation|idea)\b/i,
      analytical: /\b(data|analysis|report|statistics|metrics)\b/i,
      operational: /\b(process|workflow|procedure|operation|task)\b/i
    };

    const classification: Record<string, number> = {};
    let maxScore = 0;
    let primaryCategory = 'general';

    for (const [category, pattern] of Object.entries(categories)) {
      const matches = input.match(pattern);
      const score = matches ? matches.length : 0;
      classification[category] = score;
      
      if (score > maxScore) {
        maxScore = score;
        primaryCategory = category;
      }
    }

    return {
      success: true,
      data: {
        primaryCategory,
        scores: classification,
        confidence: maxScore > 0 ? (maxScore / input.split(/\s+/).length) * 100 : 0
      },
      timestamp: new Date().toISOString()
    };
  }

  private static extractEntities(text: string): string[] {
    // Simple entity extraction - në praktikë do të përdornim NLP libraries
    const entityPatterns = [
      /\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b/g, // Proper nouns
      /\b\d+(?:\.\d+)?\b/g, // Numbers
      /\b[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\b/g // Emails
    ];

    const entities: string[] = [];
    entityPatterns.forEach(pattern => {
      const matches = text.match(pattern) || [];
      entities.push(...matches);
    });

    return [...new Set(entities)]; // Remove duplicates
  }

  private static detectIntent(text: string): string {
    const intents = {
      question: /\b(what|who|when|where|why|how|is|are|can|could|would|should)\b/i,
      request: /\b(please|can you|could you|would you|help|assist)\b/i,
      command: /\b(do|create|make|build|generate|analyze|process)\b/i,
      information: /\b(tell me|show me|explain|describe|define)\b/i
    };

    for (const [intent, pattern] of Object.entries(intents)) {
      if (pattern.test(text)) {
        return intent;
      }
    }

    return 'statement';
  }

  private static analyzeSentiment(text: string): string {
    const positiveWords = /\b(good|great|excellent|amazing|wonderful|fantastic|positive|happy|success)\b/gi;
    const negativeWords = /\b(bad|terrible|awful|horrible|negative|sad|failure|problem|issue|error)\b/gi;

    const positiveMatches = (text.match(positiveWords) || []).length;
    const negativeMatches = (text.match(negativeWords) || []).length;

    if (positiveMatches > negativeMatches) return 'positive';
    if (negativeMatches > positiveMatches) return 'negative';
    return 'neutral';
  }

  private static extractKeywords(tokens: string[]): string[] {
    // Filter out common stop words
    const stopWords = new Set([
      'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
      'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did',
      'will', 'would', 'could', 'should', 'may', 'might', 'must', 'can', 'this', 'that', 'these', 'those'
    ]);

    return tokens
      .filter(token => token.length > 2 && !stopWords.has(token.toLowerCase()))
      .map(token => token.toLowerCase())
      .filter((token, index, arr) => arr.indexOf(token) === index) // Remove duplicates
      .slice(0, 10); // Top 10 keywords
  }

  private static measureComplexity(text: string): number {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const words = text.split(/\s+/).filter(w => w.trim().length > 0);
    const avgWordsPerSentence = words.length / Math.max(sentences.length, 1);
    
    // Simple complexity score based on sentence length and word variety
    const uniqueWords = new Set(words.map(w => w.toLowerCase())).size;
    const lexicalDiversity = uniqueWords / Math.max(words.length, 1);
    
    return Math.round((avgWordsPerSentence * 0.6 + lexicalDiversity * 40) * 10) / 10;
  }
}

/**
 * AGI Sense Module - Real Input Analysis
 * Analyzes user input for keywords, intent, language
 * @author Ledjan Ahmati
 * @version 8.0.0 Real
 */

export interface SenseResult {
  keywords: string[];
  intent: 'search' | 'question' | 'command' | 'chat' | 'navigate' | 'unknown';
  language: 'sq' | 'en' | 'de' | 'unknown';
  confidence: number;
  sentiment: 'positive' | 'neutral' | 'negative';
  entities: string[];
}

/**
 * Analyze input text and extract meaningful information
 */
export async function analyzeInput(input: string): Promise<SenseResult> {
  if (!input || !input.trim()) {
    return {
      keywords: [],
      intent: 'unknown',
      language: 'unknown',
      confidence: 0,
      sentiment: 'neutral',
      entities: []
    };
  }

  const text = input.toLowerCase().trim();
  
  // Detect language
  const language = detectLanguage(text);
  
  // Extract keywords (simple word extraction)
  const keywords = extractKeywords(text);
  
  // Detect intent
  const intent = detectIntent(text, keywords);
  
  // Detect sentiment
  const sentiment = detectSentiment(text);
  
  // Extract entities (names, places, etc.)
  const entities = extractEntities(text);
  
  // Calculate confidence based on keyword matches and clarity
  const confidence = calculateConfidence(keywords, intent, text);

  return {
    keywords,
    intent,
    language,
    confidence,
    sentiment,
    entities
  };
}

function detectLanguage(text: string): 'sq' | 'en' | 'de' | 'unknown' {
  // Albanian indicators
  const albanianWords = ['të', 'në', 'dhe', 'për', 'me', 'nga', 'si', 'kjo', 'ky', 'çfarë', 'ku', 'kur', 'pse'];
  
  // English indicators  
  const englishWords = ['the', 'and', 'for', 'with', 'from', 'how', 'what', 'where', 'when', 'why'];
  
  // German indicators
  const germanWords = ['der', 'die', 'das', 'und', 'für', 'mit', 'von', 'wie', 'was', 'wo', 'wann', 'warum'];

  const albScore = albanianWords.filter(word => text.includes(word)).length;
  const engScore = englishWords.filter(word => text.includes(word)).length;
  const gerScore = germanWords.filter(word => text.includes(word)).length;

  if (albScore > engScore && albScore > gerScore) return 'sq';
  if (engScore > gerScore) return 'en';
  if (gerScore > 0) return 'de';
  
  return 'unknown';
}

function extractKeywords(text: string): string[] {
  // Remove common stop words and extract meaningful terms
  const stopWords = ['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'të', 'në', 'dhe', 'për', 'me', 'nga'];
  
  const words = text
    .split(/\s+/)
    .map(word => word.replace(/[^\w]/g, ''))
    .filter(word => word.length > 2)
    .filter(word => !stopWords.includes(word));
    
  // Return unique keywords
  return [...new Set(words)];
}

function detectIntent(text: string, keywords: string[]): 'search' | 'question' | 'command' | 'chat' | 'navigate' | 'unknown' {
  // Question indicators
  if (text.includes('?') || keywords.some(k => ['what', 'how', 'why', 'when', 'where', 'çfarë', 'si', 'pse', 'kur', 'ku'].includes(k))) {
    return 'question';
  }
  
  // Navigation indicators
  if (keywords.some(k => ['go', 'navigate', 'direction', 'map', 'location', 'navigo', 'shko', 'drejtim'].includes(k))) {
    return 'navigate';
  }
  
  // Search indicators
  if (keywords.some(k => ['search', 'find', 'lookup', 'kërko', 'gjej'].includes(k))) {
    return 'search';
  }
  
  // Command indicators
  if (keywords.some(k => ['create', 'delete', 'update', 'run', 'execute', 'krijo', 'fshij', 'përditëso', 'ekzekuto'].includes(k))) {
    return 'command';
  }
  
  // Default to chat for conversational input
  return 'chat';
}

function detectSentiment(text: string): 'positive' | 'neutral' | 'negative' {
  const positiveWords = ['good', 'great', 'excellent', 'amazing', 'perfect', 'love', 'mirë', 'shkëlqyeshëm', 'përsosur'];
  const negativeWords = ['bad', 'terrible', 'awful', 'hate', 'wrong', 'error', 'keq', 'gabim', 'problem'];
  
  const posScore = positiveWords.filter(word => text.includes(word)).length;
  const negScore = negativeWords.filter(word => text.includes(word)).length;
  
  if (posScore > negScore) return 'positive';
  if (negScore > posScore) return 'negative';
  return 'neutral';
}

function extractEntities(text: string): string[] {
  // Simple entity extraction - look for capitalized words
  const words = text.split(/\s+/);
  const entities = words
    .filter(word => /^[A-Z][a-z]+/.test(word))
    .filter(word => word.length > 2);
    
  return [...new Set(entities)];
}

function calculateConfidence(keywords: string[], intent: string, text: string): number {
  let confidence = 0.5; // Base confidence
  
  // More keywords = higher confidence
  confidence += Math.min(keywords.length * 0.1, 0.3);
  
  // Clear intent indicators
  if (intent !== 'unknown') confidence += 0.2;
  
  // Reasonable text length
  if (text.length > 5 && text.length < 200) confidence += 0.1;
  
  return Math.min(confidence, 1.0);
}

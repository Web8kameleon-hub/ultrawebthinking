// backend/agi/semantic.ts
/**
 * SemanticAnalyzer.ts - Real Modular Instance-Based Architecture
 * Analizues semantik për procesimine e gjuhës natyrore
 * © Web8 UltraThinking – Ledjan Ahmati
 */

export class SemanticAnalyzer {
  private knowledge: Map<string, any> = new Map();
  private context: any = {};
  private learningData: Map<string, any> = new Map();

  constructor() {
    this.initializeKnowledge();
  }

  private initializeKnowledge(): void {
    // Initialize semantic knowledge base
    this.knowledge.set('entities', new Map());
    this.knowledge.set('patterns', new Map());
    this.knowledge.set('relationships', new Map());
    this.knowledge.set('intents', new Map());
  }

  /**
   * Real-time semantic analysis
   */
  async analyze(text: string, context?: any): Promise<any> {
    const tokens = this.tokenize(text);
    const entities = await this.extractEntities(tokens);
    const sentiment = await this.analyzeSentiment(text);
    const intent = await this.detectIntent(text, context);
    const keywords = this.extractKeywords(tokens);

    const analysis = {
      text,
      tokens,
      entities,
      sentiment,
      intent,
      keywords,
      confidence: this.calculateConfidence(entities, sentiment, intent),
      analysis_id: `sa_${Date.now()}`,
      session: context?.session?.id || 'default',
      timestamp: new Date().toISOString()
    };

    // Store analysis for learning
    this.learningData.set(analysis.analysis_id, analysis);

    return analysis;
  }

  /**
   * Dynamic classification
   */
  async classify(text: string, context?: any): Promise<any> {
    const features = await this.extractFeatures(text);
    const categories = await this.categorize(features, context);
    
    const classification = {
      text,
      categories,
      features,
      confidence: this.calculateClassificationConfidence(features),
      classification_id: `cl_${Date.now()}`,
      session: context?.session?.id || 'default',
      timestamp: new Date().toISOString()
    };

    // Update knowledge with classification data
    this.updateClassificationKnowledge(classification);

    return classification;
  }

  /**
   * Dynamic learning from input
   */
  async learn(input: string, context?: any): Promise<any> {
    // Extract patterns and update knowledge
    const patterns = this.extractPatterns(input);
    const entities = await this.extractEntities(this.tokenize(input));
    const newIntents = this.discoverIntents(input, context);
    
    // Update knowledge base
    patterns.forEach(pattern => {
      this.knowledge.get('patterns')?.set(pattern.id, pattern);
    });

    entities.forEach(entity => {
      const existing = this.knowledge.get('entities')?.get(entity.name);
      if (existing) {
        existing.frequency += 1;
        existing.confidence = Math.min(1.0, existing.confidence + 0.1);
      } else {
        this.knowledge.get('entities')?.set(entity.name, entity);
      }
    });

    newIntents.forEach(intent => {
      this.knowledge.get('intents')?.set(intent.pattern, intent);
    });

    const learningResult = {
      learned: true,
      input,
      new_patterns: patterns.length,
      new_entities: entities.length,
      new_intents: newIntents.length,
      knowledge_size: this.getTotalKnowledgeSize(),
      learning_id: `ln_${Date.now()}`,
      session: context?.session?.id || 'default',
      timestamp: new Date().toISOString()
    };

    // Store learning session
    this.learningData.set(learningResult.learning_id, learningResult);

    return learningResult;
  }

  private tokenize(text: string): string[] {
    return text.toLowerCase()
      .replace(/[^\w\s\-]/g, '')
      .split(/\s+/)
      .filter(token => token.length > 0);
  }

  private async extractEntities(tokens: string[]): Promise<any[]> {
    const entities: any[] = [];
    
    tokens.forEach((token, index) => {
      if (token.length > 2) {
        const entityType = this.determineEntityType(token);
        const confidence = this.calculateEntityConfidence(token, entityType);
        
        entities.push({
          name: token,
          type: entityType,
          position: index,
          confidence,
          frequency: this.getEntityFrequency(token),
          context_score: this.calculateContextScore(token, tokens, index)
        });
      }
    });

    return entities.filter(e => e.confidence > 0.3); // Filter low-confidence entities
  }

  private async analyzeSentiment(text: string): Promise<any> {
    const positiveWords = ['good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic', 'perfect'];
    const negativeWords = ['bad', 'terrible', 'awful', 'horrible', 'worst', 'hate', 'disgusting'];
    const neutralWords = ['okay', 'fine', 'normal', 'standard', 'regular'];
    
    let score = 0;
    let wordCount = 0;
    const words = text.toLowerCase().split(/\s+/);
    
    words.forEach(word => {
      if (positiveWords.includes(word)) {
        score += 1;
        wordCount++;
      } else if (negativeWords.includes(word)) {
        score -= 1;
        wordCount++;
      } else if (neutralWords.includes(word)) {
        wordCount++;
      }
    });

    const normalizedScore = wordCount > 0 ? score / wordCount : 0;
    const intensity = Math.abs(normalizedScore);

    return {
      score: Math.max(-1, Math.min(1, normalizedScore)),
      label: normalizedScore > 0.1 ? 'positive' : normalizedScore < -0.1 ? 'negative' : 'neutral',
      intensity,
      confidence: Math.min(1.0, intensity + 0.5),
      word_count: wordCount,
      total_words: words.length
    };
  }

  private async detectIntent(text: string, context?: any): Promise<any> {
    const intentPatterns = new Map([
      ['question', /\b(what|how|when|where|why|which|who|can|could|would|should|is|are|do|does)\b/i],
      ['command', /\b(run|execute|start|stop|create|delete|update|modify|change)\b/i],
      ['request', /\b(please|could you|can you|would you|help me|assist)\b/i],
      ['information', /\b(tell me|show me|explain|describe|define|list)\b/i],
      ['analysis', /\b(analyze|examine|investigate|study|review|assess)\b/i],
      ['optimization', /\b(optimize|improve|enhance|boost|speed up|faster)\b/i],
      ['configuration', /\b(configure|setup|install|settings|options|preferences)\b/i]
    ]);

    let bestMatch: { intent: string; confidence: number; pattern: string | null; matches: string[] } = { 
      intent: 'general', 
      confidence: 0.3, 
      pattern: null, 
      matches: [] 
    };

    for (const [intent, pattern] of intentPatterns) {
      const matches = text.match(pattern);
      if (matches) {
        const confidence = Math.min(1.0, 0.7 + (matches.length * 0.1));
        if (confidence > bestMatch.confidence) {
          bestMatch = {
            intent,
            confidence,
            pattern: pattern.source,
            matches: Array.from(matches)
          };
        }
      }
    }

    // Consider context for intent detection
    if (context?.session?.lastResult) {
      bestMatch.confidence = Math.min(1.0, bestMatch.confidence + 0.1);
    }

    return bestMatch;
  }

  private extractFeatures(text: string): any {
    const words = text.split(/\s+/);
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    
    return {
      length: text.length,
      word_count: words.length,
      sentence_count: sentences.length,
      avg_word_length: words.reduce((sum, word) => sum + word.length, 0) / words.length,
      complexity: this.calculateComplexity(text),
      keywords: this.extractKeywords(words),
      readability: this.calculateReadability(words, sentences),
      language_detected: this.detectLanguage(text)
    };
  }

  private async categorize(features: any, context?: any): Promise<string[]> {
    const categories = [];
    
    // Technical category
    if (features.keywords.some((kw: string) => ['api', 'code', 'function', 'server', 'database'].includes(kw))) {
      categories.push('technical');
    }
    
    // Business category
    if (features.keywords.some((kw: string) => ['project', 'business', 'strategy', 'plan', 'goal'].includes(kw))) {
      categories.push('business');
    }
    
    // Complex category
    if (features.complexity > 0.7) {
      categories.push('complex');
    }
    
    // Simple category
    if (features.complexity < 0.3) {
      categories.push('simple');
    }
    
    // Default to general if no specific category
    if (categories.length === 0) {
      categories.push('general');
    }
    
    return categories;
  }

  private extractPatterns(text: string): any[] {
    const patterns: any[] = [];
    const words = text.split(/\s+/);
    
    // Extract bigrams
    for (let i = 0; i < words.length - 1; i++) {
      patterns.push({
        id: `bigram_${i}_${Date.now()}`,
        type: 'bigram',
        sequence: [words[i], words[i + 1]],
        frequency: 1,
        confidence: 0.6
      });
    }
    
    // Extract trigrams
    for (let i = 0; i < words.length - 2; i++) {
      patterns.push({
        id: `trigram_${i}_${Date.now()}`,
        type: 'trigram',
        sequence: [words[i], words[i + 1], words[i + 2]],
        frequency: 1,
        confidence: 0.8
      });
    }
    
    return patterns;
  }

  private discoverIntents(text: string, context?: any): any[] {
    const newIntents: any[] = [];
    
    // Discover new intent patterns
    const words = text.toLowerCase().split(/\s+/);
    const verbs = words.filter(word => this.isVerb(word));
    
    verbs.forEach(verb => {
      if (!this.knowledge.get('intents')?.has(verb)) {
        newIntents.push({
          pattern: verb,
          type: 'action',
          confidence: 0.5,
          discovered_at: Date.now(),
          context: context?.session?.id || 'default'
        });
      }
    });
    
    return newIntents;
  }

  private determineEntityType(token: string): string {
    if (/^\d+$/.test(token)) return 'number';
    if (/^\d+\.\d+$/.test(token)) return 'decimal';
    if (token.includes('@')) return 'email';
    if (token.startsWith('http')) return 'url';
    if (/^[A-Z][a-z]+$/.test(token)) return 'proper_noun';
    if (this.isVerb(token)) return 'verb';
    if (this.isAdjective(token)) return 'adjective';
    return 'general';
  }

  private calculateComplexity(text: string): number {
    const words = text.split(/\s+/);
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const avgWordsPerSentence = words.length / Math.max(1, sentences.length);
    const avgWordLength = words.reduce((sum, word) => sum + word.length, 0) / words.length;
    const uniqueWords = new Set(words.map(w => w.toLowerCase())).size;
    const lexicalDiversity = uniqueWords / words.length;
    
    return (avgWordsPerSentence * 0.3 + avgWordLength * 0.3 + lexicalDiversity * 0.4) / 10;
  }

  private extractKeywords(words: string[]): string[] {
    // Filter out common words and extract meaningful keywords
    const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should']);
    
    return words
      .filter(word => word.length > 3 && !stopWords.has(word.toLowerCase()))
      .slice(0, 10); // Top 10 keywords
  }

  private calculateReadability(words: string[], sentences: any[]): number {
    const avgWordsPerSentence = words.length / Math.max(1, sentences.length);
    const avgSyllablesPerWord = words.reduce((sum, word) => sum + this.countSyllables(word), 0) / words.length;
    
    // Simplified Flesch Reading Ease
    return Math.max(0, Math.min(100, 206.835 - (1.015 * avgWordsPerSentence) - (84.6 * avgSyllablesPerWord)));
  }

  private detectLanguage(text: string): string {
    // Simple language detection
    const englishWords = ['the', 'and', 'or', 'but', 'is', 'are', 'was', 'were'];
    const albanianWords = ['dhe', 'ose', 'por', 'është', 'janë', 'ishte', 'ishin'];
    
    const words = text.toLowerCase().split(/\s+/);
    let englishCount = 0;
    let albanianCount = 0;
    
    words.forEach(word => {
      if (englishWords.includes(word)) englishCount++;
      if (albanianWords.includes(word)) albanianCount++;
    });
    
    if (englishCount > albanianCount) return 'english';
    if (albanianCount > englishCount) return 'albanian';
    return 'unknown';
  }

  private calculateConfidence(entities: any[], sentiment: any, intent: any): number {
    const entityConfidence = entities.length > 0 ? entities.reduce((sum, e) => sum + e.confidence, 0) / entities.length : 0.3;
    return Math.min(1.0, (entityConfidence * 0.4 + sentiment.confidence * 0.3 + intent.confidence * 0.3));
  }

  private calculateClassificationConfidence(features: any): number {
    let confidence = 0.5;
    
    if (features.keywords.length > 3) confidence += 0.2;
    if (features.complexity > 0.5) confidence += 0.1;
    if (features.word_count > 10) confidence += 0.1;
    if (features.readability > 50) confidence += 0.1;
    
    return Math.min(1.0, confidence);
  }

  private calculateEntityConfidence(token: string, type: string): number {
    let confidence = 0.5;
    
    // Boost confidence for specific types
    if (type === 'number' || type === 'decimal') confidence += 0.3;
    if (type === 'email' || type === 'url') confidence += 0.4;
    if (type === 'proper_noun') confidence += 0.2;
    
    // Consider frequency in knowledge base
    const frequency = this.getEntityFrequency(token);
    confidence += Math.min(0.3, frequency * 0.1);
    
    return Math.min(1.0, confidence);
  }

  private calculateContextScore(token: string, tokens: string[], position: number): number {
    let score = 0.5;
    
    // Consider surrounding words
    if (position > 0) {
      const prevToken = tokens[position - 1];
      if (this.areRelated(prevToken, token)) score += 0.2;
    }
    
    if (position < tokens.length - 1) {
      const nextToken = tokens[position + 1];
      if (this.areRelated(token, nextToken)) score += 0.2;
    }
    
    return Math.min(1.0, score);
  }

  private getEntityFrequency(token: string): number {
    const entity = this.knowledge.get('entities')?.get(token);
    return entity?.frequency || 0;
  }

  private updateClassificationKnowledge(classification: any): void {
    // Update classification patterns in knowledge base
    classification.categories.forEach((category: string) => {
      const existing = this.knowledge.get('patterns')?.get(category) || { count: 0, features: [] };
      existing.count += 1;
      existing.features.push(classification.features);
      this.knowledge.get('patterns')?.set(category, existing);
    });
  }

  private getTotalKnowledgeSize(): number {
    let total = 0;
    this.knowledge.forEach(map => {
      total += map.size;
    });
    return total;
  }

  private isVerb(word: string): boolean {
    const commonVerbs = ['run', 'execute', 'create', 'delete', 'update', 'analyze', 'process', 'generate', 'optimize'];
    return commonVerbs.includes(word.toLowerCase()) || word.endsWith('ing') || word.endsWith('ed');
  }

  private isAdjective(word: string): boolean {
    const commonAdjectives = ['good', 'bad', 'great', 'small', 'large', 'fast', 'slow', 'easy', 'hard', 'simple', 'complex'];
    return commonAdjectives.includes(word.toLowerCase()) || word.endsWith('ly');
  }

  private areRelated(word1: string, word2: string): boolean {
    // Simple relatedness check
    const relationships = this.knowledge.get('relationships');
    return relationships?.has(`${word1}_${word2}`) || word1.includes(word2) || word2.includes(word1);
  }

  private countSyllables(word: string): number {
    // Simple syllable counting
    return Math.max(1, word.toLowerCase().replace(/[^aeiou]/g, '').length);
  }

  /**
   * Get current knowledge state
   */
  getKnowledgeStats(): any {
    return {
      total_patterns: this.knowledge.get('patterns')?.size || 0,
      total_entities: this.knowledge.get('entities')?.size || 0,
      total_relationships: this.knowledge.get('relationships')?.size || 0,
      total_intents: this.knowledge.get('intents')?.size || 0,
      learning_sessions: this.learningData.size,
      memory_usage: this.calculateMemoryUsage(),
      last_update: new Date().toISOString()
    };
  }

  private calculateMemoryUsage(): number {
    return JSON.stringify({
      knowledge: Array.from(this.knowledge.entries()),
      learning: Array.from(this.learningData.entries())
    }).length;
  }

  /**
   * Export knowledge for backup/analysis
   */
  exportKnowledge(): any {
    return {
      knowledge: Object.fromEntries(this.knowledge),
      learningData: Object.fromEntries(this.learningData),
      exportedAt: new Date().toISOString()
    };
  }

  /**
   * Import knowledge from backup
   */
  importKnowledge(data: any): boolean {
    try {
      if (data.knowledge) {
        this.knowledge = new Map(Object.entries(data.knowledge));
      }
      if (data.learningData) {
        this.learningData = new Map(Object.entries(data.learningData));
      }
      return true;
    } catch (error) {
      return false;
    }
  }
}

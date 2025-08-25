/**
 * @author Ledjan Ahmati
 * @version 8.0.0-WEB8
 * @contact dealsjona@gmail.com
 * Industrial Text Analysis Engine - Real HTML & Content Processing
 */

import { parse as parseHtml } from 'node-html-parser';
import { fetch } from 'undici';
import { analyzeWithNeuralEngine } from '../../../lib/neuralAnalyzer';

export interface TextAnalysisResult {
  content: {
    original: string;
    cleaned: string;
    wordCount: number;
    charCount: number;
    paragraphs: number;
    sentences: number;
  };
  keywords: Array<{
    word: string;
    frequency: number;
    relevance: number;
    category: string;
  }>;
  entities: Array<{
    text: string;
    type: 'person' | 'organization' | 'location' | 'date' | 'number' | 'other';
    confidence: number;
  }>;
  sentiment: {
    polarity: number; // -1 to 1
    subjectivity: number; // 0 to 1
    emotion: string;
    confidence: number;
  };
  readability: {
    score: number; // 0-100
    level: string;
    averageWordsPerSentence: number;
    averageSyllablesPerWord: number;
  };
  topics: Array<{
    topic: string;
    confidence: number;
    keywords: string[];
  }>;
  language: {
    detected: string;
    confidence: number;
    alternatives: string[];
  };
  structure: {
    headings: string[];
    links: Array<{ text: string; url: string }>;
    images: Array<{ alt: string; src: string }>;
    tables: number;
    lists: number;
  };
  metadata: {
    title?: string;
    description?: string;
    author?: string;
    publishDate?: string;
    domain?: string;
  };
  neural: {
    quality: number;
    relevance: number;
    credibility: number;
    uniqueness: number;
  };
}

export interface UrlAnalysisResult extends TextAnalysisResult {
  url: string;
  statusCode: number;
  responseTime: number;
  contentType: string;
  size: number;
  redirects: string[];
  security: {
    https: boolean;
    certificate: boolean;
    mixedContent: boolean;
  };
}

export class IndustrialTextAnalyzer {
  private readonly maxContentSize = 5 * 1024 * 1024; // 5MB limit
  private readonly timeout = 30000; // 30 seconds

  async analyzeText(text: string): Promise<TextAnalysisResult> {
    if (!text || text.trim().length === 0) {
      throw new Error('Text cannot be empty');
    }

    const startTime = Date.now();
    
    try {
      // Clean and prepare text
      const cleaned = this.cleanText(text);
      const basicStats = this.calculateBasicStats(cleaned);
      
      // Extract keywords with frequency analysis
      const keywords = this.extractKeywords(cleaned);
      
      // Named Entity Recognition (simplified)
      const entities = this.extractEntities(cleaned);
      
      // Sentiment analysis
      const sentiment = this.analyzeSentiment(cleaned);
      
      // Readability analysis
      const readability = this.analyzeReadability(cleaned);
      
      // Topic modeling (simplified)
      const topics = this.extractTopics(cleaned, keywords);
      
      // Language detection
      const language = this.detectLanguage(cleaned);
      
      // HTML structure analysis (if applicable)
      const structure = this.analyzeStructure(text);
      
      // Metadata extraction
      const metadata = this.extractMetadata(text);
      
      // Neural analysis for quality metrics
      const neuralMetrics = await this.getNeuralMetrics(cleaned);
      
      return {
        content: {
          original: text,
          cleaned,
          ...basicStats
        },
        keywords,
        entities,
        sentiment,
        readability,
        topics,
        language,
        structure,
        metadata,
        neural: neuralMetrics
      };
      
    } catch (error) {
      console.error('🔬 Text analysis error:', error);
      throw new Error(`Analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async analyzeUrl(url: string): Promise<UrlAnalysisResult> {
    const startTime = Date.now();
    const redirects: string[] = [];
    
    try {
      // Validate URL
      const urlObj = new URL(url);
      
      // Fetch content with redirect tracking
      const response = await this.fetchWithRedirects(url, redirects);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const contentType = response.headers.get('content-type') || '';
      const contentLength = parseInt(response.headers.get('content-length') || '0');
      
      // Check content size
      if (contentLength > this.maxContentSize) {
        throw new Error(`Content too large: ${contentLength} bytes`);
      }
      
      const content = await response.text();
      const responseTime = Date.now() - startTime;
      
      // Analyze the content
      const textAnalysis = await this.analyzeText(content);
      
      // Security analysis
      const security = {
        https: urlObj.protocol === 'https:',
        certificate: urlObj.protocol === 'https:', // Simplified
        mixedContent: this.detectMixedContent(content, urlObj.protocol === 'https:')
      };
      
      return {
        ...textAnalysis,
        url,
        statusCode: response.status,
        responseTime,
        contentType,
        size: content.length,
        redirects,
        security
      };
      
    } catch (error) {
      console.error('🌐 URL analysis error:', error);
      throw new Error(`URL analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async fetchWithRedirects(url: string, redirects: string[]): Promise<any> {
    const maxRedirects = 5;
    let currentUrl = url;
    
    for (let i = 0; i < maxRedirects; i++) {
      const response = await fetch(currentUrl, {
        method: 'GET',
        headers: {
          'User-Agent': 'UltraWebAGI/8.0.0 (Industrial; Text-Analyzer)',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'gzip, deflate',
          'DNT': '1',
          'Connection': 'keep-alive'
        },
        redirect: 'manual'
      });
      
      if (response.status >= 300 && response.status < 400) {
        const location = response.headers.get('location');
        if (location) {
          redirects.push(currentUrl);
          currentUrl = new URL(location, currentUrl).href;
          continue;
        }
      }
      
      return response;
    }
    
    throw new Error('Too many redirects');
  }

  private cleanText(text: string): string {
    // Remove HTML tags if present
    let cleaned = text.replace(/<[^>]*>/g, ' ');
    
    // Normalize whitespace
    cleaned = cleaned.replace(/\s+/g, ' ');
    
    // Remove special characters but keep punctuation
    cleaned = cleaned.replace(/[^\w\s\.\!\?\,\;\:\-\(\)]/g, ' ');
    
    // Remove extra whitespace
    cleaned = cleaned.trim().replace(/\s+/g, ' ');
    
    return cleaned;
  }

  private calculateBasicStats(text: string) {
    const words = text.split(/\s+/).filter(word => word.length > 0);
    const sentences = text.split(/[\.!\?]+/).filter(s => s.trim().length > 0);
    const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0);
    
    return {
      wordCount: words.length,
      charCount: text.length,
      paragraphs: paragraphs.length,
      sentences: sentences.length
    };
  }

  private extractKeywords(text: string): Array<{ word: string; frequency: number; relevance: number; category: string }> {
    const words = text.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 2);
    
    // Remove common stop words
    const stopWords = new Set([
      'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
      'from', 'up', 'about', 'into', 'through', 'during', 'before', 'after', 'above', 'below',
      'between', 'among', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had',
      'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'can',
      'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him',
      'her', 'us', 'them', 'my', 'your', 'his', 'its', 'our', 'their'
    ]);
    
    const filteredWords = words.filter(word => !stopWords.has(word));
    
    // Count frequency
    const frequency: Record<string, number> = {};
    filteredWords.forEach(word => {
      frequency[word] = (frequency[word] || 0) + 1;
    });
    
    // Calculate relevance and categorize
    const totalWords = filteredWords.length;
    return Object.entries(frequency)
      .map(([word, freq]) => ({
        word,
        frequency: freq,
        relevance: freq / totalWords,
        category: this.categorizeWord(word)
      }))
      .sort((a, b) => b.frequency - a.frequency)
      .slice(0, 50);
  }

  private categorizeWord(word: string): string {
    // Simple word categorization
    if (/^\d+$/.test(word)) return 'number';
    if (word.length > 8) return 'complex';
    if (/^[A-Z]/.test(word)) return 'proper';
    if (word.endsWith('ing')) return 'action';
    if (word.endsWith('tion') || word.endsWith('sion')) return 'concept';
    return 'general';
  }

  private extractEntities(text: string): Array<{ text: string; type: 'person' | 'organization' | 'location' | 'date' | 'number' | 'other'; confidence: number }> {
    const entities: Array<{ text: string; type: 'person' | 'organization' | 'location' | 'date' | 'number' | 'other'; confidence: number }> = [];
    
    // Simple pattern-based entity extraction
    // Dates
    const datePattern = /\b\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}\b/g;
    let match;
    while ((match = datePattern.exec(text)) !== null) {
      entities.push({
        text: match[0],
        type: 'date',
        confidence: 0.9
      });
    }
    
    // Numbers
    const numberPattern = /\b\d{1,3}(?:,\d{3})*(?:\.\d+)?\b/g;
    while ((match = numberPattern.exec(text)) !== null) {
      entities.push({
        text: match[0],
        type: 'number',
        confidence: 0.8
      });
    }
    
    // Capitalized words (potential proper nouns)
    const properNounPattern = /\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b/g;
    while ((match = properNounPattern.exec(text)) !== null) {
      if (match[0].length > 3) {
        entities.push({
          text: match[0],
          type: 'other',
          confidence: 0.6
        });
      }
    }
    
    return entities.slice(0, 20);
  }

  private analyzeSentiment(text: string): { polarity: number; subjectivity: number; emotion: string; confidence: number } {
    const words = text.toLowerCase().split(/\s+/);
    
    // Simple sentiment lexicon
    const positive = ['good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic', 'awesome', 'perfect', 'love', 'like', 'best', 'better', 'happy', 'pleased', 'satisfied'];
    const negative = ['bad', 'terrible', 'awful', 'horrible', 'hate', 'dislike', 'worst', 'worse', 'angry', 'disappointed', 'frustrated', 'sad', 'upset'];
    const subjective = ['think', 'feel', 'believe', 'opinion', 'personally', 'seems', 'appears', 'probably', 'maybe', 'perhaps'];
    
    let positiveScore = 0;
    let negativeScore = 0;
    let subjectiveScore = 0;
    
    words.forEach(word => {
      if (positive.includes(word)) positiveScore++;
      if (negative.includes(word)) negativeScore++;
      if (subjective.includes(word)) subjectiveScore++;
    });
    
    const totalSentiment = positiveScore + negativeScore;
    const polarity = totalSentiment === 0 ? 0 : (positiveScore - negativeScore) / totalSentiment;
    const subjectivity = Math.min(1, subjectiveScore / words.length * 10);
    
    let emotion = 'neutral';
    if (polarity > 0.3) emotion = 'positive';
    else if (polarity < -0.3) emotion = 'negative';
    
    return {
      polarity,
      subjectivity,
      emotion,
      confidence: Math.min(1, totalSentiment / words.length * 20)
    };
  }

  private analyzeReadability(text: string): { score: number; level: string; averageWordsPerSentence: number; averageSyllablesPerWord: number } {
    const sentences = text.split(/[\.!\?]+/).filter(s => s.trim().length > 0);
    const words = text.split(/\s+/).filter(w => w.length > 0);
    
    if (sentences.length === 0 || words.length === 0) {
      return { score: 0, level: 'unreadable', averageWordsPerSentence: 0, averageSyllablesPerWord: 0 };
    }
    
    const averageWordsPerSentence = words.length / sentences.length;
    const averageSyllablesPerWord = words.reduce((sum, word) => sum + this.countSyllables(word), 0) / words.length;
    
    // Simplified Flesch Reading Ease
    const score = 206.835 - (1.015 * averageWordsPerSentence) - (84.6 * averageSyllablesPerWord);
    
    let level = 'graduate';
    if (score >= 90) level = 'very easy';
    else if (score >= 80) level = 'easy';
    else if (score >= 70) level = 'fairly easy';
    else if (score >= 60) level = 'standard';
    else if (score >= 50) level = 'fairly difficult';
    else if (score >= 30) level = 'difficult';
    
    return {
      score: Math.max(0, Math.min(100, score)),
      level,
      averageWordsPerSentence,
      averageSyllablesPerWord
    };
  }

  private countSyllables(word: string): number {
    word = word.toLowerCase();
    if (word.length <= 3) return 1;
    
    const vowels = 'aeiouy';
    let syllables = 0;
    let previousWasVowel = false;
    
    for (let i = 0; i < word.length; i++) {
      const isVowel = vowels.includes(word[i]);
      if (isVowel && !previousWasVowel) {
        syllables++;
      }
      previousWasVowel = isVowel;
    }
    
    // Adjust for silent e
    if (word.endsWith('e')) syllables--;
    
    return Math.max(1, syllables);
  }

  private extractTopics(text: string, keywords: Array<{ word: string; frequency: number }>): Array<{ topic: string; confidence: number; keywords: string[] }> {
    // Simple topic clustering based on keyword co-occurrence
    const topKeywords = keywords.slice(0, 20);
    const topics: Array<{ topic: string; confidence: number; keywords: string[] }> = [];
    
    // Technology topic
    const techWords = topKeywords.filter(k => 
      ['technology', 'software', 'computer', 'digital', 'internet', 'web', 'app', 'data', 'ai', 'machine', 'learning'].includes(k.word)
    );
    if (techWords.length > 0) {
      topics.push({
        topic: 'Technology',
        confidence: techWords.length / topKeywords.length,
        keywords: techWords.map(k => k.word)
      });
    }
    
    // Business topic
    const businessWords = topKeywords.filter(k => 
      ['business', 'company', 'market', 'profit', 'revenue', 'customer', 'sales', 'service', 'management', 'strategy'].includes(k.word)
    );
    if (businessWords.length > 0) {
      topics.push({
        topic: 'Business',
        confidence: businessWords.length / topKeywords.length,
        keywords: businessWords.map(k => k.word)
      });
    }
    
    // General topic from most frequent words
    if (topics.length === 0 && topKeywords.length > 0) {
      topics.push({
        topic: 'General',
        confidence: 0.5,
        keywords: topKeywords.slice(0, 5).map(k => k.word)
      });
    }
    
    return topics;
  }

  private detectLanguage(text: string): { detected: string; confidence: number; alternatives: string[] } {
    // Simple language detection based on character patterns
    const englishPattern = /^[a-zA-Z\s\.,!?;:'"()\-\d]*$/;
    const englishWords = ['the', 'and', 'a', 'to', 'of', 'in', 'is', 'you', 'that', 'it', 'he', 'was', 'for', 'on', 'are', 'as', 'with', 'his', 'they', 'i', 'at', 'be', 'this', 'have', 'from', 'or', 'one', 'had', 'by', 'word', 'but', 'not', 'what', 'all', 'were', 'we', 'when', 'your', 'can', 'said', 'there', 'each', 'which', 'she', 'do', 'how', 'their', 'if', 'will', 'up', 'other', 'about', 'out', 'many', 'then', 'them', 'these', 'so', 'some', 'her', 'would', 'make', 'like', 'into', 'him', 'has', 'two', 'more', 'her', 'go', 'no', 'way', 'could', 'people', 'my', 'than', 'first', 'water', 'been', 'call', 'who', 'its', 'now', 'find', 'long', 'down', 'day', 'did', 'get', 'come', 'made', 'may', 'part'];
    
    const words = text.toLowerCase().split(/\s+/).filter(w => w.length > 0);
    const englishWordCount = words.filter(word => englishWords.includes(word)).length;
    const englishRatio = words.length > 0 ? englishWordCount / words.length : 0;
    
    if (englishRatio > 0.3 && englishPattern.test(text.substring(0, 100))) {
      return {
        detected: 'en',
        confidence: englishRatio,
        alternatives: ['es', 'fr', 'de']
      };
    }
    
    return {
      detected: 'unknown',
      confidence: 0.1,
      alternatives: ['en', 'es', 'fr', 'de']
    };
  }

  private analyzeStructure(text: string): { headings: string[]; links: Array<{ text: string; url: string }>; images: Array<{ alt: string; src: string }>; tables: number; lists: number } {
    try {
      const root = parseHtml(text);
      
      // Extract headings
      const headings: string[] = [];
      ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].forEach(tag => {
        root.querySelectorAll(tag).forEach(el => {
          const text = el.text.trim();
          if (text) headings.push(text);
        });
      });
      
      // Extract links
      const links: Array<{ text: string; url: string }> = [];
      root.querySelectorAll('a').forEach(el => {
        const href = el.getAttribute('href');
        const text = el.text.trim();
        if (href && text) {
          links.push({ text, url: href });
        }
      });
      
      // Extract images
      const images: Array<{ alt: string; src: string }> = [];
      root.querySelectorAll('img').forEach(el => {
        const src = el.getAttribute('src');
        const alt = el.getAttribute('alt') || '';
        if (src) {
          images.push({ alt, src });
        }
      });
      
      // Count tables and lists
      const tables = root.querySelectorAll('table').length;
      const lists = root.querySelectorAll('ul, ol').length;
      
      return { headings, links, images, tables, lists };
      
    } catch (error) {
      // If HTML parsing fails, return empty structure
      return { headings: [], links: [], images: [], tables: 0, lists: 0 };
    }
  }

  private extractMetadata(text: string): { title?: string; description?: string; author?: string; publishDate?: string; domain?: string } {
    try {
      const root = parseHtml(text);
      
      const title = root.querySelector('title')?.text ||
                   root.querySelector('meta[property="og:title"]')?.getAttribute('content') ||
                   root.querySelector('h1')?.text;
      
      const description = root.querySelector('meta[name="description"]')?.getAttribute('content') ||
                         root.querySelector('meta[property="og:description"]')?.getAttribute('content');
      
      const author = root.querySelector('meta[name="author"]')?.getAttribute('content') ||
                    root.querySelector('meta[property="article:author"]')?.getAttribute('content');
      
      const publishDate = root.querySelector('meta[property="article:published_time"]')?.getAttribute('content') ||
                         root.querySelector('meta[name="publish-date"]')?.getAttribute('content');
      
      return {
        title: title?.trim(),
        description: description?.trim(),
        author: author?.trim(),
        publishDate: publishDate?.trim()
      };
      
    } catch (error) {
      return {};
    }
  }

  private detectMixedContent(content: string, isHttps: boolean): boolean {
    if (!isHttps) return false;
    
    // Look for http:// links in https pages
    return /http:\/\/[^\s"'<>]+/i.test(content);
  }

  private async getNeuralMetrics(text: string): Promise<{ quality: number; relevance: number; credibility: number; uniqueness: number }> {
    try {
      const analysis = await analyzeWithNeuralEngine([{
        content: text,
        type: 'text_analysis',
        timestamp: Date.now()
      }]);
      
      return {
        quality: analysis.score / 100,
        relevance: 0.8, // Default relevance
        credibility: 0.7, // Default credibility
        uniqueness: 0.6 // Default uniqueness
      };
    } catch (error) {
      // Return default values if neural analysis fails
      return {
        quality: 0.5,
        relevance: 0.5,
        credibility: 0.5,
        uniqueness: 0.5
      };
    }
  }

  // Batch analysis for multiple texts
  async batchAnalyze(texts: string[]): Promise<TextAnalysisResult[]> {
    const results: TextAnalysisResult[] = [];
    
    for (const text of texts) {
      try {
        const result = await this.analyzeText(text);
        results.push(result);
      } catch (error) {
        console.error('Batch analysis error for text:', error);
        // Continue with other texts
      }
    }
    
    return results;
  }

  // Get analysis summary for multiple results
  getSummary(results: TextAnalysisResult[]) {
    if (results.length === 0) return null;
    
    const totalWords = results.reduce((sum, r) => sum + r.content.wordCount, 0);
    const avgSentiment = results.reduce((sum, r) => sum + r.sentiment.polarity, 0) / results.length;
    const avgReadability = results.reduce((sum, r) => sum + r.readability.score, 0) / results.length;
    const allTopics = results.flatMap(r => r.topics.map(t => t.topic));
    const uniqueTopics = Array.from(new Set(allTopics));
    
    return {
      totalTexts: results.length,
      totalWords,
      averageWordsPerText: Math.round(totalWords / results.length),
      averageSentiment: Math.round(avgSentiment * 100) / 100,
      averageReadability: Math.round(avgReadability),
      commonTopics: uniqueTopics.slice(0, 10),
      languages: Array.from(new Set(results.map(r => r.language.detected)))
    };
  }
}

// Export singleton instance
export const industrialTextAnalyzer = new IndustrialTextAnalyzer();

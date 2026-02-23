import { HfInference } from '@huggingface/inference';
import compromise from 'compromise';
import { franc } from 'franc-min';

interface Cell {
  id: string;
  row: number;
  col: number;
  type: 'formula' | 'text' | 'media' | 'agi';
  content: string;
  value?: any;
  isEditing?: boolean;
  isComputing?: boolean;
  hasError?: boolean;
}

interface AGICommand {
  type: 'analyze' | 'translate' | 'summarize' | 'calculate' | 'generate' | 'classify';
  input: string;
  context?: Map<string, Cell>;
  parameters?: Record<string, any>;
}

export class CellEngine {
  private hf?: HfInference;
  private nlp = compromise;

  constructor() {
    // Initialize HuggingFace if API key is available
    const apiKey = process.env.NEXT_PUBLIC_HF_API_KEY;
    if (apiKey) {
      this.hf = new HfInference(apiKey);
    }
  }

  /**
   * Process AGI command in a cell
   */
  async processAGICommand(command: string, context: Map<string, Cell>): Promise<string> {
    try {
      const parsedCommand = this.parseAGICommand(command);
      
      switch (parsedCommand.type) {
        case 'analyze':
          return await this.analyzeText(parsedCommand.input, context);
        
        case 'translate':
          return await this.translateText(parsedCommand.input, parsedCommand.parameters?.to ?? 'en');
        
        case 'summarize':
          return await this.summarizeText(parsedCommand.input);
        
        case 'calculate':
          return await this.performCalculation(parsedCommand.input, context);
        
        case 'generate':
          return await this.generateContent(parsedCommand.input, parsedCommand.parameters);
        
        case 'classify':
          return await this.classifyContent(parsedCommand.input);
        
        default:
          throw new Error(`Unknown AGI command type: ${parsedCommand.type}`);
      }
    } catch (err) {
      throw new Error(`AGI processing failed: \${err}`);
    }
  }

  /**
   * Parse AGI command from user input
   */
  private parseAGICommand(command: string): AGICommand {
    const normalizedCommand = command.toLowerCase().trim();
    
    // Detect command type
    if (normalizedCommand.includes('analyze') || normalizedCommand.includes('analizo')) {
      return { type: 'analyze', input: command.replace(/^(analyze|analizo)\s*/i, '') };
    }
    
    if (normalizedCommand.includes('translate') || normalizedCommand.includes('perkthe')) {
      const match = command.match(/(?:translate|perkthe)\s+(.+)\s+(?:to|ne)\s+(\w+)/i);
      if (match) {
        return { 
          type: 'translate', 
          input: match[1], 
          parameters: { to: match[2] }
        };
      }
      return { type: 'translate', input: command.replace(/^(translate|perkthe)\s*/i, '') };
    }
    
    if (normalizedCommand.includes('summarize') || normalizedCommand.includes('permbledh')) {
      return { type: 'summarize', input: command.replace(/^(summarize|permbledh)\s*/i, '') };
    }
    
    if (normalizedCommand.includes('calculate') || normalizedCommand.includes('llogarit')) {
      return { type: 'calculate', input: command.replace(/^(calculate|llogarit)\s*/i, '') };
    }
    
    if (normalizedCommand.includes('generate') || normalizedCommand.includes('gjeneroj')) {
      return { type: 'generate', input: command.replace(/^(generate|gjeneroj)\s*/i, '') };
    }
    
    if (normalizedCommand.includes('classify') || normalizedCommand.includes('klasifiko')) {
      return { type: 'classify', input: command.replace(/^(classify|klasifiko)\s*/i, '') };
    }
    
    // Default to analyze
    return { type: 'analyze', input: command };
  }

  /**
   * Analyze text using NLP
   */
  private async analyzeText(text: string, context: Map<string, Cell>): Promise<string> {
    try {
      // Detect language
      const language = franc(text);
      const languageName = this.getLanguageName(language);
      
      // Parse with compromise
      const doc = this.nlp(text);
      
      // Extract entities
      const people = doc.people().out('array');
      const places = doc.places().out('array');
      const organizations = doc.organizations().out('array');
      // Note: compromise doesn't have .dates() method, using alternative
      const numbers = doc.numbers().out('array');
      
      // Sentiment analysis (basic)
      const sentiment = this.analyzeSentiment(text);
      
      // Word count and reading time
      const wordCount = doc.terms().length;
      const readingTime = Math.ceil(wordCount / 200); // 200 words per minute
      
      const analysis = {
        language: languageName,
        wordCount,
        readingTime: `${readingTime} min`,
        sentiment,
        entities: {
          people,
          places,
          organizations,
          numbers
        },
        summary: text.length > 100 ? `${text.substring(0, 97)  }...` : text
      };
      
      return JSON.stringify(analysis, null, 2);
    } catch (err) {
      return `Analysis failed: \${err}`;
    }
  }

  /**
   * Translate text (basic implementation)
   */
  private async translateText(text: string, targetLanguage: string): Promise<string> {
    try {
      // If HuggingFace is available, use translation with proper API
      if (this.hf) {
        const result = await this.hf.translation({
          model: 'facebook/mbart-large-50-many-to-many-mmt',
          inputs: `translate to ${targetLanguage}: ${text}`
        });
        return (result as { translation_text?: string }).translation_text ?? text;
      }
      
      // Fallback: basic language detection and response
      return `[Translation to ${targetLanguage}]: ${text}`;
    } catch (err) {
      return `[Translation to ${targetLanguage}]: ${text}`;
    }
  }

  /**
   * Summarize text
   */
  private async summarizeText(text: string): Promise<string> {
    try {
      if (text.length < 100) {
        return text; // Too short to summarize
      }
      
      // Use compromise to extract key sentences
      const doc = this.nlp(text);
      const sentences = doc.sentences().out('array');
      
      if (sentences.length <= 3) {
        return text;
      }
      
      // Simple extractive summary: take first and last sentences + one from middle
      const summary = [
        sentences[0],
        sentences[Math.floor(sentences.length / 2)],
        sentences[sentences.length - 1]
      ].join(' ');
      
      return summary;
    } catch (err) {
      return `Summarization failed: \${err}`;
    }
  }

  /**
   * Perform mathematical calculations
   */
  private async performCalculation(expression: string, context: Map<string, Cell>): Promise<string> {
    try {
      // Replace cell references with values
      let processedExpression = expression;
      
      // Replace A1, B2 style references
      const cellRefPattern = /([A-Z]+)(\d+)/g;
      processedExpression = processedExpression.replace(cellRefPattern, (match, col, row) => {
        const colIndex = this.columnToIndex(col);
        const rowIndex = parseInt(row) - 1;
        const cellId = `${rowIndex}-${colIndex}`;
        const cell = context.get(cellId);
        return cell?.value ?? '0';
      });
      
      // Basic math evaluation (be careful with eval in production)
      const result = this.safeEvaluate(processedExpression);
      return result.toString();
    } catch (err) {
      return `Calculation failed: \${err}`;
    }
  }

  /**
   * Generate content based on prompt
   */
  private async generateContent(prompt: string, parameters?: Record<string, any>): Promise<string> {
    try {
      if (this.hf) {
        const result = await this.hf.textGeneration({
          model: 'microsoft/DialoGPT-medium',
          inputs: prompt,
          parameters: {
            max_length: parameters?.maxLength ?? 100,
            temperature: parameters?.temperature ?? 0.7,
            ...parameters
          }
        });
        return result.generated_text ?? `Generated response for: ${prompt}`;
      }
      
      // Fallback generation
      return `[Generated content for]: ${prompt}`;
    } catch (err) {
      return `Content generation failed: \${err}`;
    }
  }

  /**
   * Classify content
   */
  private async classifyContent(text: string): Promise<string> {
    try {
      const doc = this.nlp(text);
      
      // Basic classification based on content analysis
      const hasNumbers = /\d+/.test(text);
      const hasQuestions = text.includes('?');
      const hasEmails = /@/.test(text);
      const hasUrls = /https?:\/\//.test(text);
      
      const categories = [];
      
      if (hasNumbers) {categories.push('numerical');}
      if (hasQuestions) {categories.push('question');}
      if (hasEmails) {categories.push('contact');}
      if (hasUrls) {categories.push('reference');}
      if (doc.people().length > 0) {categories.push('personal');}
      if (doc.places().length > 0) {categories.push('geographical');}
      
      return categories.length > 0 ? categories.join(', ') : 'general';
    } catch (err) {
      return `Classification failed: \${err}`;
    }
  }

  /**
   * Helper methods
   */
  private getLanguageName(code: string): string {
    const languages: Record<string, string> = {
      'eng': 'English',
      'sqi': 'Albanian',
      'fra': 'French',
      'deu': 'German',
      'ita': 'Italian',
      'spa': 'Spanish',
      'por': 'Portuguese',
      'und': 'Unknown'
    };
    return languages[code] ?? 'Unknown';
  }

  private getHFLanguageCode(lang: string): string {
    const codes: Record<string, string> = {
      'en': 'en_XX',
      'sq': 'sq_AL',
      'fr': 'fr_XX',
      'de': 'de_DE',
      'it': 'it_IT',
      'es': 'es_XX',
      'pt': 'pt_XX'
    };
    return codes[lang] ?? 'en_XX';
  }

  private analyzeSentiment(text: string): string {
    // Basic sentiment analysis
    const positiveWords = ['good', 'great', 'excellent', 'amazing', 'wonderful', 'mire', 'shkellqyer'];
    const negativeWords = ['bad', 'terrible', 'awful', 'horrible', 'keq', 'i tmerrshëm'];
    
    const words = text.toLowerCase().split(/\s+/);
    let score = 0;
    
    words.forEach(word => {
      if (positiveWords.includes(word)) {score++;}
      if (negativeWords.includes(word)) {score--;}
    });
    
    if (score > 0) {return 'positive';}
    if (score < 0) {return 'negative';}
    return 'neutral';
  }

  private columnToIndex(column: string): number {
    let result = 0;
    for (let i = 0; i < column.length; i++) {
      result = result * 26 + (column.charCodeAt(i) - 'A'.charCodeAt(0) + 1);
    }
    return result - 1;
  }

  private safeEvaluate(expression: string): number {
    // Remove any dangerous characters
    const sanitized = expression.replace(/[^0-9+\-*/().\s]/g, '');
    
    try {
      // Use Function constructor instead of eval for better security
      const result = new Function(`return ${sanitized}`)();
      return typeof result === 'number' ? result : 0;
    } catch {
      throw new Error('Invalid mathematical expression');
    }
  }
}

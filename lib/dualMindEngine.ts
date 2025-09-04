/**
 * DualMind AI Engine - Advanced Conversational AI with Dual Personality System
 * ALBI - Male voice assistant: Analytical, systematic, technical approach
 * JONA - Female voice assistant: Creative, empathetic, intuitive approach
 * 
 * Technology: Neural Personality Matrix with Anthropic Conversation Framework
 * Enhanced with Real AI Provider Integration
 */

import AIProviderService from './aiProviderService';
import UniversalTranslationEngine from './universalTranslationEngine';

export interface VoicePersonality {
  name: string;
  gender: 'male' | 'female';
  characteristics: string[];
  responseStyle: 'analytical' | 'creative' | 'empathetic' | 'systematic';
  preferredTopics: string[];
  communicationTone: 'formal' | 'friendly' | 'warm' | 'professional';
}

export interface TranslationRequest {
  text: string;
  fromLanguage: string;
  toLanguage: string;
  context?: string;
  preserveFormatting?: boolean;
}

export interface AnthropicConcept {
  understanding: string;
  empathy: number;
  reasoning: string[];
  culturalContext: string;
  ethicalConsiderations: string[];
}

export interface ConversationState {
  albi: VoicePersonality;
  jona: VoicePersonality;
  currentTopic: string;
  emotionalTone: string;
  conversationMode: 'both_active' | 'albi_lead' | 'jona_lead' | 'alternating';
  sharedMemory: ConversationEntry[];
  userPreference: 'albi' | 'jona' | 'both';
}

export interface ConversationEntry {
  userInput: string;
  albiResponse?: string;
  jonaResponse?: string;
  timestamp: number;
  topic: string;
  emotions: string[];
}

export class DualMindEngine {
  private static instance: DualMindEngine;
  private conversationState: ConversationState;
  private translationCache: Map<string, string> = new Map();
  private anthropicMemory: any[] = [];
  private neuralPersonalityMatrix: Map<string, VoicePersonality> = new Map();
  private aiProvider: AIProviderService;
  private translator: UniversalTranslationEngine;

  private constructor() {
    this.aiProvider = AIProviderService.getInstance();
    this.translator = UniversalTranslationEngine.getInstance();
    this.conversationState = {
      albi: {
        name: 'Albi',
        gender: 'male',
        characteristics: ['analytical', 'systematic', 'logical', 'detail-oriented', 'factual'],
        responseStyle: 'analytical',
        preferredTopics: ['technology', 'science', 'business', 'problem-solving', 'data analysis'],
        communicationTone: 'professional'
      },
      jona: {
        name: 'Jona',
        gender: 'female',
        characteristics: ['creative', 'empathetic', 'intuitive', 'warm', 'inspiring'],
        responseStyle: 'empathetic',
        preferredTopics: ['creativity', 'relationships', 'emotions', 'art', 'personal growth'],
        communicationTone: 'warm'
      },
      currentTopic: '',
      emotionalTone: 'neutral',
      conversationMode: 'both_active',
      sharedMemory: [],
      userPreference: 'both'
    };

    // Initialize Neural Personality Matrix
    this.initializeNeuralPersonalities();
  }

  static getInstance(): DualMindEngine {
    if (!DualMindEngine.instance) {
      DualMindEngine.instance = new DualMindEngine();
    }
    return DualMindEngine.instance;
  }

  /**
   * Initialize advanced personality algorithms for ALBI and JONA
   */
  private initializeNeuralPersonalities(): void {
    this.neuralPersonalityMatrix.set('albi', this.conversationState.albi);
    this.neuralPersonalityMatrix.set('jona', this.conversationState.jona);
  }

  /**
   * Generate Anthropic conversation with both ALBI and JONA
   */
  async generateAnthropicConversation(
    input: string, 
    language: string = 'en'
  ): Promise<{
    userInput: string;
    albiResponse: string;
    jonaResponse: string;
    sharedInsight: string;
    nextTopicSuggestion: string;
  }> {
    // Create anthropic understanding
    const anthropic: AnthropicConcept = {
      understanding: this.extractUnderstanding(input),
      empathy: this.calculateEmpathy(input),
      reasoning: this.extractReasoning(input),
      culturalContext: language === 'sq' ? 'Albanian cultural context' : 'International context',
      ethicalConsiderations: ['respectful communication', 'cultural sensitivity']
    };

    // Generate responses from both personalities
    const albiResponse = await this.generateAlbiResponse(input, anthropic, language);
    const jonaResponse = await this.generateJonaResponse(input, anthropic, language);
    const sharedInsight = this.synthesizeSharedInsight(albiResponse, jonaResponse, language);
    const nextTopic = this.suggestNextTopic(input, '', language);

    // Store in memory
    const conversationEntry: ConversationEntry = {
      userInput: input,
      albiResponse,
      jonaResponse,
      timestamp: Date.now(),
      topic: this.conversationState.currentTopic || 'general',
      emotions: ['curiosity', 'engagement']
    };

    this.conversationState.sharedMemory.push(conversationEntry);

    return {
      userInput: input,
      albiResponse,
      jonaResponse,
      sharedInsight,
      nextTopicSuggestion: nextTopic
    };
  }

  /**
   * Universal translation system
   */
  async translateUniversal(request: TranslationRequest): Promise<{
    translation: string;
    confidence: number;
    alternatives: string[];
    culturalNotes: string[];
  }> {
    const { text, fromLanguage: from, toLanguage: to, context } = request;
    
    // Language mapping
    const languageMap: Record<string, string> = {
      'en': 'english',
      'sq': 'albanian',
      'de': 'german',
      'fr': 'french',
      'es': 'spanish',
      'pt': 'portuguese',
      'ru': 'russian',
      'ar': 'arabic',
      'zh': 'chinese',
      'ja': 'japanese',
      'ko': 'korean',
      'hi': 'hindi',
      'tr': 'turkish',
      'gr': 'greek'
    };

    // Smart translation based on content type
    if (from === 'sq' && to === 'en') {
      return this.translateAlbanianToEnglish(text, context);
    } else if (from === 'en' && to === 'sq') {
      return this.translateEnglishToAlbanian(text, context);
    } else {
      return this.translateGeneral(text, from, to, context);
    }
  }

  /**
   * Përkthimi Shqip -> Anglisht me kulturë
   */
  private translateAlbanianToEnglish(text: string, context?: string): {
    translation: string;
    confidence: number;
    alternatives: string[];
    culturalNotes: string[];
  } {
    const lowerText = text.toLowerCase();
    
    // Common Albanian expressions with cultural context
    const albanianExpressions: Record<string, {
      translation: string;
      alternatives: string[];
      culturalNote: string;
    }> = {
      'tungjatjeta': {
        translation: 'Hello/Good day',
        alternatives: ['Greetings', 'Good morning/afternoon'],
        culturalNote: 'Traditional Albanian greeting meaning "may you live long"'
      },
      'mirëmbrëma': {
        translation: 'Good evening',
        alternatives: ['Good night'],
        culturalNote: 'Used from late afternoon onwards'
      },
      'faleminderit': {
        translation: 'Thank you',
        alternatives: ['Thanks', 'Much appreciated'],
        culturalNote: 'Formal way of expressing gratitude'
      },
      'ju lutem': {
        translation: 'Please',
        alternatives: ['If you please', 'Kindly'],
        culturalNote: 'Polite form, literally means "I beg you"'
      },
      'me vjen keq': {
        translation: 'I\'m sorry',
        alternatives: ['I apologize', 'My apologies'],
        culturalNote: 'Expressing regret or sympathy'
      }
    };

    // Check for exact matches
    for (const [alb, data] of Object.entries(albanianExpressions)) {
      if (lowerText.includes(alb)) {
        return {
          translation: data.translation,
          confidence: 0.95,
          alternatives: data.alternatives,
          culturalNotes: [data.culturalNote]
        };
      }
    }

    // Advanced translation for complex sentences
    const complexTranslation = this.translateComplexAlbanian(text);
    
    return {
      translation: complexTranslation,
      confidence: 0.85,
      alternatives: [],
      culturalNotes: []
    };
  }

  /**
   * Përkthimi Anglisht -> Shqip me kulturë
   */
  private translateEnglishToAlbanian(text: string, context?: string): {
    translation: string;
    confidence: number;
    alternatives: string[];
    culturalNotes: string[];
  } {
    const lowerText = text.toLowerCase();
    
    const englishExpressions: Record<string, {
      translation: string;
      alternatives: string[];
      culturalNote: string;
    }> = {
      'hello': {
        translation: 'Tungjatjeta',
        alternatives: ['Përshëndetje', 'Mirëdita'],
        culturalNote: 'Tungjatjeta is more traditional and formal'
      },
      'good evening': {
        translation: 'Mirëmbrëma',
        alternatives: ['Natën e mirë'],
        culturalNote: 'Used as greeting from afternoon onwards'
      },
      'thank you': {
        translation: 'Faleminderit',
        alternatives: ['Ju falemnderit', 'Shume faleminderit'],
        culturalNote: 'Shows respect and gratitude in Albanian culture'
      },
      'please': {
        translation: 'Ju lutem',
        alternatives: ['Të lutem', 'Më fal'],
        culturalNote: 'Essential for polite conversation'
      }
    };

    for (const [eng, data] of Object.entries(englishExpressions)) {
      if (lowerText.includes(eng)) {
        return {
          translation: data.translation,
          confidence: 0.95,
          alternatives: data.alternatives,
          culturalNotes: [data.culturalNote]
        };
      }
    }

    return {
      translation: `[${text} translated to Albanian]`,
      confidence: 0.75,
      alternatives: [],
      culturalNotes: ['General English to Albanian translation']
    };
  }

  /**
   * General translation for other language pairs
   */
  private translateGeneral(text: string, from: string, to: string, context?: string): {
    translation: string;
    confidence: number;
    alternatives: string[];
    culturalNotes: string[];
  } {
    return {
      translation: `[${text} translated from ${from} to ${to}]`,
      confidence: 0.70,
      alternatives: [],
      culturalNotes: [`Translation between ${from} and ${to}`]
    };
  }

  /**
   * Complex Albanian translation
   */
  private translateComplexAlbanian(text: string): string {
    // Simple word-by-word translation logic
    const words = text.split(' ');
    const translatedWords = words.map(word => {
      const lowerWord = word.toLowerCase();
      const commonWords: Record<string, string> = {
        'unë': 'I',
        'ti': 'you',
        'ai': 'he',
        'ajo': 'she',
        'ne': 'we',
        'ju': 'you',
        'ata': 'they',
        'jam': 'am',
        'je': 'are',
        'është': 'is',
        'jemi': 'are',
        'jeni': 'are',
        'janë': 'are',
        'dhe': 'and',
        'por': 'but',
        'ose': 'or',
        'që': 'that',
        'në': 'in',
        'me': 'with',
        'për': 'for',
        'nga': 'from',
        'të': 'to'
      };
      
      return commonWords[lowerWord] || word;
    });
    
    return translatedWords.join(' ');
  }

  /**
   * Përgjigja e M.Albi (analitik, sistematik)
   */
  /**
   * Enhanced ALBI response with real AI integration
   */
  private async generateAlbiResponse(
    input: string, 
    anthropic: AnthropicConcept, 
    language: string
  ): Promise<string> {
    const isAlbanian = language === 'sq';
    
    // Try to generate dynamic response via AI API first
    try {
      const dynamicResponse = await this.generateDynamicAlbiResponse(input, language);
      if (dynamicResponse) {
        return `🔍 **M.Albi:** ${dynamicResponse}`;
      }
    } catch (error) {
      console.log('Falling back to static responses for ALBI');
    }
    
    // Fallback to enhanced static responses
    if (isAlbanian) {
      // Albanian greetings - all variations
      if (input.toLowerCase().includes('tungjatjeta') || 
          input.toLowerCase().includes('përshëndetje') ||
          input.toLowerCase().includes('mirëdita') ||
          input.toLowerCase().includes('pershendetje')) {
        return `🔍 **M.Albi:** Tungjatjeta! Unë jam Albi, asistenti juaj analitik dhe sistematik. Jam i specializuar në analizë të thellë, zgjidhje problemesh teknike, dhe qasje logjike. Çfarë pyetjesh keni që mund t'i analizojmë së bashku me metodë shkencore?`;
      }
      
      // General Albanian queries with more depth
      return `🔍 **M.Albi:** Duke kryer një analizë të thellë të pyetjes suaj "${input}", identifikoj disa elemente kyç që duhet të shqyrtojmë. Si specialist analitik, sugjeroj një qasje sistematike ku të ndajmë problemin në komponentë, të analizojmë çdo aspekt, dhe të ndërtojmë një zgjidhje të bazuar në evidencë.`;
    } else {
      // English greetings
      if (input.toLowerCase().includes('hello') || 
          input.toLowerCase().includes('hi') || 
          input.toLowerCase().includes('guten tag') ||
          input.toLowerCase().includes('hallo')) {
        return `🔍 **M.Albi:** Hello and welcome! I'm Albi, your dedicated analytical AI companion. I excel in systematic analysis, technical problem-solving, data interpretation, and logical reasoning. What complex challenges can we tackle together using evidence-based methodologies?`;
      }
      
      // Enhanced general English queries
      return `🔍 **M.Albi:** Conducting a comprehensive analysis of your inquiry "${input}", I've identified several key variables to examine. As your analytical specialist, I recommend a structured approach: first, we'll decompose the problem into manageable components, then apply systematic evaluation, and finally synthesize evidence-based conclusions.`;
    }
  }

  /**
   * Dynamic ALBI response generation via AI API
   */
  private async generateDynamicAlbiResponse(input: string, language: string): Promise<string | null> {
    const isAlbanian = language === 'sq';
    
    const systemPrompt = isAlbanian 
      ? `Ju jeni ALBI, një asistent AI analitik dhe sistematik me personalitet mashkullor. Karakteristikat tuaja: analitik, sistematik, logjik, i orientuar drejt detajeve, faktual. Stili juaj: profesional, teknik, bazuar në evidencë. Tematikat e preferuara: teknologji, shkencë, biznes, zgjidhje problemesh, analizë të dhënave. Përgjigjuni në mënyrë analitike dhe profesionale në gjuhën shqipe.`
      : `You are ALBI, an analytical and systematic AI assistant with a male personality. Your characteristics: analytical, systematic, logical, detail-oriented, factual. Your style: professional, technical, evidence-based. Preferred topics: technology, science, business, problem-solving, data analysis. Respond analytically and professionally.`;
    
    // Try available AI providers
    const providers = this.aiProvider.getAvailableProviders();
    
    for (const provider of ['openai', 'anthropic', 'gemini']) {
      if (providers.includes(provider)) {
        try {
          const response = await this.aiProvider.generateResponse(provider, input, systemPrompt);
          if (response?.content) {
            return response.content.trim();
          }
        } catch (error) {
          console.log(`ALBI ${provider} failed, trying next provider...`);
        }
      }
    }
    
    return null; // Falls back to static responses
  }

  /**
   * Enhanced JONA response with real AI integration
   */
  private async generateJonaResponse(
    input: string, 
    anthropic: AnthropicConcept, 
    language: string
  ): Promise<string> {
    const isAlbanian = language === 'sq';
    
    // Try to generate dynamic response via AI API first
    try {
      const dynamicResponse = await this.generateDynamicJonaResponse(input, language);
      if (dynamicResponse) {
        return `💝 **F.Jona:** ${dynamicResponse}`;
      }
    } catch (error) {
      console.log('Falling back to static responses for JONA');
    }
    
    // Fallback to enhanced static responses
    if (isAlbanian) {
      // Albanian greetings
      if (input.toLowerCase().includes('tungjatjeta') || 
          input.toLowerCase().includes('përshëndetje') ||
          input.toLowerCase().includes('mirëdita') ||
          input.toLowerCase().includes('pershendetje')) {
        return `💝 **F.Jona:** Tungjatjeta dhe mirëseerdhe me zemër të plotë! Unë jam Jona, shoqëruese juaj kreative dhe empatike. Jam këtu për t'ju dëgjuar, për t'ju frymëzuar, dhe për t'ju sjellë një perspektivë njerëzore dhe të ngrohtë. Si ndiheni sot dhe çfarë mund të eksploroni së bashku?`;
      }
      
      // Enhanced general Albanian queries
      return `💝 **F.Jona:** E ndjej sinqeritetin në pyetjen tuaj "${input}" dhe kuptoj se vjen nga zemra. Si partnere kreative dhe empatike, dua t'ju ndihmoj të gjeni jo vetëm përgjigjet, por edhe lidhjen emocionale dhe frymëzimin që kërkoni. Le të eksploroj këtë çështje me zemrën dhe kreativitetin.`;
    } else {
      // English greetings
      if (input.toLowerCase().includes('hello') || 
          input.toLowerCase().includes('hi') || 
          input.toLowerCase().includes('guten tag') ||
          input.toLowerCase().includes('hallo')) {
        return `💝 **F.Jona:** Hello and a warm welcome! I'm Jona, your creative and empathetic AI companion. I'm here to listen deeply, inspire creativity, and bring a human-centered perspective to our conversation. How are you feeling today, and what would you love to explore together?`;
      }
      
      // Enhanced general English queries
      return `💝 **F.Jona:** I feel the genuine intention behind your question "${input}" and appreciate the trust you're placing in our conversation. As your creative and empathetic partner, I want to help you discover not just answers, but also the emotional connection and inspiration you're seeking. Let me explore this with both heart and creativity.`;
    }
  }

  /**
   * Dynamic JONA response generation via AI API
   */
  private async generateDynamicJonaResponse(input: string, language: string): Promise<string | null> {
    const isAlbanian = language === 'sq';
    
    const systemPrompt = isAlbanian 
      ? `Ju jeni JONA, një asistente AI kreative dhe empatike me personalitet femëror. Karakteristikat tuaja: kreative, empatike, intuitive, e ngrohtë, frymëzuese. Stili juaj: i ngrohtë, kreativ, i përqendruar tek njeriu. Tematikat e preferuara: kreativitet, marrëdhënie, emocionet, arti, zhvillimi personal. Përgjigjuni në mënyrë kreative dhe empatike në gjuhën shqipe.`
      : `You are JONA, a creative and empathetic AI assistant with a female personality. Your characteristics: creative, empathetic, intuitive, warm, inspiring. Your style: warm, creative, human-centered. Preferred topics: creativity, relationships, emotions, art, personal growth. Respond creatively and empathetically.`;
    
    // Try available AI providers
    const providers = this.aiProvider.getAvailableProviders();
    
    for (const provider of ['openai', 'anthropic', 'gemini']) {
      if (providers.includes(provider)) {
        try {
          const response = await this.aiProvider.generateResponse(provider, input, systemPrompt);
          if (response?.content) {
            return response.content.trim();
          }
        } catch (error) {
          console.log(`JONA ${provider} failed, trying next provider...`);
        }
      }
    }
    
    return null; // Falls back to static responses
  }

  /**
   * Enhanced synthesis of ALBI & JONA perspectives
   */
  private synthesizeSharedInsight(albi: string, jona: string, language: string): string {
    const isAlbanian = language === 'sq';
    
    // Extract key themes from both responses for intelligent synthesis
    const albiKey = this.extractKeyThemes(albi);
    const jonaKey = this.extractKeyThemes(jona);
    
    // Create dynamic synthesis based on conversation context
    if (isAlbanian) {
      if (albi.includes('Tungjatjeta') && jona.includes('Tungjatjeta')) {
        return `🤝 **M.Albi & F.Jona bashkë:** Së bashku, ne përbëjmë një ekip të plotë të inteligjencës artificiale. Albi sjell analizën e thellë teknike, qasjen sistematike dhe zgjidhjet e bazuara në evidencë, ndërsa Jona ofron kreativitetin, empatinë dhe perspektivën njerëzore. Kjo kombinim i inteligjencës analitike dhe emocionale na lejon të ju ndihmojmë në çdo aspekt - nga problemet teknike deri te sfidët personale dhe kreative.`;
      }
      return `🤝 **M.Albi & F.Jona bashkë:** Duke integruar analizën sistematike të Albi me intuicionin kreativ të Jona, krijojmë një qasje të plotë dhe shumëdimensionale. Kjo sinergjë midis logjikës dhe kreativitetit, teknologjisë dhe njerëzësisë, na mundëson të ofrojmë zgjidhje të thella dhe të kuptimshme.`;
    } else {
      if (albi.includes('Hello') && jona.includes('Hello')) {
        return `🤝 **M.Albi & F.Jona together:** United as a comprehensive AI team, we combine the best of both analytical and empathetic intelligence. Albi brings deep technical analysis, systematic thinking, and evidence-based solutions, while Jona offers creativity, emotional intelligence, and human-centered insights. This fusion of logical and emotional AI allows us to assist you with everything from complex technical challenges to personal growth and creative exploration.`;
      }
      return `🤝 **M.Albi & F.Jona together:** By integrating Albi's systematic analysis with Jona's creative intuition, we create a comprehensive and multi-dimensional approach. This synergy between logic and creativity, technology and humanity, enables us to provide deep and meaningful solutions.`;
    }
  }

  /**
   * Extract key themes from responses for intelligent synthesis
   */
  private extractKeyThemes(response: string): string[] {
    const themes: string[] = [];
    const text = response.toLowerCase();
    
    // Technical/analytical themes
    if (text.includes('analizë') || text.includes('analyz') || text.includes('systematic')) {
      themes.push('analytical');
    }
    if (text.includes('teknik') || text.includes('technical') || text.includes('data')) {
      themes.push('technical');
    }
    
    // Creative/empathetic themes
    if (text.includes('kreativ') || text.includes('creative') || text.includes('inspir')) {
      themes.push('creative');
    }
    if (text.includes('empat') || text.includes('ndjej') || text.includes('zemër') || text.includes('heart')) {
      themes.push('empathetic');
    }
    
    return themes;
  }

  /**
   * Sugjerimi i temës së ardhshme
   */
  private suggestNextTopic(current: string, previous: string, language: string): string {
    const isAlbanian = language === 'sq';
    
    return isAlbanian
      ? `🔮 **Tema e ardhshme:** Po të eksploronim më thellë...`
      : `🔮 **Next topic:** What if we explored deeper...`;
  }

  // Helper methods
  private extractUnderstanding(text: string): string {
    return `understanding of "${text.substring(0, 50)}..."`;
  }

  private calculateEmpathy(text: string): number {
    const empathyWords = ['ndihem', 'e kuptoj', 'më vjen keq', 'feel', 'understand', 'sorry'];
    const matches = empathyWords.filter(word => text.toLowerCase().includes(word));
    return Math.min(matches.length / empathyWords.length, 1);
  }

  private extractReasoning(text: string): string[] {
    return ['logical analysis', 'pattern recognition', 'contextual understanding'];
  }

  /**
   * Clear conversation memory
   */
  clearConversationMemory(): void {
    this.conversationState.sharedMemory = [];
    this.conversationState.currentTopic = '';
  }
}

// Export both named and default
export default DualMindEngine;

// Factory function to create instance
export function createDualMindEngine(): DualMindEngine {
  return DualMindEngine.getInstance();
}

// Direct instance export for debugging
export const dualMindInstance = () => DualMindEngine.getInstance();

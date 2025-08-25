/**
 * 🌍 Universal Translator - EuroWeb Translation System
 * Enhanced with Google Translate API Integration
 * 
 * @author Ledjan Ahmati
 * @version 8.0.0-UNIVERSAL
 * @contact dealsjona@gmail.com
 */

import React from 'react'

export interface TranslationEntry {
  id: string
  source: string
  target: string
  sourceLang: string
  targetLang: string
  confidence: number
  timestamp: Date
  provider: 'google' | 'local' | 'ai'
  context?: string
}

export interface LanguageSupport {
  code: string
  name: string
  nativeName: string
  region: string
  flag: string
  rtl: boolean
  availability: number // 0-100
}

export interface TranslationMirror {
  id: string
  phrase: string
  translations: Map<string, TranslationEntry>
  frequency: number
  lastUsed: Date
  category: 'ui' | 'content' | 'ai' | 'technical'
}

class UniversalTranslator {
  private translationCache: Map<string, TranslationMirror> = new Map()
  private googleTranslateEndpoint = 'https://translate.googleapis.com/translate_a/single'
  private supportedLanguages: LanguageSupport[] = [
    {
      code: 'sq',
      name: 'Albanian',
      nativeName: 'Shqip',
      region: 'Balkans',
      flag: '🇦🇱',
      rtl: false,
      availability: 100
    },
    {
      code: 'en',
      name: 'English',
      nativeName: 'English',
      region: 'Global',
      flag: '🇺🇸',
      rtl: false,
      availability: 100
    },
    {
      code: 'fr',
      name: 'French',
      nativeName: 'Français',
      region: 'Europe',
      flag: '🇫🇷',
      rtl: false,
      availability: 95
    },
    {
      code: 'de',
      name: 'German',
      nativeName: 'Deutsch',
      region: 'Europe',
      flag: '🇩🇪',
      rtl: false,
      availability: 95
    },
    {
      code: 'zh',
      name: 'Chinese',
      nativeName: '中文',
      region: 'Asia',
      flag: '🇨🇳',
      rtl: false,
      availability: 90
    },
    {
      code: 'ar',
      name: 'Arabic',
      nativeName: 'العربية',
      region: 'Middle East',
      flag: '🇸🇦',
      rtl: true,
      availability: 85
    },
    {
      code: 'es',
      name: 'Spanish',
      nativeName: 'Español',
      region: 'Global',
      flag: '🇪🇸',
      rtl: false,
      availability: 95
    },
    {
      code: 'it',
      name: 'Italian',
      nativeName: 'Italiano',
      region: 'Europe',
      flag: '🇮🇹',
      rtl: false,
      availability: 90
    }
  ]

  // Google Translate Mirror Integration
  async fetchFromGoogleTranslate(text: string, sourceLang: string, targetLang: string): Promise<TranslationEntry | null> {
    try {
      // Use public Google Translate endpoint (no API key required)
      const url = `${this.googleTranslateEndpoint}?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      })

      if (!response.ok) {
        throw new Error(`Google Translate API error: ${response.status}`)
      }

      const data = await response.json()
      const translatedText = data[0][0][0]

      const entry: TranslationEntry = {
        id: `gt-${Date.now()}-${Math.random().toString(36).substring(7)}`,
        source: text,
        target: translatedText,
        sourceLang,
        targetLang,
        confidence: 85 + Math.random() * 10, // Google Translate confidence simulation
        timestamp: new Date(),
        provider: 'google',
        context: 'google-translate-mirror'
      }

      // Cache the translation
      this.cacheTranslation(text, entry)
      
      return entry

    } catch (error) {
      console.error('Google Translate Mirror Error:', error)
      return null
    }
  }

  // Enhanced translation with multiple sources
  async translate(text: string, targetLang: string, sourceLang: string = 'auto'): Promise<TranslationEntry | null> {
    const cacheKey = `${text}-${sourceLang}-${targetLang}`
    
    // Check cache first
    const cached = this.getCachedTranslation(cacheKey)
    if (cached) {
      cached.frequency++
      cached.lastUsed = new Date()
      return cached.translations.get(targetLang) || null
    }

    // Try Google Translate first
    const googleResult = await this.fetchFromGoogleTranslate(text, sourceLang, targetLang)
    if (googleResult) {
      return googleResult
    }

    // Fallback to local dictionary
    return this.getLocalTranslation(text, targetLang, sourceLang)
  }

  // Enhanced local dictionary with AI phrases
  private getLocalTranslation(text: string, targetLang: string, sourceLang: string): TranslationEntry | null {
    const localDictionary: Record<string, Record<string, string>> = {
      // Albanian to other languages
      'mirëdita': {
        'en': 'good day / hello',
        'fr': 'bonjour',
        'de': 'guten Tag',
        'zh': '你好',
        'ar': 'أهلاً وسهلاً',
        'es': 'buenos días',
        'it': 'buongiorno'
      },
      'faleminderit': {
        'en': 'thank you',
        'fr': 'merci',
        'de': 'danke',
        'zh': '谢谢',
        'ar': 'شكراً',
        'es': 'gracias',
        'it': 'grazie'
      },
      'ndihmë': {
        'en': 'help / assistance',
        'fr': 'aide',
        'de': 'Hilfe',
        'zh': '帮助',
        'ar': 'مساعدة',
        'es': 'ayuda',
        'it': 'aiuto'
      },
      'përshëndetje': {
        'en': 'greetings / hello',
        'fr': 'salutations',
        'de': 'Grüße',
        'zh': '问候',
        'ar': 'تحية',
        'es': 'saludos',
        'it': 'saluti'
      },
      // AI and technical terms
      'inteligjencë artificiale': {
        'en': 'artificial intelligence',
        'fr': 'intelligence artificielle',
        'de': 'künstliche Intelligenz',
        'zh': '人工智能',
        'ar': 'الذكاء الاصطناعي',
        'es': 'inteligencia artificial',
        'it': 'intelligenza artificiale'
      },
      'mësim automatik': {
        'en': 'machine learning',
        'fr': 'apprentissage automatique',
        'de': 'maschinelles Lernen',
        'zh': '机器学习',
        'ar': 'التعلم الآلي',
        'es': 'aprendizaje automático',
        'it': 'apprendimento automatico'
      }
    }

    const textLower = text.toLowerCase()
    const translation = localDictionary[textLower]?.[targetLang]
    
    if (translation) {
      const entry: TranslationEntry = {
        id: `local-${Date.now()}`,
        source: text,
        target: translation,
        sourceLang,
        targetLang,
        confidence: 95,
        timestamp: new Date(),
        provider: 'local',
        context: 'local-dictionary'
      }
      
      this.cacheTranslation(text, entry)
      return entry
    }

    return null
  }

  // Language detection using patterns
  detectLanguage(text: string): string {
    const patterns = {
      'sq': /\b(mirëdita|faleminderit|ndihmë|përshëndetje|gjuhë|shqip)\b/i,
      'en': /\b(hello|thank|you|help|language|english)\b/i,
      'fr': /\b(bonjour|merci|aide|français|langue)\b/i,
      'de': /\b(hallo|danke|hilfe|deutsch|sprache)\b/i,
      'zh': /[\u4e00-\u9fff]/,
      'ar': /[\u0600-\u06ff]/,
      'es': /\b(hola|gracias|ayuda|español|idioma)\b/i,
      'it': /\b(ciao|grazie|aiuto|italiano|lingua)\b/i
    }

    for (const [lang, pattern] of Object.entries(patterns)) {
      if (pattern.test(text)) {
        return lang
      }
    }

    return 'en' // Default to English
  }

  // Cache management
  private cacheTranslation(text: string, entry: TranslationEntry): void {
    const cacheKey = `${text}-${entry.sourceLang}-${entry.targetLang}`
    
    if (!this.translationCache.has(cacheKey)) {
      const mirror: TranslationMirror = {
        id: cacheKey,
        phrase: text,
        translations: new Map(),
        frequency: 1,
        lastUsed: new Date(),
        category: 'content'
      }
      this.translationCache.set(cacheKey, mirror)
    }

    const mirror = this.translationCache.get(cacheKey)!
    mirror.translations.set(entry.targetLang, entry)
    mirror.frequency++
    mirror.lastUsed = new Date()
  }

  private getCachedTranslation(cacheKey: string): TranslationMirror | null {
    return this.translationCache.get(cacheKey) || null
  }

  // Get translation statistics
  getTranslationStats() {
    return {
      totalEntries: this.translationCache.size,
      totalTranslations: Array.from(this.translationCache.values())
        .reduce((sum, mirror) => sum + mirror.translations.size, 0),
      mostFrequent: Array.from(this.translationCache.values())
        .sort((a, b) => b.frequency - a.frequency)
        .slice(0, 10),
      supportedLanguages: this.supportedLanguages.length,
      lastUpdate: new Date()
    }
  }

  // Get supported languages
  getSupportedLanguages(): LanguageSupport[] {
    return this.supportedLanguages
  }

  // Batch translation for UI elements
  async translateBatch(phrases: string[], targetLang: string, sourceLang: string = 'auto'): Promise<TranslationEntry[]> {
    const results: TranslationEntry[] = []
    
    for (const phrase of phrases) {
      const translation = await this.translate(phrase, targetLang, sourceLang)
      if (translation) {
        results.push(translation)
      }
    }
    
    return results
  }

  // Smart context-aware translation
  async translateWithContext(text: string, context: string, targetLang: string): Promise<TranslationEntry | null> {
    // Enhance translation based on context (UI, AI, technical, etc.)
    const contextualText = `${context}: ${text}`
    return this.translate(contextualText, targetLang)
  }
}

// Export singleton instance
export const universalTranslator = new UniversalTranslator()

// React hook for easy integration
export const useTranslator = () => {
  return {
    translate: universalTranslator.translate.bind(universalTranslator),
    detectLanguage: universalTranslator.detectLanguage.bind(universalTranslator),
    getSupportedLanguages: universalTranslator.getSupportedLanguages.bind(universalTranslator),
    getStats: universalTranslator.getTranslationStats.bind(universalTranslator),
    translateBatch: universalTranslator.translateBatch.bind(universalTranslator)
  }
}

// Translation component for easy UI integration
// Note: Use TranslatorUI.tsx for React components

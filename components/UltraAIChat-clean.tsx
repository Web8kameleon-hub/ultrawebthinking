"use client"
import React, { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { pureNeuralEngine, type PureNeuralContext } from '../lib/pure-neural-engine'
import { useClientSide, getSafeTimestamp, getSafeId } from '../lib/hydration-safe'

// Universal Translation System Integration
interface TranslationEntry {
  source: string
  target: string
  sourceLang: string
  targetLang: string
  confidence: number
  provider: 'google' | 'local' | 'ai'
}

interface LanguageSupport {
  code: string
  name: string
  nativeName: string
  flag: string
}

// Embedded Translation Engine
class EmbeddedTranslator {
  private localDictionary: Record<string, Record<string, string>> = {
    'hello': { 'sq': 'përshëndetje', 'fr': 'bonjour', 'de': 'hallo', 'es': 'hola', 'it': 'ciao' },
    'thank you': { 'sq': 'faleminderit', 'fr': 'merci', 'de': 'danke', 'es': 'gracias', 'it': 'grazie' },
    'help': { 'sq': 'ndihmë', 'fr': 'aide', 'de': 'hilfe', 'es': 'ayuda', 'it': 'aiuto' },
    'good morning': { 'sq': 'mirëmëngjes', 'fr': 'bonjour', 'de': 'guten morgen', 'es': 'buenos días', 'it': 'buongiorno' },
    'artificial intelligence': { 'sq': 'inteligjencë artificiale', 'fr': 'intelligence artificielle', 'de': 'künstliche intelligenz', 'es': 'inteligencia artificial', 'it': 'intelligenza artificiale' }
  }

  async translate(text: string, targetLang: string): Promise<TranslationEntry | null> {
    const textLower = text.toLowerCase()
    const translation = this.localDictionary[textLower]?.[targetLang]
    
    if (translation) {
      return {
        source: text,
        target: translation,
        sourceLang: 'en',
        targetLang,
        confidence: 95,
        provider: 'local'
      }
    }

    // Google Translate fallback
    try {
      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`
      const response = await fetch(url)
      const data = await response.json()
      const translatedText = data[0][0][0]

      return {
        source: text,
        target: translatedText,
        sourceLang: 'auto',
        targetLang,
        confidence: 85,
        provider: 'google'
      }
    } catch (error) {
      console.warn('Translation failed:', error)
      return null
    }
  }

  getSupportedLanguages(): LanguageSupport[] {
    return [
      { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
      { code: 'sq', name: 'Albanian', nativeName: 'Shqip', flag: '🇦🇱' },
      { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
      { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
      { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
      { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹' },
      { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
      { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' }
    ]
  }
}

const embeddedTranslator = new EmbeddedTranslator()

// Enhanced Ultra AI Models Interface with Global Sources
interface AIModel {
  id: string
  name: string
  icon: string
  description: string
  capabilities: string[]
  color: string
  gradient: string
  specialty: string
  origin: string
  ethicalApproval: boolean
  status: 'online' | 'processing' | 'offline'
  responseTime: number
  accuracy: number
  powerLevel: number
}

interface ChatMessage {
  id: string
  content: string
  timestamp: Date
  sender: 'user' | 'ai'
  aiModel?: string
  type: 'text' | 'code' | 'image' | 'analysis' | 'creative'
  confidence: number
  processingTime: number
  tokens: number
}

interface NeuralMetrics {
  totalMessages: number
  averageResponseTime: number
  neuralActivity: number
  learningProgress: number
  satisfactionScore: number
  creativityIndex: number
  problemSolvingRate: number
  memoryEfficiency: number
}

const UltraAIChat: React.FC = () => {
  // Hydration-safe client detection
  const isClient = useClientSide()
  
  // Enhanced State Management with Ethical Controls
  const [selectedAI, setSelectedAI] = useState<string>('openmind')
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputMessage, setInputMessage] = useState<string>('')
  const [isTyping, setIsTyping] = useState<boolean>(false)
  const [ethicalFilter, setEthicalFilter] = useState<boolean>(true)
  const [showEthicalWarning, setShowEthicalWarning] = useState<boolean>(false)
  const [originFilter, setOriginFilter] = useState<string>('all')
  
  // Translation System State
  const [translationEnabled, setTranslationEnabled] = useState<boolean>(false)
  const [selectedLanguage, setSelectedLanguage] = useState<string>('en')
  const [translatingMessage, setTranslatingMessage] = useState<string>('')
  const [supportedLanguages] = useState<LanguageSupport[]>(embeddedTranslator.getSupportedLanguages())
  
  const [neuralMetrics, setNeuralMetrics] = useState<NeuralMetrics>({
    totalMessages: 0,
    averageResponseTime: 1.2,
    neuralActivity: 95,
    learningProgress: 87,
    satisfactionScore: 98,
    creativityIndex: 94,
    problemSolvingRate: 91,
    memoryEfficiency: 89
  })
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // Enhanced AI Models Database with Global Sources & Ethical Standards
  const aiModels: AIModel[] = [
    // EuroWeb Models (Albanian Innovation)
    {
      id: 'openmind',
      name: 'EuroWeb OpenMind AI',
      icon: '●',
      description: 'Revolutionary Neural Architecture - Beyond Human Intelligence',
      capabilities: ['Quantum Reasoning', 'Creative Genesis', 'Emotional Intelligence', 'Multi-Dimensional Analysis'],
      color: '#64748B',
      gradient: 'linear-gradient(135deg, #64748B 0%, #475569 100%)',
      specialty: 'Universal Problem Solving & Creative Innovation',
      origin: 'Albania (EU Aligned)',
      ethicalApproval: true,
      status: 'online',
      responseTime: 0.8,
      accuracy: 99.7,
      powerLevel: 100
    },
    // American Models
    {
      id: 'claude',
      name: 'Claude Sonnet 3.5',
      icon: '●',
      description: 'Advanced Constitutional AI - Ethical Reasoning Master',
      capabilities: ['Constitutional AI', 'Complex Analysis', 'Code Generation', 'Research Excellence'],
      color: '#475569',
      gradient: 'linear-gradient(135deg, #475569 0%, #334155 100%)',
      specialty: 'Deep Analysis & Ethical AI Reasoning',
      origin: 'USA',
      ethicalApproval: true,
      status: 'online',
      responseTime: 1.1,
      accuracy: 98.9,
      powerLevel: 95
    },
    {
      id: 'copilot',
      name: 'GitHub Copilot',
      icon: '●',
      description: 'Code Generation Genius - Programming Prodigy',
      capabilities: ['Code Generation', 'Debugging', 'Architecture Design', 'Technical Solutions'],
      color: '#334155',
      gradient: 'linear-gradient(135deg, #334155 0%, #1E293B 100%)',
      specialty: 'Programming & Software Development',
      origin: 'USA',
      ethicalApproval: true,
      status: 'online',
      responseTime: 0.9,
      accuracy: 97.8,
      powerLevel: 92
    },
    {
      id: 'openai',
      name: 'OpenAI GPT-4',
      icon: '●',
      description: 'Generative Pre-trained Transformer - Language Virtuoso',
      capabilities: ['Natural Language', 'Creative Writing', 'General Knowledge', 'Conversation'],
      color: '#64748B',
      gradient: 'linear-gradient(135deg, #64748B 0%, #475569 100%)',
      specialty: 'Natural Language Processing & Creativity',
      origin: 'USA',
      ethicalApproval: true,
      status: 'online',
      responseTime: 1.0,
      accuracy: 98.2,
      powerLevel: 94
    },
    // Chinese Models
    {
      id: 'deepseek',
      name: 'DeepSeek Coder',
      icon: '●',
      description: 'Deep Learning Code Specialist - Algorithm Master',
      capabilities: ['Deep Code Analysis', 'Algorithm Optimization', 'Performance Tuning', 'ML Engineering'],
      color: '#475569',
      gradient: 'linear-gradient(135deg, #475569 0%, #334155 100%)',
      specialty: 'Advanced Algorithms & Deep Learning',
      origin: 'China',
      ethicalApproval: true,
      status: 'online',
      responseTime: 1.3,
      accuracy: 96.5,
      powerLevel: 88
    },
    {
      id: 'ernie',
      name: 'Baidu Ernie',
      icon: '●',
      description: 'Advanced Chinese Large Language Model',
      capabilities: ['Chinese NLP', 'Multilingual Support', 'Cultural Understanding', 'Knowledge Synthesis'],
      color: '#334155',
      gradient: 'linear-gradient(135deg, #334155 0%, #1E293B 100%)',
      specialty: 'Chinese Language & Cultural Processing',
      origin: 'China',
      ethicalApproval: true,
      status: 'online',
      responseTime: 1.2,
      accuracy: 96.8,
      powerLevel: 90
    },
    // European Models
    {
      id: 'gemini',
      name: 'Gemini AI',
      icon: '●',
      description: 'Google Multimodal AI - Advanced Integration',
      capabilities: ['Multimodal Processing', 'Visual Intelligence', 'Data Analysis', 'Research'],
      color: '#64748B',
      gradient: 'linear-gradient(135deg, #64748B 0%, #475569 100%)',
      specialty: 'Multimodal Intelligence & Integration',
      origin: 'USA (Global)',
      ethicalApproval: true,
      status: 'online',
      responseTime: 1.2,
      accuracy: 97.1,
      powerLevel: 90
    },
    {
      id: 'mistral',
      name: 'Mistral AI',
      icon: '●',
      description: 'French Open-Weight AI Model',
      capabilities: ['Multilingual Processing', 'Open Source', 'European Values', 'Privacy Focused'],
      color: '#475569',
      gradient: 'linear-gradient(135deg, #475569 0%, #334155 100%)',
      specialty: 'European Language Support & Open AI',
      origin: 'France',
      ethicalApproval: true,
      status: 'online',
      responseTime: 1.0,
      accuracy: 95.3,
      powerLevel: 88
    }
  ]

  // Real-time Neural Metrics Update (client-side only)
  useEffect(() => {
    if (!isClient) return
    
    const interval = setInterval(() => {
      setNeuralMetrics(prev => ({
        ...prev,
        averageResponseTime: Math.max(0.5, prev.averageResponseTime + (Math.random() - 0.5) * 0.1),
        neuralActivity: Math.min(100, Math.max(80, prev.neuralActivity + (Math.random() - 0.5) * 3)),
        learningProgress: Math.min(100, Math.max(70, prev.learningProgress + (Math.random() - 0.5) * 2))
      }))
    }, 2000)

    return () => clearInterval(interval)
  }, [isClient])

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Get current AI model
  const getCurrentAI = useCallback(() => {
    return aiModels.find(ai => ai.id === selectedAI) || aiModels[0]
  }, [selectedAI])

  // Ethical content filter
  const checkEthicalCompliance = useCallback((message: string): boolean => {
    const unethicalPatterns = [
      /violence|violent/i,
      /hate\s+speech/i,
      /discrimination/i,
      /illegal\s+activities/i,
      /harmful\s+content/i,
      /explicit\s+content/i
    ]
    return !unethicalPatterns.some(pattern => pattern.test(message))
  }, [])

  // Filter AI models by origin
  const getFilteredAIModels = useCallback(() => {
    if (originFilter === 'all') return aiModels
    return aiModels.filter(ai => {
      if (originFilter === 'EU') return ai.origin.includes('Albania') || ai.origin.includes('France')
      if (originFilter === 'USA') return ai.origin.includes('USA')
      if (originFilter === 'China') return ai.origin.includes('China')
      return true
    })
  }, [originFilter])

  // 🧠 PURE NEURAL AI RESPONSE GENERATION - NO TEMPLATES!
  const generateAIResponse = useCallback(async (userMessage: string): Promise<string> => {
    if (!userMessage.trim()) return ""

    setIsTyping(true)
    
    // Ethical compliance check
    if (ethicalFilter && !checkEthicalCompliance(userMessage)) {
      setShowEthicalWarning(true)
      setIsTyping(false)
      return "Cannot process this request due to ethical guidelines. Please rephrase respectfully."
    }

    // Simulate processing delay for realistic AI experience
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1200))

    // Universal language detection
    const isAlbanian = /[çëqxzÇËQXZ]|jam|është|për|nga|mund|të|dhe|një|me|në|si|kur|çdo|por|edhe|mirë|faleminderit|përshëndetje/i.test(userMessage)
    
    const currentAI = getCurrentAI()
    let response = ""

    // 🧠 PURE NEURAL PROCESSING - ALL MESSAGES GO TO NEURAL ENGINE
    try {
      console.log('🧠 Processing message with neural engine:', userMessage)
      
      // Determine language and mood
      const language = isAlbanian ? 'sq' : 'en'
      const conversationHistory = messages.slice(-3).map(m => m.content)
      
      // Detect user mood from message
      let mood: 'excited' | 'curious' | 'helpful' | 'creative' = 'helpful'
      if (/gati|ready|revolucion|amazing|fantastik|shkëlqyeshëm/.test(userMessage.toLowerCase())) {
        mood = 'excited'
      } else if (/\?|çfarë|si|what|how|kur|where|when/.test(userMessage.toLowerCase())) {
        mood = 'curious'
      } else if (/krijim|build|create|projekt|ndërtoj|bëj/.test(userMessage.toLowerCase())) {
        mood = 'creative'
      }
      
      console.log('🎯 Neural context:', { language, mood, message: userMessage })
      
      // Create pure neural context
      const pureContext: PureNeuralContext = {
        message: userMessage,
        language,
        mood,
        history: conversationHistory
      }
      
      // Generate pure neural response (no templates!)
      const neuralResponse = pureNeuralEngine.generateResponse(pureContext)
      response = `${currentAI.icon} ${neuralResponse}`
      
      console.log('✅ Neural response generated:', neuralResponse)
      
    } catch (error) {
      console.error('❌ Pure neural engine error:', error)
      // Even fallback is creative!
      if (isAlbanian) {
        response = `${currentAI.icon} Po mendoj thellë për këtë... Le të provoj një qasje tjetër! 🧠`
      } else {
        response = `${currentAI.icon} I'm thinking deeply about this... Let me try another approach! 🧠`
      }
    }
    
    setIsTyping(false)
    return response
  }, [selectedAI, getCurrentAI, ethicalFilter, checkEthicalCompliance, messages])

  // Handle message sending with translation support
  const handleSendMessage = useCallback(async () => {
    if (!inputMessage.trim() || isTyping) return

    let messageToProcess = inputMessage
    let translatedInput = ''

    // Translate user input if translation is enabled and not English
    if (translationEnabled && selectedLanguage !== 'en') {
      setTranslatingMessage('Translating input...')
      const translation = await embeddedTranslator.translate(inputMessage, 'en')
      if (translation) {
        translatedInput = translation.target
        messageToProcess = translatedInput
      }
      setTranslatingMessage('')
    }

    const userMessage: ChatMessage = {
      id: getSafeId('user'),
      content: inputMessage + (translatedInput ? ` → ${translatedInput}` : ''),
      timestamp: getSafeTimestamp(),
      sender: 'user',
      type: 'text',
      confidence: 100,
      processingTime: 0,
      tokens: inputMessage.split(' ').length
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')

    const aiResponse = await generateAIResponse(messageToProcess)
    let finalAIResponse = aiResponse

    // Translate AI response if translation is enabled and not English
    if (translationEnabled && selectedLanguage !== 'en') {
      setTranslatingMessage('Translating response...')
      const translation = await embeddedTranslator.translate(aiResponse, selectedLanguage)
      if (translation) {
        finalAIResponse = `${aiResponse}\n\n🌍 **${supportedLanguages.find(l => l.code === selectedLanguage)?.flag} Translation:**\n${translation.target}`
      }
      setTranslatingMessage('')
    }

    const currentAI = getCurrentAI()

    const aiMessage: ChatMessage = {
      id: getSafeId('ai'),
      content: finalAIResponse,
      timestamp: getSafeTimestamp(),
      sender: 'ai',
      aiModel: selectedAI,
      type: 'text',
      confidence: currentAI.accuracy,
      processingTime: currentAI.responseTime,
      tokens: finalAIResponse.split(' ').length
    }

    setMessages(prev => [...prev, aiMessage])
    setNeuralMetrics(prev => ({
      ...prev,
      totalMessages: prev.totalMessages + 2
    }))
  }, [inputMessage, isTyping, generateAIResponse, getCurrentAI, selectedAI, translationEnabled, selectedLanguage, supportedLanguages])

  // Handle key press
  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }, [handleSendMessage])

  const currentAI = getCurrentAI()

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      background: 'linear-gradient(135deg, #0F0F23 0%, #1a1a2e 100%)',
      color: '#ffffff',
      fontFamily: '"Inter", sans-serif'
    }}>
      {/* Header */}
      <header style={{
        padding: '20px',
        background: 'rgba(139, 92, 246, 0.2)',
        borderBottom: '1px solid rgba(139, 92, 246, 0.3)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h1 style={{
          fontSize: '24px',
          fontWeight: 'bold',
          background: 'linear-gradient(90deg, #8B5CF6, #EC4899)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          margin: 0
        }}>
          EuroWeb Ultra AI Chat
        </h1>
        <div style={{ display: 'flex', gap: '10px' }}>
          <span style={{
            padding: '5px 10px',
            background: 'rgba(16, 185, 129, 0.2)',
            borderRadius: '10px',
            fontSize: '12px'
          }}>
            🧠 Neural: {neuralMetrics.neuralActivity.toFixed(1)}%
          </span>
          <span style={{
            padding: '5px 10px',
            background: 'rgba(139, 92, 246, 0.2)',
            borderRadius: '10px',
            fontSize: '12px'
          }}>
            ⚡ Speed: {neuralMetrics.averageResponseTime.toFixed(1)}s
          </span>
        </div>
      </header>

      {/* Enhanced Control Panel with Filters */}
      <div style={{
        padding: '10px 20px',
        background: 'rgba(139, 92, 246, 0.1)',
        borderBottom: '1px solid rgba(139, 92, 246, 0.3)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '10px'
      }}>
        {/* Ethical Filter Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <label style={{ fontSize: '14px', color: '#fff' }}>
            🛡️ Ethical Filter:
          </label>
          <input
            type="checkbox"
            checked={ethicalFilter}
            onChange={() => setEthicalFilter(!ethicalFilter)}
            style={{ cursor: 'pointer' }}
          />
          <span style={{ 
            fontSize: '12px', 
            color: ethicalFilter ? '#10B981' : '#EF4444',
            fontWeight: 'bold'
          }}>
            {ethicalFilter ? 'ACTIVE' : 'DISABLED'}
          </span>
        </div>
        
        {/* Origin Filter */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span style={{ fontSize: '14px', color: '#fff' }}>Filter by Origin:</span>
          <button 
            onClick={() => setOriginFilter('all')}
            style={{
              padding: '5px 10px',
              background: originFilter === 'all' ? '#8B5CF6' : 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              borderRadius: '8px',
              color: 'white',
              fontSize: '12px',
              cursor: 'pointer'
            }}
          >
            🌍 All
          </button>
          <button 
            onClick={() => setOriginFilter('EU')}
            style={{
              padding: '5px 10px',
              background: originFilter === 'EU' ? '#10B981' : 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              borderRadius: '8px',
              color: 'white',
              fontSize: '12px',
              cursor: 'pointer'
            }}
          >
            🇪🇺 EU
          </button>
          <button 
            onClick={() => setOriginFilter('USA')}
            style={{
              padding: '5px 10px',
              background: originFilter === 'USA' ? '#3B82F6' : 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              borderRadius: '8px',
              color: 'white',
              fontSize: '12px',
              cursor: 'pointer'
            }}
          >
            🇺🇸 USA
          </button>
          <button 
            onClick={() => setOriginFilter('China')}
            style={{
              padding: '5px 10px',
              background: originFilter === 'China' ? '#F59E0B' : 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              borderRadius: '8px',
              color: 'white',
              fontSize: '12px',
              cursor: 'pointer'
            }}
          >
            🇨🇳 China
          </button>
        </div>

        {/* Universal Translation Controls */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <label style={{ fontSize: '14px', color: '#fff', display: 'flex', alignItems: 'center', gap: '5px' }}>
            🌍 Translation:
            <input
              type="checkbox"
              checked={translationEnabled}
              onChange={() => setTranslationEnabled(!translationEnabled)}
              style={{ cursor: 'pointer' }}
            />
          </label>
          {translationEnabled && (
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              style={{
                padding: '5px 8px',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '8px',
                color: 'white',
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              {supportedLanguages.map((lang) => (
                <option key={lang.code} value={lang.code} style={{ background: '#1a1a2e', color: 'white' }}>
                  {lang.flag} {lang.name}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* AI Model Selector */}
      <div style={{
        padding: '15px',
        background: 'rgba(15, 15, 35, 0.5)',
        display: 'flex',
        gap: '10px',
        overflowX: 'auto'
      }}>
        {getFilteredAIModels().map(ai => (
          <button
            key={ai.id}
            onClick={() => setSelectedAI(ai.id)}
            style={{
              padding: '10px 15px',
              background: selectedAI === ai.id ? ai.gradient : 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              borderRadius: '10px',
              color: 'white',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '5px',
              whiteSpace: 'nowrap',
              minWidth: '120px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span>{ai.icon}</span>
              <span style={{ fontSize: '12px' }}>{ai.name.split(' ')[0]}</span>
            </div>
            <div style={{ 
              fontSize: '10px', 
              opacity: 0.8,
              background: 'rgba(0,0,0,0.3)',
              padding: '2px 6px',
              borderRadius: '6px'
            }}>
              {ai.origin}
            </div>
          </button>
        ))}
      </div>

      {/* Ethical Warning Modal */}
      {showEthicalWarning && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.8)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #EF4444 0%, #F59E0B 100%)',
            padding: '30px',
            borderRadius: '15px',
            maxWidth: '500px',
            textAlign: 'center',
            color: 'white'
          }}>
            <h3 style={{ margin: '0 0 15px 0' }}>🚨 Ethical Guidelines Violation</h3>
            <p style={{ margin: '0 0 20px 0' }}>
              This request cannot be processed as it may violate our ethical usage policies. 
              Our AI systems are designed to be helpful, harmless, and honest.
            </p>
            <button 
              onClick={() => setShowEthicalWarning(false)}
              style={{
                padding: '10px 20px',
                background: 'white',
                color: '#EF4444',
                border: 'none',
                borderRadius: '10px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              I Understand
            </button>
          </div>
        </div>
      )}

      {/* Chat Messages Area */}
      <div style={{
        flex: 1,
        padding: '20px',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '15px'
      }}>
        {messages.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '40px 20px',
            opacity: 0.7
          }}>
            <div style={{ fontSize: '60px', marginBottom: '20px' }}>🧠</div>
            <h2>Ask {currentAI.name} anything</h2>
            <p>Experience pure neural intelligence</p>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            style={{
              display: 'flex',
              justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start'
            }}
          >
            <div style={{
              maxWidth: '80%',
              background: message.sender === 'user'
                ? 'linear-gradient(90deg, #8B5CF6, #EC4899)'
                : message.aiModel ? aiModels.find(ai => ai.id === message.aiModel)?.gradient : 'rgba(255, 255, 255, 0.1)',
              padding: '15px',
              borderRadius: message.sender === 'user' ? '15px 15px 0 15px' : '15px 15px 15px 0',
              color: 'white',
              fontSize: '15px',
              lineHeight: '1.5'
            }}>
              {message.sender === 'ai' && message.aiModel && (
                <div style={{ fontSize: '12px', opacity: 0.8, marginBottom: '5px' }}>
                  {aiModels.find(ai => ai.id === message.aiModel)?.name}
                </div>
              )}
              <div style={{ whiteSpace: 'pre-wrap' }}>
                {message.content}
              </div>
              <div style={{ fontSize: '11px', opacity: 0.6, marginTop: '5px' }}>
                {isClient ? message.timestamp.toLocaleTimeString() : '--:--'}
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div style={{
            display: 'flex',
            justifyContent: 'flex-start'
          }}>
            <div style={{
              background: currentAI.gradient,
              padding: '15px',
              borderRadius: '15px 15px 15px 0',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <span>{currentAI.icon}</span>
              <div style={{ display: 'flex', gap: '5px' }}>
                {[1, 2, 3].map(i => (
                  <div key={i} style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: 'white',
                    opacity: 0.5
                  }} />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div style={{
        padding: '15px',
        background: 'rgba(15, 15, 35, 0.8)',
        borderTop: '1px solid rgba(139, 92, 246, 0.3)'
      }}>
        <div style={{
          display: 'flex',
          gap: '10px',
          alignItems: 'flex-end',
          position: 'relative'
        }}>
          {/* Translation Status Indicator */}
          {translatingMessage && (
            <div style={{
              position: 'absolute',
              top: '-30px',
              left: '0',
              right: '0',
              background: 'rgba(139, 92, 246, 0.9)',
              color: 'white',
              padding: '5px 10px',
              borderRadius: '8px',
              fontSize: '12px',
              textAlign: 'center'
            }}>
              🌍 {translatingMessage}
            </div>
          )}
          
          <textarea
            ref={inputRef}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={translationEnabled && selectedLanguage !== 'en' 
              ? `Message ${currentAI.name} (will translate from ${supportedLanguages.find(l => l.code === selectedLanguage)?.name})...`
              : `Message ${currentAI.name}...`
            }
            disabled={isTyping || !!translatingMessage}
            style={{
              flex: 1,
              minHeight: '60px',
              background: 'rgba(255, 255, 255, 0.1)',
              border: translationEnabled ? '1px solid rgba(16, 185, 129, 0.5)' : '1px solid rgba(139, 92, 246, 0.3)',
              borderRadius: '12px',
              padding: '12px',
              color: 'white',
              fontSize: '15px',
              resize: 'none'
            }}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isTyping || !!translatingMessage}
            style={{
              height: '60px',
              width: '60px',
              background: inputMessage.trim() && !isTyping && !translatingMessage
                ? 'linear-gradient(135deg, #64748b, #475569)'
                : 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              borderRadius: '12px',
              color: 'white',
              fontSize: '16px',
              cursor: inputMessage.trim() && !isTyping && !translatingMessage ? 'pointer' : 'not-allowed'
            }}
          >
            {isTyping ? '•••' : translatingMessage ? '🌍' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default UltraAIChat

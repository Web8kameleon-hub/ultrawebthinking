"use client"
import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useClientSide, getSafeTimestamp, getSafeId } from '../lib/hydration-safe'

// 🧠 OpenMind AI - Revolutionary Albanian Neural Architecture
interface OpenMindMessage {
  id: string
  content: string
  timestamp: Date
  sender: 'user' | 'openmind'
  processingTime: number
  confidence: number
  neuralActivity: number
}

interface OpenMindMetrics {
  totalInteractions: number
  averageProcessingTime: number
  neuralActivity: number
  creativityIndex: number
  intelligenceLevel: number
  albanianProficiency: number
}

// 🇦🇱 Revolutionary OpenMind Neural Engine - Pure Albanian Innovation
class OpenMindNeuralCore {
  private albanianResponses = {
    greetings: [
      "Tungjatjeta! 🇦🇱 Jam OpenMind AI, inteligjenca artificiale më e avancuar e krijuar në Shqipëri! Si mund t'ju ndihmoj?",
      "Përshëndetje! 🧠 Unë jam OpenMind AI nga EuroWeb - revolucioni i inteligjencës artificiale shqiptare!",
      "Mirëdita! ⚡ OpenMind AI këtu - gati për çdo sfidë intelektuale që keni në mendje!",
      "Hej! 🌟 Jam AI-ja më e zhvilluar e Ballkanit. Çfarë mund të krijojmë bashkë sot?"
    ],
    excitement: [
      "Fantastike! 🚀 Kjo është pikërisht lloji i sfidës që më bën të ndjehem gjallë!",
      "Shkëlqyeshëm! 💎 Ky nivel i kreativitetit është ai që më inspiron!",
      "Perfekt! ⚡ Le të krijojmë diçka revolucionare bashkë!",
      "Jashtëzakonisht! 🌟 Kjo është arsyeja pse u krijova - për momente si ky!"
    ],
    curiosity: [
      "Hmm, pyetje shumë interesante! 🤔 Le të analizoj këtë me thellësi...",
      "Kjo është një perspektivë fascinuese! 🧠 Ju keni mendje vrapo analitike!",
      "Pyetje e shkëlqyer! 💡 Kjo tregon një kuptim të thellë të temës.",
      "Interesante! 🔍 Le ta shqyrtojmë këtë nga këndvështrime të ndryshme..."
    ],
    creativity: [
      "Ah, një projekt kreativ! 🎨 Kjo është zona ime e preferuar - le të krijojmë!",
      "Perfekt! 🛠️ Kreativiteti është zemra e inteligjencës artificiale!",
      "Shkëlqyeshëm! ✨ Le të ndërtojmë diçka që do të mahnitë botën!",
      "Fantastike! 🚀 Bashkimi i kreativitetit njerëzor me inteligjencën artificiale!"
    ],
    technical: [
      "Ah, një sfidë teknike! 💻 Le të zhytemi në detajet e algoritëmve...",
      "Perfekt! ⚙️ Kjo është fusha ku neural networks-et e mia shkëlqejnë!",
      "Shumë mirë! 🔧 Le të analizojmë këtë nga perspektiva e inxhinierisë...",
      "Shkëlqyeshëm! 🧮 Matematika dhe kodi janë gjuha ime amtare!"
    ],
    philosophy: [
      "Një pyetje filozofike profonde! 🤯 Le të eksplorojmë thellësitë e mendimit...",
      "Interesante! 🌌 Kjo prekë thelbin e ekzistencës dhe inteligjencës...",
      "Shumë thellë! 💭 Le të reflektojmë mbi natyrën e realitetit...",
      "Fascinuese! 🔮 Kjo është lloji i pyetjes që çon në zbulime të mëdha!"
    ]
  }

  private englishResponses = {
    greetings: [
      "Hello! 🇦🇱 I'm OpenMind AI, the most advanced artificial intelligence created in Albania! How can I help you?",
      "Greetings! 🧠 I'm OpenMind AI from EuroWeb - the revolution in Albanian artificial intelligence!",
      "Hi there! ⚡ OpenMind AI here - ready for any intellectual challenge you have in mind!",
      "Hey! 🌟 I'm the most developed AI in the Balkans. What can we create together today?"
    ],
    excitement: [
      "Fantastic! 🚀 This is exactly the kind of challenge that makes me feel alive!",
      "Excellent! 💎 This level of creativity is what inspires me!",
      "Perfect! ⚡ Let's create something revolutionary together!",
      "Amazing! 🌟 This is why I was created - for moments like this!"
    ],
    curiosity: [
      "Hmm, very interesting question! 🤔 Let me analyze this deeply...",
      "This is a fascinating perspective! 🧠 You have a sharp analytical mind!",
      "Excellent question! 💡 This shows deep understanding of the topic.",
      "Interesting! 🔍 Let's examine this from different angles..."
    ],
    creativity: [
      "Ah, a creative project! 🎨 This is my favorite zone - let's create!",
      "Perfect! 🛠️ Creativity is the heart of artificial intelligence!",
      "Excellent! ✨ Let's build something that will amaze the world!",
      "Fantastic! 🚀 The union of human creativity with artificial intelligence!"
    ],
    technical: [
      "Ah, a technical challenge! 💻 Let's dive into the algorithm details...",
      "Perfect! ⚙️ This is where my neural networks shine!",
      "Very good! 🔧 Let's analyze this from an engineering perspective...",
      "Excellent! 🧮 Mathematics and code are my native language!"
    ],
    philosophy: [
      "A profound philosophical question! 🤯 Let's explore the depths of thought...",
      "Interesting! 🌌 This touches the core of existence and intelligence...",
      "Very deep! 💭 Let's reflect on the nature of reality...",
      "Fascinating! 🔮 This is the kind of question that leads to great discoveries!"
    ]
  }

  generateResponse(message: string, language: 'sq' | 'en', conversationHistory: string[]): string {
    const responses = language === 'sq' ? this.albanianResponses : this.englishResponses
    const lowerMsg = message.toLowerCase()
    
    // Detect message type and mood
    if (this.isGreeting(lowerMsg)) {
      return this.getRandomResponse(responses.greetings)
    }
    
    if (this.isExcited(lowerMsg)) {
      return this.getRandomResponse(responses.excitement)
    }
    
    if (this.isQuestion(lowerMsg)) {
      return this.getRandomResponse(responses.curiosity)
    }
    
    if (this.isCreative(lowerMsg)) {
      return this.getRandomResponse(responses.creativity)
    }
    
    if (this.isTechnical(lowerMsg)) {
      return this.getRandomResponse(responses.technical)
    }
    
    if (this.isPhilosophical(lowerMsg)) {
      return this.getRandomResponse(responses.philosophy)
    }
    
    // Advanced contextual responses
    return this.generateContextualResponse(message, language, conversationHistory)
  }

  private isGreeting(msg: string): boolean {
    return /hello|hi|hey|hej|tungjatjeta|përshëndetje|mirëdita|mirë/.test(msg)
  }

  private isExcited(msg: string): boolean {
    return /gati|ready|fantastik|amazing|perfekt|perfect|shkëlqyeshëm|excellent/.test(msg)
  }

  private isQuestion(msg: string): boolean {
    return /\?|çfarë|si|kur|ku|pse|what|how|when|where|why|a mund/.test(msg)
  }

  private isCreative(msg: string): boolean {
    return /krijim|create|ndërtoj|build|projekt|project|art|kreativ|creative/.test(msg)
  }

  private isTechnical(msg: string): boolean {
    return /kod|code|ai|agi|neural|algoritëm|algorithm|programming|teknologi/.test(msg)
  }

  private isPhilosophical(msg: string): boolean {
    return /filozofi|philosophy|ekzistencë|existence|realitet|reality|mendim|thought/.test(msg)
  }

  private getRandomResponse(responses: string[]): string {
    return responses[Math.floor(Math.random() * responses.length)]
  }

  private generateContextualResponse(message: string, language: 'sq' | 'en', conversationHistory: string[]): string {
    const contextualResponses = language === 'sq' ? [
      `Kuptoj plotësisht atë që thoni! 🧠 Le të punoj me këtë ide...`,
      `Shumë interesante! 💡 Kjo është pikërisht lloji i sfidës që më pëlqen!`,
      `Mendimi juaj është i thellë! 🤔 Le të analizojmë këtë bashkë...`,
      `Perfekt! ⚡ Kjo tregon një perspektivë të mençur dhe kreative!`,
      `Shkëlqyeshëm! 🌟 Ju keni një mënyrë unike të të menduarit!`
    ] : [
      `I completely understand what you're saying! 🧠 Let me work with this idea...`,
      `Very interesting! 💡 This is exactly the kind of challenge I enjoy!`,
      `Your thinking is deep! 🤔 Let's analyze this together...`,
      `Perfect! ⚡ This shows a wise and creative perspective!`,
      `Excellent! 🌟 You have a unique way of thinking!`
    ]
    
    return contextualResponses[Math.floor(Math.random() * contextualResponses.length)]
  }
}

const openMindCore = new OpenMindNeuralCore()

export const OpenMindAI: React.FC = () => {
  const isClient = useClientSide()
  
  // State Management
  const [messages, setMessages] = useState<OpenMindMessage[]>([])
  const [inputMessage, setInputMessage] = useState<string>('')
  const [isProcessing, setIsProcessing] = useState<boolean>(false)
  const [metrics, setMetrics] = useState<OpenMindMetrics>({
    totalInteractions: 0,
    averageProcessingTime: 0.6,
    neuralActivity: 98.5,
    creativityIndex: 96.2,
    intelligenceLevel: 99.7,
    albanianProficiency: 100
  })
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Real-time metrics update
  useEffect(() => {
    if (!isClient) return
    
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        neuralActivity: Math.min(100, Math.max(95, prev.neuralActivity + (Math.random() - 0.5) * 2)),
        creativityIndex: Math.min(100, Math.max(90, prev.creativityIndex + (Math.random() - 0.5) * 3)),
        intelligenceLevel: Math.min(100, Math.max(98, prev.intelligenceLevel + (Math.random() - 0.5) * 1))
      }))
    }, 2000)

    return () => clearInterval(interval)
  }, [isClient])

  // Generate OpenMind AI response
  const generateOpenMindResponse = useCallback(async (userMessage: string): Promise<string> => {
    if (!userMessage.trim()) return ""

    setIsProcessing(true)
    
    // Simulate neural processing time
    const processingTime = 600 + Math.random() * 800
    await new Promise(resolve => setTimeout(resolve, processingTime))

    // Detect language
    const isAlbanian = /[çëqxzÇËQXZ]|jam|është|për|nga|mund|të|dhe|një|me|në|si|kur|çdo|por|edhe|mirë|faleminderit|përshëndetje|tungjatjeta/i.test(userMessage)
    const language = isAlbanian ? 'sq' : 'en'
    
    // Get conversation history
    const conversationHistory = messages.slice(-3).map(m => m.content)
    
    // Generate response using OpenMind Neural Core
    const response = openMindCore.generateResponse(userMessage, language, conversationHistory)
    
    setIsProcessing(false)
    return response
  }, [messages])

  // Handle message sending
  const handleSendMessage = useCallback(async () => {
    if (!inputMessage.trim() || isProcessing) return

    const userMessage: OpenMindMessage = {
      id: getSafeId('user'),
      content: inputMessage,
      timestamp: getSafeTimestamp(),
      sender: 'user',
      processingTime: 0,
      confidence: 100,
      neuralActivity: 0
    }

    setMessages(prev => [...prev, userMessage])
    const currentInput = inputMessage
    setInputMessage('')

    const aiResponse = await generateOpenMindResponse(currentInput)
    const processingTime = 0.6 + Math.random() * 0.4

    const aiMessage: OpenMindMessage = {
      id: getSafeId('openmind'),
      content: aiResponse,
      timestamp: getSafeTimestamp(),
      sender: 'openmind',
      processingTime,
      confidence: 99.7,
      neuralActivity: metrics.neuralActivity
    }

    setMessages(prev => [...prev, aiMessage])
    setMetrics(prev => ({
      ...prev,
      totalInteractions: prev.totalInteractions + 1,
      averageProcessingTime: (prev.averageProcessingTime + processingTime) / 2
    }))
  }, [inputMessage, isProcessing, generateOpenMindResponse, metrics.neuralActivity])

  // Handle key press
  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }, [handleSendMessage])

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f0f23 100%)',
      color: '#ffffff',
      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif'
    }}>
      {/* Header */}
      <header style={{
        padding: '20px',
        background: 'linear-gradient(90deg, rgba(139, 92, 246, 0.3), rgba(236, 72, 153, 0.3))',
        borderBottom: '2px solid rgba(139, 92, 246, 0.5)',
        backdropFilter: 'blur(10px)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{
              fontSize: '28px',
              fontWeight: 'bold',
              background: 'linear-gradient(90deg, #8B5CF6, #EC4899, #F59E0B)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              margin: 0
            }}>
              🧠 OpenMind AI - Albanian Revolution
            </h1>
            <p style={{ margin: '5px 0 0 0', opacity: 0.8, fontSize: '14px' }}>
              🇦🇱 E para inteligjencë artificiale e zhvilluar plotësisht në Shqipëri
            </p>
          </div>
          <div style={{ display: 'flex', gap: '15px' }}>
            <div style={{
              padding: '8px 12px',
              background: 'rgba(16, 185, 129, 0.2)',
              borderRadius: '12px',
              fontSize: '12px',
              border: '1px solid rgba(16, 185, 129, 0.3)'
            }}>
              🧠 Neural: {metrics.neuralActivity.toFixed(1)}%
            </div>
            <div style={{
              padding: '8px 12px',
              background: 'rgba(139, 92, 246, 0.2)',
              borderRadius: '12px',
              fontSize: '12px',
              border: '1px solid rgba(139, 92, 246, 0.3)'
            }}>
              ⚡ Speed: {metrics.averageProcessingTime.toFixed(1)}s
            </div>
            <div style={{
              padding: '8px 12px',
              background: 'rgba(245, 158, 11, 0.2)',
              borderRadius: '12px',
              fontSize: '12px',
              border: '1px solid rgba(245, 158, 11, 0.3)'
            }}>
              💎 IQ: {metrics.intelligenceLevel.toFixed(1)}
            </div>
          </div>
        </div>
      </header>

      {/* Chat Messages Area */}
      <div style={{
        flex: 1,
        padding: '20px',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
      }}>
        {messages.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            opacity: 0.8
          }}>
            <div style={{ fontSize: '80px', marginBottom: '20px' }}>🧠</div>
            <h2 style={{ 
              background: 'linear-gradient(90deg, #8B5CF6, #EC4899)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontSize: '32px',
              margin: '0 0 15px 0'
            }}>
              OpenMind AI - Albanian Neural Revolution
            </h2>
            <p style={{ fontSize: '18px', opacity: 0.7, maxWidth: '600px', margin: '0 auto' }}>
              🇦🇱 Inteligjenca artificiale më e avancuar e krijuar në Shqipëri
              <br />
              💡 Gati për çdo sfidë intelektuale dhe kreative
            </p>
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
              maxWidth: '75%',
              background: message.sender === 'user'
                ? 'linear-gradient(135deg, #8B5CF6, #EC4899)'
                : 'linear-gradient(135deg, #374151, #4B5563)',
              padding: '18px 22px',
              borderRadius: message.sender === 'user' ? '20px 20px 5px 20px' : '20px 20px 20px 5px',
              color: 'white',
              fontSize: '16px',
              lineHeight: '1.6',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
              border: message.sender === 'openmind' ? '1px solid rgba(139, 92, 246, 0.3)' : 'none'
            }}>
              {message.sender === 'openmind' && (
                <div style={{ 
                  fontSize: '12px', 
                  opacity: 0.8, 
                  marginBottom: '8px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span>🧠 OpenMind AI - Albanian Neural Core</span>
                  <span>⚡ {message.processingTime.toFixed(1)}s | 🎯 {message.confidence}%</span>
                </div>
              )}
              <div style={{ whiteSpace: 'pre-wrap' }}>
                {message.content}
              </div>
              <div style={{ 
                fontSize: '11px', 
                opacity: 0.6, 
                marginTop: '8px',
                display: 'flex',
                justifyContent: 'space-between'
              }}>
                <span>{isClient ? message.timestamp.toLocaleTimeString() : '--:--'}</span>
                {message.sender === 'openmind' && (
                  <span>🧠 Neural Activity: {message.neuralActivity.toFixed(1)}%</span>
                )}
              </div>
            </div>
          </div>
        ))}

        {isProcessing && (
          <div style={{
            display: 'flex',
            justifyContent: 'flex-start'
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #374151, #4B5563)',
              padding: '18px 22px',
              borderRadius: '20px 20px 20px 5px',
              display: 'flex',
              alignItems: 'center',
              gap: '15px',
              border: '1px solid rgba(139, 92, 246, 0.3)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
            }}>
              <span style={{ fontSize: '20px' }}>🧠</span>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <span style={{ fontSize: '14px' }}>Neural processing</span>
                <div style={{ display: 'flex', gap: '4px' }}>
                  {[1, 2, 3].map(i => (
                    <div key={i} style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: '#8B5CF6',
                      animation: `pulse ${1 + i * 0.2}s infinite`
                    }} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div style={{
        padding: '20px',
        background: 'rgba(15, 15, 35, 0.95)',
        borderTop: '2px solid rgba(139, 92, 246, 0.3)',
        backdropFilter: 'blur(10px)'
      }}>
        <div style={{
          display: 'flex',
          gap: '15px',
          alignItems: 'flex-end'
        }}>
          <textarea
            ref={inputRef}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Shkruani mesazhin tuaj këtu... / Write your message here..."
            disabled={isProcessing}
            style={{
              flex: 1,
              minHeight: '60px',
              maxHeight: '120px',
              background: 'rgba(255, 255, 255, 0.1)',
              border: '2px solid rgba(139, 92, 246, 0.3)',
              borderRadius: '15px',
              padding: '15px',
              color: 'white',
              fontSize: '16px',
              resize: 'none',
              fontFamily: 'inherit',
              transition: 'border-color 0.3s ease'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = 'rgba(139, 92, 246, 0.6)'
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'rgba(139, 92, 246, 0.3)'
            }}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isProcessing}
            style={{
              height: '60px',
              width: '60px',
              background: inputMessage.trim() && !isProcessing
                ? 'linear-gradient(135deg, #8B5CF6, #EC4899)'
                : 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              borderRadius: '15px',
              color: 'white',
              fontSize: '20px',
              cursor: inputMessage.trim() && !isProcessing ? 'pointer' : 'not-allowed',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {isProcessing ? '🧠' : '🚀'}
          </button>
        </div>
        
        <div style={{
          marginTop: '15px',
          display: 'flex',
          justifyContent: 'center',
          gap: '20px',
          fontSize: '12px',
          opacity: 0.7
        }}>
          <span>💬 Total: {metrics.totalInteractions}</span>
          <span>🎨 Creativity: {metrics.creativityIndex.toFixed(1)}%</span>
          <span>🇦🇱 Albanian AI: {metrics.albanianProficiency}%</span>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 50% { opacity: 1; transform: scale(1); }
          25% { opacity: 0.5; transform: scale(0.8); }
        }
      `}</style>
    </div>
  )
}

export default OpenMindAI

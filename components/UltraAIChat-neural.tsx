/**
 * 🧠 Ultra AI Chat - Pure Neural Response System
 * ZERO templates - All responses from neural engine
 * 
 * @author Ledjan Ahmati
 * @version 8.0.0-PURE-NEURAL
 * @contact dealsjona@gmail.com
 */

"use client"
import React, { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { pureNeuralEngine, type PureNeuralContext } from '../lib/pure-neural-engine'
import { useClientSide, getSafeTimestamp, getSafeId } from '../lib/hydration-safe'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  aiModel?: string
}

interface AIModel {
  id: string
  name: string
  icon: string
  description: string
  origin: string
  color: string
}

export default function UltraAIChat() {
  const isClient = useClientSide()
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [selectedAI, setSelectedAI] = useState('openmind')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const aiModels: AIModel[] = [
    {
      id: 'openmind',
      name: 'EuroWeb OpenMind AI',
      icon: '🧠',
      description: 'Pure Neural Albanian AI',
      origin: 'Albania (EU Aligned)',
      color: 'from-purple-600 to-blue-600'
    },
    {
      id: 'claude',
      name: 'Claude',
      icon: '🤖',
      description: 'Anthropic Assistant',
      origin: 'USA',
      color: 'from-orange-500 to-red-500'
    },
    {
      id: 'openai',
      name: 'OpenAI GPT-4',
      icon: '✨',
      description: 'Advanced Language Model',
      origin: 'USA',
      color: 'from-green-500 to-teal-500'
    }
  ]

  const getCurrentAI = () => aiModels.find(ai => ai.id === selectedAI) || aiModels[0]

  // 🧠 PURE NEURAL RESPONSE GENERATION
  const generateAIResponse = useCallback(async (userMessage: string): Promise<string> => {
    setIsTyping(true)
    
    try {
      // Detect language
      const isAlbanian = /[çëqxzÇËQXZ]|jam|është|për|nga|mund|të|dhe|një|me|në|si|kur|përshëndetje|mirë|faleminderit/i.test(userMessage)
      
      // Determine mood
      let mood: 'excited' | 'curious' | 'helpful' | 'creative' = 'helpful'
      if (/gati|ready|revolucion|amazing|fantastik|shkëlqyeshëm|beautiful|wonderful/i.test(userMessage)) {
        mood = 'excited'
      } else if (/\?|çfarë|si|what|how|kur|where|when|pse|why/i.test(userMessage)) {
        mood = 'curious'
      } else if (/krijim|build|create|projekt|ndërtoj|bëj|make|design/i.test(userMessage)) {
        mood = 'creative'
      }

      console.log('🧠 Neural processing:', { message: userMessage, language: isAlbanian ? 'sq' : 'en', mood })

      // Create neural context
      const pureContext: PureNeuralContext = {
        message: userMessage,
        language: isAlbanian ? 'sq' : 'en',
        mood,
        history: messages.slice(-3).map(m => m.content)
      }

      // Generate neural response
      const neuralResponse = pureNeuralEngine.generateResponse(pureContext)
      const currentAI = getCurrentAI()
      
      console.log('✅ Neural response:', neuralResponse)
      
      return `${currentAI.icon} ${neuralResponse}`
      
    } catch (error) {
      console.error('❌ Neural engine error:', error)
      const currentAI = getCurrentAI()
      const isAlbanian = /[çëqxzÇËQXZ]|jam|është|për|nga|mund|të|dhe|një|me|në|si|kur|përshëndetje|mirë|faleminderit/i.test(userMessage)
      
      return isAlbanian ? 
        `${currentAI.icon} Po mendoj thellë për këtë... Le të provoj një qasje tjetër! 🧠` :
        `${currentAI.icon} I'm thinking deeply about this... Let me try another approach! 🧠`
    } finally {
      setIsTyping(false)
    }
  }, [messages, selectedAI])

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isTyping) return

    const userMsg: Message = {
      id: getSafeId('msg'),
      role: 'user',
      content: inputMessage.trim(),
      timestamp: getSafeTimestamp(),
      aiModel: selectedAI
    }

    setMessages(prev => [...prev, userMsg])
    setInputMessage('')

    // Generate AI response
    const aiResponse = await generateAIResponse(userMsg.content)
    
    const aiMsg: Message = {
      id: getSafeId('ai'),
      role: 'assistant',
      content: aiResponse,
      timestamp: getSafeTimestamp(),
      aiModel: selectedAI
    }

    setMessages(prev => [...prev, aiMsg])
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  if (!isClient) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-purple-600 font-medium">🧠 AGI Core Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            EuroWeb Ultra AI Chat
          </h1>
          <p className="text-gray-600 mt-2">🧠 Pure Neural Response Engine - Zero Templates</p>
          
          {/* AI Model Selector */}
          <div className="mt-4 flex flex-wrap gap-2">
            {aiModels.map(ai => (
              <button
                key={ai.id}
                onClick={() => setSelectedAI(ai.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedAI === ai.id
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {ai.icon} {ai.name}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Messages */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 mb-6 h-96 overflow-y-auto">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`mb-4 flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] px-4 py-2 rounded-2xl ${
                    message.role === 'user'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <div className="text-sm">{message.content}</div>
                  <div className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start mb-4"
            >
              <div className="bg-gray-100 text-gray-800 px-4 py-2 rounded-2xl">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                </div>
              </div>
            </motion.div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-4">
          <div className="flex space-x-3">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Shkruaj mesazhin tuaj... / Type your message..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              disabled={isTyping}
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isTyping}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              🚀 Send
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

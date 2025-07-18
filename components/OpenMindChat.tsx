'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { OPENMIND_CONFIG, AIProvider } from '../config/openmind'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  provider?: string
  timestamp: Date
}

export default function OpenMindChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [selectedProvider, setSelectedProvider] = useState<AIProvider>('openmind')
  const [isLoading, setIsLoading] = useState(false)

  const sendMessage = (content: string) => {
    if (!content.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    // Simulate AI response
    setTimeout(() => {
      const provider = OPENMIND_CONFIG.providers[selectedProvider]
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `${provider.icon} ${provider.name}: I understand your message "${content}". ${provider.description}. How can I help you further?`,
        provider: selectedProvider,
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, aiMessage])
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      background: 'linear-gradient(135deg, #1a1d29 0%, #2d2a45 100%)',
      color: '#f8fafc',
      fontFamily: 'Inter, sans-serif'
    }}>
      {/* Header */}
      <div style={{
        padding: '20px',
        borderBottom: '1px solid #374151',
        background: 'rgba(26, 29, 41, 0.9)',
        backdropFilter: 'blur(10px)'
      }}>
        <h1 style={{
          fontSize: '24px',
          fontWeight: 'bold',
          color: '#d4af37',
          marginBottom: '10px'
        }}>
          🧠 EuroWeb OpenMind AI
        </h1>
        
        {/* Provider Selector */}
        <div style={{
          display: 'flex',
          gap: '10px',
          flexWrap: 'wrap',
          marginTop: '15px'
        }}>
          {Object.entries(OPENMIND_CONFIG.providers).map(([key, provider]) => (
            <motion.button
              key={key}
              onClick={() => setSelectedProvider(key as AIProvider)}
              style={{
                padding: '8px 16px',
                borderRadius: '20px',
                border: selectedProvider === key ? '2px solid #d4af37' : '1px solid #374151',
                background: selectedProvider === key ? 'rgba(212, 175, 55, 0.1)' : 'rgba(55, 65, 81, 0.3)',
                color: selectedProvider === key ? '#d4af37' : '#cbd5e1',
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {provider.icon} {provider.name}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Chat Messages */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '15px'
      }}>
        {messages.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '40px',
            color: '#6b7280'
          }}>
            <h3 style={{ fontSize: '18px', marginBottom: '10px' }}>
              Welcome to OpenMind AI Gateway
            </h3>
            <p>Choose an AI provider and start chatting with multiple AI models!</p>
          </div>
        )}

        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              alignSelf: message.role === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '80%',
              padding: '15px',
              borderRadius: '15px',
              background: message.role === 'user' 
                ? 'linear-gradient(45deg, #d4af37, #ffd700)'
                : 'rgba(55, 65, 81, 0.5)',
              color: message.role === 'user' ? '#1a1d29' : '#f8fafc',
              backdropFilter: 'blur(10px)'
            }}
          >
            <div style={{
              fontSize: '14px',
              fontWeight: 'bold',
              marginBottom: '5px',
              opacity: 0.8
            }}>
              {message.role === 'user' ? 'You' : message.provider ? OPENMIND_CONFIG.providers[message.provider as AIProvider]?.name : 'AI'}
            </div>
            <div>{message.content}</div>
            <div style={{
              fontSize: '12px',
              opacity: 0.6,
              marginTop: '5px'
            }}>
              {message.timestamp.toLocaleTimeString()}
            </div>
          </motion.div>
        ))}

        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              alignSelf: 'flex-start',
              padding: '15px',
              borderRadius: '15px',
              background: 'rgba(55, 65, 81, 0.5)',
              color: '#f8fafc'
            }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <div style={{
                width: '20px',
                height: '20px',
                border: '2px solid #d4af37',
                borderTop: '2px solid transparent',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }} />
              {OPENMIND_CONFIG.providers[selectedProvider].name} is thinking...
            </div>
          </motion.div>
        )}
      </div>

      {/* Input Area */}
      <div style={{
        padding: '20px',
        borderTop: '1px solid #374151',
        background: 'rgba(26, 29, 41, 0.9)',
        backdropFilter: 'blur(10px)'
      }}>
        <div style={{
          display: 'flex',
          gap: '10px',
          alignItems: 'center'
        }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !isLoading && sendMessage(input)}
            placeholder={`Ask ${OPENMIND_CONFIG.providers[selectedProvider].name} anything...`}
            disabled={isLoading}
            style={{
              flex: 1,
              padding: '12px 16px',
              borderRadius: '25px',
              border: '1px solid #374151',
              background: 'rgba(55, 65, 81, 0.3)',
              color: '#f8fafc',
              fontSize: '16px',
              outline: 'none'
            }}
          />
          <motion.button
            onClick={() => sendMessage(input)}
            disabled={isLoading || !input.trim()}
            style={{
              padding: '12px 24px',
              borderRadius: '25px',
              border: 'none',
              background: input.trim() && !isLoading 
                ? 'linear-gradient(45deg, #d4af37, #ffd700)' 
                : 'rgba(55, 65, 81, 0.5)',
              color: input.trim() && !isLoading ? '#1a1d29' : '#6b7280',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: input.trim() && !isLoading ? 'pointer' : 'not-allowed',
              transition: 'all 0.3s ease'
            }}
            whileHover={input.trim() && !isLoading ? { scale: 1.05 } : {}}
            whileTap={input.trim() && !isLoading ? { scale: 0.95 } : {}}
          >
            Send
          </motion.button>
        </div>
      </div>

      <style jsx global>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

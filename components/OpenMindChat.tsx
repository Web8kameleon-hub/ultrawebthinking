'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { AIProvider, OPENMIND_CONFIG } from '../config/openmind';
import DualMindEngine from '../lib/dualMindEngine';
import UniversalTranslationEngine from '../lib/universalTranslationEngine';

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  provider?: string
  timestamp: Date
  isAlbi?: boolean
  isJona?: boolean
  isSynthesis?: boolean
}

const OpenMindChat = () => {
  // React state for proper reactivity
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [selectedProvider, setSelectedProvider] = useState<AIProvider>('openmind');
  const [isLoading, setIsLoading] = useState(false);
  const [isDualMindMode, setIsDualMindMode] = useState(true);
  
  // Initialize engines
  const dualMind = DualMindEngine.getInstance();
  const translator = UniversalTranslationEngine.getInstance();

  // Function to detect language using UniversalTranslationEngine
  const detectLanguage = async (text: string): Promise<string> => {
    try {
      const detected = await translator.detectLanguage(text);
      return detected.code;
    } catch (error) {
      // Fallback detection
      if (/[ëçõ]|përshëndetje|tungjatjeta|mirëdita|faleminderit|tani|mund|duhet|është|janë|çfarë|kur|ku|si/i.test(text)) {
        return 'sq';
      }
      return 'en';
    }
  };

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      if (isDualMindMode && selectedProvider === 'openmind') {
        // Enhanced Albanian language detection
        const detectedLanguage = await detectLanguage(content);
        
        // Use DualMind Engine for ALBI & JONA conversation
        const conversation = await dualMind.generateAnthropicConversation(
          content, 
          detectedLanguage
        );

        // Add ALBI response
        const albiMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: conversation.albiResponse,
          provider: 'openmind',
          timestamp: new Date(),
          isAlbi: true
        };

        // Add JONA response
        const jonaMessage: Message = {
          id: (Date.now() + 2).toString(),
          role: 'assistant',
          content: conversation.jonaResponse,
          provider: 'openmind',
          timestamp: new Date(),
          isJona: true
        };

        // Add synthesis
        const synthesisMessage: Message = {
          id: (Date.now() + 3).toString(),
          role: 'assistant',
          content: conversation.sharedInsight,
          provider: 'openmind',
          timestamp: new Date(),
          isSynthesis: true
        };

        setMessages(prev => [...prev, albiMessage, jonaMessage, synthesisMessage]);
      } else {
        // Standard AI provider response
        const provider = OPENMIND_CONFIG.providers[selectedProvider];
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: `${provider.icon} ${provider.name}: I understand your message "${content}". ${provider.description}. How can I help you further?`,
          provider: selectedProvider,
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, aiMessage]);
      }
    } catch (error) {
      console.error('OpenMind error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '❌ Sorry, there was an error processing your request. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    }

    setIsLoading(false);
  };

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
          🧠 EuroWeb OpenMind Ultra - DualMind AI (ALBI & JONA)
        </h1>
        
        {/* DualMind Mode Toggle */}
        <div style={{
          display: 'flex',
          gap: '15px',
          alignItems: 'center',
          marginBottom: '15px'
        }}>
          <button
            onClick={() => { 
              setIsDualMindMode(prev => !prev);
              console.log('DualMind mode:', !isDualMindMode);
            }}
            style={{
              padding: '8px 16px',
              borderRadius: '20px',
              border: isDualMindMode ? '2px solid #22c55e' : '1px solid #374151',
              background: isDualMindMode ? 'rgba(34, 197, 94, 0.2)' : 'rgba(55, 65, 81, 0.3)',
              color: isDualMindMode ? '#22c55e' : '#cbd5e1',
              fontSize: '14px',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            {isDualMindMode ? '🎭 DualMind Mode Active' : '🤖 Standard Mode'}
          </button>
          {isDualMindMode && (
            <div style={{ fontSize: '12px', color: '#22c55e' }}>
              🔍 M.Albi (Analytical) + 💝 F.Jona (Creative) + 🤝 Synthesis
            </div>
          )}
        </div>
        
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
              onClick={() => { 
                setSelectedProvider(key as AIProvider);
                console.log('Provider changed:', key);
              }}
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
              {(provider as any).icon} {(provider as any).name}
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
              Welcome to OpenMind Ultra - DualMind AI Gateway
            </h3>
            <p>🎭 <strong>DualMind Mode:</strong> Experience conversations with ALBI & JONA dual personalities!</p>
            <div style={{ marginTop: '20px', fontSize: '14px', color: '#94a3b8' }}>
              <div>🔍 <strong>M.Albi:</strong> Analytical, systematic, technical approach</div>
              <div>💝 <strong>F.Jona:</strong> Creative, empathetic, intuitive perspective</div>
              <div>🤝 <strong>Synthesis:</strong> Combined wisdom from both minds</div>
              <div style={{ marginTop: '10px', color: '#22c55e' }}>
                💡 Try saying "Tungjatjeta" for Albanian cultural context!
              </div>
            </div>
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
                : message.isAlbi 
                  ? 'rgba(34, 197, 94, 0.1)' 
                  : message.isJona 
                    ? 'rgba(236, 72, 153, 0.1)' 
                    : message.isSynthesis 
                      ? 'rgba(59, 130, 246, 0.1)' 
                      : 'rgba(55, 65, 81, 0.5)',
              color: message.role === 'user' ? '#1a1d29' : '#f8fafc',
              backdropFilter: 'blur(10px)',
              border: message.isAlbi 
                ? '1px solid #22c55e' 
                : message.isJona 
                  ? '1px solid #ec4899' 
                  : message.isSynthesis 
                    ? '1px solid #3b82f6' 
                    : 'none'
            }}
          >
            <div style={{
              fontSize: '14px',
              fontWeight: 'bold',
              marginBottom: '5px',
              opacity: 0.8
            }}>
              {message.role === 'user' 
                ? 'You' 
                : message.isAlbi 
                  ? '🔍 M.Albi (Analytical)'
                  : message.isJona 
                    ? '💝 F.Jona (Creative)'
                    : message.isSynthesis 
                      ? '🤝 ALBI & JONA Synthesis'
                      : message.provider 
                        ? OPENMIND_CONFIG.providers[message.provider as AIProvider]?.name 
                        : 'AI'}
            </div>
            <div style={{ whiteSpace: 'pre-wrap' }}>{message.content}</div>
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
            onChange={(e) => { 
              setInput(e.target.value);
              console.log('Input changed:', e.target.value);
            }}
            onKeyPress={(e) => e.key === 'Enter' && !isLoading && sendMessage(input)}
            placeholder={isDualMindMode && selectedProvider === 'openmind' 
              ? `Ask ALBI & JONA anything... (Try: "Tungjatjeta" for Albanian)` 
              : `Ask ${OPENMIND_CONFIG.providers[selectedProvider]?.name} anything...`}
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
  );
};

export { OpenMindChat };
// Removed default export: OpenMindChat;



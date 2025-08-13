'use client';

import React, { useState } from 'react';

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  provider?: string
  timestamp: Date
}

type AIProvider = 'openmind' | 'claude' | 'copilot' | 'deepseek' | 'openai' | 'gemini';

const PROVIDERS = {
  openmind: { name: 'OpenMind AI', icon: '🧠', description: 'Advanced neural AI' },
  claude: { name: 'Claude', icon: '🤖', description: 'Anthropic Claude AI' },
  copilot: { name: 'Copilot', icon: '👨‍💻', description: 'GitHub Copilot' },
  deepseek: { name: 'DeepSeek', icon: '🔍', description: 'DeepSeek AI' },
  openai: { name: 'OpenAI', icon: '✨', description: 'OpenAI GPT' },
  gemini: { name: 'Gemini', icon: '💎', description: 'Google Gemini' }
};

export const OpenMindChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [selectedProvider, setSelectedProvider] = useState<AIProvider>('openmind');
  const [isLoading, setIsLoading] = useState(false);

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

    // Simulate AI response
    setTimeout(() => {
      const provider = PROVIDERS[selectedProvider];
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `${provider.icon} ${provider.name}: I understand your message "${content}". ${provider.description}. How can I help you further?`,
        provider: selectedProvider,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      color: '#1e293b',
      fontFamily: 'Inter, sans-serif'
    } as any}>
      {/* Header */}
      <div style={{
        padding: '20px',
        borderBottom: '1px solid #e2e8f0',
        background: '#ffffff',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
      } as any}>
        <h1 style={{
          fontSize: '24px',
          fontWeight: 700,
          background: 'linear-gradient(45deg, #3b82f6, #6366f1, #8b5cf6)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '10px'
        } as any}>
          🧠 EuroWeb OpenMind AI
        </h1>
        
        {/* Provider Selector */}
        <div style={{
          display: 'flex',
          gap: '10px',
          flexWrap: 'wrap',
          marginTop: '15px'
        } as any}>
          {Object.entries(PROVIDERS).map(([key, provider]) => (
            <button
              key={key}
              onClick={() => setSelectedProvider(key as AIProvider)}
              style={{
                padding: '8px 16px',
                borderRadius: '20px',
                border: selectedProvider === key ? '2px solid #3b82f6' : '1px solid #e2e8f0',
                background: selectedProvider === key ? 'rgba(59, 130, 246, 0.1)' : 'rgba(248, 250, 252, 0.8)',
                color: selectedProvider === key ? '#3b82f6' : '#64748b',
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              } as any}
            >
              {provider.icon} {provider.name}
            </button>
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
      } as any}>
        {messages.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '40px',
            color: '#6b7280'
          } as any}>
            <h3 style={{ fontSize: '18px', marginBottom: '10px' } as any}>
              Welcome to OpenMind AI Gateway
            </h3>
            <p>Choose an AI provider and start chatting with multiple AI models!</p>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            style={{
              alignSelf: message.role === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '80%',
              padding: '15px',
              borderRadius: '15px',
              background: message.role === 'user' 
                ? 'linear-gradient(45deg, #3b82f6, #6366f1)'
                : 'rgba(248, 250, 252, 0.9)',
              color: message.role === 'user' ? '#ffffff' : '#1e293b',
              border: message.role === 'user' ? 'none' : '1px solid #e2e8f0',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
            } as any}
          >
            <div style={{
              fontSize: '14px',
              fontWeight: 'bold',
              marginBottom: '5px',
              opacity: 0.8
            } as any}>
              {message.role === 'user' ? 'You' : message.provider ? PROVIDERS[message.provider as AIProvider]?.name : 'AI'}
            </div>
            <div>{message.content}</div>
            <div style={{
              fontSize: '12px',
              opacity: 0.6,
              marginTop: '5px'
            } as any}>
              {message.timestamp.toLocaleTimeString()}
            </div>
          </div>
        ))}

        {isLoading && (
          <div
            style={{
              alignSelf: 'flex-start',
              padding: '15px',
              borderRadius: '15px',
              background: 'rgba(248, 250, 252, 0.9)',
              color: '#64748b',
              border: '1px solid #e2e8f0'
            } as any}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            } as any}>
              <div style={{
                width: '20px',
                height: '20px',
                border: '2px solid #d4af37',
                borderTop: '2px solid transparent',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              } as any} />
              {PROVIDERS[selectedProvider].name} is thinking...
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div style={{
        padding: '20px',
        borderTop: '1px solid #e2e8f0',
        background: '#ffffff',
        boxShadow: '0 -2px 8px rgba(0, 0, 0, 0.05)'
      } as any}>
        <div style={{
          display: 'flex',
          gap: '10px',
          alignItems: 'center'
        } as any}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !isLoading && sendMessage(input)}
            placeholder={`Ask ${PROVIDERS[selectedProvider].name} anything...`}
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
            } as any}
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={isLoading || !input.trim()}
            style={{
              padding: '12px 24px',
              borderRadius: '12px',
              border: 'none',
              background: input.trim() && !isLoading 
                ? 'linear-gradient(45deg, #3b82f6, #6366f1)' 
                : 'rgba(156, 163, 175, 0.5)',
              color: '#ffffff',
              fontSize: '16px',
              fontWeight: 600,
              cursor: input.trim() && !isLoading ? 'pointer' : 'not-allowed',
              transition: 'all 0.3s ease'
            } as any}
          >
            Send
          </button>
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

// Default export
export default OpenMindChat;


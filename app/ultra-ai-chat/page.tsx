/**
 * Ultra AI Chat Page - World Champion AI Interface
 * The Most Advanced AI Chat System on Earth
 * 
 * @author Ledjan Ahmati (100% Creator & Owner)
 * @version 8.0.0-ULTRA-CHAMPION
 * @contact dealsjona@gmail.com
 */

'use client'

import dynamic from 'next/dynamic'

// Dynamic import for optimal performance
const UltraAIChat = dynamic(
  () => import('../../components/UltraAIChat'),
  { 
    ssr: false,
    loading: () => (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0F0F23 0%, #1a1a2e 25%, #16213e 50%, #0f3460 75%, #533483 100%)',
        color: 'white',
        flexDirection: 'column',
        gap: '30px'
      }}>
        <div style={{
          fontSize: '80px',
          animation: 'pulse 2s infinite',
          background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 50%, #3B82F6 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          🧠
        </div>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ 
            fontSize: '36px', 
            marginBottom: '15px',
            background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 50%, #3B82F6 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            🚀 Ultra AI Chat Loading...
          </h1>
          <p style={{ 
            fontSize: '18px', 
            color: 'rgba(255,255,255,0.8)',
            margin: 0
          }}>
            Initializing World Champion AI Systems...
          </p>
          <div style={{
            marginTop: '30px',
            display: 'flex',
            gap: '15px',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            {['🧠 OpenMind AI', '🤖 Claude', '👨‍💻 Copilot', '🔍 DeepSeek', '✨ OpenAI', '💎 Gemini'].map((ai, index) => (
              <div
                key={ai}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  padding: '8px 15px',
                  borderRadius: '20px',
                  fontSize: '14px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  animationDelay: `${index * 0.2}s`,
                  animation: 'fadeIn 0.5s ease forwards'
                }}
              >
                {ai}
              </div>
            ))}
          </div>
        </div>
        <style dangerouslySetInnerHTML={{
          __html: `
            @keyframes pulse {
              0%, 100% { transform: scale(1); opacity: 1; }
              50% { transform: scale(1.1); opacity: 0.8; }
            }
            @keyframes fadeIn {
              from { opacity: 0; transform: translateY(20px); }
              to { opacity: 1; transform: translateY(0); }
            }
          `
        }} />
      </div>
    )
  }
)

export default function UltraAIChatPage() {
  return <UltraAIChat />
}

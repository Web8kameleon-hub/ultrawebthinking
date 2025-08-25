/**
 * OpenMind AI Chat Page - FUNKSIONAL
 * Chat i Thjeshtë por i Fuqishëm
 * 
 * @author Ledjan Ahmati (100% Creator & Owner)
 * @version 8.0.0-WORKING
 * @contact dealsjona@gmail.com
 */

'use client'

import dynamic from 'next/dynamic'

// Import i thjeshtë që punon
const WorkingAIChat = dynamic(
  () => import('../../components/WorkingAIChat'),
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
        gap: '20px'
      }}>
        <div style={{ fontSize: '60px' }}>🧠</div>
        <h1 style={{ 
          fontSize: '24px',
          background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 50%, #3B82F6 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Duke ngarkuar OpenMind AI...
        </h1>
        <p style={{ opacity: 0.8 }}>Gati për bisedë! 🚀</p>
      </div>
    )
  }
)

export default function OpenMindAIChatPage() {
  return <WorkingAIChat />
}

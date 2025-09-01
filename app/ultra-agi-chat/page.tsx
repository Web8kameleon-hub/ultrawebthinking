/**
 * Ultra AGI Chat Page - World Champion AI
 * Most advanced chat system that evolves every second
 * 
 * @author Ledjan Ahmati
 * @version 8.0.0-WEB8
 */

'use client'

import dynamic from 'next/dynamic'

// Dynamic import për performance
const UltraAGIChat = dynamic(() => import('../../components/UltraAGIChat/UltraAGIChat'), {
  loading: () => (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      <div className="text-center">
        <div className="animate-spin w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Loading Ultra AGI Ω
        </h2>
        <p className="text-gray-600 mt-2">World Champion AI • Evolving Every Second</p>
      </div>
    </div>
  )
})

export default function UltraAGIChatPage() {
  return (
    <div className="h-screen overflow-hidden">
      <UltraAGIChat />
    </div>
  )
}

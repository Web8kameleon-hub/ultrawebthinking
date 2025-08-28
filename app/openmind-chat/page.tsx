'use client'

import { OpenMindChatLazy } from '@/frontend/src/components/LazyLoader'

/**
 * @author Ledjan Ahmati
 * @version 8.0.0-WEB8
 * Enhanced OpenMind Chat with Albanian Language Support
 */
export default function OpenMindChatPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-purple-900 dark:to-black">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
              🧠 EuroWeb OpenMind AI
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Chat inteligjent me mbështetje shqipe dhe anglisht / Intelligent chat with Albanian and English support
            </p>
          </div>
          
          <OpenMindChatLazy />
        </div>
      </div>
    </div>
  )
}

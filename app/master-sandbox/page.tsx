/**
 * Master Sandbox Page - Creator's Complete Vision
 * @author Ledjan Ahmati
 * @version 8.0.0-WEB8-MASTER
 */

import dynamic from 'next/dynamic'

// Lazy load the heavy interface
const MasterSandboxInterface = dynamic(() => import('@/components/MasterSandboxInterface'), {
  loading: () => (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="text-4xl">🧠</div>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Loading Master Sandbox...
        </h1>
        <p className="text-gray-600">Initializing Creator's Intelligence</p>
      </div>
    </div>
  )
})

export default function MasterSandboxPage() {
  return <MasterSandboxInterface />
}

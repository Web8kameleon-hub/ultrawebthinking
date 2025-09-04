/**
 * AGI Demo Page - New Architecture Showcase
 * Vanilla + Motion + CVA + Panda Tokens
 * © Web8 UltraThinking – Ledjan Ahmati
 */

import AGIStatusMonitor from '@/components/AGIStatusMonitor'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Royal Secure AI Laboratory - Demo',
  description: 'Advanced AGI System Monitoring with modern web technologies'
}

export default function AGIDemoPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <AGIStatusMonitor />
    </main>
  )
}





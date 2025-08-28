/**
 * Real Sensors Page - Test Real Browser Data
 * React 19.1.1 with Next.js 15.5.2
 * 
 * @author Ledjan Ahmati
 * @version 8.0.0-WEB8-REAL
 */

'use client'

import dynamic from 'next/dynamic'

const RealSensorDashboard = dynamic(
  () => import('../../components/RealSensorDashboard'),
  { 
    ssr: false,
    loading: () => (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin w-8 h-8 border-2 border-white border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading REAL Browser Sensors...</p>
        </div>
      </div>
    )
  }
)

export default function RealSensorsPage() {
  return <RealSensorDashboard />
}

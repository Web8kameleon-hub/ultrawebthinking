/**
 * Web8 Attack Simulation Route
 * Faqe për simulimin dhe testimin e sulmeve kibernetike
 * 
 * @author Ledjan Ahmati
 * @version 8.2.0-ATTACK-SIM
 * @contact dealsjona@gmail.com
 */

'use client'

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Lazy load the attack simulation dashboard
const AttackSimulationDashboard = dynamic(
  () => import('../../components/AttackSimulationDashboard'),
  {
    loading: () => (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-red-500 border-t-transparent mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700">Loading Attack Simulator...</h2>
          <p className="text-gray-500 mt-2">🚨 Initializing security testing framework...</p>
        </div>
      </div>
    ),
    ssr: false
  }
);

export default function AttackSimulationPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-purple-50">
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-red-500 border-t-transparent mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-700">Preparing Attack Simulation...</h2>
            <p className="text-gray-500 mt-2">🛡️ Setting up security testing environment...</p>
          </div>
        </div>
      }>
        <AttackSimulationDashboard />
      </Suspense>
    </div>
  );
}

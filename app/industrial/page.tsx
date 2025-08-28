'use client';

import { Suspense, useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamic imports for both systems
const IndustrialWorkingSystem = dynamic(
  () => import('@/components/IndustrialWorkingSystem'),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-bold text-gray-800">Loading Industrial Engineering Platform...</h2>
          <p className="text-gray-600 mt-2">Initializing real calculation engines and formulas</p>
        </div>
      </div>
    )
  }
);

const ProfessionalToolsSuite = dynamic(
  () => import('@/components/ProfessionalToolsSuite'),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-bold text-gray-800">Loading Professional Tools Suite...</h2>
          <p className="text-gray-600 mt-2">Preparing Excel, Word, PowerPoint and more...</p>
        </div>
      </div>
    )
  }
);

/**
 * Industrial Engineering Platform - Real Working Tools
 * @author Ledjan Ahmati
 * @version 8.0.0-WEB8
 * @contact dealsjona@gmail.com
 */
export default function IndustrialPage() {
  const [activeSystem, setActiveSystem] = useState('professional')

  return (
    <main className="min-h-screen">
      {/* Navigation Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                🏭 Industrial & Professional Platform
              </h1>
              <p className="text-gray-600 text-sm">Real working tools for all professionals</p>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => setActiveSystem('professional')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeSystem === 'professional'
                    ? 'bg-purple-100 text-purple-700 border border-purple-200'
                    : 'text-gray-600 hover:text-purple-600 hover:bg-gray-50'
                }`}
              >
                🛠️ Professional Tools (Excel, Word, PowerPoint)
              </button>
              <button
                onClick={() => setActiveSystem('engineering')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeSystem === 'engineering'
                    ? 'bg-blue-100 text-blue-700 border border-blue-200'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                }`}
              >
                ⚙️ Engineering Calculations
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <Suspense fallback={
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h2 className="text-xl font-bold text-gray-800">Loading Platform...</h2>
          </div>
        </div>
      }>
        {activeSystem === 'professional' ? (
          <ProfessionalToolsSuite />
        ) : (
          <IndustrialWorkingSystem />
        )}
      </Suspense>
    </main>
  );
}

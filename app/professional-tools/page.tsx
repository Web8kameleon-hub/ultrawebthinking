'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';

const ProfessionalToolsSuite = dynamic(
  () => import('@/components/ProfessionalToolsSuite'),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-bold text-gray-800">Loading Professional Tools Suite...</h2>
          <p className="text-gray-600 mt-2">Preparing Excel, Word, PowerPoint and specialized tools...</p>
        </div>
      </div>
    )
  }
);

/**
 * Professional Tools Page - Complete Office & Technical Tools
 * @author Ledjan Ahmati
 * @version 8.0.0-WEB8-PROFESSIONAL
 * @contact dealsjona@gmail.com
 */
export default function ProfessionalToolsPage() {
  return (
    <main className="min-h-screen">
      <Suspense fallback={
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <h2 className="text-xl font-bold text-gray-800">Loading Professional Tools...</h2>
          </div>
        </div>
      }>
        <ProfessionalToolsSuite />
      </Suspense>
    </main>
  );
}

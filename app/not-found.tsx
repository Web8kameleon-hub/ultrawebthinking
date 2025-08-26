// app/not-found.tsx
'use client';

import { ArrowLeft, Home } from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-md w-full mx-auto text-center p-8">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
          {/* Error Code */}
          <div className="mb-6">
            <h1 className="text-8xl font-bold text-red-500 mb-2">404</h1>
            <div className="w-16 h-1 bg-red-500 mx-auto rounded-full"></div>
          </div>

          {/* Error Message */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-3">
              Faqja nuk u gjet
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Faqja që kërkoni nuk ekziston ose është zhvendosur.
              Ju lutemi kontrolloni URL-në ose kthehuni në faqen kryesore.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              <Home className="w-4 h-4 mr-2" />
              Faqja Kryesore
            </Link>

            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center justify-center px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kthehu Prapa
            </button>
          </div>

          {/* Additional Help */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Nëse problemi vazhdon, kontaktoni administratorin.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

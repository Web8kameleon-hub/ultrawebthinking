/**
 * API Test Dashboard
 * EuroWeb Platform - Test all APIs in one place
 * 
 * @author Ledjan Ahmati (100% Owner)
 * @contact dealsjona@gmail.com
 * @version 8.1.0 Ultra
 * @license MIT
 */

'use client'

import React, { useState } from 'react'

export default function TestAPIPage() {
  const [results, setResults] = useState<Record<string, any>>({})
  const [loading, setLoading] = useState<Record<string, boolean>>({})

  const testAPI = async (endpoint: string, name: string) => {
    setLoading(prev => ({ ...prev, [name]: true }))
    try {
      const response = await fetch(`/api/${endpoint}`)
      const data = await response.json()
      setResults(prev => ({ ...prev, [name]: { success: true, data, status: response.status } }))
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      setResults(prev => ({ ...prev, [name]: { success: false, error: errorMessage } }))
    } finally {
      setLoading(prev => ({ ...prev, [name]: false }))
    }
  }

  const apis = [
    { endpoint: 'utt/info', name: 'UTT Info' },
    { endpoint: 'lora/status', name: 'LoRa Status' },
    { endpoint: 'agi/status', name: 'AGI Status' },
    { endpoint: 'health', name: 'Health Check' }
  ]

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          🧪 API Test Dashboard
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {apis.map(({ endpoint, name }) => (
            <div key={name} className="bg-white p-6 rounded-lg shadow">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">{name}</h3>
                <button
                  onClick={() => testAPI(endpoint, name)}
                  disabled={loading[name]}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading[name] ? '⏳' : '🧪'} Test
                </button>
              </div>
              
              <p className="text-sm text-gray-600 mb-4">
                <code>/api/{endpoint}</code>
              </p>
              
              {results[name] && (
                <div className={`p-4 rounded ${results[name].success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                  <div className="flex items-center mb-2">
                    <span className={`text-sm font-semibold ${results[name].success ? 'text-green-700' : 'text-red-700'}`}>
                      {results[name].success ? '✅ Success' : '❌ Error'}
                    </span>
                    {results[name].status && (
                      <span className="ml-2 text-xs bg-gray-200 px-2 py-1 rounded">
                        {results[name].status}
                      </span>
                    )}
                  </div>
                  <pre className="text-xs overflow-auto">
                    {JSON.stringify(results[name].data || results[name].error, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="mt-8 bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">🚀 Test All APIs</h3>
          <button
            onClick={() => apis.forEach(({ endpoint, name }) => testAPI(endpoint, name))}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold"
          >
            🧪 Run All Tests
          </button>
        </div>
      </div>
    </div>
  )
}


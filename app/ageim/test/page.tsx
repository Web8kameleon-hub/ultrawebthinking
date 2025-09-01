/**
 * AGEIM TEST CLIENT - ZERO-FAKE TESTING
 * @author Ledjan Ahmati
 * @version 8.0.0-WEB8-AGEIM
 * PURPOSE: Test AGEIM endpoints with real operations
 */

'use client'
import React, { useState } from 'react'

type AgeimResult = {
  ok: boolean
  [key: string]: any
}

export default function AgeimTestClient() {
  const [results, setResults] = useState<Record<string, AgeimResult>>({})
  const [loading, setLoading] = useState<Record<string, boolean>>({})

  const testAgeimEndpoint = async (
    endpoint: string, 
    method: 'GET' | 'POST', 
    body?: any,
    headers?: Record<string, string>
  ) => {
    const key = `${method} ${endpoint}`
    
    try {
      setLoading(prev => ({ ...prev, [key]: true }))
      
      const fetchOptions: RequestInit = {
        method,
        headers: {
          'Content-Type': 'application/json',
          'X-AGEIM-Mode': 'enabled',
          'X-Scan-Type': 'full',
          'X-AGEIM-Control': 'enabled',
          ...headers
        }
      }
      
      if (body) {
        fetchOptions.body = JSON.stringify(body)
      }
      
      const response = await fetch(`/api/ageim${endpoint}`, fetchOptions)
      
      const result = await response.json()
      
      setResults(prev => ({
        ...prev,
        [key]: {
          status: response.status,
          ok: response.ok,
          ...result
        }
      }))
      
      console.log(`🤖 AGEIM Test ${key}:`, result)
      
    } catch (error) {
      setResults(prev => ({
        ...prev,
        [key]: {
          ok: false,
          error: String(error)
        }
      }))
      console.error(`🤖 AGEIM Test ${key} Error:`, error)
    } finally {
      setLoading(prev => ({ ...prev, [key]: false }))
    }
  }

  return (
    <div className="p-10 min-h-screen bg-gradient-to-br from-slate-800 to-slate-900 text-slate-50 font-mono">
      <div className="bg-indigo-500/20 border-2 border-indigo-500 rounded-xl p-5 mb-8 text-center">
        <h1 className="text-3xl font-bold">🤖 AGEIM TEST CLIENT</h1>
        <p>Zero-fake testing of AGEIM endpoints</p>
      </div>

      <div className="bg-slate-800/80 border border-slate-500/30 rounded-2xl p-5 mb-5">
        <h2 className="text-2xl font-semibold mb-4">📊 AGEIM Status</h2>
        <button 
          className="bg-indigo-500 text-white border-none py-2.5 px-5 rounded-lg cursor-pointer m-1.5 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => testAgeimEndpoint('/status', 'GET')}
          disabled={loading['GET /status']}
        >
          {loading['GET /status'] ? 'Checking...' : 'Get Status'}
        </button>
        
        {results['GET /status'] && (
          <pre className="bg-black/30 p-4 rounded-lg mt-2.5 overflow-auto text-xs">
            {JSON.stringify(results['GET /status'], null, 2)}
          </pre>
        )}
      </div>

      <div className="bg-slate-800/80 border border-slate-500/30 rounded-2xl p-5 mb-5">
        <h2 className="text-2xl font-semibold mb-4">🔍 AGEIM Scan</h2>
        <button 
          className="bg-indigo-500 text-white border-none py-2.5 px-5 rounded-lg cursor-pointer m-1.5 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => testAgeimEndpoint('/scan', 'POST', {
            targets: ['src/', 'components/', 'app/'],
            depth: 'full'
          })}
          disabled={loading['POST /scan']}
        >
          {loading['POST /scan'] ? 'Scanning...' : 'Run Scan'}
        </button>
        
        {results['POST /scan'] && (
          <pre className="bg-black/30 p-4 rounded-lg mt-2.5 overflow-auto text-xs">
            {JSON.stringify(results['POST /scan'], null, 2)}
          </pre>
        )}
      </div>

      <div className="bg-slate-800/80 border border-slate-500/30 rounded-2xl p-5 mb-5">
        <h2 className="text-2xl font-semibold mb-4">🔧 AGEIM Patch</h2>
        <div>
          <button 
            className="bg-indigo-500 text-white border-none py-2.5 px-5 rounded-lg cursor-pointer m-1.5 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => testAgeimEndpoint('/patch', 'POST', {
              action: 'plan'
            })}
            disabled={loading['POST /patch plan']}
          >
            {loading['POST /patch plan'] ? 'Planning...' : 'Generate Plan'}
          </button>
          
          <button 
            className="bg-indigo-500 text-white border-none py-2.5 px-5 rounded-lg cursor-pointer m-1.5 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => testAgeimEndpoint('/patch', 'POST', {
              action: 'apply',
              patches: [
                {
                  path: 'test-patch.txt',
                  content: '// AGEIM test patch\nconsole.log("AGEIM patch applied");',
                  reason: 'Test patch for AGEIM validation',
                  riskLevel: 'LOW'
                }
              ]
            })}
            disabled={loading['POST /patch apply']}
          >
            {loading['POST /patch apply'] ? 'Applying...' : 'Apply Test Patch'}
          </button>
        </div>
        
        {results['POST /patch plan'] && (
          <div>
            <h4 className="font-bold mt-4">Plan Result:</h4>
            <pre className="bg-black/30 p-4 rounded-lg mt-2.5 overflow-auto text-xs">
              {JSON.stringify(results['POST /patch plan'], null, 2)}
            </pre>
          </div>
        )}
        
        {results['POST /patch apply'] && (
          <div>
            <h4 className="font-bold mt-4">Apply Result:</h4>
            <pre className="bg-black/30 p-4 rounded-lg mt-2.5 overflow-auto text-xs">
              {JSON.stringify(results['POST /patch apply'], null, 2)}
            </pre>
          </div>
        )}
      </div>

      <div className="bg-slate-800/80 border border-slate-500/30 rounded-2xl p-5 mb-5">
        <h2 className="text-2xl font-semibold mb-4">🎛️ AGEIM Control</h2>
        <div>
          <button 
            className="bg-indigo-500 text-white border-none py-2.5 px-5 rounded-lg cursor-pointer m-1.5 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => testAgeimEndpoint('/status', 'POST', {
              action: 'get_approvals'
            })}
            disabled={loading['POST /status approvals']}
          >
            {loading['POST /status approvals'] ? 'Loading...' : 'Get Approvals'}
          </button>
          
          <button 
            className="bg-indigo-500 text-white border-none py-2.5 px-5 rounded-lg cursor-pointer m-1.5 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => testAgeimEndpoint('/status', 'POST', {
              action: 'verify_audit'
            })}
            disabled={loading['POST /status audit']}
          >
            {loading['POST /status audit'] ? 'Verifying...' : 'Verify Audit'}
          </button>
          
          <button 
            className="bg-red-500 text-white border-none py-2.5 px-5 rounded-lg cursor-pointer m-1.5 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => testAgeimEndpoint('/status', 'POST', {
              action: 'emergency_stop'
            })}
            disabled={loading['POST /status emergency']}
          >
            {loading['POST /status emergency'] ? 'Stopping...' : 'Emergency Stop'}
          </button>
        </div>
        
        {results['POST /status approvals'] && (
          <div>
            <h4 className="font-bold mt-4">Approvals:</h4>
            <pre className="bg-black/30 p-4 rounded-lg mt-2.5 overflow-auto text-xs">
              {JSON.stringify(results['POST /status approvals'], null, 2)}
            </pre>
          </div>
        )}
        
        {results['POST /status audit'] && (
          <div>
            <h4 className="font-bold mt-4">Audit Verification:</h4>
            <pre className="bg-black/30 p-4 rounded-lg mt-2.5 overflow-auto text-xs">
              {JSON.stringify(results['POST /status audit'], null, 2)}
            </pre>
          </div>
        )}
        
        {results['POST /status emergency'] && (
          <div>
            <h4 className="font-bold mt-4">Emergency Stop:</h4>
            <pre className="bg-red-500/20 p-4 rounded-lg mt-2.5 overflow-auto text-xs">
              {JSON.stringify(results['POST /status emergency'], null, 2)}
            </pre>
          </div>
        )}
      </div>

      <div className="bg-slate-800/80 border border-slate-500/30 rounded-2xl p-5 mb-5">
        <h2 className="text-2xl font-semibold mb-4">🛡️ Test Summary</h2>
        <div className="text-sm leading-relaxed">
          <p><strong>Total Tests:</strong> {Object.keys(results).length}</p>
          <p><strong>Successful:</strong> {Object.values(results).filter(r => r.ok).length}</p>
          <p><strong>Failed:</strong> {Object.values(results).filter(r => !r.ok).length}</p>
          <p><strong>Zero-Fake Guarantee:</strong> ✅ All responses are real</p>
        </div>
      </div>
    </div>
  )
}

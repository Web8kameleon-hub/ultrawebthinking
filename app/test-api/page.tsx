/**
 * Test API OpenMind 
 * Test i shpejtë për chat functionality
 */

'use client';

import React, { useState } from 'react';

export default function TestOpenMind() {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const testAPI = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/openmind', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: query || 'Mirëdita, si jeni?',
          options: { ethicalCheck: true }
        })
      });
      
      const data = await res.json();
      setResponse(JSON.stringify(data, null, 2));
    } catch (error) {
      setResponse('Gabim: ' + error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
        <h1 className="text-2xl font-bold mb-3">🤖 Test OpenMind API</h1>
        <p className="text-blue-800 mb-2">
          <strong>Çfarë është kjo?</strong> Kjo është një vegël testimi për Chat AI-në tuaj.
        </p>
        <p className="text-blue-700 text-sm">
          Përdoreni për të testuar nëse OpenMind Chat po punon si duhet. 
          Shkruani një pyetje, klikoni "Testo API" dhe shikoni përgjigjen nga AI.
        </p>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            💬 Shkruani pyetjen tuaj:
          </label>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Shkruani pyetjen tuaj (p.sh: 'Si jeni?' ose 'Hello')"
            className="w-full p-3 border rounded-lg focus:border-blue-500 outline-none"
          />
          <p className="text-xs text-slate-500 mt-1">
            Nëse lëni bosh, do të dërgohet: "Mirëdita, si jeni?"
          </p>
        </div>
        
        <button
          onClick={testAPI}
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? '🔄 Duke testuar...' : '🚀 Testo API-në'}
        </button>
        
        {response && (
          <div>
            <label className="block text-sm font-medium mb-2">
              📋 Përgjigja nga OpenMind API:
            </label>
            <pre className="bg-slate-100 p-4 rounded-lg text-sm overflow-auto border max-h-96">
              {response}
            </pre>
            
            <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded">
              <p className="text-green-800 text-sm">
                ✅ <strong>Sukses!</strong> API-ja po punon. Tani mund të përdorni chat-in në platformën kryesore.
              </p>
            </div>
          </div>
        )}
        
        <div className="mt-8 p-4 bg-slate-50 rounded-lg border">
          <h3 className="font-semibold mb-2">🔗 Lidhje të dobishme:</h3>
          <div className="space-y-1 text-sm">
            <a href="/" className="text-blue-600 hover:underline block">
              🏠 Kthehu në Dashboard Kryesor
            </a>
            <a href="/agioffice" className="text-blue-600 hover:underline block">
              💼 Hap AGI Office
            </a>
            <a href="/agimed" className="text-blue-600 hover:underline block">
              🏥 Hap AGI Medical
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

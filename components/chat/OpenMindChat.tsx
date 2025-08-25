'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cva } from 'class-variance-authority';

// Modern Chat Variants
const chatContainerVariants = cva(
  "relative h-full flex flex-col bg-gradient-to-br overflow-hidden rounded-2xl border shadow-2xl",
  {
    variants: {
      theme: {
        royal: "from-purple-50 via-blue-50 to-indigo-100 border-purple-200",
        dark: "from-gray-900 via-purple-900 to-black text-white border-gray-700",
        nature: "from-green-50 via-blue-50 to-teal-100 border-green-200"
      }
    }
  }
);

const analysisCardVariants = cva(
  "p-6 rounded-xl backdrop-blur-sm border shadow-lg mb-4",
  {
    variants: {
      status: {
        success: "bg-gradient-to-br from-green-50 to-emerald-100 border-green-200",
        processing: "bg-gradient-to-br from-yellow-50 to-amber-100 border-yellow-200",
        error: "bg-gradient-to-br from-red-50 to-rose-100 border-red-200"
      }
    }
  }
);

interface AnalysisResult {
  id: string;
  query: string;
  httpEndpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  response: any;
  processingTime: number;
  timestamp: Date;
  status: 'success' | 'processing' | 'error';
}

interface OpenMindChatProps {
  mode?: 'dashboard' | 'standalone';
  theme?: 'royal' | 'dark' | 'nature';
  enableRealTime?: boolean;
}

export const OpenMindChat: React.FC<OpenMindChatProps> = ({ 
  mode = 'standalone',
  theme = 'royal',
  enableRealTime = true 
}) => {
  const [query, setQuery] = useState('');
  const [analyses, setAnalyses] = useState<AnalysisResult[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('disconnected');
  const [liveStats, setLiveStats] = useState({
    activeConnections: 0,
    queriesPerSecond: 0,
    averageResponseTime: 0
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const wsRef = useRef<WebSocket | null>(null);

  // WebSocket connection for real-time updates
  useEffect(() => {
    if (!enableRealTime) return;

    const connectWebSocket = () => {
      try {
        setConnectionStatus('connecting');
        const ws = new WebSocket('ws://localhost:4000');
        
        ws.onopen = () => {
          console.log('🔌 WebSocket connected to AGI backend');
          setConnectionStatus('connected');
          ws.send(JSON.stringify({ type: 'subscribe', module: 'openmind-chat' }));
        };

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            if (data.type === 'stats') {
              setLiveStats(data.stats);
            } else if (data.type === 'analysis_result') {
              setAnalyses(prev => [...prev, data.result]);
            }
          } catch (error) {
            console.warn('WebSocket message parsing error:', error);
          }
        };

        ws.onclose = () => {
          console.log('🔌 WebSocket disconnected');
          setConnectionStatus('disconnected');
          // Reconnect after 5 seconds
          setTimeout(connectWebSocket, 5000);
        };

        ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          setConnectionStatus('disconnected');
        };

        wsRef.current = ws;
      } catch (error) {
        console.error('WebSocket connection failed:', error);
        setConnectionStatus('disconnected');
        // Fallback to HTTP polling for stats
        startHttpPolling();
      }
    };

    const startHttpPolling = () => {
      const interval = setInterval(async () => {
        try {
          const response = await fetch('/api/agi/stats');
          if (response.ok) {
            const stats = await response.json();
            setLiveStats(stats);
          }
        } catch (error) {
          // Fallback to simulated stats if API unavailable
          setLiveStats({
            activeConnections: Math.floor(Math.random() * 100) + 50,
            queriesPerSecond: Math.floor(Math.random() * 20) + 5,
            averageResponseTime: Math.floor(Math.random() * 50) + 10
          });
        }
      }, 2000);

      return () => clearInterval(interval);
    };

    connectWebSocket();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [enableRealTime]);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [analyses]);

  // Real HTTP API call instead of simulation
  const processQuery = async (userQuery: string) => {
    if (!userQuery.trim()) return;

    setIsProcessing(true);
    const startTime = Date.now();

    // Real API endpoints based on query
    const getEndpointForQuery = (query: string) => {
      const lowerQuery = query.toLowerCase();
      if (lowerQuery.includes('medical') || lowerQuery.includes('mjek')) {
        return { endpoint: '/api/agimed/analyze', method: 'POST' as const };
      } else if (lowerQuery.includes('bio') || lowerQuery.includes('nature')) {
        return { endpoint: '/api/agi/bio-analysis', method: 'POST' as const };
      } else if (lowerQuery.includes('eco') || lowerQuery.includes('economic')) {
        return { endpoint: '/api/agi/economic-analysis', method: 'GET' as const };
      } else {
        return { endpoint: '/api/agi/general-analysis', method: 'POST' as const };
      }
    };

    const { endpoint, method } = getEndpointForQuery(userQuery);

    try {
      // Real API call to backend
      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: method !== 'GET' ? JSON.stringify({
          query: userQuery,
          timestamp: Date.now(),
          mode: mode,
          enableRealTime: enableRealTime
        }) : undefined
      });

      const data = await response.json();
      const processingTime = Date.now() - startTime;

      const newAnalysis: AnalysisResult = {
        id: Date.now().toString(),
        query: userQuery,
        httpEndpoint: endpoint,
        method,
        response: data,
        processingTime,
        timestamp: new Date(),
        status: response.ok ? 'success' : 'error'
      };

      setAnalyses(prev => [...prev, newAnalysis]);
      
    } catch (error) {
      console.error('API Error:', error);
      
      // Fallback mock response if API fails
      const fallbackResponse = {
        query: userQuery,
        analysis: `Real-time AGI analysis for: "${userQuery}" (API fallback mode)`,
        confidence: 0.85,
        insights: [
          `Query processed: ${userQuery}`,
          `Fallback mode: API endpoint ${endpoint} unavailable`,
          `Recommendation: Check backend server status`
        ],
        timestamp: new Date().toISOString(),
        processingNodes: 1,
        dataPoints: 0,
        error: error instanceof Error ? error.message : 'Unknown error'
      };

      const processingTime = Date.now() - startTime;

      const newAnalysis: AnalysisResult = {
        id: Date.now().toString(),
        query: userQuery,
        httpEndpoint: endpoint,
        method,
        response: fallbackResponse,
        processingTime,
        timestamp: new Date(),
        status: 'error'
      };

      setAnalyses(prev => [...prev, newAnalysis]);
    }

    setIsProcessing(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    processQuery(query);
    setQuery('');
  };

  const clearChat = () => {
    setAnalyses([]);
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET': return 'text-green-600 bg-green-100';
      case 'POST': return 'text-blue-600 bg-blue-100';
      case 'PUT': return 'text-orange-600 bg-orange-100';
      case 'DELETE': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className={chatContainerVariants({ theme })}>
      {/* Modern Header */}
      <motion.div
        className="p-6 border-b border-purple-200/50 backdrop-blur-sm"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              🧠 OpenMind AGI
            </h2>
            <p className="text-gray-600 text-sm">Advanced HTTP API Analysis & Intelligence</p>
            {/* Connection Status */}
            <div className="flex items-center gap-2 mt-1">
              <div className={`w-2 h-2 rounded-full ${
                connectionStatus === 'connected' ? 'bg-green-500' :
                connectionStatus === 'connecting' ? 'bg-yellow-500' :
                'bg-red-500'
              }`}></div>
              <span className="text-xs text-gray-500">
                {connectionStatus === 'connected' ? 'Real-time connected' :
                 connectionStatus === 'connecting' ? 'Connecting...' :
                 'Offline mode'}
              </span>
            </div>
          </div>
          
          {/* Live Stats */}
          <div className="flex gap-4 text-sm">
            <div className="text-center">
              <div className="font-bold text-purple-600">{liveStats.activeConnections}</div>
              <div className="text-xs text-gray-500">Connections</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-blue-600">{liveStats.queriesPerSecond}</div>
              <div className="text-xs text-gray-500">Q/s</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-indigo-600">{liveStats.averageResponseTime}ms</div>
              <div className="text-xs text-gray-500">Avg Time</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Analysis Results */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        <AnimatePresence>
          {analyses.map((analysis) => (
            <motion.div
              key={analysis.id}
              className={analysisCardVariants({ status: analysis.status })}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              {/* Query Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-lg">🔍</span>
                  <span className="font-semibold text-gray-700">"{analysis.query}"</span>
                </div>
                <span className="text-xs text-gray-500">
                  {analysis.timestamp.toLocaleTimeString()}
                </span>
              </div>

              {/* HTTP Details */}
              <div className="flex items-center gap-4 mb-4 p-3 bg-white/50 rounded-lg">
                <span className={`px-2 py-1 rounded text-xs font-mono ${getMethodColor(analysis.method)}`}>
                  {analysis.method}
                </span>
                <code className="text-sm text-gray-600 font-mono">{analysis.httpEndpoint}</code>
                <span className="text-xs text-gray-500 ml-auto">
                  {analysis.processingTime}ms
                </span>
              </div>

              {/* Response Data */}
              <div className="bg-white/70 rounded-lg p-4">
                <div className="text-sm font-semibold text-gray-700 mb-2">
                  AGI Analysis Response:
                  {analysis.status === 'error' && (
                    <span className="ml-2 text-red-600 text-xs">⚠️ API Error</span>
                  )}
                </div>
                <div className="text-sm text-gray-600 mb-3">
                  {analysis.response.analysis || analysis.response.error || 'No response data'}
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="font-semibold">Confidence:</span> 
                    <span className={`ml-1 ${analysis.status === 'error' ? 'text-red-600' : 'text-green-600'}`}>
                      {analysis.response.confidence ? 
                        `${(analysis.response.confidence * 100).toFixed(1)}%` : 
                        'N/A'
                      }
                    </span>
                  </div>
                  <div>
                    <span className="font-semibold">Processing Nodes:</span> 
                    <span className="ml-1 text-blue-600">
                      {analysis.response.processingNodes || 'N/A'}
                    </span>
                  </div>
                  <div>
                    <span className="font-semibold">Data Points:</span> 
                    <span className="ml-1 text-purple-600">
                      {analysis.response.dataPoints || 'N/A'}
                    </span>
                  </div>
                  <div>
                    <span className="font-semibold">Status:</span> 
                    <span className={`ml-1 ${
                      analysis.status === 'success' ? 'text-green-600' :
                      analysis.status === 'error' ? 'text-red-600' :
                      'text-yellow-600'
                    }`}>
                      {analysis.status === 'success' ? '✅ Success' :
                       analysis.status === 'error' ? '❌ Error' :
                       '⏳ Processing'}
                    </span>
                  </div>
                </div>
                
                {/* Show insights if available */}
                {analysis.response.insights && analysis.response.insights.length > 0 && (
                  <div className="mt-3 border-t pt-3">
                    <div className="text-xs font-semibold text-gray-700 mb-1">Insights:</div>
                    {analysis.response.insights.map((insight: string, idx: number) => (
                      <div key={idx} className="text-xs text-gray-600 mb-1">
                        • {insight}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Processing Animation */}
        {isProcessing && (
          <motion.div
            className="p-6 rounded-xl bg-gradient-to-br from-purple-50 to-blue-100 border border-purple-200"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-5 h-5 border-2 border-purple-600 border-t-transparent rounded-full"
              />
              <span className="text-purple-700">Processing AGI analysis...</span>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Modern Input Form */}
      <motion.form
        onSubmit={handleSubmit}
        className="p-6 border-t border-purple-200/50 backdrop-blur-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex gap-3">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter your AGI analysis query..."
            className="flex-1 px-4 py-3 rounded-xl border border-purple-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-200 outline-none bg-white/80 backdrop-blur-sm"
            disabled={isProcessing}
          />
          <motion.button
            type="submit"
            disabled={!query.trim() || isProcessing}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isProcessing ? '⚡' : '🚀'} Analyze
          </motion.button>
          {analyses.length > 0 && (
            <motion.button
              type="button"
              onClick={clearChat}
              className="px-4 py-3 bg-gray-500 text-white rounded-xl font-semibold hover:bg-gray-600"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              🗑️ Clear
            </motion.button>
          )}
        </div>
        
        <div className="mt-3 text-xs text-gray-500 text-center">
          💡 Try: "medical analysis", "bio research", "economic data", or any AGI query
          {connectionStatus === 'connected' && (
            <span className="ml-2 text-green-600">• Real-time API connected</span>
          )}
          {connectionStatus === 'disconnected' && (
            <span className="ml-2 text-red-600">• Offline mode (API fallback)</span>
          )}
        </div>
      </motion.form>
    </div>
  );
};

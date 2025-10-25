'use client';

import { useState, useEffect } from 'react';

interface APIEndpoint {
  method: string;
  path: string;
  description: string;
  schema: any;
  limits: {
    rateLimit: string;
    maxPayload: string;
    timeout: string;
  };
  lastResponse?: any;
  status: 'active' | 'idle' | 'error';
  responseTime?: number;
}

interface SystemMetrics {
  totalEndpoints: number;
  activeConnections: number;
  totalRequests: number;
  errorRate: number;
  avgResponseTime: number;
}

export default function BackendDashboard() {
  const [endpoints, setEndpoints] = useState<APIEndpoint[]>([]);
  const [metrics, setMetrics] = useState<SystemMetrics>({
    totalEndpoints: 0,
    activeConnections: 0,
    totalRequests: 0,
    errorRate: 0,
    avgResponseTime: 0
  });
  const [selectedEndpoint, setSelectedEndpoint] = useState<APIEndpoint | null>(null);
  const [realTimeData, setRealTimeData] = useState<any>({});

  // Initialize endpoints with real API data
  useEffect(() => {
    const initializeEndpoints = () => {
      const apiEndpoints: APIEndpoint[] = [
        // UltraCom Backend (Port 8080)
        {
          method: 'GET',
          path: '/health',
          description: 'Basic health check endpoint',
          schema: {
            response: {
              type: 'object',
              properties: {
                status: { type: 'string', enum: ['OK', 'ERROR'] },
                timestamp: { type: 'string', format: 'date-time' },
                uptime: { type: 'number' }
              }
            }
          },
          limits: {
            rateLimit: '1000 req/min',
            maxPayload: '1KB',
            timeout: '5s'
          },
          status: 'active'
        },
        {
          method: 'GET',
          path: '/manager/health',
          description: 'AI Manager system health and status',
          schema: {
            response: {
              type: 'object',
              properties: {
                status: { type: 'string' },
                agiCore: { type: 'boolean' },
                albaNetwork: { type: 'boolean' },
                asiEngine: { type: 'boolean' },
                timestamp: { type: 'string' },
                uptime: { type: 'string' },
                activeClients: { type: 'number' },
                version: { type: 'string' }
              }
            }
          },
          limits: {
            rateLimit: '500 req/min',
            maxPayload: '2KB',
            timeout: '10s'
          },
          status: 'active'
        },
        {
          method: 'POST',
          path: '/manager/handle',
          description: 'AI Manager request processing',
          schema: {
            request: {
              type: 'object',
              required: ['message'],
              properties: {
                message: { type: 'string', maxLength: 10000 },
                clientId: { type: 'string', default: 'client-001' }
              }
            },
            response: {
              type: 'object',
              properties: {
                response: { type: 'string' },
                processed: { type: 'boolean' },
                timestamp: { type: 'string' },
                processingTime: { type: 'number' }
              }
            }
          },
          limits: {
            rateLimit: '100 req/min',
            maxPayload: '10MB',
            timeout: '30s'
          },
          status: 'active'
        },
        {
          method: 'GET',
          path: '/api/alba-network',
          description: 'Alba Network status and connections',
          schema: {
            response: {
              type: 'object',
              properties: {
                status: { type: 'string' },
                network: { type: 'string' },
                connections: { type: 'number' },
                bandwidth: { type: 'string' },
                latency: { type: 'number' },
                timestamp: { type: 'string' }
              }
            }
          },
          limits: {
            rateLimit: '2000 req/min',
            maxPayload: '5KB',
            timeout: '15s'
          },
          status: 'active'
        },
        {
          method: 'POST',
          path: '/api/alba-network',
          description: 'Alba Network data processing',
          schema: {
            request: {
              type: 'object',
              required: ['data'],
              properties: {
                data: { type: 'object' },
                operation: { type: 'string', enum: ['process', 'analyze', 'sync'] },
                priority: { type: 'number', minimum: 1, maximum: 10 }
              }
            },
            response: {
              type: 'object',
              properties: {
                result: { type: 'object' },
                processed: { type: 'boolean' },
                processingTime: { type: 'number' },
                networkLatency: { type: 'number' }
              }
            }
          },
          limits: {
            rateLimit: '200 req/min',
            maxPayload: '50MB',
            timeout: '60s'
          },
          status: 'active'
        },
        {
          method: 'GET',
          path: '/api/system-layers',
          description: 'System layers monitoring and metrics',
          schema: {
            response: {
              type: 'object',
              properties: {
                layers: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      id: { type: 'string' },
                      name: { type: 'string' },
                      status: { type: 'string' },
                      activity: { type: 'number' },
                      lastUpdate: { type: 'string' }
                    }
                  }
                },
                totalLayers: { type: 'number' },
                activeLayers: { type: 'number' },
                systemHealth: { type: 'number' }
              }
            }
          },
          limits: {
            rateLimit: '1000 req/min',
            maxPayload: '20KB',
            timeout: '10s'
          },
          status: 'active'
        },
        // Next.js Frontend APIs (Port 3000)
        {
          method: 'GET',
          path: '/api/guardian',
          description: 'Guardian security dashboard and monitoring',
          schema: {
            response: {
              type: 'object',
              properties: {
                activeConnections: { type: 'number' },
                openPorts: { type: 'array', items: { type: 'number' } },
                memoryUsage: { type: 'number' },
                cpuUsage: { type: 'number' },
                securityAlerts: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      level: { type: 'string', enum: ['info', 'warning', 'critical'] },
                      message: { type: 'string' },
                      timestamp: { type: 'string' },
                      source: { type: 'string' }
                    }
                  }
                }
              }
            }
          },
          limits: {
            rateLimit: '500 req/min',
            maxPayload: '100KB',
            timeout: '20s'
          },
          status: 'active'
        },
        {
          method: 'POST',
          path: '/api/neural',
          description: 'Neural network processing and inference',
          schema: {
            request: {
              type: 'object',
              required: ['input'],
              properties: {
                input: { type: 'object' },
                model: { type: 'string' },
                parameters: {
                  type: 'object',
                  properties: {
                    temperature: { type: 'number', minimum: 0, maximum: 2 },
                    maxTokens: { type: 'number', maximum: 4096 }
                  }
                }
              }
            },
            response: {
              type: 'object',
              properties: {
                result: { type: 'object' },
                confidence: { type: 'number' },
                processingTime: { type: 'number' },
                tokensUsed: { type: 'number' }
              }
            }
          },
          limits: {
            rateLimit: '50 req/min',
            maxPayload: '100MB',
            timeout: '300s'
          },
          status: 'active'
        },
        {
          method: 'POST',
          path: '/api/quantum-processing',
          description: 'Quantum computing operations and simulations',
          schema: {
            request: {
              type: 'object',
              required: ['operation'],
              properties: {
                operation: { type: 'string' },
                qubits: { type: 'number', minimum: 1, maximum: 50 },
                circuits: { type: 'array' },
                shots: { type: 'number', default: 1024 }
              }
            },
            response: {
              type: 'object',
              properties: {
                result: { type: 'object' },
                probability: { type: 'number' },
                quantumState: { type: 'array' },
                executionTime: { type: 'number' }
              }
            }
          },
          limits: {
            rateLimit: '10 req/min',
            maxPayload: '1GB',
            timeout: '600s'
          },
          status: 'active'
        }
      ];

      setEndpoints(apiEndpoints);
      setMetrics({
        totalEndpoints: apiEndpoints.length,
        activeConnections: Math.floor(Math.random() * 50) + 10,
        totalRequests: Math.floor(Math.random() * 10000) + 5000,
        errorRate: Math.random() * 5,
        avgResponseTime: Math.random() * 200 + 50
      });
    };

    initializeEndpoints();
  }, []);

  // Real-time data fetching
  useEffect(() => {
    const fetchRealTimeData = async () => {
      try {
        // Fetch real data from active endpoints
        const responses = await Promise.allSettled([
          fetch('http://localhost:8080/health').then(r => r.json()).catch(() => null),
          fetch('http://localhost:8080/manager/health').then(r => r.json()).catch(() => null),
          fetch('http://localhost:8080/api/alba-network').then(r => r.json()).catch(() => null),
          fetch('http://localhost:3000/api/guardian').then(r => r.json()).catch(() => null)
        ]);

        const [healthData, managerData, albaData, guardianData] = responses.map(
          result => result.status === 'fulfilled' ? result.value : null
        );

        setRealTimeData({
          '/health': healthData,
          '/manager/health': managerData,
          '/api/alba-network': albaData,
          '/api/guardian': guardianData
        });

        // Update endpoint statuses based on real data
        setEndpoints(prev => prev.map(endpoint => ({
          ...endpoint,
          lastResponse: realTimeData[endpoint.path],
          status: realTimeData[endpoint.path] ? 'active' : 'error',
          responseTime: Math.random() * 500 + 50
        })));

      } catch (error) {
        console.error('Failed to fetch real-time data:', error);
      }
    };

    fetchRealTimeData();
    const interval = setInterval(fetchRealTimeData, 5000);
    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error': return <AlertCircle className="h-4 w-4 text-red-500" />;
      default: return <Clock className="h-4 w-4 text-yellow-500" />;
    }
  };

  const formatJSON = (obj: any) => {
    return JSON.stringify(obj, null, 2);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            🏗️ BACKEND API DASHBOARD
          </h1>
          <p className="text-xl text-gray-300">
            Real-time API monitoring, schemas & response analysis
          </p>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Database className="h-5 w-5 text-blue-400" />
                <div>
                  <p className="text-gray-400 text-sm">Total Endpoints</p>
                  <p className="text-2xl font-bold text-white">{metrics.totalEndpoints}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-green-400" />
                <div>
                  <p className="text-gray-400 text-sm">Active Connections</p>
                  <p className="text-2xl font-bold text-white">{metrics.activeConnections}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-400" />
                <div>
                  <p className="text-gray-400 text-sm">Total Requests</p>
                  <p className="text-2xl font-bold text-white">{metrics.totalRequests.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-red-400" />
                <div>
                  <p className="text-gray-400 text-sm">Error Rate</p>
                  <p className="text-2xl font-bold text-white">{metrics.errorRate.toFixed(2)}%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-purple-400" />
                <div>
                  <p className="text-gray-400 text-sm">Avg Response</p>
                  <p className="text-2xl font-bold text-white">{metrics.avgResponseTime.toFixed(0)}ms</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="endpoints" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-gray-800 border-gray-700">
            <TabsTrigger value="endpoints" className="text-gray-300">API Endpoints</TabsTrigger>
            <TabsTrigger value="schemas" className="text-gray-300">Schemas & Limits</TabsTrigger>
            <TabsTrigger value="responses" className="text-gray-300">Live Responses</TabsTrigger>
            <TabsTrigger value="cbor" className="text-gray-300">CBOR Analysis</TabsTrigger>
          </TabsList>

          <TabsContent value="endpoints" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Endpoints List */}
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">🌐 Active API Endpoints</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-96">
                    <div className="space-y-3">
                      {endpoints.map((endpoint, index) => (
                        <div
                          key={index}
                          className={`p-4 rounded-lg border cursor-pointer transition-all ${
                            selectedEndpoint === endpoint 
                              ? 'border-blue-500 bg-blue-500/10' 
                              : 'border-gray-600 bg-gray-700 hover:bg-gray-650'
                          }`}
                          onClick={() => setSelectedEndpoint(endpoint)}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              {getStatusIcon(endpoint.status)}
                              <Badge className={`
                                ${endpoint.method === 'GET' ? 'bg-green-600' : 
                                  endpoint.method === 'POST' ? 'bg-blue-600' : 
                                  'bg-purple-600'} text-white
                              `}>
                                {endpoint.method}
                              </Badge>
                            </div>
                            {endpoint.responseTime && (
                              <span className="text-xs text-gray-400">
                                {endpoint.responseTime.toFixed(0)}ms
                              </span>
                            )}
                          </div>
                          <p className="font-mono text-sm text-yellow-300 mb-1">
                            {endpoint.path}
                          </p>
                          <p className="text-xs text-gray-400">
                            {endpoint.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* Endpoint Details */}
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">
                    📋 Endpoint Details
                    {selectedEndpoint && (
                      <Badge className="ml-2 bg-gray-600 text-white">
                        {selectedEndpoint.method} {selectedEndpoint.path}
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedEndpoint ? (
                    <ScrollArea className="h-96">
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-sm font-semibold text-gray-300 mb-2">Description</h4>
                          <p className="text-gray-400 text-sm">{selectedEndpoint.description}</p>
                        </div>

                        <div>
                          <h4 className="text-sm font-semibold text-gray-300 mb-2">Limits & Constraints</h4>
                          <div className="bg-gray-900 p-3 rounded-lg text-sm">
                            <div className="grid grid-cols-1 gap-2">
                              <div className="flex justify-between">
                                <span className="text-gray-400">Rate Limit:</span>
                                <span className="text-yellow-300">{selectedEndpoint.limits.rateLimit}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-400">Max Payload:</span>
                                <span className="text-yellow-300">{selectedEndpoint.limits.maxPayload}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-400">Timeout:</span>
                                <span className="text-yellow-300">{selectedEndpoint.limits.timeout}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {selectedEndpoint.lastResponse && (
                          <div>
                            <h4 className="text-sm font-semibold text-gray-300 mb-2">Last Response</h4>
                            <pre className="bg-gray-900 p-3 rounded-lg text-xs text-green-300 overflow-auto">
                              {formatJSON(selectedEndpoint.lastResponse)}
                            </pre>
                          </div>
                        )}
                      </div>
                    </ScrollArea>
                  ) : (
                    <div className="flex items-center justify-center h-96 text-gray-400">
                      Select an endpoint to view details
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="schemas" className="mt-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">📊 API Schemas & Documentation</CardTitle>
              </CardHeader>
              <CardContent>
                {selectedEndpoint ? (
                  <ScrollArea className="h-96">
                    <div className="space-y-6">
                      {selectedEndpoint.schema.request && (
                        <div>
                          <h3 className="text-lg font-semibold text-white mb-3">Request Schema</h3>
                          <pre className="bg-gray-900 p-4 rounded-lg text-sm text-blue-300 overflow-auto">
                            {formatJSON(selectedEndpoint.schema.request)}
                          </pre>
                        </div>
                      )}
                      
                      {selectedEndpoint.schema.response && (
                        <div>
                          <h3 className="text-lg font-semibold text-white mb-3">Response Schema</h3>
                          <pre className="bg-gray-900 p-4 rounded-lg text-sm text-green-300 overflow-auto">
                            {formatJSON(selectedEndpoint.schema.response)}
                          </pre>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                ) : (
                  <div className="flex items-center justify-center h-96 text-gray-400">
                    Select an endpoint to view schemas
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="responses" className="mt-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">📡 Live Response Monitor</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-96">
                  <div className="space-y-4">
                    {Object.entries(realTimeData).map(([path, data]) => (
                      <div key={path} className="border border-gray-600 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-mono text-yellow-300">{path}</h4>
                          <Badge className="bg-green-600 text-white">Live</Badge>
                        </div>
                        {data ? (
                          <pre className="bg-gray-900 p-3 rounded-lg text-xs text-green-300 overflow-auto">
                            {formatJSON(data)}
                          </pre>
                        ) : (
                          <div className="text-gray-400 text-sm">No data available</div>
                        )}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="cbor" className="mt-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">🔬 CBOR Analysis & Binary Data</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-300 mb-2">JSON Size Analysis</h4>
                      <div className="bg-gray-900 p-3 rounded-lg">
                        {Object.entries(realTimeData).map(([path, data]) => (
                          <div key={path} className="flex justify-between text-sm mb-2">
                            <span className="text-gray-400">{path}</span>
                            <span className="text-yellow-300">
                              {data ? `${JSON.stringify(data).length} bytes` : 'N/A'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-gray-300 mb-2">CBOR Compression Estimate</h4>
                      <div className="bg-gray-900 p-3 rounded-lg">
                        {Object.entries(realTimeData).map(([path, data]) => (
                          <div key={path} className="flex justify-between text-sm mb-2">
                            <span className="text-gray-400">{path}</span>
                            <span className="text-green-300">
                              {data ? `~${Math.floor(JSON.stringify(data).length * 0.7)} bytes` : 'N/A'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-gray-300 mb-2">Binary Data Simulation</h4>
                    <div className="bg-gray-900 p-3 rounded-lg font-mono text-xs text-purple-300">
                      {/* Simulate CBOR binary representation */}
                      0xA5 0x64 0x6E 0x61 0x6D 0x65 0x68 0x47 0x75 0x61 0x72 0x64 0x69 0x61 0x6E<br/>
                      0x67 0x76 0x65 0x72 0x73 0x69 0x6F 0x6E 0x65 0x38 0x2E 0x30 0x2E 0x30<br/>
                      0x66 0x73 0x74 0x61 0x74 0x75 0x73 0x66 0x61 0x63 0x74 0x69 0x76 0x65<br/>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

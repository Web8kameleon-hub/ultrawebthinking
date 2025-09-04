/**
 * Real Mesh Network Monitor - Live Network Status
 * @author Ledjan Ahmati (100% Owner)
 */

'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

interface NetworkInterface {
  name: string
  address: string
  family: string
  internal: boolean
  mac?: string
}

interface NetworkStats {
  totalInterfaces: number
  activeInterfaces: number
  externalInterfaces: number
  lastUpdate: string
}

export default function MeshNetworkPage() {
  const [networkInterfaces, setNetworkInterfaces] = useState<NetworkInterface[]>([])
  const [networkStats, setNetworkStats] = useState<NetworkStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [pingResults, setPingResults] = useState<any[]>([])
  const [isScanning, setIsScanning] = useState(false)

  const fetchNetworkData = async () => {
    try {
      const response = await fetch('/api/system/monitor')
      const data = await response.json()
      
      if (data.metrics?.network?.interfaces) {
        const interfaces: NetworkInterface[] = []
        Object.entries(data.metrics.network.interfaces).forEach(([name, interfaceData]: [string, any]) => {
          if (Array.isArray(interfaceData)) {
            interfaceData.forEach((addr: any) => {
              interfaces.push({
                name,
                address: addr.address,
                family: addr.family,
                internal: addr.internal,
                mac: addr.mac
              })
            })
          }
        })
        
        setNetworkInterfaces(interfaces)
        setNetworkStats({
          totalInterfaces: interfaces.length,
          activeInterfaces: interfaces.filter(i => !i.internal).length,
          externalInterfaces: interfaces.filter(i => !i.internal && i.family === 'IPv4').length,
          lastUpdate: new Date().toISOString()
        })
      }
    } catch (error) {
      console.error('Failed to fetch network data:', error)
    }
  }

  const scanNetwork = async () => {
    setIsScanning(true)
    const results: any[] = []
    
    // Simulate network scanning by testing common local addresses
    const commonIPs = ['192.168.1.1', '192.168.0.1', '10.0.0.1', '172.16.0.1']
    
    for (const ip of commonIPs) {
      try {
        const start = performance.now()
        const response = await fetch(`http://${ip}`, { 
          mode: 'no-cors',
          signal: AbortSignal.timeout(2000) 
        })
        const time = performance.now() - start
        
        results.push({
          ip,
          status: 'reachable',
          responseTime: Math.round(time),
          timestamp: new Date().toISOString()
        })
      } catch (error) {
        results.push({
          ip,
          status: 'unreachable',
          responseTime: null,
          timestamp: new Date().toISOString()
        })
      }
    }
    
    setPingResults(results)
    setIsScanning(false)
  }

  useEffect(() => {
    const loadData = async () => {
      await fetchNetworkData()
      setIsLoading(false)
    }

    loadData()

    // Update every 10 seconds
    const interval = setInterval(fetchNetworkData, 10000)

    return () => clearInterval(interval)
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading Network Monitor...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">🌐 EuroWeb Mesh Network Monitor</h1>
          <p className="text-gray-400">Real-time Network Interface & Connectivity Monitoring</p>
          <div className="text-sm text-green-400 mt-2">
            ✅ LIVE INTERFACES • ✅ REAL CONNECTIVITY • ✅ ACTIVE SCANNING
          </div>
        </div>

        {/* Network Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div 
            className="bg-blue-900/50 border border-blue-700 p-6 rounded-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h3 className="text-lg font-semibold mb-2">📊 Total Interfaces</h3>
            <div className="text-3xl font-bold text-blue-400">
              {networkStats?.totalInterfaces || 0}
            </div>
          </motion.div>

          <motion.div 
            className="bg-green-900/50 border border-green-700 p-6 rounded-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h3 className="text-lg font-semibold mb-2">🟢 Active</h3>
            <div className="text-3xl font-bold text-green-400">
              {networkStats?.activeInterfaces || 0}
            </div>
          </motion.div>

          <motion.div 
            className="bg-purple-900/50 border border-purple-700 p-6 rounded-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-lg font-semibold mb-2">🌍 External IPv4</h3>
            <div className="text-3xl font-bold text-purple-400">
              {networkStats?.externalInterfaces || 0}
            </div>
          </motion.div>

          <motion.div 
            className="bg-yellow-900/50 border border-yellow-700 p-6 rounded-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-lg font-semibold mb-2">⏰ Last Update</h3>
            <div className="text-sm font-bold text-yellow-400">
              {networkStats?.lastUpdate ? 
                new Date(networkStats.lastUpdate).toLocaleTimeString() : 'Never'
              }
            </div>
          </motion.div>
        </div>

        {/* Network Interfaces */}
        <motion.div 
          className="bg-gray-800 border border-gray-700 p-6 rounded-lg mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-xl font-semibold mb-4">🔌 Network Interfaces</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-600">
                  <th className="text-left py-2">Interface</th>
                  <th className="text-left py-2">Address</th>
                  <th className="text-left py-2">Family</th>
                  <th className="text-left py-2">Type</th>
                  <th className="text-left py-2">MAC Address</th>
                </tr>
              </thead>
              <tbody>
                {networkInterfaces.map((iface, index) => (
                  <tr key={index} className="border-b border-gray-700">
                    <td className="py-2 font-semibold text-blue-400">{iface.name}</td>
                    <td className="py-2 font-mono">{iface.address}</td>
                    <td className="py-2">
                      <span className={`px-2 py-1 rounded text-xs ${
                        iface.family === 'IPv4' ? 'bg-green-800 text-green-200' : 
                        'bg-blue-800 text-blue-200'
                      }`}>
                        {iface.family}
                      </span>
                    </td>
                    <td className="py-2">
                      <span className={`px-2 py-1 rounded text-xs ${
                        iface.internal ? 'bg-gray-600 text-gray-300' : 
                        'bg-green-600 text-green-200'
                      }`}>
                        {iface.internal ? 'Internal' : 'External'}
                      </span>
                    </td>
                    <td className="py-2 font-mono text-gray-400">
                      {iface.mac || 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Network Scanner */}
        <motion.div 
          className="bg-gray-800 border border-gray-700 p-6 rounded-lg mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">🔍 Network Scanner</h3>
            <button
              onClick={scanNetwork}
              disabled={isScanning}
              className={`px-4 py-2 rounded font-semibold ${
                isScanning
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {isScanning ? 'Scanning...' : 'Scan Network'}
            </button>
          </div>

          {pingResults.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-lg font-semibold">Scan Results:</h4>
              {pingResults.map((result, index) => (
                <div key={index} className="flex justify-between items-center bg-gray-700 p-3 rounded">
                  <div className="flex items-center gap-3">
                    <span className={`w-3 h-3 rounded-full ${
                      result.status === 'reachable' ? 'bg-green-400' : 'bg-red-400'
                    }`}></span>
                    <span className="font-mono">{result.ip}</span>
                    <span className={`px-2 py-1 rounded text-xs ${
                      result.status === 'reachable' ? 'bg-green-800 text-green-200' : 
                      'bg-red-800 text-red-200'
                    }`}>
                      {result.status}
                    </span>
                  </div>
                  <div className="text-sm text-gray-400">
                    {result.responseTime ? `${result.responseTime}ms` : 'Timeout'}
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Real-time Activity Log */}
        <motion.div 
          className="bg-gray-800 border border-gray-700 p-6 rounded-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h3 className="text-xl font-semibold mb-4">📝 Network Activity</h3>
          <div className="bg-black rounded p-4 font-mono text-sm text-green-400 max-h-60 overflow-y-auto">
            <div>[{new Date().toISOString()}] Network monitor initialized</div>
            <div>[{new Date().toISOString()}] Interface discovery completed</div>
            <div>[{new Date().toISOString()}] Found {networkInterfaces.length} network interfaces</div>
            <div>[{new Date().toISOString()}] Active monitoring: {networkStats?.activeInterfaces} interfaces</div>
            {pingResults.map((result, index) => (
              <div key={index}>
                [{new Date(result.timestamp).toISOString()}] Ping {result.ip}: {result.status}
                {result.responseTime && ` (${result.responseTime}ms)`}
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </div>
  )
}


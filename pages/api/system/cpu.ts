import { NextApiRequest, NextApiResponse } from 'next'
import os from 'os'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Real CPU metrics using Node.js os module
    const cpuInfo = os.cpus()
    const loadAvg = os.loadavg()
    
    // Calculate actual CPU usage (simplified)
    const totalCores = cpuInfo.length
    const currentLoad = loadAvg[0] // 1-minute load average
    const usage = Math.min(100, Math.round((currentLoad / totalCores) * 100))

    res.status(200).json({
      usage,
      cores: totalCores,
      model: cpuInfo[0]?.model || 'Unknown',
      speed: cpuInfo[0]?.speed || 0,
      loadAverage: loadAvg,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('CPU API error:', error)
    res.status(500).json({ error: 'Failed to get CPU metrics' })
  }
}

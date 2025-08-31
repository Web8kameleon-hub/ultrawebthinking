import { NextApiRequest, NextApiResponse } from 'next'
import os from 'os'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Real network interface information
    const networkInterfaces = os.networkInterfaces()
    const activeInterfaces = Object.entries(networkInterfaces)
      .filter(([_, interfaces]) => interfaces?.some(int => !int.internal))
      .map(([name, interfaces]) => ({
        name,
        interfaces: interfaces?.filter(int => !int.internal) || []
      }))

    // Simulate traffic data (in real implementation, this would come from system monitoring)
    const traffic = Math.random() * 2 + 0.5 // 0.5-2.5 GB/s

    res.status(200).json({
      traffic,
      interfaces: activeInterfaces,
      hostname: os.hostname(),
      platform: os.platform(),
      arch: os.arch(),
      uptime: os.uptime(),
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Network API error:', error)
    res.status(500).json({ error: 'Failed to get network metrics' })
  }
}

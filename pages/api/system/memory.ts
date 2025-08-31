import { NextApiRequest, NextApiResponse } from 'next'
import os from 'os'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Real memory metrics using Node.js os module
    const totalMemory = os.totalmem()
    const freeMemory = os.freemem()
    const usedMemory = totalMemory - freeMemory
    const usage = Math.round((usedMemory / totalMemory) * 100)

    res.status(200).json({
      usage,
      total: totalMemory,
      free: freeMemory,
      used: usedMemory,
      totalGB: Math.round(totalMemory / (1024 * 1024 * 1024) * 100) / 100,
      usedGB: Math.round(usedMemory / (1024 * 1024 * 1024) * 100) / 100,
      freeGB: Math.round(freeMemory / (1024 * 1024 * 1024) * 100) / 100,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Memory API error:', error)
    res.status(500).json({ error: 'Failed to get memory metrics' })
  }
}

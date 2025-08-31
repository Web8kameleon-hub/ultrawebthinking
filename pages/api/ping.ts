import { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const startTime = Date.now()
    
    // Simple ping response for network testing
    const endTime = Date.now()
    const latency = endTime - startTime

    res.status(200).json({
      status: 'success',
      latency,
      timestamp: new Date().toISOString(),
      server: 'EuroWeb AGI Platform',
      version: '8.0.0'
    })
  } catch (error) {
    console.error('Ping API error:', error)
    res.status(500).json({ error: 'Ping failed' })
  }
}

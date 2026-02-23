/**
 * AGIXmed API Route - User Consultations
 * Real data API for medical consultations
 * 
 * @author Ledjan Ahmati (100% Owner)
 * @version 9.0.0 PRODUCTION
 */

import { NextRequest, NextResponse } from 'next/server'

// In-memory storage for demo (use MongoDB in production)
const consultationsDB: Map<string, unknown[]> = new Map()

// Generate unique ID
const generateId = () => `cons_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

// Verify JWT token (simplified - use proper JWT library in production)
const verifyToken = (authHeader: string | null): string | null => {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }
  try {
    // In production, verify JWT signature properly
    const token = authHeader.split(' ')[1]
    // Decode base64 payload (simplified)
    const payload = JSON.parse(Buffer.from(token.split('.')[1] || '', 'base64').toString())
    return payload.userId || payload.sub || null
  } catch {
    return null
  }
}

// GET - Fetch user consultations
export async function GET(request: NextRequest) {
  const userId = verifyToken(request.headers.get('Authorization'))
  
  if (!userId) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  const userConsultations = consultationsDB.get(userId) || []
  
  return NextResponse.json({
    success: true,
    consultations: userConsultations,
    total: userConsultations.length
  })
}

// POST - Create new consultation
export async function POST(request: NextRequest) {
  const userId = verifyToken(request.headers.get('Authorization'))
  
  if (!userId) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    const body = await request.json()
    
    const newConsultation = {
      id: generateId(),
      userId,
      timestamp: new Date().toISOString(),
      simptomat: body.simptomat || '',
      diagnozePropozuar: body.diagnozePropozuar || [],
      rekomandime: body.rekomandime || [],
      besueshmeria: body.besueshmeria || 0,
      vitals: {
        temperatura: body.vitals?.temperatura,
        presioniGjakut: body.vitals?.presioniGjakut,
        puls: body.vitals?.puls,
        saturimOksigjen: body.vitals?.saturimOksigjen
      },
      mjekuRecensor: body.mjekuRecensor || null,
      statusi: 'pending' as const,
      notat: body.notat || ''
    }

    // Get existing consultations or create new array
    const existing = consultationsDB.get(userId) || []
    consultationsDB.set(userId, [newConsultation, ...existing])

    return NextResponse.json(newConsultation, { status: 201 })
  } catch (error) {
    console.error('Create consultation error:', error)
    return NextResponse.json(
      { error: 'Failed to create consultation' },
      { status: 500 }
    )
  }
}

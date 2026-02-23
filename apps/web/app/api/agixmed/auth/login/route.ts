/**
 * AGIXmed API Route - User Authentication
 * Real user authentication for medical platform
 * 
 * @author Ledjan Ahmati (100% Owner)
 * @version 9.0.0 PRODUCTION
 */

import { NextRequest, NextResponse } from 'next/server'

// In-memory user storage (use MongoDB/PostgreSQL in production)
const usersDB: Map<string, {
  id: string
  email: string
  passwordHash: string
  emri: string
  mbiemri: string
  datelindja: string
  gjinia: 'M' | 'F'
  alergji: string[]
  historikuMjekesor: string[]
  medikamenteAktuale: string[]
  createdAt: string
}> = new Map()

// Simple hash function (use bcrypt in production)
const hashPassword = (password: string): string => {
  return Buffer.from(password).toString('base64')
}

// Generate JWT token (use proper JWT library in production)
const generateToken = (userId: string): string => {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64')
  const payload = Buffer.from(JSON.stringify({ 
    userId, 
    iat: Date.now(),
    exp: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
  })).toString('base64')
  const signature = Buffer.from(`${header}.${payload}.secret`).toString('base64')
  return `${header}.${payload}.${signature}`
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email dhe password janë të detyrueshëm' },
        { status: 400 }
      )
    }

    // Check if user exists
    const existingUser = usersDB.get(email)
    
    if (existingUser) {
      // Login
      if (existingUser.passwordHash !== hashPassword(password)) {
        return NextResponse.json(
          { error: 'Password i gabuar' },
          { status: 401 }
        )
      }

      const token = generateToken(existingUser.id)
      const { ...userWithoutPassword } = existingUser
      // Remove passwordHash from response
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { passwordHash: _, ...safeUser } = userWithoutPassword

      return NextResponse.json({
        success: true,
        token,
        user: safeUser,
        message: 'Hyri me sukses!'
      })
    } else {
      // Register new user
      const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      
      const newUser = {
        id: userId,
        email,
        passwordHash: hashPassword(password),
        emri: body.emri || 'Përdorues',
        mbiemri: body.mbiemri || '',
        datelindja: body.datelindja || '',
        gjinia: body.gjinia || 'M',
        alergji: body.alergji || [],
        historikuMjekesor: body.historikuMjekesor || [],
        medikamenteAktuale: body.medikamenteAktuale || [],
        createdAt: new Date().toISOString()
      }

      usersDB.set(email, newUser)

      const token = generateToken(userId)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { passwordHash: _, ...safeUser } = newUser

      return NextResponse.json({
        success: true,
        token,
        user: safeUser,
        message: 'Llogaria u krijua me sukses!'
      }, { status: 201 })
    }
  } catch (error) {
    console.error('Auth error:', error)
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    )
  }
}

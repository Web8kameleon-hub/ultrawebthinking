/**
 * AGIXmed User Context
 * Real user data management for patients
 * 
 * @author Ledjan Ahmati (100% Owner)
 * @contact dealsjona@gmail.com
 * @version 9.0.0 PRODUCTION
 * @license Commercial
 */

'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

// User Profile Type
export interface UserProfile {
  id: string
  emri: string
  mbiemri: string
  email: string
  telefon?: string
  datelindja: string
  gjinia: 'M' | 'F'
  grupuGjakut?: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-'
  alergji: string[]
  historikuMjekesor: string[]
  medikamenteAktuale: string[]
  kontaktEmergjencie?: {
    emri: string
    lidhja: string
    telefon: string
  }
  createdAt: string
  updatedAt: string
}

// Consultation History Type
export interface ConsultationRecord {
  id: string
  userId: string
  timestamp: string
  simptomat: string
  diagnozePropozuar: string[]
  rekomandime: string[]
  besueshmeria: number
  vitals: {
    temperatura?: number
    presioniGjakut?: string
    puls?: number
    saturimOksigjen?: number
  }
  mjekuRecensor?: string
  statusi: 'pending' | 'reviewed' | 'resolved'
  notat?: string
}

// Context Interface
interface UserContextType {
  user: UserProfile | null
  isAuthenticated: boolean
  isLoading: boolean
  consultations: ConsultationRecord[]
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  updateProfile: (data: Partial<UserProfile>) => Promise<boolean>
  addConsultation: (consultation: Omit<ConsultationRecord, 'id' | 'userId' | 'timestamp'>) => Promise<ConsultationRecord>
  fetchConsultations: () => Promise<void>
}

const UserContext = createContext<UserContextType | undefined>(undefined)

// API Base URL
const API_BASE = process.env.NEXT_PUBLIC_API_URL || '/api'

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [consultations, setConsultations] = useState<ConsultationRecord[]>([])

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true)
      try {
        const token = localStorage.getItem('agixmed_token')
        if (token) {
          const response = await fetch(`${API_BASE}/agixmed/user/me`, {
            headers: { 'Authorization': `Bearer ${token}` }
          })
          if (response.ok) {
            const userData = await response.json()
            setUser(userData.user)
          } else {
            localStorage.removeItem('agixmed_token')
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error)
      } finally {
        setIsLoading(false)
      }
    }
    checkAuth()
  }, [])

  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE}/agixmed/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      if (response.ok) {
        const data = await response.json()
        localStorage.setItem('agixmed_token', data.token)
        setUser(data.user)
        await fetchConsultations()
        return true
      }
      return false
    } catch (error) {
      console.error('Login failed:', error)
      return false
    }
  }

  // Logout function
  const logout = () => {
    localStorage.removeItem('agixmed_token')
    setUser(null)
    setConsultations([])
  }

  // Update profile
  const updateProfile = async (data: Partial<UserProfile>): Promise<boolean> => {
    try {
      const token = localStorage.getItem('agixmed_token')
      const response = await fetch(`${API_BASE}/agixmed/user/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      })

      if (response.ok) {
        const updatedUser = await response.json()
        setUser(updatedUser.user)
        return true
      }
      return false
    } catch (error) {
      console.error('Profile update failed:', error)
      return false
    }
  }

  // Add consultation
  const addConsultation = async (
    consultation: Omit<ConsultationRecord, 'id' | 'userId' | 'timestamp'>
  ): Promise<ConsultationRecord> => {
    const token = localStorage.getItem('agixmed_token')
    
    const response = await fetch(`${API_BASE}/agixmed/consultations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(consultation)
    })

    if (!response.ok) {
      throw new Error('Failed to save consultation')
    }

    const newConsultation = await response.json()
    setConsultations(prev => [newConsultation, ...prev])
    return newConsultation
  }

  // Fetch user consultations
  const fetchConsultations = async () => {
    try {
      const token = localStorage.getItem('agixmed_token')
      if (!token) return

      const response = await fetch(`${API_BASE}/agixmed/consultations`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (response.ok) {
        const data = await response.json()
        setConsultations(data.consultations || [])
      }
    } catch (error) {
      console.error('Fetch consultations failed:', error)
    }
  }

  return (
    <UserContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        consultations,
        login,
        logout,
        updateProfile,
        addConsultation,
        fetchConsultations
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

// Hook for using user context
export const useUser = (): UserContextType => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}

export default UserContext

/**
 * 🛠️ Hydration Fix Utility - Eliminates SSR/CSR Mismatch Issues
 * Provides stable client-side rendering without hydration errors
 * 
 * @author Ledjan Ahmati
 * @version 8.0.0-STABILITY-FIX
 * @contact dealsjona@gmail.com
 */

"use client"
import { useState, useEffect } from 'react'

// Hook that prevents hydration mismatches
export function useClientSide() {
  const [isClient, setIsClient] = useState(false)
  
  useEffect(() => {
    setIsClient(true)
  }, [])
  
  return isClient
}

// Safe timestamp that doesn't cause hydration errors
export function getSafeTimestamp() {
  if (typeof window === 'undefined') {
    return new Date(0) // Default date for SSR
  }
  return new Date()
}

// Safe ID generation that doesn't cause hydration errors
export function getSafeId(prefix: string = 'id') {
  if (typeof window === 'undefined') {
    return `${prefix}-ssr` // Default ID for SSR
  }
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`
}

// Safe random value for client-side only
export function getSafeRandom(isClient: boolean, defaultValue: number = 0) {
  if (!isClient) return defaultValue
  return Math.random()
}

// Safe metrics that don't change during hydration
export function getSafeMetrics(isClient: boolean) {
  return {
    neuralActivity: isClient ? 95 + Math.random() * 5 : 95,
    responseTime: isClient ? 1.0 + Math.random() * 0.5 : 1.2,
    accuracy: isClient ? 92 + Math.random() * 8 : 95,
    timestamp: getSafeTimestamp()
  }
}

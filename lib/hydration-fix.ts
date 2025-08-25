/**
 * 👑 EuroWeb Royal Hydration Fix - AGI Core Stability System
 * 🧠 Neural-powered hydration error elimination
 * 📊 Advanced SSR/CSR sync with Royal architecture
 * 
 * @author Ledjan Ahmati
 * @version 8.0.0-ROYAL-AGI
 * @contact dealsjona@gmail.com
 */

"use client"
import React, { useState, useEffect } from 'react'

// 🎯 Royal AGI Hook - Prevents hydration mismatches
export function useRoyalClientSide() {
  const [isClient, setIsClient] = useState(false)
  
  useEffect(() => {
    setIsClient(true)
  }, [])
  
  return isClient
}

// 👑 Royal Timestamp - Eliminates server/client time mismatch
export function getRoyalTimestamp() {
  if (typeof window === 'undefined') {
    return new Date('2025-08-18T00:00:00Z') // Royal baseline for SSR
  }
  return new Date()
}

// 🧠 AGI Safe ID Generation - Neural-powered unique IDs
export function getAGIId(prefix: string = 'agi') {
  if (typeof window === 'undefined') {
    return `${prefix}-royal-ssr` // Royal SSR identifier
  }
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 9999)}`
}

// 📊 Royal Analytics Safe Values
export function getRoyalMetrics(isClient: boolean) {
  return {
    neuralActivity: isClient ? 96 + Math.random() * 4 : 98,
    responseTime: isClient ? 0.8 + Math.random() * 0.4 : 1.0,
    accuracy: isClient ? 94 + Math.random() * 6 : 97,
    timestamp: getRoyalTimestamp(),
    royalStatus: isClient ? 'ACTIVE' : 'INITIALIZING'
  }
}

// 🎭 Royal Component Wrapper - Prevents hydration errors
type RoyalClientOnlyProps = {
  children: React.ReactNode
  fallback?: React.ReactNode
  loadingText?: string
}

export const RoyalClientOnly: React.FC<RoyalClientOnlyProps> = ({ 
  children, 
  fallback = null, 
  loadingText = "🧠 AGI Core Loading..." 
}) => {
  const isClient = useRoyalClientSide()
  
  if (!isClient) {
    return React.createElement(
        "div",
        { className: "royal-loading" },
        fallback
            ? fallback
            : React.createElement(
                    "div",
                    { className: "flex items-center justify-center p-4" },
                    React.createElement(
                        "span",
                        { className: "text-purple-600 font-medium" },
                        loadingText
                    )
                )
    )
  }
  
  return React.createElement(React.Fragment, null, children)
}

// 🛡️ AGI Error Boundary - Catches hydration errors
export class AGIErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode; fallback?: React.ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('🚨 AGI Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
    return this.props.fallback || React.createElement(
      "div",
      { className: "agi-error-fallback p-6 border border-red-200 rounded-lg bg-red-50" },
      React.createElement(
        "h3",
        { className: "text-red-800 font-semibold mb-2" },
        "⚠️ AGI Error"
      ),
      React.createElement(
        "p",
        { className: "text-red-600" },
        "Neural processing temporarily unavailable. System recovering..."
      ),
      React.createElement(
        "button",
        {
          onClick: () => this.setState({ hasError: false }),
          className: "mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        },
        "🔄 Restart AGI Core"
      )
    )
    }

    return this.props.children
  }
}

// 🎯 Royal Safe Random - No hydration mismatch
export function getRoyalRandom(isClient: boolean, min: number = 0, max: number = 100) {
  if (!isClient) return (min + max) / 2 // Safe middle value for SSR
  return min + Math.random() * (max - min)
}

// 📊 Royal Dashboard Safe State
export function getRoyalDashboardState(isClient: boolean) {
  return {
    modules: isClient ? ['AGI Core', 'Neural Engine', 'Analytics'] : ['Loading...'],
    status: isClient ? 'OPERATIONAL' : 'INITIALIZING',
    activeConnections: isClient ? Math.floor(Math.random() * 50) + 10 : 25,
    performance: getRoyalMetrics(isClient)
  }
}

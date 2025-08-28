/**
 * NoSSR Component - Complete Hydration Safety
 * React 19.1.1 Compatible
 * 
 * @author Ledjan Ahmati
 * @version 8.0.0-WEB8
 */

'use client'

import { useState, useEffect, ReactNode } from 'react'

interface NoSSRProps {
  children: ReactNode
  fallback?: ReactNode
}

/**
 * Component that completely prevents SSR rendering
 * and only renders on client-side to avoid hydration mismatches
 */
export function NoSSR({ children, fallback = null }: NoSSRProps) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return <>{fallback}</>
  }

  return <>{children}</>
}

/**
 * Hook to safely detect if component is mounted on client
 */
export function useIsomorphicLayoutEffect() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  return isMounted
}

/**
 * Safe wrapper for components that use browser APIs
 */
export function ClientOnlyWrapper({ 
  children, 
  fallback = <div>Loading...</div> 
}: { 
  children: ReactNode
  fallback?: ReactNode 
}) {
  const isMounted = useIsomorphicLayoutEffect()
  
  if (!isMounted) {
    return <>{fallback}</>
  }

  return <>{children}</>
}

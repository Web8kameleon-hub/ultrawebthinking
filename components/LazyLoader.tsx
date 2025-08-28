/**
 * LazyLoader - Industrial Component Loading System
 * @author Ledjan Ahmati
 * @version 8.0.0-WEB8-INDUSTRIAL
 */

'use client'

import { lazy, Suspense } from 'react'
import { ComponentProps } from 'react'

// Industrial Engineering Components
const IndustrialWorkingSystem = lazy(() => import('./IndustrialWorkingSystem'))
const AGISheet = lazy(() => import('./AGISheet'))
const NetworkMonitor = lazy(() => import('./NetworkMonitor'))
const LoRaMeshNetwork = lazy(() => import('./LoRaMeshNetwork'))
const SecurityDashboard = lazy(() => import('./SecurityDashboard'))
const AttackSimulationDashboard = lazy(() => import('./AttackSimulationDashboard'))

// Loading Component
const LoadingComponent = ({ name }: { name: string }) => (
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '400px',
    background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
    borderRadius: '16px',
    border: '1px solid #e2e8f0'
  }}>
    <div style={{ fontSize: '32px', marginBottom: '16px' }}>⚙️</div>
    <div style={{
      fontSize: '18px',
      fontWeight: 600,
      color: '#1e40af',
      marginBottom: '8px'
    }}>
      Loading {name}...
    </div>
    <div style={{
      width: '120px',
      height: '3px',
      background: '#e2e8f0',
      borderRadius: '2px',
      overflow: 'hidden',
      position: 'relative'
    }}>
      <div style={{
        width: '100%',
        height: '100%',
        background: 'linear-gradient(90deg, #1e40af, #7c3aed)',
        position: 'absolute',
        animation: 'loadingSlide 1.5s infinite linear'
      }} />
    </div>
  </div>
)

interface LazyLoaderProps {
  component: string
  variant?: 'default' | 'industrial' | 'minimal'
  priority?: 'low' | 'normal' | 'high' | 'critical'
  preload?: boolean
  [key: string]: any
}

export const LazyLoader: React.FC<LazyLoaderProps> = ({ 
  component, 
  variant = 'default',
  priority = 'normal',
  preload = false,
  ...props 
}) => {
  const getComponent = () => {
    switch (component) {
      case 'IndustrialWorkingSystem':
        return IndustrialWorkingSystem
      case 'AGISheet':
        return AGISheet
      case 'NetworkMonitor':
        return NetworkMonitor
      case 'LoRaMeshNetwork':
        return LoRaMeshNetwork
      case 'SecurityDashboard':
        return SecurityDashboard
      case 'AttackSimulationDashboard':
        return AttackSimulationDashboard
      default:
        return () => <div>Component not found: {component}</div>
    }
  }

  const Component = getComponent()

  return (
    <Suspense fallback={<LoadingComponent name={component} />}>
      <Component {...props} />
    </Suspense>
  )
}

// Export individual components for direct import
export { IndustrialWorkingSystem, AGISheet, NetworkMonitor, LoRaMeshNetwork, SecurityDashboard, AttackSimulationDashboard }

export default LazyLoader

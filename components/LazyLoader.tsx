/**
 * LazyLoader - Ultra Industrial Component Loading System
 * @author Ledjan Ahmati (100% Creator & Owner)
 * @version 8.0.0-WEB8-INDUSTRIAL
 * @contact dealsjona@gmail.com
 */

'use client'

import { lazy, Suspense } from 'react'
import { cva } from 'class-variance-authority'

// Industrial Loading Variants
const loadingVariants = cva('flex flex-col items-center justify-center min-h-[400px] rounded-2xl border transition-all duration-300', {
  variants: {
    variant: {
      default: 'bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200',
      industrial: 'bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-200',
      minimal: 'bg-white border-gray-100',
      neural: 'bg-gradient-to-br from-purple-50 to-pink-100 border-purple-200'
    }
  },
  defaultVariants: {
    variant: 'default'
  }
})

// Industrial Engineering Components Registry
const COMPONENT_REGISTRY = {
  IndustrialWorkingSystem: lazy(() => import('./IndustrialWorkingSystem')),
  AGISheet: lazy(() => import('./AGISheet')),
  NetworkMonitor: lazy(() => import('./NetworkMonitor')),
  LoRaMeshNetwork: lazy(() => import('./LoRaMeshNetwork')),
  SecurityDashboard: lazy(() => import('./SecurityDashboard')),
  AttackSimulationDashboard: lazy(() => import('./AttackSimulationDashboard')),
  NeuralDashboard: lazy(() => import('./NeuralDashboard')),
  AGIMainController: lazy(() => import('./AGIMainController')),
  Web8TabSystem: lazy(() => import('./Web8TabSystem')),
  OpenMindChat: lazy(() => import('./OpenMindChat')),
  SpaceCommunicationDashboard: lazy(() => import('./SpaceCommunicationDashboard'))
} as const

type ComponentName = keyof typeof COMPONENT_REGISTRY

// Industrial Loading Component
const IndustrialLoadingComponent = ({
  name,
  variant = 'default'
}: {
  name: string
  variant?: 'default' | 'industrial' | 'minimal' | 'neural'
}) => (
  <div className={loadingVariants({ variant })}>
    <div className="text-4xl mb-4 animate-pulse">⚙️</div>
    <div className="text-lg font-semibold text-blue-600 mb-2">
      Loading {name}...
    </div>
    <div className="w-32 h-1 bg-gray-200 rounded-full overflow-hidden">
      <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-500 animate-pulse" />
    </div>
    <div className="text-xs text-gray-500 mt-2">EuroWeb Industrial System</div>
  </div>
)

interface LazyLoaderProps {
  component: ComponentName
  variant?: 'default' | 'industrial' | 'minimal' | 'neural'
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
  const Component = COMPONENT_REGISTRY[component]

  if (!Component) {
    return (
      <div className="flex items-center justify-center p-8 bg-red-50 border border-red-200 rounded-lg">
        <div className="text-red-600">Component not found: {component}</div>
      </div>
    )
  }

  return (
    <Suspense fallback={<IndustrialLoadingComponent name={component} variant={variant} />}>
      <Component {...props} />
    </Suspense>
  )
}

// Ultra Components Namespace for Web8 System
export namespace UltraComponents {
  export const registerWeb8Components = () => {
    console.log('🏭 EuroWeb Industrial Components Registered:', Object.keys(COMPONENT_REGISTRY))
    return COMPONENT_REGISTRY
  }

  export const getAvailableComponents = (): ComponentName[] => {
    return Object.keys(COMPONENT_REGISTRY) as ComponentName[]
  }

  export const preloadComponent = async (name: ComponentName) => {
    try {
      await COMPONENT_REGISTRY[name]
      console.log(`✅ Preloaded: ${name}`)
    } catch (error) {
      console.error(`❌ Failed to preload ${name}:`, error)
    }
  }

  export const preloadCriticalComponents = async () => {
    const criticalComponents: ComponentName[] = ['AGISheet', 'NeuralDashboard', 'AGIMainController']

    await Promise.all(
      criticalComponents.map(component => preloadComponent(component))
    )

    console.log('🚀 Critical components preloaded')
  }
}

export default LazyLoader

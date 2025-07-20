/**
 * EuroWeb Ultra Lazy Loading Usage Examples
 * Industrial-Grade Component Loading Demonstrations
 * 
 * @author Ledjan Ahmati (100% Owner)
 * @contact dealsjona@gmail.com
 * @version 8.0.0 Ultra
 * @license MIT
 */

import React from 'react'
import { 
  LazyLoader, 
  registerLazyComponent,
  preloadComponent,
  AGISheetLazy,
  AGIxEcoLazy,
  AGIxBioNatureLazy,
  Web8TabSystemLazy,
  IndustrialFallback
} from '@/components/LazyLoader'

// Example 1: Basic Lazy Loading
export const BasicLazyExample = () => {
  return (
    <div>
      <h2>Basic Lazy Loading</h2>
      <LazyLoader 
        component="AGISheet"
        variant="default"
        priority="normal"
      />
    </div>
  )
}

// Example 2: Viewport-based Loading
export const ViewportLazyExample = () => {
  return (
    <div style={{ height: '200vh' }}>
      <h2>Scroll down to load component</h2>
      <div style={{ marginTop: '100vh' }}>
        <LazyLoader 
          component="AGIxEco"
          variant="neural"
          priority="low"
          viewport={true}
          fallback={<IndustrialFallback message="Loading AGI Eco Engine..." variant="neural" />}
        />
      </div>
    </div>
  )
}

// Example 3: High Priority Preloading
export const PreloadExample = () => {
  React.useEffect(() => {
    // Preload critical components
    preloadComponent('Web8TabSystem')
    preloadComponent('AGISheet')
  }, [])

  return (
    <div>
      <h2>Preloaded Components</h2>
      <LazyLoader 
        component="Web8TabSystem"
        variant="industrial"
        priority="critical"
        preload={true}
      />
    </div>
  )
}

// Example 4: Custom Component Registration
const CustomAGIEngine = registerLazyComponent({
  name: 'CustomAGIEngine',
  loader: async () => {
    // Simulate heavy computation/loading
    await new Promise(resolve => setTimeout(resolve, 2000))
    return {
      default: () => (
        <div style={{ padding: '20px', background: '#1a1a2e', color: '#fff' }}>
          <h3>Custom AGI Engine Loaded!</h3>
          <p>This component was lazy loaded with custom configuration.</p>
        </div>
      )
    }
  },
  priority: 'high',
  chunk: 'custom-agi'
})

export const CustomLazyExample = () => {
  return (
    <div>
      <h2>Custom Lazy Component</h2>
      <LazyLoader 
        component="CustomAGIEngine"
        variant="quantum"
        priority="high"
        fallback={<IndustrialFallback message="Loading Custom AGI..." variant="quantum" />}
      />
    </div>
  )
}

// Example 5: Industrial Tab System with Lazy Engines
export const IndustrialTabExample = () => {
  const [activeTab, setActiveTab] = React.useState('sheet')

  const tabs = [
    { id: 'sheet', name: 'AGI Sheet', component: 'AGISheet', priority: 'critical' },
    { id: 'eco', name: 'AGI Eco', component: 'AGIxEco', priority: 'normal' },
    { id: 'bio', name: 'AGI Bio', component: 'AGIxBioNature', priority: 'normal' }
  ]

  return (
    <div style={{ width: '100%', height: '600px' }}>
      <div style={{ display: 'flex', borderBottom: '2px solid #333', marginBottom: '20px' }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '10px 20px',
              background: activeTab === tab.id ? '#0066cc' : '#333',
              color: '#fff',
              border: 'none',
              cursor: 'pointer',
              borderRadius: '4px 4px 0 0',
              marginRight: '5px'
            }}
          >
            {tab.name}
          </button>
        ))}
      </div>

      <div style={{ height: '500px' }}>
        {tabs.map(tab => (
          <div 
            key={tab.id}
            style={{ 
              display: activeTab === tab.id ? 'block' : 'none',
              height: '100%'
            }}
          >
            <LazyLoader 
              component={tab.component}
              variant="industrial"
              priority={tab.priority as any}
              fallback={
                <IndustrialFallback 
                  message={`Loading ${tab.name}...`} 
                  variant="industrial" 
                />
              }
            />
          </div>
        ))}
      </div>
    </div>
  )
}

// Example 6: Performance Monitoring
export const PerformanceLazyExample = () => {
  const [loadTimes, setLoadTimes] = React.useState<Record<string, number>>({})

  const handleLoad = (componentName: string) => {
    const loadTime = performance.now()
    setLoadTimes(prev => ({ ...prev, [componentName]: loadTime }))
    console.log(`${componentName} loaded in ${loadTime}ms`)
  }

  return (
    <div>
      <h2>Performance Monitoring</h2>
      <div style={{ marginBottom: '20px' }}>
        {Object.entries(loadTimes).map(([component, time]) => (
          <div key={component} style={{ color: '#666' }}>
            {component}: {time.toFixed(2)}ms
          </div>
        ))}
      </div>

      <LazyLoader 
        component="AGISheet"
        variant="neural"
        priority="high"
        onLoad={() => handleLoad('AGISheet')}
      />
    </div>
  )
}

// Example 7: Error Handling
export const ErrorHandlingExample = () => {
  const [error, setError] = React.useState<string | null>(null)

  const handleError = (error: Error) => {
    setError(error.message)
    console.error('Lazy loading error:', error)
  }

  return (
    <div>
      <h2>Error Handling</h2>
      {error && (
        <div style={{ color: 'red', marginBottom: '20px' }}>
          Error: {error}
        </div>
      )}

      <LazyLoader 
        component="NonExistentComponent"
        variant="default"
        priority="normal"
        onError={handleError}
        fallback={<div>Loading or error...</div>}
      />
    </div>
  )
}

// Complete Demo App
export const LazyLoadingDemo = () => {
  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>EuroWeb Ultra Lazy Loading System Demo</h1>
      
      <div style={{ display: 'grid', gap: '40px', marginTop: '30px' }}>
        <BasicLazyExample />
        <ViewportLazyExample />
        <PreloadExample />
        <CustomLazyExample />
        <IndustrialTabExample />
        <PerformanceLazyExample />
        <ErrorHandlingExample />
      </div>
    </div>
  )
}

export default LazyLoadingDemo

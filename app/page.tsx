/**
 * EuroWeb Web8 Platform - Main Page
 * Pure TypeScript AGI-Ready Industrial Architecture
 * 
 * @author Ledjan Ahmati (100% Owner)
 * @contact dealsjona@gmail.com
 * @version 8.0.0 Industrial
 * @license MIT
 */

import React from 'react'
import Web8ClientWrapper from '../components/Web8ClientWrapper'

/**
 * Main page component for EuroWeb Web8 Platform
 * Renders the complete AGI-powered browser interface with proper hydration
 */
export default function HomePage(): React.ReactElement {
  return (
    <main className={{
      minHeight: '100vh',
      width: '100%',
      background: 'linear-gradient(135deg, #0f1419 0%, #1a1d29 25%, #2d2a45 50%, #1e2a4a 75%, #243447 100%)',
      color: '#f8fafc',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      overflow: 'hidden'
    }}>
      <Web8ClientWrapper />
    </main>
  )
}

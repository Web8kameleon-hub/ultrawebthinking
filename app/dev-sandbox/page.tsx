/**
 * Development Sandbox Route
 * @author Ledjan Ahmati
 */

import React from 'react'
import LazyPageWrapper from '@/components/LazyPageWrapper'
import { LazyLoader } from '@/components/LazyLoader'

export default function DevSandboxPage() {
  return (
    <LazyPageWrapper 
      title="🛠️ Development Sandbox"
      description="Industrial Development Environment & Testing Playground"
      gradient="from-orange-600 to-red-600"
    >
      <LazyLoader 
        component="IndustrialWorkingSystem"
        variant="industrial"
        priority="high"
        preload={true}
      />
    </LazyPageWrapper>
  )
}

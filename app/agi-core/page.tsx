/**
 * AGI Core Dashboard Route
 * @author Ledjan Ahmati
 */

import React from 'react'
import LazyPageWrapper from '@/components/LazyPageWrapper'
import { LazyLoader } from '@/components/LazyLoader'

export default function AGICorePage() {
  return (
    <LazyPageWrapper 
      title="AGI Core Engine"
      description="Advanced General Intelligence Processing Core"
      gradient="from-purple-600 to-blue-600"
    >
      <LazyLoader 
        component="AGISheet"
        variant="industrial"
        priority="critical"
        preload={true}
      />
    </LazyPageWrapper>
  )
}

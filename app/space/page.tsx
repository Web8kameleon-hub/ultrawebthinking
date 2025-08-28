/**
 * Space Systems Route (Alias for Space-Comm)
 * @author Ledjan Ahmati
 */

import React from 'react'
import LazyPageWrapper from '@/components/LazyPageWrapper'
import { LazyLoader } from '@/components/LazyLoader'

export default function SpacePage() {
  return (
    <LazyPageWrapper 
      title="🚀 Space Systems Control"
      description="Satellite Networks • Ionospheric Monitoring • Deep Space Communication"
      gradient="from-indigo-600 via-purple-600 to-blue-600"
    >
      <LazyLoader 
        component="SpaceCommunicationDashboard"
        variant="industrial"
        priority="critical"
        preload={true}
      />
    </LazyPageWrapper>
  )
}

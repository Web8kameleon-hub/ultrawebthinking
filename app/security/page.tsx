/**
 * Security Dashboard Route
 * @author Ledjan Ahmati
 */

import React from 'react'
import LazyPageWrapper from '@/components/LazyPageWrapper'
import { LazyLoader } from '@/components/LazyLoader'

export default function SecurityPage() {
  return (
    <LazyPageWrapper 
      title="🛡️ Security Command Center"
      description="Guardian Engine • DDoS Protection • Intrusion Response • Advanced Defense"
      gradient="from-red-600 to-orange-600"
    >
      <LazyLoader 
        component="SecurityDashboard"
        variant="industrial"
        priority="critical"
        preload={true}
      />
    </LazyPageWrapper>
  )
}

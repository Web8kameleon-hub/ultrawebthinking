/**
 * @author Ledjan Ahmati
 * @version 8.0.0-WEB8
 * @contact dealsjona@gmail.com
 */

'use client';

import React from 'react';
import LazyPageWrapper from '../../components/LazyPageWrapper';
import SensorDashboard from '../../components/SensorDashboard';

export default function SensorDashboardPage() {
  return (
    <LazyPageWrapper
      title="Sensor Dashboard"
      description="Real-time environmental monitoring and analytics"
      gradient="from-amber-600 to-orange-600"
    >
      <SensorDashboard />
    </LazyPageWrapper>
  );
}

/**
 * @author Ledjan Ahmati
 * @version 8.0.0-WEB8
 * @contact dealsjona@gmail.com
 */

'use client';

import React from 'react';
import LazyPageWrapper from '../../components/LazyPageWrapper';
import NetworkMonitor from '../../components/NetworkMonitor';

export default function NetworkMonitorPage() {
  return (
    <LazyPageWrapper
      title="Network Monitor"
      description="Real-time network topology and performance monitoring"
      gradient="from-purple-600 to-pink-600"
    >
      <NetworkMonitor />
    </LazyPageWrapper>
  );
}

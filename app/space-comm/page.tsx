/**
 * Space Communication Gateway Page
 * @author Ledjan Ahmati
 * @version 8.1.0-SPACE
 */

'use client';

import React from 'react';
import LazyPageWrapper from '../../components/LazyPageWrapper';
import SpaceCommunicationDashboard from '../../components/SpaceCommunicationDashboard';

export default function SpaceCommPage() {
  return (
    <LazyPageWrapper
      title="🌌 Space Communication Gateway"
      description="Ionospheric monitoring and satellite communication control"
      gradient="from-indigo-600 via-purple-600 to-blue-600"
    >
      <SpaceCommunicationDashboard />
    </LazyPageWrapper>
  );
}

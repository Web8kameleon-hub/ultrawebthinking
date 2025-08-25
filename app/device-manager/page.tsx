/**
 * @author Ledjan Ahmati
 * @version 8.0.0-WEB8
 * @contact dealsjona@gmail.com
 */

'use client';

import React from 'react';
import LazyPageWrapper from '../../components/LazyPageWrapper';
import DeviceManager from '../../components/DeviceManager';

export default function DeviceManagerPage() {
  return (
    <LazyPageWrapper
      title="Device Manager"
      description="Comprehensive device management and monitoring"
      gradient="from-emerald-600 to-teal-600"
    >
      <DeviceManager />
    </LazyPageWrapper>
  );
}

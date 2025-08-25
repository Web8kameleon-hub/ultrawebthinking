/**
 * @author Ledjan Ahmati
 * @version 8.0.0-WEB8
 * @contact dealsjona@gmail.com
 */

'use client';

import React from 'react';
import LazyPageWrapper from '../../components/LazyPageWrapper';
import IoTControlCenter from '../../components/IoTControlCenter';

export default function IoTControlPage() {
  return (
    <LazyPageWrapper
      title="IoT Control Center"
      description="Manage and monitor all connected IoT devices"
      gradient="from-blue-600 to-indigo-600"
    >
      <IoTControlCenter />
    </LazyPageWrapper>
  );
}

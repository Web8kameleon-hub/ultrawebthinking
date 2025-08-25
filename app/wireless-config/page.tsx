/**
 * @author Ledjan Ahmati
 * @version 8.0.0-WEB8
 * @contact dealsjona@gmail.com
 */

'use client';

import React from 'react';
import LazyPageWrapper from '../../components/LazyPageWrapper';
import WirelessConfiguration from '../../components/WirelessConfiguration';

export default function WirelessConfigPage() {
  return (
    <LazyPageWrapper
      title="Wireless Configuration"
      description="Configure and manage wireless network settings"
      gradient="from-sky-600 to-blue-600"
    >
      <WirelessConfiguration />
    </LazyPageWrapper>
  );
}

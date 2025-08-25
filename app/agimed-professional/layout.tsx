import * as React from 'react';
/**
 * AGI×Med Professional Portal Layout
 * Medical Professional Access Control
 */

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AGI×Med - Professional Medical Portal | UltraWeb',
  description: 'Controlled professional entry for licensed medical professionals, clinics and certified laboratories. HIPAA compliant medical AI systems.',
  keywords: 'AGI×Med, medical AI, professional portal, HIPAA, medical professionals, clinical diagnostics, medical research',
  robots: 'noindex, nofollow', // Restricted access page
};

export default function AGIMedProfessionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      {children}
    </div>
  );
}

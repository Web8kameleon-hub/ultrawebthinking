"use client";

import { AGIBioDemo } from '../../components/AGISheet/AGIBioDemo';
import type { ReactElement } from 'react';

// Named function for better debugging and consistency
const AGIBioDemoPage = (): ReactElement => {
  return <AGIBioDemo />;
};

// Next.js requires default export for pages
export default AGIBioDemoPage;

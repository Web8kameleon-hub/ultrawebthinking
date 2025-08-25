/**
 * Web8 Production Roadmap Layout & Metadata
 * @author Ledjan Ahmati
 * @version 8.0.0-WEB8
 * @contact dealsjona@gmail.com
 */

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Web8 Industrial Production Roadmap | UltraWeb Thinking',
  description: 'Comprehensive plan for transitioning Web8 AGI platform to full production environment with industrial-grade infrastructure.',
  keywords: ['Web8', 'Production Roadmap', 'Industrial AGI', 'Infrastructure', 'TypeScript', 'Neural Processing'],
  authors: [{ name: 'Ledjan Ahmati', url: 'mailto:dealsjona@gmail.com' }],
  creator: 'Ledjan Ahmati',
  publisher: 'UltraWeb Thinking',
  robots: 'index, follow',
  openGraph: {
    title: 'Web8 Industrial Production Roadmap',
    description: 'Comprehensive plan for transitioning Web8 AGI platform to full production environment',
    type: 'website',
    locale: 'en_US',
    siteName: 'UltraWeb Thinking Platform',
    images: [
      {
        url: '/api/og-image?title=Web8%20Production%20Roadmap',
        width: 1200,
        height: 630,
        alt: 'Web8 Industrial Production Roadmap'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Web8 Industrial Production Roadmap',
    description: 'Comprehensive plan for transitioning Web8 AGI platform to full production environment',
    creator: '@UltraWebThinking'
  },
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#8B5CF6'
};

export default function ProductionRoadmapLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="production-roadmap-layout">
      {children}
    </div>
  );
}

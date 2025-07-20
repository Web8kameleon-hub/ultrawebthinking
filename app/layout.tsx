/**
 * EuroWeb - Root Layout
 * Vanilla CSS + Motion + CVA Architecture
 */

import type { Metadata } from 'next'
import '../styles/theme-vars.css'
import '../app/globals.css'

export const metadata: Metadata = {
  title: 'EuroWeb Platform',
  description: 'Pure TypeScript Industrial Web8 Platform - Vanilla CSS + Motion + CVA',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  )
}

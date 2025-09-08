import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'EuroWeb Ultra Industrial Platform',
  description: 'Industrial IoT & Automation Control System',
  keywords: 'industrial, IoT, automation, sensors, control, monitoring',
}

export default function IndustrialLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="industrial-layout">
      {children}
    </div>
  )
}

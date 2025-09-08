import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'EuroWeb Ultra Aviation Platform',
  description: 'Radio Propagation Intelligence & Aviation Weather System',
  keywords: 'aviation, radio propagation, weather, LoRa, mesh network, GPS',
}

export default function AviationLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="aviation-layout">
      {children}
    </div>
  )
}

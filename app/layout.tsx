import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'EuroWeb Ultra Platform - Universal AI Gateway',
  description: 'Platforma më e avancuar e AI me arkitekturë industriale dhe mbështetje shumëgjuhëshe.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning={true} className="theme-euroweb">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="theme-euroweb font-sans" suppressHydrationWarning={true}>
        {children}
      </body>
    </html>
  )
}


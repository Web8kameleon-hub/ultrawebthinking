/**
 * EuroWeb - Root Layout - Hydration Safe
 * React 19.1.1 + Next.js 15.5.2 Compatible
 * Prevents SSR/Client mismatches
 */

import type { Metadata } from 'next'
import '../frontend/src/styles/theme-vars.css'
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
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#1e3c72" />
      </head>
      <body suppressHydrationWarning>
        <div id="root" suppressHydrationWarning>
          {children}
        </div>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Prevent hydration mismatches from browser extensions
              if (typeof window !== 'undefined') {
                // Remove any dynamic attributes added by extensions
                const observer = new MutationObserver((mutations) => {
                  mutations.forEach((mutation) => {
                    if (mutation.type === 'attributes' && mutation.target === document.body) {
                      // Remove problematic attributes that cause hydration errors
                      const problemAttributes = ['data-gptw', 'data-extension', 'data-grammarly'];
                      problemAttributes.forEach(attr => {
                        if (document.body.hasAttribute(attr)) {
                          document.body.removeAttribute(attr);
                        }
                      });
                    }
                  });
                });
                observer.observe(document.body, { attributes: true });
              }
            `,
          }}
        />
      </body>
    </html>
  )
}

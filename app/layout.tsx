import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'EuroWeb Platform - AGI-Powered Web8 Browser',
  description:
    'Platforma Inteligjente për Web8 me AGISheet Kameleon dhe arkitekturë industriale',
  keywords: [
    'EuroWeb',
    'Web8',
    'AGI',
    'AGISheet',
    'Kameleon',
    'Intelligence',
    'Browser',
    'TypeScript',
  ].join(', '),
  authors: [
    {
      name: 'Web8kameleon Team',
      url: 'https://github.com/Web8kameleon-hub',
    },
  ],
  creator: 'Web8kameleon Team',
  publisher: 'EuroWeb Platform',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: 'website',
    locale: 'sq_AL',
    url: 'https://euroweb-platform.vercel.app',
    title: 'EuroWeb Platform',
    description: 'Shfletuesi më i avancuar në botë me AGI të integruar',
    siteName: 'EuroWeb Platform',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EuroWeb Platform',
    description: 'AGI-Powered Web8 Browser',
    creator: '@Web8kameleon',
  },
};

const RootLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <html lang="sq" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <meta name="theme-color" content="#d4af37" />
        <meta name="msapplication-TileColor" content="#d4af37" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body suppressHydrationWarning>
        <div id="euroweb-root">{children}</div>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              console.log('%c🚀 EuroWeb Platform Loading...', 'color: #d4af37; font-size: 16px; font-weight: bold;');
              console.log('%c🧠 AGI Core Initializing...', 'color: #22c55e; font-size: 14px;');
              console.log('%c📋 AGISheet Kameleon Ready', 'color: #3b82f6; font-size: 14px;');
            `,
          }}
        />
      </body>
    </html>
  );
};

export { RootLayout };
export default RootLayout;

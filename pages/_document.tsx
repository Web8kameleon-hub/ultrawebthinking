import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Font Poppins */}
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        {/* Meta Tags for Browser */}
        <meta name="description" content="UltraBrowser - AGI-powered web browser with neural network capabilities" />
        <meta charSet="UTF-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="theme-color" content="#6366f1" />
        <meta name="application-name" content="UltraBrowser" />
        <meta name="apple-mobile-web-app-title" content="UltraBrowser" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="mobile-web-app-capable" content="yes" />
        
        {/* Browser Manifest */}
        <link rel="manifest" href="/manifest.json" />
        
        {/* Favicon - Browser style */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="shortcut icon" href="/favicon.ico" />
        
        {/* Browser-specific styling */}
        <style dangerouslySetInnerHTML={{
          __html: `
            * { box-sizing: border-box; }
            html, body { 
              margin: 0; 
              padding: 0; 
              height: 100vh; 
              overflow: hidden;
              font-family: 'Poppins', -apple-system, BlinkMacSystemFont, sans-serif;
            }
            #__next { 
              height: 100vh; 
              display: flex; 
              flex-direction: column; 
            }
          `
        }} />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
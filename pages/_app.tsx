import Head from "next/head";
import type { AppProps } from "next/app";
// import "../styles/globals.css"; // Temporarily commented out

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        {/* Browser Meta Tags */}
        <title>UltraBrowser - AGI Web Browser</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no" />
        <meta charSet="UTF-8" />
        <meta name="description" content="UltraBrowser - Advanced AGI-powered web browser with neural network capabilities" />
        <meta name="keywords" content="UltraBrowser, AGI, Neural Network, Web Browser, AI, Machine Learning" />
        <meta name="author" content="UltraBrowser Team" />
        <meta name="robots" content="index, follow" />
        
        {/* Browser specific settings */}
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}


import Head from "next/head";
import type { AppProps } from "next/app";
import "../styled-system/styles.css"; // Ensure this path is correct

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        {/* Meta Tags for SEO and Optimization */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charSet="UTF-8" />
        <meta name="description" content="Ultrawebthinking - Your next-level web experience starts here." />
        <meta name="keywords" content="Ultrawebthinking, Next.js, React, Web Development" />
        <meta name="author" content="Ultrawebthinking Team" />
        <link rel="icon" href="/favicon.ico" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <Component {...pageProps} />
    </>
  );
}


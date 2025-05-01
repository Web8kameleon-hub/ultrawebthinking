// pages/_app.tsx
import "../styles/globals.css"; // ose "@pandacss/dev" nëse po përdor Panda
import type { AppProps } from "next/app";

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;

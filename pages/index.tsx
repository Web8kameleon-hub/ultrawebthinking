// pages/index.tsx
import React from "react";
import Head from "next/head";

import Hero from "../components/Hero";
import Features from "../components/Features";
import Explore from "../components/Explore";
import Contact from "../components/Contact";
import BrowserLayout from "../components/BrowserLayout";

export default function Home() {
  return (
    <>
      <Head>
        <title>Ultrawebthinking</title>
        <meta
          name="description"
          content="Shfletuesi më inteligjent dhe elegant për eksplorim, navigim dhe mendim të përbashkët në Web8."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <BrowserLayout>
        <Hero />
        <Features />
        <Explore />
        <Contact />
      </BrowserLayout>
    </>
  );
}


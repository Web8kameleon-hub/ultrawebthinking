'use client';
import React from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import Hero from '../components/Hero';

export default function Home() {
  return (
    <>
      <Head>
        <title>Ultrawebthinking</title>
        <meta name="description" content="Beyond imagination. Built with purpose. Driven by intelligence." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main className="min-h-screen bg-black text-white">
        <Hero />
      </main>
    </>
  );
}


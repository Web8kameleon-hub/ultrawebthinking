import React from 'react';
import Head from "next/head";
import Web8TabSystem from '../components/Web8TabSystem';

export default function HomePage() {
  return (
    <>
      <Head>
        <title>Web8 AGI - Advanced Tab System</title>
        <meta name="description" content="Web8 AGI Tab System - Search Machine, AGI Status, AI Analysis, World Surfing, GISheet & Live Activity Feed" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <Web8TabSystem />
    </>
  );
}
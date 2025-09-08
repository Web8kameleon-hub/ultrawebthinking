#!/usr/bin/env tsx
/**
 * EuroWeb OpenMind Setup Script
 * Konfigurimi i plotë për të gjitha AI providers
 */

import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import colors from 'colors';

function setupOpenMind(): void {
  console.log(colors.cyan('\n🧠 EuroWeb OpenMind AI Setup\n'));
  console.log(colors.yellow('Konfigurimi i AI providers...'));

  // Create openmind page
  const pagesDir = join(process.cwd(), 'pages');
  if (!existsSync(pagesDir)) {
    mkdirSync(pagesDir, { recursive: true });
  }

  const openmindPageContent = `'use client'

import dynamic from 'next/dynamic'
import { Suspense } from 'react'

const OpenMindChat = dynamic(() => import('../components/OpenMindChat'), {
  ssr: false,
  loading: () => (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      background: '#1a1d29',
      color: '#d4af37'
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: '50px',
          height: '50px',
          border: '3px solid #d4af37',
          borderTop: '3px solid transparent',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 20px'
        }} />
        <h2>🧠 Loading OpenMind AI...</h2>
        <p>Initializing all AI providers...</p>
      </div>
    </div>
  )
})

export default function OpenMindPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OpenMindChat />
    </Suspense>
  )
}
`;

  const openmindPagePath = join(pagesDir, 'openmind.tsx');
  writeFileSync(openmindPagePath, openmindPageContent);
  console.log(colors.green('✅ Created pages/openmind.tsx'));

  // Create app route version too
  const appDir = join(process.cwd(), 'app');
  const openmindAppDir = join(appDir, 'openmind');
  
  if (!existsSync(openmindAppDir)) {
    mkdirSync(openmindAppDir, { recursive: true });
  }

  const appPageContent = `'use client'

import { OpenMindChat } from '../../components/OpenMindChat'

export default function OpenMindPage() {
  return <OpenMindChat />
}
`;

  const appPagePath = join(openmindAppDir, 'page.tsx');
  writeFileSync(appPagePath, appPageContent);
  console.log(colors.green('✅ Created app/openmind/page.tsx'));

  // Show available AI providers
  console.log(colors.cyan('\n🤖 Available AI Providers:'));
  const providers = [
    '🧠 OpenMind AI - https://openmind.ai',
    '🤖 Anthropic Claude - https://claude.ai', 
    '👨‍💻 GitHub Copilot - https://github.com/features/copilot',
    '🔍 DeepSeek AI - https://deepseek.com',
    '✨ OpenAI GPT - https://openai.com',
    '🦙 LlamaGPT - https://llama.ai',
    '💎 Google Gemini - https://gemini.google.com',
    '🔎 Perplexity AI - https://perplexity.ai'
  ];

  providers.forEach(provider => {
    console.log(colors.white('  ' + provider));
  });

  console.log(colors.green('\n✅ OpenMind AI setup completed!'));
  console.log(colors.blue('\n🚀 Next steps:'));
  console.log(colors.cyan('1. yarn dev'));
  console.log(colors.cyan('2. Visit: http://localhost:3000/openmind'));
  console.log(colors.cyan('3. Chat with any AI provider!'));
  
  console.log(colors.yellow('\n💡 Available commands:'));
  console.log(colors.white('  yarn ai:chat    - Start AI chat interface'));
  console.log(colors.white('  yarn openmind   - Run this setup again'));
}

// Run setup
setupOpenMind();

export { setupOpenMind }

#!/usr/bin/env tsx
/**
 * EuroWeb OpenMind Setup Script
 * Konfigurimi i plotë për të gjitha AI providers
 */

import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import chalk from 'chalk';

function setupOpenMind(): void {
  console.log(chalk.cyan('\n🧠 EuroWeb OpenMind AI Setup\n'));
  console.log(chalk.yellow('Konfigurimi i AI providers...'));

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
  console.log(chalk.green('✅ Created pages/openmind.tsx'));

  // Create app route version too
  const appDir = join(process.cwd(), 'app');
  const openmindAppDir = join(appDir, 'openmind');
  
  if (!existsSync(openmindAppDir)) {
    mkdirSync(openmindAppDir, { recursive: true });
  }

  const appPageContent = `'use client'

import OpenMindChat from '../../components/OpenMindChat'

export default function OpenMindPage() {
  return <OpenMindChat />
}
`;

  const appPagePath = join(openmindAppDir, 'page.tsx');
  writeFileSync(appPagePath, appPageContent);
  console.log(chalk.green('✅ Created app/openmind/page.tsx'));

  // Show available AI providers
  console.log(chalk.cyan('\n🤖 Available AI Providers:'));
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
    console.log(chalk.white('  ' + provider));
  });

  console.log(chalk.green('\n✅ OpenMind AI setup completed!'));
  console.log(chalk.blue('\n🚀 Next steps:'));
  console.log(chalk.cyan('1. yarn dev'));
  console.log(chalk.cyan('2. Visit: http://localhost:3000/openmind'));
  console.log(chalk.cyan('3. Chat with any AI provider!'));
  
  console.log(chalk.yellow('\n💡 Available commands:'));
  console.log(chalk.white('  yarn ai:chat    - Start AI chat interface'));
  console.log(chalk.white('  yarn openmind   - Run this setup again'));
}

// Run setup
setupOpenMind();

export default setupOpenMind;

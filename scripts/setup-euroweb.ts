/**
 * EuroWeb - Quick Setup Script
 * Rregullon të gjitha varësitë e nevojshme për Web8
 */

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

const MISSING_TYPES = [
  '@types/node',
  '@types/react', 
  '@types/react-dom'
];

const DEV_DEPENDENCIES = [
  'typescript',
  '',
  '@/ui',
  '@/coverage-v8',
  'jsdom'
];

function installDependencies() {
  console.log('🌍 EuroWeb Setup: Installing core dependencies...');
  
  try {
    // Install missing types
    console.log('📦 Installing TypeScript types...');
    const typesCmd = `yarn add -D ${MISSING_TYPES.join(' ')}`;
    execAsync(typesCmd);
    console.log('✅ Types installed successfully');

    // Install dev dependencies if missing
    console.log('🔧 Installing dev dependencies...');
    const devCmd = `yarn add -D ${DEV_DEPENDENCIES.join(' ')}`;
    execAsync(devCmd);
    console.log('✅ Dev dependencies installed');

    console.log('🎉 EuroWeb setup completed successfully!');
    console.log('🚀 You can now run: yarn dev');
    
  } catch (error) {
    console.error('❌ Setup failed:', error);
    process.exit(1);
  }
}

// Run setup
installDependencies();

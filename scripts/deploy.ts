#!/usr/bin/env tsx
/**
 * EuroWeb Platform - Deployment Manager
 * Handles Vercel, Docker, and domain deployment
 */

import { execSync } from 'child_process';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

// Simple console colors without dependencies
const colors = {
  blue: (text: string) => `\x1b[34m${text}\x1b[0m`,
  green: (text: string) => `\x1b[32m${text}\x1b[0m`,
  yellow: (text: string) => `\x1b[33m${text}\x1b[0m`,
  red: (text: string) => `\x1b[31m${text}\x1b[0m`,
  cyan: (text: string) => `\x1b[36m${text}\x1b[0m`,
  gray: (text: string) => `\x1b[90m${text}\x1b[0m`
};

interface DeploymentConfig {
  platform: 'vercel' | 'docker' | 'local'
  environment: 'development' | 'production' | 'staging'
  domain?: string
}

class DeploymentManager {
  private config: DeploymentConfig;

  constructor(config: DeploymentConfig) {
    this.config = config;
  }

  deploy(): void {
    console.log(colors.blue('🚀 EuroWeb Platform - Deployment Manager'));
    console.log(colors.gray('─'.repeat(50)));

    this.checkPrerequisites();
    
    switch (this.config.platform) {
      case 'vercel':
        this.deployToVercel();
        break;
      case 'docker':
        this.deployWithDocker();
        break;
      case 'local':
        this.deployLocally();
        break;
      default:
        throw new Error(`Unsupported platform: ${this.config.platform}`);
    }
  }

  private checkPrerequisites(): void {
    console.log(colors.yellow('🔍 Checking prerequisites...'));

    // Check if package.json exists
    const packageJsonPath = join(process.cwd(), 'package.json');
    if (!existsSync(packageJsonPath)) {
      throw new Error('package.json not found');
    }

    // Check if Next.js config exists
    const nextConfigPath = join(process.cwd(), 'next.config.mts');
    if (!existsSync(nextConfigPath)) {
      console.log(colors.yellow('⚠️ next.config.mts not found, using defaults'));
    }

    // Check if build directory exists
    const buildPath = join(process.cwd(), '.next');
    if (!existsSync(buildPath) && this.config.environment === 'production') {
      console.log(colors.yellow('🏗️ Build directory not found, building...'));
      this.buildApplication();
    }

    console.log(colors.green('✅ Prerequisites checked'));
  }

  private buildApplication(): void {
    console.log(colors.blue('🏗️ Building application...'));
    try {
      execSync('yarn build', { stdio: 'inherit' });
      console.log(colors.green('✅ Build completed'));
    } catch (error) {
      console.log(colors.red('❌ Build failed'));
      console.log(colors.gray('Attempting to fix server component issues...'));
      
      // Try to build without static generation
      execSync('yarn build --experimental-build-mode loose', { stdio: 'inherit' });
    }
  }

  private deployToVercel(): void {
    console.log(colors.blue('🌐 Deploying to Vercel...'));

    // Check if Vercel CLI is installed
    try {
      execSync('vercel --version', { stdio: 'pipe' });
    } catch {
      console.log(colors.yellow('📦 Installing Vercel CLI...'));
      execSync('yarn global add vercel', { stdio: 'inherit' });
    }

    // Deploy based on environment
    const deployCommand = this.config.environment === 'production' 
      ? 'vercel --prod' 
      : 'vercel';

    try {
      execSync(deployCommand, { stdio: 'inherit' });
      console.log(colors.green('✅ Vercel deployment successful!'));
      
      if (this.config.domain) {
        console.log(colors.cyan(`🔗 Domain: https://${this.config.domain}`));
      }
    } catch (error) {
      console.log(colors.red('❌ Vercel deployment failed'));
      throw error;
    }
  }

  private deployWithDocker(): void {
    console.log(colors.blue('🐳 Deploying with Docker...'));

    // Check if Docker is installed
    try {
      execSync('docker --version', { stdio: 'pipe' });
    } catch {
      throw new Error('Docker is not installed or not in PATH');
    }

    // Check if Docker is running
    try {
      execSync('docker info', { stdio: 'pipe' });
    } catch {
      throw new Error('Docker daemon is not running');
    }

    // Build Docker image
    const imageName = 'euroweb-platform';
    const tag = this.config.environment;
    
    console.log(colors.yellow(`🔨 Building Docker image: ${imageName}:${tag}`));
    execSync(`docker build -t ${imageName}:${tag} .`, { stdio: 'inherit' });

    // Run container
    const containerName = `euroweb-${tag}`;
    const port = this.config.environment === 'production' ? 80 : 3000;
    
    console.log(colors.yellow(`🚀 Starting container: ${containerName}`));
    
    // Stop existing container if running
    try {
      execSync(`docker stop ${containerName}`, { stdio: 'pipe' });
      execSync(`docker rm ${containerName}`, { stdio: 'pipe' });
    } catch {
      // Container doesn't exist, continue
    }

    // Start new container
    execSync(`docker run -d --name ${containerName} -p ${port}:3000 ${imageName}:${tag}`, { stdio: 'inherit' });
    
    console.log(colors.green('✅ Docker deployment successful!'));
    console.log(colors.cyan(`🔗 Application running at: http://localhost:${port}`));
  }

  private deployLocally(): void {
    console.log(colors.blue('💻 Deploying locally...'));

    if (this.config.environment === 'development') {
      console.log(colors.yellow('🔄 Starting development server...'));
      execSync('yarn dev', { stdio: 'inherit' });
    } else {
      console.log(colors.yellow('🏗️ Building for production...'));
      this.buildApplication();
      
      console.log(colors.yellow('🚀 Starting production server...'));
      execSync('yarn start', { stdio: 'inherit' });
    }
  }

  static showHelp(): void {
    console.log(colors.blue('EuroWeb Platform - Deployment Manager'));
    console.log(colors.gray('Usage: yarn deploy [platform] [environment]'));
    console.log('');
    console.log(colors.yellow('Platforms:'));
    console.log('  vercel    Deploy to Vercel');
    console.log('  docker    Deploy with Docker');
    console.log('  local     Deploy locally');
    console.log('');
    console.log(colors.yellow('Environments:'));
    console.log('  development');
    console.log('  staging');
    console.log('  production');
    console.log('');
    console.log(colors.yellow(':'));
    console.log('  yarn deploy vercel production');
    console.log('  yarn deploy docker development');
    console.log('  yarn deploy local staging');
  }
}

// CLI Interface
function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.includes('-h')) {
    DeploymentManager.showHelp();
    return;
  }

  const platform = args[0] as DeploymentConfig['platform'] || 'local';
  const environment = args[1] as DeploymentConfig['environment'] || 'development';
  const domain = args[2];

  const config: DeploymentConfig = {
    platform,
    environment,
    domain
  };

  try {
    const manager = new DeploymentManager(config);
    manager.deploy();
  } catch (error) {
    console.error(colors.red('❌ Deployment failed:'), error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

export default DeploymentManager;

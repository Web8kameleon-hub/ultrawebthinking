#!/usr/bin/env tsx
/**
 * EuroWeb Port Manager - Menaxhuesi i Porteve për Web8
 * Handles port conflicts and finds available ports
 * Trajton konfliktet e porteve dhe gjen porte të disponueshme
 */

import { exec, spawn } from 'child_process';
import { promisify } from 'util';
import { existsSync, unlinkSync, mkdirSync, writeFileSync, readdirSync, rmSync, readFileSync } from 'fs';
import { join } from 'path';
import chalk from 'chalk';

const execAsync = promisify(exec);

class PortManager {
  private defaultPorts = [3000, 3001, 3002, 3003, 3004, 8000, 8080, 8081];

  async findAvailablePort(preferredPort = 3000): Promise<number> {
    console.log(chalk.blue('🔍 EuroWeb Port Manager - Menaxhuesi i Porteve'));
    console.log(chalk.gray('─'.repeat(50)));

    const portsToTry = [preferredPort, ...this.defaultPorts.filter(p => p !== preferredPort)];

    for (const port of portsToTry) {
      if (await this.isPortAvailable(port)) {
        console.log(chalk.green(`✅ Porti ${port} është i disponueshëm / Port ${port} is available`));
        return port;
      } else {
        console.log(chalk.red(`❌ Porti ${port} është në përdorim / Port ${port} is in use`));
      }
    }

    // Generate random port if all defaults are taken
    const randomPort = Math.floor(Math.random() * (9999 - 3005) + 3005);
    console.log(chalk.yellow(`🎲 Duke përdorur port të rastësishëm: ${randomPort} / Using random port: ${randomPort}`));
    return randomPort;
  }

  async isPortAvailable(port: number): Promise<boolean> {
    try {
      if (process.platform === 'win32') {
        // Enhanced Windows port checking
        const { stdout } = await execAsync(`netstat -ano | findstr :${port}`, { timeout: 5000 });
        const lines = stdout.trim().split('\n').filter(line => line.includes(`:${port}`));
        return lines.length === 0;
      } else {
        const { stdout } = await execAsync(`lsof -i :${port}`, { timeout: 5000 });
        return !stdout.trim();
      }
    } catch (error) {
      // If command fails or times out, assume port is available
      return true;
    }
  }

  async killProcessOnPort(port: number): Promise<boolean> {
    try {
      console.log(chalk.yellow(`🔄 Duke liruar portin ${port}... / Attempting to free port ${port}...`));
      
      if (process.platform === 'win32') {
        // Enhanced Windows process killing
        const { stdout } = await execAsync(`netstat -ano | findstr :${port}`, { timeout: 5000 });
        const lines = stdout.trim().split('\n');
        
        const pidsToKill = new Set<string>();
        
        for (const line of lines) {
          if (line.includes(`:${port}`)) {
            const parts = line.trim().split(/\s+/);
            const pid = parts[parts.length - 1];
            
            if (pid && pid !== '0' && !isNaN(parseInt(pid))) {
              pidsToKill.add(pid);
            }
          }
        }

        if (pidsToKill.size === 0) {
          console.log(chalk.yellow(`⚠️ Asnjë proces i gjetur në portin ${port} / No process found on port ${port}`));
          return true;
        }

        for (const pid of pidsToKill) {
          try {
            await execAsync(`taskkill /F /PID ${pid}`, { timeout: 3000 });
            console.log(chalk.green(`✅ Procesi ${pid} u mbyll në portin ${port} / Killed process ${pid} on port ${port}`));
          } catch (killError) {
            console.log(chalk.yellow(`⚠️ Nuk mund të mbyllet procesi ${pid} / Could not kill process ${pid}`));
          }
        }
      } else {
        await execAsync(`lsof -ti :${port} | xargs kill -9`, { timeout: 5000 });
        console.log(chalk.green(`✅ Porti ${port} u lirua / Freed port ${port}`));
      }
      
      // Wait for port to be released
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Verify port is now available
      const isNowAvailable = await this.isPortAvailable(port);
      if (isNowAvailable) {
        console.log(chalk.green(`🎉 Porti ${port} tani është i lirë / Port ${port} is now free`));
        return true;
      } else {
        console.log(chalk.red(`❌ Porti ${port} ende është i zënë / Port ${port} is still occupied`));
        return false;
      }
      
    } catch (error) {
      console.log(chalk.red(`❌ Nuk mund të lirohet porti ${port}: ${error} / Could not free port ${port}: ${error}`));
      return false;
    }
  }

  async checkAndFixFileConflicts(): Promise<void> {
    console.log(chalk.blue('\n🔍 Duke kontrolluar konfliktet e skedarëve... / Checking file conflicts...'));
    
    const conflictingFiles = [
      { legacy: 'pages/index.tsx', modern: 'app/page.tsx', description: 'Home page conflict' },
      { legacy: 'pages/_app.tsx', modern: 'app/layout.tsx', description: 'Layout conflict' },
      { legacy: 'pages/_document.tsx', modern: 'app/layout.tsx', description: 'Document conflict' },
      { legacy: 'pages/404.tsx', modern: 'app/not-found.tsx', description: '404 page conflict' }
    ];

    let hasConflicts = false;

    for (const conflict of conflictingFiles) {
      const legacyPath = join(process.cwd(), conflict.legacy);
      const modernPath = join(process.cwd(), conflict.modern);
      
      if (existsSync(legacyPath) && existsSync(modernPath)) {
        console.log(chalk.red(`❌ Konflikt i gjetur / Conflict found: ${conflict.legacy} ↔ ${conflict.modern}`));
        hasConflicts = true;
        
        try {
          // Remove legacy file to use App Router
          unlinkSync(legacyPath);
          console.log(chalk.green(`✅ U largua skedari i vjetër / Removed legacy file: ${conflict.legacy}`));
        } catch (error) {
          console.log(chalk.red(`❌ Nuk mund të largohet / Could not remove: ${conflict.legacy}`));
        }
      } else if (existsSync(legacyPath)) {
        console.log(chalk.yellow(`⚠️ Skedar i vjetër ekziston / Legacy file exists: ${conflict.legacy}`));
      } else if (existsSync(modernPath)) {
        console.log(chalk.green(`✅ Skedar modern në përdorim / Modern file in use: ${conflict.modern}`));
      }
    }

    // Remove pages directory if empty or only contains legacy files
    const pagesDir = join(process.cwd(), 'pages');
    if (existsSync(pagesDir)) {
      try {
        const pagesFiles = readdirSync(pagesDir);
        const nonApiFiles = pagesFiles.filter((file: string) => !file.startsWith('api') && file.endsWith('.tsx'));
        
        if (nonApiFiles.length === 0) {
          console.log(chalk.yellow('🗂️ Duke larguar dosjen e zbrazët pages/ / Removing empty pages directory'));
          // Don't remove if it has API routes
          const hasApiRoutes = pagesFiles.some((file: string) => file === 'api' || file.startsWith('api'));
          if (!hasApiRoutes) {
            rmSync(pagesDir, { recursive: true, force: true });
            console.log(chalk.green('✅ Dosja pages/ u largua / pages/ directory removed'));
          }
        }
      } catch (error) {
        console.log(chalk.yellow(`⚠️ Nuk mund të kontrollohet dosja pages/ / Could not check pages directory`));
      }
    }

    // Ensure app directory exists
    const appDir = join(process.cwd(), 'app');
    if (!existsSync(appDir)) {
      console.log(chalk.yellow('📁 Duke krijuar dosjen app/ / Creating app directory'));
      mkdirSync(appDir, { recursive: true });
    }

    if (hasConflicts) {
      console.log(chalk.green('\n🎉 Konfliktet u zgjidhën! / Conflicts resolved!'));
    } else {
      console.log(chalk.green('\n✅ Asnjë konflikt i gjetur / No conflicts found'));
    }
  }

  async updateYarnCommands(): Promise<void> {
    console.log(chalk.blue('\n🔧 Updating yarn commands to English...'));
    
    const packageJsonPath = join(process.cwd(), 'package.json');
    if (!existsSync(packageJsonPath)) {
      console.log(chalk.red('❌ package.json not found'));
      return;
    }

    try {
      const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
      
      // Update Albanian commands to English equivalents
      const commandUpdates = {
        // Replace Albanian commands with English
        "zhvillo": "dev:start",
        "testo": "test:run", 
        "nderto": "build:all",
        "push-kodi": "push:code",
        "statusi": "status:check",
        
        // Add proper English commands
        "dev:start": "tsx scripts/port-manager.ts start",
        "dev:quick": "tsx scripts/port-manager.ts quick", 
        "dev:force": "tsx scripts/port-manager.ts kill 3000 && next dev --port 3000",
        "test:run": "tsx scripts/project-control.ts test",
        "build:all": "yarn build:frontend && yarn build:backend && yarn build:agisheet",
        "push:code": "tsx scripts/project-control.ts push",
        "status:check": "tsx scripts/project-control.ts status",
        "port:find": "tsx scripts/port-manager.ts find",
        "port:kill": "tsx scripts/port-manager.ts kill",
        "port:fix": "tsx scripts/port-manager.ts fix",
        "conflicts:fix": "tsx scripts/port-manager.ts fix"
      };

      let modified = false;
      for (const [oldCommand, newCommand] of Object.entries(commandUpdates)) {
        if (packageJson.scripts[oldCommand] !== newCommand) {
          packageJson.scripts[oldCommand] = newCommand;
          modified = true;
          console.log(chalk.green(`✅ Updated: ${oldCommand} -> ${newCommand}`));
        }
      }

      if (modified) {
        writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
        console.log(chalk.green('🎉 Package.json updated with English commands!'));
        
        console.log(chalk.blue('\n📋 Available English commands:'));
        console.log(chalk.yellow('  yarn dev:start     # Start development server'));
        console.log(chalk.yellow('  yarn dev:quick     # Quick development mode'));
        console.log(chalk.yellow('  yarn dev:force     # Force start on port 3000'));
        console.log(chalk.yellow('  yarn test:run      # Run tests'));
        console.log(chalk.yellow('  yarn build:all     # Build all components'));
        console.log(chalk.yellow('  yarn port:find     # Find available port'));
        console.log(chalk.yellow('  yarn port:kill     # Kill process on port'));
        console.log(chalk.yellow('  yarn conflicts:fix # Fix file conflicts'));
      } else {
        console.log(chalk.green('✅ Commands already up to date'));
      }
      
    } catch (error) {
      console.log(chalk.red(`❌ Error updating package.json: ${error}`));
    }
  }

  async killAllNodeProcesses(): Promise<void> {
    console.log(chalk.yellow('🔄 Killing all Node.js processes...'));
    
    try {
      if (process.platform === 'win32') {
        // Kill all node and next processes
        await execAsync('taskkill /F /IM node.exe', { timeout: 5000 }).catch(() => {});
        await execAsync('taskkill /F /IM next.exe', { timeout: 5000 }).catch(() => {});
        await execAsync('wmic process where "name=\'node.exe\'" delete', { timeout: 5000 }).catch(() => {});
      } else {
        await execAsync('pkill -f node', { timeout: 5000 }).catch(() => {});
        await execAsync('pkill -f next', { timeout: 5000 }).catch(() => {});
      }
      
      console.log(chalk.green('✅ Node processes cleared'));
      
      // Wait for processes to fully terminate
      await new Promise(resolve => setTimeout(resolve, 2000));
      
    } catch (error) {
      console.log(chalk.yellow('⚠️ Some processes could not be killed'));
    }
  }

  async startWithBestPort(): Promise<void> {
    console.log(chalk.blue('\n🚀 Starting EuroWeb Platform with optimal port...'));
    
    // First, check and fix file conflicts
    await this.checkAndFixFileConflicts();
    
    // Update yarn commands
    await this.updateYarnCommands();
    
    const preferredPort = 3000;
    
    // Try aggressive port cleanup if needed
    if (!(await this.isPortAvailable(preferredPort))) {
      console.log(chalk.yellow(`⚠️ Port ${preferredPort} is busy. Trying aggressive cleanup...`));
      
      // Kill all Node processes first
      await this.killAllNodeProcesses();
      
      // Then try specific port cleanup
      await this.killProcessOnPort(preferredPort);
      
      // Wait and check again
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
    
    // Check if preferred port is now available
    if (await this.isPortAvailable(preferredPort)) {
      await this.startDevelopment(preferredPort);
      return;
    }

    // If still not available, find alternative
    console.log(chalk.yellow(`🔍 Finding alternative port...`));
    const availablePort = await this.findAvailablePort(3001);
    await this.startDevelopment(availablePort);
  }

  private async startDevelopment(port: number): Promise<void> {
    console.log(chalk.green(`\n🎉 Starting EuroWeb Platform on port ${port}`));
    console.log(chalk.blue(`🌐 Local: http://localhost:${port}`));
    console.log(chalk.blue(`🔗 Network: http://169.254.70.250:${port}`));
    
    try {
      const nextProcess = spawn('npx', ['next', 'dev', '--port', port.toString()], {
        stdio: 'inherit',
        shell: true
      });

      nextProcess.on('error', (error) => {
        console.error(chalk.red('❌ Failed to start Next.js:'), error);
      });

      nextProcess.on('exit', (code) => {
        console.log(chalk.yellow(`🔄 Next.js process exited with code ${code}`));
      });

    } catch (error) {
      console.error(chalk.red('❌ Error starting development server:'), error);
    }
  }

  async startQuickDevelopment(): Promise<void> {
    console.log(chalk.blue('⚡ EuroWeb Quick Development'));
    
    // Fix conflicts first
    await this.checkAndFixFileConflicts();
    
    // Update commands
    await this.updateYarnCommands();
    
    // Try ports in order: 3001, 3002, 3003
    const quickPorts = [3001, 3002, 3003, 3004];
    
    for (const port of quickPorts) {
      if (await this.isPortAvailable(port)) {
        console.log(chalk.green(`🚀 Using quick port ${port}`));
        await this.startDevelopment(port);
        return;
      }
    }
    
    // If all quick ports are taken, find any available
    const randomPort = await this.findAvailablePort(5000);
    await this.startDevelopment(randomPort);
  }
}

// CLI handling with English commands
async function main() {
  const manager = new PortManager();
  const command = process.argv[2];

  switch (command) {
    case 'find':
      const port = await manager.findAvailablePort();
      console.log(chalk.cyan(`Available port: ${port}`));
      break;
      
    case 'kill':
      const targetPort = parseInt(process.argv[3]) || 3000;
      await manager.killProcessOnPort(targetPort);
      break;
      
    case 'start':
      await manager.startWithBestPort();
      break;
      
    case 'quick':
      await manager.startQuickDevelopment();
      break;

    case 'fix':
      await manager.checkAndFixFileConflicts();
      break;

    case 'update':
      await manager.updateYarnCommands();
      break;

    case 'cleanup':
      await manager.killAllNodeProcesses();
      break;
      
    default:
      console.log(chalk.blue('🔧 EuroWeb Port Manager'));
      console.log(chalk.gray('Commands:'));
      console.log(chalk.yellow('  find [port]    - Find available port'));
      console.log(chalk.yellow('  kill <port>    - Kill process on port'));
      console.log(chalk.yellow('  start          - Start with best port'));
      console.log(chalk.yellow('  quick          - Quick development mode'));
      console.log(chalk.yellow('  fix            - Fix file conflicts'));
      console.log(chalk.yellow('  update         - Update yarn commands to English'));
      console.log(chalk.yellow('  cleanup        - Kill all Node processes'));
  }
}

if (require.main === module) {
  main().catch(console.error);
}

export default PortManager;

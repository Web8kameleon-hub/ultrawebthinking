#!/usr/bin/env tsx
/**
 * EuroWeb TypeScript-Only Enforcement
 * Ensures no JavaScript files exist in the project
 */

import { readdirSync, statSync, unlinkSync, existsSync } from 'fs';
import { join, extname } from 'path';
import chalk from 'chalk';

class TypeScriptOnlyChecker {
  private jsFiles: string[] = [];
  private excludeDirs = ['node_modules', '.next', 'dist', '.git', 'coverage'];

  async enforceTypescriptOnly(): Promise<void> {
    console.log(chalk.blue('🔍 EuroWeb TypeScript-Only Enforcement'));
    console.log(chalk.gray('─'.repeat(50)));

    this.scanDirectory(process.cwd());
    this.reportFindings();
    this.cleanupJavaScript();
  }

  private scanDirectory(dir: string): void {
    try {
      const items = readdirSync(dir);
      
      for (const item of items) {
        const fullPath = join(dir, item);
        const stat = statSync(fullPath);

        if (stat.isDirectory()) {
          if (!this.excludeDirs.includes(item)) {
            this.scanDirectory(fullPath);
          }
        } else {
          const ext = extname(item);
          if (['.js', '.jsx', '.mjs', '.cjs'].includes(ext)) {
            this.jsFiles.push(fullPath);
          }
        }
      }
    } catch (error) {
      console.log(chalk.yellow(`Warning: Could not scan ${dir}`));
    }
  }

  private reportFindings(): void {
    if (this.jsFiles.length === 0) {
      console.log(chalk.green('✅ No JavaScript files found - Pure TypeScript project!'));
      return;
    }

    console.log(chalk.red(`❌ Found ${this.jsFiles.length} JavaScript files:`));
    this.jsFiles.forEach(file => {
      const relativePath = file.replace(process.cwd(), '.');
      console.log(chalk.yellow(`  🚫 ${relativePath}`));
    });
  }

  private async cleanupJavaScript(): Promise<void> {
    if (this.jsFiles.length === 0) {return;}

    console.log(chalk.yellow('\n🧹 Cleaning up JavaScript files...'));
    
    const configFiles = ['next.config.js', '.config.js'];
    
    for (const file of this.jsFiles) {
      const fileName = file.split(/[/\\]/).pop() || '';
      
      if (configFiles.includes(fileName)) {
        console.log(chalk.cyan(`⚠️ Keeping config file: ${fileName}`));
        continue;
      }

      try {
        unlinkSync(file);
        console.log(chalk.green(`✅ Removed: ${file}`));
      } catch (error) {
        console.log(chalk.red(`❌ Could not remove: ${file}`));
      }
    }

    console.log(chalk.green('\n🎉 TypeScript-only enforcement completed!'));
  }

  async createTsOnlyFiles(): Promise<void> {
    console.log(chalk.blue('\n📝 Creating TypeScript-only configuration...'));

    // Create .tsonly file
    const tsOnlyContent = `# EuroWeb Platform - TypeScript Only
# This project enforces TypeScript-only development
# No JavaScript files are allowed

typescript_only: true
enforced_extensions:
  - .ts
  - .tsx
  - .mts
  - .d.ts

forbidden_extensions:
  - .js
  - .jsx
  - .mjs
  - .cjs

last_check: ${new Date().toISOString()}
platform: EuroWeb Web8 AGI System
`;

    const fs = import('fs/promises');
    fs.writeFile('.tsonly', tsOnlyContent);
    console.log(chalk.green('✅ Created .tsonly configuration'));
  }
}

// Main execution
function main() {
  const checker = new TypeScriptOnlyChecker();
  checker.enforceTypescriptOnly();
  checker.createTsOnlyFiles();
  
  console.log(chalk.blue('\n🚀 EuroWeb Platform is now TypeScript-only!'));
  console.log(chalk.cyan('Run: yarn dev:quick to start development'));
}

if (require.main === module) {
  main().catch(console.error);
}

export default TypeScriptOnlyChecker;

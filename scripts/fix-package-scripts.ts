#!/usr/bin/env tsx
/**
 * EuroWeb Package.json Scripts Fixer
 * Adds missing development scripts to package.json
 */

import { readFileSync, writeFileSync, existsSync } from 'fs'
import { join } from 'path'
import chalk from 'chalk'

class PackageScriptsFixer {
  private packagePath: string

  constructor() {
    this.packagePath = join(process.cwd(), 'package.json')
  }

  async fixScripts(): Promise<void> {
    console.log(chalk.blue('🔧 EuroWeb Package Scripts Fixer'))
    console.log(chalk.gray('─'.repeat(50)))

    if (!existsSync(this.packagePath)) {
      console.log(chalk.red('❌ package.json not found!'))
      return
    }

    const packageJson = JSON.parse(readFileSync(this.packagePath, 'utf8'))
    
    const scriptsToAdd = {
      // Albanian commands
      "zhvillo": "next dev --port 3000",
      "testo": "tsx scripts/project-control.ts test", 
      "nderto": "yarn build:all",
      "push-kodi": "tsx scripts/project-control.ts push",
      "statusi": "tsx scripts/project-control.ts status",
      
      // EuroWeb commands
      "euroweb:start": "next dev --port 3000",
      "euroweb:full": "yarn dev",
      "euroweb:test": "tsx scripts/project-control.ts test",
      "euroweb:build": "yarn build:all", 
      "euroweb:deploy": "tsx scripts/project-control.ts deploy",
      "euroweb:status": "tsx scripts/project-control.ts status",
      "euroweb:routes": "tsx scripts/check-routes.ts --fix",
      
      // Enhanced debugging
      "debug:all": "yarn debug:routes && yarn debug:build && yarn check:deps",
      "fix:all": "yarn fix:routes && yarn fix:perms && yarn prettier",
      
      // Missing core scripts
      "check:routes": "tsx scripts/check-routes.ts",
      "debug:routes": "tsx scripts/check-routes.ts --fix", 
      "fix:routes": "tsx scripts/check-routes.ts --fix",
      "ts:check": "tsx scripts/ts-only-check.ts",
      
      // Development helpers
      "dev:simple": "next dev",
      "start:simple": "next start",
      "build:simple": "next build"
    }

    let modified = false
    
    for (const [script, command] of Object.entries(scriptsToAdd)) {
      if (!packageJson.scripts[script]) {
        packageJson.scripts[script] = command
        modified = true
        console.log(chalk.green(`✅ Added script: ${script}`))
      } else {
        console.log(chalk.gray(`⚪ Script exists: ${script}`))
      }
    }

    if (modified) {
      writeFileSync(this.packagePath, JSON.stringify(packageJson, null, 2))
      console.log(chalk.green('\n🎉 Package.json updated with new scripts!'))
      
      console.log(chalk.blue('\n📋 Available commands:'))
      console.log(chalk.cyan('Albanian Commands:'))
      console.log(chalk.yellow('  yarn zhvillo    # Start development'))
      console.log(chalk.yellow('  yarn testo      # Run tests'))
      console.log(chalk.yellow('  yarn nderto     # Build project'))
      console.log(chalk.yellow('  yarn statusi    # Check status'))
      
      console.log(chalk.cyan('\nEuroWeb Commands:'))
      console.log(chalk.yellow('  yarn euroweb:start    # Start platform'))
      console.log(chalk.yellow('  yarn euroweb:test     # Run tests'))
      console.log(chalk.yellow('  yarn euroweb:build    # Build all'))
      console.log(chalk.yellow('  yarn euroweb:routes   # Fix routes'))
      
      console.log(chalk.cyan('\nQuick Commands:'))
      console.log(chalk.yellow('  yarn dev:simple      # Simple Next.js dev'))
      console.log(chalk.yellow('  yarn debug:all       # Complete diagnostic'))
      console.log(chalk.yellow('  yarn fix:all         # Fix all issues'))
      
    } else {
      console.log(chalk.yellow('\n⚠️ All scripts already exist'))
    }
  }
}

// Main execution
function main() {
  const fixer = new PackageScriptsFixer()
  fixer.fixScripts()
}

if (require.main === module) {
  main().catch(console.error)
}

export default PackageScriptsFixer

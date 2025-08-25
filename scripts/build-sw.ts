/**
 * EuroWeb Service Worker Build Script
 * Compiles sw.ts to sw.js for production
 * 
 * @author Ledjan Ahmati (100% Owner)
 * @contact dealsjona@gmail.com
 * @version 8.0.0 Industrial
 * @license MIT
 */

import { promises as fs } from 'fs'
import { exec } from 'child_process'
import { promisify } from 'util'
import path from 'path'

const execAsync = promisify(exec)

// Build configuration
const CONFIG = {
  input: path.join(process.cwd(), 'public', 'sw.ts'),
  output: path.join(process.cwd(), 'public', 'sw.js'),
  tempDir: path.join(process.cwd(), '.temp'),
  tsconfig: path.join(process.cwd(), 'tsconfig.json')
}

/**
 * Build service worker from TypeScript to JavaScript
 */
async function buildServiceWorker(): Promise<void> {
  console.log('🔧 Building EuroWeb Service Worker...')
  
  try {
    // Create temp directory
    await fs.mkdir(CONFIG.tempDir, { recursive: true })
    
    // Copy sw.ts to temp with proper webworker types
    const swContent = await fs.readFile(CONFIG.input, 'utf-8')
    const tempSwPath = path.join(CONFIG.tempDir, 'sw.ts')
    await fs.writeFile(tempSwPath, swContent)
    
    // Create temp tsconfig for service worker
    const tempTsconfig = {
      compilerOptions: {
        target: 'ES2020',
        module: 'ESNext',
        lib: ['ES2020', 'WebWorker'],
        moduleResolution: 'node',
        allowSyntheticDefaultImports: true,
        esModuleInterop: true,
        strict: true,
        skipLibCheck: true,
        forceConsistentCasingInFileNames: true,
        declaration: false,
        outDir: './dist'
      },
      include: ['./sw.ts'],
      exclude: []
    }
    
    const tempTsconfigPath = path.join(CONFIG.tempDir, 'tsconfig.json')
    await fs.writeFile(tempTsconfigPath, JSON.stringify(tempTsconfig, null, 2))
    
    // Compile TypeScript to JavaScript
    console.log('📦 Compiling TypeScript...')
    
    // Change to temp directory for compilation
    const originalCwd = process.cwd()
    process.chdir(CONFIG.tempDir)
    
    try {
      await execAsync(`npx tsc --project ./tsconfig.json`)
    } finally {
      process.chdir(originalCwd)
    }
    
    // Read compiled JavaScript
    const compiledSwPath = path.join(CONFIG.tempDir, 'dist', 'sw.js')
    let compiledContent = await fs.readFile(compiledSwPath, 'utf-8')
    
    // Add EuroWeb header
    const header = `/**
 * EuroWeb Service Worker v8.0.0 - Compiled from TypeScript
 * Industrial Grade PWA Architecture
 * 
 * @author Ledjan Ahmati (100% Owner)
 * @contact dealsjona@gmail.com
 * @compiled ${new Date().toISOString()}
 */

`
    
    compiledContent = header + compiledContent
    
    // Write to public/sw.js
    await fs.writeFile(CONFIG.output, compiledContent)
    
    // Clean up temp directory
    await fs.rm(CONFIG.tempDir, { recursive: true, force: true })
    
    console.log('✅ Service Worker built successfully!')
    console.log(`📁 Output: ${CONFIG.output}`)
    
    // Show file size
    const stats = await fs.stat(CONFIG.output)
    console.log(`📊 Size: ${(stats.size / 1024).toFixed(2)} KB`)
    
  } catch (error) {
    console.error('❌ Service Worker build failed:', error)
    
    // Clean up on error
    try {
      await fs.rm(CONFIG.tempDir, { recursive: true, force: true })
    } catch (cleanupError) {
      // Ignore cleanup errors
    }
    
    process.exit(1)
  }
}

/**
 * Watch mode for development
 */
async function watchServiceWorker(): Promise<void> {
  console.log('👀 Watching sw.ts for changes...')
  
  const { watch } = await import('chokidar')
  
  const watcher = watch(CONFIG.input, {
    persistent: true,
    ignoreInitial: false
  })
  
  watcher.on('change', async () => {
    console.log('🔄 sw.ts changed, rebuilding...')
    await buildServiceWorker()
  })
  
  watcher.on('add', async () => {
    console.log('➕ sw.ts added, building...')
    await buildServiceWorker()
  })
  
  process.on('SIGINT', () => {
    console.log('\n👋 Stopping service worker watcher...')
    watcher.close()
    process.exit(0)
  })
}

/**
 * Main function
 */
async function main(): Promise<void> {
  const args = process.argv.slice(2)
  const command = args[0]
  
  switch (command) {
    case 'build':
      await buildServiceWorker()
      break
      
    case 'watch':
      await watchServiceWorker()
      break
      
    case 'dev':
      await watchServiceWorker()
      break
      
    default:
      console.log(`
🔧 EuroWeb Service Worker Builder

Usage:
  npm run sw:build    - Build sw.ts to sw.js
  npm run sw:watch    - Watch sw.ts and rebuild on changes
  npm run sw:dev      - Same as watch (for development)

Commands:
  build               - One-time build
  watch               - Watch mode
  dev                 - Development mode (watch)
`)
      break
  }
}

// Run if called directly
if (require.main === module) {
  main().catch((error) => {
    console.error('❌ Script failed:', error)
    process.exit(1)
  })
}

export { buildServiceWorker, watchServiceWorker }

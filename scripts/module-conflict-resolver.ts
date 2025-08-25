/**
 * Module Conflict Resolver - TypeScript Version
 * Resolves conflicts between dist modules and fix scripts
 * 
 * @author UltraWeb Industrial Team
 * @version 8.0.0-PRODUCTION
 */

import { promises as fs } from 'fs';
import path from 'path';

interface ConflictReport {
  readonly conflicts: readonly string[];
  readonly resolved: readonly string[];
  readonly errors: readonly string[];
}

interface ModuleInfo {
  readonly path: string;
  readonly type: 'js' | 'cjs' | 'mjs' | 'ts' | 'tsx';
  readonly size: number;
  readonly isFixScript: boolean;
}

class ModuleConflictResolver {
  private readonly projectRoot: string;
  private readonly conflictExtensions: readonly string[] = ['.js', '.cjs', '.mjs'];
  private readonly fixScriptPatterns: readonly RegExp[] = [
    /fix/i,
    /fixer/i,
    /rregullues/i,
    /emergency/i,
    /mega/i,
    /ultra/i
  ];

  constructor(projectRoot: string = process.cwd()) {
    this.projectRoot = projectRoot;
  }

  // Scan for conflicting modules
  public async scanForConflicts(): Promise<readonly ModuleInfo[]> {
    console.log('🔍 Scanning for module conflicts...');
    
    const modules: ModuleInfo[] = [];
    await this.scanDirectory(this.projectRoot, modules);
    
    return modules.filter(module => this.isConflicting(module));
  }

  // Check if module is conflicting
  private isConflicting(module: ModuleInfo): boolean {
    // JavaScript files in TypeScript project are conflicting
    if (this.conflictExtensions.includes(path.extname(module.path))) {
      return true;
    }
    
    // Multiple fix scripts can conflict
    if (module.isFixScript) {
      return true;
    }
    
    return false;
  }

  // Recursively scan directory
  private async scanDirectory(dirPath: string, modules: ModuleInfo[]): Promise<void> {
    try {
      const entries = await fs.readdir(dirPath, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name);
        
        // Skip node_modules and .next directories
        if (entry.isDirectory() && !['node_modules', '.next', '.git'].includes(entry.name)) {
          await this.scanDirectory(fullPath, modules);
        } else if (entry.isFile()) {
          const ext = path.extname(entry.name);
          if (['.js', '.cjs', '.mjs', '.ts', '.tsx'].includes(ext)) {
            const stats = await fs.stat(fullPath);
            const isFixScript = this.fixScriptPatterns.some(pattern => pattern.test(entry.name));
            
            modules.push({
              path: fullPath,
              type: ext.slice(1) as ModuleInfo['type'],
              size: stats.size,
              isFixScript
            });
          }
        }
      }
    } catch (error) {
      console.warn(`Warning: Could not scan directory ${dirPath}:`, error);
    }
  }

  // Resolve conflicts by removing problematic files
  public async resolveConflicts(): Promise<ConflictReport> {
    console.log('🔧 Resolving module conflicts...');
    
    const conflicts: string[] = [];
    const resolved: string[] = [];
    const errors: string[] = [];
    
    const conflictingModules = await this.scanForConflicts();
    
    for (const module of conflictingModules) {
      try {
        conflicts.push(module.path);
        
        // Only remove JavaScript files and redundant fix scripts
        if (this.shouldRemove(module)) {
          await fs.unlink(module.path);
          resolved.push(module.path);
          console.log(`🗑️ Removed conflicting module: ${path.relative(this.projectRoot, module.path)}`);
        }
      } catch (error) {
        errors.push(`Failed to remove ${module.path}: ${error}`);
        console.error(`❌ Error removing ${module.path}:`, error);
      }
    }
    
    return { conflicts, resolved, errors };
  }

  // Determine if module should be removed
  private shouldRemove(module: ModuleInfo): boolean {
    const relativePath = path.relative(this.projectRoot, module.path);
    
    // Remove JavaScript files in scripts directory
    if (relativePath.includes('scripts') && ['js', 'cjs', 'mjs'].includes(module.type)) {
      return true;
    }
    
    // Remove redundant fix scripts (keep only simple-fix.ts and typescript-error-fixer.ts)
    if (module.isFixScript && module.type === 'ts') {
      const fileName = path.basename(module.path);
      const keepFiles = ['simple-fix.ts', 'typescript-error-fixer.ts', 'fix-syntax-errors.ts'];
      
      if (!keepFiles.includes(fileName)) {
        return true;
      }
    }
    
    return false;
  }

  // Clean build artifacts
  public async cleanBuildArtifacts(): Promise<void> {
    console.log('🧹 Cleaning build artifacts...');
    
    const buildDirs = ['.next', 'dist', 'build', '.cache'];
    
    for (const dir of buildDirs) {
      const dirPath = path.join(this.projectRoot, dir);
      try {
        await fs.rm(dirPath, { recursive: true, force: true });
        console.log(`🗑️ Removed build directory: ${dir}`);
      } catch (error) {
        // Directory might not exist, which is fine
      }
    }
  }

  // Generate clean TypeScript configuration
  public async optimizeTypeScriptConfig(): Promise<void> {
    console.log('⚙️ Optimizing TypeScript configuration...');
    
    const tsconfigPath = path.join(this.projectRoot, 'tsconfig.json');
    
    try {
      const tsconfig = JSON.parse(await fs.readFile(tsconfigPath, 'utf8'));
      
      // Ensure strict TypeScript settings
      tsconfig.compilerOptions = {
        ...tsconfig.compilerOptions,
        strict: true,
        noEmit: true,
        skipLibCheck: true,
        allowJs: false, // Disable JavaScript files
        checkJs: false,
        moduleResolution: "node",
        esModuleInterop: true,
        allowSyntheticDefaultImports: true,
        isolatedModules: true
      };
      
      // Exclude JavaScript files and build directories
      tsconfig.exclude = [
        ...tsconfig.exclude || [],
        "**/*.js",
        "**/*.cjs", 
        "**/*.mjs",
        ".next/**",
        "dist/**",
        "build/**",
        "node_modules/**"
      ];
      
      await fs.writeFile(tsconfigPath, JSON.stringify(tsconfig, null, 2));
      console.log('✅ TypeScript configuration optimized');
    } catch (error) {
      console.error('❌ Error optimizing TypeScript config:', error);
    }
  }

  // Main resolution process
  public async resolveAllConflicts(): Promise<ConflictReport> {
    console.log('🚀 Starting complete module conflict resolution...');
    
    // Step 1: Clean build artifacts
    await this.cleanBuildArtifacts();
    
    // Step 2: Optimize TypeScript config
    await this.optimizeTypeScriptConfig();
    
    // Step 3: Resolve module conflicts
    const report = await this.resolveConflicts();
    
    console.log('\n📊 Module Conflict Resolution Report:');
    console.log(`   Conflicts found: ${report.conflicts.length}`);
    console.log(`   Successfully resolved: ${report.resolved.length}`);
    console.log(`   Errors: ${report.errors.length}`);
    
    if (report.errors.length > 0) {
      console.log('\n❌ Errors encountered:');
      report.errors.forEach(error => console.log(`   ${error}`));
    }
    
    console.log('\n✅ Module conflict resolution complete!');
    return report;
  }
}

// Export for use
export { ModuleConflictResolver, type ConflictReport, type ModuleInfo };

// Auto-run if executed directly
if (require.main === module) {
  const resolver = new ModuleConflictResolver();
  resolver.resolveAllConflicts().catch(console.error);
}

#!/usr/bin/env tsx

/**
 * 🛣️ PATH VALIDATOR - COMPREHENSIVE PATH CHECKING SYSTEM
 * Kontrollon të gjitha paths, imports, exports dhe references
 * 
 * @author Ledjan Ahmati (100% Owner)
 * @contact dealsjona@gmail.com
 * @version 8.0.0-PATH-VALIDATOR
 * @license MIT
 */

import { existsSync, readFileSync, statSync } from 'fs';
import { glob } from 'glob';
import { join, relative, resolve, dirname, basename, extname } from 'path';
import { fileURLToPath } from 'url';

const PROJECT_ROOT = process.cwd();

interface PathValidationReport {
  files: {
    total: number;
    valid: number;
    invalid: string[];
    orphaned: string[];
  };
  imports: {
    total: number;
    valid: number;
    broken: PathIssue[];
    circular: string[][];
  };
  exports: {
    total: number;
    valid: number;
    unused: string[];
    conflicts: string[];
  };
  references: {
    total: number;
    valid: number;
    broken: PathIssue[];
  };
  aliases: {
    configured: Record<string, string[]>;
    valid: number;
    broken: PathIssue[];
  };
  suggestions: string[];
  score: number;
}

interface PathIssue {
  file: string;
  line: number;
  column: number;
  path: string;
  reason: string;
  severity: 'error' | 'warning' | 'info';
  suggestion?: string;
}

/**
 * 🛣️ PATH VALIDATOR CLASS
 */
class PathValidator {
  private readonly report: PathValidationReport = {
    files: {
      total: 0,
      valid: 0,
      invalid: [],
      orphaned: []
    },
    imports: {
      total: 0,
      valid: 0,
      broken: [],
      circular: []
    },
    exports: {
      total: 0,
      valid: 0,
      unused: [],
      conflicts: []
    },
    references: {
      total: 0,
      valid: 0,
      broken: []
    },
    aliases: {
      configured: {},
      valid: 0,
      broken: []
    },
    suggestions: [],
    score: 0
  };

  private tsConfigPaths: Record<string, string[]> = {};
  private allFiles: string[] = [];
  private readonly importGraph: Map<string, Set<string>> = new Map();

  /**
   * 🔍 MAIN VALIDATION EXECUTION
   */
  public async validatePaths(): Promise<PathValidationReport> {
    console.log('🛣️ COMPREHENSIVE PATH VALIDATION STARTING...\n');

    await this.loadConfiguration();
    await this.scanAllFiles();
    await this.validateFileExistence();
    await this.validateImports();
    await this.validateExports();
    await this.validateReferences();
    await this.validateAliases();
    await this.detectCircularDependencies();
    await this.generateSuggestions();
    this.calculateScore();

    return this.report;
  }

  /**
   * ⚙️ LOAD CONFIGURATION
   */
  private async loadConfiguration(): Promise<void> {
    console.log('⚙️ Loading configuration...');

    // Load TypeScript configuration
    const tsConfigPath = join(PROJECT_ROOT, 'tsconfig.json');
    if (existsSync(tsConfigPath)) {
      try {
        const tsConfig = JSON.parse(readFileSync(tsConfigPath, 'utf-8'));
        if (tsConfig.compilerOptions?.paths) {
          this.tsConfigPaths = tsConfig.compilerOptions.paths;
          console.log(`⚙️ Loaded ${Object.keys(this.tsConfigPaths).length} path aliases`);
        }
      } catch (error) {
        console.warn('⚠️ Failed to parse tsconfig.json:', error);
      }
    }

    // Store configured aliases
    this.report.aliases.configured = this.tsConfigPaths;
  }

  /**
   * 📁 SCAN ALL FILES
   */
  private async scanAllFiles(): Promise<void> {
    console.log('📁 Scanning all files...');

    this.allFiles = await glob('**/*.{ts,tsx,js,jsx,mts,cts}', {
      cwd: PROJECT_ROOT,
      ignore: [
        'node_modules/**',
        '.next/**',
        'dist/**',
        'build/**',
        '.git/**',
        'coverage/**',
        '*.d.ts'
      ]
    });

    this.report.files.total = this.allFiles.length;
    console.log(`📁 Found ${this.allFiles.length} source files`);
  }

  /**
   * 📂 VALIDATE FILE EXISTENCE
   */
  private async validateFileExistence(): Promise<void> {
    console.log('📂 Validating file existence...');

    for (const file of this.allFiles) {
      const fullPath = join(PROJECT_ROOT, file);
      
      try {
        const stats = statSync(fullPath);
        if (stats.isFile()) {
          this.report.files.valid++;
        } else {
          this.report.files.invalid.push(file);
        }
      } catch (error) {
        this.report.files.invalid.push(file);
      }
    }

    // Check for orphaned files (not imported anywhere)
    const importedFiles = new Set<string>();
    
    for (const file of this.allFiles) {
      const imports = await this.extractImports(file);
      for (const imp of imports) {
        const resolvedPath = this.resolvePath(imp.path, file);
        if (resolvedPath) {
          importedFiles.add(resolvedPath);
        }
      }
    }

    // Find files that are never imported (except entry points)
    const entryPoints = new Set([
      'app/page.tsx',
      'app/layout.tsx',
      'pages/index.tsx',
      'src/index.ts',
      'src/main.ts',
      'index.ts',
      'next.config.mts',
      'vitest.config.ts',
      'jest.config.ts'
    ]);

    for (const file of this.allFiles) {
      const normalizedFile = file.replace(/\\/g, '/');
      if (!importedFiles.has(file) && !entryPoints.has(normalizedFile)) {
        // Check if it's a test file or config file
        if (!file.includes('.test.') && 
            !file.includes('.spec.') && 
            !file.includes('config') &&
            !file.includes('setup') &&
            !file.includes('.d.ts')) {
          this.report.files.orphaned.push(file);
        }
      }
    }

    console.log(`📂 Valid files: ${this.report.files.valid}`);
    console.log(`📂 Invalid files: ${this.report.files.invalid.length}`);
    console.log(`📂 Orphaned files: ${this.report.files.orphaned.length}`);
  }

  /**
   * 📥 VALIDATE IMPORTS
   */
  private async validateImports(): Promise<void> {
    console.log('📥 Validating imports...');

    for (const file of this.allFiles) {
      const imports = await this.extractImports(file);
      
      for (const imp of imports) {
        this.report.imports.total++;
        
        // Skip node_modules imports
        if (!imp.path.startsWith('.') && !imp.path.startsWith('@/')) {
          this.report.imports.valid++;
          continue;
        }

        const resolvedPath = this.resolvePath(imp.path, file);
        
        if (resolvedPath && existsSync(resolvedPath)) {
          this.report.imports.valid++;
          
          // Build import graph for circular dependency detection
          if (!this.importGraph.has(file)) {
            this.importGraph.set(file, new Set());
          }
          this.importGraph.get(file)!.add(resolvedPath);
        } else {
          this.report.imports.broken.push({
            file,
            line: imp.line,
            column: imp.column,
            path: imp.path,
            reason: `File not found: ${imp.path}`,
            severity: 'error',
            suggestion: this.suggestCorrectPath(imp.path, file)
          });
        }
      }
    }

    console.log(`📥 Total imports: ${this.report.imports.total}`);
    console.log(`📥 Valid imports: ${this.report.imports.valid}`);
    console.log(`📥 Broken imports: ${this.report.imports.broken.length}`);
  }

  /**
   * 📤 VALIDATE EXPORTS
   */
  private async validateExports(): Promise<void> {
    console.log('📤 Validating exports...');

    const allExports = new Map<string, string[]>();
    const usedExports = new Set<string>();

    // Collect all exports
    for (const file of this.allFiles) {
      const exports = await this.extractExports(file);
      if (exports.length > 0) {
        allExports.set(file, exports);
        this.report.exports.total += exports.length;
      }
    }

    // Check which exports are used
    for (const file of this.allFiles) {
      const imports = await this.extractImports(file);
      
      for (const imp of imports) {
        const resolvedPath = this.resolvePath(imp.path, file);
        if (resolvedPath && allExports.has(resolvedPath)) {
          // Mark named imports as used
          if (imp.named) {
            for (const named of imp.named) {
              usedExports.add(`${resolvedPath}:${named}`);
            }
          }
          // Mark default export as used
          if (imp.default) {
            usedExports.add(`${resolvedPath}:default`);
          }
        }
      }
    }

    // Find unused exports
    for (const [file, exports] of allExports) {
      for (const exp of exports) {
        const exportKey = `${file}:${exp}`;
        if (usedExports.has(exportKey)) {
          this.report.exports.valid++;
        } else {
          // Don't report main entry points as unused
          if (exp !== 'default' || !this.isEntryPoint(file)) {
            this.report.exports.unused.push(exportKey);
          } else {
            this.report.exports.valid++;
          }
        }
      }
    }

    console.log(`📤 Total exports: ${this.report.exports.total}`);
    console.log(`📤 Valid exports: ${this.report.exports.valid}`);
    console.log(`📤 Unused exports: ${this.report.exports.unused.length}`);
  }

  /**
   * 🔗 VALIDATE REFERENCES
   */
  private async validateReferences(): Promise<void> {
    console.log('🔗 Validating file references...');

    for (const file of this.allFiles) {
      try {
        const content = readFileSync(join(PROJECT_ROOT, file), 'utf-8');
        const lines = content.split('\n');

        for (let i = 0; i < lines.length; i++) {
          const line = lines[i];
          
          // Look for file references in comments, strings, etc.
          const pathMatches = line.match(/['"](\.{1,2}\/[^'"]*)['"]/g);
          
          if (pathMatches) {
            for (const match of pathMatches) {
              const path = match.slice(1, -1); // Remove quotes
              this.report.references.total++;
              
              const resolvedPath = this.resolvePath(path, file);
              if (resolvedPath && existsSync(resolvedPath)) {
                this.report.references.valid++;
              } else {
                this.report.references.broken.push({
                  file,
                  line: i + 1,
                  column: line.indexOf(match) + 1,
                  path,
                  reason: `Referenced file not found: ${path}`,
                  severity: 'warning',
                  suggestion: this.suggestCorrectPath(path, file)
                });
              }
            }
          }
        }
      } catch (error) {
        // Skip unreadable files
      }
    }

    console.log(`🔗 Total references: ${this.report.references.total}`);
    console.log(`🔗 Valid references: ${this.report.references.valid}`);
    console.log(`🔗 Broken references: ${this.report.references.broken.length}`);
  }

  /**
   * 🏷️ VALIDATE ALIASES
   */
  private async validateAliases(): Promise<void> {
    console.log('🏷️ Validating path aliases...');

    for (const [alias, paths] of Object.entries(this.tsConfigPaths)) {
      for (const path of paths) {
        // Remove wildcards and resolve
        const cleanPath = path.replace('/*', '');
        const fullPath = resolve(PROJECT_ROOT, cleanPath);
        
        if (existsSync(fullPath)) {
          this.report.aliases.valid++;
        } else {
          this.report.aliases.broken.push({
            file: 'tsconfig.json',
            line: 0,
            column: 0,
            path: alias,
            reason: `Alias path does not exist: ${path}`,
            severity: 'error',
            suggestion: `Create directory or update alias: ${path}`
          });
        }
      }
    }

    console.log(`🏷️ Configured aliases: ${Object.keys(this.tsConfigPaths).length}`);
    console.log(`🏷️ Valid aliases: ${this.report.aliases.valid}`);
    console.log(`🏷️ Broken aliases: ${this.report.aliases.broken.length}`);
  }

  /**
   * 🔄 DETECT CIRCULAR DEPENDENCIES
   */
  private async detectCircularDependencies(): Promise<void> {
    console.log('🔄 Detecting circular dependencies...');

    const visited = new Set<string>();
    const recursionStack = new Set<string>();

    const dfs = (file: string, path: string[]): string[] | null => {
      if (recursionStack.has(file)) {
        // Found a cycle
        const cycleStart = path.indexOf(file);
        return path.slice(cycleStart);
      }

      if (visited.has(file)) {
        return null;
      }

      visited.add(file);
      recursionStack.add(file);

      const dependencies = this.importGraph.get(file) || new Set();
      
      for (const dep of dependencies) {
        const cycle = dfs(dep, [...path, file]);
        if (cycle) {
          return cycle;
        }
      }

      recursionStack.delete(file);
      return null;
    };

    for (const file of this.allFiles) {
      if (!visited.has(file)) {
        const cycle = dfs(file, []);
        if (cycle) {
          this.report.imports.circular.push(cycle);
        }
      }
    }

    console.log(`🔄 Circular dependencies found: ${this.report.imports.circular.length}`);
  }

  /**
   * 💡 GENERATE SUGGESTIONS
   */
  private async generateSuggestions(): Promise<void> {
    const suggestions = this.report.suggestions;

    if (this.report.files.invalid.length > 0) {
      suggestions.push(`🔴 CRITICAL: ${this.report.files.invalid.length} invalid files detected - investigate file system issues`);
    }

    if (this.report.imports.broken.length > 0) {
      suggestions.push(`🔴 HIGH: Fix ${this.report.imports.broken.length} broken imports`);
    }

    if (this.report.imports.circular.length > 0) {
      suggestions.push(`🟡 MEDIUM: Resolve ${this.report.imports.circular.length} circular dependencies`);
    }

    if (this.report.exports.unused.length > 10) {
      suggestions.push(`🟡 MEDIUM: Clean up ${this.report.exports.unused.length} unused exports`);
    }

    if (this.report.files.orphaned.length > 0) {
      suggestions.push(`🟡 LOW: Review ${this.report.files.orphaned.length} orphaned files`);
    }

    if (this.report.aliases.broken.length > 0) {
      suggestions.push(`🔴 HIGH: Fix ${this.report.aliases.broken.length} broken path aliases`);
    }

    suggestions.push('🔧 Use absolute imports with path aliases for better maintainability');
    suggestions.push('📊 Regular path validation prevents import issues');
    suggestions.push('🧹 Clean up unused exports and orphaned files periodically');
  }

  /**
   * 📊 CALCULATE VALIDATION SCORE
   */
  private calculateScore(): void {
    let score = 100;

    // Deduct for invalid files
    score -= this.report.files.invalid.length * 10;

    // Deduct for broken imports
    score -= this.report.imports.broken.length * 5;

    // Deduct for circular dependencies
    score -= this.report.imports.circular.length * 15;

    // Deduct for broken aliases
    score -= this.report.aliases.broken.length * 10;

    // Deduct for broken references
    score -= this.report.references.broken.length * 2;

    // Small deduction for unused exports
    score -= Math.min(this.report.exports.unused.length * 0.5, 10);

    // Small deduction for orphaned files
    score -= Math.min(this.report.files.orphaned.length * 1, 5);

    this.report.score = Math.max(0, score);
  }

  /**
   * 📥 EXTRACT IMPORTS FROM FILE
   */
  private async extractImports(file: string): Promise<{
    path: string;
    line: number;
    column: number;
    default?: string;
    named?: string[];
  }[]> {
    const imports: any[] = [];
    
    try {
      const content = readFileSync(join(PROJECT_ROOT, file), 'utf-8');
      const lines = content.split('\n');

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        
        // Match various import patterns
        const importPatterns = [
          /import\s+.*from\s+['"`]([^'"`]+)['"`]/g,
          /import\s*\(\s*['"`]([^'"`]+)['"`]\s*\)/g,
          /require\s*\(\s*['"`]([^'"`]+)['"`]\s*\)/g
        ];

        for (const pattern of importPatterns) {
          let match;
          while ((match = pattern.exec(line)) !== null) {
            imports.push({
              path: match[1],
              line: i + 1,
              column: match.index + 1
            });
          }
        }
      }
    } catch (error) {
      // Skip unreadable files
    }

    return imports;
  }

  /**
   * 📤 EXTRACT EXPORTS FROM FILE
   */
  private async extractExports(file: string): Promise<string[]> {
    const exports: string[] = [];
    
    try {
      const content = readFileSync(join(PROJECT_ROOT, file), 'utf-8');
      
      // Match export patterns
      const exportPatterns = [
        /export\s+default\s+/g,
        /export\s+(?:const|let|var|function|class|interface|type)\s+(\w+)/g,
        /export\s*\{\s*([^}]+)\s*\}/g
      ];

      for (const pattern of exportPatterns) {
        let match;
        while ((match = pattern.exec(content)) !== null) {
          if (match[0].includes('default')) {
            exports.push('default');
          } else if (match[1]) {
            exports.push(match[1]);
          }
        }
      }
    } catch (error) {
      // Skip unreadable files
    }

    return exports;
  }

  /**
   * 🔍 RESOLVE PATH
   */
  private resolvePath(importPath: string, fromFile: string): string | null {
    try {
      // Handle alias paths
      if (importPath.startsWith('@/')) {
        const aliasPath = importPath.replace('@/', '');
        return join(PROJECT_ROOT, aliasPath);
      }

      // Handle relative paths
      if (importPath.startsWith('./') || importPath.startsWith('../')) {
        const dir = dirname(join(PROJECT_ROOT, fromFile));
        const resolved = resolve(dir, importPath);
        
        // Try with different extensions
        const extensions = ['', '.ts', '.tsx', '.js', '.jsx', '.mts', '.cts'];
        for (const ext of extensions) {
          const withExt = resolved + ext;
          if (existsSync(withExt)) {
            return withExt;
          }
        }
        
        // Try index files
        for (const ext of ['.ts', '.tsx', '.js', '.jsx']) {
          const indexPath = join(resolved, `index${ext}`);
          if (existsSync(indexPath)) {
            return indexPath;
          }
        }
      }

      return null;
    } catch (error) {
      return null;
    }
  }

  /**
   * 💡 SUGGEST CORRECT PATH
   */
  private suggestCorrectPath(invalidPath: string, fromFile: string): string | undefined {
    // Simple suggestion logic - find similar file names
    const fileName = basename(invalidPath);
    const nameWithoutExt = fileName.replace(/\.[^.]*$/, '');
    
    for (const file of this.allFiles) {
      const fileBasename = basename(file);
      const fileWithoutExt = fileBasename.replace(/\.[^.]*$/, '');
      
      if (fileWithoutExt === nameWithoutExt || fileBasename === fileName) {
        const relativePath = relative(dirname(fromFile), file);
        return relativePath.startsWith('.') ? relativePath : `./${relativePath}`;
      }
    }

    return undefined;
  }

  /**
   * 🎯 CHECK IF ENTRY POINT
   */
  private isEntryPoint(file: string): boolean {
    const entryPoints = [
      'app/page.tsx',
      'app/layout.tsx',
      'pages/index.tsx',
      'src/index.ts',
      'src/main.ts',
      'index.ts'
    ];

    return entryPoints.some(entry => file.endsWith(entry));
  }

  /**
   * 📋 PRINT VALIDATION REPORT
   */
  public printReport(report: PathValidationReport): void {
    console.log(`\n${  '='.repeat(80)}`);
    console.log('🛣️ COMPREHENSIVE PATH VALIDATION REPORT');
    console.log('='.repeat(80));

    // Overall Score
    const scoreColor = report.score >= 90 ? '🟢' : report.score >= 70 ? '🟡' : '🔴';
    console.log(`\n📊 OVERALL SCORE: ${scoreColor} ${report.score}/100\n`);

    // Files
    console.log('📁 FILES:');
    console.log(`   Total: ${report.files.total}`);
    console.log(`   Valid: ${report.files.valid}`);
    console.log(`   Invalid: ${report.files.invalid.length}`);
    if (report.files.invalid.length > 0) {
      report.files.invalid.slice(0, 3).forEach(file => console.log(`      ❌ ${file}`));
    }
    console.log(`   Orphaned: ${report.files.orphaned.length}`);
    if (report.files.orphaned.length > 0) {
      console.log(`   📋 DETAILED ORPHANED FILES (first 10):`);
      report.files.orphaned.slice(0, 10).forEach(file => console.log(`      🗑️ ${file}`));
      if (report.files.orphaned.length > 10) {
        console.log(`      📊 ... and ${report.files.orphaned.length - 10} more orphaned files`);
      }
    }

    // Imports
    console.log('\n📥 IMPORTS:');
    console.log(`   Total: ${report.imports.total}`);
    console.log(`   Valid: ${report.imports.valid}`);
    console.log(`   Broken: ${report.imports.broken.length}`);
    if (report.imports.broken.length > 0) {
      report.imports.broken.slice(0, 5).forEach(issue => {
        console.log(`      ❌ ${issue.file}:${issue.line} - ${issue.path}`);
        if (issue.suggestion) {
          console.log(`         💡 Suggestion: ${issue.suggestion}`);
        }
      });
    }
    console.log(`   Circular: ${report.imports.circular.length}`);
    if (report.imports.circular.length > 0) {
      report.imports.circular.slice(0, 2).forEach(cycle => {
        console.log(`      🔄 ${cycle.join(' → ')}`);
      });
    }

    // Exports
    console.log('\n📤 EXPORTS:');
    console.log(`   Total: ${report.exports.total}`);
    console.log(`   Valid: ${report.exports.valid}`);
    console.log(`   Unused: ${report.exports.unused.length}`);
    if (report.exports.unused.length > 0) {
      console.log(`   📋 DETAILED UNUSED EXPORTS (first 15):`);
      report.exports.unused.slice(0, 15).forEach(exp => console.log(`      🗑️ ${exp}`));
      if (report.exports.unused.length > 15) {
        console.log(`      📊 ... and ${report.exports.unused.length - 15} more unused exports`);
      }
    }

    // Path Aliases
    console.log('\n🏷️ PATH ALIASES:');
    console.log(`   Configured: ${Object.keys(report.aliases.configured).length}`);
    console.log(`   Valid: ${report.aliases.valid}`);
    console.log(`   Broken: ${report.aliases.broken.length}`);
    if (report.aliases.broken.length > 0) {
      report.aliases.broken.forEach(issue => {
        console.log(`      ❌ ${issue.path} - ${issue.reason}`);
      });
    }

    // References
    console.log('\n🔗 REFERENCES:');
    console.log(`   Total: ${report.references.total}`);
    console.log(`   Valid: ${report.references.valid}`);
    console.log(`   Broken: ${report.references.broken.length}`);

    // Suggestions
    console.log('\n💡 SUGGESTIONS:');
    report.suggestions.forEach((suggestion, index) => {
      console.log(`   ${index + 1}. ${suggestion}`);
    });

    console.log(`\n${  '='.repeat(80)}`);
    console.log('✅ PATH VALIDATION COMPLETE');
    console.log(`${'='.repeat(80)  }\n`);
  }
}

/**
 * 🚀 MAIN EXECUTION
 */
async function main(): Promise<void> {
  try {
    const validator = new PathValidator();
    const report = await validator.validatePaths();
    validator.printReport(report);

    // Exit with error code if score is too low
    if (report.score < 80) {
      console.log('❌ Path validation failed - Score below acceptable threshold (80)');
      process.exit(1);
    } else {
      console.log('✅ Path validation passed - All paths are correctly configured');
      process.exit(0);
    }
  } catch (error) {
    console.error('💥 Path validation failed with error:', error);
    process.exit(1);
  }
}

// Execute main function
main();

export { PathValidator, type PathValidationReport };

#!/usr/bin/env tsx

/**
 * 🧹 PROJECT CLEANUP SCRIPT
 * Systematic cleanup of unused exports and orphaned files
 * 
 * @author Ledjan Ahmati (100% Owner)
 * @contact dealsjona@gmail.com
 * @version 8.0.0-CLEANUP
 * @license MIT
 */

import { existsSync, readFileSync, writeFileSync, unlinkSync } from 'fs';
import { glob } from 'glob';
import { join, relative } from 'path';

const PROJECT_ROOT = process.cwd();

interface CleanupReport {
  deletedFiles: string[];
  fixedImports: string[];
  removedExports: string[];
  errors: string[];
}

class ProjectCleaner {
  private readonly report: CleanupReport = {
    deletedFiles: [],
    fixedImports: [],
    removedExports: [],
    errors: []
  };

  /**
   * 🚀 MAIN CLEANUP EXECUTION
   */
  public async cleanup(): Promise<CleanupReport> {
    console.log('🧹 STARTING PROJECT CLEANUP...\n');

    await this.cleanupTestFiles();
    await this.cleanupUnusedUtilities();
    await this.fixPatternImports(); 
    await this.removeUnusedExports();
    await this.updatePathAliases();

    return this.report;
  }

  /**
   * 🧪 CLEANUP TEST FILES
   */
  private async cleanupTestFiles(): Promise<void> {
    console.log('🧪 Cleaning up test files...');
    
    // Test files are meant to be standalone, so they're not really "orphaned"
    // Let's just remove unused test exports
    
    const testFiles = await glob('__tests__/**/*.{ts,tsx}', { cwd: PROJECT_ROOT });
    
    for (const testFile of testFiles) {
      try {
        const content = readFileSync(join(PROJECT_ROOT, testFile), 'utf-8');
        
        // Remove unused exports from test files
        const cleanedContent = content
          .replace(/export (const|function) create\w+TestSuite/g, '// Removed unused export: $&')
          .replace(/export (const|function) create\w+Utils/g, '// Removed unused export: $&')
          .replace(/export (const|interface) \w+Utils/g, '// Removed unused export: $&');
        
        if (cleanedContent !== content) {
          writeFileSync(join(PROJECT_ROOT, testFile), cleanedContent);
          this.report.removedExports.push(`${testFile}: Removed unused test exports`);
        }
      } catch (error) {
        this.report.errors.push(`Error cleaning ${testFile}: ${error}`);
      }
    }
  }

  /**
   * 🔧 CLEANUP UNUSED UTILITIES
   */
  private async cleanupUnusedUtilities(): Promise<void> {
    console.log('🔧 Cleaning up unused utilities...');
    
    // Check if utility files are actually used
    const utilityFiles = [
      'utils/web8-utils.ts',
      'utils/themeController.ts',
      'middleware.ts'
    ];
    
    for (const utilFile of utilityFiles) {
      const fullPath = join(PROJECT_ROOT, utilFile);
      if (existsSync(fullPath)) {
        // Check if file is imported anywhere
        const isImported = await this.isFileImported(utilFile);
        
        if (!isImported) {
          console.log(`🗑️ ${utilFile} is not imported anywhere - consider integrating or removing`);
          // Don't auto-delete, just report
          this.report.deletedFiles.push(`CANDIDATE: ${utilFile} (not auto-deleted)`);
        }
      }
    }
  }

  /**
   * 🎨 FIX PATTERN IMPORTS
   */
  private async fixPatternImports(): Promise<void> {
    console.log('🎨 Fixing pattern imports...');
    
    const patternFiles = await glob('patterns/**/*.d.ts', { cwd: PROJECT_ROOT });
    
    for (const patternFile of patternFiles) {
      try {
        const content = readFileSync(join(PROJECT_ROOT, patternFile), 'utf-8');
        
        // Fix broken imports after removing system-types
        const fixedContent = content
          .replace(/import type { SystemStyleObject, ConditionalValue } from ['"]..\/types\/index['"];/g, 
                  "// Simplified: removed system-styles dependency")
          .replace(/import type { SystemProperties } from ['"]..\/types\/style-props['"];/g,
                  "// Simplified: removed system-styles dependency") 
          .replace(/import type { DistributiveOmit } from ['"]..\/types\/system-types['"];/g,
                  "// Simplified: removed system-styles dependency")
          .replace(/SystemProperties\[\"gap\"\]/g, 'string | number')
          .replace(/DistributiveOmit</g, 'Omit<')
          .replace(/SystemStyleObject/g, 'Record<string, any>');
        
        if (fixedContent !== content) {
          writeFileSync(join(PROJECT_ROOT, patternFile), fixedContent);
          this.report.fixedImports.push(`${patternFile}: Fixed pattern imports`);
        }
      } catch (error) {
        this.report.errors.push(`Error fixing ${patternFile}: ${error}`);
      }
    }
  }

  /**
   * 🗑️ REMOVE UNUSED EXPORTS
   */
  private async removeUnusedExports(): Promise<void> {
    console.log('🗑️ Removing unused exports...');
    
    // Remove obvious unused exports
    const filesToClean = [
      'utils/web8-utils.ts',
      'types/style-props.ts'
    ];
    
    for (const file of filesToClean) {
      const fullPath = join(PROJECT_ROOT, file);
      if (existsSync(fullPath)) {
        try {
          const content = readFileSync(fullPath, 'utf-8');
          
          // Remove specific unused exports
          const cleanedContent = content
            .replace(/export const WEB8_CONFIG = {[\s\S]*?};/g, '// Removed unused export: WEB8_CONFIG')
            .replace(/export const logWeb8Status = [\s\S]*?};/g, '// Removed unused export: logWeb8Status')
            .replace(/export const combineClasses = [\s\S]*?};/g, '// Removed unused export: combineClasses');
          
          if (cleanedContent !== content) {
            writeFileSync(fullPath, cleanedContent);
            this.report.removedExports.push(`${file}: Removed unused exports`);
          }
        } catch (error) {
          this.report.errors.push(`Error cleaning exports in ${file}: ${error}`);
        }
      }
    }
  }

  /**
   * 🔗 UPDATE PATH ALIASES  
   */
  private async updatePathAliases(): Promise<void> {
    console.log('🔗 Updating path aliases...');
    
    // Find files that should use path aliases
    const sourceFiles = await glob('**/*.{ts,tsx}', {
      cwd: PROJECT_ROOT,
      ignore: ['node_modules/**', '.next/**', 'dist/**', 'build/**']
    });
    
    for (const file of sourceFiles) {
      try {
        const content = readFileSync(join(PROJECT_ROOT, file), 'utf-8');
        
        // Convert relative imports to absolute where beneficial
        const updatedContent = content
          .replace(/from ['"]\.\.\/\.\.\/lib\//g, "from '@/lib/")
          .replace(/from ['"]\.\.\/\.\.\/components\//g, "from '@/components/")
          .replace(/from ['"]\.\.\/\.\.\/types\//g, "from '@/types/")
          .replace(/from ['"]\.\.\/\.\.\/utils\//g, "from '@/utils/");
        
        if (updatedContent !== content) {
          writeFileSync(join(PROJECT_ROOT, file), updatedContent);
          this.report.fixedImports.push(`${file}: Updated to use path aliases`);
        }
      } catch (error) {
        this.report.errors.push(`Error updating aliases in ${file}: ${error}`);
      }
    }
  }

  /**
   * 🔍 CHECK IF FILE IS IMPORTED
   */
  private async isFileImported(filePath: string): Promise<boolean> {
    const allFiles = await glob('**/*.{ts,tsx,js,jsx}', {
      cwd: PROJECT_ROOT,
      ignore: ['node_modules/**', '.next/**', 'dist/**', 'build/**']
    });
    
    const fileName = filePath.replace(/\.[^.]*$/, '');
    
    for (const file of allFiles) {
      if (file === filePath) continue;
      
      try {
        const content = readFileSync(join(PROJECT_ROOT, file), 'utf-8');
        if (content.includes(fileName) || content.includes(filePath)) {
          return true;
        }
      } catch (error) {
        // Skip unreadable files
      }
    }
    
    return false;
  }

  /**
   * 📋 PRINT CLEANUP REPORT
   */
  public printReport(report: CleanupReport): void {
    console.log(`\n${  '='.repeat(80)}`);
    console.log('🧹 PROJECT CLEANUP REPORT');
    console.log('='.repeat(80));

    console.log(`\n📁 DELETED FILES: ${report.deletedFiles.length}`);
    report.deletedFiles.forEach(file => console.log(`   🗑️ ${file}`));

    console.log(`\n🔧 FIXED IMPORTS: ${report.fixedImports.length}`);
    report.fixedImports.forEach(fix => console.log(`   ✅ ${fix}`));

    console.log(`\n🗑️ REMOVED EXPORTS: ${report.removedExports.length}`);
    report.removedExports.forEach(exp => console.log(`   ❌ ${exp}`));

    if (report.errors.length > 0) {
      console.log(`\n❌ ERRORS: ${report.errors.length}`);
      report.errors.forEach(error => console.log(`   ⚠️ ${error}`));
    }

    console.log(`\n${  '='.repeat(80)}`);
    console.log('✅ PROJECT CLEANUP COMPLETE');
    console.log(`${'='.repeat(80)  }\n`);
  }
}

/**
 * 🚀 MAIN EXECUTION
 */
async function main(): Promise<void> {
  try {
    const cleaner = new ProjectCleaner();
    const report = await cleaner.cleanup();
    cleaner.printReport(report);

    console.log('💡 Next steps:');
    console.log('   1. Run yarn paths:check to verify improvements');
    console.log('   2. Test the application to ensure everything works');
    console.log('   3. Commit the cleanup changes');
    console.log('   4. Set up automated cleanup script in package.json');
  } catch (error) {
    console.error('💥 Cleanup failed with error:', error);
    process.exit(1);
  }
}

// Execute main function
main();

export { ProjectCleaner };



import * as fs from 'fs';
import * as path from 'path';

function finalCleanup(content: string): string {
  let fixed = content;
  
  // Fix missing closing parentheses and brackets
  fixed = fixed.replace(/`[^`]*\$\{[^}]*\}[^`]*`\}/g, (match) => {
    if (match.endsWith('`}')) {
      return match.slice(0, -1); // Remove extra }
    }
    return match;
  });
  
  // Fix incomplete map functions
  fixed = fixed.replace(/\.map\(term => `[^`]*\$\{[^}]*\}[^`]*`$/gm, (match) => {
    return match + '))';
  });
  
  // Fix incomplete object property assignments
  fixed = fixed.replace(/^\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:\s*`[^`]*\$\{[^}]*\}[^`]*`\}?$/gm, (match, propName) => {
    if (match.includes('}')) {
      return match.replace(/\}$/, '');
    }
    return match;
  });
  
  // Fix incomplete catch blocks with placeholder variables
  fixed = fixed.replace(/catch\s*\(\$\d+\)/g, 'catch (error)');
  
  // Fix missing closing brackets for arrays and objects
  fixed = fixed.replace(/push\(\.\.\.[^)]*\.map\([^)]*`[^`]*`$/gm, (match) => {
    return match + '))';
  });
  
  // Fix incomplete string patterns at end of lines
  fixed = fixed.replace(/`[^`]*\$\{[^}]*\}[^`]*$/gm, (match) => {
    return match + '`';
  });
  
  return fixed;
}

function processTypeScriptFile(filePath: string): boolean {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const original = content;
    
    content = finalCleanup(content);
    
    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log('🧹 Final cleanup: ' + path.basename(filePath));
      return true;
    }
    
    return false;
  } catch (error) {
    return false;
  }
}

function scanForFinalCleanup(dir: string): number {
  let fixed = 0;
  
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
        fixed += scanForFinalCleanup(fullPath);
      } else if (entry.isFile() && (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx'))) {
        if (processTypeScriptFile(fullPath)) {
          fixed++;
        }
      }
    }
  } catch (e) {
    // Skip unreadable directories
  }
  
  return fixed;
}

console.log('🧹 Final TypeScript Cleanup Starting...');
const totalFixed = scanForFinalCleanup(process.cwd());
console.log('');
console.log('🧹 Final Cleanup Complete!');
console.log('✨ Final cleanup applied to ' + totalFixed + ' files');
console.log('🚀 EuroWeb Platform should be much cleaner now!');

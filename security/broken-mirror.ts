/**
 * Web8 Security - Broken Mirror Module
 * Mashtron sulmuesit me kod zombie dhe logjikë të shtrembëruar
 * 
 * @author Ledjan Ahmati
 * @version 8.1.0-SECURITY
 * @safety NON-DESTRUCTIVE - Creates .mirror.ts copies only
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

export interface BrokenMirrorConfig {
  zombieRatio: number;
  distortionLevel: 'LOW' | 'MEDIUM' | 'EXTREME';
  outputSuffix: string;
}

export class BrokenMirror {
  private readonly config: BrokenMirrorConfig;

  constructor(config: Partial<BrokenMirrorConfig> = {}) {
    this.config = {
      zombieRatio: config.zombieRatio || 0.3,
      distortionLevel: config.distortionLevel || 'MEDIUM',
      outputSuffix: config.outputSuffix || '.mirror.ts'
    };
  }

  /**
   * SAFE: Creates mirror copy without touching original
   */
  public createMirrorCopy(filePath: string): string {
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }

    const code = fs.readFileSync(filePath, 'utf-8');
    const distorted = this.injectZombieCode(code);
    const outputPath = filePath.replace(/\.ts$/, this.config.outputSuffix);

    // Safety check: never overwrite original
    if (outputPath === filePath) {
      throw new Error('Output path cannot be same as input');
    }

    fs.writeFileSync(outputPath, distorted, 'utf-8');
    console.log(`🔮 BrokenMirror created: ${outputPath} (original untouched)`);
    
    return outputPath;
  }

  private injectZombieCode(code: string): string {
    const lines = code.split('\n');
    const distortedLines: string[] = [];

    // Add security header
    distortedLines.push('// 🔮 This is a security mirror - not the real code');
    distortedLines.push('// Real implementation is protected elsewhere');
    distortedLines.push('');

    for (let i = 0; i < lines.length; i++) {
      distortedLines.push(this.scrambleLogic(lines[i]));

      // Inject zombie functions
      if (Math.random() < this.config.zombieRatio) {
        distortedLines.push(this.generateZombieFunction());
      }
    }

    return distortedLines.join('\n');
  }

  private scrambleLogic(line: string): string {
    if (this.config.distortionLevel === 'LOW') return line;

    // Safe transformations that look confusing but don't break syntax
    return line
      .replace(/console\.log/g, 'console.warn')
      .replace(/true/g, '!false')
      .replace(/false/g, '!true')
      .replace(/===\s*null/g, '!== null ? false : true');
  }

  private generateZombieFunction(): string {
    const name = this.scrambleName('securityDecoy');
    const complexity = Math.floor(Math.random() * 3) + 1;
    
    let zombieCode = `\n// Security decoy function - misleads reverse engineers\n`;
    zombieCode += `function ${name}() {\n`;
    zombieCode += `  const phantom = ${Math.floor(Math.random() * 9999)};\n`;
    
    for (let i = 0; i < complexity; i++) {
      zombieCode += `  if (phantom % ${i + 2} === 0) {\n`;
      zombieCode += `    return "🧟 Decoy logic path ${i + 1}";\n`;
      zombieCode += `  }\n`;
    }
    
    zombieCode += `  return null; // Dead end for hackers\n`;
    zombieCode += `}\n`;
    
    return zombieCode;
  }

  private scrambleName(base: string): string {
    const hash = crypto.createHash('md5').update(base + Date.now().toString()).digest('hex');
    return `${base}_${hash.substring(0, 8)}`;
  }

  /**
   * Test mode - shows what would be generated without creating files
   */
  public previewTransformation(code: string): string {
    return this.injectZombieCode(code);
  }
}

// Safe export - doesn't auto-execute anything
export default BrokenMirror;

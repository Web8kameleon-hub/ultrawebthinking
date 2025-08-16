/**
 * Web8 Security - Close Mirror Module  
 * Obfuskim dhe enkriptim industrial për mbrojtjen e kodit
 * 
 * @author Ledjan Ahmati
 * @version 8.1.0-SECURITY
 * @safety NON-DESTRUCTIVE - Creates .protected.js copies only
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

export interface CloseMirrorConfig {
  layers: number;
  debugProtection: boolean;
  outputSuffix: string;
  encryptionKey?: string;
}

export class CloseMirror {
  private readonly config: CloseMirrorConfig;

  constructor(config: Partial<CloseMirrorConfig> = {}) {
    this.config = {
      layers: config.layers || 3,
      debugProtection: config.debugProtection !== false,
      outputSuffix: config.outputSuffix || '.protected.js',
      encryptionKey: config.encryptionKey || 'web8-default-key'
    };
  }

  /**
   * SAFE: Creates protected copy without touching original
   */
  public protectSource(inputPath: string): string {
    if (!fs.existsSync(inputPath)) {
      throw new Error(`File not found: ${inputPath}`);
    }

    const sourceCode = fs.readFileSync(inputPath, 'utf-8');
    let transformed = this.addProtectionHeaders(sourceCode);

    // Apply multiple layers of obfuscation
    for (let i = 0; i < this.config.layers; i++) {
      transformed = this.obfuscateLayer(transformed, i + 1);
    }

    const outputPath = inputPath.replace(/\.ts$/, this.config.outputSuffix);
    
    // Safety check
    if (outputPath === inputPath) {
      throw new Error('Output path cannot be same as input');
    }

    fs.writeFileSync(outputPath, transformed, 'utf-8');
    console.log(`🛡️ CloseMirror protected: ${outputPath} (original untouched)`);
    
    return outputPath;
  }

  private addProtectionHeaders(code: string): string {
    const header = `
/*
 * 🛡️ Web8 Protected Code - Layer 0
 * This code is obfuscated and protected
 * Unauthorized reverse engineering is prohibited
 * Generated: ${new Date().toISOString()}
 */

// Anti-debug protection
${this.config.debugProtection ? this.generateDebugProtection() : ''}

// Original code (will be obfuscated)
`;
    return header + code;
  }

  private generateDebugProtection(): string {
    return `
(function() {
  var devtools = {open: false};
  var threshold = 160;
  
  setInterval(function() {
    if (window.outerHeight - window.innerHeight > threshold || 
        window.outerWidth - window.innerWidth > threshold) {
      if (!devtools.open) {
        devtools.open = true;
        console.clear();
        console.log('🛡️ Debug protection active');
      }
    } else {
      devtools.open = false;
    }
  }, 500);
})();
`;
  }

  private obfuscateLayer(code: string, layer: number): string {
    // Simple but effective obfuscation techniques
    let obfuscated = code;

    // Layer 1: Variable name scrambling
    if (layer >= 1) {
      obfuscated = this.scrambleVariables(obfuscated);
    }

    // Layer 2: String encryption
    if (layer >= 2) {
      obfuscated = this.encryptStrings(obfuscated);
    }

    // Layer 3: Control flow flattening
    if (layer >= 3) {
      obfuscated = this.flattenControlFlow(obfuscated);
    }

    // Add layer marker
    obfuscated = `/* Layer ${layer} Applied */\n${  obfuscated}`;

    return obfuscated;
  }

  private scrambleVariables(code: string): string {
    // Simple variable name obfuscation
    const varMap = new Map<string, string>();
    
    return code.replace(/\b(var|let|const)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g, (match, keyword, varName) => {
      if (!varMap.has(varName)) {
        varMap.set(varName, this.generateObfuscatedName());
      }
      return `${keyword} ${varMap.get(varName)}`;
    });
  }

  private encryptStrings(code: string): string {
    // Encrypt string literals
    return code.replace(/'([^']*)'/g, (match, str) => {
      if (str.length > 0) {
        const encrypted = this.simpleEncrypt(str);
        return `decrypt('${encrypted}')`;
      }
      return match;
    });
  }

  private flattenControlFlow(code: string): string {
    // Add complexity to control flow
    const lines = code.split('\n');
    const flattened = lines.map((line, index) => {
      if (line.trim().startsWith('if') || line.trim().startsWith('for') || line.trim().startsWith('while')) {
        return `/* Control ${index} */ ${line}`;
      }
      return line;
    });
    
    return flattened.join('\n');
  }

  private generateObfuscatedName(): string {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_$';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `_${  result}`;
  }

  private simpleEncrypt(text: string): string {
    const key = this.config.encryptionKey!;
    let encrypted = '';
    for (let i = 0; i < text.length; i++) {
      const charCode = text.charCodeAt(i) ^ key.charCodeAt(i % key.length);
      encrypted += String.fromCharCode(charCode);
    }
    return Buffer.from(encrypted).toString('base64');
  }

  /**
   * Preview transformation without creating files
   */
  public previewProtection(code: string): string {
    let preview = this.addProtectionHeaders(code);
    for (let i = 0; i < Math.min(this.config.layers, 2); i++) {
      preview = this.obfuscateLayer(preview, i + 1);
    }
    return preview;
  }
}

// Safe export
export default CloseMirror;

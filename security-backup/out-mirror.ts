/**
 * Web8 Security - Out Mirror Module
 * Filtron dhe mbron DOM-in nga ekspozimi i burimeve
 * 
 * @author Ledjan Ahmati  
 * @version 8.1.0-SECURITY
 * @safety NON-DESTRUCTIVE - Creates .secure.html copies only
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

export interface OutMirrorConfig {
  whitelistCDNs: string[];
  outputSuffix: string;
  generateCSP: boolean;
  removeDangerousElements: boolean;
}

export class OutMirror {
  private readonly config: OutMirrorConfig;

  constructor(config: Partial<OutMirrorConfig> = {}) {
    this.config = {
      whitelistCDNs: config.whitelistCDNs || [
        'https://cdn.jsdelivr.net',
        'https://cdnjs.cloudflare.com',
        'https://unpkg.com'
      ],
      outputSuffix: config.outputSuffix || '.secure.html',
      generateCSP: config.generateCSP !== false,
      removeDangerousElements: config.removeDangerousElements !== false
    };
  }

  /**
   * SAFE: Creates secure copy without touching original
   */
  public async secureHTML(inputPath: string): Promise<string> {
    if (!fs.existsSync(inputPath)) {
      throw new Error(`File not found: ${inputPath}`);
    }

    const html = fs.readFileSync(inputPath, 'utf-8');
    const securedHTML = await this.processHTML(html);
    
    const outputPath = inputPath.replace(/\.html$/, this.config.outputSuffix);
    
    // Safety check
    if (outputPath === inputPath) {
      throw new Error('Output path cannot be same as input');
    }

    fs.writeFileSync(outputPath, securedHTML, 'utf-8');
    console.log(`🧼 OutMirror secured: ${outputPath} (original untouched)`);
    
    return outputPath;
  }

  private async processHTML(html: string): Promise<string> {
    // Simple HTML processing (without JSDOM dependency for safety)
    let secured = html;

    // Add security headers
    secured = this.addSecurityHeaders(secured);

    // Remove dangerous inline scripts if enabled
    if (this.config.removeDangerousElements) {
      secured = this.removeDangerousElements(secured);
    }

    // Add CSP if enabled
    if (this.config.generateCSP) {
      secured = this.addCSP(secured);
    }

    return secured;
  }

  private addSecurityHeaders(html: string): string {
    const securityComment = `
<!-- 🛡️ Web8 Security Enhanced HTML -->
<!-- Generated: ${new Date().toISOString()} -->
<!-- Original sources protected -->

`;
    
    // Insert after <!DOCTYPE> or at beginning
    if (html.includes('<!DOCTYPE')) {
      return html.replace(/<!DOCTYPE[^>]*>\s*/, `$&${  securityComment}`);
    }
    
    return securityComment + html;
  }

  private removeDangerousElements(html: string): string {
    // Remove potentially dangerous inline scripts
    let cleaned = html;
    
    // Remove inline event handlers (simple regex approach)
    cleaned = cleaned.replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, '');
    
    // Comment out inline scripts
    cleaned = cleaned.replace(/<script(?![^>]*src=)[^>]*>[\s\S]*?<\/script>/gi, (match) => {
      return `<!-- SECURITY: Inline script removed -->\n<!-- ${match.replace(/--/g, '- -')} -->\n`;
    });
    
    return cleaned;
  }

  private addCSP(html: string): string {
    const nonce = this.generateNonce();
    const cspPolicy = this.generateCSPPolicy(nonce);
    
    const metaTag = `\n<meta http-equiv="Content-Security-Policy" content="${cspPolicy}">\n`;
    
    // Insert in head section
    if (html.includes('<head>')) {
      return html.replace('<head>', `<head>${  metaTag}`);
    }
    
    // If no head, insert after html tag
    if (html.includes('<html>')) {
      return html.replace('<html>', `<html>${  metaTag}`);
    }
    
    // Fallback: prepend to document
    return metaTag + html;
  }

  private generateCSPPolicy(nonce: string): string {
    const allowedSources = [
      "'self'",
      ...this.config.whitelistCDNs,
      `'nonce-${nonce}'`
    ].join(' ');

    return [
      `script-src ${allowedSources}`,
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'"
    ].join('; ');
  }

  private generateNonce(): string {
    return crypto.randomBytes(16).toString('base64');
  }

  /**
   * Preview what security changes would be applied
   */
  public previewSecurity(html: string): string {
    const preview = this.addSecurityHeaders(html);
    return this.addCSP(preview);
  }

  /**
   * Analyze HTML for potential security issues
   */
  public analyzeHTML(html: string): {
    inlineScripts: number;
    externalScripts: number;
    eventHandlers: number;
    unsafeElements: string[];
  } {
    const inlineScripts = (html.match(/<script(?![^>]*src=)[^>]*>/gi) || []).length;
    const externalScripts = (html.match(/<script[^>]*src=/gi) || []).length;
    const eventHandlers = (html.match(/\s*on\w+\s*=/gi) || []).length;
    
    const unsafeElements: string[] = [];
    if (inlineScripts > 0) unsafeElements.push(`${inlineScripts} inline scripts`);
    if (eventHandlers > 0) unsafeElements.push(`${eventHandlers} event handlers`);
    
    return {
      inlineScripts,
      externalScripts,
      eventHandlers,
      unsafeElements
    };
  }
}

// Safe export
export default OutMirror;

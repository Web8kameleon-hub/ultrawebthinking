/**
 * Web8 Security - Intrusion Responder  
 * Sistem reagimi aktiv ndaj ndërhyrjeve dhe sulmeve
 * 
 * @author Ledjan Ahmati
 * @version 8.1.0-SECURITY
 * @safety BROWSER-SIDE ONLY - No server files modified
 */

export interface IntrusionConfig {
  sensitivityLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'EXTREME';
  responseMode: 'LOG' | 'WARN' | 'REDIRECT' | 'DESTRUCT';
  honeypotURL?: string;
  allowedDevTools: boolean;
}

export class IntrusionResponder {
  private static instance: IntrusionResponder;
  private readonly config: IntrusionConfig;
  private monitoring = false;
  private readonly intrusions: Array<{type: string, timestamp: Date, details: string}> = [];

  constructor(config: Partial<IntrusionConfig> = {}) {
    this.config = {
      sensitivityLevel: config.sensitivityLevel || 'MEDIUM',
      responseMode: config.responseMode || 'WARN',
      honeypotURL: config.honeypotURL || '/security-notice.html',
      allowedDevTools: config.allowedDevTools !== false
    };
  }

  public static getInstance(config?: Partial<IntrusionConfig>): IntrusionResponder {
    if (!IntrusionResponder.instance) {
      IntrusionResponder.instance = new IntrusionResponder(config);
    }
    return IntrusionResponder.instance;
  }

  /**
   * Start monitoring for intrusions
   */
  public startMonitoring(): void {
    if (this.monitoring) {
      console.warn('🛡️ Intrusion monitoring already active');
      return;
    }

    this.monitoring = true;
    console.log('🛡️ Web8 Security: Intrusion monitoring started');

    // Only start if in browser environment
    if (typeof window !== 'undefined') {
      this.detectDevTools();
      this.observeDOMTampering();
      this.monitorNetworkActivity();
      this.detectUnauthorizedScripts();
    }
  }

  public stopMonitoring(): void {
    this.monitoring = false;
    console.log('🛡️ Intrusion monitoring stopped');
  }

  /**
   * DevTools detection
   */
  private detectDevTools(): void {
    if (this.config.allowedDevTools) return;

    let devToolsOpen = false;
    const threshold = this.config.sensitivityLevel === 'EXTREME' ? 100 : 160;

    const detector = setInterval(() => {
      if (!this.monitoring) {
        clearInterval(detector);
        return;
      }

      const widthDiff = window.outerWidth - window.innerWidth;
      const heightDiff = window.outerHeight - window.innerHeight;
      
      if (widthDiff > threshold || heightDiff > threshold) {
        if (!devToolsOpen) {
          devToolsOpen = true;
          this.reportIntrusion('DevTools', 'Developer tools detected');
        }
      } else {
        devToolsOpen = false;
      }
    }, 1000);
  }

  /**
   * DOM tampering detection
   */
  private observeDOMTampering(): void {
    if (typeof MutationObserver === 'undefined') return;

    const observer = new MutationObserver((mutations) => {
      if (!this.monitoring) return;

      let suspiciousChanges = 0;
      mutations.forEach(mutation => {
        // Check for suspicious script injections
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach(node => {
            if (node.nodeType === 1) { // Element node
              const element = node as Element;
              if (element.tagName === 'SCRIPT' || 
                  element.innerHTML.includes('<script') ||
                  element.getAttribute('onload') ||
                  element.getAttribute('onerror')) {
                suspiciousChanges++;
              }
            }
          });
        }
      });

      if (suspiciousChanges > 0) {
        this.reportIntrusion('DOM_TAMPERING', `${suspiciousChanges} suspicious DOM changes detected`);
      }
    });

    observer.observe(document, { 
      childList: true, 
      subtree: true, 
      attributes: true,
      attributeFilter: ['onload', 'onerror', 'onclick']
    });
  }

  /**
   * Monitor network activity for unauthorized requests
   */
  private monitorNetworkActivity(): void {
    // Override fetch to monitor requests
    const originalFetch = window.fetch;
    window.fetch = (...args) => {
      if (this.monitoring) {
        const url = args[0] as string;
        if (this.isUnauthorizedRequest(url)) {
          this.reportIntrusion('UNAUTHORIZED_REQUEST', `Blocked request to: ${url}`);
          return Promise.reject(new Error('Request blocked by security'));
        }
      }
      return originalFetch.apply(window, args);
    };
  }

  /**
   * Detect unauthorized script loading
   */
  private detectUnauthorizedScripts(): void {
    const originalAppendChild = Node.prototype.appendChild;
    
    Node.prototype.appendChild = function<T extends Node>(newChild: T): T {
      if (IntrusionResponder.instance?.monitoring) {
        if (newChild.nodeType === 1) { // Element
          const element = newChild as unknown as Element;
          if (element.tagName === 'SCRIPT') {
            const src = element.getAttribute('src');
            if (src && IntrusionResponder.instance.isUnauthorizedScript(src)) {
              IntrusionResponder.instance.reportIntrusion('UNAUTHORIZED_SCRIPT', `Blocked script: ${src}`);
              return newChild; // Don't actually append
            }
          }
        }
      }
      return originalAppendChild.call(this, newChild) as T;
    };
  }

  /**
   * Check if request is unauthorized
   */
  private isUnauthorizedRequest(url: string): boolean {
    const suspiciousPatterns = [
      /eval\(/,
      /javascript:/,
      /data:text\/html/,
      /vbscript:/,
      /file:\/\//
    ];

    return suspiciousPatterns.some(pattern => pattern.test(url));
  }

  /**
   * Check if script source is unauthorized
   */
  private isUnauthorizedScript(src: string): boolean {
    // Allow same origin and common CDNs
    const allowedDomains = [
      window.location.origin,
      'https://cdn.jsdelivr.net',
      'https://cdnjs.cloudflare.com',
      'https://unpkg.com'
    ];

    return !allowedDomains.some(domain => src.startsWith(domain));
  }

  /**
   * Report and respond to intrusion
   */
  private reportIntrusion(type: string, details: string): void {
    const intrusion = {
      type,
      timestamp: new Date(),
      details
    };

    this.intrusions.push(intrusion);
    console.warn(`🚨 Security Intrusion: ${type} - ${details}`);

    // Respond based on configuration
    switch (this.config.responseMode) {
      case 'LOG':
        // Just log, no action
        break;
        
      case 'WARN':
        this.showWarning(type, details);
        break;
        
      case 'REDIRECT':
        if (this.config.honeypotURL) {
          window.location.href = this.config.honeypotURL;
        }
        break;
        
      case 'DESTRUCT':
        this.selfDestruct();
        break;
    }
  }

  /**
   * Show security warning
   */
  private showWarning(type: string, details: string): void {
    const warning = document.createElement('div');
    warning.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      background: #ff4444;
      color: white;
      padding: 10px;
      text-align: center;
      z-index: 99999;
      font-family: monospace;
    `;
    warning.innerHTML = `🛡️ Security Notice: ${type} detected. Access is being monitored.`;
    
    document.body.appendChild(warning);
    
    setTimeout(() => {
      if (warning.parentNode) {
        warning.parentNode.removeChild(warning);
      }
    }, 5000);
  }

  /**
   * Emergency self-destruct
   */
  private selfDestruct(): void {
    console.warn('🚨 SECURITY: Application self-destruct activated');
    
    // Clear sensitive data
    sessionStorage.clear();
    localStorage.clear();
    
    // Clear page content
    document.body.innerHTML = `
      <div style="
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        background: #000;
        color: #ff4444;
        font-family: monospace;
        text-align: center;
      ">
        <div>
          <h1>🛡️ SECURITY PROTOCOL ACTIVATED</h1>
          <p>Unauthorized access detected.</p>
          <p>Application has been secured.</p>
        </div>
      </div>
    `;
  }

  /**
   * Get intrusion report
   */
  public getIntrusionReport(): {
    total: number;
    byType: Record<string, number>;
    recent: Array<{type: string, timestamp: Date, details: string}>;
  } {
    const byType: Record<string, number> = {};
    
    this.intrusions.forEach(intrusion => {
      byType[intrusion.type] = (byType[intrusion.type] || 0) + 1;
    });

    return {
      total: this.intrusions.length,
      byType,
      recent: this.intrusions.slice(-10)
    };
  }
}

// Browser-side auto-initialization (optional)
if (typeof window !== 'undefined') {
  // Auto-start with default config if enabled
  window.addEventListener('DOMContentLoaded', () => {
    // Only auto-start if explicitly enabled
    if ((window as any).WEB8_SECURITY_AUTO_START) {
      const responder = IntrusionResponder.getInstance();
      responder.startMonitoring();
    }
  });
}

export default IntrusionResponder;

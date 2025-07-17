// Dynamic Panda CSS tokens controlled by AGI memory
import { agiCore } from './AGICore';

export interface DynamicTokens {
  'colors.primary': string;
  'colors.secondary': string;
  'colors.accent': string;
  'colors.background': string;
  'spacing.active': string;
  'opacity.element': string;
  'transform.scale': string;
  'animation.duration': string;
}

class PandaTokenController {
  private root: HTMLElement | null = null;
  private currentTokens: Partial<DynamicTokens> = {};

  constructor() {
    if (typeof window !== 'undefined') {
      this.root = document.documentElement;
      this.initializeTokens();
      this.subscribeToAGI();
    }
  }

  private initializeTokens(): void {
    const memory = agiCore.getMemory();
    this.updateTokensFromMemory(memory);
  }

  private subscribeToAGI(): void {
    agiCore.subscribe(() => {
      const memory = agiCore.getMemory();
      this.updateTokensFromMemory(memory);
    });
  }

  private updateTokensFromMemory(memory: any): void {
    const newTokens: Partial<DynamicTokens> = {};

    // Theme-based colors - më të buta dhe më user-friendly
    switch (memory.ui.theme) {
      case 'nature':
        newTokens['colors.primary'] = '#4f46e5'; // Indigo të butë
        newTokens['colors.secondary'] = '#10b981'; // Emerald të butë
        newTokens['colors.accent'] = '#06b6d4'; // Cyan të butë
        newTokens['colors.background'] = 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)'; // Gradient i butë
        break;
      case 'dark':
        newTokens['colors.primary'] = '#6366f1'; // Indigo i ndritshëm
        newTokens['colors.secondary'] = '#34d399'; // Emerald i ndritshëm  
        newTokens['colors.accent'] = '#22d3ee'; // Cyan i ndritshëm
        newTokens['colors.background'] = 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)'; // Dark gradient
        break;
      case 'warm':
        newTokens['colors.primary'] = '#f59e0b'; // Amber
        newTokens['colors.secondary'] = '#ef4444'; // Red të butë
        newTokens['colors.accent'] = '#ec4899'; // Pink të butë
        newTokens['colors.background'] = 'linear-gradient(135deg, #fef3c7 0%, #fed7aa 100%)'; // Warm gradient
        break;
      default:
        newTokens['colors.primary'] = '#6366f1'; // Indigo default
        newTokens['colors.secondary'] = '#10b981'; // Emerald default
        newTokens['colors.accent'] = '#06b6d4'; // Cyan default
        newTokens['colors.background'] = 'linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%)'; // Clean gradient
        break;
    }

    // AGI status-based animations
    switch (memory.agi.status) {
      case 'ACTIVE':
        newTokens['animation.duration'] = '0.3s';
        newTokens['opacity.element'] = '1';
        newTokens['transform.scale'] = '1';
        break;
      case 'PROCESSING':
        newTokens['animation.duration'] = '0.8s';
        newTokens['opacity.element'] = '0.8';
        newTokens['transform.scale'] = '1.02';
        break;
      case 'IDLE':
        newTokens['animation.duration'] = '1.2s';
        newTokens['opacity.element'] = '0.6';
        newTokens['transform.scale'] = '0.98';
        break;
    }

    // Active tab spacing
    newTokens['spacing.active'] = memory.ui.activeTab === 'agi-dashboard' ? '24px' : '16px';

    this.applyTokens(newTokens);
  }

  private applyTokens(tokens: Partial<DynamicTokens>): void {
    if (!this.root) return;

    Object.entries(tokens).forEach(([key, value]) => {
      if (this.currentTokens[key as keyof DynamicTokens] !== value) {
        const cssVar = `--${key.replace('.', '-')}`;
        this.root!.style.setProperty(cssVar, value);
        this.currentTokens[key as keyof DynamicTokens] = value;
      }
    });
  }

  // Manual token updates
  public setToken(key: keyof DynamicTokens, value: string): void {
    if (!this.root) return;
    
    const cssVar = `--${key.replace('.', '-')}`;
    this.root.style.setProperty(cssVar, value);
    this.currentTokens[key] = value;
  }

  public getToken(key: keyof DynamicTokens): string {
    return this.currentTokens[key] || '';
  }

  // Utility methods for common UI patterns
  public activateElement(elementId: string): void {
    const element = document.getElementById(elementId);
    if (element) {
      element.style.transform = `scale(${this.getToken('transform.scale')})`;
      element.style.opacity = this.getToken('opacity.element');
      element.style.transition = `all ${this.getToken('animation.duration')} ease`;
    }
  }

  public pulseElement(elementId: string): void {
    const element = document.getElementById(elementId);
    if (element) {
      element.style.animation = `pulse ${this.getToken('animation.duration')} infinite alternate`;
    }
  }
}

// Global token controller
export const pandaTokens = new PandaTokenController();

// CSS for dynamic animations (to be added to global styles)
export const dynamicStyles = `
  @keyframes pulse {
    0% { opacity: var(--opacity-element); transform: scale(1); }
    100% { opacity: 1; transform: scale(var(--transform-scale)); }
  }

  .agi-reactive {
    transition: all var(--animation-duration) ease;
    opacity: var(--opacity-element);
    transform: scale(var(--transform-scale));
  }

  .agi-bg {
    background-color: var(--colors-background);
    transition: background-color var(--animation-duration) ease;
  }

  .agi-primary {
    color: var(--colors-primary);
    transition: color var(--animation-duration) ease;
  }

  .agi-accent {
    border-color: var(--colors-accent);
    transition: border-color var(--animation-duration) ease;
  }

  .agi-active {
    padding: var(--spacing-active);
    transition: padding var(--animation-duration) ease;
  }
`;

export default PandaTokenController;

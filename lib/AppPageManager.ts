/**
 * AppPageManager.ts
 * Pure TypeScript Application Page Manager with CSS Modules
 * Uses framer-motion and class-variance-authority
 */

import { cva } from 'class-variance-authority';
import { motion } from 'framer-motion';
import { ReactNode, Suspense, createElement, lazy } from 'react';
import styles from './AppPageManager.module.css';

// Page Definition Interface
export interface PageDefinition {
  path: string;
  title: string;
  element: ReactNode;
  layout: 'default' | 'minimal' | 'fullscreen';
  meta?: {
    description?: string;
    keywords?: string[];
    noIndex?: boolean;
  };
}

// Motion Wrapper Variants using CVA
const motionWrapperVariants = cva(styles.pageWrapper, {
  variants: {
    layout: {
      default: styles.layoutDefault,
      minimal: styles.layoutMinimal,
      fullscreen: styles.layoutFullscreen
    }
  },
  defaultVariants: {
    layout: 'default'
  }
});

// Simple Loader Component (pure CSS)
export const Loader = (): ReactNode =>
  createElement('div', { className: styles.loader },
    createElement('div', { className: styles.loaderSpinner }),
    createElement('span', { className: styles.loaderText }, 'Loading...')
  );

// Lazy loaded components - using named exports
const LazyUltraDashboard = lazy(() => import("@/pages/ultra-dashboard").then(m => ({ default: (m as any).default ?? (m as any).UltraSystemIntegration })));
const LazyLocationDemo = lazy(() => import("@/pages/location-demo").then(m => ({ default: (m as any).default ?? (m as any).LocationDemoPage })));
const LazyAviationWeather = lazy(() => import("@/pages/aviation-weather").then(m => ({ default: (m as any).default ?? (m as any).AviationPage })));
const LazyAGIOfficeSuite = lazy(() => import("@/pages/agi-office-suite").then(m => ({ default: (m as any).default ?? (m as any).AGIOfficeSuite })));
const LazyNavigationTest = lazy(() => import("@/pages/navigation-test").then(m => ({ default: (m as any).default ?? (m as any).NavigationTest })));
const LazyWeb8TabSystem = lazy(() => import("@/components/web8-tabs/ModernWeb8TabSystem").then(m => ({ default: (m as any).default ?? (m as any).ModernWeb8TabSystem })));

// Motion wrapper for page transitions
export const withMotion = (component: ReactNode, layout: PageDefinition['layout'] = 'default'): ReactNode =>
  createElement(motion.div, {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -12 },
    transition: { duration: 0.3 },
    className: motionWrapperVariants({ layout })
  }, component);

// Page definitions with proper typing
export const pageDefinitions: PageDefinition[] = [
  {
    path: '/ultra-dashboard',
    title: 'Ultra Dashboard - EuroWeb',
    element: createElement(Suspense, { fallback: createElement(Loader) }, createElement(LazyUltraDashboard)),
    layout: 'fullscreen',
    meta: {
      description: 'EuroWeb Ultra - Main Dashboard Integration',
      keywords: ['dashboard', 'ultra', 'quantum', 'agi', 'mesh']
    }
  },
  {
    path: '/location-demo',
    title: 'Location Demo - EuroWeb',
    element: createElement(Suspense, { fallback: createElement(Loader) }, createElement(LazyLocationDemo)),
    layout: 'fullscreen',
    meta: {
      description: 'Demonstration of configurable station locations',
      keywords: ['location', 'station', 'demo', 'mesh', 'gps']
    }
  },
  {
    path: '/aviation-weather',
    title: 'Aviation Weather Intelligence - EuroWeb',
    element: createElement(Suspense, { fallback: createElement(Loader) }, createElement(LazyAviationWeather)),
    layout: 'fullscreen',
    meta: {
      description: 'SAT + METAR/TAF + NWP → Airport Forecasts (0–48h)',
      keywords: ['aviation', 'weather', 'forecast', 'satellite', 'metar', 'taf', 'nwp']
    }
  },
  {
    path: '/agi-office-suite',
    title: 'AGI Office Suite Ultra - Universal Office Tools',
    element: createElement(Suspense, { fallback: createElement(Loader) }, createElement(LazyAGIOfficeSuite)),
    layout: 'fullscreen',
    meta: {
      description: 'Universal Office Suite - From Students to NATO Operations. AGISheet, AGIDoc, and AI-powered tools.',
      keywords: ['office', 'suite', 'spreadsheet', 'document', 'ai', 'collaboration', 'agi', 'nato', 'enterprise']
    }
  },
  {
    path: '/navigation-test',
    title: 'Navigation Test - EuroWeb Platform',
    element: createElement(Suspense, { fallback: createElement(Loader) }, createElement(LazyNavigationTest)),
    layout: 'fullscreen',
    meta: {
      description: 'Platform navigation test page',
      keywords: ['navigation', 'test', 'platform', 'routes']
    }
  },
  {
    path: '/web8-tabs',
    title: 'Web8TabSystem Ultra - Advanced Tab Management',
    element: createElement(Suspense, { fallback: createElement(Loader) }, createElement(LazyWeb8TabSystem)),
    layout: 'fullscreen',
    meta: {
      description: 'Advanced tab-based UI/UX management system unifying all major modules',
      keywords: ['web8', 'tabs', 'ui', 'ux', 'management', 'modules', 'advanced', 'unified']
    }
  }
];

// App Page Manager Class
export class AppPageManager {
  private currentPage = '/';
  private pages: Map<string, PageDefinition> = new Map();

  constructor() {
    this.initializePages();
  }

  private initializePages(): void {
    pageDefinitions.forEach(page => {
      this.pages.set(page.path, page);
    });
  }

  public getCurrentPage(): string {
    return this.currentPage;
  }

  public setCurrentPage(path: string): void {
    if (this.pages.has(path)) {
      this.currentPage = path;
      this.updateDocumentTitle(path);
    }
  }

  public getPageDefinition(path: string): PageDefinition | undefined {
    return this.pages.get(path);
  }

  public getAllPages(): PageDefinition[] {
    return Array.from(this.pages.values());
  }

  public renderPage(path: string): ReactNode {
    const page = this.pages.get(path);
    if (!page) {
      return this.renderNotFound();
    }

    return withMotion(page.element, page.layout);
  }

  private renderNotFound(): ReactNode {
    return withMotion(
      createElement('div', { className: styles.notFound },
        createElement('h1', null, '404'),
        createElement('p', null, 'Page not found')
      ),
      'minimal'
    );
  }

  private updateDocumentTitle(path: string): void {
    const page = this.pages.get(path);
    if (page && typeof document !== 'undefined') {
      document.title = page.title;

      // Update meta description if available
      if (page.meta?.description) {
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
          metaDescription.setAttribute('content', page.meta.description);
        }
      }
    }
  }

  public addPage(page: PageDefinition): void {
    this.pages.set(page.path, page);
  }

  public removePage(path: string): boolean {
    return this.pages.delete(path);
  }
}

// Default export for the singleton instance
export const appPageManager = new AppPageManager();



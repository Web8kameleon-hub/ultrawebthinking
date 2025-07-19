/**
 * EuroWeb Web8 - Industrial App Page Manager
 * Ultra-High Performance Page Management for app/ Directory
 * 
 * @module AppPageManager
 * @author Ledjan Ahmati (100% Owner)
 * @license MIT
 * @version 8.0.1 Industrial
 */

import React from 'react';
import { motion } from 'framer-motion';
import { css } from '../css';

// Industrial Page Types
export interface AppPage {
  id: string;
  route: string;
  title: string;
  component: React.ComponentType;
  metadata: PageMetadata;
  performance: PagePerformance;
  lastAccessed: number;
}

export interface PageMetadata {
  title: string;
  description: string;
  keywords: string[];
  author: string;
  version: string;
}

export interface PagePerformance {
  loadTime: number;
  renderTime: number;
  hydrationTime: number;
  memoryUsage: number;
}

export interface PageMotion {
  initial: Record<string, any>;
  animate: Record<string, any>;
  exit: Record<string, any>;
  transition: Record<string, any>;
}

/**
 * Industrial App Page Manager
 * Manages all pages in the app/ directory with industrial-grade performance
 */
export class AppPageManager {
  private static instance: AppPageManager;
  private pageRegistry = new Map<string, AppPage>();
  private performanceCache = new Map<string, PagePerformance>();
  private motionPresets = new Map<string, PageMotion>();

  private constructor() {
    this.initMotionPresets();
    this.registerDefaultPages();
  }

  public static getInstance(): AppPageManager {
    if (!AppPageManager.instance) {
      AppPageManager.instance = new AppPageManager();
    }
    return AppPageManager.instance;
  }

  /**
   * Initialize motion presets for different page types
   */
  private initMotionPresets(): void {
    // Standard page transition
    this.motionPresets.set('standard', {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -20 },
      transition: { duration: 0.3, ease: 'easeOut' }
    });

    // AGI/Tech pages with more dynamic animations
    this.motionPresets.set('agi', {
      initial: { opacity: 0, scale: 0.95, rotateX: 10 },
      animate: { opacity: 1, scale: 1, rotateX: 0 },
      exit: { opacity: 0, scale: 1.05, rotateX: -10 },
      transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }
    });

    // Performance dashboard animations
    this.motionPresets.set('dashboard', {
      initial: { opacity: 0, x: -50 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: 50 },
      transition: { duration: 0.25, ease: 'easeInOut', staggerChildren: 0.1 }
    });
  }

  /**
   * Register default app/ pages
   */
  private registerDefaultPages(): void {
    // Home page
    this.registerPage({
      id: 'home',
      route: '/',
      title: 'EuroWeb Web8 Platform',
      component: () => <div>Home Page</div>, // Placeholder
      metadata: {
        title: 'EuroWeb Web8 Platform - AGI-Powered Browser',
        description: 'Platforma më e avancuar për Web8 me AGI të integruar',
        keywords: ['euroweb', 'web8', 'agi', 'browser', 'platform'],
        author: 'Ledjan Ahmati',
        version: '8.0.1'
      },
      performance: this.createDefaultPerformance(),
      lastAccessed: Date.now()
    });

    // AGI Tunnel page
    this.registerPage({
      id: 'agi-tunnel',
      route: '/agi-tunnel',
      title: 'AGI Tunnel Visualization',
      component: () => <div>AGI Tunnel</div>, // Placeholder
      metadata: {
        title: 'AGI Tunnel - Neural Network Visualization',
        description: 'Vizualizimi i rrjetit neural AGI në kohë reale',
        keywords: ['agi', 'tunnel', 'neural', 'visualization', 'ai'],
        author: 'Ledjan Ahmati',
        version: '8.0.1'
      },
      performance: this.createDefaultPerformance(),
      lastAccessed: Date.now()
    });

    // OpenMind AI page
    this.registerPage({
      id: 'openmind',
      route: '/openmind',
      title: 'OpenMind AI Gateway',
      component: () => <div>OpenMind AI</div>, // Placeholder
      metadata: {
        title: 'OpenMind - Universal AI Gateway',
        description: 'Qasja universale për të gjitha shërbimet AI',
        keywords: ['openmind', 'ai', 'gateway', 'universal', 'claude', 'gpt'],
        author: 'Ledjan Ahmati',
        version: '8.0.1'
      },
      performance: this.createDefaultPerformance(),
      lastAccessed: Date.now()
    });
  }

  /**
   * Register a new page in the app/ directory
   */
  registerPage(page: AppPage): void {
    this.pageRegistry.set(page.id, page);
    console.log(`[APP PAGE REGISTERED] ${page.id} → ${page.route}`);
  }

  /**
   * Get page by ID
   */
  getPage(pageId: string): AppPage | null {
    return this.pageRegistry.get(pageId) || null;
  }

  /**
   * Get page by route
   */
  getPageByRoute(route: string): AppPage | null {
    for (const page of this.pageRegistry.values()) {
      if (page.route === route) {
        return page;
      }
    }
    return null;
  }

  /**
   * Create page wrapper with industrial optimizations
   */
  createPageWrapper(
    pageId: string, 
    children: React.ReactNode,
    motionType: 'standard' | 'agi' | 'dashboard' = 'standard'
  ): React.ReactElement {
    const page = this.getPage(pageId);
    const motion = this.motionPresets.get(motionType) || this.motionPresets.get('standard')!;
    
    if (!page) {
      throw new Error(`Page ${pageId} not registered`);
    }

    // Update last accessed time
    page.lastAccessed = Date.now();

    return (
      <motion.div
        className={css({
          minH: '100vh',
          position: 'relative'
        })}
        initial={motion.initial}
        animate={motion.animate}
        exit={motion.exit}
        transition={motion.transition}
      >
        {/* Page Metadata */}
        <head>
          <title>{page.metadata.title}</title>
          <meta name="description" content={page.metadata.description} />
          <meta name="keywords" content={page.metadata.keywords.join(', ')} />
          <meta name="author" content={page.metadata.author} />
          <meta name="version" content={page.metadata.version} />
        </head>

        {/* Page Content */}
        {children}

        {/* Performance Monitoring */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              console.log('[PAGE LOADED] ${pageId} at ${new Date().toISOString()}');
              performance.mark('${pageId}-loaded');
            `
          }}
        />
      </motion.div>
    );
  }

  /**
   * Get performance metrics for a page
   */
  getPerformanceMetrics(pageId: string): PagePerformance | null {
    return this.performanceCache.get(pageId) || null;
  }

  /**
   * Record performance metrics
   */
  recordPerformance(pageId: string, metrics: Partial<PagePerformance>): void {
    const existing = this.performanceCache.get(pageId) || this.createDefaultPerformance();
    const updated = { ...existing, ...metrics };
    this.performanceCache.set(pageId, updated);
    
    const page = this.getPage(pageId);
    if (page) {
      page.performance = updated;
    }
  }

  /**
   * Get all registered pages
   */
  getAllPages(): AppPage[] {
    return Array.from(this.pageRegistry.values());
  }

  /**
   * Create default performance object
   */
  private createDefaultPerformance(): PagePerformance {
    return {
      loadTime: 0,
      renderTime: 0,
      hydrationTime: 0,
      memoryUsage: 0
    };
  }

  /**
   * Clear performance cache
   */
  clearPerformanceCache(): void {
    this.performanceCache.clear();
  }

  /**
   * Get page navigation structure for sitemap/routing
   */
  getNavigationStructure(): Array<{ id: string; route: string; title: string }> {
    return this.getAllPages().map(page => ({
      id: page.id,
      route: page.route,
      title: page.title
    }));
  }
}

/**
 * Page wrapper component for use in app/ pages
 */
export const IndustrialPageWrapper: React.FC<{
  pageId: string;
  motionType?: 'standard' | 'agi' | 'dashboard';
  children: React.ReactNode;
}> = ({ pageId, motionType = 'standard', children }) => {
  const pageManager = AppPageManager.getInstance();
  return pageManager.createPageWrapper(pageId, children, motionType);
};

/**
 * Performance monitor hook for tracking page metrics
 */
export const usePagePerformance = (pageId: string) => {
  const pageManager = AppPageManager.getInstance();
  
  React.useEffect(() => {
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      pageManager.recordPerformance(pageId, {
        loadTime: endTime - startTime
      });
    };
  }, [pageId, pageManager]);

  return {
    recordMetric: (metrics: Partial<PagePerformance>) => {
      pageManager.recordPerformance(pageId, metrics);
    },
    getMetrics: () => pageManager.getPerformanceMetrics(pageId)
  };
};

// Singleton instance export
export const PageManager = AppPageManager.getInstance();

// Pre-built page templates for app/ directory
export const AppPageTemplates = {
  /**
   * Standard app page layout
   */
  StandardPage: ({ children, title }: { children: React.ReactNode; title: string }) => (
    <div className={css({
      minH: '100vh',
      bg: 'gradient-to-br',
      from: 'gray.900',
      via: 'blue.900', 
      to: 'purple.900',
      color: 'white',
      p: '8'
    })}>
      <h1 className={css({ fontSize: '3xl', mb: '8', textAlign: 'center' })}>
        {title}
      </h1>
      {children}
    </div>
  ),

  /**
   * AGI-themed page layout
   */
  AGIPage: ({ children, title }: { children: React.ReactNode; title: string }) => (
    <div className={css({
      minH: '100vh',
      bg: 'black',
      color: 'white',
      p: '8',
      position: 'relative'
    })}>
      <div className={css({
        position: 'absolute',
        top: '0',
        left: '0',
        right: '0',
        bottom: '0',
        background: 'radial-gradient(circle at 50% 50%, rgba(0, 255, 255, 0.1) 0%, transparent 70%)',
        pointerEvents: 'none'
      })} />
      <h1 className={css({ 
        fontSize: '4xl', 
        mb: '8', 
        textAlign: 'center',
        background: 'linear-gradient(45deg, #00f5ff, #ff6b6b)',
        backgroundClip: 'text',
        color: 'transparent'
      })}>
        {title}
      </h1>
      {children}
    </div>
  ),

  /**
   * Dashboard-style page layout
   */
  DashboardPage: ({ children, title }: { children: React.ReactNode; title: string }) => (
    <div className={css({
      minH: '100vh',
      bg: 'gray.50',
      color: 'gray.900',
      p: '6'
    })}>
      <header className={css({
        mb: '8',
        pb: '4',
        borderBottom: '2px solid',
        borderColor: 'gray.200'
      })}>
        <h1 className={css({ fontSize: '2xl', fontWeight: 'bold' })}>
          {title}
        </h1>
      </header>
      {children}
    </div>
  )
};

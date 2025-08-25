/**
 * EuroWeb Web8 - App Page Manager
 * Pure CSS Modules + CVA Implementation
 * 
 * @author Ledjan Ahmati (100% Owner)
 * @version 8.0.1 Industrial
 */

import React from 'react';
import { motion } from 'framer-motion';
import { cva } from 'class-variance-authority';
import styles from '../styles/AppPageManager.module.css';

// Types for Page Management
interface PageConfig {
  id: string;
  title: string;
  path: string;
  component: React.ComponentType;
  meta?: {
    description?: string;
    keywords?: string[];
    ogImage?: string;
  };
}

interface PageMotionConfig {
  initial: Record<string, any>;
  animate: Record<string, any>;
  exit: Record<string, any>;
  transition: Record<string, any>;
}

// CVA Variants for Page Layouts using CSS Modules
const pageVariants = cva(styles.pageContainer, {
  variants: {
    layout: {
      default: styles.pageDefault,
      fullscreen: styles.pageFullscreen,
      centered: styles.pageCentered,
      sidebar: styles.pageSidebar
    },
    theme: {
      light: styles.themeLight,
      dark: styles.themeDark,
      industrial: styles.themeIndustrial
    }
  },
  defaultVariants: {
    layout: 'default',
    theme: 'industrial'
  }
});

// Motion presets for page transitions
const pageMotionPresets: Record<string, PageMotionConfig> = {
  slideIn: {
    initial: { opacity: 0, x: 100 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -100 },
    transition: { duration: 0.3, ease: 'easeInOut' }
  },
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.2 }
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 },
    transition: { duration: 0.25 }
  }
};

// Page Manager Class
export class AppPageManager {
  private pages: Map<string, PageConfig> = new Map();
  private currentPage: string | null = null;

  registerPage(config: PageConfig): void {
    this.pages.set(config.id, config);
  }

  getPage(id: string): PageConfig | undefined {
    return this.pages.get(id);
  }

  getAllPages(): PageConfig[] {
    return Array.from(this.pages.values());
  }

  setCurrentPage(id: string): void {
    if (this.pages.has(id)) {
      this.currentPage = id;
    }
  }

  getCurrentPage(): PageConfig | null {
    return this.currentPage ? this.pages.get(this.currentPage) ?? null : null;
  }

  createPageWrapper(
    children: React.ReactNode,
    motionPreset: keyof typeof pageMotionPresets = 'fadeIn',
    layout: 'default' | 'fullscreen' | 'centered' | 'sidebar' = 'default',
    theme: 'light' | 'dark' | 'industrial' = 'industrial'
  ): React.ReactElement {
    const motionConfig = pageMotionPresets[motionPreset];
    
    return React.createElement(
      motion.div,
      {
        className: pageVariants({ layout, theme }),
        initial: motionConfig.initial,
        animate: motionConfig.animate,
        exit: motionConfig.exit,
        transition: motionConfig.transition
      },
      children
    );
  }

  generateMetadata(pageId: string): Record<string, string> {
    const page = this.pages.get(pageId);
    if (!page) {return {};}

    return {
      title: page.title,
      description: page.meta?.description ?? `${page.title} - EuroWeb Web8`,
      keywords: page.meta?.keywords?.join(', ') ?? 'web8, euroweb, agi',
      'og:title': page.title,
      'og:description': page.meta?.description ?? '',
      'og:image': page.meta?.ogImage ?? '/og-default.png'
    };
  }
}

export const pageManager = new AppPageManager();

export const IndustrialPageTemplates = {
  agiDashboard: (content: React.ReactNode) => 
    pageManager.createPageWrapper(content, 'slideIn', 'sidebar', 'industrial'),

  fullscreenApp: (content: React.ReactNode) =>
    pageManager.createPageWrapper(content, 'scaleIn', 'fullscreen', 'dark'),

  centeredContent: (content: React.ReactNode) =>
    pageManager.createPageWrapper(content, 'fadeIn', 'centered', 'light'),

  defaultPage: (content: React.ReactNode) =>
    pageManager.createPageWrapper(content, 'fadeIn', 'default', 'industrial')
};

export { pageMotionPresets, pageVariants };

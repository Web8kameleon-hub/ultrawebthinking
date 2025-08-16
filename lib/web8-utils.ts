/**
 * 🌐 WEB8 UTILITIES LIBRARY - CORE FUNCTIONALITY
 * Libraritë kryesore për EuroWeb Platform v8.0.0
 * 
 * @author Ledjan Ahmati (100% Owner)
 * @contact dealsjona@gmail.com
 * @version 8.0.0-CORE-UTILITIES
 * @license MIT
 */

import { clsx, type ClassValue } from "clsx";

/**
 * 🎨 CN - CLASS NAME UTILITY
 * Kombinon dhe merges CSS classes
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

/**
 * 🔄 SLEEP UTILITY
 * Promise-based sleep function
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 🎯 DEBOUNCE UTILITY
 * Debounces function calls për performance optimization
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * 🚀 THROTTLE UTILITY
 * Throttles function calls për rate limiting
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * 📊 FORMAT BYTES UTILITY
 * Converts bytes to human readable format
 */
export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))  } ${  sizes[i]}`;
}

/**
 * 🎲 GENERATE ID UTILITY
 * Generates unique ID për components
 */
export function generateId(prefix = 'id'): string {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * 🔍 IS EMPTY UTILITY
 * Checks if value is empty (null, undefined, empty string, empty array, empty object)
 */
export function isEmpty(value: any): boolean {
  if (value == null) return true;
  if (typeof value === 'string') return value.trim() === '';
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
}

/**
 * 🌐 GET DEVICE INFO UTILITY
 * Returns device information për responsive design
 */
export function getDeviceInfo() {
  if (typeof window === 'undefined') {
    return {
      isMobile: false,
      isTablet: false,
      isDesktop: true,
      userAgent: 'server'
    };
  }

  const userAgent = navigator.userAgent;
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
  const isTablet = /iPad|Android(?!.*Mobile)/i.test(userAgent);
  const isDesktop = !isMobile && !isTablet;

  return {
    isMobile,
    isTablet,
    isDesktop,
    userAgent
  };
}

/**
 * 📱 BREAKPOINT UTILITY
 * Responsive breakpoint detection
 */
export function getBreakpoint(): 'mobile' | 'tablet' | 'desktop' | 'wide' {
  if (typeof window === 'undefined') return 'desktop';

  const width = window.innerWidth;
  
  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  if (width < 1440) return 'desktop';
  return 'wide';
}

/**
 * 🎨 COLOR UTILITIES
 */
export const colorUtils = {
  /**
   * Converts hex to rgba
   */
  hexToRgba(hex: string, alpha = 1): string {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  },

  /**
   * Generates random hex color
   */
  randomHex(): string {
    return `#${  Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
  },

  /**
   * Calculates contrast ratio
   */
  getContrastRatio(color1: string, color2: string): number {
    // Simplified contrast calculation
    const getLuminance = (hex: string) => {
      const rgb = parseInt(hex.slice(1), 16);
      const r = (rgb >> 16) & 0xff;
      const g = (rgb >> 8) & 0xff;
      const b = (rgb >> 0) & 0xff;
      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    };

    const lum1 = getLuminance(color1);
    const lum2 = getLuminance(color2);
    
    return lum1 > lum2 ? (lum1 + 0.05) / (lum2 + 0.05) : (lum2 + 0.05) / (lum1 + 0.05);
  }
};

/**
 * 📊 PERFORMANCE UTILITIES
 */
export const performanceUtils = {
  /**
   * Measures function execution time
   */
  measureTime<T>(fn: () => T, label?: string): T {
    const start = performance.now();
    const result = fn();
    const end = performance.now();
    
    if (label) {
      console.log(`⏱️ ${label}: ${(end - start).toFixed(2)}ms`);
    }
    
    return result;
  },

  /**
   * Creates performance observer
   */
  observePerformance(callback: (entries: PerformanceEntry[]) => void) {
    if (typeof window === 'undefined') return;

    const observer = new PerformanceObserver((list) => {
      callback(list.getEntries());
    });

    observer.observe({ entryTypes: ['measure', 'navigation', 'resource'] });
    return observer;
  }
};

/**
 * 💾 LOCAL STORAGE UTILITIES
 */
export const storageUtils = {
  /**
   * Safe localStorage get with fallback
   */
  get<T>(key: string, fallback: T): T {
    if (typeof window === 'undefined') return fallback;
    
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : fallback;
    } catch {
      return fallback;
    }
  },

  /**
   * Safe localStorage set
   */
  set(key: string, value: any): boolean {
    if (typeof window === 'undefined') return false;
    
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  },

  /**
   * Safe localStorage remove
   */
  remove(key: string): boolean {
    if (typeof window === 'undefined') return false;
    
    try {
      localStorage.removeItem(key);
      return true;
    } catch {
      return false;
    }
  },

  /**
   * Clear all localStorage
   */
  clear(): boolean {
    if (typeof window === 'undefined') return false;
    
    try {
      localStorage.clear();
      return true;
    } catch {
      return false;
    }
  }
};

/**
 * 🔗 URL UTILITIES
 */
export const urlUtils = {
  /**
   * Parses URL parameters
   */
  parseParams(url: string = typeof window !== 'undefined' ? window.location.href : ''): Record<string, string> {
    const params: Record<string, string> = {};
    
    try {
      const urlObj = new URL(url);
      urlObj.searchParams.forEach((value, key) => {
        params[key] = value;
      });
    } catch {
      // Fallback për invalid URLs
    }
    
    return params;
  },

  /**
   * Builds URL with parameters
   */
  buildUrl(base: string, params: Record<string, string | number>): string {
    const url = new URL(base);
    
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, String(value));
    });
    
    return url.toString();
  },

  /**
   * Validates URL
   */
  isValidUrl(string: string): boolean {
    try {
      new URL(string);
      return true;
    } catch {
      return false;
    }
  }
};

/**
 * 📅 DATE UTILITIES
 */
export const dateUtils = {
  /**
   * Formats date to readable string
   */
  format(date: Date, locale = 'en-US'): string {
    return new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  },

  /**
   * Gets relative time (e.g., "2 hours ago")
   */
  relative(date: Date, locale = 'en-US'): string {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
    
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) return rtf.format(-days, 'day');
    if (hours > 0) return rtf.format(-hours, 'hour');
    if (minutes > 0) return rtf.format(-minutes, 'minute');
    return rtf.format(-seconds, 'second');
  }
};

/**
 * 🛡️ VALIDATION UTILITIES
 */
export const validationUtils = {
  /**
   * Email validation
   */
  isEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  /**
   * Phone validation (basic)
   */
  isPhone(phone: string): boolean {
    const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
    return phoneRegex.test(phone);
  },

  /**
   * Strong password validation
   */
  isStrongPassword(password: string): boolean {
    const minLength = password.length >= 8;
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    return minLength && hasUpper && hasLower && hasNumber && hasSpecial;
  }
};

/**
 * 🎯 EXPORT ALL UTILITIES
 */
export default {
  cn,
  sleep,
  debounce,
  throttle,
  formatBytes,
  generateId,
  isEmpty,
  getDeviceInfo,
  getBreakpoint,
  colorUtils,
  performanceUtils,
  storageUtils,
  urlUtils,
  dateUtils,
  validationUtils
};

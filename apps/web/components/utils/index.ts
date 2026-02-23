/**
 * Utils - Comprehensive Utility Functions
 * Essential utility functions for the EuroWeb Platform
 * 
 * @author Ledjan Ahmati (100% Owner)
 * @contact dealsjona@gmail.com
 * @version 2.0.0 Dynamic
 * @license MIT
 */

// Date and Time Utilities
export const formatDate = (date: Date | string, format: 'short' | 'long' | 'time' | 'datetime' = 'short'): string => {
  const d = new Date(date)
  
  switch (format) {
    case 'short':
      return d.toLocaleDateString()
    case 'long':
      return d.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
    case 'time':
      return d.toLocaleTimeString()
    case 'datetime':
      return `${d.toLocaleDateString()  } ${  d.toLocaleTimeString()}`
    default:
      return d.toLocaleDateString()
  }
}

export const getRelativeTime = (date: Date | string): string => {
  const now = new Date()
  const target = new Date(date)
  const diffInMs = now.getTime() - target.getTime()
  
  const minute = 60 * 1000
  const hour = 60 * minute
  const day = 24 * hour
  const week = 7 * day
  const month = 30 * day
  const year = 365 * day
  
  if (diffInMs < minute) {return 'just now'}
  if (diffInMs < hour) {return `${Math.floor(diffInMs / minute)}m ago`}
  if (diffInMs < day) {return `${Math.floor(diffInMs / hour)}h ago`}
  if (diffInMs < week) {return `${Math.floor(diffInMs / day)}d ago`}
  if (diffInMs < month) {return `${Math.floor(diffInMs / week)}w ago`}
  if (diffInMs < year) {return `${Math.floor(diffInMs / month)}mo ago`}
  return `${Math.floor(diffInMs / year)}y ago`
}

// String Utilities
export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

export const camelToKebab = (str: string): string => {
  return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()
}

export const kebabToCamel = (str: string): string => {
  return str.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())
}

export const truncate = (str: string, length: number, suffix = '...'): string => {
  if (str.length <= length) {return str}
  return str.substring(0, length) + suffix
}

export const slugify = (str: string): string => {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// Number Utilities
export const formatNumber = (num: number, decimals = 0): string => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(num)
}

export const formatCurrency = (amount: number, currency = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency
  }).format(amount)
}

export const formatBytes = (bytes: number, decimals = 2): string => {
  if (bytes === 0) {return '0 Bytes'}
  
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))  } ${  sizes[i]}`
}

export const formatPercentage = (value: number, total: number, decimals = 1): string => {
  if (total === 0) {return '0%'}
  return `${((value / total) * 100).toFixed(decimals)  }%`
}

// Array Utilities
export const unique = <T>(array: T[]): T[] => {
  return [...new Set(array)]
}

export const groupBy = <T>(array: T[], key: keyof T): Record<string, T[]> => {
  return array.reduce((groups, item) => {
    const group = String(item[key])
    groups[group] = groups[group] ?? []
    groups[group].push(item)
    return groups
  }, {} as Record<string, T[]>)
}

export const sortBy = <T>(array: T[], key: keyof T, direction: 'asc' | 'desc' = 'asc'): T[] => {
  return [...array].sort((a, b) => {
    const aVal = a[key]
    const bVal = b[key]
    
    if (aVal < bVal) {return direction === 'asc' ? -1 : 1}
    if (aVal > bVal) {return direction === 'asc' ? 1 : -1}
    return 0
  })
}

export const chunk = <T>(array: T[], size: number): T[][] => {
  const chunks: T[][] = []
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size))
  }
  return chunks
}

// Object Utilities
export const deepClone = <T>(obj: T): T => {
  if (obj === null || typeof obj !== 'object') {return obj}
  if (obj instanceof Date) {return new Date(obj.getTime()) as unknown as T}
  if (obj instanceof Array) {return obj.map(item => deepClone(item)) as unknown as T}
  
  const cloned = {} as T
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloned[key] = deepClone(obj[key])
    }
  }
  return cloned
}

export const omit = <T extends object, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> => {
  const result = { ...obj }
  keys.forEach(key => delete result[key])
  return result
}

export const pick = <T extends object, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> => {
  const result = {} as Pick<T, K>
  keys.forEach(key => {
    if (key in obj) {
      result[key] = obj[key]
    }
  })
  return result
}

export const isEmpty = (value: any): boolean => {
  if (value === null) {return true}
  if (typeof value === 'string') {return value.length === 0}
  if (Array.isArray(value)) {return value.length === 0}
  if (typeof value === 'object') {return Object.keys(value).length === 0}
  return false
}

// Validation Utilities
export const isEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const isUrl = (url: string): boolean => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

export const isPhone = (phone: string): boolean => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/
  return phoneRegex.test(phone.replace(/\s+/g, ''))
}

export const isStrongPassword = (password: string): boolean => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character
  const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
  return strongPasswordRegex.test(password)
}

// Color Utilities
export const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null
}

export const rgbToHex = (r: number, g: number, b: number): string => {
  return `#${  ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`
}

export const generateRandomColor = (): string => {
  const letters = '0123456789ABCDEF'
  let color = '#'
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)]
  }
  return color
}

// DOM Utilities
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text)
      return true
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = text
      textArea.style.position = 'absolute'
      textArea.style.left = '-999999px'
      document.body.prepend(textArea)
      textArea.select()
      document.execCommand('copy')
      textArea.remove()
      return true
    }
  } catch {
    return false
  }
}

export const downloadFile = (data: string, filename: string, type = 'text/plain'): void => {
  const blob = new Blob([data], { type })
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
}

export const scrollToElement = (elementId: string, behavior: ScrollBehavior = 'smooth'): void => {
  const element = document.getElementById(elementId)
  if (element) {
    element.scrollIntoView({ behavior, block: 'start' })
  }
}

// Async Utilities
export const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void => {
  let timeout: NodeJS.Timeout | null = null
  
  return (...args: Parameters<T>): void => {
    if (timeout) {clearTimeout(timeout)}
    timeout = setTimeout(() => func(...args), wait)
  }
}

export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void => {
  let inThrottle = false
  
  return (...args: Parameters<T>): void => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

// Storage Utilities
export const localStorage = {
  get: <T>(key: string, defaultValue?: T): T | null => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue ?? null
    } catch {
      return defaultValue ?? null
    }
  },
  
  set: <T>(key: string, value: T): void => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // Storage full or disabled
    }
  },
  
  remove: (key: string): void => {
    try {
      window.localStorage.removeItem(key)
    } catch {
      // Storage disabled
    }
  },
  
  clear: (): void => {
    try {
      window.localStorage.clear()
    } catch {
      // Storage disabled
    }
  }
}

export const sessionStorage = {
  get: <T>(key: string, defaultValue?: T): T | null => {
    try {
      const item = window.sessionStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue ?? null
    } catch {
      return defaultValue ?? null
    }
  },
  
  set: <T>(key: string, value: T): void => {
    try {
      window.sessionStorage.setItem(key, JSON.stringify(value))
    } catch {
      // Storage full or disabled
    }
  },
  
  remove: (key: string): void => {
    try {
      window.sessionStorage.removeItem(key)
    } catch {
      // Storage disabled
    }
  },
  
  clear: (): void => {
    try {
      window.sessionStorage.clear()
    } catch {
      // Storage disabled
    }
  }
}

// Random Utilities
export const generateId = (length = 8): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

export const generateUUID = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

export const randomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export const randomFloat = (min: number, max: number): number => {
  return Math.random() * (max - min) + min
}

export const randomChoice = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)]
}

// Platform Detection
export const getPlatform = (): string => {
  if (typeof window === 'undefined') {return 'server'}
  
  const userAgent = window.navigator.userAgent.toLowerCase()
  
  if (userAgent.includes('mobile') || userAgent.includes('android') || userAgent.includes('iphone')) {
    return 'mobile'
  }
  if (userAgent.includes('tablet') || userAgent.includes('ipad')) {
    return 'tablet'
  }
  return 'desktop'
}

export const getBrowser = (): string => {
  if (typeof window === 'undefined') {return 'unknown'}
  
  const userAgent = window.navigator.userAgent.toLowerCase()
  
  if (userAgent.includes('chrome')) {return 'chrome'}
  if (userAgent.includes('firefox')) {return 'firefox'}
  if (userAgent.includes('safari') && !userAgent.includes('chrome')) {return 'safari'}
  if (userAgent.includes('edge')) {return 'edge'}
  if (userAgent.includes('opera')) {return 'opera'}
  
  return 'unknown'
}

// Export all utilities as a default object
export default {
  formatDate,
  getRelativeTime,
  capitalize,
  camelToKebab,
  kebabToCamel,
  truncate,
  slugify,
  formatNumber,
  formatCurrency,
  formatBytes,
  formatPercentage,
  unique,
  groupBy,
  sortBy,
  chunk,
  deepClone,
  omit,
  pick,
  isEmpty,
  isEmail,
  isUrl,
  isPhone,
  isStrongPassword,
  hexToRgb,
  rgbToHex,
  generateRandomColor,
  copyToClipboard,
  downloadFile,
  scrollToElement,
  sleep,
  debounce,
  throttle,
  localStorage,
  sessionStorage,
  generateId,
  generateUUID,
  randomInt,
  randomFloat,
  randomChoice,
  getPlatform,
  getBrowser
}

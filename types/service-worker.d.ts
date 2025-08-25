// Service Worker Type Definitions për EuroWeb Ultra
// TypeScript types për Service Worker environment

/// <reference lib="webworker" />

declare const self: ServiceWorkerGlobalScope;

export interface CacheStrategy {
  name: string;
  handler: (request: Request) => Promise<Response>;
}

export interface AGIServiceWorkerMessage {
  type: 'SKIP_WAITING' | 'CACHE_AGI_DATA' | 'CLEAR_CACHE' | 'GET_CACHE_STATUS';
  payload?: any;
}

export interface CacheStatus {
  [cacheName: string]: number;
}

export interface AGIOfflineResponse {
  status: 'offline';
  message: string;
  timestamp: string;
}

// Constants për EuroWeb Ultra
export const CACHE_NAMES = {
  STATIC: 'euroweb-static-v2',
  DYNAMIC: 'euroweb-dynamic-v2', 
  AGI: 'euroweb-agi-v2'
} as const;

export const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/favicon.ico',
  '/locales/sq/common.json',
  '/locales/en/common.json',
  '/locales/de/common.json',
  '/locales/fr/common.json',
  '/locales/it/common.json',
  '/locales/zh/common.json',
  '/locales/ru/common.json',
  '/locales/es/common.json',
  '/locales/hi/common.json',
  '/locales/ar/common.json',
  '/locales/el/common.json',
  '/locales/tr/common.json',
  '/locales/he/common.json'
] as const;

export const AGI_ENDPOINTS = [
  '/api/agi/core/status',
  '/api/agi/monitor/metrics',
  '/api/health',
  '/api/status'
] as const;

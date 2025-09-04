// EuroWeb Ultra Service Worker - TypeScript
// Performance & Caching Strategy for Multi-language AGI Platform

/// <reference lib="webworker" />
/// <reference path="../types/service-worker.d.ts" />

import type { AGIServiceWorkerMessage, CacheStatus, AGIOfflineResponse } from '../types/service-worker';

declare const self: ServiceWorkerGlobalScope;

// Cache names për EuroWeb Ultra
const CACHE_NAMES = {
  STATIC: 'euroweb-static-v2',
  DYNAMIC: 'euroweb-dynamic-v2',
  AGI: 'euroweb-agi-v2'
} as const;

// Static assets për caching
const STATIC_ASSETS = [
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
];

// AGI endpoints për caching
const AGI_ENDPOINTS = [
  '/api/agi/core/status',
  '/api/agi/monitor/metrics',
  '/api/health',
  '/api/status'
];

// Install event
self.addEventListener('install', (event: ExtendableEvent) => {
  console.log('[SW] Installing EuroWeb Ultra Service Worker v2.0.0');
  
  event.waitUntil(
    Promise.all([
      caches.open(CACHE_NAMES.STATIC).then(cache => {
        console.log('[SW] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      }),
      caches.open(CACHE_NAMES.AGI).then(cache => {
        console.log('[SW] Preparing AGI cache');
        return Promise.resolve();
      })
    ])
  );
  
  // Force activate immediately
  self.skipWaiting();
});

// Activate event
self.addEventListener('activate', (event: ExtendableEvent) => {
  console.log('[SW] Activating EuroWeb Ultra Service Worker');
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          // Delete old caches
          if (!Object.values(CACHE_NAMES).includes(cacheName as any)) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  
  // Take control immediately
  self.clients.claim();
});

// Fetch event - Strategjitë e caching
self.addEventListener('fetch', (event: FetchEvent) => {
  const request = event.request;
  const url = new URL(request.url);
  
  // Skip non-GET requests dhe browser extensions
  if (request.method !== 'GET' || url.protocol === 'chrome-extension:') {
    return;
  }
  
  // Strategy për lloje të ndryshme të requests
  if (isStaticAsset(url)) {
    event.respondWith(cacheFirstStrategy(request, CACHE_NAMES.STATIC));
  } else if (isAGIEndpoint(url)) {
    event.respondWith(networkFirstWithFallback(request, CACHE_NAMES.AGI));
  } else if (isAPIRequest(url)) {
    event.respondWith(networkFirstStrategy(request, CACHE_NAMES.DYNAMIC));
  } else if (isLocaleRequest(url)) {
    event.respondWith(cacheFirstStrategy(request, CACHE_NAMES.STATIC));
  } else {
    event.respondWith(networkFirstStrategy(request, CACHE_NAMES.DYNAMIC));
  }
});

// Helper functions
function isStaticAsset(url: URL): boolean {
  return url.pathname.includes('/_next/static/') ||
         url.pathname.includes('/favicon.ico') ||
         url.pathname.includes('/manifest.json');
}

function isAGIEndpoint(url: URL): boolean {
  return AGI_ENDPOINTS.some(endpoint => url.pathname.startsWith(endpoint));
}

function isAPIRequest(url: URL): boolean {
  return url.pathname.startsWith('/api/');
}

function isLocaleRequest(url: URL): boolean {
  return url.pathname.startsWith('/locales/');
}

// Cache-first strategy (për static assets)
async function cacheFirstStrategy(request: Request, cacheName: string): Promise<Response> {
  try {
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      console.log('[SW] Cache hit:', request.url);
      return cachedResponse;
    }
    
    console.log('[SW] Cache miss, fetching:', request.url);
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      await cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.error('[SW] Cache-first strategy failed:', error);
    return new Response('Offline - Resource not available', { 
      status: 503,
      statusText: 'Service Unavailable'
    });
  }
}

// Network-first strategy (për AGI data)
async function networkFirstStrategy(request: Request, cacheName: string): Promise<Response> {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      await cache.put(request, networkResponse.clone());
      console.log('[SW] Network success, cached:', request.url);
    }
    
    return networkResponse;
  } catch (error) {
    console.log('[SW] Network failed, trying cache:', request.url);
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    return new Response('Offline - Network and cache unavailable', {
      status: 503,
      statusText: 'Service Unavailable'
    });
  }
}

// Network-first me fallback për AGI endpoints
async function networkFirstWithFallback(request: Request, cacheName: string): Promise<Response> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout
    
    const networkResponse = await fetch(request, { 
      signal: controller.signal 
    });
    
    clearTimeout(timeoutId);
    
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      await cache.put(request, networkResponse.clone());
      console.log('[SW] AGI network success:', request.url);
    }
    
    return networkResponse;
  } catch (error) {
    console.log('[SW] AGI network failed, fallback to cache:', request.url);
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // AGI fallback response
    if (request.url.includes('/api/agi/')) {
      return new Response(JSON.stringify({
        status: 'offline',
        message: 'AGI temporarily unavailable - cached data only',
        timestamp: new Date().toISOString()
      }), {
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    return new Response('Offline', { status: 503 });
  }
}

// Background sync për AGI updates
self.addEventListener('sync', (event: any) => {
  if (event.tag === 'agi-background-sync') {
    event.waitUntil(syncAGIData());
  }
});

async function syncAGIData(): Promise<void> {
  try {
    console.log('[SW] Background sync: AGI data');
    
    const cache = await caches.open(CACHE_NAMES.AGI);
    
    for (const endpoint of AGI_ENDPOINTS) {
      try {
        const response = await fetch(endpoint);
        if (response.ok) {
          await cache.put(endpoint, response.clone());
          console.log('[SW] Synced:', endpoint);
        }
      } catch (error) {
        console.warn('[SW] Sync failed for:', endpoint);
      }
    }
  } catch (error) {
    console.error('[SW] Background sync failed:', error);
  }
}

// Message handling për communication me main thread
self.addEventListener('message', (event: ExtendableMessageEvent) => {
  const { type, payload } = event.data as AGIServiceWorkerMessage;
  
  switch (type) {
    case 'SKIP_WAITING':
      self.skipWaiting();
      break;
    case 'CACHE_AGI_DATA':
      event.waitUntil(cacheAGIData(payload));
      break;
    case 'CLEAR_CACHE':
      event.waitUntil(clearCache(payload?.cacheName));
      break;
    case 'GET_CACHE_STATUS':
      event.waitUntil(getCacheStatus().then(status => {
        event.ports[0]?.postMessage(status);
      }));
      break;
  }
});

async function cacheAGIData(data: any): Promise<void> {
  const cache = await caches.open(CACHE_NAMES.AGI);
  const response = new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' }
  });
  await cache.put('/api/agi/cached-data', response);
}

async function clearCache(cacheName?: string): Promise<void> {
  if (cacheName) {
    await caches.delete(cacheName);
  } else {
    const cacheNames = await caches.keys();
    await Promise.all(cacheNames.map(name => caches.delete(name)));
  }
}

async function getCacheStatus(): Promise<CacheStatus> {
  const cacheNames = await caches.keys();
  const status: CacheStatus = {};
  
  for (const cacheName of cacheNames) {
    const cache = await caches.open(cacheName);
    const keys = await cache.keys();
    status[cacheName] = keys.length;
  }
  
  return status;
}

console.log('[SW] EuroWeb Ultra Service Worker v2.0.0 loaded successfully! 🚀');

// Service Worker Types
declare const self: ServiceWorkerGlobalScope;

interface CacheConfig {
  name: string;
  version: string;
  urls: string[];
  strategy: 'cache-first' | 'network-first' | 'stale-while-revalidate';
}

interface PerformanceMetrics {
  timestamp: number;
  type: string;
  duration: number;
  size?: number;
  url: string;
}

// Cache configurations
const CACHE_CONFIG: CacheConfig[] = [
  {
    name: 'euroweb-static',
    version: 'v2.0.0',
    urls: [
      '/',
      '/manifest.json',
      '/favicon.ico'
    ],
    strategy: 'cache-first'
  },
  {
    name: 'euroweb-api',
    version: 'v2.0.0', 
    urls: [
      '/api/agi/core/status',
      '/api/locales'
    ],
    strategy: 'network-first'
  },
  {
    name: 'euroweb-assets',
    version: 'v2.0.0',
    urls: [],
    strategy: 'cache-first'
  }
];

const CACHE_NAMES = {
  static: `euroweb-static-${CACHE_CONFIG[0].version}`,
  api: `euroweb-api-${CACHE_CONFIG[1].version}`,
  assets: `euroweb-assets-${CACHE_CONFIG[2].version}`,
  runtime: 'euroweb-runtime'
};

// Performance monitoring
const performanceMetrics: PerformanceMetrics[] = [];

function recordMetric(type: string, duration: number, url: string, size?: number): void {
  performanceMetrics.push({
    timestamp: Date.now(),
    type,
    duration,
    size,
    url
  });
  
  // Keep only last 100 metrics to avoid memory issues
  if (performanceMetrics.length > 100) {
    performanceMetrics.splice(0, 50);
  }
}

// Install event - precache static assets
self.addEventListener('install', (event: ExtendableEvent) => {
  console.log('[SW] Installing Service Worker v2.0.0');
  
  event.waitUntil(
    Promise.all([
      // Cache static assets
      caches.open(CACHE_NAMES.static).then((cache) => {
        return cache.addAll(CACHE_CONFIG[0].urls);
      }),
      // Skip waiting for immediate activation
      self.skipWaiting()
    ])
  );
});

// Activate event - clean old caches
self.addEventListener('activate', (event: ExtendableEvent) => {
  console.log('[SW] Activating Service Worker v2.0.0');
  
  event.waitUntil(
    Promise.all([
      // Clean old caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (!Object.values(CACHE_NAMES).includes(cacheName)) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      // Claim all clients immediately
      self.clients.claim()
    ])
  );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event: FetchEvent) => {
  const url = new URL(event.request.url);
  const startTime = performance.now();
  
  // Skip non-GET requests and chrome-extension URLs
  if (event.request.method !== 'GET' || url.protocol === 'chrome-extension:') {
    return;
  }
  
  // Handle different URL patterns
  if (url.pathname.startsWith('/api/')) {
    // API requests - network first with cache fallback
    event.respondWith(handleApiRequest(event.request, startTime));
  } else if (url.pathname.startsWith('/_next/static/')) {
    // Static assets - cache first
    event.respondWith(handleStaticAsset(event.request, startTime));
  } else if (url.pathname.match(/\.(js|css|png|jpg|jpeg|gif|webp|svg|ico|woff|woff2)$/)) {
    // Asset files - cache first
    event.respondWith(handleAssetFile(event.request, startTime));
  } else {
    // HTML pages - stale while revalidate
    event.respondWith(handlePageRequest(event.request, startTime));
  }
});

// Network-first strategy for API requests
async function handleApiRequest(request: Request, startTime: number): Promise<Response> {
  const cacheName = CACHE_NAMES.api;
  
  try {
    // Try network first
    const networkResponse = await fetch(request.clone());
    const duration = performance.now() - startTime;
    
    // Cache successful responses
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
      
      recordMetric('api-network', duration, request.url, 
        parseInt(networkResponse.headers.get('content-length') || '0'));
    }
    
    return networkResponse;
  } catch (error) {
    // Fallback to cache
    const cachedResponse = await caches.match(request, { cacheName });
    
    if (cachedResponse) {
      const duration = performance.now() - startTime;
      recordMetric('api-cache', duration, request.url);
      return cachedResponse;
    }
    
    // Return offline response
    return new Response(
      JSON.stringify({ 
        error: 'Offline', 
        message: 'This request requires network connectivity' 
      }),
      {
        status: 503,
        statusText: 'Service Unavailable',
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

// Cache-first strategy for static assets
async function handleStaticAsset(request: Request, startTime: number): Promise<Response> {
  const cacheName = CACHE_NAMES.assets;
  
  // Try cache first
  const cachedResponse = await caches.match(request, { cacheName });
  
  if (cachedResponse) {
    const duration = performance.now() - startTime;
    recordMetric('static-cache', duration, request.url);
    return cachedResponse;
  }
  
  // Fetch from network and cache
  try {
    const networkResponse = await fetch(request);
    const duration = performance.now() - startTime;
    
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
      
      recordMetric('static-network', duration, request.url,
        parseInt(networkResponse.headers.get('content-length') || '0'));
    }
    
    return networkResponse;
  } catch (error) {
    return new Response('Asset not available offline', { status: 404 });
  }
}

// Cache-first strategy for asset files
async function handleAssetFile(request: Request, startTime: number): Promise<Response> {
  return handleStaticAsset(request, startTime);
}

// Stale-while-revalidate strategy for pages
async function handlePageRequest(request: Request, startTime: number): Promise<Response> {
  const cacheName = CACHE_NAMES.runtime;
  const cache = await caches.open(cacheName);
  
  // Get cached version immediately
  const cachedResponse = await cache.match(request);
  
  // Fetch from network in background
  const networkResponsePromise = fetch(request).then((response) => {
    const duration = performance.now() - startTime;
    
    if (response.ok) {
      cache.put(request, response.clone());
      recordMetric('page-network', duration, request.url,
        parseInt(response.headers.get('content-length') || '0'));
    }
    
    return response;
  }).catch(() => null);
  
  // Return cached version if available, otherwise wait for network
  if (cachedResponse) {
    const duration = performance.now() - startTime;
    recordMetric('page-cache', duration, request.url);
    return cachedResponse;
  }
  
  const networkResponse = await networkResponsePromise;
  return networkResponse || new Response('Page not available offline', { status: 404 });
}

// Message handler for performance metrics
self.addEventListener('message', (event: ExtendableMessageEvent) => {
  if (event.data && event.data.type === 'GET_METRICS') {
    event.ports[0].postMessage({
      type: 'METRICS_RESPONSE',
      metrics: performanceMetrics.slice(-50) // Last 50 metrics
    });
  }
  
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      Promise.all(Object.values(CACHE_NAMES).map(name => caches.delete(name)))
        .then(() => {
          event.ports[0].postMessage({ type: 'CACHE_CLEARED' });
        })
    );
  }
});

// Background sync for offline actions
self.addEventListener('sync', (event: any) => {
  if (event.tag === 'background-agi-sync') {
    event.waitUntil(performBackgroundSync());
  }
});

async function performBackgroundSync(): Promise<void> {
  try {
    // Sync pending AGI operations when online
    const pendingOperations = await getStoredOperations();
    
    for (const operation of pendingOperations) {
      try {
        await fetch('/api/agi/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(operation)
        });
        
        await removeStoredOperation(operation.id);
      } catch (error) {
        console.log('[SW] Failed to sync operation:', operation.id);
      }
    }
  } catch (error) {
    console.log('[SW] Background sync failed:', error);
  }
}

async function getStoredOperations(): Promise<any[]> {
  // Implementation would use IndexedDB
  return [];
}

async function removeStoredOperation(id: string): Promise<void> {
  // Implementation would use IndexedDB
}

export {};

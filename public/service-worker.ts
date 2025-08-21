// EuroWeb Ultra Service Worker - TypeScript
// Strategic caching for AGI platform performance

/// <reference lib="webworker" />

interface CacheStrategy {
  name: string;
  pattern: RegExp;
  strategy: 'cache-first' | 'network-first' | 'stale-while-revalidate';
  maxAge?: number;
}

// Service Worker context
declare const self: ServiceWorkerGlobalScope;

const CACHE_NAME = 'euroweb-ultra-v2.0.0';
const AGI_CACHE_NAME = 'euroweb-agi-data-v1';
const STATIC_CACHE_NAME = 'euroweb-static-v1';

// Cache strategies configuration
const cacheStrategies: CacheStrategy[] = [
  {
    name: 'static-assets',
    pattern: /\.(js|css|png|jpg|jpeg|svg|ico|woff|woff2)$/,
    strategy: 'cache-first',
    maxAge: 86400000 // 24 hours
  },
  {
    name: 'api-agi',
    pattern: /\/api\/agi\//,
    strategy: 'network-first',
    maxAge: 300000 // 5 minutes
  },
  {
    name: 'translations',
    pattern: /\/locales\//,
    strategy: 'stale-while-revalidate',
    maxAge: 3600000 // 1 hour
  },
  {
    name: 'pages',
    pattern: /\/(sq|en|de|fr|it|zh|ru|es|hi|ar|el|tr|he)?\/?$/,
    strategy: 'stale-while-revalidate',
    maxAge: 1800000 // 30 minutes
  }
];

// Install event - cache essential resources
self.addEventListener('install', (event: ExtendableEvent) => {
  console.log('🚀 EuroWeb Ultra Service Worker installing...');
  
  event.waitUntil(
    Promise.all([
      caches.open(CACHE_NAME).then(cache => {
        return cache.addAll([
          '/',
          '/manifest.json',
          '/offline.html'
        ]);
      }),
      caches.open(STATIC_CACHE_NAME).then(cache => {
        return cache.addAll([
          '/_next/static/',
          '/images/',
          '/icons/'
        ]);
      })
    ]).then(() => {
      console.log('✅ EuroWeb Ultra Service Worker installed');
      return self.skipWaiting();
    })
  );
});

// Activate event - clean old caches
self.addEventListener('activate', (event: ExtendableEvent) => {
  console.log('🔄 EuroWeb Ultra Service Worker activating...');
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(cacheName => 
            cacheName.startsWith('euroweb-') && 
            ![CACHE_NAME, AGI_CACHE_NAME, STATIC_CACHE_NAME].includes(cacheName)
          )
          .map(cacheName => {
            console.log('🗑️ Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          })
      );
    }).then(() => {
      console.log('✅ EuroWeb Ultra Service Worker activated');
      return self.clients.claim();
    })
  );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event: FetchEvent) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests and external URLs
  if (request.method !== 'GET' || !url.origin.includes(self.location.origin)) {
    return;
  }
  
  // Find matching cache strategy
  const strategy = cacheStrategies.find(s => s.pattern.test(url.pathname));
  
  if (strategy) {
    event.respondWith(handleWithStrategy(request, strategy));
  } else {
    // Default: network-first for uncategorized requests
    event.respondWith(
      fetch(request).catch(async () => {
        const offlineResponse = await caches.match('/offline.html');
        return offlineResponse || new Response('Offline');
      })
    );
  }
});

// Cache strategy implementations
async function handleWithStrategy(request: Request, strategy: CacheStrategy): Promise<Response> {
  const cache = await caches.open(getCacheNameForStrategy(strategy));
  
  switch (strategy.strategy) {
    case 'cache-first':
      return handleCacheFirst(request, cache, strategy);
    
    case 'network-first':
      return handleNetworkFirst(request, cache, strategy);
    
    case 'stale-while-revalidate':
      return handleStaleWhileRevalidate(request, cache, strategy);
    
    default:
      return fetch(request);
  }
}

async function handleCacheFirst(request: Request, cache: Cache, strategy: CacheStrategy): Promise<Response> {
  try {
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse && !isExpired(cachedResponse, strategy.maxAge)) {
      return cachedResponse;
    }
    
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    const cachedResponse = await cache.match(request);
    return cachedResponse || new Response('Network error', { status: 503 });
  }
}

async function handleNetworkFirst(request: Request, cache: Cache, strategy: CacheStrategy): Promise<Response> {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse && !isExpired(cachedResponse, strategy.maxAge)) {
      return cachedResponse;
    }
    
    return new Response('Network and cache miss', { status: 503 });
  }
}

async function handleStaleWhileRevalidate(request: Request, cache: Cache, strategy: CacheStrategy): Promise<Response> {
  const cachedResponse = await cache.match(request);
  
  // Always try to update cache in background
  const networkUpdate = fetch(request).then(response => {
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  }).catch(() => {
    // Silently fail network update - return null to indicate failure
    return null;
  });
  
  // Return cached response immediately if available
  if (cachedResponse && !isExpired(cachedResponse, strategy.maxAge)) {
    return cachedResponse;
  }
  
  // Wait for network if no cache or cache expired
  try {
    const networkResponse = await networkUpdate;
    if (networkResponse) {
      return networkResponse;
    }
    return cachedResponse || new Response('No cache and network failed', { status: 503 });
  } catch (error) {
    return cachedResponse || new Response('No cache and network failed', { status: 503 });
  }
}

function getCacheNameForStrategy(strategy: CacheStrategy): string {
  switch (strategy.name) {
    case 'api-agi':
      return AGI_CACHE_NAME;
    case 'static-assets':
      return STATIC_CACHE_NAME;
    default:
      return CACHE_NAME;
  }
}

function isExpired(response: Response, maxAge?: number): boolean {
  if (!maxAge) return false;
  
  const dateHeader = response.headers.get('date');
  if (!dateHeader) return true;
  
  const responseDate = new Date(dateHeader);
  const now = new Date();
  
  return (now.getTime() - responseDate.getTime()) > maxAge;
}

// Background sync for AGI data updates
self.addEventListener('sync', (event: any) => {
  if (event.tag === 'agi-data-sync') {
    event.waitUntil(syncAGIData());
  }
});

async function syncAGIData(): Promise<void> {
  try {
    console.log('🔄 Syncing AGI data in background...');
    
    const agiEndpoints = [
      '/api/agi/core/status',
      '/api/agi/monitor/metrics'
    ];
    
    const cache = await caches.open(AGI_CACHE_NAME);
    
    await Promise.all(
      agiEndpoints.map(async endpoint => {
        try {
          const response = await fetch(endpoint);
          if (response.ok) {
            await cache.put(endpoint, response.clone());
          }
        } catch (error) {
          console.warn(`Failed to sync ${endpoint}:`, error);
        }
      })
    );
    
    console.log('✅ AGI data sync completed');
  } catch (error) {
    console.error('❌ AGI data sync failed:', error);
  }
}

// Message handling for cache management
self.addEventListener('message', (event: ExtendableMessageEvent) => {
  const { action, data } = event.data;
  
  switch (action) {
    case 'SKIP_WAITING':
      self.skipWaiting();
      break;
      
    case 'CLEAR_CACHE':
      event.waitUntil(clearCache(data?.cacheNames));
      break;
      
    case 'CACHE_AGI_RESULT':
      event.waitUntil(cacheAGIResult(data));
      break;
      
    default:
      console.warn('Unknown message action:', action);
  }
});

async function clearCache(cacheNames?: string[]): Promise<void> {
  const namesToClear = cacheNames || [CACHE_NAME, AGI_CACHE_NAME, STATIC_CACHE_NAME];
  
  await Promise.all(
    namesToClear.map(name => caches.delete(name))
  );
  
  console.log('✅ Caches cleared:', namesToClear);
}

async function cacheAGIResult(data: { key: string; result: any }): Promise<void> {
  try {
    const cache = await caches.open(AGI_CACHE_NAME);
    const response = new Response(JSON.stringify(data.result), {
      headers: {
        'Content-Type': 'application/json',
        'Date': new Date().toISOString()
      }
    });
    
    await cache.put(data.key, response);
    console.log('✅ AGI result cached:', data.key);
  } catch (error) {
    console.error('❌ Failed to cache AGI result:', error);
  }
}

console.log('🤖 EuroWeb Ultra Service Worker ready - TypeScript powered!');

export {};

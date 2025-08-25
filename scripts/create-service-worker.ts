#!/usr/bin/env tsx
/**
 * EuroWeb Service Worker Creator
 * Creates PWA service worker and fixes 404 issues
 */

import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

class ServiceWorkerCreator {
  private publicDir: string;

  constructor() {
    this.publicDir = join(process.cwd(), 'public');
  }

  async createServiceWorker(): Promise<void> {
    console.log('🔧 Creating EuroWeb Service Worker');
    console.log('─'.repeat(50));

    // Ensure public directory exists
    if (!existsSync(this.publicDir)) {
      mkdirSync(this.publicDir, { recursive: true });
      console.log('✅ Created public directory');
    }

    // Create service worker
    this.createSW();
    
    // Create manifest
    this.createManifest();
    
    // Create favicon
    this.createFavicon();
    
    // Fix routing issues
    this.createRouteHandlers();

    console.log('\n🎉 Service Worker setup completed!');
  }

  private async createSW(): Promise<void> {
    const swPath = join(this.publicDir, 'sw.js');
    
    const swContent = `/**
 * EuroWeb Platform Service Worker
 * AGI-powered PWA with intelligent caching
 */

const CACHE_NAME = 'euroweb-v1.0.0'
const STATIC_CACHE = 'euroweb-static-v1'
const DYNAMIC_CACHE = 'euroweb-dynamic-v1'

// AGI-optimized cache strategy
const CACHE_STRATEGY = {
  static: [
    '/',
    '/app/globals.css',
    '/manifest.json',
    '/_next/static/css/',
    '/_next/static/js/'
  ],
  dynamic: [
    '/api/',
    '/components/',
    '/_next/image'
  ]
}

// Install event - AGI Core initialization
self.addEventListener('install', (event) => {
  console.log('🚀 EuroWeb Service Worker: AGI Core initializing...')
  
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE).then(cache => {
        console.log('📋 AGISheet cache initialized')
        return cache.addAll(CACHE_STRATEGY.static.filter(Boolean))
      }),
      caches.open(DYNAMIC_CACHE).then(() => {
        console.log('🧠 Dynamic AGI cache ready')
      })
    ]).then(() => {
      console.log('✅ EuroWeb Service Worker installed successfully')
      self.skipWaiting()
    })
  )
})

// Activate event - Neural network activation
self.addEventListener('activate', (event) => {
  console.log('🔋 EuroWeb Service Worker: Neural networks activating...')
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
            console.log('🧹 Cleaning old cache:', cacheName)
            return caches.delete(cacheName)
          }
        })
      )
    }).then(() => {
      console.log('🎉 EuroWeb Service Worker activated')
      return self.clients.claim()
    })
  )
})

// Fetch event - AGI-powered request handling
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)
  
  // Skip non-HTTP requests
  if (!request.url.startsWith('http')) return
  
  // AGI request classification
  if (isStaticAsset(request.url)) {
    event.respondWith(handleStaticAsset(request))
  } else if (isAPIRequest(request.url)) {
    event.respondWith(handleAPIRequest(request))
  } else {
    event.respondWith(handlePageRequest(request))
  }
})

// AGI Static Asset Handler
function handleStaticAsset(request) {
  try {
    const cache = caches.open(STATIC_CACHE)
    const cachedResponse = cache.match(request)
    
    if (cachedResponse) {
      console.log('📋 AGISheet cache hit:', request.url)
      return cachedResponse
    }
    
    const networkResponse = // REMOVED: fetch(request)
    
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone())
      console.log('💾 Cached static asset:', request.url)
    }
    
    return networkResponse
  } catch (error) {
    console.log('⚠️ Static asset error:', error)
    return new Response('EuroWeb: Asset not available', { status: 404 })
  }
}

// AGI API Handler
function handleAPIRequest(request) {
  try {
    console.log('🌐 AGI API request:', request.url)
    return // REMOVED: fetch(request)
  } catch (error) {
    console.log('❌ API request failed:', error)
    return new Response(JSON.stringify({
      error: 'EuroWeb API temporarily unavailable',
      agi_status: 'degraded'
    }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

// AGI Page Handler
function handlePageRequest(request) {
  try {
    const cache = caches.open(DYNAMIC_CACHE)
    
    // Try network first for pages
    const networkResponse = // REMOVED: fetch(request)
    
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone())
      return networkResponse
    }
    
    // Fallback to cache
    const cachedResponse = cache.match(request)
    if (cachedResponse) {
      console.log('🧠 AGI cache fallback:', request.url)
      return cachedResponse
    }
    
    // Ultimate fallback to homepage
    return cache.match('/') || // REMOVED: fetch('/')
    
  } catch (error) {
    console.log('🔄 Page request error, using AGI fallback:', error)
    
    // AGI-powered offline page
    return new Response(\`
      <!DOCTYPE html>
      <html>
        <head>
          <title>EuroWeb - AGI Mode</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              background: #1a1d29; 
              color: #f8fafc; 
              text-align: center; 
              padding: 50px; 
            }
            .agi-logo { color: #d4af37; font-size: 48px; margin-bottom: 20px; }
          </style>
        </head>
        <body>
          <div class="agi-logo">🧠 EuroWeb AGI Mode</div>
          <h1>Platform Offline</h1>
          <p>AGI Core is working to restore connection...</p>
          <p>Please check your internet connection and try again.</p>
        </body>
      </html>
    \`, {
      headers: { 'Content-Type': 'text/html' }
    })
  }
}

// AGI Classification Functions
function isStaticAsset(url) {
  return url.includes('/_next/static/') || 
         url.includes('.css') || 
         url.includes('.js') || 
         url.includes('.png') || 
         url.includes('.jpg') || 
         url.includes('.ico')
}

function isAPIRequest(url) {
  return url.includes('/api/')
}

// AGI Background Sync
self.addEventListener('sync', (event) => {
  if (event.tag === 'agi-sync') {
    console.log('🔄 AGI Background sync triggered')
    event.waitUntil(performAGISync())
  }
})

function performAGISync() {
  try {
    console.log('🧠 Performing AGI cache optimization...')
    // AGI-powered cache optimization logic would go here
  } catch (error) {
    console.log('⚠️ AGI sync error:', error)
  }
}

console.log('🚀 EuroWeb Service Worker loaded - AGI ready!')
`;

    writeFileSync(swPath, swContent);
    console.log('✅ Created /public/sw.js');
  }

  private async createManifest(): Promise<void> {
    const manifestPath = join(this.publicDir, 'manifest.json');
    
    const manifest = {
      "name": "EuroWeb Platform",
      "short_name": "EuroWeb",
      "description": "AGI-Powered Web8 Browser with Industrial Intelligence",
      "start_url": "/",
      "display": "standalone",
      "background_color": "#1a1d29",
      "theme_color": "#d4af37",
      "orientation": "portrait-primary",
      "icons": [
        {
          "src": "/favicon.ico",
          "sizes": "32x32",
          "type": "image/x-icon"
        },
        {
          "src": "/icon-192.png",
          "sizes": "192x192",
          "type": "image/png",
          "purpose": "any maskable"
        },
        {
          "src": "/icon-512.png",
          "sizes": "512x512",
          "type": "image/png"
        }
      ],
      "categories": ["productivity", "developer", "ai"],
      "lang": "sq",
      "scope": "/",
      "prefer_related_applications": false
    };
    
    writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
    console.log('✅ Created /public/manifest.json');
  }

  private async createFavicon(): Promise<void> {
    // Create a simple favicon placeholder
    const faviconPath = join(this.publicDir, 'favicon.ico');
    
    if (!existsSync(faviconPath)) {
      // Create a minimal ICO file (this is a placeholder - in production you'd use a real icon)
      const faviconContent = Buffer.from('AAABAAEAEBAAAAEAIABoBAAAFgAAACgAAAAQAAAAIAAAAAEAIAAAAAAAAAAAAAAAAAAAAAAAAAAA');
      writeFileSync(faviconPath, faviconContent, 'base64');
      console.log('✅ Created /public/favicon.ico');
    }
  }

  private async createRouteHandlers(): Promise<void> {
    // Create a catch-all route handler for better 404s
    const routeHandlerPath = join(process.cwd(), 'app', 'not-found.tsx');
    
    if (!existsSync(routeHandlerPath)) {
      const notFoundContent = `export default function NotFound() {
  return (
    <div className={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #1a1d29 0%, #2d2a45 30%)',
      color: '#f8fafc',
      textAlign: 'center',
      fontFamily: 'Inter, sans-serif'
    }}>
      <div>
        <h1 className={{ color: '#d4af37', fontSize: '48px', marginBottom: '20px' }}>
          🧠 404
        </h1>
        <h2 className={{ fontSize: '24px', marginBottom: '15px' }}>
          AGI Module Not Found
        </h2>
        <p className={{ color: '#cbd5e1', marginBottom: '30px' }}>
          The requested neural pathway does not exist in EuroWeb AGI architecture.
        </p>
        <a 
          href="/" 
          className={{
            display: 'inline-block',
            padding: '12px 24px',
            background: '#d4af37',
            color: '#1a1d29',
            textDecoration: 'none',
            borderRadius: '8px',
            fontWeight: 600
          }}
        >
          🏠 Return to AGISheet
        </a>
      </div>
    </div>
  )
}
`;
      
      writeFileSync(routeHandlerPath, notFoundContent);
      console.log('✅ Created app/not-found.tsx');
    }
  }
}

// Main execution
const main = async (): Promise<void> => {
  const creator = new ServiceWorkerCreator();
  await creator.createServiceWorker();
  
  console.log('\n🚀 Next steps:');
  console.log('1. yarn clean:cache');
  console.log('2. yarn dev:start');
  console.log('3. Test PWA features');
};

if (require.main === module) {
  main().catch(console.error);
}

export default ServiceWorkerCreator;

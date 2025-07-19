/// <reference types="/globals" />
import '@/ui-dom';
import { cleanup } from '@/uireact';
import { afterEach, beforeAll, beforeEach, vi } from '';

// Global test setup for EuroWeb Platform
beforeAll(() => {
  // Set timezone for consistent testing
  process.env.TZ = 'UTC';
  
  // Mock window.matchMedia for jsdom
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(), // deprecated
      removeListener: vi.fn(), // deprecated
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });

  // Mock ResizeObserver
  global.ResizeObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }));

  // Mock IntersectionObserver
  global.IntersectionObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }));

  // Mock next/router
  vi.mock('next/router', () => ({
    useRouter: () => ({
      route: '/',
      pathname: '/',
      query: {},
      asPath: '/',
      push: vi.fn(),
      pop: vi.fn(),
      reload: vi.fn(),
      back: vi.fn(),
      prefetch: vi.fn().mockResolvedValue(undefined),
      beforePopState: vi.fn(),
      events: {
        on: vi.fn(),
        off: vi.fn(),
        emit: vi.fn(),
      },
    }),
  }));

  // Mock next/navigation for App Router
  vi.mock('next/navigation', () => ({
    useRouter: () => ({
      push: vi.fn(),
      replace: vi.fn(),
      back: vi.fn(),
      forward: vi.fn(),
      refresh: vi.fn(),
      prefetch: vi.fn(),
    }),
    usePathname: () => '/',
    useSearchParams: () => new URLSearchParams(),
  }));

  // Mock WebSocket for mesh network testing
  global.WebSocket = vi.fn().mockImplementation(() => ({
    send: vi.fn(),
    close: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    readyState: 1,
    OPEN: 1,
    CLOSED: 3,
  }));

  // Mock crypto for security testing
  Object.defineProperty(global, 'crypto', {
    value: {
      randomUUID: () => 'test-uuid-' + Math.random().toString(36).substr(2, 9),
      getRandomValues: (arr: any) => {
        for (let i = 0; i < arr.length; i++) {
          arr[i] = Math.floor(Math.random() * 256);
        }
        return arr;
      },
      subtle: {
        encrypt: vi.fn(),
        decrypt: vi.fn(),
        sign: vi.fn(),
        verify: vi.fn(),
        digest: vi.fn(),
        generateKey: vi.fn(),
        importKey: vi.fn(),
        exportKey: vi.fn(),
      },
    },
  });
});

beforeEach(() => {
  // Clear all mocks before each test
  vi.clearAllMocks();
  
  // Reset console to avoid noise in tests
  vi.spyOn(console, 'warn').mockImplementation(() => {});
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  // Cleanup React Testing Library
  cleanup();
  
  // Restore console
  vi.restoreAllMocks();
});

// Global test utilities
declare global {
  namespace Vi {
    interface AsymmetricMatchersContaining {
      toBeTypeOf(expected: string): any
    }
  }
}

// Custom matchers for AGI testing
expect.extend({
  toBeAGIResponse(received: any) {
    const pass = received && 
                 typeof received === 'object' && 
                 'success' in received && 
                 'data' in received &&
                 'timestamp' in received;

    return {
      message: () => 
        pass 
          ? `Expected ${received} not to be a valid AGI response`
          : `Expected ${received} to be a valid AGI response with success, data, and timestamp fields`,
      pass,
    };
  },

  toBeValidLayerStatus(received: any) {
    const validStatuses = ['active', 'inactive', 'processing', 'error', 'optimizing', 'learning'];
    const pass = validStatuses.includes(received);

    return {
      message: () => 
        pass 
          ? `Expected ${received} not to be a valid layer status`
          : `Expected ${received} to be one of: ${validStatuses.join(', ')}`,
      pass,
    };
  },

  toBeSecureHash(received: any) {
    const pass = typeof received === 'string' && 
                 received.length >= 32 && 
                 /^[a-f0-9]+$/i.test(received);

    return {
      message: () => 
        pass 
          ? `Expected ${received} not to be a secure hash`
          : `Expected ${received} to be a valid hexadecimal hash of at least 32 characters`,
      pass,
    };
  }
});

// Type declarations for custom matchers
declare module '' {
  interface Assertion<T = any> {
    toBeAGIResponse(): T
    toBeValidLayerStatus(): T
    toBeSecureHash(): T
  }
  interface AsymmetricMatchersContaining {
    toBeAGIResponse(): any
    toBeValidLayerStatus(): any
    toBeSecureHash(): any
  }
}

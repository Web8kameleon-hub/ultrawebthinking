// Vitest setup file for Web8
import { expect, afterEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'
import * as matchers from '@testing-library/jest-dom/matchers'
import React from 'react'

// Extend Vitest's expect with jest-dom matchers
expect.extend(matchers)

// Cleanup after each test
afterEach(() => {
  cleanup()
})

// Mock Next.js router
const mockRouter = {
  push: vi.fn(),
  replace: vi.fn(),
  reload: vi.fn(),
  back: vi.fn(),
  prefetch: vi.fn().mockResolvedValue(undefined),
  beforePopState: vi.fn(),
  events: {
    on: vi.fn(),
    off: vi.fn(),
    emit: vi.fn(),
  },
  isFallback: false,
  isLocaleDomain: false,
  isReady: true,
  isPreview: false,
  route: '/',
  pathname: '/',
  query: {},
  asPath: '/',
  basePath: '',
  locale: undefined,
  locales: undefined,
  defaultLocale: undefined,
  domainLocales: undefined,
}

vi.mock('next/router', () => ({
  useRouter: () => mockRouter,
  withRouter: (component: any) => component,
  default: mockRouter,
}))

// Mock Next.js Image component
vi.mock('next/image', () => ({
  default: (props: any) => {
    return React.createElement('img', props)
  },
}))

// Mock Next.js Head component
vi.mock('next/head', () => ({
  default: ({ children }: { children: any }) => children,
}))

// Mock framer-motion to prevent animation issues in tests
vi.mock('framer-motion', () => ({
  motion: new Proxy(() => null, {
    get: () => (props: any) => {
      const { children, ...rest } = props
      return React.createElement('div', rest, children)
    },
  }),
  AnimatePresence: ({ children }: { children: any }) => children,
}))

// Global test utilities
;(global as any).testUtils = {
  mockRouter,
  createMockAGIResponse: (content: string) => ({
    content,
    confidence: 0.95,
    reasoning: 'Test reasoning',
    timestamp: Date.now(),
  }),
}

// Console warnings filter
const originalWarn = console.warn
console.warn = (...args: any[]) => {
  // Filter out known warnings that don't affect tests
  const message = args[0]
  if (
    typeof message === 'string' &&
    (message.includes('React Router Future Flag Warning') ||
     message.includes('validateDOMNesting'))
  ) {
    return
  }
  originalWarn(...args)
}

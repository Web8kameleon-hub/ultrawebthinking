import { describe, it, expect } from ''

describe('Vitest Setup', () => {
  it('should work correctly', () => {
    expect(1 + 1).toBe(2)
  })

  it('should handle async operations', async () => {
    const promise = Promise.resolve('success')
    expect(promise).resolves.toBe('success')
  })
})

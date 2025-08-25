// __tests__/agi/CommandBridge.test.ts
/**
 * CommandBridge Testing Suite
 * Tests për AGI command routing dhe backend integration
 * © Web8 UltraThinking – Ledjan Ahmati
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { CommandBridge } from '../../backend/agi/CommandBridge';

// Mock dependencies
vi.mock('../../backend/agi/core.js', () => ({
  agiCore: {
    status: vi.fn(),
    reset: vi.fn(),
    process: vi.fn()
  },
  AGICore: vi.fn()
}));

vi.mock('../../backend/agi/semantic.js', () => ({
  SemanticAnalyzer: vi.fn().mockImplementation(() => ({
    parse: vi.fn(),
    classify: vi.fn()
  }))
}));

vi.mock('../../backend/agi/planner.js', () => ({
  Planner: vi.fn().mockImplementation(() => ({
    generatePlan: vi.fn()
  }))
}));

vi.mock('../../backend/agi/executor.js', () => ({
  Executor: vi.fn().mockImplementation(() => ({
    run: vi.fn()
  }))
}));

vi.mock('../../backend/agi/monitor.js', () => ({
  logger: {
    info: vi.fn(),
    error: vi.fn(),
    warn: vi.fn()
  }
}));

describe('CommandBridge', () => {
  let commandBridge: CommandBridge;

  beforeEach(() => {
    commandBridge = new CommandBridge();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Command Processing', () => {
    it('should handle ANALYZE command correctly', async () => {
      const payload = {
        id: 'test-001',
        command: 'ANALYZE' as const,
        input: 'Test input for analysis',
        context: { source: 'unit-test' }
      };

      const result = await commandBridge.processCommand(payload);

      expect(result).toBeDefined();
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
    });

    it('should handle CLASSIFY command correctly', async () => {
      const payload = {
        id: 'test-002',
        command: 'CLASSIFY' as const,
        input: 'Text to classify',
        context: { category: 'general' }
      };

      const result = await commandBridge.processCommand(payload);

      expect(result).toBeDefined();
      expect(result.success).toBe(true);
    });

    it('should handle PLAN command correctly', async () => {
      const payload = {
        id: 'test-003',
        command: 'PLAN' as const,
        input: 'Create a task plan',
        context: { priority: 'high' }
      };

      const result = await commandBridge.processCommand(payload);

      expect(result).toBeDefined();
      expect(result.success).toBe(true);
    });

    it('should handle EXECUTE command correctly', async () => {
      const payload = {
        id: 'test-004',
        command: 'EXECUTE' as const,
        input: 'Execute task',
        context: { async: false }
      };

      const result = await commandBridge.processCommand(payload);

      expect(result).toBeDefined();
      expect(result.success).toBe(true);
    });

    it('should handle STATUS command correctly', async () => {
      const payload = {
        id: 'test-005',
        command: 'STATUS' as const,
        input: '',
        context: {}
      };

      const result = await commandBridge.processCommand(payload);

      expect(result).toBeDefined();
      expect(result.success).toBe(true);
      expect(result.data).toHaveProperty('status');
    });

    it('should handle RESET command correctly', async () => {
      const payload = {
        id: 'test-006',
        command: 'RESET' as const,
        input: '',
        context: {}
      };

      const result = await commandBridge.processCommand(payload);

      expect(result).toBeDefined();
      expect(result.success).toBe(true);
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid command gracefully', async () => {
      const payload = {
        id: 'test-error-001',
        command: 'INVALID' as any,
        input: 'test',
        context: {}
      };

      const result = await commandBridge.processCommand(payload);

      expect(result).toBeDefined();
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should handle missing input gracefully', async () => {
      const payload = {
        id: 'test-error-002',
        command: 'ANALYZE' as const,
        input: '',
        context: {}
      };

      const result = await commandBridge.processCommand(payload);

      expect(result).toBeDefined();
      // Should handle empty input gracefully
    });
  });

  describe('Performance', () => {
    it('should process commands within reasonable time', async () => {
      const startTime = Date.now();
      
      const payload = {
        id: 'test-perf-001',
        command: 'STATUS' as const,
        input: '',
        context: {}
      };

      await commandBridge.processCommand(payload);
      
      const endTime = Date.now();
      const duration = endTime - startTime;

      expect(duration).toBeLessThan(1000); // Should complete within 1 second
    });
  });
});

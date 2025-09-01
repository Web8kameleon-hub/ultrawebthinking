/**
 * Guardian Security System Tests
 * Comprehensive testing for DDoS protection and threat detection
 * 
 * @version 8.0.0
 * @author Ledjan Ahmati
 * @contact dealsjona@gmail.com
 */

// Guardian Test - Real Data Only
// No imports needed for Jest globals: describe, it, expect, beforeEach are available
// Real data source
import { Guardian } from '../backend/guardian/Guardian';

describe('Guardian Security System', () => {
  let guardian: Guardian;

  beforeEach(() => {
    jest.clearAllMocks();
    guardian = new Guardian();
  });

  describe('Basic Functionality', () => {
    it('should initialize Guardian system', () => {
      expect(guardian).toBeDefined();
      expect(guardian.isBlocked('127.0.0.1')).toBe(false);
    });

    it('should analyze normal requests without blocking', () => {
      const isBlocked = guardian.analyzeRequest(
        '127.0.0.1',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        '/api/test',
        { 'accept': 'application/json', 'accept-language': 'en-US' }
      );
      
      expect(isBlocked).toBe(false);
    });

    it('should detect suspicious requests', () => {
      const isBlocked = guardian.analyzeRequest(
        '192.168.1.100',
        'python-requests/2.25.1',
        '/admin',
        {}
      );
      
      expect(isBlocked).toBe(true);
      expect(guardian.isBlocked('192.168.1.100')).toBe(true);
    });
  });

  describe('Threat Detection', () => {
    it('should detect SQL injection patterns', () => {
      const isBlocked = guardian.analyzeRequest(
        '192.168.1.200',
        'BadBot/1.0',
        '/api/search?q=%27%3B%20DROP%20TABLE%20users%3B%20--',
        {}
      );
      
      expect(isBlocked).toBe(true);
    });

    it('should detect XSS patterns', () => {
      const isBlocked = guardian.analyzeRequest(
        '192.168.1.300',
        'BadBot/1.0',
        '/search?q=<script>alert(1)</script>',
        {}
      );
      
      expect(isBlocked).toBe(true);
    });

    it('should detect path traversal attempts', () => {
      const isBlocked = guardian.analyzeRequest(
        '192.168.1.400',
        'BadBot/1.0',
        '/files/../../etc/passwd',
        {}
      );
      
      expect(isBlocked).toBe(true);
    });

    it('should detect admin panel probing', () => {
      const isBlocked = guardian.analyzeRequest(
        '192.168.1.500',
        'BadBot/1.0',
        '/wp-admin/admin.php',
        {}
      );
      
      expect(isBlocked).toBe(true);
    });
  });

  describe('Rate Limiting', () => {
    it('should implement rate limiting for rapid requests', () => {
      const ip = '192.168.1.600';
      let blockedCount = 0;

      // Simulate rapid requests
      for (let i = 0; i < 10; i++) {
        const isBlocked = guardian.analyzeRequest(
          ip,
          'TestBot/1.0',
          `/api/test/${i}`,
          {}
        );
        if (isBlocked) blockedCount++;
      }

      expect(blockedCount).toBeGreaterThan(0);
    });
  });

  describe('IP Management', () => {
    it('should manually block IP addresses', () => {
      guardian.blockIP('192.168.1.666', 'Manual test block');
      expect(guardian.isBlocked('192.168.1.666')).toBe(true);
    });

    it('should manually unblock IP addresses', () => {
      guardian.blockIP('192.168.1.777', 'Test block');
      expect(guardian.isBlocked('192.168.1.777')).toBe(true);
      
      const unblocked = guardian.unblockIP('192.168.1.777');
      expect(unblocked).toBe(true);
      expect(guardian.isBlocked('192.168.1.777')).toBe(false);
    });

    it('should return false when trying to unblock non-blocked IP', () => {
      const unblocked = guardian.unblockIP('192.168.1.999');
      expect(unblocked).toBe(false);
    });
  });

  describe('Dashboard and Monitoring', () => {
    it('should provide dashboard data', () => {
      const dashboard = guardian.getDashboard();
      
      expect(dashboard).toHaveProperty('stats');
      expect(dashboard.stats).toHaveProperty('totalBlocked');
      expect(dashboard).toHaveProperty('recentActivity');
      expect(dashboard).toHaveProperty('status');
      expect(dashboard).toHaveProperty('settings');
    });

    it('should track security events', () => {
      // Trigger some security events
      guardian.analyzeRequest(
        '192.168.1.888',
        'BadBot/1.0',
        '/admin',
        {}
      );

      const dashboard = guardian.getDashboard();
      expect(dashboard.recentActivity.length).toBeGreaterThan(0);
    });
  });

  describe('System Control', () => {
    it('should activate and deactivate Guardian', () => {
      guardian.setActive(false);
      
      const isBlocked = guardian.analyzeRequest(
        '192.168.1.999',
        'BadBot/1.0',
        '/admin',
        {}
      );
      
      expect(isBlocked).toBe(false);
      
      guardian.setActive(true);
    });

    it('should update Guardian settings', () => {
      guardian.updateSettings({
        maxAttempts: 3,
        blockDuration: 30000
      });

      // Test should continue working with new settings
      expect(guardian.isBlocked('127.0.0.1')).toBe(false);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty user agent gracefully', () => {
      expect(() => {
        guardian.analyzeRequest(
          '192.168.1.100',
          '',
          '/api/test',
          { 'accept': 'application/json' }
        );
      }).not.toThrow();
    });

    it('should handle malformed URLs gracefully', () => {
      expect(() => {
        guardian.analyzeRequest(
          '192.168.1.101',
          'Mozilla/5.0',
          '%%%invalid%%%url%%%',
          { 'accept': 'application/json' }
        );
      }).not.toThrow();
    });

    it('should handle missing headers gracefully', () => {
      expect(() => {
        guardian.analyzeRequest(
          '192.168.1.102',
          'Mozilla/5.0',
          '/api/test',
          {}
        );
      }).not.toThrow();
    });
  });
});

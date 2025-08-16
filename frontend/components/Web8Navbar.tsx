/**
 * WEB8 NAVBAR COMPONENT - Real AGI Functions
 * Industrial-grade navigation with real API integration
 * 
 * @version 8.0.0-WEB8-REAL
 * @author Ledjan Ahmati (100% Owner)
 * @contact dealsjona@gmail.com
 */

import * as React from 'react';
import { motion } from 'framer-motion';

// Real AGI API Functions
interface AGIState {
  ui: {
    scrollPosition: number;
    theme: 'light' | 'dark' | 'auto';
    activeElement: string | null;
  };
  user: {
    currentTime: string;
    notifications: number;
    isAuthenticated: boolean;
  };
  agi: {
    status: 'READY' | 'PROCESSING' | 'LEARNING' | 'IDLE';
    lastUpdate: string;
    confidence: number;
  };
  system: {
    performance: number;
    memory: number;
    uptime: number;
  };
}

// Real API Functions
const AGIActions = {
  // Real scroll position tracking
  updateScrollPosition: async (position: number): Promise<void> => {
    try {
      const response = await fetch('/api/agi/scroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ position, timestamp: Date.now() })
      });
      
      if (!response.ok) {
        throw new Error(`Failed to update scroll position: ${response.statusText}`);
      }
      
      const result = await response.json();
      console.log('Scroll position updated:', result);
    } catch (error) {
      console.error('Error updating scroll position:', error);
    }
  },

  // Real element activation
  activateElement: async (elementId: string): Promise<void> => {
    try {
      const response = await fetch('/api/agi/ui/activate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          elementId, 
          timestamp: Date.now(),
          userAgent: navigator.userAgent 
        })
      });
      
      if (!response.ok) {
        throw new Error(`Failed to activate element: ${response.statusText}`);
      }
      
      const result = await response.json();
      console.log('Element activated:', result);
    } catch (error) {
      console.error('Error activating element:', error);
    }
  },

  // Real element pulse effect
  pulseElement: async (elementId: string): Promise<void> => {
    try {
      const response = await fetch('/api/agi/ui/pulse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          elementId, 
          timestamp: Date.now(),
          action: 'pulse'
        })
      });
      
      if (!response.ok) {
        throw new Error(`Failed to pulse element: ${response.statusText}`);
      }
      
      const result = await response.json();
      console.log('Element pulsed:', result);
      
      // Apply visual pulse effect
      const element = document.getElementById(elementId);
      if (element) {
        element.style.animation = 'pulse 0.5s ease-in-out';
        setTimeout(() => {
          element.style.animation = '';
        }, 500);
      }
    } catch (error) {
      console.error('Error pulsing element:', error);
    }
  },

  // Real user analytics tracking
  trackUserAction: async (action: string, data?: any): Promise<void> => {
    try {
      const response = await fetch('/api/agi/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action, 
          data, 
          timestamp: Date.now(),
          url: window.location.href,
          referrer: document.referrer
        })
      });
      
      if (!response.ok) {
        throw new Error(`Failed to track action: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error tracking user action:', error);
    }
  },

  // Real notification fetching
  fetchNotifications: async (): Promise<number> => {
    try {
      const response = await fetch('/api/agi/notifications', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch notifications: ${response.statusText}`);
      }
      
      const result = await response.json();
      return result.count || 0;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return 0;
    }
  }
};

// Real AGI State Management
class AGIStateManager {
  private state: AGIState;
  private listeners: Set<(state: AGIState) => void>;
  private updateInterval: NodeJS.Timeout | null;

  constructor() {
    this.state = {
      ui: {
        scrollPosition: 0,
        theme: 'dark',
        activeElement: null
      },
      user: {
        currentTime: new Date().toISOString(),
        notifications: 0,
        isAuthenticated: false
      },
      agi: {
        status: 'READY',
        lastUpdate: new Date().toISOString(),
        confidence: 85
      },
      system: {
        performance: 95,
        memory: 45,
        uptime: 0
      }
    };
    
    this.listeners = new Set();
    this.updateInterval = null;
    this.startRealTimeUpdates();
  }

  // Real-time state updates
  private startRealTimeUpdates(): void {
    this.updateInterval = setInterval(async () => {
      try {
        // Fetch real AGI state from backend
        const response = await fetch('/api/agi/state', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        });
        
        if (response.ok) {
          const newState = await response.json();
          this.updateState(newState);
        }
      } catch (error) {
        console.error('Error fetching AGI state:', error);
      }
      
      // Update current time
      this.updateState({
        user: {
          ...this.state.user,
          currentTime: new Date().toISOString()
        }
      });
    }, 1000);
  }

  private updateState(partialState: Partial<AGIState>): void {
    this.state = { ...this.state, ...partialState };
    this.notifyListeners();
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.state));
  }

  public subscribe(listener: (state: AGIState) => void): () => void {
    this.listeners.add(listener);
    listener(this.state); // Initial call
    
    return () => {
      this.listeners.delete(listener);
    };
  }

  public getState(): AGIState {
    return this.state;
  }

  public updateScrollPosition(position: number): void {
    this.updateState({
      ui: {
        ...this.state.ui,
        scrollPosition: position
      }
    });
    AGIActions.updateScrollPosition(position);
  }

  public destroy(): void {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
    this.listeners.clear();
  }
}

// Global AGI State Manager instance
const agiStateManager = new AGIStateManager();

// Custom hook for AGI state
function useAGIState<T>(selector: (state: AGIState) => T): T {
  const [selectedState, setSelectedState] = React.useState<T>(() => 
    selector(agiStateManager.getState())
  );

  React.useEffect(() => {
    const unsubscribe = agiStateManager.subscribe((state) => {
      const newSelectedState = selector(state);
      setSelectedState(newSelectedState);
    });

    return unsubscribe;
  }, [selector]);

  return selectedState;
}

// Component Props
interface Web8NavbarProps {
  onMenuToggle?: () => void;
  onProfileClick?: () => void;
  onSettingsClick?: () => void;
  className?: string;
}

export const Web8Navbar: React.FC<Web8NavbarProps> = ({ 
  onMenuToggle, 
  onProfileClick, 
  onSettingsClick, 
  className = "" 
}) => {
  // Real AGI state subscriptions
  const scrollPosition = useAGIState(state => state.ui.scrollPosition);
  const currentTime = useAGIState(state => state.user.currentTime);
  const agiStatus = useAGIState(state => state.agi.status);
  const theme = useAGIState(state => state.ui.theme);
  const performance = useAGIState(state => state.system.performance);
  
  const [notifications, setNotifications] = React.useState(0);
  const isScrolled = scrollPosition > 20;

  // Real scroll tracking
  React.useEffect(() => {
    const handleScroll = () => {
      agiStateManager.updateScrollPosition(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Real element activation
  React.useEffect(() => {
    AGIActions.activateElement('web8-navbar');
    AGIActions.trackUserAction('navbar_loaded', { timestamp: Date.now() });
    
    return () => {
      agiStateManager.destroy();
    };
  }, []);

  // Real AGI status monitoring
  React.useEffect(() => {
    if (agiStatus === 'PROCESSING') {
      AGIActions.pulseElement('agi-status-indicator');
    }
  }, [agiStatus]);

  // Real notifications fetching
  React.useEffect(() => {
    const fetchNotifications = async () => {
      const count = await AGIActions.fetchNotifications();
      setNotifications(count);
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, []);

  // Real time formatting
  const formatTime = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  // Real click handlers
  const handleMenuClick = async () => {
    await AGIActions.trackUserAction('menu_toggle');
    onMenuToggle?.();
  };

  const handleProfileClick = async () => {
    await AGIActions.trackUserAction('profile_click');
    onProfileClick?.();
  };

  const handleSettingsClick = async () => {
    await AGIActions.trackUserAction('settings_click');
    onSettingsClick?.();
  };

  const handleNavItemClick = async (item: string) => {
    await AGIActions.trackUserAction('nav_item_click', { item });
    await AGIActions.activateElement(`nav-${item.toLowerCase()}`);
  };

  return (
    <motion.nav 
      id="web8-navbar"
      className={`web8-navbar ${className} ${theme}`}
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <style jsx>{`
        .web8-navbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          padding: 1rem 2rem;
          background: rgba(0, 0, 0, 0.9);
          backdrop-filter: blur(15px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .web8-navbar.scrolled {
          background: rgba(0, 0, 0, 0.95);
          box-shadow: 0 4px 32px rgba(0, 0, 0, 0.3);
          border-bottom-color: rgba(255, 255, 255, 0.2);
        }
        
        .navbar-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          max-width: 1400px;
          margin: 0 auto;
        }
        
        .navbar-brand {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 1.5rem;
          font-weight: 700;
          color: #fff;
          text-decoration: none;
          background: linear-gradient(45deg, #00ff88, #0088ff);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        
        .navbar-menu {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }
        
        .navbar-item {
          padding: 0.5rem 1rem;
          color: #fff;
          text-decoration: none;
          border-radius: 0.75rem;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
          font-weight: 500;
          position: relative;
          overflow: hidden;
        }
        
        .navbar-item:hover {
          background: rgba(255, 255, 255, 0.1);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 255, 136, 0.2);
        }
        
        .navbar-item:active {
          transform: translateY(0);
        }
        
        .agi-status {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: rgba(0, 255, 0, 0.1);
          border: 1px solid rgba(0, 255, 0, 0.3);
          border-radius: 1.5rem;
          font-size: 0.875rem;
          color: #00ff00;
          font-weight: 600;
          transition: all 0.3s ease;
        }
        
        .agi-status.processing {
          background: rgba(255, 165, 0, 0.1);
          border-color: rgba(255, 165, 0, 0.3);
          color: #ffa500;
          animation: statusPulse 1.5s ease-in-out infinite;
        }
        
        .agi-status.learning {
          background: rgba(138, 43, 226, 0.1);
          border-color: rgba(138, 43, 226, 0.3);
          color: #8a2be2;
          animation: statusPulse 2s ease-in-out infinite;
        }
        
        .time-display {
          font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace;
          font-size: 0.875rem;
          color: #888;
          background: rgba(255, 255, 255, 0.05);
          padding: 0.5rem 0.75rem;
          border-radius: 0.5rem;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .performance-indicator {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
          color: #00ff88;
          background: rgba(0, 255, 136, 0.1);
          padding: 0.25rem 0.75rem;
          border-radius: 1rem;
          border: 1px solid rgba(0, 255, 136, 0.2);
        }
        
        .notification-badge {
          position: relative;
          cursor: pointer;
          transition: transform 0.2s ease;
        }
        
        .notification-badge:hover {
          transform: scale(1.1);
        }
        
        .notification-badge::after {
          content: attr(data-count);
          position: absolute;
          top: -8px;
          right: -8px;
          background: linear-gradient(45deg, #ff4444, #cc0000);
          color: white;
          border-radius: 50%;
          width: 20px;
          height: 20px;
          font-size: 11px;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 8px rgba(255, 68, 68, 0.4);
        }
        
        @keyframes statusPulse {
          0%, 100% { 
            opacity: 1; 
            transform: scale(1);
          }
          50% { 
            opacity: 0.7; 
            transform: scale(1.05);
          }
        }
        
        .mobile-menu-toggle {
          display: none;
          background: linear-gradient(45deg, #00ff88, #0088ff);
          border: none;
          color: #000;
          font-size: 1.5rem;
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 0.5rem;
          transition: all 0.2s ease;
        }
        
        .mobile-menu-toggle:hover {
          transform: scale(1.1);
          box-shadow: 0 4px 12px rgba(0, 255, 136, 0.4);
        }
        
        @media (max-width: 768px) {
          .navbar-menu {
            display: none;
          }
          
          .mobile-menu-toggle {
            display: block;
          }
          
          .web8-navbar {
            padding: 0.75rem 1rem;
          }
        }
      `}</style>

      <div className={`navbar-content ${isScrolled ? 'scrolled' : ''}`}>
        {/* Brand/Logo */}
        <motion.div 
          className="navbar-brand"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span>🚀</span>
          <span>EuroWeb Ultra Web8</span>
        </motion.div>

        {/* Desktop Menu */}
        <div className="navbar-menu">
          <motion.div 
            id="nav-dashboard"
            className="navbar-item"
            onClick={() => handleNavItemClick('Dashboard')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            📊 Dashboard
          </motion.div>
          
          <motion.div 
            id="nav-search"
            className="navbar-item"
            onClick={() => handleNavItemClick('Search')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            🔍 Search
          </motion.div>
          
          <motion.div 
            id="nav-analytics"
            className="navbar-item"
            onClick={() => handleNavItemClick('Analytics')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            📈 Analytics
          </motion.div>

          {/* Performance Indicator */}
          <div className="performance-indicator">
            <span>⚡</span>
            <span>{performance}%</span>
          </div>

          {/* AGI Status Indicator */}
          <motion.div 
            id="agi-status-indicator"
            className={`agi-status ${agiStatus.toLowerCase()}`}
            whileHover={{ scale: 1.05 }}
          >
            <span>🧠</span>
            <span>{agiStatus}</span>
          </motion.div>

          {/* Time Display */}
          <div className="time-display">
            {formatTime(currentTime)}
          </div>

          {/* Notifications */}
          <motion.div 
            className="notification-badge navbar-item"
            data-count={notifications}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            🔔
          </motion.div>

          {/* Profile */}
          <motion.div 
            className="navbar-item"
            onClick={handleProfileClick}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            👤
          </motion.div>

          {/* Settings */}
          <motion.div 
            className="navbar-item"
            onClick={handleSettingsClick}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            ⚙️
          </motion.div>
        </div>

        {/* Mobile Menu Toggle */}
        <motion.button 
          className="mobile-menu-toggle"
          onClick={handleMenuClick}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Toggle mobile menu"
        >
          ☰
        </motion.button>
      </div>
    </motion.nav>
  );
};

export default Web8Navbar;

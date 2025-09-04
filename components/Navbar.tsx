import * as React from 'react';
import { motion } from 'framer-motion';

//  AGI hooks for development
const useAGI = () => ({
  actions: {
    updateScrollPosition: (position: number) => {
      //  implementation
      console.debug('Scroll position updated:', position);
    }
  },
  ui: {
    activateElement: (elementId: string) => {
      //  implementation
      console.debug('Element activated:', elementId);
    },
    pulseElement: (elementId: string) => {
      //  implementation
      console.debug('Element pulsed:', elementId);
    }
  }
});

const useAGIState = (selector: (memory: any) => any) => {
  //  AGI state
  const emory = {
    ui: {
      scrollPosition: 0,
      theme: 'dark'
    },
    user: {
      currentTime: new Date().toISOString()
    },
    agi: {
      status: 'READY'
    }
  };
  
  return selector(emory);
};

interface NavbarProps {
  onMenuToggle?: () => void;
  onProfileClick?: () => void;
  onSettingsClick?: () => void;
  className?: string;
}

export function Navbar({ onMenuToggle, onProfileClick, onSettingsClick, className = "" }: NavbarProps) {
  const { actions, ui } = useAGI();
  
  // Get state from AGI memory with proper typing
  const scrollPosition = useAGIState((memory: any) => memory.ui.scrollPosition);
  const currentTime = useAGIState((memory: any) => memory.user.currentTime);
  const agiStatus = useAGIState((memory: any) => memory.agi.status);
  const theme = useAGIState((memory: any) => memory.ui.theme);

  const isScrolled = scrollPosition > 20;
  const notifications = 3; // Could be from memory too

  React.useEffect(() => {
    // Handle scroll position updates
    const handleScroll = () => {
      actions.updateScrollPosition(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [actions]);

  React.useEffect(() => {
    // Activate navbar UI
    ui.activateElement('navbar');
    
    // Pulse when AGI is processing
    if (agiStatus === 'PROCESSING') {
      ui.pulseElement('agi-status-indicator');
    }
  }, [ui, agiStatus]);

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <motion.nav 
      id="navbar"
      className={`navbar ${className} agi-reactive agi-bg`}
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <style jsx>{`
        .navbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          padding: 1rem 2rem;
          background: rgba(0, 0, 0, 0.9);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          transition: all 0.3s ease;
        }
        
        .navbar.scrolled {
          background: rgba(0, 0, 0, 0.95);
          box-shadow: 0 2px 20px rgba(0, 0, 0, 0.3);
        }
        
        .navbar-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          max-width: 1200px;
          margin: 0 auto;
        }
        
        .navbar-brand {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 1.5rem;
          font-weight: bold;
          color: #fff;
          text-decoration: none;
        }
        
        .navbar-menu {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        
        .navbar-item {
          padding: 0.5rem 1rem;
          color: #fff;
          text-decoration: none;
          border-radius: 0.5rem;
          transition: all 0.2s ease;
          cursor: pointer;
        }
        
        .navbar-item:hover {
          background: rgba(255, 255, 255, 0.1);
          transform: translateY(-1px);
        }
        
        .agi-status {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.25rem 0.75rem;
          background: rgba(0, 255, 0, 0.1);
          border: 1px solid rgba(0, 255, 0, 0.3);
          border-radius: 1rem;
          font-size: 0.875rem;
          color: #00ff00;
        }
        
        .agi-status.processing {
          background: rgba(255, 165, 0, 0.1);
          border-color: rgba(255, 165, 0, 0.3);
          color: #ffa500;
          animation: pulse 1s infinite;
        }
        
        .time-display {
          font-family: 'Courier New', monospace;
          font-size: 0.875rem;
          color: #888;
        }
        
        .notification-badge {
          position: relative;
          cursor: pointer;
        }
        
        .notification-badge::after {
          content: attr(data-count);
          position: absolute;
          top: -8px;
          right: -8px;
          background: #ff4444;
          color: white;
          border-radius: 50%;
          width: 18px;
          height: 18px;
          font-size: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        .mobile-menu-toggle {
          display: none;
          background: none;
          border: none;
          color: #fff;
          font-size: 1.5rem;
          cursor: pointer;
        }
        
        @media (max-width: 768px) {
          .navbar-menu {
            display: none;
          }
          
          .mobile-menu-toggle {
            display: block;
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
          <span>EuroWeb Ultra</span>
        </motion.div>

        {/* Desktop Menu */}
        <div className="navbar-menu">
          <motion.div 
            className="navbar-item"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Dashboard
          </motion.div>
          
          <motion.div 
            className="navbar-item"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Search
          </motion.div>
          
          <motion.div 
            className="navbar-item"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Analytics
          </motion.div>

          {/* AGI Status Indicator */}
          <motion.div 
            id="agi-status-indicator"
            className={`agi-status ${agiStatus === 'PROCESSING' ? 'processing' : ''}`}
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
            onClick={onProfileClick}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            👤
          </motion.div>

          {/* Settings */}
          <motion.div 
            className="navbar-item"
            onClick={onSettingsClick}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            ⚙️
          </motion.div>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="mobile-menu-toggle"
          onClick={onMenuToggle}
          aria-label="Toggle mobile menu"
        >
          ☰
        </button>
      </div>
    </motion.nav>
  );
}

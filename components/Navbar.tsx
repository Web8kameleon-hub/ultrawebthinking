import { motion } from 'framer-motion';
import * as React from 'react';

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
  isMobileMenuOpen?: boolean;
}

export function Navbar({ onMenuToggle, onProfileClick, onSettingsClick, className = "", isMobileMenuOpen = false }: NavbarProps) {
  const { actions, ui } = useAGI();
  
  // Get state from AGI memory with proper typing
  const scrollPosition = useAGIState((memory: any) => memory.ui.scrollPosition);
  const currentTime = useAGIState((memory: any) => memory.user.currentTime);
  const agiStatus = useAGIState((memory: any) => memory.agi.status);

  const isScrolled = scrollPosition > 20;
  const notifications = 3; // Could be from memory too

  // Keyboard shortcuts for fast navigation
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ctrl+K for search
      if (event.ctrlKey && event.key === 'k') {
        event.preventDefault();
        console.log('Opening search...');
        ui.activateElement('search');
      }

      // Alt+N for notifications
      if (event.altKey && event.key === 'n') {
        event.preventDefault();
        console.log('Opening notifications...');
        ui.activateElement('notifications');
      }

      // Alt+P for profile
      if (event.altKey && event.key === 'p') {
        event.preventDefault();
        onProfileClick?.();
      }

      // Alt+S for settings
      if (event.altKey && event.key === 's') {
        event.preventDefault();
        onSettingsClick?.();
      }

      // Alt+M for mobile menu
      if (event.altKey && event.key === 'm') {
        event.preventDefault();
        onMenuToggle?.();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [ui, onProfileClick, onSettingsClick, onMenuToggle]);

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
      role="navigation"
      aria-label="Navigimi kryesor - EuroWeb Ultra"
      aria-describedby="navbar-help"
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Hidden help text for screen readers */}
      <div id="navbar-help" className="sr-only">
        Përdor Tab për të lëvizur nëpër elementet e navigimit. Enter ose Space për të aktivizuar.
      </div>
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
        
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
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
        <motion.a
          href="/"
          className="navbar-brand"
          role="banner"
          aria-label="EuroWeb Ultra - Kthehu në faqen kryesore"
          aria-describedby="brand-help"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span role="img" aria-label="raketa">🚀</span>
          <span>EuroWeb Ultra</span>
          <span id="brand-help" className="sr-only">
            Faqja kryesore e EuroWeb Ultra platformës
          </span>
        </motion.a>

        {/* Desktop Menu */}
        <div className="navbar-menu" role="group" aria-label="Menu kryesor">
          <motion.a
            href="/dashboard"
            className="navbar-item"
            role="button"
            aria-label="Dashboard - Paneli kryesor i kontrollit"
            aria-describedby="dashboard-help"
            tabIndex={0}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Dashboard
            <span id="dashboard-help" className="sr-only">
              Shko te paneli i kontrollit me statistika dhe metrika
            </span>
          </motion.a>

          <motion.button
            type="button"
            className="navbar-item"
            role="button"
            aria-label="Kërkim - Hap funksionin e kërkimit"
            aria-describedby="search-help"
            aria-keyshortcuts="Ctrl+K"
            tabIndex={0}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Search
            <span id="search-help" className="sr-only">
              Hap modalin e kërkimit. Shkurtore: Ctrl+K
            </span>
          </motion.button>

          <motion.a
            href="/analytics"
            className="navbar-item"
            role="button"
            aria-label="Analytics - Analiza dhe raporte"
            aria-describedby="analytics-help"
            tabIndex={0}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Analytics
            <span id="analytics-help" className="sr-only">
              Shiko analizat e detajuara dhe raportet e performancës
            </span>
          </motion.a>

          {/* AGI Status Indicator */}
          <motion.div
            id="agi-status-indicator"
            className={`agi-status ${agiStatus === 'PROCESSING' ? 'processing' : ''}`}
            role="status"
            aria-live="polite"
            aria-label={`AGI Status: ${agiStatus}`}
            aria-describedby="agi-help"
            tabIndex={0}
            whileHover={{ scale: 1.05 }}
          >
            <span role="img" aria-label="tru">🧠</span>
            <span>{agiStatus}</span>
            <span id="agi-help" className="sr-only">
              Statusi aktual i sistemit AGI. {agiStatus === 'PROCESSING' ? 'Duke procesuar...' : 'Gati për përdorim'}
            </span>
          </motion.div>

          {/* Time Display */}
          <div
            className="time-display"
            role="timer"
            aria-live="off"
            aria-label={`Koha aktuale: ${formatTime(currentTime)}`}
            aria-describedby="time-help"
            tabIndex={0}
          >
            {formatTime(currentTime)}
            <span id="time-help" className="sr-only">
              Koha aktuale e sistemit në format 24-orësh
            </span>
          </div>

          {/* Notifications */}
          <motion.button
            type="button"
            className="notification-badge navbar-item"
            data-count={notifications}
            role="button"
            aria-label={`Njoftimet: ${notifications} të reja`}
            aria-describedby="notifications-help"
            aria-keyshortcuts="Alt+N"
            tabIndex={0}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <span role="img" aria-label="zile">🔔</span>
            <span id="notifications-help" className="sr-only">
              Ke {notifications} njofime të reja. Shkurtore: Alt+N
            </span>
          </motion.button>

          {/* Profile */}
          <motion.button
            type="button"
            className="navbar-item"
            onClick={onProfileClick}
            role="button"
            aria-label="Profili - Hap menunë e profilit"
            aria-describedby="profile-help"
            aria-keyshortcuts="Alt+P"
            tabIndex={0}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span role="img" aria-label="perdorues">👤</span>
            <span id="profile-help" className="sr-only">
              Hap menunë e profilit tuaj. Shkurtore: Alt+P
            </span>
          </motion.button>

          {/* Settings */}
          <motion.button
            type="button"
            className="navbar-item"
            onClick={onSettingsClick}
            role="button"
            aria-label="Rregullimet - Hap panelin e rregullimeve"
            aria-describedby="settings-help"
            aria-keyshortcuts="Alt+S"
            tabIndex={0}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span role="img" aria-label="rregullime">⚙️</span>
            <span id="settings-help" className="sr-only">
              Hap panelin e rregullimeve të sistemit. Shkurtore: Alt+S
            </span>
          </motion.button>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          type="button"
          className="mobile-menu-toggle"
          onClick={onMenuToggle}
          {...(isMobileMenuOpen !== undefined && { 'aria-expanded': isMobileMenuOpen })}
          aria-label="Menù mobile - Hap ose mbyll navigimin"
          aria-describedby="mobile-menu-help"
          title="Menù mobile"
        >
          <span role="img" aria-label="menu">{isMobileMenuOpen ? "✕" : "☰"}</span>
          <span id="mobile-menu-help" className="sr-only">
            {isMobileMenuOpen ? "Mbyll menunë mobile" : "Hap menunë mobile"}. Shkurtore: Alt+M
          </span>
        </button>
      </div>
    </motion.nav>
  );
}

import React from 'react';
import { useAGI } from '../lib/AGIContext';
import { motion } from 'framer-motion';

interface NavbarProps {
  onMenuToggle?: () => void;
  onProfileClick?: () => void;
  onSettingsClick?: () => void;
  className?: string;
}

export default function Navbar({ onMenuToggle, onProfileClick, onSettingsClick, className = "" }: NavbarProps) {
  const { actions, memory } = useAGI();
  const [scrollPosition, setScrollPosition] = React.useState(0);
  
  // Get state from AGI memory
  const currentTime = memory.user?.currentTime || new Date().toISOString();
  const agiStatus = memory.agi?.status || 'IDLE';
  const theme = memory.ui?.theme || 'light';

  const isScrolled = scrollPosition > 20;
  const notifications = 3; // Could be from memory too

  React.useEffect(() => {
    // Handle scroll position updates
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  React.useEffect(() => {
    // Note: UI activation would need to be implemented in AGICore
    // For now, just track the AGI status
    if (agiStatus === 'PROCESSING') {
      // ui.pulseElement?.('agi-status-indicator');
    }
  }, [agiStatus]);

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
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        background: isScrolled 
          ? 'rgba(248, 250, 252, 0.95)' 
          : 'rgba(255, 255, 255, 0.90)',
        backdropFilter: 'blur(20px)',
        borderBottom: isScrolled 
          ? '1px solid rgba(99, 102, 241, 0.2)' 
          : '1px solid rgba(148, 163, 184, 0.1)',
        padding: '1rem 2rem',
        transition: 'all 0.3s ease',
        boxShadow: isScrolled 
          ? '0 4px 20px rgba(99, 102, 241, 0.1)' 
          : '0 2px 10px rgba(0, 0, 0, 0.05)'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        {/* Logo and Brand */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <button
        onClick={onMenuToggle}
        style={{
          background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
          border: '1px solid rgba(99, 102, 241, 0.2)',
          borderRadius: '12px',
          color: '#4f46e5',
          fontSize: '18px',
          cursor: 'pointer',
          padding: '0.75rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.2s ease',
          minWidth: '48px',
          minHeight: '48px',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.05)';
          e.currentTarget.style.background = 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)';
          e.currentTarget.style.color = '#ffffff';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(99, 102, 241, 0.3)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.background = 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)';
          e.currentTarget.style.color = '#4f46e5';
          e.currentTarget.style.boxShadow = 'none';
        }}
        onMouseDown={(e) => {
          e.currentTarget.style.transform = 'scale(0.95)';
        }}
        onMouseUp={(e) => {
          e.currentTarget.style.transform = 'scale(1.05)';
        }}
          >
        ☰
          </button>

          <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem'
          }}>
        <div style={{
          fontSize: '1.8rem',
          animation: 'pulse 2s ease-in-out infinite alternate'
        }}>
          🌌
        </div>
        <div>
          <div style={{
            fontSize: '1.2rem',
            fontWeight: 'bold',
            background: 'linear-gradient(45deg, #FFD700, #FFA500)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent'
          }}>
            UltraWebThinking
          </div>
          <div style={{
            fontSize: '0.7rem',
            color: '#00FF88',
            fontWeight: 'bold',
            letterSpacing: '1px'
          }}>
            WEB8 INDUSTRIAL
          </div>
        </div>
          </div>
        </div>

        {/* Navigation Links */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          {[
        { icon: '🏠', label: 'Dashboard', active: true, href: '/' },
        { icon: '🧠', label: 'AGI', active: false, href: '/agi' },
        { icon: '🚇', label: 'AGI Tunnel', active: false, href: '/agi-tunnel' },
        { icon: '🧠', label: 'AGI Matrix', active: false, href: '/agi-matrix' },
        { icon: '🎨', label: 'Panda Demo', active: false, href: '/panda-demo' },
        { icon: '📊', label: 'Analytics', active: false, href: '/analytics' },
        { icon: '🌊', label: 'Surfing', active: false, href: '/surfing' },
        { icon: '⚡', label: 'Tools', active: false, href: '/tools' }
          ].map((item, index) => (
        <a
          key={index}
          href={item.href}
          style={{
            background: item.active 
          ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(79, 70, 229, 0.1))' 
          : 'transparent',
            border: item.active 
          ? '1px solid rgba(99, 102, 241, 0.3)' 
          : '1px solid transparent',
            borderRadius: '12px',
            color: item.active ? '#6366f1' : '#64748b',
            cursor: 'pointer',
            padding: '0.6rem 1rem',
            fontSize: '0.85rem',
            fontWeight: item.active ? '600' : '500',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            textDecoration: 'none'
          }}
          onMouseEnter={(e) => {
            if (!item.active) {
          e.currentTarget.style.background = 'rgba(99, 102, 241, 0.1)';
          e.currentTarget.style.color = '#6366f1';
          e.currentTarget.style.transform = 'translateY(-1px)';
            }
          }}
          onMouseLeave={(e) => {
            if (!item.active) {
          e.currentTarget.style.background = 'transparent';
          e.currentTarget.style.color = '#64748b';
          e.currentTarget.style.transform = 'translateY(0)';
            }
          }}
        >
          <span style={{ fontSize: '16px' }}>{item.icon}</span>
          <span>{item.label}</span>
        </a>
          ))}
        </div>

        {/* Right Side Controls */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem'
        }}>
          {/* Live Clock */}
          <div style={{
        background: 'rgba(0, 255, 136, 0.1)',
        border: '1px solid rgba(0, 255, 136, 0.3)',
        borderRadius: '8px',
        padding: '0.4rem 0.8rem',
        color: '#00FF88',
        fontSize: '0.85rem',
        fontFamily: 'monospace',
        fontWeight: 'bold'
          }}>
        {formatTime(currentTime)}
          </div>

          {/* Notifications */}
          <button
        style={{
          position: 'relative',
          background: 'rgba(255, 215, 0, 0.1)',
          border: '1px solid rgba(255, 215, 0, 0.3)',
          borderRadius: '8px',
          color: '#FFD700',
          fontSize: '16px',
          cursor: 'pointer',
          padding: '0.5rem',
          transition: 'all 0.2s ease'
        }}
          >
        🔔
        {notifications > 0 && (
          <span style={{
            position: 'absolute',
            top: '-5px',
            right: '-5px',
            background: '#FF4444',
            color: 'white',
            borderRadius: '50%',
            width: '18px',
            height: '18px',
            fontSize: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold'
          }}>
            {notifications}
          </span>
        )}
          </button>

          {/* Settings */}
          <button
        onClick={onSettingsClick}
        style={{
          background: 'rgba(255, 215, 0, 0.1)',
          border: '1px solid rgba(255, 215, 0, 0.3)',
          borderRadius: '8px',
          color: '#FFD700',
          fontSize: '16px',
          cursor: 'pointer',
          padding: '0.5rem',
          transition: 'all 0.2s ease'
        }}
          >
        ⚙️
          </button>

          {/* Profile */}
          <button
        onClick={onProfileClick}
        style={{
          background: 'linear-gradient(45deg, #FFD700, #FFA500)',
          border: 'none',
          borderRadius: '50%',
          color: '#0a0a23',
          fontSize: '16px',
          cursor: 'pointer',
          padding: '0.6rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'bold',
          transition: 'all 0.2s ease',
          boxShadow: '0 4px 12px rgba(255, 215, 0, 0.3)'
        }}
          >
        👤
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0% { transform: scale(1); }
          100% { transform: scale(1.1); }
        }
      `}</style>
    </motion.nav>
  );
}

export { Navbar }

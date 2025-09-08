'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cva, type VariantProps } from 'class-variance-authority';
import { clsx } from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import SearchBar from '@/components/SearchBar';

const navbarVariants = cva(
  "w-full bg-white border-b border-gray-200 transition-all duration-300 ease-in-out",
  {
    variants: {
      position: {
        static: "relative",
        fixed: "fixed top-0 left-0 right-0 z-50",
        sticky: "sticky top-0 z-40"
      },
      size: {
        sm: "h-12",
        md: "h-16",
        lg: "h-20"
      },
      variant: {
        default: "bg-white border-gray-200",
        glass: "bg-white/80 backdrop-blur-md border-white/20",
        dark: "bg-gray-900 border-gray-700",
        transparent: "bg-transparent border-transparent"
      },
      shadow: {
        none: "shadow-none",
        sm: "shadow-sm",
        md: "shadow-md",
        lg: "shadow-lg"
      }
    },
    defaultVariants: {
      position: "sticky",
      size: "md",
      variant: "default",
      shadow: "sm"
    }
  }
);

const navItemVariants = cva(
  "relative px-3 py-2 text-sm font-medium transition-all duration-200 ease-in-out rounded-md",
  {
    variants: {
      state: {
        default: "text-gray-600 hover:text-gray-900 hover:bg-gray-50",
        active: "text-blue-600 bg-blue-50",
        disabled: "text-gray-400 cursor-not-allowed"
      },
      size: {
        sm: "px-2 py-1 text-xs",
        md: "px-3 py-2 text-sm",
        lg: "px-4 py-3 text-base"
      }
    },
    defaultVariants: {
      state: "default",
      size: "md"
    }
  }
);

interface NavItem {
  id: string;
  label: string;
  href: string;
  icon?: React.ReactNode;
  badge?: string | number;
  disabled?: boolean;
  external?: boolean;
}

interface NavbarProps extends VariantProps<typeof navbarVariants> {
  logo?: React.ReactNode;
  items?: NavItem[];
  actions?: React.ReactNode;
  showSearch?: boolean;
  searchPlaceholder?: string;
  onSearch?: (query: string) => void;
  className?: string;
  mobileBreakpoint?: 'sm' | 'md' | 'lg';
}

const defaultNavItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', href: '/' },
  { id: 'agi-dashboard', label: '🧠 AGI Intelligence', href: '/dashboard', icon: '🧠' },
  { id: 'aviation', label: 'Aviation', href: '/aviation' },
  { id: 'industrial', label: 'Industrial', href: '/industrial' },
  { id: 'uut', label: 'UUT', href: '/uut' },
  { id: 'lora', label: 'LoRa', href: '/lora' },
  { id: 'mesh', label: 'Mesh', href: '/mesh' },
  { id: 'agisheet', label: 'AGI Sheet', href: '/agisheet' },
  { id: 'openmind', label: 'Open Mind', href: '/openmind' }
];

export default function Navbar({
  position,
  size,
  variant,
  shadow,
  logo,
  items = defaultNavItems,
  actions,
  showSearch = true,
  searchPlaceholder = "Search Web8...",
  onSearch,
  className,
  mobileBreakpoint = 'md',
  ...props
}: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    if (position === 'sticky' || position === 'fixed') {
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [position]);

  const isActiveRoute = (href: string) => {
    if (!pathname) return false;
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const mobileBreakpointClass = {
    sm: 'sm:hidden',
    md: 'md:hidden',
    lg: 'lg:hidden'
  }[mobileBreakpoint];

  const desktopBreakpointClass = {
    sm: 'sm:flex',
    md: 'md:flex',
    lg: 'lg:flex'
  }[mobileBreakpoint];

  return (
    <motion.nav
      className={clsx(
        navbarVariants({ position, size, variant, shadow }),
        isScrolled && variant === 'glass' && "bg-white/90",
        className
      )}
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.1 }}
      role="navigation"
      aria-label="Main navigation"
      {...props}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-full">
          {/* Logo */}
          <motion.div
            className="flex-shrink-0"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.1 }}
          >
            {logo || (
              <Link
                href="/"
                className="flex items-center space-x-2"
                aria-label="Web8 home"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">W8</span>
                </div>
                <span className="text-xl font-bold text-gray-900">Web8</span>
              </Link>
            )}
          </motion.div>

          {/* Desktop Navigation */}
          <div className={clsx("hidden space-x-1", desktopBreakpointClass)}>
            <div role="group" aria-label="Main menu">
              {items.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 1 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.1 }}
                >
                  {item.external ? (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={navItemVariants({
                        state: item.disabled ? 'disabled' : 'default',
                        size
                      })}
                      {...(item.disabled && { 'aria-disabled': 'true' })}
                    >
                      <span className="flex items-center space-x-2">
                        {item.icon && <span aria-hidden="true">{item.icon}</span>}
                        <span>{item.label}</span>
                        {item.badge && (
                          <span
                            className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"
                            aria-label={`${item.badge} notifications`}
                          >
                            {item.badge}
                          </span>
                        )}
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                          <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </span>
                    </a>
                  ) : (
                    <Link
                      href={item.href}
                      className={navItemVariants({
                        state: item.disabled
                          ? 'disabled'
                          : isActiveRoute(item.href)
                            ? 'active'
                            : 'default',
                        size
                      })}
                      {...(item.disabled && { 'aria-disabled': 'true' })}
                      aria-current={isActiveRoute(item.href) ? 'page' : undefined}
                    >
                        <span className="flex items-center space-x-2">
                          {item.icon && <span aria-hidden="true">{item.icon}</span>}
                          <span>{item.label}</span>
                          {item.badge && (
                            <span
                              className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"
                              aria-label={`${item.badge} notifications`}
                            >
                              {item.badge}
                            </span>
                          )}
                        </span>
                      {isActiveRoute(item.href) && (
                        <motion.div
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full"
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          transition={{ duration: 0.3 }}
                          layoutId="activeTab"
                        />
                      )}
                    </Link>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Search & Actions */}
          <div className="flex items-center space-x-4">
            {showSearch && (
              <motion.div
                className="hidden sm:block"
                initial={{ opacity: 1 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.1 }}
              >
                <SearchBar
                  placeholder={searchPlaceholder}
                  onSearch={onSearch}
                  size={size === 'lg' ? 'md' : 'sm'}
                  variant="glass"
                  className="w-64"
                />
              </motion.div>
            )}

            {actions && (
              <motion.div
                className="flex items-center space-x-2"
                initial={{ opacity: 1 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.1 }}
              >
                {actions}
              </motion.div>
            )}

            {/* Mobile Menu Button */}
            <motion.button
              type="button"
              onClick={handleMobileMenuToggle}
              className={clsx(
                "inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors",
                mobileBreakpointClass
              )}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
              aria-label="Toggle navigation menu"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <motion.div
                animate={isMobileMenuOpen ? { rotate: 180 } : { rotate: 0 }}
                transition={{ duration: 0.2 }}
              >
                {isMobileMenuOpen ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </motion.div>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            id="mobile-menu"
            className={clsx("border-t border-gray-200 bg-white", mobileBreakpointClass)}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            aria-label="Mobile navigation menu"
          >
            <div className="px-4 py-4 space-y-2">
              {showSearch && (
                <motion.div
                  className="mb-4"
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <SearchBar
                    placeholder={searchPlaceholder}
                    onSearch={onSearch}
                    size="sm"
                    variant="default"
                    className="w-full"
                  />
                </motion.div>
              )}

              {items.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1 + (index * 0.05) }}
                >
                  {item.external ? (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={clsx(
                        "block px-3 py-2 text-base font-medium rounded-md transition-colors",
                        item.disabled
                          ? "text-gray-400 cursor-not-allowed"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                      )}
                      onClick={() => setIsMobileMenuOpen(false)}
                      {...(item.disabled && { 'aria-disabled': 'true' })}
                    >
                      <span className="flex items-center space-x-3">
                        {item.icon && <span aria-hidden="true">{item.icon}</span>}
                        <span>{item.label}</span>
                        {item.badge && (
                          <span
                            className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"
                            aria-label={`${item.badge} notifications`}
                          >
                            {item.badge}
                          </span>
                        )}
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                          <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </span>
                    </a>
                  ) : (
                    <Link
                      href={item.href}
                      className={clsx(
                        "block px-3 py-2 text-base font-medium rounded-md transition-colors",
                        item.disabled
                          ? "text-gray-400 cursor-not-allowed"
                          : isActiveRoute(item.href)
                            ? "text-blue-600 bg-blue-50"
                            : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                      )}
                      onClick={() => setIsMobileMenuOpen(false)}
                      {...(item.disabled && { 'aria-disabled': 'true' })}
                      aria-current={isActiveRoute(item.href) ? 'page' : undefined}
                    >
                      <span className="flex items-center space-x-3">
                        {item.icon && <span aria-hidden="true">{item.icon}</span>}
                        <span>{item.label}</span>
                        {item.badge && (
                          <span
                            className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"
                            aria-label={`${item.badge} notifications`}
                          >
                              {item.badge}
                            </span>
                        )}
                      </span>
                    </Link>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

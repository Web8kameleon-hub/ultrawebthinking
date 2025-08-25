/**
 * Footer Component - Advanced Footer System
 * Comprehensive footer with links and information
 * 
 * @author Ledjan Ahmati (100% Owner)
 * @contact dealsjona@gmail.com
 * @version 2.0.0 Dynamic
 * @license MIT
 */

'use client'

import React from 'react'
import { motion } from 'framer-motion'

interface FooterLink {
  label: string
  href: string
  external?: boolean
}

interface FooterSection {
  title: string
  links: FooterLink[]
}

interface FooterProps {
  sections?: FooterSection[]
  showCopyright?: boolean
  showLogo?: boolean
  logo?: React.ReactNode
  socialLinks?: Array<{
    platform: string
    href: string
    icon: React.ReactNode
  }>
  className?: string
}

export function Footer({
  sections = [],
  showCopyright = true,
  showLogo = true,
  logo,
  socialLinks = [],
  className = ''
}: FooterProps) {
  const defaultSections: FooterSection[] = [
    {
      title: 'Platform',
      links: [
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Analytics', href: '/analytics' },
        { label: 'Reports', href: '/reports' },
        { label: 'Settings', href: '/settings' }
      ]
    },
    {
      title: 'Resources',
      links: [
        { label: 'Documentation', href: '/docs' },
        { label: 'API Reference', href: '/api' },
        { label: 'Support', href: '/support' },
        { label: 'Status', href: '/status' }
      ]
    },
    {
      title: 'Company',
      links: [
        { label: 'About', href: '/about' },
        { label: 'Blog', href: '/blog' },
        { label: 'Careers', href: '/careers' },
        { label: 'Contact', href: '/contact' }
      ]
    },
    {
      title: 'Legal',
      links: [
        { label: 'Privacy Policy', href: '/privacy' },
        { label: 'Terms of Service', href: '/terms' },
        { label: 'Cookie Policy', href: '/cookies' },
        { label: 'GDPR', href: '/gdpr' }
      ]
    }
  ]

  const footerSections = sections.length > 0 ? sections : defaultSections

  return (
    <motion.footer
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-gray-900/95 backdrop-blur-xl border-t border-gray-700 ${className}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo and Description */}
          {showLogo && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-1"
            >
              {logo ? (
                <div className="mb-4">{logo}</div>
              ) : (
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-white">EuroWeb Platform</h3>
                </div>
              )}
              
              <p className="text-gray-400 text-sm mb-6">
                Advanced business platform with AI-powered analytics, 
                automation, and comprehensive data management solutions.
              </p>

              {/* Social Links */}
              {socialLinks.length > 0 && (
                <div className="flex space-x-4">
                  {socialLinks.map((social, index) => (
                    <motion.a
                      key={social.platform}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors text-gray-400 hover:text-white"
                    >
                      {social.icon}
                    </motion.a>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* Footer Sections */}
          {footerSections.map((section, sectionIndex) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + sectionIndex * 0.1 }}
            >
              <h4 className="text-white font-semibold mb-4">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <motion.li
                    key={link.label}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + sectionIndex * 0.1 + linkIndex * 0.05 }}
                  >
                    <motion.a
                      href={link.href}
                      target={link.external ? '_blank' : undefined}
                      rel={link.external ? 'noopener noreferrer' : undefined}
                      whileHover={{ x: 2, color: '#ffffff' }}
                      className="text-gray-400 hover:text-white transition-colors text-sm"
                    >
                      {link.label}
                      {link.external && (
                        <svg className="inline w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      )}
                    </motion.a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Copyright and Bottom Section */}
        {showCopyright && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-12 pt-8 border-t border-gray-700 flex flex-col md:flex-row justify-between items-center"
          >
            <div className="text-gray-400 text-sm">
              © {new Date().getFullYear()} EuroWeb Platform. All rights reserved.
              <span className="ml-2">
                Built with ❤️ by <span className="text-white font-medium">Ledjan Ahmati</span>
              </span>
            </div>

            <div className="mt-4 md:mt-0 flex items-center space-x-4 text-sm text-gray-400">
              <span>Version 8.0.0</span>
              <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
              <motion.span
                animate={{ color: ['#10b981', '#3b82f6', '#10b981'] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="flex items-center space-x-1"
              >
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>All systems operational</span>
              </motion.span>
            </div>
          </motion.div>
        )}
      </div>
    </motion.footer>
  )
}

export default Footer

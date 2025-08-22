'use client';

import Link from 'next/link';
import { useState } from 'react';

export function FloatingNavMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { href: '/openmind', label: '🧠 OpenMind AI', description: 'Universal AI Gateway' },
    { href: '/guardian', label: '🛡️ Guardian', description: 'Security Control' },
    { href: '/browser', label: '🌐 Web8 Browser', description: 'Advanced Browser' },
    { href: '/agi-demo', label: '🤖 AGI Demo', description: 'AI Demonstration' },
    { href: '/agibionature-demo', label: '🌿 AGI Bio', description: 'Bio Nature AI' },
    { href: '/agieco-demo', label: '♻️ AGI Eco', description: 'Ecological AI' },
    { href: '/ultra-live', label: '⚡ Ultra Live', description: 'Live Platform' }
  ];

  return (
    <>
      {/* Floating Menu Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-14 h-14 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center ${
            isOpen ? 'rotate-45' : 'hover:scale-110'
          }`}
        >
          {isOpen ? '✕' : '🚀'}
        </button>
      </div>

      {/* Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-black bg-opacity-20 backdrop-blur-sm">
          <div className="fixed bottom-24 right-6 w-80 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-4">
              <h3 className="text-lg font-semibold">🧠 EuroWeb Platform</h3>
              <p className="text-sm opacity-90">"Nuk ja mbyllim deren asnje mendje te ndritur"</p>
            </div>

            {/* Menu Items */}
            <div className="max-h-96 overflow-y-auto">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="block px-6 py-4 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{item.label.split(' ')[0]}</span>
                    <div>
                      <div className="font-medium text-gray-900">{item.label.substring(2)}</div>
                      <div className="text-sm text-gray-500">{item.description}</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <div className="text-xs text-gray-500 text-center">
                ✅ Live & Working | 🛡️ Industrial Architecture
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default FloatingNavMenu;

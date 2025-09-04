'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

const NavBreadcrumb: React.FC = () => {
  const pathname = usePathname();

  const getBreadcrumbs = () => {
    switch (pathname) {
      case '/':
        return [{ name: 'Main Dashboard', href: '/', active: true }];
      case '/kristal':
        return [
          { name: 'Main Dashboard', href: '/', active: false },
          { name: 'Kristal Dashboard', href: '/kristal', active: true }
        ];
      case '/testing':
        return [
          { name: 'Main Dashboard', href: '/', active: false },
          { name: 'Heavy Testing', href: '/testing', active: true }
        ];
      case '/admin':
        return [
          { name: 'Main Dashboard', href: '/', active: false },
          { name: 'Admin Panel', href: '/admin', active: true }
        ];
      case '/light':
        return [
          { name: 'Main Dashboard', href: '/', active: false },
          { name: 'Light Mode', href: '/light', active: true }
        ];
      default:
        return [{ name: 'Main Dashboard', href: '/', active: true }];
    }
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <nav className="flex items-center space-x-2 text-sm mb-6">
      {breadcrumbs.map((crumb, index) => (
        <div key={crumb.href} className="flex items-center">
          {index > 0 && (
            <span className="mx-2 text-gray-400">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </span>
          )}
          
          {crumb.active ? (
            <span className="font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
              {crumb.name}
            </span>
          ) : (
            <Link 
              href={crumb.href}
              className="text-gray-600 hover:text-blue-600 hover:bg-blue-50 px-3 py-1 rounded-full transition-colors"
            >
              {crumb.name}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
};

export default NavBreadcrumb;

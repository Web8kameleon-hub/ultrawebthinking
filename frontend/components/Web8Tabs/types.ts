/**
 * TypeScript interfaces for Web8 Tab System
 * @author Ledjan Ahmati
 * @version 8.0.0-WEB8
 * @contact dealsjona@gmail.com
 */

import React from 'react';

export interface Tab {
  id: string;
  title: string;
  url: string;
  isActive: boolean;
  isLoading: boolean;
  content?: React.ReactNode;
}

export interface NavigationState {
  canGoBack: boolean;
  canGoForward: boolean;
  currentUrl: string;
  isSecure: boolean;
}

export interface ConnectionStatus {
  isConnected: boolean;
  status: 'connected' | 'connecting' | 'error';
  lastUpdate: Date;
}

export interface PerformanceMetrics {
  cpu: number;
  memory: number;
  network: number;
  status: 'optimal' | 'warning' | 'critical';
}

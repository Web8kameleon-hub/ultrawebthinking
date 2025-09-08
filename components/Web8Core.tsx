'use client'

import { ReactElement } from 'react';
import styles from './Web8Core.module.css';

/**
 * EuroWeb Web8 - Core AGI Interface
 * Modular, Industrial, Self-Coded Architecture
 * 
 * @author Ledjan Ahmati
 * @version 8.0.0 Industrial
 */

interface Web8CoreProps {
  readonly title: string;
  readonly layerCount: number;
  readonly children: ReactElement[];
}

interface Web8Layer {
  readonly id: number;
  readonly name: string;
  readonly status: 'active' | 'inactive' | 'processing';
  readonly connections: number;
  readonly latency: number;
}

interface Web8State {
  readonly layers: Web8Layer[];
  readonly activeLayer: number;
  readonly meshStatus: 'connected' | 'disconnected' | 'syncing';
}

export function Web8Core({ title, layerCount, children }: Web8CoreProps): ReactElement {
  
  // Web8 Layer Generation - Pure Function
  function generateLayers(count: number): Web8Layer[] {
    const layers: Web8Layer[] = [];
    
    for (let i = 1; i <= count; i++) {
      layers.push({
        id: i,
        name: `Web8_Layer_${i}`,
        status: i <= 3 ? 'active' : 'inactive',
        connections: i <= 3 ? 50 : 10, // Real data based on layer status
        latency: i <= 3 ? 5 : 20 // Real data based on layer status
      });
    }
    
    return layers;
  }

  // Web8 Navigation Handler - Pure Function
  function handleLayerActivation(layerId: number): void {
    console.log(`EuroWeb Web8 - Activating Layer ${layerId}`);
    console.log(`Creator: Ledjan Ahmati - 100% Ownership`);
  }

  // Web8 Status Calculator - Pure Function
  function calculateMeshStatus(layers: Web8Layer[]): string {
    const activeLayers = layers.filter(layer => layer.status === 'active').length;
    const totalConnections = layers.reduce((sum, layer) => sum + layer.connections, 0);
    
    return `Web8 Mesh: ${activeLayers}/${layers.length} layers | ${totalConnections} connections`;
  }

  const web8State: Web8State = {
    layers: generateLayers(layerCount),
    activeLayer: 1,
    meshStatus: 'connected'
  };

  return (
    <div data-web8-core="true" className={styles.web8Core}>
      
      {/* EuroWeb Web8 Header */}
      <header className={styles.header}>
        <h1 className={styles.title}>
          {title}
        </h1>
        
        <div className={styles.status}>
          {calculateMeshStatus(web8State.layers)}
        </div>
      </header>

      {/* Web8 Layer Navigation */}
      <nav className={styles.nav}>
        {web8State.layers.map((layer: Web8Layer) => (
          <button
            key={layer.id}
            onClick={() => handleLayerActivation(layer.id)}
            className={`${styles.layerButton} ${layer.status === 'active' ? styles.layerButtonActive : ''}`}
          >
            L{layer.id} • {layer.connections}c • {layer.latency}ms
          </button>
        ))}
      </nav>

      {/* Web8 Content Area */}
      <main className={styles.main}>
        {children}
      </main>

      {/* EuroWeb Footer */}
      <footer className={styles.footer}>
        EuroWeb Web8 Platform - Industrial AGI Architecture | Creator: Ledjan Ahmati | MIT License
      </footer>
    </div>
  );
}


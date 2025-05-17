import React, { useEffect } from 'react';
import { monitor } from '../utils/monitor'; // Importo modulin e monitorimit

/**
 * Komponent për Layer 2 me observability të avancuar.
 */
export function Layer2() {
  useEffect(() => {
    monitor.log('Layer 2 u montua.', 'info', { layer: 2 });
    return () => monitor.log('Layer 2 u çmontua.', 'info', { layer: 2 });
  }, []);

  const handleAction = () => {
    monitor.log('Butoni i Layer 2 u klikua.', 'info', { layer: 2 });
    // Logjikë shtesë për veprimin
  };

  return (
    <div className="p-6 bg-background-light rounded-lg shadow-custom">
      <h2 className="text-3xl font-bold text-accent mb-4">Layer 2 Komponenti</h2>
      <p className="text-lg text-gray-300 mb-6">Ky është një komponent i zgjuar nga Layer 2.</p>
      <button
        className="bg-accent text-white px-6 py-3 rounded-custom shadow-md hover:bg-secondary transition duration-custom"
        onClick={handleAction}
      >
        Vepro Tani
      </button>
    </div>
  );
}

/**
 * Komponent për Layer 3 me observability të avancuar.
 */
export function Layer3() {
  useEffect(() => {
    monitor.log('Layer 3 u montua.', 'info', { layer: 3 });
    return () => monitor.log('Layer 3 u çmontua.', 'info', { layer: 3 });
  }, []);

  const handleAction = () => {
    monitor.log('Butoni i Layer 3 u klikua.', 'info', { layer: 3 });
    // Logjikë shtesë për veprimin
  };

  return (
    <div className="p-6 bg-background-light rounded-lg shadow-custom">
      <h2 className="text-3xl font-bold text-accent mb-4">Layer 3 Komponenti</h2>
      <p className="text-lg text-gray-300 mb-6">Ky është një komponent i zgjuar nga Layer 3.</p>
      <button
        className="bg-accent text-white px-6 py-3 rounded-custom shadow-md hover:bg-secondary transition duration-custom"
        onClick={handleAction}
      >
        Vepro Tani
      </button>
    </div>
  );
}

/**
 * Komponent për Layer 4 me observability të avancuar.
 */
export function Layer4() {
  useEffect(() => {
    monitor.log('Layer 4 u montua.', 'info', { layer: 4 });
    return () => monitor.log('Layer 4 u çmontua.', 'info', { layer: 4 });
  }, []);

  const handleAction = () => {
    monitor.log('Butoni i Layer 4 u klikua.', 'info', { layer: 4 });
    // Logjikë shtesë për veprimin
  };

  return (
    <div className="p-6 bg-background-light rounded-lg shadow-custom">
      <h2 className="text-3xl font-bold text-accent mb-4">Layer 4 Komponenti</h2>
      <p className="text-lg text-gray-300 mb-6">Ky është një komponent i zgjuar nga Layer 4.</p>
      <button
        className="bg-accent text-white px-6 py-3 rounded-custom shadow-md hover:bg-secondary transition duration-custom"
        onClick={handleAction}
      >
        Vepro Tani
      </button>
    </div>
  );
}

/**
 * Komponent për Layer 5 me observability të avancuar.
 */
export function Layer5() {
  useEffect(() => {
    monitor.log('Layer 5 u montua.', 'info', { layer: 5 });
    return () => monitor.log('Layer 5 u çmontua.', 'info', { layer: 5 });
  }, []);

  const handleAction = () => {
    monitor.log('Butoni i Layer 5 u klikua.', 'info', { layer: 5 });
    // Logjikë shtesë për veprimin
  };

  return (
    <div className="p-6 bg-background-light rounded-lg shadow-custom">
      <h2 className="text-3xl font-bold text-accent mb-4">Layer 5 Komponenti</h2>
      <p className="text-lg text-gray-300 mb-6">Ky është një komponent i zgjuar nga Layer 5.</p>
      <button
        className="bg-accent text-white px-6 py-3 rounded-custom shadow-md hover:bg-secondary transition duration-custom"
        onClick={handleAction}
      >
        Vepro Tani
      </button>
    </div>
  );
}
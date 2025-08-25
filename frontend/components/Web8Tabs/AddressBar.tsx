/**
 * Web8 Address Bar Component
 * @author Ledjan Ahmati
 * @version 8.0.0-WEB8
 * @contact dealsjona@gmail.com
 */

import React, { useState } from 'react';
import { Tab } from './types';

interface AddressBarProps {
  activeTab: Tab | undefined;
}

const AddressBar: React.FC<AddressBarProps> = ({
  activeTab
}) => {
  const [addressValue, setAddressValue] = useState(activeTab?.url || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Navigation logic would go here
    console.log('Navigate to:', addressValue);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddressValue(e.target.value);
  };

  const canGoBack = false; // Simplified for now
  const canGoForward = false; // Simplified for now
  const isSecure = activeTab?.url?.startsWith('euroweb://') || false;

  return (
    <div className="web8-address-bar">
      <div className="web8-address-controls">
        <div className="web8-nav-controls">
          <button
            className="web8-nav-control-btn"
            onClick={() => console.log('Go back')}
            disabled={!canGoBack}
          >
            ←
          </button>
          <button
            className="web8-nav-control-btn"
            onClick={() => console.log('Go forward')}
            disabled={!canGoForward}
          >
            →
          </button>
          <button
            className="web8-nav-control-btn refresh"
            onClick={() => console.log('Refresh')}
          >
            ↻
          </button>
        </div>
        
        <form onSubmit={handleSubmit} style={{ flex: 1, display: 'flex', gap: '12px' }}>
          <input
            type="text"
            className="web8-address-input"
            value={addressValue}
            onChange={handleInputChange}
            placeholder="Enter URL or search..."
          />
          <button
            type="submit"
            className="web8-secure-btn"
          >
            {isSecure && <span>🔒</span>}
            Go
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddressBar;

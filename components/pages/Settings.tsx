/**
 * EuroWeb Ultra - Settings Component
 * Real production-grade settings panel
 */

import React, { useEffect, useState } from 'react'

interface SettingsProps {
  title?: string
  onSettingsChange?: (settings: any) => void
}

interface SystemSettings {
  theme: 'light' | 'dark' | 'auto'
  language: string
  notifications: boolean
  autoSave: boolean
  debugMode: boolean
  apiEndpoint: string
  refreshInterval: number
}

export const Settings: React.FC<SettingsProps> = ({
  title = "EuroWeb Ultra Settings",
  onSettingsChange
}) => {
  const [settings, setSettings] = useState<SystemSettings>({
    theme: 'dark',
    language: 'en',
    notifications: true,
    autoSave: true,
    debugMode: false,
    apiEndpoint: '/api',
    refreshInterval: 5000
  })

  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem('euroweb-settings')
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings))
      } catch (error) {
        console.error('Failed to load settings:', error)
      }
    }
  }, [])

  const handleSettingChange = (key: keyof SystemSettings, value: any) => {
    const newSettings = { ...settings, [key]: value }
    setSettings(newSettings)
    
    // Save to localStorage
    localStorage.setItem('euroweb-settings', JSON.stringify(newSettings))
    
    // Notify parent component
    if (onSettingsChange) {
      onSettingsChange(newSettings)
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      // Save to backend API
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(settings)
      })

      if (response.ok) {
        console.log('Settings saved successfully')
      }
    } catch (error) {
      console.error('Failed to save settings:', error)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="settings-container">
      <div className="settings-header">
        <h1>{title}</h1>
        <p>Configure your EuroWeb Ultra platform settings</p>
      </div>

      <div className="settings-grid">
        <div className="setting-group">
          <h3>Appearance</h3>
          <div className="setting-item">
            <label htmlFor="theme">Theme:</label>
            <select
              id="theme"
              value={settings.theme}
              onChange={(e) => handleSettingChange('theme', e.target.value)}
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="auto">Auto</option>
            </select>
          </div>
        </div>

        <div className="setting-group">
          <h3>System</h3>
          <div className="setting-item">
            <label htmlFor="language">Language:</label>
            <select
              id="language"
              value={settings.language}
              onChange={(e) => handleSettingChange('language', e.target.value)}
            >
              <option value="en">English</option>
              <option value="al">Albanian</option>
              <option value="de">German</option>
            </select>
          </div>

          <div className="setting-item">
            <label>
              <input
                type="checkbox"
                checked={settings.notifications}
                onChange={(e) => handleSettingChange('notifications', e.target.checked)}
              />
              Enable Notifications
            </label>
          </div>

          <div className="setting-item">
            <label>
              <input
                type="checkbox"
                checked={settings.autoSave}
                onChange={(e) => handleSettingChange('autoSave', e.target.checked)}
              />
              Auto Save
            </label>
          </div>

          <div className="setting-item">
            <label>
              <input
                type="checkbox"
                checked={settings.debugMode}
                onChange={(e) => handleSettingChange('debugMode', e.target.checked)}
              />
              Debug Mode
            </label>
          </div>
        </div>

        <div className="setting-group">
          <h3>API Configuration</h3>
          <div className="setting-item">
            <label htmlFor="apiEndpoint">API Endpoint:</label>
            <input
              id="apiEndpoint"
              type="text"
              value={settings.apiEndpoint}
              onChange={(e) => handleSettingChange('apiEndpoint', e.target.value)}
            />
          </div>

          <div className="setting-item">
            <label htmlFor="refreshInterval">Refresh Interval (ms):</label>
            <input
              id="refreshInterval"
              type="number"
              min="1000"
              max="60000"
              value={settings.refreshInterval}
              onChange={(e) => handleSettingChange('refreshInterval', parseInt(e.target.value))}
            />
          </div>
        </div>
      </div>

      <div className="settings-actions">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="save-button"
        >
          {isSaving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>

      <style jsx>{`
        .settings-container {
          padding: 2rem;
          max-width: 800px;
          margin: 0 auto;
        }

        .settings-header {
          margin-bottom: 2rem;
          text-align: center;
        }

        .settings-header h1 {
          color: #0070f3;
          margin-bottom: 0.5rem;
        }

        .settings-grid {
          display: grid;
          gap: 2rem;
          margin-bottom: 2rem;
        }

        .setting-group {
          background: #f8f9fa;
          padding: 1.5rem;
          border-radius: 8px;
          border: 1px solid #e9ecef;
        }

        .setting-group h3 {
          margin-top: 0;
          margin-bottom: 1rem;
          color: #495057;
        }

        .setting-item {
          margin-bottom: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .setting-item:last-child {
          margin-bottom: 0;
        }

        .setting-item label {
          font-weight: 500;
          color: #6c757d;
        }

        .setting-item input,
        .setting-item select {
          padding: 0.5rem;
          border: 1px solid #ced4da;
          border-radius: 4px;
          font-size: 1rem;
        }

        .setting-item input[type="checkbox"] {
          width: auto;
          margin-right: 0.5rem;
        }

        .settings-actions {
          text-align: center;
        }

        .save-button {
          background: #0070f3;
          color: white;
          border: none;
          padding: 0.75rem 2rem;
          border-radius: 4px;
          font-size: 1rem;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .save-button:hover:not(:disabled) {
          background: #0051cc;
        }

        .save-button:disabled {
          background: #6c757d;
          cursor: not-allowed;
        }

        @media (min-width: 768px) {
          .settings-grid {
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          }
        }
      `}</style>
    </div>
  )
}

export default Settings

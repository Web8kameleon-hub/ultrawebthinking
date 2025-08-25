/**
 * Settings Component - Advanced Settings Management
 * Comprehensive settings panel with theme, preferences, and configurations
 * 
 * @author Ledjan Ahmati (100% Owner)
 * @contact dealsjona@gmail.com
 * @version 2.0.0 Dynamic
 * @license MIT
 */

'use client'

import { useState, useEffect } from 'react'

interface SettingsCategory {
  id: string
  name: string
  icon: string
  settings: Setting[]
}

interface Setting {
  id: string
  name: string
  description: string
  type: 'boolean' | 'select' | 'text' | 'number' | 'color' | 'range'
  value: any
  options?: Array<{ value: any; label: string }>
  min?: number
  max?: number
  step?: number
}

interface SettingsProps {
  categories?: SettingsCategory[]
  onSettingChange?: (categoryId: string, settingId: string, value: any) => void
  className?: string
}

export function Settings({
  categories,
  onSettingChange,
  className = ''
}: SettingsProps) {
  const [settingsData, setSettingsData] = useState<SettingsCategory[]>(
    categories ?? [
      {
        id: 'appearance',
        name: 'Appearance',
        icon: 'palette',
        settings: [
          {
            id: 'theme',
            name: 'Theme',
            description: 'Choose your preferred color scheme',
            type: 'select',
            value: 'dark',
            options: [
              { value: 'light', label: 'Light' },
              { value: 'dark', label: 'Dark' },
              { value: 'auto', label: 'Auto' }
            ]
          },
          {
            id: 'accent_color',
            name: 'Accent Color',
            description: 'Primary color for buttons and highlights',
            type: 'color',
            value: '#3B82F6'
          },
          {
            id: 'font_size',
            name: 'Font Size',
            description: 'Adjust text size for better readability',
            type: 'range',
            value: 14,
            min: 12,
            max: 20,
            step: 1
          },
          {
            id: 'animations',
            name: 'Enable Animations',
            description: 'Show smooth transitions and effects',
            type: 'boolean',
            value: true
          }
        ]
      },
      {
        id: 'notifications',
        name: 'Notifications',
        icon: 'bell',
        settings: [
          {
            id: 'email_notifications',
            name: 'Email Notifications',
            description: 'Receive notifications via email',
            type: 'boolean',
            value: true
          },
          {
            id: 'push_notifications',
            name: 'Push Notifications',
            description: 'Receive browser push notifications',
            type: 'boolean',
            value: false
          },
          {
            id: 'notification_frequency',
            name: 'Frequency',
            description: 'How often to receive notifications',
            type: 'select',
            value: 'immediate',
            options: [
              { value: 'immediate', label: 'Immediate' },
              { value: 'hourly', label: 'Hourly' },
              { value: 'daily', label: 'Daily' },
              { value: 'weekly', label: 'Weekly' }
            ]
          },
          {
            id: 'quiet_hours',
            name: 'Quiet Hours',
            description: 'Disable notifications during these hours',
            type: 'boolean',
            value: false
          }
        ]
      },
      {
        id: 'privacy',
        name: 'Privacy & Security',
        icon: 'shield',
        settings: [
          {
            id: 'analytics',
            name: 'Analytics',
            description: 'Help improve our service by sharing anonymous usage data',
            type: 'boolean',
            value: true
          },
          {
            id: 'data_retention',
            name: 'Data Retention',
            description: 'How long to keep your data',
            type: 'select',
            value: '1year',
            options: [
              { value: '30days', label: '30 Days' },
              { value: '90days', label: '90 Days' },
              { value: '1year', label: '1 Year' },
              { value: 'indefinite', label: 'Indefinite' }
            ]
          },
          {
            id: 'two_factor',
            name: 'Two-Factor Authentication',
            description: 'Add an extra layer of security to your account',
            type: 'boolean',
            value: false
          },
          {
            id: 'session_timeout',
            name: 'Session Timeout',
            description: 'Automatically log out after inactivity (minutes)',
            type: 'number',
            value: 60
          }
        ]
      },
      {
        id: 'performance',
        name: 'Performance',
        icon: 'zap',
        settings: [
          {
            id: 'auto_save',
            name: 'Auto Save',
            description: 'Automatically save changes as you work',
            type: 'boolean',
            value: true
          },
          {
            id: 'cache_size',
            name: 'Cache Size',
            description: 'Amount of data to cache locally (MB)',
            type: 'range',
            value: 100,
            min: 50,
            max: 500,
            step: 50
          },
          {
            id: 'prefetch',
            name: 'Prefetch Data',
            description: 'Load data in advance for faster navigation',
            type: 'boolean',
            value: true
          },
          {
            id: 'compression',
            name: 'Enable Compression',
            description: 'Compress data to reduce bandwidth usage',
            type: 'boolean',
            value: true
          }
        ]
      }
    ]
  )

  const [activeCategory, setActiveCategory] = useState('appearance')
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  const handleSettingChange = (categoryId: string, settingId: string, value: any) => {
    setSettingsData(prev => prev.map(category => 
      category.id === categoryId 
        ? {
            ...category,
            settings: category.settings.map(setting =>
              setting.id === settingId ? { ...setting, value } : setting
            )
          }
        : category
    ))
    
    setHasUnsavedChanges(true)
    onSettingChange?.(categoryId, settingId, value)
  }

  const saveSettings = () => {
    // Simulate saving settings
    setTimeout(() => {
      setHasUnsavedChanges(false)
    }, 1000)
  }

  const resetToDefaults = () => {
    if (window.confirm('Are you sure you want to reset all settings to their default values?')) {
      // Reset logic would go here
      setHasUnsavedChanges(true)
    }
  }

  const getIcon = (iconName: string) => {
    const icons = {
      palette: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
        </svg>
      ),
      bell: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM11 19a2 2 0 104 0m-4 0a2 2 0 114 0m-6 0a2 2 0 104 0 2 2 0 00-4 0z" />
        </svg>
      ),
      shield: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      zap: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    }
    return icons[iconName as keyof typeof icons] ?? icons.palette
  }

  const SettingControl = ({ setting, categoryId }: { setting: Setting; categoryId: string }) => {
    const handleChange = (value: any) => {
      handleSettingChange(categoryId, setting.id, value)
    }

    switch (setting.type) {
      case 'boolean':
        return (
          <button
            onClick={() => handleChange(!setting.value)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              setting.value ? 'bg-blue-600' : 'bg-gray-600'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                setting.value ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        )

      case 'select':
        return (
          <select
            value={setting.value}
            onChange={(e) => handleChange(e.target.value)}
            className="bg-gray-800 border border-gray-700 text-white px-3 py-2 rounded-lg focus:outline-none focus:border-blue-500"
          >
            {setting.options?.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )

      case 'text':
        return (
          <input
            type="text"
            value={setting.value}
            onChange={(e) => handleChange(e.target.value)}
            className="bg-gray-800 border border-gray-700 text-white px-3 py-2 rounded-lg focus:outline-none focus:border-blue-500"
          />
        )

      case 'number':
        return (
          <input
            type="number"
            value={setting.value}
            onChange={(e) => handleChange(Number(e.target.value))}
            className="bg-gray-800 border border-gray-700 text-white px-3 py-2 rounded-lg focus:outline-none focus:border-blue-500 w-24"
          />
        )

      case 'color':
        return (
          <div className="flex items-center space-x-2">
            <input
              type="color"
              value={setting.value}
              onChange={(e) => handleChange(e.target.value)}
              className="w-8 h-8 rounded border border-gray-700 cursor-pointer"
            />
            <span className="text-gray-400 text-sm font-mono">{setting.value}</span>
          </div>
        )

      case 'range':
        return (
          <div className="flex items-center space-x-4 w-full">
            <input
              type="range"
              min={setting.min}
              max={setting.max}
              step={setting.step}
              value={setting.value}
              onChange={(e) => handleChange(Number(e.target.value))}
              className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-white font-medium w-12 text-right">
              {setting.value}{setting.id === 'font_size' ? 'px' : setting.id === 'cache_size' ? 'MB' : ''}
            </span>
          </div>
        )

      default:
        return null
    }
  }

  const activeSettings = settingsData.find(cat => cat.id === activeCategory)?.settings ?? []

  return (
    <div className={`min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-6 ${className}`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Settings</h1>
            <p className="text-gray-400 mt-1">Customize your experience and preferences</p>
          </div>
          
          <div className="flex items-center space-x-4">
            {hasUnsavedChanges && (
              <button
                onClick={saveSettings}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Save Changes
              </button>
            )}
            <button
              onClick={resetToDefaults}
              className="bg-gray-700 hover:bg-gray-600 text-gray-300 px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Reset to Defaults
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Categories Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl p-6 border border-gray-700/50 sticky top-6">
              <h2 className="text-lg font-semibold text-white mb-4">Categories</h2>
              
              <div className="space-y-2">
                {settingsData.map(category => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeCategory === category.id
                        ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                        : 'text-gray-300 hover:bg-gray-700/50'
                    }`}
                  >
                    <div className={activeCategory === category.id ? 'text-blue-400' : 'text-gray-400'}>
                      {getIcon(category.icon)}
                    </div>
                    <span className="font-medium">{category.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Settings Content */}
          <div className="lg:col-span-3">
            <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl p-6 border border-gray-700/50">
              <div className="flex items-center space-x-3 mb-6">
                <div className="text-blue-400">
                  {getIcon(settingsData.find(cat => cat.id === activeCategory)?.icon ?? 'palette')}
                </div>
                <h2 className="text-xl font-semibold text-white">
                  {settingsData.find(cat => cat.id === activeCategory)?.name}
                </h2>
              </div>

              <div className="space-y-6">
                {activeSettings.map(setting => (
                  <div key={setting.id} className="flex items-center justify-between py-4 border-b border-gray-700/50 last:border-b-0">
                    <div className="flex-1 mr-8">
                      <h3 className="text-white font-medium mb-1">{setting.name}</h3>
                      <p className="text-gray-400 text-sm">{setting.description}</p>
                    </div>
                    
                    <div className="flex-shrink-0">
                      <SettingControl setting={setting} categoryId={activeCategory} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Additional Options */}
            {activeCategory === 'privacy' && (
              <div className="mt-6 bg-gray-800/50 backdrop-blur-xl rounded-xl p-6 border border-gray-700/50">
                <h3 className="text-lg font-semibold text-white mb-4">Data Management</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-medium transition-colors">
                    Download My Data
                  </button>
                  <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg font-medium transition-colors">
                    Delete Account
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings

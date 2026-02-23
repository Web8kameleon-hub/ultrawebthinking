/**
 * EuroWeb Ultra - Station Location Configuration Component
 * UI for selecting and configuring station locations
 * 
 * @author Ledjan Ahmati
 * @version Ultra 2.0.0 Location UI
 * @license MIT
 */

'use client'

import React, { useEffect, useState } from 'react'
import { stationLocationManager, type StationLocationConfig as Config, type StationLocation } from '../lib/config/station-location-config'

interface LocationConfigProps {
    onLocationChange?: (location: StationLocation | null) => void
    className?: string
}

export const StationLocationConfigComponent: React.FC<LocationConfigProps> = ({
    onLocationChange,
    className = ''
}) => {
    const [config, setConfig] = useState<Config | null>(null)
    const [availableStations, setAvailableStations] = useState<StationLocation[]>([])
    const [currentLocation, setCurrentLocation] = useState<StationLocation | null>(null)
    const [showCustomForm, setShowCustomForm] = useState(false)
    const [customCoords, setCustomCoords] = useState({ lat: '', lng: '', alt: '' })
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        // Initialize data
        const initConfig = stationLocationManager.getConfig()
        const stations = stationLocationManager.getAllStations()
        const current = stationLocationManager.getCurrentStation()

        setConfig(initConfig)
        setAvailableStations(stations)
        setCurrentLocation(current)

        // Set up location change monitoring
        const interval = setInterval(() => {
            const newCurrent = stationLocationManager.getCurrentStation()
            if (newCurrent?.id !== currentLocation?.id) {
                setCurrentLocation(newCurrent)
                onLocationChange?.(newCurrent)
            }
        }, 1000)

        return () => clearInterval(interval)
    }, [currentLocation?.id, onLocationChange])

    const handleStationSelect = async (stationId: string) => {
        setIsLoading(true)
        try {
            const success = await stationLocationManager.setStationLocation(stationId)
            if (success) {
                const newLocation = stationLocationManager.getCurrentStation()
                setCurrentLocation(newLocation)
                onLocationChange?.(newLocation)
            }
        } catch (_error) {
            console.error('Failed to set station location:', _error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleCustomLocation = async () => {
        if (!customCoords.lat ?? !customCoords.lng) {return}

        setIsLoading(true)
        try {
            const lat = parseFloat(customCoords.lat)
            const lng = parseFloat(customCoords.lng)
            const alt = customCoords.alt ? parseFloat(customCoords.alt) : undefined

            await stationLocationManager.setCustomLocation(lat, lng, alt)
            const newLocation = stationLocationManager.getCurrentStation()
            setCurrentLocation(newLocation)
            onLocationChange?.(newLocation)
            setShowCustomForm(false)
        } catch (_error) {
            console.error('Failed to set custom location:', _error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleGPSEnable = (enabled: boolean) => {
        stationLocationManager.setGPSEnabled(enabled)
        const newConfig = stationLocationManager.getConfig()
        setConfig(newConfig)
    }

    const handleAutoSelect = (enabled: boolean) => {
        stationLocationManager.setAutoSelect(enabled)
        const newConfig = stationLocationManager.getConfig()
        setConfig(newConfig)
    }

    const getStationStatusIcon = (station: StationLocation) => {
        if (station.status === 'active') {return '🟢'}
        if (station.type === 'mobile') {return '📍'}
        if (station.type === 'backup') {return '🟡'}
        return '⚪'
    }

    const getSignalStrength = (station: StationLocation) => {
        // Simulate signal strength based on priority and type
        if (station.status === 'active') {return Math.min(100, station.priority * 10)}
        return Math.max(20, station.priority * 5)
    }

    if (!config) {return <div>Loading...</div>}

    return (
        <div className={`station-location-config ${className}`}>
            <div className="config-header">
                <h3>🗺️ Station Location Configuration</h3>
                <div className="current-location">
                    {currentLocation ? (
                        <span className="location-indicator">
                            📍 {currentLocation.name}
                            <small>({currentLocation.coordinates.latitude.toFixed(4)}, {currentLocation.coordinates.longitude.toFixed(4)})</small>
                        </span>
                    ) : (
                        <span className="no-location">❌ No station selected</span>
                    )}
                </div>
            </div>

            <div className="config-options">
                <div className="option-group">
                    <label className="checkbox-option">
                        <input
                            type="checkbox"
                            checked={config.gpsEnabled}
                            onChange={(e) => handleGPSEnable(e.target.checked)}
                        />
                        🛰️ Enable GPS Tracking
                    </label>

                    <label className="checkbox-option">
                        <input
                            type="checkbox"
                            checked={config.autoSelect}
                            onChange={(e) => handleAutoSelect(e.target.checked)}
                        />
                        🎯 Auto-select Best Station
                    </label>
                </div>

                <div className="stations-list">
                    <h4>Available Stations</h4>
                    {availableStations.map((station) => (
                        <div
                            key={station.id}
                            className={`station-item ${currentLocation?.id === station.id ? 'selected' : ''} ${station.status === 'active' ? 'active' : ''}`}
                            onClick={() => handleStationSelect(station.id)}
                        >
                            <div className="station-info">
                                <div className="station-header">
                                    <span className="station-status">{getStationStatusIcon(station)}</span>
                                    <span className="station-name">{station.name}</span>
                                    <span className="station-type">{station.type}</span>
                                </div>
                                <div className="station-details">
                                    <span className="coordinates">
                                        📍 {station.coordinates.latitude.toFixed(4)}, {station.coordinates.longitude.toFixed(4)}
                                    </span>
                                    <span className="region">{station.type} station</span>
                                </div>
                                <div className="station-capabilities">
                                    {station.coverage.capabilities.includes('LoRa') && <span className="capability">📡 LoRa</span>}
                                    {station.coverage.capabilities.includes('WiFi') && <span className="capability">📶 WiFi</span>}
                                    {station.coverage.capabilities.includes('Satellite') && <span className="capability">🛰️ Sat</span>}
                                    {station.coverage.capabilities.includes('Ethernet') && <span className="capability">🌐 Eth</span>}
                                </div>
                                <div className="station-metrics">
                                    <div className="signal-strength">
                                        <span>Signal: </span>
                                        <div className="signal-bar">
                                            <div
                                                className="signal-fill"
                                                style={{ width: `${getSignalStrength(station)}%` }}
                                            ></div>
                                        </div>
                                        <span>{getSignalStrength(station)}%</span>
                                    </div>
                                    <div className="coverage">
                                        Coverage: {station.coverage.radius}km
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="custom-location">
                    <button
                        className="custom-location-btn"
                        onClick={() => setShowCustomForm(!showCustomForm)}
                    >
                        📍 Set Custom Location
                    </button>

                    {showCustomForm && (
                        <div className="custom-form">
                            <div className="coord-inputs">
                                <input
                                    type="number"
                                    step="any"
                                    placeholder="Latitude"
                                    value={customCoords.lat}
                                    onChange={(e) => setCustomCoords({ ...customCoords, lat: e.target.value })}
                                />
                                <input
                                    type="number"
                                    step="any"
                                    placeholder="Longitude"
                                    value={customCoords.lng}
                                    onChange={(e) => setCustomCoords({ ...customCoords, lng: e.target.value })}
                                />
                                <input
                                    type="number"
                                    step="any"
                                    placeholder="Altitude (optional)"
                                    value={customCoords.alt}
                                    onChange={(e) => setCustomCoords({ ...customCoords, alt: e.target.value })}
                                />
                            </div>
                            <button
                                className="set-custom-btn"
                                onClick={handleCustomLocation}
                                disabled={!customCoords.lat ?? !customCoords.lng ?? isLoading}
                            >
                                {isLoading ? '⏳ Setting...' : '✅ Set Location'}
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <style jsx>{`
                .station-location-config {
                    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
                    border-radius: 12px;
                    padding: 20px;
                    color: white;
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                }

                .config-header {
                    margin-bottom: 20px;
                    padding-bottom: 15px;
                    border-bottom: 2px solid #333;
                }

                .config-header h3 {
                    margin: 0 0 10px 0;
                    color: #4fc3f7;
                    font-size: 1.2em;
                }

                .current-location {
                    font-size: 0.9em;
                }

                .location-indicator {
                    color: #4caf50;
                }

                .location-indicator small {
                    color: #888;
                    margin-left: 8px;
                }

                .no-location {
                    color: #f44336;
                }

                .config-options {
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                }

                .option-group {
                    display: flex;
                    gap: 20px;
                    flex-wrap: wrap;
                }

                .checkbox-option {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    cursor: pointer;
                    padding: 8px 12px;
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 8px;
                    transition: background 0.3s;
                }

                .checkbox-option:hover {
                    background: rgba(255, 255, 255, 0.15);
                }

                .stations-list h4 {
                    margin: 0 0 10px 0;
                    color: #4fc3f7;
                }

                .station-item {
                    background: rgba(255, 255, 255, 0.05);
                    border: 2px solid transparent;
                    border-radius: 8px;
                    padding: 12px;
                    margin-bottom: 8px;
                    cursor: pointer;
                    transition: all 0.3s;
                }

                .station-item:hover {
                    background: rgba(255, 255, 255, 0.1);
                    border-color: #4fc3f7;
                }

                .station-item.selected {
                    border-color: #4caf50;
                    background: rgba(76, 175, 80, 0.2);
                }

                .station-item.active {
                    box-shadow: 0 0 10px rgba(76, 175, 80, 0.5);
                }

                .station-header {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    margin-bottom: 8px;
                }

                .station-name {
                    font-weight: bold;
                    flex: 1;
                }

                .station-type {
                    background: rgba(255, 255, 255, 0.2);
                    padding: 2px 8px;
                    border-radius: 12px;
                    font-size: 0.8em;
                    text-transform: uppercase;
                }

                .station-details {
                    display: flex;
                    justify-content: space-between;
                    font-size: 0.85em;
                    color: #ccc;
                    margin-bottom: 8px;
                }

                .station-capabilities {
                    display: flex;
                    gap: 8px;
                    margin-bottom: 8px;
                }

                .capability {
                    background: rgba(79, 195, 247, 0.3);
                    padding: 2px 6px;
                    border-radius: 6px;
                    font-size: 0.75em;
                }

                .station-metrics {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    font-size: 0.8em;
                }

                .signal-strength {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .signal-bar {
                    width: 60px;
                    height: 6px;
                    background: rgba(255, 255, 255, 0.2);
                    border-radius: 3px;
                    overflow: hidden;
                }

                .signal-fill {
                    height: 100%;
                    background: linear-gradient(90deg, #f44336, #ff9800, #4caf50);
                    transition: width 0.3s;
                }

                .custom-location {
                    border-top: 2px solid #333;
                    padding-top: 15px;
                }

                .custom-location-btn {
                    background: linear-gradient(135deg, #4fc3f7, #29b6f6);
                    border: none;
                    padding: 10px 20px;
                    border-radius: 8px;
                    color: white;
                    font-weight: bold;
                    cursor: pointer;
                    transition: transform 0.2s;
                    width: 100%;
                }

                .custom-location-btn:hover {
                    transform: translateY(-2px);
                }

                .custom-form {
                    margin-top: 15px;
                    padding: 15px;
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 8px;
                }

                .coord-inputs {
                    display: grid;
                    grid-template-columns: 1fr 1fr 1fr;
                    gap: 10px;
                    margin-bottom: 15px;
                }

                .coord-inputs input {
                    padding: 8px 12px;
                    border: 1px solid #555;
                    border-radius: 6px;
                    background: rgba(255, 255, 255, 0.1);
                    color: white;
                }

                .coord-inputs input::placeholder {
                    color: #888;
                }

                .set-custom-btn {
                    background: linear-gradient(135deg, #4caf50, #45a049);
                    border: none;
                    padding: 8px 16px;
                    border-radius: 6px;
                    color: white;
                    font-weight: bold;
                    cursor: pointer;
                    width: 100%;
                }

                .set-custom-btn:disabled {
                    background: #555;
                    cursor: not-allowed;
                }

                @media (max-width: 768px) {
                    .coord-inputs {
                        grid-template-columns: 1fr;
                    }
                    
                    .option-group {
                        flex-direction: column;
                    }
                }
            `}</style>
        </div>
    )
}

export default StationLocationConfigComponent

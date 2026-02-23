/**
 * EuroWeb Ultra - Location Configuration Demo
 * Demonstrates configurable station locations instead of fixed coordinates
 * 
 * @author Ledjan Ahmati
 * @version Ultra 2.0.0 Demo
 * @license MIT
 */

'use client'

import React, { useEffect, useState } from 'react'
import { stationLocationManager, type StationLocation } from '../lib/config/station-location-config'
import { meshNetwork } from '../lib/mesh/mesh-networking'

const LocationConfigDemo: React.FC = () => {
    const [selectedLocation, setSelectedLocation] = useState<StationLocation | null>(null)
    const [availableStations, setAvailableStations] = useState<StationLocation[]>([])
    const [meshStatus, setMeshStatus] = useState<any>(null)
    const [demoStep, setDemoStep] = useState(0)
    const [isRunning, setIsRunning] = useState(false)

    useEffect(() => {
        // Initialize
        const stations = stationLocationManager.getAllStations()
        const current = stationLocationManager.getCurrentStation()
        setAvailableStations(stations)
        setSelectedLocation(current)

        // Monitor mesh status
        const interval = setInterval(() => {
            setMeshStatus(meshNetwork.getNetworkStatus())
            const newCurrent = stationLocationManager.getCurrentStation()
            setSelectedLocation(newCurrent)
        }, 1000)

        return () => clearInterval(interval)
    }, [])

    const demoSteps = [
        {
            title: "🏁 Demo Starting",
            description: "Demonstrating configurable station locations",
            action: () => {
                console.log("🎬 Starting location configuration demo...")
            }
        },
        {
            title: "📍 Set Tirana Central Hub",
            description: "Switching to primary station in Tirana",
            action: async () => {
                await stationLocationManager.setStationLocation('tirana-central')
                console.log("📍 Location set to Tirana Central Hub")
            }
        },
        {
            title: "🌊 Switch to Durrës Port",
            description: "Moving to coastal station for maritime coverage",
            action: async () => {
                await stationLocationManager.setStationLocation('durres-port')
                console.log("🌊 Location set to Durrës Port Station")
            }
        },
        {
            title: "⛰️ Northern Coverage",
            description: "Activating Shkodër station for mountain region",
            action: async () => {
                await stationLocationManager.setStationLocation('shkoder-north')
                console.log("⛰️ Location set to Shkodër Northern Gateway")
            }
        },
        {
            title: "🚐 Mobile Unit",
            description: "Switching to mobile unit with GPS tracking",
            action: async () => {
                stationLocationManager.setGPSEnabled(true)
                await stationLocationManager.setStationLocation('mobile-unit-1')
                console.log("🚐 Mobile unit activated with GPS tracking")
            }
        },
        {
            title: "🎯 Auto Selection",
            description: "Enabling automatic station selection",
            action: async () => {
                stationLocationManager.setAutoSelect(true)
                console.log("🎯 Auto station selection enabled")
            }
        },
        {
            title: "📍 Custom Location",
            description: "Setting custom coordinates",
            action: async () => {
                // Set custom location near Albanian coast
                await stationLocationManager.setCustomLocation(41.1533, 19.6778, 50)
                console.log("📍 Custom location set (41.1533, 19.6778)")
            }
        },
        {
            title: "✅ Demo Complete",
            description: "Location configuration demonstration finished",
            action: () => {
                console.log("✅ Demo completed successfully!")
                setIsRunning(false)
                setDemoStep(0)
            }
        }
    ]

    const runDemo = async () => {
        setIsRunning(true)

        for (let step = 0; step < demoSteps.length; step++) {
            setDemoStep(step)
            await demoSteps[step].action()
            await new Promise(resolve => setTimeout(resolve, 3000)) // Wait 3 seconds between steps
        }
    }

    const getStationTypeColor = (type: string) => {
        switch (type) {
            case 'primary': return '#4caf50'
            case 'backup': return '#ff9800'
            case 'mobile': return '#2196f3'
            case 'temporary': return '#9c27b0'
            default: return '#607d8b'
        }
    }

    return (
        <div className="location-demo">
            <div className="demo-header">
                <h1>🗺️ Station Location Configuration Demo</h1>
                <p>Demonstrimi i sistemit të konfigurueshëm të vendodhjes së stacionit</p>

                <div className="demo-controls">
                    <button
                        className="demo-btn start-btn"
                        onClick={runDemo}
                        disabled={isRunning}
                    >
                        {isRunning ? '⏳ Running Demo...' : '🚀 Start Demo'}
                    </button>

                    <button
                        className="demo-btn reset-btn"
                        onClick={() => {
                            setIsRunning(false)
                            setDemoStep(0)
                            stationLocationManager.setAutoSelect(false)
                            stationLocationManager.setGPSEnabled(false)
                        }}
                        disabled={isRunning}
                    >
                        🔄 Reset
                    </button>
                </div>
            </div>

            {isRunning && (
                <div className="demo-progress">
                    <div className="current-step">
                        <h3>{demoSteps[demoStep]?.title}</h3>
                        <p>{demoSteps[demoStep]?.description}</p>
                        <div className="progress-bar">
                            <div
                                className="progress-fill"
                                style={{ width: `${(demoStep / (demoSteps.length - 1)) * 100}%` }}
                            />
                        </div>
                        <span className="step-counter">
                            Step {demoStep + 1} of {demoSteps.length}
                        </span>
                    </div>
                </div>
            )}

            <div className="demo-content">
                <div className="current-status">
                    <h3>📍 Current Station Status</h3>
                    {selectedLocation ? (
                        <div className="location-info">
                            <div className="location-name">
                                <span className="location-emoji">🏢</span>
                                {selectedLocation.name}
                            </div>
                            <div className="location-coords">
                                📍 {selectedLocation.coordinates.latitude.toFixed(4)}, {selectedLocation.coordinates.longitude.toFixed(4)}
                                {selectedLocation.coordinates.altitude && `, ${selectedLocation.coordinates.altitude}m`}
                            </div>
                            <div className="location-details">
                                <span
                                    className="location-type"
                                    style={{ backgroundColor: getStationTypeColor(selectedLocation.type) }}
                                >
                                    {selectedLocation.type}
                                </span>
                                <span className="location-coverage">
                                    Coverage: {selectedLocation.coverage.radius}km
                                </span>
                            </div>
                            <div className="location-capabilities">
                                {selectedLocation.coverage.capabilities.includes('LoRa') && <span className="cap-badge">📡 LoRa</span>}
                                {selectedLocation.coverage.capabilities.includes('WiFi') && <span className="cap-badge">📶 WiFi</span>}
                                {selectedLocation.coverage.capabilities.includes('Satellite') && <span className="cap-badge">🛰️ Satellite</span>}
                                {selectedLocation.coverage.capabilities.includes('Ethernet') && <span className="cap-badge">🌐 Ethernet</span>}
                            </div>
                        </div>
                    ) : (
                        <div className="no-location">❌ No station selected</div>
                    )}
                </div>

                <div className="mesh-status">
                    <h3>🌐 Mesh Network Status</h3>
                    {meshStatus && (
                        <div className="mesh-info">
                            <div className="mesh-metric">
                                <span className="metric-label">Connected Nodes:</span>
                                <span className="metric-value">{meshStatus.knownNodes ?? 0}</span>
                            </div>
                            <div className="mesh-metric">
                                <span className="metric-label">Active Routes:</span>
                                <span className="metric-value">{meshStatus.activeRoutes ?? 0}</span>
                            </div>
                            <div className="mesh-metric">
                                <span className="metric-label">Queue Length:</span>
                                <span className="metric-value">{meshStatus.queueLength ?? 0}</span>
                            </div>
                        </div>
                    )}
                </div>

                <div className="stations-overview">
                    <h3>🗺️ Available Stations</h3>
                    <div className="stations-grid">
                        {availableStations.map((station) => (
                            <div
                                key={station.id}
                                className={`station-card ${selectedLocation?.id === station.id ? 'selected' : ''} ${station.status === 'active' ? 'active' : ''}`}
                                onClick={() => stationLocationManager.setStationLocation(station.id)}
                            >
                                <div className="station-header">
                                    <span className="station-name">{station.name}</span>
                                    <span
                                        className="station-type-badge"
                                        style={{ backgroundColor: getStationTypeColor(station.type) }}
                                    >
                                        {station.type}
                                    </span>
                                </div>
                                <div className="station-coords">
                                    📍 {station.coordinates.latitude.toFixed(4)}, {station.coordinates.longitude.toFixed(4)}
                                </div>
                                <div className="station-nameAl">{station.nameAl}</div>
                                <div className="station-status">
                                    {station.status === 'active' ? '🟢 Active' : station.status === 'maintenance' ? '🟡 Maintenance' : '⚪ Inactive'}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <style jsx>{`
                .location-demo {
                    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
                    color: white;
                    padding: 20px;
                    border-radius: 12px;
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                }

                .demo-header {
                    text-align: center;
                    margin-bottom: 30px;
                    padding: 20px;
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 12px;
                }

                .demo-header h1 {
                    margin: 0 0 10px 0;
                    color: #4fc3f7;
                }

                .demo-header p {
                    margin: 0 0 20px 0;
                    color: #ccc;
                    font-style: italic;
                }

                .demo-controls {
                    display: flex;
                    gap: 15px;
                    justify-content: center;
                }

                .demo-btn {
                    padding: 12px 24px;
                    border: none;
                    border-radius: 8px;
                    font-weight: bold;
                    cursor: pointer;
                    transition: all 0.3s;
                }

                .start-btn {
                    background: linear-gradient(135deg, #4caf50, #45a049);
                    color: white;
                }

                .start-btn:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(76, 175, 80, 0.4);
                }

                .reset-btn {
                    background: linear-gradient(135deg, #ff9800, #f57c00);
                    color: white;
                }

                .reset-btn:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(255, 152, 0, 0.4);
                }

                .demo-btn:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                    transform: none;
                }

                .demo-progress {
                    background: rgba(255, 255, 255, 0.05);
                    padding: 20px;
                    border-radius: 12px;
                    margin-bottom: 20px;
                    border-left: 4px solid #4fc3f7;
                }

                .current-step h3 {
                    margin: 0 0 8px 0;
                    color: #4fc3f7;
                }

                .current-step p {
                    margin: 0 0 15px 0;
                    color: #ccc;
                }

                .progress-bar {
                    width: 100%;
                    height: 8px;
                    background: rgba(255, 255, 255, 0.2);
                    border-radius: 4px;
                    overflow: hidden;
                    margin-bottom: 10px;
                }

                .progress-fill {
                    height: 100%;
                    background: linear-gradient(90deg, #4fc3f7, #29b6f6);
                    transition: width 0.5s ease;
                }

                .step-counter {
                    font-size: 0.9em;
                    color: #888;
                }

                .demo-content {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 20px;
                    margin-bottom: 30px;
                }

                .current-status, .mesh-status {
                    background: rgba(255, 255, 255, 0.05);
                    padding: 20px;
                    border-radius: 12px;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                }

                .current-status h3, .mesh-status h3 {
                    margin: 0 0 15px 0;
                    color: #4fc3f7;
                }

                .location-info {
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                }

                .location-name {
                    font-size: 1.2em;
                    font-weight: bold;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .location-coords {
                    font-family: monospace;
                    color: #ccc;
                }

                .location-details {
                    display: flex;
                    gap: 10px;
                    flex-wrap: wrap;
                }

                .location-type {
                    padding: 4px 8px;
                    border-radius: 4px;
                    font-size: 0.8em;
                    font-weight: bold;
                    text-transform: uppercase;
                    color: white;
                }

                .location-coverage {
                    color: #ccc;
                    font-size: 0.9em;
                }

                .location-capabilities {
                    display: flex;
                    gap: 8px;
                    flex-wrap: wrap;
                }

                .cap-badge {
                    background: rgba(79, 195, 247, 0.3);
                    padding: 4px 8px;
                    border-radius: 4px;
                    font-size: 0.8em;
                    border: 1px solid rgba(79, 195, 247, 0.5);
                }

                .no-location {
                    color: #f44336;
                    font-style: italic;
                }

                .mesh-info {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }

                .mesh-metric {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .metric-label {
                    color: #ccc;
                }

                .metric-value {
                    font-weight: bold;
                    color: #4fc3f7;
                }

                .stations-overview {
                    grid-column: 1 / -1;
                    background: rgba(255, 255, 255, 0.05);
                    padding: 20px;
                    border-radius: 12px;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                }

                .stations-overview h3 {
                    margin: 0 0 20px 0;
                    color: #4fc3f7;
                }

                .stations-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                    gap: 15px;
                }

                .station-card {
                    background: rgba(255, 255, 255, 0.05);
                    padding: 15px;
                    border-radius: 8px;
                    border: 2px solid transparent;
                    cursor: pointer;
                    transition: all 0.3s;
                }

                .station-card:hover {
                    background: rgba(255, 255, 255, 0.1);
                    border-color: #4fc3f7;
                    transform: translateY(-2px);
                }

                .station-card.selected {
                    border-color: #4caf50;
                    background: rgba(76, 175, 80, 0.2);
                }

                .station-card.active {
                    box-shadow: 0 0 10px rgba(76, 175, 80, 0.5);
                }

                .station-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 8px;
                }

                .station-name {
                    font-weight: bold;
                }

                .station-type-badge {
                    padding: 2px 6px;
                    border-radius: 4px;
                    font-size: 0.7em;
                    font-weight: bold;
                    text-transform: uppercase;
                    color: white;
                }

                .station-coords, .station-nameAl {
                    font-size: 0.9em;
                    color: #ccc;
                    margin-bottom: 4px;
                }

                .station-coords {
                    font-family: monospace;
                }

                .station-status {
                    font-size: 0.8em;
                    font-weight: bold;
                }

                @media (max-width: 768px) {
                    .demo-content {
                        grid-template-columns: 1fr;
                    }
                    
                    .demo-controls {
                        flex-direction: column;
                        align-items: center;
                    }
                    
                    .stations-grid {
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>
        </div>
    )
}

export default LocationConfigDemo

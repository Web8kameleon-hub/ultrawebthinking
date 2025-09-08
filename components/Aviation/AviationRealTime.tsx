'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import styles from './AviationRealTime.module.css'

interface FlightData {
  callsign: string
  altitude: number
  speed: number
  heading: number
  latitude: number
  longitude: number
  status: 'active' | 'landed' | 'emergency'
  aircraft_type: string
  registration: string
  timestamp: string
}

interface SatelliteData {
  name: string
  norad_id: number
  latitude: number
  longitude: number
  altitude: number
  velocity: number
  visibility: 'visible' | 'eclipsed' | 'daylight'
  timestamp: string
}

interface WeatherData {
  location: string
  temperature: number
  humidity: number
  pressure: number
  wind_speed: number
  wind_direction: number
  visibility: number
  cloud_coverage: number
  weather_condition: string
  timestamp: string
}

export default function AviationRealTime() {
  const [flights, setFlights] = useState<FlightData[]>([])
  const [satellites, setSatellites] = useState<SatelliteData[]>([])
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<string>('')
  const [activeTab, setActiveTab] = useState('flights')

  const fetchFlightData = async () => {
    try {
      const response = await fetch('/api/aviation/flights')
      const data = await response.json()
      if (data.success) {
        setFlights(data.data || [])
      }
    } catch (error) {
      console.error('Failed to fetch flights:', error)
      setFlights([])
    }
  }

  const fetchSatelliteData = async () => {
    try {
      const response = await fetch('/api/aviation/satellites')
      const data = await response.json()
      if (data.success) {
        setSatellites(data.data || [])
      }
    } catch (error) {
      console.error('Failed to fetch satellites:', error)
      setSatellites([])
    }
  }

  const fetchWeatherData = async () => {
    try {
      const response = await fetch('/api/aviation/weather?lat=41.3275&lon=19.8187')
      const data = await response.json()
      if (data.success && data.data) {
        setWeather(data.data)
      }
    } catch (error) {
      console.error('Failed to fetch weather:', error)
      setWeather(null)
    }
  }

  const fetchAllData = async () => {
    setLoading(true)
    await Promise.all([
      fetchFlightData(),
      fetchSatelliteData(), 
      fetchWeatherData()
    ])
    setLastUpdate(new Date().toLocaleTimeString('sq-AL'))
    setLoading(false)
  }

  useEffect(() => {
    fetchAllData()
    
    // Refresh every 30 seconds for real-time updates
    const interval = setInterval(fetchAllData, 30000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className={styles.container}>
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={styles.header}
      >
        <h1 className={styles.title}>✈️ Aviation Real-Time Platform</h1>
        <div className={styles.status}>
          <div className={styles.indicator}>
            <div className={loading ? styles.updating : styles.live}></div>
            <span>{loading ? 'Updating...' : 'Live Data'}</span>
          </div>
          {lastUpdate && (
            <span className={styles.lastUpdate}>
              Last Update: {lastUpdate}
            </span>
          )}
        </div>
      </motion.header>

      <div className={styles.tabs}>
        {['flights', 'satellites', 'weather'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`${styles.tab} ${activeTab === tab ? styles.active : ''}`}
          >
            {tab === 'flights' && '✈️ Live Flights'}
            {tab === 'satellites' && '🛰️ Satellites'} 
            {tab === 'weather' && '🌤️ Weather'}
          </button>
        ))}
      </div>

      <motion.div
        key={activeTab}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className={styles.content}
      >
        {activeTab === 'flights' && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Live Flight Tracking</h2>
            {flights.length === 0 ? (
              <div className={styles.noData}>
                <p>No real flight data available</p>
                <p className={styles.note}>
                  Live flight tracking shows aircraft over Albania/Kosovo region
                </p>
              </div>
            ) : (
              <div className={styles.table}>
                <div className={styles.tableHeader}>
                  <div>Callsign</div>
                  <div>Altitude</div>
                  <div>Speed</div>
                  <div>Heading</div>
                  <div>Position</div>
                  <div>Status</div>
                </div>
                {flights.map((flight, index) => (
                  <motion.div
                    key={`${flight.callsign}-${index}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={styles.tableRow}
                  >
                    <div className={styles.callsign}>{flight.callsign}</div>
                    <div>{flight.altitude.toLocaleString()} ft</div>
                    <div>{flight.speed} kt</div>
                    <div>{flight.heading}°</div>
                    <div>
                      {flight.latitude.toFixed(4)}°N, {flight.longitude.toFixed(4)}°E
                    </div>
                    <div className={`${styles.status} ${styles[flight.status]}`}>
                      {flight.status}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'satellites' && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Live Satellite Tracking</h2>
            {satellites.length === 0 ? (
              <div className={styles.noData}>
                <p>No real satellite data available</p>
                <p className={styles.note}>
                  Configure N2YO_API_KEY for live satellite tracking
                </p>
              </div>
            ) : (
              <div className={styles.satelliteGrid}>
                {satellites.map((satellite, index) => (
                  <motion.div
                    key={satellite.norad_id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className={styles.satelliteCard}
                  >
                    <h3>{satellite.name}</h3>
                    <div className={styles.satelliteInfo}>
                      <div>ID: {satellite.norad_id}</div>
                      <div>Alt: {satellite.altitude.toLocaleString()} km</div>
                      <div>Speed: {satellite.velocity} km/h</div>
                      <div>Pos: {satellite.latitude.toFixed(2)}°N, {satellite.longitude.toFixed(2)}°E</div>
                      <div className={`${styles.visibility} ${styles[satellite.visibility]}`}>
                        {satellite.visibility}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'weather' && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Live Weather Data</h2>
            {!weather ? (
              <div className={styles.noData}>
                <p>No real weather data available</p>
                <p className={styles.note}>
                  Configure OPENWEATHER_API_KEY for live weather data
                </p>
              </div>
            ) : (
              <div className={styles.weatherGrid}>
                <div className={styles.weatherCard}>
                  <h3>🌡️ Temperature</h3>
                  <div className={styles.weatherValue}>{weather.temperature}°C</div>
                </div>
                <div className={styles.weatherCard}>
                  <h3>💨 Wind</h3>
                  <div className={styles.weatherValue}>
                    {weather.wind_speed} km/h at {weather.wind_direction}°
                  </div>
                </div>
                <div className={styles.weatherCard}>
                  <h3>🌫️ Visibility</h3>
                  <div className={styles.weatherValue}>{weather.visibility} km</div>
                </div>
                <div className={styles.weatherCard}>
                  <h3>☁️ Clouds</h3>
                  <div className={styles.weatherValue}>{weather.cloud_coverage}%</div>
                </div>
                <div className={styles.weatherCard}>
                  <h3>🏷️ Condition</h3>
                  <div className={styles.weatherValue}>{weather.weather_condition}</div>
                </div>
                <div className={styles.weatherCard}>
                  <h3>📍 Location</h3>
                  <div className={styles.weatherValue}>{weather.location}</div>
                </div>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  )
}

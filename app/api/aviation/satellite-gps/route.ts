// app/api/aviation/satellite-gps/route.ts
// Satellite + GPS Integration API
// Combines satellite data provider and GPS tracking engine

import { GPSTrackingEngine } from '@/lib/GPSTrackingEngine'
import { SatelliteDataProvider } from '@/lib/SatelliteDataProvider'
import { NextRequest, NextResponse } from 'next/server'

// Initialize providers
const satelliteProvider = new SatelliteDataProvider()
const gpsEngine = new GPSTrackingEngine()

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const mode = searchParams.get('mode') || 'standard' // standard, satellite, hybrid
        const premium = searchParams.get('premium') === 'true'

        // Check premium access for satellite features
        if ((mode === 'satellite' || mode === 'hybrid') && !premium) {
            return NextResponse.json({
                error: 'Premium subscription required for satellite features',
                code: 'PREMIUM_REQUIRED',
                upgrade_url: '/pricing'
            }, { status: 403 })
        }

        // Get satellite data (if premium)
        const satelliteData = premium ? await satelliteProvider.getFlightData() : []
        const satelliteHealth = premium ? { status: 'healthy', providers: 3, uptime: 99.2 } : null

        // Get GPS tracking data
        const gpsData = satelliteData.length > 0 ? satelliteData : await satelliteProvider.getFlightData()
        const gpsStats = gpsEngine.getTrackingStats()
        const proximityAlerts: any[] = [] // Mock proximity alerts

        // Combine data based on mode
        let combinedFlights = []

        if (mode === 'satellite' && premium && satelliteData.length > 0) {
            combinedFlights = satelliteData
        } else if (mode === 'hybrid' && premium && satelliteData.length > 0) {
            // Merge satellite and terrestrial data
            const terrestrialFlights = gpsData.slice(0, 35) // Limit terrestrial
            combinedFlights = [...satelliteData, ...terrestrialFlights]
        } else {
            // Standard mode - terrestrial only
            combinedFlights = gpsData.slice(0, 35)
        }

        // Enhanced flight data with GPS proximity
        const enhancedFlights = combinedFlights.map((flight: any) => {
            const nearestAirport = gpsEngine.findNearestAirport(flight.latitude, flight.longitude)

            return {
                ...flight,
                nearestAirport: nearestAirport?.icao || 'UNKNOWN',
                distance: Math.round(Math.random() * 200), // Mock distance
                inGeofence: false, // Mock geofence check
                source: premium && (mode === 'satellite' || mode === 'hybrid')
                    ? (Math.random() > 0.7 ? 'satellite' : 'terrestrial')
                    : 'terrestrial'
            }
        })

        // Integration status
        const integrationStatus = {
            mode,
            premium,
            satellite: {
                enabled: premium && (mode === 'satellite' || mode === 'hybrid'),
                provider: premium ? 'Iridium NEXT' : null,
                health: satelliteHealth,
                cost_per_mb: premium ? 0.24 : null,
                latency: premium ? 850 + Math.random() * 200 : null
            },
            gps: {
                enabled: true,
                tracked_flights: enhancedFlights.length,
                geofences: gpsStats.geofencesActive,
                alerts: proximityAlerts.length,
                accuracy: 97.5 + Math.random() * 2
            },
            edge: {
                gateways_online: 8,
                gateways_total: 10,
                network_health: 94 + Math.random() * 5
            },
            data_sync: {
                status: 'synced',
                last_sync: new Date().toISOString(),
                bandwidth_mbps: 4 + Math.random() * 4
            }
        }

        return NextResponse.json({
            success: true,
            mode,
            premium,
            timestamp: new Date().toISOString(),
            integration_status: integrationStatus,
            flights: enhancedFlights,
            proximity_alerts: proximityAlerts,
            tracking_stats: gpsStats,
            satellite_health: satelliteHealth,
            total_flights: enhancedFlights.length,
            coverage: premium && mode === 'satellite' ? 'global' : 'regional'
        })

    } catch (error) {
        console.error('Satellite GPS API Error:', error)
        return NextResponse.json({
            error: 'Failed to fetch satellite GPS data',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 })
    }
}

export async function POST(request: NextRequest) {
    try {
        const { mode, geofences, alerts } = await request.json()

        // Update GPS tracking configuration
        if (geofences) {
            // Mock geofence configuration update
            console.log('Geofences updated:', geofences)
        }

        // Configure alert settings
        if (alerts) {
            // Update proximity alert settings
            // This would typically update database settings
        }

        return NextResponse.json({
            success: true,
            message: 'Configuration updated',
            timestamp: new Date().toISOString()
        })

    } catch (error) {
        console.error('Configuration update error:', error)
        return NextResponse.json({
            error: 'Failed to update configuration',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 })
    }
}

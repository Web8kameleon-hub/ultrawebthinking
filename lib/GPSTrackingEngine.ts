// GPS Tracking Engine - Real-time positioning and nearest airport mapping
// Handles edge GPS processing, geofencing, and flight path analysis

export interface GPSPosition {
    latitude: number
    longitude: number
    altitude?: number
    heading?: number
    speed?: number
    accuracy: number
    timestamp: string
    source: 'gps' | 'adsb' | 'satellite' | 'estimated'
}

export interface Airport {
    icao: string
    iata: string
    name: string
    latitude: number
    longitude: number
    elevation: number
    country: string
    timezone: string
    runways: Runway[]
}

export interface Runway {
    designation: string
    length: number
    width: number
    surface: string
    heading: number
}

export interface ProximityAlert {
    type: 'approaching' | 'overflying' | 'departing' | 'emergency'
    airport: Airport
    distance: number
    estimatedArrival: string
    confidence: number
}

export class GPSTrackingEngine {
    private airports: Airport[] = []
    private trackingActive: boolean = false
    private geofences: Map<string, GeofenceRule> = new Map()

    constructor() {
        this.initializeAirports()
        console.log('📍 GPS Tracking Engine initialized')
    }

    // Initialize European airports database
    private initializeAirports(): void {
        this.airports = [
            {
                icao: 'EDDF',
                iata: 'FRA',
                name: 'Frankfurt Airport',
                latitude: 50.0379,
                longitude: 8.5622,
                elevation: 364,
                country: 'Germany',
                timezone: 'CET',
                runways: [
                    { designation: '07C-25C', length: 4000, width: 60, surface: 'Concrete', heading: 70 },
                    { designation: '07L-25R', length: 4000, width: 45, surface: 'Asphalt', heading: 70 },
                    { designation: '07R-25L', length: 4000, width: 45, surface: 'Asphalt', heading: 70 },
                    { designation: '18-36', length: 4000, width: 45, surface: 'Concrete', heading: 180 }
                ]
            },
            {
                icao: 'EDDM',
                iata: 'MUC',
                name: 'Munich Airport',
                latitude: 48.3537,
                longitude: 11.7751,
                elevation: 448,
                country: 'Germany',
                timezone: 'CET',
                runways: [
                    { designation: '08L-26R', length: 4000, width: 60, surface: 'Concrete', heading: 80 },
                    { designation: '08R-26L', length: 4000, width: 60, surface: 'Concrete', heading: 80 }
                ]
            },
            {
                icao: 'LOWW',
                iata: 'VIE',
                name: 'Vienna International Airport',
                latitude: 48.1103,
                longitude: 16.5697,
                elevation: 183,
                country: 'Austria',
                timezone: 'CET',
                runways: [
                    { designation: '11-29', length: 3500, width: 45, surface: 'Asphalt', heading: 110 },
                    { designation: '16-34', length: 3600, width: 45, surface: 'Concrete', heading: 160 }
                ]
            },
            {
                icao: 'LSZH',
                iata: 'ZUR',
                name: 'Zurich Airport',
                latitude: 47.4647,
                longitude: 8.5492,
                elevation: 432,
                country: 'Switzerland',
                timezone: 'CET',
                runways: [
                    { designation: '10-28', length: 3700, width: 60, surface: 'Asphalt', heading: 100 },
                    { designation: '14-32', length: 3300, width: 60, surface: 'Asphalt', heading: 140 },
                    { designation: '16-34', length: 2500, width: 60, surface: 'Asphalt', heading: 160 }
                ]
            },
            {
                icao: 'LFPG',
                iata: 'CDG',
                name: 'Charles de Gaulle Airport',
                latitude: 49.0097,
                longitude: 2.5479,
                elevation: 119,
                country: 'France',
                timezone: 'CET',
                runways: [
                    { designation: '08L-26R', length: 4215, width: 45, surface: 'Concrete', heading: 80 },
                    { designation: '08R-26L', length: 4200, width: 45, surface: 'Concrete', heading: 80 },
                    { designation: '09L-27R', length: 2700, width: 45, surface: 'Asphalt', heading: 90 },
                    { designation: '09R-27L', length: 4200, width: 45, surface: 'Concrete', heading: 90 }
                ]
            }
        ]
    }

    // Calculate distance between two GPS coordinates (Haversine formula)
    private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
        const R = 6371 // Earth's radius in kilometers
        const dLat = (lat2 - lat1) * Math.PI / 180
        const dLon = (lon2 - lon1) * Math.PI / 180
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2)
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
        return R * c
    }

    // Find nearest airport to GPS position
    findNearestAirport(position: GPSPosition, maxDistance: number = 200): Airport | null {
        let nearestAirport: Airport | null = null
        let minDistance = maxDistance

        for (const airport of this.airports) {
            const distance = this.calculateDistance(
                position.latitude, position.longitude,
                airport.latitude, airport.longitude
            )

            if (distance < minDistance) {
                minDistance = distance
                nearestAirport = airport
            }
        }

        return nearestAirport
    }

    // Get all airports within radius
    getAirportsInRadius(position: GPSPosition, radius: number): Airport[] {
        return this.airports.filter(airport => {
            const distance = this.calculateDistance(
                position.latitude, position.longitude,
                airport.latitude, airport.longitude
            )
            return distance <= radius
        })
    }

    // Process GPS data and generate alerts
    processGPSData(position: GPSPosition, callsign?: string): ProximityAlert[] {
        const alerts: ProximityAlert[] = []
        const nearbyAirports = this.getAirportsInRadius(position, 50)

        for (const airport of nearbyAirports) {
            const distance = this.calculateDistance(
                position.latitude, position.longitude,
                airport.latitude, airport.longitude
            )

            let alertType: 'approaching' | 'overflying' | 'departing' | 'emergency' = 'overflying'

            if (distance < 5) {
                alertType = position.altitude && position.altitude < 1000 ? 'departing' : 'overflying'
            } else if (distance < 25) {
                alertType = 'approaching'
            }

            // Estimate arrival time based on speed and distance
            const estimatedMinutes = position.speed ? (distance / position.speed) * 60 : 30
            const estimatedArrival = new Date(Date.now() + estimatedMinutes * 60000).toISOString()

            alerts.push({
                type: alertType,
                airport,
                distance,
                estimatedArrival,
                confidence: position.accuracy > 10 ? 0.7 : 0.95
            })
        }

        return alerts.sort((a, b) => a.distance - b.distance)
    }

    // Create geofence around airport
    createGeofence(airportIcao: string, radius: number, alertTypes: string[]): boolean {
        const airport = this.airports.find(a => a.icao === airportIcao)
        if (!airport) return false

        const geofence: GeofenceRule = {
            id: `${airportIcao}_${radius}`,
            airport,
            radius,
            alertTypes,
            active: true,
            created: new Date().toISOString()
        }

        this.geofences.set(geofence.id, geofence)
        return true
    }

    // Check geofence violations
    checkGeofences(position: GPSPosition): GeofenceViolation[] {
        const violations: GeofenceViolation[] = []

        for (const [id, geofence] of this.geofences) {
            if (!geofence.active) continue

            const distance = this.calculateDistance(
                position.latitude, position.longitude,
                geofence.airport.latitude, geofence.airport.longitude
            )

            if (distance <= geofence.radius) {
                violations.push({
                    geofenceId: id,
                    airport: geofence.airport,
                    position,
                    distance,
                    timestamp: new Date().toISOString(),
                    severity: distance < geofence.radius * 0.5 ? 'high' : 'medium'
                })
            }
        }

        return violations
    }

    // Get GPS tracking statistics
    getTrackingStats(): {
        airportsCount: number
        geofencesActive: number
        trackingStatus: string
        lastUpdate: string
    } {
        return {
            airportsCount: this.airports.length,
            geofencesActive: Array.from(this.geofences.values()).filter(g => g.active).length,
            trackingStatus: this.trackingActive ? 'active' : 'standby',
            lastUpdate: new Date().toISOString()
        }
    }

    // Enable/disable tracking
    setTrackingStatus(active: boolean): void {
        this.trackingActive = active
        console.log(`📍 GPS tracking ${active ? 'enabled' : 'disabled'}`)
    }

    // Get all airports
    getAllAirports(): Airport[] {
        return [...this.airports]
    }

    // Add custom airport
    addAirport(airport: Airport): boolean {
        if (this.airports.find(a => a.icao === airport.icao)) {
            return false // Airport already exists
        }
        this.airports.push(airport)
        return true
    }
}

interface GeofenceRule {
    id: string
    airport: Airport
    radius: number
    alertTypes: string[]
    active: boolean
    created: string
}

interface GeofenceViolation {
    geofenceId: string
    airport: Airport
    position: GPSPosition
    distance: number
    timestamp: string
    severity: 'low' | 'medium' | 'high'
}

// Singleton instance
export const gpsTrackingEngine = new GPSTrackingEngine()

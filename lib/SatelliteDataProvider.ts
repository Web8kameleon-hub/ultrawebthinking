// Satellite Data Provider - Handles multiple satellite networks
// Supports Iridium, Starlink, ADS-B satellite feeds

export interface SatelliteProvider {
    name: string
    type: 'adsb' | 'weather' | 'communication'
    coverage: 'global' | 'regional' | 'polar'
    latency: number // milliseconds
    cost: number // per MB
    reliability: number // 0-1
}

export interface FlightData {
    callsign: string
    icao24: string // aircraft identifier
    latitude: number
    longitude: number
    altitude: number // feet
    heading: number // degrees
    speed: number // knots
    verticalRate: number // feet/min
    timestamp: string
    source: 'satellite' | 'terrestrial' | 'hybrid'
    confidence: number
}

export interface SatelliteWeatherData {
    latitude: number
    longitude: number
    temperature: number
    pressure: number
    humidity: number
    windSpeed: number
    windDirection: number
    visibility: number
    cloudCover: number
    precipitation: number
    timestamp: string
    satelliteId: string
}

export class SatelliteDataProvider {
    private providers: SatelliteProvider[] = [
        {
            name: 'Iridium NEXT',
            type: 'communication',
            coverage: 'global',
            latency: 1500,
            cost: 0.08,
            reliability: 0.99
        },
        {
            name: 'Starlink Aviation',
            type: 'communication',
            coverage: 'global',
            latency: 25,
            cost: 0.12,
            reliability: 0.96
        },
        {
            name: 'ADS-B Satellite',
            type: 'adsb',
            coverage: 'global',
            latency: 800,
            cost: 0.05,
            reliability: 0.94
        },
        {
            name: 'GOES Weather Sat',
            type: 'weather',
            coverage: 'regional',
            latency: 300,
            cost: 0.02,
            reliability: 0.98
        }
    ]

    private isEnabled: boolean = false
    private fallbackMode: boolean = false

    constructor() {
        console.log('🛰️ Satellite Data Provider initialized')
    }

    // Enable satellite mode (Enterprise+ only)
    enableSatelliteMode(tier: string): boolean {
        if (!['enterprise', 'premium'].includes(tier.toLowerCase())) {
            throw new Error('Satellite mode requires Enterprise or Premium tier')
        }

        this.isEnabled = true
        console.log('🛰️ Satellite mode enabled for tier:', tier)
        return true
    }

    // Get optimal satellite provider based on requirements
    getOptimalProvider(requirements: {
        coverage: string
        maxLatency: number
        maxCost: number
        minReliability: number
    }): SatelliteProvider | null {
        return this.providers
            .filter(p =>
                p.coverage === requirements.coverage &&
                p.latency <= requirements.maxLatency &&
                p.cost <= requirements.maxCost &&
                p.reliability >= requirements.minReliability
            )
            .sort((a, b) => b.reliability - a.reliability)[0] || null
    }

    // Simulate satellite flight data fetch
    async getFlightData(bounds?: {
        north: number
        south: number
        east: number
        west: number
    }): Promise<FlightData[]> {
        if (!this.isEnabled) {
            throw new Error('Satellite mode not enabled')
        }

        // Simulate satellite delay
        await new Promise(resolve => setTimeout(resolve, 800))

        // Generate mock satellite flight data
        const flights: FlightData[] = []
        const flightCount = 15 + Math.floor(Math.random() * 25)

        for (let i = 0; i < flightCount; i++) {
            const lat = bounds ?
                bounds.south + Math.random() * (bounds.north - bounds.south) :
                45 + Math.random() * 20 // Europe area

            const lon = bounds ?
                bounds.west + Math.random() * (bounds.east - bounds.west) :
                -5 + Math.random() * 30 // Europe area

            flights.push({
                callsign: `SAT${(1000 + i).toString()}`,
                icao24: `${Math.random().toString(16).substr(2, 6).toUpperCase()}`,
                latitude: lat,
                longitude: lon,
                altitude: 25000 + Math.random() * 15000,
                heading: Math.random() * 360,
                speed: 400 + Math.random() * 200,
                verticalRate: -500 + Math.random() * 1000,
                timestamp: new Date().toISOString(),
                source: 'satellite',
                confidence: 0.85 + Math.random() * 0.14
            })
        }

        return flights
    }

    // Get satellite weather data for specific location
    async getSatelliteWeather(lat: number, lon: number, radius: number = 50): Promise<SatelliteWeatherData[]> {
        if (!this.isEnabled) {
            throw new Error('Satellite mode not enabled')
        }

        await new Promise(resolve => setTimeout(resolve, 400))

        const weatherPoints: SatelliteWeatherData[] = []
        const pointCount = 8 + Math.floor(Math.random() * 12)

        for (let i = 0; i < pointCount; i++) {
            const offsetLat = (Math.random() - 0.5) * (radius / 111) // ~111km per degree
            const offsetLon = (Math.random() - 0.5) * (radius / (111 * Math.cos(lat * Math.PI / 180)))

            weatherPoints.push({
                latitude: lat + offsetLat,
                longitude: lon + offsetLon,
                temperature: 15 + Math.random() * 20,
                pressure: 1000 + Math.random() * 30,
                humidity: 40 + Math.random() * 50,
                windSpeed: Math.random() * 25,
                windDirection: Math.random() * 360,
                visibility: 5000 + Math.random() * 15000,
                cloudCover: Math.random() * 100,
                precipitation: Math.random() * 10,
                timestamp: new Date().toISOString(),
                satelliteId: `GOES-${16 + Math.floor(Math.random() * 3)}`
            })
        }

        return weatherPoints
    }

    // Check if satellite connection is available
    async checkSatelliteHealth(): Promise<{
        available: boolean
        activeProviders: number
        averageLatency: number
        totalCost: number
    }> {
        // Simulate health check
        await new Promise(resolve => setTimeout(resolve, 200))

        const activeProviders = this.providers.filter(p => Math.random() > 0.1).length
        const avgLatency = this.providers.reduce((sum, p) => sum + p.latency, 0) / this.providers.length
        const totalCost = this.providers.reduce((sum, p) => sum + p.cost, 0)

        return {
            available: this.isEnabled && activeProviders > 0,
            activeProviders,
            averageLatency: avgLatency,
            totalCost
        }
    }

    // Enable failover mode when terrestrial APIs fail
    enableFailoverMode(): void {
        this.fallbackMode = true
        console.log('🛰️ Satellite failover mode activated')
    }

    // Disable failover mode when terrestrial APIs recover
    disableFailoverMode(): void {
        this.fallbackMode = false
        console.log('🛰️ Satellite failover mode deactivated')
    }

    getStatus(): {
        enabled: boolean
        fallbackMode: boolean
        providers: SatelliteProvider[]
        health: string
    } {
        return {
            enabled: this.isEnabled,
            fallbackMode: this.fallbackMode,
            providers: this.providers,
            health: this.isEnabled ? 'operational' : 'disabled'
        }
    }
}

// Singleton instance
export const satelliteProvider = new SatelliteDataProvider()

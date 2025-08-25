/**
 * Aviation Weather Intelligence Types
 * EuroWeb Platform - Aviation Module
 * 
 * @author Ledjan Ahmati (100% Owner)
 * @contact dealsjona@gmail.com
 * @version 8.3.0 Ultra
 * @license MIT
 */

export interface AirportForecastObject {
    icao: string
    issued_at: string
    nowcast_0_2h: {
        precip_prob: number
        cb_cloud: boolean
        vis_km: number
    }
    nwp_1_48h: {
        wind_kt: number[]
        ceiling_ft: number[]
    }
    taf_consistency: number
    runway: Record<string, {
        headwind: number
        crosswind: number
    }>
    risk_flags: string[]
    summary: string
}

export interface WeatherIssue {
    key: string
    title: string
    description: string
    priority: 'High' | 'Medium' | 'Low'
    owner: string
    labels: string
    status: 'backlog' | 'in-progress' | 'testing' | 'completed'
}

export interface SatelliteLayer {
    id: string
    name: string
    type: 'IR' | 'VIS' | 'cloud-top'
    refreshInterval: number
    tileUrl: string
}

export interface MetarData {
    icao: string
    timestamp: string
    wind: {
        direction: number
        speed: number
        gust?: number
    }
    visibility: number
    ceiling?: number
    weather: string[]
    raw: string
}

export interface TafData {
    icao: string
    issued: string
    valid_from: string
    valid_to: string
    forecast: Array<{
        time: string
        wind: { direction: number; speed: number }
        visibility: number
        ceiling?: number
        weather: string[]
    }>
    raw: string
}

export interface NwpData {
    provider: 'ECMWF' | 'ICON' | 'GFS'
    cycle: string
    valid_time: string
    location: { lat: number; lon: number }
    variables: {
        wind_u: number
        wind_v: number
        temperature: number
        humidity: number
        pressure: number
        precipitation: number
    }
}

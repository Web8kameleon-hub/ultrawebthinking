/**
 * Aviation Forecast API Route
 * EuroWeb Platform - Aviation Weather Intelligence
 * 
 * GET /api/aviation/v1/forecast/:icao?hours=0-48
 * 
 * @author Ledjan Ahmati (100% Owner)
 * @contact dealsjona@gmail.com
 * @version 8.3.0 Ultra
 * @license MIT
 */

import { NextRequest, NextResponse } from 'next/server'

interface AirportForecastObject {
    icao: string;
    issued_at: string;
    nowcast_0_2h: {
        precip_prob: number;
        cb_cloud: boolean;
        vis_km: number;
    };
    nwp_1_48h: {
        wind_kt: number[];
        ceiling_ft: number[];
    };
    taf_consistency: number;
    runway: Record<string, { headwind: number; crosswind: number }>;
    risk_flags: string[];
    summary: string;
}

// Mock ICAO airport data
const AIRPORTS = {
    'EDDF': { name: 'Frankfurt', lat: 50.0379, lon: 8.5622, runways: ['07L', '07R', '25L', '25R'] },
    'LFPG': { name: 'Paris CDG', lat: 49.0097, lon: 2.5479, runways: ['08L', '08R', '26L', '26R'] },
    'EGLL': { name: 'London Heathrow', lat: 51.4700, lon: -0.4543, runways: ['09L', '09R', '27L', '27R'] },
    'LEMD': { name: 'Madrid', lat: 40.4719, lon: -3.5626, runways: ['14L', '14R', '32L', '32R'] },
    'LIRF': { name: 'Rome Fiumicino', lat: 41.8003, lon: 12.2389, runways: ['07', '16L', '16R', '25', '34L', '34R'] }
}

function generateMockForecast(icao: string, hours: number): AirportForecastObject {
    const airport = AIRPORTS[icao as keyof typeof AIRPORTS]
    if (!airport) {
        throw new Error(`Airport ${icao} not found`)
    }

    // Generate realistic weather data
    const windDir = Math.floor(Math.random() * 360)
    const windSpeed = Math.floor(Math.random() * 25) + 5
    const visibility = Math.floor(Math.random() * 10) + 2
    const ceiling = Math.floor(Math.random() * 3000) + 500

    // Calculate runway winds
    const runwayWinds: Record<string, { headwind: number; crosswind: number }> = {}
    airport.runways.forEach(runway => {
        const runwayHeading = parseInt(runway.replace(/[LR]/g, '')) * 10
        const windAngle = Math.abs(windDir - runwayHeading)
        const headwind = Math.round(windSpeed * Math.cos(windAngle * Math.PI / 180))
        const crosswind = Math.round(windSpeed * Math.sin(windAngle * Math.PI / 180))
        runwayWinds[runway] = { headwind, crosswind }
    })

    // Risk assessment
    const riskFlags: string[] = []
    if (ceiling < 1000) {riskFlags.push('LOW_CEILING')}
    if (visibility < 5) {riskFlags.push('LOW_VIS')}
    if (windSpeed > 20) {riskFlags.push('STRONG_WIND')}
    if (Math.random() > 0.7) {riskFlags.push('CB')}
    if (Math.random() > 0.8) {riskFlags.push('TURB')}

    return {
        icao,
        issued_at: new Date().toISOString(),
        nowcast_0_2h: {
            precip_prob: Math.round(Math.random() * 100) / 100,
            cb_cloud: riskFlags.includes('CB'),
            vis_km: visibility
        },
        nwp_1_48h: {
            wind_kt: Array.from({ length: Math.min(hours, 48) }, (_, i) =>
                windSpeed + Math.floor(Math.random() * 10) - 5
            ),
            ceiling_ft: Array.from({ length: Math.min(hours, 48) }, (_, i) =>
                ceiling + Math.floor(Math.random() * 1000) - 500
            )
        },
        taf_consistency: Math.round((Math.random() * 0.3 + 0.7) * 100) / 100,
        runway: runwayWinds,
        risk_flags: riskFlags,
        summary: `${ceiling < 1000 ? 'Broken' : 'Scattered'} ${ceiling} ft, ` +
            `${riskFlags.includes('CB') ? 'thunderstorms possible, ' : ''}` +
            `winds ${String(windDir).padStart(3, '0')}/${windSpeed}kt`
    }
}

export async function GET(
    request: NextRequest,
    { params }: { params: { icao: string } }
) {
    try {
        const { icao } = params
        const { searchParams } = new URL(request.url)
        const hours = parseInt(searchParams.get('hours') || '24')

        console.log(`🛩️ Aviation forecast request for ${icao.toUpperCase()}, ${hours}h`)

        if (!icao || icao.length !== 4) {
            return NextResponse.json(
                { error: 'Invalid ICAO code. Must be 4 characters.' },
                { status: 400 }
            )
        }

        if (hours < 0 || hours > 48) {
            return NextResponse.json(
                { error: 'Hours parameter must be between 0 and 48.' },
                { status: 400 }
            )
        }

        const forecast = generateMockForecast(icao.toUpperCase(), hours)

        return NextResponse.json({
            success: true,
            data: forecast,
            meta: {
                provider: 'EuroWeb Aviation Weather Intelligence',
                model_version: '8.3.0',
                generated_at: new Date().toISOString(),
                cache_ttl: 300
            }
        })

    } catch (error: any) {
        console.error('❌ Aviation forecast error:', error)

        if (error.message.includes('not found')) {
            return NextResponse.json(
                { error: error.message },
                { status: 404 }
            )
        }

        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

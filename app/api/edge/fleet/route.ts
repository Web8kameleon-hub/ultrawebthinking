import { NextRequest, NextResponse } from 'next/server'

// Edge Gateway Management API
// Handles LoRa gateway fleet management, telemetry, and commands

interface Gateway {
    id: string
    name: string
    status: 'online' | 'offline' | 'warning'
    location: { lat: number; lon: number; address: string }
    firmware: string
    lastSeen: string
    battery: number
    rssi: number
    snr: number
    packetLoss: number
    dataRate: number
    geofence: { radius: number; active: boolean }
}

export async function GET(request: NextRequest) {
    try {
        // Simulate gateway data - in production this would come from LoRa network server
        const mockGateways: Gateway[] = [
            {
                id: 'GW001',
                name: 'Frankfurt Airport Edge',
                status: 'online',
                location: { lat: 50.0379, lon: 8.5622, address: 'Frankfurt am Main, Germany' },
                firmware: 'v2.1.3',
                lastSeen: new Date(Date.now() - 2000).toISOString(),
                battery: 87,
                rssi: -72,
                snr: 8.5,
                packetLoss: 0.2,
                dataRate: 125.4,
                geofence: { radius: 5000, active: true }
            },
            {
                id: 'GW002',
                name: 'Munich Airport Edge',
                status: 'online',
                location: { lat: 48.3537, lon: 11.7751, address: 'München, Germany' },
                firmware: 'v2.1.3',
                lastSeen: new Date(Date.now() - 60000).toISOString(),
                battery: 92,
                rssi: -68,
                snr: 9.2,
                packetLoss: 0.1,
                dataRate: 98.7,
                geofence: { radius: 3000, active: true }
            },
            {
                id: 'GW003',
                name: 'Berlin Airport Edge',
                status: 'warning',
                location: { lat: 52.3667, lon: 13.5033, address: 'Berlin Brandenburg, Germany' },
                firmware: 'v2.1.1',
                lastSeen: new Date(Date.now() - 900000).toISOString(),
                battery: 23,
                rssi: -85,
                snr: 3.1,
                packetLoss: 2.8,
                dataRate: 45.2,
                geofence: { radius: 4000, active: false }
            },
            {
                id: 'GW004',
                name: 'Vienna Airport Edge',
                status: 'offline',
                location: { lat: 48.1103, lon: 16.5697, address: 'Schwechat, Austria' },
                firmware: 'v2.0.8',
                lastSeen: new Date(Date.now() - 7200000).toISOString(),
                battery: 0,
                rssi: 0,
                snr: 0,
                packetLoss: 100,
                dataRate: 0,
                geofence: { radius: 2500, active: false }
            }
        ]

        const metrics = {
            totalGateways: mockGateways.length,
            onlineGateways: mockGateways.filter(g => g.status === 'online').length,
            dataIngested: '2.4 TB',
            coverage: '850 km²',
            uptime: '99.2%'
        }

        return NextResponse.json({
            success: true,
            data: {
                gateways: mockGateways,
                metrics,
                lastUpdate: new Date().toISOString()
            }
        })

    } catch (error) {
        console.error('Edge fleet API error:', error)
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to fetch gateway data',
                data: { gateways: [], metrics: null }
            },
            { status: 500 }
        )
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { gatewayId, command, parameters } = body

        // Simulate command execution
        console.log(`Executing command '${command}' on gateway ${gatewayId}:`, parameters)

        // Simulate command response
        const commandResult = {
            success: true,
            gatewayId,
            command,
            executedAt: new Date().toISOString(),
            result: {
                status: 'completed',
                message: `Command '${command}' executed successfully`,
                data: parameters
            }
        }

        return NextResponse.json(commandResult)

    } catch (error) {
        console.error('Gateway command error:', error)
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to execute gateway command'
            },
            { status: 500 }
        )
    }
}

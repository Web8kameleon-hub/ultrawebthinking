/**
 * Satellite Tile Server API Route
 * EuroWeb Platform - Aviation Weather Intelligence
 * 
 * GET /api/tiles/sat/:layer/:z/:x/:y
 * 
 * @author Ledjan Ahmati (100% Owner)
 * @contact dealsjona@gmail.com
 * @version 8.3.0 Ultra
 * @license MIT
 */

import { NextRequest, NextResponse } from 'next/server'

// Satellite layer configurations
const SATELLITE_LAYERS = {
    'IR': {
        name: 'Infrared',
        description: 'Infrared satellite imagery showing cloud top temperatures',
        refresh_minutes: 10,
        attribution: 'EUMETSAT'
    },
    'VIS': {
        name: 'Visible',
        description: 'Visible light satellite imagery',
        refresh_minutes: 15,
        attribution: 'EUMETSAT'
    },
    'cloud-top': {
        name: 'Cloud Top Height',
        description: 'Cloud top height analysis',
        refresh_minutes: 15,
        attribution: 'EUMETSAT'
    }
}

// Generate a simple colored tile based on coordinates (mock implementation)
function generateMockTile(layer: string, z: number, x: number, y: number): Buffer {
    // Create a simple 256x256 PNG tile with colors based on layer and coordinates
    const size = 256
    const canvas = Buffer.alloc(size * size * 4) // RGBA

    let baseColor: [number, number, number] = [100, 100, 100]

    switch (layer.toUpperCase()) {
        case 'IR':
            baseColor = [120, 80, 200] // Purple-ish for IR
            break
        case 'VIS':
            baseColor = [200, 200, 255] // Light blue for visible
            break
        case 'CLOUD-TOP':
            baseColor = [255, 255, 255] // White for cloud tops
            break
    }

    // Create gradient based on tile coordinates
    for (let py = 0; py < size; py++) {
        for (let px = 0; px < size; px++) {
            const offset = (py * size + px) * 4
            const variation = Math.sin((px + x * size) * 0.01) * Math.cos((py + y * size) * 0.01) * 50

            canvas[offset] = Math.max(0, Math.min(255, baseColor[0] + variation)) // R
            canvas[offset + 1] = Math.max(0, Math.min(255, baseColor[1] + variation)) // G
            canvas[offset + 2] = Math.max(0, Math.min(255, baseColor[2] + variation)) // B
            canvas[offset + 3] = 180 // Alpha (semi-transparent)
        }
    }

    return canvas
}

export async function GET(
    request: NextRequest,
    { params }: { params: { layer: string; z: string; x: string; y: string } }
) {
    try {
        const { layer, z, x, y } = params

        console.log(`🛰️ Satellite tile request: ${layer}/${z}/${x}/${y}`)

        // Validate layer
        if (!SATELLITE_LAYERS[layer.toUpperCase() as keyof typeof SATELLITE_LAYERS]) {
            return NextResponse.json(
                { error: `Invalid layer: ${layer}. Available: ${Object.keys(SATELLITE_LAYERS).join(', ')}` },
                { status: 400 }
            )
        }

        // Validate coordinates
        const zoomLevel = parseInt(z)
        const tileX = parseInt(x)
        const tileY = parseInt(y)

        if (isNaN(zoomLevel) || isNaN(tileX) || isNaN(tileY)) {
            return NextResponse.json(
                { error: 'Invalid tile coordinates' },
                { status: 400 }
            )
        }

        if (zoomLevel < 0 || zoomLevel > 18) {
            return NextResponse.json(
                { error: 'Zoom level must be between 0 and 18' },
                { status: 400 }
            )
        }

        // Generate mock tile (in production, this would fetch from satellite data)
        const tileData = generateMockTile(layer, zoomLevel, tileX, tileY)

        // Set appropriate headers for tile caching
        const response = new NextResponse(new Uint8Array(tileData), {
            status: 200,
            headers: {
                'Content-Type': 'image/png',
                'Cache-Control': 'public, max-age=900', // 15 minutes cache
                'ETag': `"${layer}-${z}-${x}-${y}-${Date.now()}"`,
                'X-Tile-Layer': layer,
                'X-Tile-Coordinates': `${z}/${x}/${y}`,
                'X-Data-Attribution': SATELLITE_LAYERS[layer.toUpperCase() as keyof typeof SATELLITE_LAYERS].attribution
            }
        })

        return response

    } catch (error: any) {
        console.error('❌ Satellite tile error:', error)

        return NextResponse.json(
            { error: 'Failed to generate satellite tile' },
            { status: 500 }
        )
    }
}

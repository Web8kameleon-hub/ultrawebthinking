import { NextResponse } from 'next/server'
import { getCurrentCity, calculateDistance, GLOBAL_CITIES } from '@/lib/web8-global-config'

export async function GET() {
  try {
    const currentCity = getCurrentCity()
    
    const distances = Object.keys(GLOBAL_CITIES).reduce((acc, cityKey) => {
      if (cityKey !== 'london') { // Current default city
        acc[cityKey] = calculateDistance(cityKey as keyof typeof GLOBAL_CITIES)
      }
      return acc
    }, {} as Record<string, number>)

    return NextResponse.json({
      success: true,
      data: {
        current_city: currentCity,
        all_cities: GLOBAL_CITIES,
        distances_from_current: distances,
        total_cities: Object.keys(GLOBAL_CITIES).length
      },
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Cities data unavailable',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}

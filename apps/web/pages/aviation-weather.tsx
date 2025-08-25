/**
 * Aviation Weather Intelligence Page
 * EuroWeb Platform - Aviation Module
 * 
 * @author Ledjan Ahmati (100% Owner)
 * @contact dealsjona@gmail.com
 * @version 8.3.0 Ultra
 * @license MIT
 */

import AviationWeatherDashboard from '@/components/aviation/AviationWeatherDashboard'
import { Suspense } from 'react'

export default function AviationPage() {
    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
            padding: '20px'
        }}>
            <Suspense fallback={
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '400px',
                    color: '#60a5fa',
                    fontSize: '18px'
                }}>
                    ✈️ Loading Aviation Weather Intelligence...
                </div>
            }>
                <AviationWeatherDashboard />
            </Suspense>
        </div>
    )
}

export const metadata = {
    title: 'Aviation Weather Intelligence | EuroWeb Platform',
    description: 'SAT + METAR/TAF + NWP → Airport Forecasts (0–48h)',
}

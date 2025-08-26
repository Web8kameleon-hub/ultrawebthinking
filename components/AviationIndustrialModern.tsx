// components/AviationIndustrialModern.tsx
// Modern Aviation Weather Platform - Multi-Airport, Real-time
// Features: Popular airports, search, favorites, weather maps, alerts

'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { Clock, Eye, MapPin, Plane, Search, Star, StarOff, Thermometer, TrendingUp, Wind } from 'lucide-react'
import { useEffect, useState } from 'react'

interface Airport {
    icao: string
    name: string
    city: string
    country: string
    coordinates: [number, number]
    timezone: string
}

interface WeatherData {
    icao: string
    metar?: any[]
    taf?: any[]
    timestamp: string
    cached?: boolean
    temperature?: number
    windSpeed?: number
    visibility?: string
    conditions?: string
    pressure?: number
}

const popularAirports: Airport[] = [
    { icao: 'LATI', name: 'Tirana International', city: 'Tirana', country: '🇦🇱 Albania', coordinates: [41.419, 19.716], timezone: 'CET' },
    { icao: 'EDDF', name: 'Frankfurt Airport', city: 'Frankfurt', country: '🇩🇪 Germany', coordinates: [50.026, 8.543], timezone: 'CET' },
    { icao: 'LOWW', name: 'Vienna International', city: 'Vienna', country: '🇦🇹 Austria', coordinates: [48.110, 16.570], timezone: 'CET' },
    { icao: 'LIRF', name: 'Leonardo da Vinci', city: 'Rome', country: '🇮🇹 Italy', coordinates: [41.800, 12.250], timezone: 'CET' },
    { icao: 'LGAV', name: 'Athens International', city: 'Athens', country: '🇬🇷 Greece', coordinates: [37.936, 23.944], timezone: 'EET' },
    { icao: 'LDZA', name: 'Zagreb Airport', city: 'Zagreb', country: '🇭🇷 Croatia', coordinates: [45.743, 16.069], timezone: 'CET' },
    { icao: 'LYBE', name: 'Belgrade Airport', city: 'Belgrade', country: '🇷🇸 Serbia', coordinates: [44.818, 20.309], timezone: 'CET' },
    { icao: 'LTFM', name: 'Istanbul Airport', city: 'Istanbul', country: '🇹🇷 Turkey', coordinates: [41.262, 28.728], timezone: 'TRT' },
    { icao: 'EGLL', name: 'London Heathrow', city: 'London', country: '🇬🇧 UK', coordinates: [51.470, -0.454], timezone: 'GMT' },
    { icao: 'LFPG', name: 'Charles de Gaulle', city: 'Paris', country: '🇫🇷 France', coordinates: [49.013, 2.550], timezone: 'CET' },
    { icao: 'LEMD', name: 'Madrid-Barajas', city: 'Madrid', country: '🇪🇸 Spain', coordinates: [40.472, -3.561], timezone: 'CET' },
    { icao: 'EHAM', name: 'Amsterdam Schiphol', city: 'Amsterdam', country: '🇳🇱 Netherlands', coordinates: [52.309, 4.764], timezone: 'CET' },
    { icao: 'ESSA', name: 'Stockholm Arlanda', city: 'Stockholm', country: '🇸🇪 Sweden', coordinates: [59.652, 17.919], timezone: 'CET' },
    { icao: 'EKCH', name: 'Copenhagen Airport', city: 'Copenhagen', country: '🇩🇰 Denmark', coordinates: [55.618, 12.656], timezone: 'CET' },
    { icao: 'LSZH', name: 'Zurich Airport', city: 'Zurich', country: '🇨🇭 Switzerland', coordinates: [47.464, 8.549], timezone: 'CET' }
]

const balkanAirports: Airport[] = [
    { icao: 'LATI', name: 'Tirana International', city: 'Tirana', country: '🇦🇱 Albania', coordinates: [41.419, 19.716], timezone: 'CET' },
    { icao: 'LYPG', name: 'Podgorica Airport', city: 'Podgorica', country: '🇲🇪 Montenegro', coordinates: [42.360, 19.252], timezone: 'CET' },
    { icao: 'LYPR', name: 'Pristina Airport', city: 'Pristina', country: '🇽🇰 Kosovo', coordinates: [42.573, 21.036], timezone: 'CET' },
    { icao: 'LQSA', name: 'Sarajevo Airport', city: 'Sarajevo', country: '🇧🇦 Bosnia', coordinates: [43.825, 18.331], timezone: 'CET' },
    { icao: 'LWSK', name: 'Skopje Airport', city: 'Skopje', country: '🇲🇰 North Macedonia', coordinates: [41.962, 21.621], timezone: 'CET' },
    { icao: 'LYBE', name: 'Belgrade Airport', city: 'Belgrade', country: '🇷🇸 Serbia', coordinates: [44.818, 20.309], timezone: 'CET' },
    { icao: 'LDZA', name: 'Zagreb Airport', city: 'Zagreb', country: '🇭🇷 Croatia', coordinates: [45.743, 16.069], timezone: 'CET' },
    { icao: 'LDSP', name: 'Split Airport', city: 'Split', country: '🇭🇷 Croatia', coordinates: [43.539, 16.298], timezone: 'CET' }
]

export default function AviationIndustrialModern() {
    const [searchTerm, setSearchTerm] = useState('')
    const [activeAirports, setActiveAirports] = useState<string[]>(['LATI', 'EDDF', 'LOWW'])
    const [favorites, setFavorites] = useState<string[]>(['LATI'])
    const [weatherData, setWeatherData] = useState<Record<string, WeatherData>>({})
    const [loading, setLoading] = useState<string[]>([])
    const [currentTab, setCurrentTab] = useState<'popular' | 'balkan' | 'search'>('popular')
    const [autoRefresh, setAutoRefresh] = useState(true)

    const allAirports = [...popularAirports, ...balkanAirports]
    const uniqueAirports = allAirports.filter((airport, index, self) =>
        index === self.findIndex(a => a.icao === airport.icao)
    )

    const filteredAirports = currentTab === 'popular' ? popularAirports :
        currentTab === 'balkan' ? balkanAirports :
            uniqueAirports.filter(airport =>
                airport.icao.toLowerCase().includes(searchTerm.toLowerCase()) ||
                airport.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                airport.city.toLowerCase().includes(searchTerm.toLowerCase())
            )

    const loadWeatherData = async (icao: string) => {
        setLoading(prev => [...prev, icao])

        try {
            const [metarRes, tafRes] = await Promise.all([
                fetch(`/api/aviation-metar?icao=${icao}`),
                fetch(`/api/aviation-taf?icao=${icao}`)
            ])

            const metarData = metarRes.ok ? await metarRes.json() : null
            const tafData = tafRes.ok ? await tafRes.json() : null

            // Extract basic weather info from METAR
            const metar = metarData?.data?.[0]
            const temperature = metar?.temp
            const windSpeed = metar?.wspd
            const visibility = metar?.visib
            const pressure = metar?.altim
            const conditions = metar?.wxString || (metar?.clouds?.[0]?.cover === 'CAVOK' ? 'Clear' : 'Unknown')

            setWeatherData(prev => ({
                ...prev,
                [icao]: {
                    icao,
                    metar: metarData?.data || [],
                    taf: tafData?.data || [],
                    timestamp: new Date().toISOString(),
                    temperature,
                    windSpeed,
                    visibility,
                    conditions,
                    pressure
                }
            }))
        } catch (error) {
            console.error(`Failed to load weather for ${icao}:`, error)
        } finally {
            setLoading(prev => prev.filter(code => code !== icao))
        }
    }

    const toggleFavorite = (icao: string) => {
        setFavorites(prev =>
            prev.includes(icao)
                ? prev.filter(code => code !== icao)
                : [...prev, icao]
        )
    }

    const addToActive = (icao: string) => {
        if (!activeAirports.includes(icao)) {
            setActiveAirports(prev => [...prev, icao])
            loadWeatherData(icao)
        }
    }

    const removeFromActive = (icao: string) => {
        setActiveAirports(prev => prev.filter(code => code !== icao))
    }

    // Auto-refresh every 2 minutes
    useEffect(() => {
        if (autoRefresh && activeAirports.length > 0) {
            const interval = setInterval(() => {
                activeAirports.forEach(icao => loadWeatherData(icao))
            }, 120000) // 2 minutes

            return () => clearInterval(interval)
        }
    }, [activeAirports, autoRefresh])

    // Load initial data
    useEffect(() => {
        activeAirports.forEach(icao => loadWeatherData(icao))
    }, [])

    const getWeatherConditionIcon = (conditions: string = '') => {
        if (conditions.toLowerCase().includes('clear') || conditions.includes('CAVOK')) return '☀️'
        if (conditions.toLowerCase().includes('cloud')) return '☁️'
        if (conditions.toLowerCase().includes('rain')) return '🌧️'
        if (conditions.toLowerCase().includes('snow')) return '❄️'
        if (conditions.toLowerCase().includes('fog')) return '🌫️'
        return '🌤️'
    }

    const getWindIcon = (speed: number = 0) => {
        if (speed < 5) return '💨'
        if (speed < 15) return '🌬️'
        return '💨💨'
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white p-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                            <Plane className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                                Aviation Weather Pro
                            </h1>
                            <p className="text-blue-200">Real-time METAR & TAF for European Airports</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setAutoRefresh(!autoRefresh)}
                            className={`px-4 py-2 rounded-lg transition-colors ${autoRefresh
                                    ? 'bg-green-600 hover:bg-green-700'
                                    : 'bg-gray-600 hover:bg-gray-700'
                                }`}
                        >
                            <Clock className="w-4 h-4 inline mr-2" />
                            Auto-refresh: {autoRefresh ? 'ON' : 'OFF'}
                        </button>
                        <div className="text-sm text-blue-200">
                            {activeAirports.length} airports active
                        </div>
                    </div>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Airport Selector */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="xl:col-span-1"
                >
                    <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700 p-6">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-blue-400" />
                            Airport Selection
                        </h2>

                        {/* Tab Navigation */}
                        <div className="flex gap-1 mb-4 bg-slate-700/50 rounded-lg p-1">
                            {[
                                { key: 'popular', label: 'Popular', icon: '🌟' },
                                { key: 'balkan', label: 'Balkan', icon: '🏔️' },
                                { key: 'search', label: 'Search', icon: '🔍' }
                            ].map(tab => (
                                <button
                                    key={tab.key}
                                    onClick={() => setCurrentTab(tab.key as any)}
                                    className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${currentTab === tab.key
                                            ? 'bg-blue-600 text-white'
                                            : 'text-slate-300 hover:text-white hover:bg-slate-600'
                                        }`}
                                >
                                    {tab.icon} {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Search Input */}
                        {currentTab === 'search' && (
                            <div className="relative mb-4">
                                <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Search airports by ICAO, name, or city..."
                                    className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-blue-400 focus:outline-none"
                                />
                            </div>
                        )}

                        {/* Airport List */}
                        <div className="space-y-2 max-h-96 overflow-y-auto">
                            {filteredAirports.map((airport) => (
                                <motion.div
                                    key={airport.icao}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className={`p-3 rounded-lg border transition-all cursor-pointer ${activeAirports.includes(airport.icao)
                                            ? 'bg-blue-600/20 border-blue-400'
                                            : 'bg-slate-700/30 border-slate-600 hover:border-slate-500'
                                        }`}
                                    onClick={() => addToActive(airport.icao)}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <span className="font-mono font-bold text-blue-300">{airport.icao}</span>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        toggleFavorite(airport.icao)
                                                    }}
                                                    className="text-yellow-400 hover:text-yellow-300"
                                                >
                                                    {favorites.includes(airport.icao) ?
                                                        <Star className="w-4 h-4 fill-current" /> :
                                                        <StarOff className="w-4 h-4" />
                                                    }
                                                </button>
                                            </div>
                                            <div className="text-sm text-slate-300">{airport.name}</div>
                                            <div className="text-xs text-slate-400">{airport.city}, {airport.country}</div>
                                        </div>
                                        {loading.includes(airport.icao) && (
                                            <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* Weather Display */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="xl:col-span-2"
                >
                    <div className="space-y-4">
                        <AnimatePresence>
                            {activeAirports.map((icao) => {
                                const airport = uniqueAirports.find(a => a.icao === icao)
                                const weather = weatherData[icao]

                                if (!airport) return null

                                return (
                                    <motion.div
                                        key={icao}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700 p-6"
                                    >
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="text-2xl">
                                                    {getWeatherConditionIcon(weather?.conditions)}
                                                </div>
                                                <div>
                                                    <h3 className="text-xl font-bold text-blue-300">{icao}</h3>
                                                    <p className="text-slate-300">{airport.name}</p>
                                                    <p className="text-sm text-slate-400">{airport.city}, {airport.country}</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => removeFromActive(icao)}
                                                className="text-slate-400 hover:text-red-400 transition-colors"
                                            >
                                                ✕
                                            </button>
                                        </div>

                                        {weather ? (
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                {/* Temperature */}
                                                <div className="bg-slate-700/30 rounded-lg p-3">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <Thermometer className="w-4 h-4 text-red-400" />
                                                        <span className="text-sm text-slate-400">Temperature</span>
                                                    </div>
                                                    <div className="text-lg font-bold">
                                                        {weather.temperature !== undefined ? `${weather.temperature}°C` : 'N/A'}
                                                    </div>
                                                </div>

                                                {/* Wind */}
                                                <div className="bg-slate-700/30 rounded-lg p-3">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <Wind className="w-4 h-4 text-blue-400" />
                                                        <span className="text-sm text-slate-400">Wind</span>
                                                    </div>
                                                    <div className="text-lg font-bold flex items-center gap-1">
                                                        {getWindIcon(weather.windSpeed)}
                                                        {weather.windSpeed !== undefined ? `${weather.windSpeed} kt` : 'N/A'}
                                                    </div>
                                                </div>

                                                {/* Visibility */}
                                                <div className="bg-slate-700/30 rounded-lg p-3">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <Eye className="w-4 h-4 text-green-400" />
                                                        <span className="text-sm text-slate-400">Visibility</span>
                                                    </div>
                                                    <div className="text-lg font-bold">
                                                        {weather.visibility || 'N/A'}
                                                    </div>
                                                </div>

                                                {/* Pressure */}
                                                <div className="bg-slate-700/30 rounded-lg p-3">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <TrendingUp className="w-4 h-4 text-purple-400" />
                                                        <span className="text-sm text-slate-400">Pressure</span>
                                                    </div>
                                                    <div className="text-lg font-bold">
                                                        {weather.pressure ? `${weather.pressure} hPa` : 'N/A'}
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex items-center justify-center py-8">
                                                <div className="w-6 h-6 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                                                <span className="ml-3 text-slate-400">Loading weather data...</span>
                                            </div>
                                        )}

                                        {weather?.timestamp && (
                                            <div className="mt-4 pt-4 border-t border-slate-700">
                                                <div className="flex items-center justify-between text-sm text-slate-400">
                                                    <span>Last updated: {new Date(weather.timestamp).toLocaleTimeString()}</span>
                                                    <button
                                                        onClick={() => loadWeatherData(icao)}
                                                        disabled={loading.includes(icao)}
                                                        className="text-blue-400 hover:text-blue-300 disabled:opacity-50"
                                                    >
                                                        Refresh
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </motion.div>
                                )
                            })}
                        </AnimatePresence>

                        {activeAirports.length === 0 && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="bg-slate-800/30 rounded-2xl border border-slate-700 p-12 text-center"
                            >
                                <Plane className="w-16 h-16 text-slate-500 mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-slate-400 mb-2">No airports selected</h3>
                                <p className="text-slate-500">Choose airports from the left panel to view weather data</p>
                            </motion.div>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    )
}

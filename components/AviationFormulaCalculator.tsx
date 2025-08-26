// components/AviationFormulaCalculator.tsx
// Aviation Formula Calculator - Professional Flight Planning Tools
// Fuel, Weight, Distance, Weather, Navigation Calculations

'use client'

import { motion } from 'framer-motion'
import { Calculator, Download, Fuel, Navigation, Plane, RefreshCw, Save, Wind } from 'lucide-react'
import { evaluate } from 'mathjs'
import { useState } from 'react'

interface CalculationResult {
    formula: string
    result: number
    unit: string
    description: string
}

interface FormulaCategory {
    id: string
    name: string
    icon: any
    formulas: Formula[]
}

interface Formula {
    id: string
    name: string
    description: string
    formula: string
    inputs: FormulaInput[]
    unit: string
    category: string
}

interface FormulaInput {
    id: string
    label: string
    unit: string
    placeholder: string
    value: number
    min?: number
    max?: number
}

const formulaCategories: FormulaCategory[] = [
    {
        id: 'fuel',
        name: 'Fuel Calculations',
        icon: Fuel,
        formulas: [
            {
                id: 'fuel_consumption',
                name: 'Fuel Consumption Rate',
                description: 'Calculate fuel consumption per hour based on distance and time',
                formula: 'distance / time * fuel_factor',
                unit: 'L/h',
                category: 'fuel',
                inputs: [
                    { id: 'distance', label: 'Distance', unit: 'nm', placeholder: '350', value: 0 },
                    { id: 'time', label: 'Flight Time', unit: 'hours', placeholder: '2.5', value: 0 },
                    { id: 'fuel_factor', label: 'Fuel Factor', unit: 'L/nm', placeholder: '12', value: 0 }
                ]
            },
            {
                id: 'fuel_required',
                name: 'Total Fuel Required',
                description: 'Calculate total fuel needed including reserves',
                formula: 'trip_fuel + reserve_fuel + taxi_fuel',
                unit: 'L',
                category: 'fuel',
                inputs: [
                    { id: 'trip_fuel', label: 'Trip Fuel', unit: 'L', placeholder: '800', value: 0 },
                    { id: 'reserve_fuel', label: 'Reserve Fuel', unit: 'L', placeholder: '120', value: 0 },
                    { id: 'taxi_fuel', label: 'Taxi Fuel', unit: 'L', placeholder: '50', value: 0 }
                ]
            }
        ]
    },
    {
        id: 'navigation',
        name: 'Navigation & Distance',
        icon: Navigation,
        formulas: [
            {
                id: 'great_circle_distance',
                name: 'Great Circle Distance',
                description: 'Calculate distance between two coordinates',
                formula: 'acos(sin(lat1) * sin(lat2) + cos(lat1) * cos(lat2) * cos(lon2 - lon1)) * 3440.065',
                unit: 'nm',
                category: 'navigation',
                inputs: [
                    { id: 'lat1', label: 'Origin Latitude', unit: 'deg', placeholder: '41.419', value: 0 },
                    { id: 'lon1', label: 'Origin Longitude', unit: 'deg', placeholder: '19.716', value: 0 },
                    { id: 'lat2', label: 'Destination Latitude', unit: 'deg', placeholder: '50.026', value: 0 },
                    { id: 'lon2', label: 'Destination Longitude', unit: 'deg', placeholder: '8.543', value: 0 }
                ]
            },
            {
                id: 'ground_speed',
                name: 'Ground Speed',
                description: 'Calculate ground speed with wind components',
                formula: 'sqrt((tas * cos(track) + wind_speed * cos(wind_dir))^2 + (tas * sin(track) + wind_speed * sin(wind_dir))^2)',
                unit: 'kts',
                category: 'navigation',
                inputs: [
                    { id: 'tas', label: 'True Airspeed', unit: 'kts', placeholder: '450', value: 0 },
                    { id: 'track', label: 'Track Angle', unit: 'deg', placeholder: '090', value: 0 },
                    { id: 'wind_speed', label: 'Wind Speed', unit: 'kts', placeholder: '25', value: 0 },
                    { id: 'wind_dir', label: 'Wind Direction', unit: 'deg', placeholder: '270', value: 0 }
                ]
            }
        ]
    },
    {
        id: 'weather',
        name: 'Weather Calculations',
        icon: Wind,
        formulas: [
            {
                id: 'wind_components',
                name: 'Wind Components',
                description: 'Calculate headwind and crosswind components',
                formula: 'abs(wind_speed * cos(wind_dir - runway_hdg))',
                unit: 'kts',
                category: 'weather',
                inputs: [
                    { id: 'wind_speed', label: 'Wind Speed', unit: 'kts', placeholder: '25', value: 0 },
                    { id: 'wind_dir', label: 'Wind Direction', unit: 'deg', placeholder: '270', value: 0 },
                    { id: 'runway_hdg', label: 'Runway Heading', unit: 'deg', placeholder: '090', value: 0 }
                ]
            },
            {
                id: 'density_altitude',
                name: 'Density Altitude',
                description: 'Calculate density altitude for performance',
                formula: 'pressure_alt + (120 * (temp - (15 - (pressure_alt * 0.00198))))',
                unit: 'ft',
                category: 'weather',
                inputs: [
                    { id: 'pressure_alt', label: 'Pressure Altitude', unit: 'ft', placeholder: '5000', value: 0 },
                    { id: 'temp', label: 'Temperature', unit: '°C', placeholder: '25', value: 0 }
                ]
            }
        ]
    },
    {
        id: 'weight',
        name: 'Weight & Balance',
        icon: Plane,
        formulas: [
            {
                id: 'center_of_gravity',
                name: 'Center of Gravity',
                description: 'Calculate aircraft center of gravity',
                formula: '(weight1 * arm1 + weight2 * arm2 + weight3 * arm3) / (weight1 + weight2 + weight3)',
                unit: 'in',
                category: 'weight',
                inputs: [
                    { id: 'weight1', label: 'Weight 1', unit: 'lbs', placeholder: '2500', value: 0 },
                    { id: 'arm1', label: 'Arm 1', unit: 'in', placeholder: '95', value: 0 },
                    { id: 'weight2', label: 'Weight 2', unit: 'lbs', placeholder: '400', value: 0 },
                    { id: 'arm2', label: 'Arm 2', unit: 'in', placeholder: '120', value: 0 },
                    { id: 'weight3', label: 'Weight 3', unit: 'lbs', placeholder: '800', value: 0 },
                    { id: 'arm3', label: 'Arm 3', unit: 'in', placeholder: '150', value: 0 }
                ]
            }
        ]
    }
]

export default function AviationFormulaCalculator() {
    const [activeCategory, setActiveCategory] = useState<string>('fuel')
    const [selectedFormula, setSelectedFormula] = useState<Formula | null>(null)
    const [inputs, setInputs] = useState<Record<string, number>>({})
    const [results, setResults] = useState<CalculationResult[]>([])
    const [savedCalculations, setSavedCalculations] = useState<CalculationResult[]>([])

    const updateInput = (inputId: string, value: number) => {
        setInputs(prev => ({ ...prev, [inputId]: value }))
    }

    const calculateFormula = () => {
        if (!selectedFormula) return

        try {
            // Convert degrees to radians for trigonometric functions
            const processedInputs = { ...inputs }
            Object.keys(processedInputs).forEach(key => {
                if (key.includes('lat') || key.includes('lon') || key.includes('track') || key.includes('dir') || key.includes('hdg')) {
                    processedInputs[key] = (processedInputs[key] * Math.PI) / 180
                }
            })

            const result = evaluate(selectedFormula.formula, processedInputs)

            const calculation: CalculationResult = {
                formula: selectedFormula.name,
                result: typeof result === 'number' ? Math.round(result * 100) / 100 : 0,
                unit: selectedFormula.unit,
                description: selectedFormula.description
            }

            setResults(prev => [calculation, ...prev.slice(0, 9)]) // Keep last 10 results
        } catch (error) {
            console.error('Calculation error:', error)
        }
    }

    const saveCalculation = (calculation: CalculationResult) => {
        setSavedCalculations(prev => [calculation, ...prev])
    }

    const clearResults = () => {
        setResults([])
    }

    const exportResults = () => {
        const dataStr = JSON.stringify(results, null, 2)
        const dataBlob = new Blob([dataStr], { type: 'application/json' })
        const url = URL.createObjectURL(dataBlob)
        const link = document.createElement('a')
        link.href = url
        link.download = 'aviation_calculations.json'
        link.click()
    }

    const getCurrentCategory = () => {
        return formulaCategories.find(cat => cat.id === activeCategory)
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-800 text-white p-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                            <Calculator className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-emerald-200 bg-clip-text text-transparent">
                                Aviation Formula Calculator
                            </h1>
                            <p className="text-emerald-200">Professional flight planning calculations</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={clearResults}
                            className="px-4 py-2 bg-slate-600 hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-2"
                        >
                            <RefreshCw className="w-4 h-4" />
                            Clear
                        </button>
                        <button
                            onClick={exportResults}
                            disabled={results.length === 0}
                            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
                        >
                            <Download className="w-4 h-4" />
                            Export
                        </button>
                    </div>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
                {/* Category Selection */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="xl:col-span-1"
                >
                    <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700 p-6">
                        <h2 className="text-xl font-bold mb-4">Formula Categories</h2>
                        <div className="space-y-2">
                            {formulaCategories.map((category) => {
                                const Icon = category.icon
                                return (
                                    <button
                                        key={category.id}
                                        onClick={() => {
                                            setActiveCategory(category.id)
                                            setSelectedFormula(null)
                                        }}
                                        className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${activeCategory === category.id
                                                ? 'bg-emerald-600 text-white'
                                                : 'bg-slate-700/30 hover:bg-slate-700/50 text-slate-300'
                                            }`}
                                    >
                                        <Icon className="w-5 h-5" />
                                        <div className="text-left">
                                            <div className="font-medium">{category.name}</div>
                                            <div className="text-xs opacity-80">{category.formulas.length} formulas</div>
                                        </div>
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                </motion.div>

                {/* Formula Selection & Calculator */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="xl:col-span-2"
                >
                    <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700 p-6">
                        <h2 className="text-xl font-bold mb-4">
                            {getCurrentCategory()?.name} Formulas
                        </h2>

                        {/* Formula List */}
                        <div className="space-y-3 mb-6">
                            {getCurrentCategory()?.formulas.map((formula) => (
                                <button
                                    key={formula.id}
                                    onClick={() => setSelectedFormula(formula)}
                                    className={`w-full p-4 rounded-lg border transition-all text-left ${selectedFormula?.id === formula.id
                                            ? 'bg-emerald-600/20 border-emerald-400'
                                            : 'bg-slate-700/30 border-slate-600 hover:border-slate-500'
                                        }`}
                                >
                                    <div className="font-bold text-emerald-300">{formula.name}</div>
                                    <div className="text-sm text-slate-400 mt-1">{formula.description}</div>
                                    <div className="text-xs font-mono text-slate-500 mt-2">
                                        Result: {formula.unit}
                                    </div>
                                </button>
                            ))}
                        </div>

                        {/* Input Form */}
                        {selectedFormula && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="border-t border-slate-700 pt-6"
                            >
                                <h3 className="text-lg font-bold mb-4">{selectedFormula.name}</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                    {selectedFormula.inputs.map((input) => (
                                        <div key={input.id}>
                                            <label className="block text-sm font-medium text-slate-300 mb-1">
                                                {input.label} ({input.unit})
                                            </label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                placeholder={input.placeholder}
                                                value={inputs[input.id] || ''}
                                                onChange={(e) => updateInput(input.id, parseFloat(e.target.value) || 0)}
                                                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-emerald-400 focus:outline-none"
                                            />
                                        </div>
                                    ))}
                                </div>
                                <button
                                    onClick={calculateFormula}
                                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 rounded-lg font-medium transition-colors"
                                >
                                    Calculate
                                </button>
                            </motion.div>
                        )}
                    </div>
                </motion.div>

                {/* Results Panel */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="xl:col-span-1"
                >
                    <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700 p-6">
                        <h2 className="text-xl font-bold mb-4">Calculation Results</h2>

                        {results.length === 0 ? (
                            <div className="text-center py-8">
                                <Calculator className="w-12 h-12 text-slate-500 mx-auto mb-3" />
                                <p className="text-slate-400">No calculations yet</p>
                                <p className="text-sm text-slate-500">Select a formula and calculate</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {results.map((result, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="p-4 bg-slate-700/30 rounded-lg border border-slate-600"
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="font-bold text-emerald-300">{result.formula}</span>
                                            <button
                                                onClick={() => saveCalculation(result)}
                                                className="text-slate-400 hover:text-emerald-400"
                                            >
                                                <Save className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <div className="text-2xl font-bold text-white">
                                            {result.result} <span className="text-sm text-slate-400">{result.unit}</span>
                                        </div>
                                        <div className="text-xs text-slate-500 mt-1">{result.description}</div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    )
}

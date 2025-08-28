/**
 * Industrial Working Component - Real Engineering Tools
 * @author Ledjan Ahmati
 * @version 8.0.0-WEB8-INDUSTRIAL
 */

'use client'

import React, { useState, useCallback } from 'react'
import { motion } from 'framer-motion'

interface CalculationResult {
  success: boolean
  calculation?: any
  document?: string
  sample?: string
  filename?: string
  error?: string
}

export const IndustrialWorkingSystem: React.FC = () => {
  const [activeTab, setActiveTab] = useState('civil')
  const [results, setResults] = useState<CalculationResult | null>(null)
  const [isCalculating, setIsCalculating] = useState(false)
  const [generatedDocuments, setGeneratedDocuments] = useState<string[]>([])

  // Civil Engineering Calculator
  const [civilInputs, setCivilInputs] = useState({
    cement: 350,
    water: 175,
    aggregate: 1200
  })

  // Electrical Engineering Calculator  
  const [electricalInputs, setElectricalInputs] = useState({
    voltage: 230,
    current: 10,
    hours: 8,
    days: 30
  })

  // Mechanical Engineering Calculator
  const [mechanicalInputs, setMechanicalInputs] = useState({
    force: 1000,
    distance: 0.5,
    angle: 90
  })

  // Chemical Engineering Calculator
  const [chemicalInputs, setChemicalInputs] = useState({
    concentration: 0.1,
    temperature: 323,
    catalyst: true
  })

  // Environmental Engineering Calculator
  const [environmentalInputs, setEnvironmentalInputs] = useState({
    co2: 400,
    nox: 50,
    particulates: 25
  })

  const performCalculation = useCallback(async (type: string, parameters: any) => {
    setIsCalculating(true)
    try {
      const response = await fetch('/api/industrial/engine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'calculate',
          type,
          parameters
        })
      })
      
      const result = await response.json()
      setResults(result)
    } catch (error) {
      setResults({
        success: false,
        error: error instanceof Error ? error.message : 'Calculation failed'
      })
    } finally {
      setIsCalculating(false)
    }
  }, [])

  const generateDocument = useCallback(async (type: string, data: any) => {
    try {
      const response = await fetch('/api/industrial/engine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate_document',
          type,
          parameters: data
        })
      })
      
      const result = await response.json()
      if (result.success) {
        setGeneratedDocuments(prev => [...prev, result.filename])
        // Create downloadable file
        const blob = new Blob([result.document], { type: 'text/plain' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = result.filename
        a.click()
        URL.revokeObjectURL(url)
      }
    } catch (error) {
      console.error('Document generation failed:', error)
    }
  }, [])

  const getWorkSample = useCallback(async (field: string) => {
    try {
      const response = await fetch('/api/industrial/engine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'get_sample',
          type: field
        })
      })
      
      const result = await response.json()
      setResults(result)
    } catch (error) {
      setResults({
        success: false,
        error: 'Failed to get work sample'
      })
    }
  }, [])

  const renderCalculator = () => {
    switch(activeTab) {
      case 'civil':
        return (
          <div>
            <h3 style={{ color: '#059669', marginBottom: '20px', fontSize: '18px' }}>
              🏗️ Concrete Strength Calculator
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', color: '#374151' }}>
                  Cement (kg/m³)
                </label>
                <input
                  type="number"
                  value={civilInputs.cement}
                  onChange={(e) => setCivilInputs(prev => ({ ...prev, cement: Number(e.target.value) }))}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px'
                  }}
                />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', color: '#374151' }}>
                  Water (kg/m³)
                </label>
                <input
                  type="number"
                  value={civilInputs.water}
                  onChange={(e) => setCivilInputs(prev => ({ ...prev, water: Number(e.target.value) }))}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px'
                  }}
                />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', color: '#374151' }}>
                  Aggregate (kg/m³)
                </label>
                <input
                  type="number"
                  value={civilInputs.aggregate}
                  onChange={(e) => setCivilInputs(prev => ({ ...prev, aggregate: Number(e.target.value) }))}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px'
                  }}
                />
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => performCalculation('concrete', civilInputs)}
                disabled={isCalculating}
                style={{
                  padding: '10px 20px',
                  background: 'linear-gradient(135deg, #059669, #047857)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: isCalculating ? 'not-allowed' : 'pointer',
                  opacity: isCalculating ? 0.6 : 1
                }}
              >
                {isCalculating ? '⏳ Calculating...' : '🧮 Calculate Strength'}
              </button>
              
              <button
                onClick={() => getWorkSample('civil')}
                style={{
                  padding: '10px 20px',
                  background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                📝 Get Work Sample
              </button>
            </div>
          </div>
        )

      case 'electrical':
        return (
          <div>
            <h3 style={{ color: '#dc2626', marginBottom: '20px', fontSize: '18px' }}>
              ⚡ Power Consumption Calculator
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', color: '#374151' }}>
                  Voltage (V)
                </label>
                <input
                  type="number"
                  value={electricalInputs.voltage}
                  onChange={(e) => setElectricalInputs(prev => ({ ...prev, voltage: Number(e.target.value) }))}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px'
                  }}
                />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', color: '#374151' }}>
                  Current (A)
                </label>
                <input
                  type="number"
                  value={electricalInputs.current}
                  onChange={(e) => setElectricalInputs(prev => ({ ...prev, current: Number(e.target.value) }))}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px'
                  }}
                />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', color: '#374151' }}>
                  Hours/Day
                </label>
                <input
                  type="number"
                  value={electricalInputs.hours}
                  onChange={(e) => setElectricalInputs(prev => ({ ...prev, hours: Number(e.target.value) }))}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px'
                  }}
                />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', color: '#374151' }}>
                  Days/Month
                </label>
                <input
                  type="number"
                  value={electricalInputs.days}
                  onChange={(e) => setElectricalInputs(prev => ({ ...prev, days: Number(e.target.value) }))}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px'
                  }}
                />
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => performCalculation('electrical', electricalInputs)}
                disabled={isCalculating}
                style={{
                  padding: '10px 20px',
                  background: 'linear-gradient(135deg, #dc2626, #b91c1c)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: isCalculating ? 'not-allowed' : 'pointer',
                  opacity: isCalculating ? 0.6 : 1
                }}
              >
                {isCalculating ? '⏳ Calculating...' : '⚡ Calculate Power'}
              </button>
              
              <button
                onClick={() => getWorkSample('electrical')}
                style={{
                  padding: '10px 20px',
                  background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                📝 Get Work Sample
              </button>
            </div>
          </div>
        )

      case 'mechanical':
        return (
          <div>
            <h3 style={{ color: '#7c2d12', marginBottom: '20px', fontSize: '18px' }}>
              ⚙️ Torque & Force Calculator
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', color: '#374151' }}>
                  Force (N)
                </label>
                <input
                  type="number"
                  value={mechanicalInputs.force}
                  onChange={(e) => setMechanicalInputs(prev => ({ ...prev, force: Number(e.target.value) }))}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px'
                  }}
                />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', color: '#374151' }}>
                  Distance (m)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={mechanicalInputs.distance}
                  onChange={(e) => setMechanicalInputs(prev => ({ ...prev, distance: Number(e.target.value) }))}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px'
                  }}
                />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', color: '#374151' }}>
                  Angle (°)
                </label>
                <input
                  type="number"
                  value={mechanicalInputs.angle}
                  onChange={(e) => setMechanicalInputs(prev => ({ ...prev, angle: Number(e.target.value) }))}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px'
                  }}
                />
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => performCalculation('mechanical', mechanicalInputs)}
                disabled={isCalculating}
                style={{
                  padding: '10px 20px',
                  background: 'linear-gradient(135deg, #92400e, #78350f)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: isCalculating ? 'not-allowed' : 'pointer',
                  opacity: isCalculating ? 0.6 : 1
                }}
              >
                {isCalculating ? '⏳ Calculating...' : '⚙️ Calculate Torque'}
              </button>
              
              <button
                onClick={() => getWorkSample('mechanical')}
                style={{
                  padding: '10px 20px',
                  background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                📝 Get Work Sample
              </button>
            </div>
          </div>
        )

      case 'chemical':
        return (
          <div>
            <h3 style={{ color: '#7c3aed', marginBottom: '20px', fontSize: '18px' }}>
              🧪 Chemical Reaction Calculator
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', color: '#374151' }}>
                  Concentration (mol/L)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={chemicalInputs.concentration}
                  onChange={(e) => setChemicalInputs(prev => ({ ...prev, concentration: Number(e.target.value) }))}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px'
                  }}
                />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', color: '#374151' }}>
                  Temperature (K)
                </label>
                <input
                  type="number"
                  value={chemicalInputs.temperature}
                  onChange={(e) => setChemicalInputs(prev => ({ ...prev, temperature: Number(e.target.value) }))}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px'
                  }}
                />
              </div>
              
              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#374151' }}>
                  <input
                    type="checkbox"
                    checked={chemicalInputs.catalyst}
                    onChange={(e) => setChemicalInputs(prev => ({ ...prev, catalyst: e.target.checked }))}
                  />
                  Catalyst Present
                </label>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => performCalculation('chemical', chemicalInputs)}
                disabled={isCalculating}
                style={{
                  padding: '10px 20px',
                  background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: isCalculating ? 'not-allowed' : 'pointer',
                  opacity: isCalculating ? 0.6 : 1
                }}
              >
                {isCalculating ? '⏳ Calculating...' : '🧪 Calculate Rate'}
              </button>
              
              <button
                onClick={() => getWorkSample('chemical')}
                style={{
                  padding: '10px 20px',
                  background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                📝 Get Work Sample
              </button>
            </div>
          </div>
        )

      case 'environmental':
        return (
          <div>
            <h3 style={{ color: '#059669', marginBottom: '20px', fontSize: '18px' }}>
              🌍 Environmental Impact Calculator
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', color: '#374151' }}>
                  CO₂ (ppm)
                </label>
                <input
                  type="number"
                  value={environmentalInputs.co2}
                  onChange={(e) => setEnvironmentalInputs(prev => ({ ...prev, co2: Number(e.target.value) }))}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px'
                  }}
                />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', color: '#374151' }}>
                  NOₓ (μg/m³)
                </label>
                <input
                  type="number"
                  value={environmentalInputs.nox}
                  onChange={(e) => setEnvironmentalInputs(prev => ({ ...prev, nox: Number(e.target.value) }))}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px'
                  }}
                />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', color: '#374151' }}>
                  PM₂.₅ (μg/m³)
                </label>
                <input
                  type="number"
                  value={environmentalInputs.particulates}
                  onChange={(e) => setEnvironmentalInputs(prev => ({ ...prev, particulates: Number(e.target.value) }))}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px'
                  }}
                />
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => performCalculation('environmental', environmentalInputs)}
                disabled={isCalculating}
                style={{
                  padding: '10px 20px',
                  background: 'linear-gradient(135deg, #059669, #047857)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: isCalculating ? 'not-allowed' : 'pointer',
                  opacity: isCalculating ? 0.6 : 1
                }}
              >
                {isCalculating ? '⏳ Calculating...' : '🌍 Calculate Impact'}
              </button>
              
              <button
                onClick={() => getWorkSample('environmental')}
                style={{
                  padding: '10px 20px',
                  background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                📝 Get Work Sample
              </button>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  const renderResults = () => {
    if (!results) return null

    if (!results.success) {
      return (
        <div style={{
          background: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: '8px',
          padding: '16px',
          marginTop: '20px'
        }}>
          <h4 style={{ color: '#dc2626', marginBottom: '8px' }}>❌ Error</h4>
          <p style={{ color: '#7f1d1d', fontSize: '14px' }}>{results.error}</p>
        </div>
      )
    }

    if (results.calculation) {
      const calc = results.calculation
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: '#f0f9ff',
            border: '1px solid #bae6fd',
            borderRadius: '8px',
            padding: '20px',
            marginTop: '20px'
          }}
        >
          <h4 style={{ color: '#0369a1', marginBottom: '15px' }}>📊 Calculation Results</h4>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
            {Object.entries(calc).map(([key, value]) => (
              <div key={key} style={{
                background: '#ffffff',
                padding: '12px',
                borderRadius: '6px',
                border: '1px solid #e0f2fe'
              }}>
                <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>
                  {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                </div>
                <div style={{ fontSize: '16px', fontWeight: 600, color: '#0f172a' }}>
                  {String(value)}
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
            <button
              onClick={() => generateDocument(activeTab, calc)}
              style={{
                padding: '8px 16px',
                background: 'linear-gradient(135deg, #059669, #047857)',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              📄 Generate Report
            </button>
          </div>
        </motion.div>
      )
    }

    if (results.sample) {
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            padding: '20px',
            marginTop: '20px'
          }}
        >
          <h4 style={{ color: '#374151', marginBottom: '15px' }}>📝 Professional Work Sample</h4>
          <pre style={{
            background: '#1e293b',
            color: '#f1f5f9',
            padding: '16px',
            borderRadius: '6px',
            fontSize: '12px',
            lineHeight: '1.4',
            overflow: 'auto',
            whiteSpace: 'pre-wrap'
          }}>
            {results.sample}
          </pre>
        </motion.div>
      )
    }

    return null
  }

  return (
    <div style={{
      padding: '40px',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      minHeight: '100vh'
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            fontSize: '48px',
            fontWeight: 800,
            marginBottom: '20px',
            background: 'linear-gradient(45deg, #1e40af, #7c3aed)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textAlign: 'center'
          }}
        >
          🏭 Industrial Engineering Suite
        </motion.h1>
        
        <p style={{ 
          fontSize: '20px', 
          color: '#64748b', 
          marginBottom: '40px',
          textAlign: 'center'
        }}>
          Real Engineering Calculations, Formulas & Professional Documents
        </p>

        {/* Tabs */}
        <div style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '30px',
          padding: '8px',
          background: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          flexWrap: 'wrap'
        }}>
          {[
            { id: 'civil', label: '🏗️ Civil', color: '#059669' },
            { id: 'electrical', label: '⚡ Electrical', color: '#dc2626' },
            { id: 'mechanical', label: '⚙️ Mechanical', color: '#92400e' },
            { id: 'chemical', label: '🧪 Chemical', color: '#7c3aed' },
            { id: 'environmental', label: '🌍 Environmental', color: '#059669' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '12px 20px',
                background: activeTab === tab.id 
                  ? `linear-gradient(135deg, ${tab.color}, ${tab.color}dd)` 
                  : 'transparent',
                color: activeTab === tab.id ? 'white' : '#64748b',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 600,
                transition: 'all 0.2s'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Calculator */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          style={{
            background: '#ffffff',
            borderRadius: '16px',
            padding: '30px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            marginBottom: '20px'
          }}
        >
          {renderCalculator()}
        </motion.div>

        {/* Results */}
        {renderResults()}

        {/* Generated Documents */}
        {generatedDocuments.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              background: '#f0fdf4',
              border: '1px solid #bbf7d0',
              borderRadius: '8px',
              padding: '20px',
              marginTop: '20px'
            }}
          >
            <h4 style={{ color: '#166534', marginBottom: '15px' }}>📋 Generated Documents</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {generatedDocuments.map((filename, index) => (
                <span
                  key={index}
                  style={{
                    background: '#dcfce7',
                    color: '#166534',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    border: '1px solid #bbf7d0'
                  }}
                >
                  📄 {filename}
                </span>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default IndustrialWorkingSystem

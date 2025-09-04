/**
 * AGI Medical Engine Ultra - Healthcare Intelligence Dashboard
 * EuroWeb Platform - Medical AI & Healthcare Analytics
 * 
 * @author Ledjan Ahmati (100% Owner)
 * @contact dealsjona@gmail.com
 * @version 8.3.0 Ultra
 * @license MIT
 */

'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface MedicalMetrics {
  patientsSeen: number
  diagnosisAccuracy: number
  treatmentEffectiveness: number
  emergencyResponseTime: number
  medicationCompliance: number
  patientSatisfaction: number
  vitalSignsMonitored: number
  surgicalSuccessRate: number
}

interface MedicalAlert {
  id: string
  type: 'critical' | 'emergency' | 'warning' | 'info'
  priority: 'high' | 'medium' | 'low'
  department: string
  message: string
  patientId?: string
  timestamp: Date
}

interface PatientData {
  id: string
  name: string
  age: number
  condition: string
  status: 'critical' | 'stable' | 'recovering' | 'discharged'
  vitals: {
    heartRate: number
    bloodPressure: string
    temperature: number
    oxygenSaturation: number
  }
}

const AGIMedicalEngineUltra: React.FC = () => {
  const [metrics, setMetrics] = useState<MedicalMetrics>({
    patientsSeen: 1247,
    diagnosisAccuracy: 96.8,
    treatmentEffectiveness: 94.2,
    emergencyResponseTime: 3.4,
    medicationCompliance: 89.7,
    patientSatisfaction: 92.1,
    vitalSignsMonitored: 847,
    surgicalSuccessRate: 98.9
  })

  const [alerts, setAlerts] = useState<MedicalAlert[]>([
    {
      id: '1',
      type: 'critical',
      priority: 'high',
      department: 'ICU',
      message: 'Patient vital signs critical - immediate attention required',
      patientId: 'P-001',
      timestamp: new Date()
    },
    {
      id: '2',
      type: 'warning',
      priority: 'medium',
      department: 'Emergency',
      message: 'High patient volume detected',
      timestamp: new Date()
    },
    {
      id: '3',
      type: 'info',
      priority: 'low',
      department: 'Pharmacy',
      message: 'Medication inventory restocked',
      timestamp: new Date()
    }
  ])

  const [patients, setPatients] = useState<PatientData[]>([
    {
      id: 'P-001',
      name: 'Patient Alpha',
      age: 45,
      condition: 'Acute Myocardial Infarction',
      status: 'critical',
      vitals: {
        heartRate: 125,
        bloodPressure: '150/95',
        temperature: 37.8,
        oxygenSaturation: 94
      }
    },
    {
      id: 'P-002',
      name: 'Patient Beta',
      age: 62,
      condition: 'Post-operative Recovery',
      status: 'stable',
      vitals: {
        heartRate: 78,
        bloodPressure: '120/80',
        temperature: 36.5,
        oxygenSaturation: 98
      }
    },
    {
      id: 'P-003',
      name: 'Patient Gamma',
      age: 34,
      condition: 'Pneumonia Treatment',
      status: 'recovering',
      vitals: {
        heartRate: 85,
        bloodPressure: '115/75',
        temperature: 37.2,
        oxygenSaturation: 96
      }
    }
  ])

  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null)

  // Real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        patientsSeen: prev.patientsSeen + Math.floor(Math.random() * 3),
        diagnosisAccuracy: Math.max(95, Math.min(100, prev.diagnosisAccuracy + (Math.random() - 0.5) * 0.5)),
        treatmentEffectiveness: Math.max(90, Math.min(100, prev.treatmentEffectiveness + (Math.random() - 0.5) * 1)),
        emergencyResponseTime: Math.max(2, prev.emergencyResponseTime + (Math.random() - 0.5) * 0.2),
        medicationCompliance: Math.max(85, Math.min(100, prev.medicationCompliance + (Math.random() - 0.5) * 1)),
        patientSatisfaction: Math.max(88, Math.min(100, prev.patientSatisfaction + (Math.random() - 0.5) * 0.8)),
        vitalSignsMonitored: prev.vitalSignsMonitored + Math.floor(Math.random() * 5)
      }))

      // Update patient vitals
      setPatients(prev => prev.map(patient => ({
        ...patient,
        vitals: {
          ...patient.vitals,
          heartRate: Math.max(60, Math.min(150, patient.vitals.heartRate + (Math.random() - 0.5) * 10)),
          temperature: Math.max(36, Math.min(40, patient.vitals.temperature + (Math.random() - 0.5) * 0.5)),
          oxygenSaturation: Math.max(85, Math.min(100, patient.vitals.oxygenSaturation + (Math.random() - 0.5) * 2))
        }
      })))
    }, 4000)

    return () => clearInterval(interval)
  }, [])

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'critical': return '#dc2626'
      case 'emergency': return '#ef4444'
      case 'warning': return '#f59e0b'
      case 'info': return '#3b82f6'
      default: return '#6b7280'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical': return '#dc2626'
      case 'stable': return '#22c55e'
      case 'recovering': return '#f59e0b'
      case 'discharged': return '#6b7280'
      default: return '#6b7280'
    }
  }

  const getVitalStatus = (vital: string, value: number | string) => {
    switch (vital) {
      case 'heartRate':
        const hr = value as number
        return hr < 60 || hr > 100 ? 'abnormal' : 'normal'
      case 'temperature':
        const temp = value as number
        return temp < 36.1 || temp > 37.2 ? 'abnormal' : 'normal'
      case 'oxygenSaturation':
        const ox = value as number
        return ox < 95 ? 'abnormal' : 'normal'
      default:
        return 'normal'
    }
  }

  const departments = ['ICU', 'Emergency', 'Surgery', 'Cardiology', 'Pharmacy', 'Radiology']

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #7f1d1d 0%, #991b1b 25%, #dc2626 50%, #ef4444 75%, #f87171 100%)',
      color: '#fef2f2',
      padding: '24px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          background: 'rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '24px',
          textAlign: 'center'
        }}
      >
        <h1 style={{
          fontSize: '36px',
          fontWeight: 800,
          background: 'linear-gradient(45deg, #ef4444, #f87171, #fca5a5)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          color: 'transparent',
          margin: 0,
          marginBottom: '8px'
        }}>
          🏥 AGI Medical Engine Ultra
        </h1>
        <p style={{
          margin: 0,
          fontSize: '18px',
          color: '#fecaca',
          fontWeight: 500
        }}>
          Advanced Healthcare Intelligence & Medical Analytics System
        </p>
      </motion.div>

      {/* Key Medical Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        style={{
          background: 'rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '24px'
        }}
      >
        <h2 style={{
          fontSize: '24px',
          fontWeight: 700,
          color: '#fef2f2',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          📊 Medical Performance Metrics
          <span style={{
            fontSize: '14px',
            background: 'rgba(239, 68, 68, 0.2)',
            color: '#ef4444',
            padding: '4px 8px',
            borderRadius: '6px',
            fontWeight: 600
          }}>
            Live
          </span>
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '20px'
        }}>
          {Object.entries(metrics).map(([key, value], index) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              whileHover={{ scale: 1.02 }}
              style={{
                background: 'rgba(0, 0, 0, 0.3)',
                border: '1px solid rgba(239, 68, 68, 0.5)',
                borderRadius: '12px',
                padding: '20px'
              }}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '12px'
              }}>
                <span style={{
                  fontSize: '16px',
                  fontWeight: 600,
                  color: '#fef2f2',
                  textTransform: 'capitalize'
                }}>
                  {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                </span>
                <span style={{
                  fontSize: '20px',
                  color: '#ef4444',
                  fontWeight: 700
                }}>
                  {key.includes('Time') ? `${value.toFixed(1)}min` :
                   key.includes('Rate') || key.includes('Accuracy') || key.includes('Effectiveness') || 
                   key.includes('Compliance') || key.includes('Satisfaction') ? 
                   `${value.toFixed(1)}%` : value.toLocaleString()}
                </span>
              </div>

              <div style={{
                fontSize: '14px',
                color: '#fecaca',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span>
                  {key === 'patientsSeen' ? '👥' :
                   key === 'diagnosisAccuracy' ? '🔬' :
                   key === 'treatmentEffectiveness' ? '💊' :
                   key === 'emergencyResponseTime' ? '🚑' :
                   key === 'medicationCompliance' ? '💉' :
                   key === 'patientSatisfaction' ? '😊' :
                   key === 'vitalSignsMonitored' ? '📈' : '🏥'}
                </span>
                <span>
                  {key.includes('Rate') || key.includes('Accuracy') || key.includes('Effectiveness') || 
                   key.includes('Satisfaction') ? 
                   (value > 95 ? 'Excellent' : value > 90 ? 'Good' : value > 85 ? 'Fair' : 'Needs Attention') :
                   key.includes('Time') ?
                   (value < 5 ? 'Excellent Response' : value < 10 ? 'Good Response' : 'Slow Response') :
                   'Monitored'}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '24px',
        marginBottom: '24px'
      }}>
        {/* Medical Alerts */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          style={{
            background: 'rgba(0, 0, 0, 0.4)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '16px',
            padding: '24px'
          }}
        >
          <h3 style={{
            fontSize: '20px',
            fontWeight: 600,
            color: '#fef2f2',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            🚨 Medical Alerts
            {alerts.filter(a => a.type === 'critical').length > 0 && (
              <span style={{
                fontSize: '12px',
                background: 'rgba(220, 38, 38, 0.2)',
                color: '#dc2626',
                padding: '2px 6px',
                borderRadius: '4px',
                fontWeight: 600
              }}>
                {alerts.filter(a => a.type === 'critical').length} Critical
              </span>
            )}
          </h3>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            maxHeight: '400px',
            overflowY: 'auto'
          }}>
            {alerts.map((alert, index) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * index }}
                style={{
                  background: `rgba(${getAlertColor(alert.type).slice(1)}, 0.1)`,
                  border: `1px solid ${getAlertColor(alert.type)}`,
                  borderRadius: '8px',
                  padding: '16px'
                }}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '8px'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <span style={{ fontSize: '16px' }}>
                      {alert.type === 'critical' ? '🆘' :
                       alert.type === 'emergency' ? '🚑' :
                       alert.type === 'warning' ? '⚠️' : 'ℹ️'}
                    </span>
                    <span style={{
                      fontSize: '14px',
                      fontWeight: 600,
                      color: getAlertColor(alert.type),
                      textTransform: 'uppercase'
                    }}>
                      {alert.type}
                    </span>
                    <span style={{
                      fontSize: '12px',
                      background: 'rgba(0, 0, 0, 0.3)',
                      color: '#fecaca',
                      padding: '2px 6px',
                      borderRadius: '4px'
                    }}>
                      {alert.department}
                    </span>
                  </div>
                  <span style={{
                    fontSize: '12px',
                    color: '#fca5a5'
                  }}>
                    {alert.timestamp.toLocaleTimeString()}
                  </span>
                </div>
                <div style={{
                  fontSize: '14px',
                  color: '#fef2f2',
                  marginBottom: '4px'
                }}>
                  {alert.message}
                </div>
                {alert.patientId && (
                  <div style={{
                    fontSize: '12px',
                    color: '#fecaca'
                  }}>
                    👤 Patient ID: {alert.patientId}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Patient Monitoring */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          style={{
            background: 'rgba(0, 0, 0, 0.4)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '16px',
            padding: '24px'
          }}
        >
          <h3 style={{
            fontSize: '20px',
            fontWeight: 600,
            color: '#fef2f2',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            👥 Patient Monitoring
            <span style={{
              fontSize: '12px',
              background: 'rgba(239, 68, 68, 0.2)',
              color: '#ef4444',
              padding: '2px 6px',
              borderRadius: '4px',
              fontWeight: 600
            }}>
              {patients.length} Active
            </span>
          </h3>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            maxHeight: '400px',
            overflowY: 'auto'
          }}>
            {patients.map((patient, index) => (
              <motion.div
                key={patient.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                style={{
                  background: 'rgba(0, 0, 0, 0.3)',
                  border: `1px solid ${getStatusColor(patient.status)}`,
                  borderRadius: '8px',
                  padding: '16px'
                }}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '12px'
                }}>
                  <div>
                    <span style={{
                      fontSize: '16px',
                      fontWeight: 600,
                      color: '#fef2f2'
                    }}>
                      {patient.name}
                    </span>
                    <span style={{
                      fontSize: '14px',
                      color: '#fecaca',
                      marginLeft: '8px'
                    }}>
                      Age: {patient.age}
                    </span>
                  </div>
                  <span style={{
                    fontSize: '12px',
                    background: `rgba(${getStatusColor(patient.status).slice(1)}, 0.2)`,
                    color: getStatusColor(patient.status),
                    padding: '4px 8px',
                    borderRadius: '6px',
                    fontWeight: 600,
                    textTransform: 'uppercase'
                  }}>
                    {patient.status}
                  </span>
                </div>

                <div style={{
                  fontSize: '14px',
                  color: '#fecaca',
                  marginBottom: '12px'
                }}>
                  🏥 {patient.condition}
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '8px',
                  fontSize: '12px'
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    color: getVitalStatus('heartRate', patient.vitals.heartRate) === 'abnormal' ? '#fca5a5' : '#fecaca'
                  }}>
                    <span>💓 Heart Rate:</span>
                    <span>{patient.vitals.heartRate} bpm</span>
                  </div>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    color: '#fecaca'
                  }}>
                    <span>🩸 BP:</span>
                    <span>{patient.vitals.bloodPressure}</span>
                  </div>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    color: getVitalStatus('temperature', patient.vitals.temperature) === 'abnormal' ? '#fca5a5' : '#fecaca'
                  }}>
                    <span>🌡️ Temp:</span>
                    <span>{patient.vitals.temperature.toFixed(1)}°C</span>
                  </div>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    color: getVitalStatus('oxygenSaturation', patient.vitals.oxygenSaturation) === 'abnormal' ? '#fca5a5' : '#fecaca'
                  }}>
                    <span>🫁 O2 Sat:</span>
                    <span>{patient.vitals.oxygenSaturation}%</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Department Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        style={{
          background: 'rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '24px'
        }}
      >
        <h3 style={{
          fontSize: '20px',
          fontWeight: 600,
          color: '#fef2f2',
          marginBottom: '16px'
        }}>
          🏥 Department Overview
        </h3>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '16px'
        }}>
          {departments.map((dept, index) => (
            <motion.div
              key={dept}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.05 * index }}
              whileHover={{ scale: 1.05 }}
              onClick={() => setSelectedDepartment(selectedDepartment === dept ? null : dept)}
              style={{
                background: selectedDepartment === dept ? 
                  'rgba(239, 68, 68, 0.2)' : 'rgba(0, 0, 0, 0.3)',
                border: `1px solid ${selectedDepartment === dept ? '#ef4444' : 'rgba(239, 68, 68, 0.5)'}`,
                borderRadius: '8px',
                padding: '16px',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              <div style={{
                fontSize: '24px',
                marginBottom: '8px'
              }}>
                {dept === 'ICU' ? '🏥' :
                 dept === 'Emergency' ? '🚑' :
                 dept === 'Surgery' ? '🔬' :
                 dept === 'Cardiology' ? '❤️' :
                 dept === 'Pharmacy' ? '💊' : '📻'}
              </div>
              <div style={{
                fontSize: '14px',
                fontWeight: 600,
                color: '#fef2f2',
                marginBottom: '4px'
              }}>
                {dept}
              </div>
              <div style={{
                fontSize: '12px',
                color: '#fecaca'
              }}>
                {Math.floor(Math.random() * 50) + 10} Active
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        style={{
          padding: '16px',
          background: 'rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: '12px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '14px'
        }}
      >
        <div style={{ color: '#ef4444' }}>
          🏥 AGI Medical Engine - Healthcare Intelligence Active
        </div>
        <div style={{ color: '#fecaca' }}>
          📊 EuroWeb Platform v8.3.0 | Patients: {metrics.patientsSeen.toLocaleString()}
        </div>
        <div style={{ color: '#ef4444' }}>
          ⚕️ {new Date().toLocaleTimeString()} | Medical AI Mode
        </div>
      </motion.div>
    </div>
  )
}

export default AGIMedicalEngineUltra


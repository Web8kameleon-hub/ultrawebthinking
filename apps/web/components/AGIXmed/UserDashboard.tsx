/**
 * AGIXmed User Dashboard
 * Real user data display with consultation history
 * 
 * @author Ledjan Ahmati (100% Owner)
 * @contact dealsjona@gmail.com
 * @version 9.0.0 PRODUCTION
 * @license Commercial
 */

'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useUser, ConsultationRecord, UserProfile } from './UserContext'

interface UserDashboardProps {
  onStartNewConsultation: () => void
}

export const UserDashboard: React.FC<UserDashboardProps> = ({ onStartNewConsultation }) => {
  const { user, isAuthenticated, consultations, logout, updateProfile } = useUser()
  const [activeTab, setActiveTab] = useState<'profile' | 'history' | 'settings'>('history')
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState<Partial<UserProfile>>({})

  if (!isAuthenticated || !user) {
    return null
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved': return '#22c55e'
      case 'reviewed': return '#3b82f6'
      default: return '#f59e0b'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'resolved': return 'Zgjidhur'
      case 'reviewed': return 'Rishikuar'
      default: return 'Në pritje'
    }
  }

  const handleSaveProfile = async () => {
    const success = await updateProfile(editData)
    if (success) {
      setIsEditing(false)
      setEditData({})
    }
  }

  const calculateAge = (birthDate: string) => {
    const birth = new Date(birthDate)
    const today = new Date()
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--
    }
    return age
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="user-dashboard"
      style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        borderRadius: '20px',
        padding: '24px',
        color: '#f8fafc'
      }}
    >
      {/* User Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '24px',
        paddingBottom: '20px',
        borderBottom: '1px solid rgba(34, 197, 94, 0.2)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #22c55e, #10b981)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '28px',
            fontWeight: 700,
            color: '#fff'
          }}>
            {user.emri?.charAt(0)?.toUpperCase()}{user.mbiemri?.charAt(0)?.toUpperCase()}
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: '22px', fontWeight: 700, color: '#22c55e' }}>
              {user.emri} {user.mbiemri}
            </h2>
            <p style={{ margin: '4px 0 0', fontSize: '14px', color: '#94a3b8' }}>
              {user.email} • {user.datelindja ? `${calculateAge(user.datelindja)} vjeç` : 'Mosha e panjohur'}
            </p>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={onStartNewConsultation}
            style={{
              padding: '12px 20px',
              background: 'linear-gradient(135deg, #22c55e, #16a34a)',
              border: 'none',
              borderRadius: '10px',
              color: '#fff',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            + Konsultim i ri
          </button>
          <button
            onClick={logout}
            style={{
              padding: '12px 16px',
              background: 'rgba(239, 68, 68, 0.2)',
              border: '1px solid #ef4444',
              borderRadius: '10px',
              color: '#ef4444',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Dil
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div style={{
        display: 'flex',
        gap: '8px',
        marginBottom: '24px'
      }}>
        {[
          { key: 'history', label: '📋 Historiku', count: consultations.length },
          { key: 'profile', label: '👤 Profili' },
          { key: 'settings', label: '⚙️ Cilësimet' }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as typeof activeTab)}
            style={{
              padding: '10px 20px',
              background: activeTab === tab.key 
                ? 'linear-gradient(135deg, #22c55e, #16a34a)' 
                : 'rgba(45, 52, 70, 0.6)',
              border: activeTab === tab.key 
                ? 'none' 
                : '1px solid rgba(34, 197, 94, 0.3)',
              borderRadius: '8px',
              color: '#fff',
              fontWeight: 500,
              cursor: 'pointer',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            {tab.label}
            {'count' in tab && tab.count !== undefined && (
              <span style={{
                background: 'rgba(0,0,0,0.3)',
                padding: '2px 8px',
                borderRadius: '12px',
                fontSize: '12px'
              }}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'history' && (
          <motion.div
            key="history"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {consultations.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '60px 20px',
                color: '#94a3b8'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>📋</div>
                <h3 style={{ fontSize: '18px', marginBottom: '8px', color: '#f8fafc' }}>
                  Asnjë konsultim i regjistruar
                </h3>
                <p>Filloni konsultimin tuaj të parë me AGIXmed</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {consultations.map((consultation: ConsultationRecord) => (
                  <ConsultationCard key={consultation.id} consultation={consultation} />
                ))}
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'profile' && (
          <motion.div
            key="profile"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <ProfileView 
              user={user} 
              isEditing={isEditing}
              editData={editData}
              setEditData={setEditData}
              onEdit={() => setIsEditing(true)}
              onSave={handleSaveProfile}
              onCancel={() => { setIsEditing(false); setEditData({}) }}
            />
          </motion.div>
        )}

        {activeTab === 'settings' && (
          <motion.div
            key="settings"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <SettingsView user={user} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// Consultation Card Component
const ConsultationCard: React.FC<{ consultation: ConsultationRecord }> = ({ consultation }) => {
  const [expanded, setExpanded] = useState(false)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved': return '#22c55e'
      case 'reviewed': return '#3b82f6'
      default: return '#f59e0b'
    }
  }

  return (
    <motion.div
      style={{
        background: 'rgba(45, 52, 70, 0.6)',
        border: '1px solid rgba(34, 197, 94, 0.2)',
        borderRadius: '12px',
        overflow: 'hidden'
      }}
    >
      <div
        onClick={() => setExpanded(!expanded)}
        style={{
          padding: '16px 20px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            background: getStatusColor(consultation.statusi)
          }} />
          <div>
            <p style={{ margin: 0, fontSize: '15px', fontWeight: 500, color: '#f8fafc' }}>
              {consultation.simptomat.substring(0, 80)}...
            </p>
            <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#94a3b8' }}>
              {new Date(consultation.timestamp).toLocaleDateString('sq-AL', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: 500,
            background: `${getStatusColor(consultation.statusi)}20`,
            color: getStatusColor(consultation.statusi)
          }}>
            {consultation.statusi === 'resolved' ? 'Zgjidhur' :
             consultation.statusi === 'reviewed' ? 'Rishikuar' : 'Në pritje'}
          </span>
          <span style={{
            fontSize: '18px',
            transform: expanded ? 'rotate(180deg)' : 'rotate(0)',
            transition: 'transform 0.2s'
          }}>
            ▼
          </span>
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            style={{
              borderTop: '1px solid rgba(34, 197, 94, 0.2)',
              padding: '20px',
              background: 'rgba(15, 20, 25, 0.4)'
            }}
          >
            {/* Diagnoses */}
            {consultation.diagnozePropozuar.length > 0 && (
              <div style={{ marginBottom: '16px' }}>
                <h4 style={{ margin: '0 0 8px', fontSize: '14px', color: '#22c55e' }}>
                  🩺 Diagnozat e propozuara:
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {consultation.diagnozePropozuar.map((d, i) => (
                    <span key={i} style={{
                      padding: '4px 12px',
                      background: 'rgba(34, 197, 94, 0.2)',
                      border: '1px solid rgba(34, 197, 94, 0.3)',
                      borderRadius: '6px',
                      fontSize: '13px',
                      color: '#f8fafc'
                    }}>
                      {d}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Recommendations */}
            {consultation.rekomandime.length > 0 && (
              <div style={{ marginBottom: '16px' }}>
                <h4 style={{ margin: '0 0 8px', fontSize: '14px', color: '#3b82f6' }}>
                  💊 Rekomandimet:
                </h4>
                <ul style={{ margin: 0, paddingLeft: '20px', color: '#cbd5e1' }}>
                  {consultation.rekomandime.map((r, i) => (
                    <li key={i} style={{ marginBottom: '4px', fontSize: '13px' }}>{r}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Vitals */}
            {(consultation.vitals.temperatura || consultation.vitals.presioniGjakut) && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                gap: '12px'
              }}>
                {consultation.vitals.temperatura && (
                  <div style={{
                    padding: '12px',
                    background: 'rgba(45, 52, 70, 0.6)',
                    borderRadius: '8px',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '11px', color: '#94a3b8' }}>Temperatura</div>
                    <div style={{ fontSize: '18px', fontWeight: 600, color: '#f8fafc' }}>
                      {consultation.vitals.temperatura}°C
                    </div>
                  </div>
                )}
                {consultation.vitals.presioniGjakut && (
                  <div style={{
                    padding: '12px',
                    background: 'rgba(45, 52, 70, 0.6)',
                    borderRadius: '8px',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '11px', color: '#94a3b8' }}>Presioni</div>
                    <div style={{ fontSize: '18px', fontWeight: 600, color: '#f8fafc' }}>
                      {consultation.vitals.presioniGjakut}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Confidence */}
            <div style={{
              marginTop: '16px',
              padding: '12px',
              background: 'rgba(34, 197, 94, 0.1)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <span style={{ fontSize: '13px', color: '#94a3b8' }}>Besueshmëria e analizës</span>
              <span style={{ fontSize: '15px', fontWeight: 600, color: '#22c55e' }}>
                {Math.round(consultation.besueshmeria * 100)}%
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// Profile View Component
const ProfileView: React.FC<{
  user: UserProfile
  isEditing: boolean
  editData: Partial<UserProfile>
  setEditData: (data: Partial<UserProfile>) => void
  onEdit: () => void
  onSave: () => void
  onCancel: () => void
}> = ({ user, isEditing, editData, setEditData, onEdit, onSave, onCancel }) => {
  const fields = [
    { key: 'emri', label: 'Emri', value: user.emri },
    { key: 'mbiemri', label: 'Mbiemri', value: user.mbiemri },
    { key: 'email', label: 'Email', value: user.email, disabled: true },
    { key: 'telefon', label: 'Telefon', value: user.telefon || 'Pa vendosur' },
    { key: 'datelindja', label: 'Datëlindja', value: user.datelindja || 'Pa vendosur', type: 'date' },
    { key: 'gjinia', label: 'Gjinia', value: user.gjinia === 'M' ? 'Mashkull' : 'Femër' },
    { key: 'grupuGjakut', label: 'Grupi i gjakut', value: user.grupuGjakut || 'Pa vendosur' }
  ]

  return (
    <div style={{
      background: 'rgba(45, 52, 70, 0.6)',
      border: '1px solid rgba(34, 197, 94, 0.2)',
      borderRadius: '12px',
      padding: '24px'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px'
      }}>
        <h3 style={{ margin: 0, fontSize: '18px', color: '#22c55e' }}>👤 Informacioni personal</h3>
        {!isEditing ? (
          <button
            onClick={onEdit}
            style={{
              padding: '8px 16px',
              background: 'rgba(34, 197, 94, 0.2)',
              border: '1px solid #22c55e',
              borderRadius: '6px',
              color: '#22c55e',
              cursor: 'pointer',
              fontSize: '13px'
            }}
          >
            ✏️ Modifiko
          </button>
        ) : (
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={onCancel} style={{
              padding: '8px 16px',
              background: 'transparent',
              border: '1px solid #94a3b8',
              borderRadius: '6px',
              color: '#94a3b8',
              cursor: 'pointer',
              fontSize: '13px'
            }}>
              Anulo
            </button>
            <button onClick={onSave as () => void} style={{
              padding: '8px 16px',
              background: '#22c55e',
              border: 'none',
              borderRadius: '6px',
              color: '#fff',
              cursor: 'pointer',
              fontSize: '13px'
            }}>
              Ruaj
            </button>
          </div>
        )}
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '16px'
      }}>
        {fields.map((field) => (
          <div key={field.key}>
            <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '6px' }}>
              {field.label}
            </label>
            {isEditing && !field.disabled ? (
              <input
                type={field.type || 'text'}
                defaultValue={field.value}
                onChange={(e) => setEditData({ ...editData, [field.key]: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  background: 'rgba(15, 20, 25, 0.6)',
                  border: '1px solid rgba(34, 197, 94, 0.3)',
                  borderRadius: '6px',
                  color: '#f8fafc',
                  fontSize: '14px'
                }}
              />
            ) : (
              <div style={{
                padding: '10px 12px',
                background: 'rgba(15, 20, 25, 0.4)',
                borderRadius: '6px',
                color: '#f8fafc',
                fontSize: '14px'
              }}>
                {field.value}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Medical History */}
      <div style={{ marginTop: '24px' }}>
        <h4 style={{ margin: '0 0 12px', fontSize: '14px', color: '#22c55e' }}>🏥 Historiku mjekësor</h4>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {user.historikuMjekesor.length > 0 ? (
            user.historikuMjekesor.map((item, i) => (
              <span key={i} style={{
                padding: '6px 12px',
                background: 'rgba(34, 197, 94, 0.2)',
                border: '1px solid rgba(34, 197, 94, 0.3)',
                borderRadius: '20px',
                fontSize: '13px',
                color: '#f8fafc'
              }}>
                {item}
              </span>
            ))
          ) : (
            <span style={{ color: '#94a3b8', fontSize: '13px' }}>Asnjë histori e regjistruar</span>
          )}
        </div>
      </div>

      {/* Allergies */}
      <div style={{ marginTop: '16px' }}>
        <h4 style={{ margin: '0 0 12px', fontSize: '14px', color: '#ef4444' }}>⚠️ Alergji</h4>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {user.alergji.length > 0 ? (
            user.alergji.map((item, i) => (
              <span key={i} style={{
                padding: '6px 12px',
                background: 'rgba(239, 68, 68, 0.2)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '20px',
                fontSize: '13px',
                color: '#f8fafc'
              }}>
                {item}
              </span>
            ))
          ) : (
            <span style={{ color: '#94a3b8', fontSize: '13px' }}>Asnjë alergji e regjistruar</span>
          )}
        </div>
      </div>
    </div>
  )
}

// Settings View Component
const SettingsView: React.FC<{ user: UserProfile }> = ({ user }) => {
  return (
    <div style={{
      background: 'rgba(45, 52, 70, 0.6)',
      border: '1px solid rgba(34, 197, 94, 0.2)',
      borderRadius: '12px',
      padding: '24px'
    }}>
      <h3 style={{ margin: '0 0 24px', fontSize: '18px', color: '#22c55e' }}>⚙️ Cilësimet</h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '16px',
          background: 'rgba(15, 20, 25, 0.4)',
          borderRadius: '8px'
        }}>
          <div>
            <h4 style={{ margin: 0, fontSize: '15px', color: '#f8fafc' }}>🔔 Njoftime</h4>
            <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#94a3b8' }}>
              Merrni njoftime për konsultimet tuaja
            </p>
          </div>
          <input type="checkbox" defaultChecked style={{ width: '20px', height: '20px' }} />
        </div>

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '16px',
          background: 'rgba(15, 20, 25, 0.4)',
          borderRadius: '8px'
        }}>
          <div>
            <h4 style={{ margin: 0, fontSize: '15px', color: '#f8fafc' }}>📧 Email kujtues</h4>
            <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#94a3b8' }}>
              Kujtohuni për kontrollet mjekësore
            </p>
          </div>
          <input type="checkbox" style={{ width: '20px', height: '20px' }} />
        </div>

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '16px',
          background: 'rgba(15, 20, 25, 0.4)',
          borderRadius: '8px'
        }}>
          <div>
            <h4 style={{ margin: 0, fontSize: '15px', color: '#f8fafc' }}>🌍 Gjuha</h4>
            <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#94a3b8' }}>
              Zgjidhni gjuhën e preferuar
            </p>
          </div>
          <select style={{
            padding: '8px 12px',
            background: 'rgba(45, 52, 70, 1)',
            border: '1px solid rgba(34, 197, 94, 0.3)',
            borderRadius: '6px',
            color: '#f8fafc'
          }}>
            <option value="sq">Shqip</option>
            <option value="en">English</option>
            <option value="de">Deutsch</option>
          </select>
        </div>

        <div style={{
          marginTop: '16px',
          padding: '16px',
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: '8px'
        }}>
          <h4 style={{ margin: '0 0 8px', fontSize: '15px', color: '#ef4444' }}>⚠️ Zona e rrezikshme</h4>
          <p style={{ margin: '0 0 12px', fontSize: '13px', color: '#94a3b8' }}>
            Fshini llogarinë tuaj përgjithmonë
          </p>
          <button style={{
            padding: '8px 16px',
            background: 'transparent',
            border: '1px solid #ef4444',
            borderRadius: '6px',
            color: '#ef4444',
            cursor: 'pointer',
            fontSize: '13px'
          }}>
            Fshi llogarinë
          </button>
        </div>
      </div>
    </div>
  )
}

export default UserDashboard

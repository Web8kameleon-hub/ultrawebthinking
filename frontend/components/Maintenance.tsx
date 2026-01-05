"use client"

import { useEffect, useState } from "react"
import { css } from "@styled-system/css"
import { motion } from "framer-motion"
import UltraBox from "./UltraBox"

type SystemStatus = {
  status: "healthy" | "warning" | "error"
  uptime: string
  memory: string
  cpu: string
  lastCheck: string
}

type ServiceStatus = {
  agi: boolean
  mesh: boolean
  database: boolean
  api: boolean
}

export default function Maintenance() {
  const [systemStatus, setSystemStatus] = useState<SystemStatus>({
    status: "healthy",
    uptime: "0h 0m",
    memory: "0%",
    cpu: "0%",
    lastCheck: new Date().toLocaleString("sq-AL"),
  })
  
  const [services, setServices] = useState<ServiceStatus>({
    agi: true,
    mesh: true,
    database: true,
    api: true,
  })

  const [logs, setLogs] = useState<string[]>([
    "Sistema u startua me sukses",
    "AGI Core u aktivizua",
    "Mesh Network është gati",
    "API në funksion",
  ])

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      const now = new Date()
      setSystemStatus(prev => ({
        ...prev,
        lastCheck: now.toLocaleString("sq-AL"),
        memory: `${Math.floor(Math.random() * 30 + 40)}%`,
        cpu: `${Math.floor(Math.random() * 20 + 10)}%`,
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (status: "healthy" | "warning" | "error") => {
    switch (status) {
      case "healthy": return "#00ff88"
      case "warning": return "#ffaa00"
      case "error": return "#ff4444"
    }
  }

  const getStatusIcon = (active: boolean) => active ? "✅" : "❌"

  return (
    <section className={css({ maxWidth: "1200px", margin: "0 auto" })}>
      {/* System Status Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={css({ mb: "8" })}
      >
        <UltraBox 
          title="📊 Statusi i Përgjithshëm" 
          glow
          footer={`Kontrolluar më: ${systemStatus.lastCheck}`}
        >
          <div className={css({ display: "flex", gap: "6", flexWrap: "wrap" })}>
            <div>
              <strong>Status:</strong>{" "}
              <span style={{ color: getStatusColor(systemStatus.status) }}>
                {systemStatus.status.toUpperCase()}
              </span>
            </div>
            <div>
              <strong>Uptime:</strong> {systemStatus.uptime}
            </div>
            <div>
              <strong>Përdorimi i Memories:</strong> {systemStatus.memory}
            </div>
            <div>
              <strong>Përdorimi i CPU:</strong> {systemStatus.cpu}
            </div>
          </div>
        </UltraBox>
      </motion.div>

      {/* Services Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className={css({ mb: "8" })}
      >
        <UltraBox title="🔌 Shërbimet" footer="Status i shërbimeve kryesore">
          <div className={css({ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", 
            gap: "4" 
          })}>
            <div className={css({ 
              p: "4", 
              bg: "rgba(255,255,255,0.05)", 
              borderRadius: "md",
              border: "1px solid rgba(255,255,255,0.1)"
            })}>
              {getStatusIcon(services.agi)} <strong>AGI Core</strong>
              <div className={css({ fontSize: "sm", opacity: 0.7, mt: "1" })}>
                {services.agi ? "Aktiv" : "Joaktiv"}
              </div>
            </div>
            
            <div className={css({ 
              p: "4", 
              bg: "rgba(255,255,255,0.05)", 
              borderRadius: "md",
              border: "1px solid rgba(255,255,255,0.1)"
            })}>
              {getStatusIcon(services.mesh)} <strong>Mesh Network</strong>
              <div className={css({ fontSize: "sm", opacity: 0.7, mt: "1" })}>
                {services.mesh ? "Aktiv" : "Joaktiv"}
              </div>
            </div>
            
            <div className={css({ 
              p: "4", 
              bg: "rgba(255,255,255,0.05)", 
              borderRadius: "md",
              border: "1px solid rgba(255,255,255,0.1)"
            })}>
              {getStatusIcon(services.database)} <strong>Database</strong>
              <div className={css({ fontSize: "sm", opacity: 0.7, mt: "1" })}>
                {services.database ? "Aktiv" : "Joaktiv"}
              </div>
            </div>
            
            <div className={css({ 
              p: "4", 
              bg: "rgba(255,255,255,0.05)", 
              borderRadius: "md",
              border: "1px solid rgba(255,255,255,0.1)"
            })}>
              {getStatusIcon(services.api)} <strong>API Server</strong>
              <div className={css({ fontSize: "sm", opacity: 0.7, mt: "1" })}>
                {services.api ? "Aktiv" : "Joaktiv"}
              </div>
            </div>
          </div>
        </UltraBox>
      </motion.div>

      {/* System Logs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <UltraBox title="📝 Logjet e Fundit" footer="Ngjarjet e sistemit">
          <div className={css({ 
            maxHeight: "300px", 
            overflowY: "auto",
            fontFamily: "monospace",
            fontSize: "sm"
          })}>
            {logs.map((log, index) => (
              <div 
                key={index}
                className={css({ 
                  py: "2", 
                  borderBottom: "1px solid rgba(255,255,255,0.1)",
                  opacity: 1 - (index * 0.1)
                })}
              >
                [{new Date().toLocaleTimeString("sq-AL")}] {log}
              </div>
            ))}
          </div>
        </UltraBox>
      </motion.div>
    </section>
  )
}

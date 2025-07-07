"use client"

import { useEffect, useState } from "react"
import { css } from "@styled-system/css"
import { motion } from "framer-motion"
import UltraBox from "./UltraBox"

type StatusData = {
  agi: string
  memory: string
  mesh: string
  uptime: string
  tokensActive: number
  lastReboot: string
}

export default function SystemOverview() {
  const [data, setData] = useState<StatusData | null>(null)
  const [error, setError] = useState("")

  useEffect(() => {
    fetch("http://localhost:3030/api/status")
      .then(res => res.json())
      .then(setData)
      .catch(() => setError("⚠️ Nuk u morën të dhënat e sistemit"))
  }, [])

  return (
    <section
      className={css({
        minHeight: "100vh",
        bg: "#0a0c1e",
        color: "white",
        px: "6",
        py: "10",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      })}
    >
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className={css({ fontSize: "3xl", fontWeight: "bold", mb: "8" })}
      >
        🧭 System Overview – Gjendja Strategjike e Web8
      </motion.h1>

      {error && <p className={css({ color: "red.400" })}>{error}</p>}

      {data && (
        <div className={css({ display: "grid", gap: "6", width: "100%", maxWidth: "1000px" })}>
          <UltraBox title="🧠 AGI Core" glow footer={`Last reboot: ${data.lastReboot}`}>
            Gjendje: <strong>{data.agi}</strong><br />
            Kohë në funksion: <strong>{data.uptime}</strong>
          </UltraBox>

          <UltraBox title="🧬 Kujtesa" footer="Sinkronizuar çdo 10 sekonda">
            Status: <strong>{data.memory}</strong><br />
            Tokenë aktivë: <strong>{data.tokensActive}</strong>
          </UltraBox>

          <UltraBox title="📡 Mesh Inteligjent" footer="Lidhje decentralizuese">
            Rrjet: <strong>{data.mesh}</strong><br />
            Siguri: <strong>Post-Kuantike</strong>
          </UltraBox>
        </div>
      )}
    </section>
  )
}

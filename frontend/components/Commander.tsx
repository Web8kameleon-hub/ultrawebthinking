"use client"

import { useState } from "react"
import { css } from "@styled-system/css"
import { motion } from "framer-motion"

const commands = [
  { id: "deepScan", label: "🔍 Deep Scan", description: "Analizon të gjitha sinjalet dhe input-et e fundit." },
  { id: "flushMemory", label: "🧹 Fshi Kujtesën", description: "Fshin memorien e brendshme të AGI." },
  { id: "rebootAI", label: "♻️ RiNis AGI", description: "Rinovon bërthamën e mendimit dhe ciklet aktive." },
  { id: "statusReport", label: "📊 Raport Gjendjeje", description: "Gjeneron një raport të gjendjes aktuale të sistemit." },
]

export default function Commander() {
  const [log, setLog] = useState("")
  const [loading, setLoading] = useState("")

  const runCommand = async (id: string) => {
    setLoading(id)
    setLog("")

    try {
      const res = await fetch("http://localhost:3030/api/command", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ command: id }),
      })

      const data = await res.json()
      if (res.ok) {
        setLog(data.result || "✅ Komanda u ekzekutua me sukses.")
      } else {
        setLog(data.error || "❌ Komanda dështoi.")
      }
    } catch {
      setLog("❌ Nuk u arrit komunikimi me sistemin.")
    } finally {
      setLoading("")
    }
  }

  return (
    <section
      className={css({
        minHeight: "100vh",
        bg: "#0a0d1c",
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
        🧠 AGI Commander – Urdhra Qendrorë
      </motion.h1>

      <div className={css({
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
        gap: "6",
        width: "100%",
        maxWidth: "900px",
        mb: "6",
      })}>
        {commands.map((cmd) => (
          <motion.button
            key={cmd.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => runCommand(cmd.id)}
            disabled={loading === cmd.id}
            className={css({
              p: "5",
              textAlign: "left",
              borderRadius: "lg",
              bg: "#151b2c",
              border: "1px solid #2c354d",
              color: "white",
              fontSize: "sm",
              fontWeight: "medium",
              cursor: "pointer",
              boxShadow: "md",
            })}
          >
            <p className={css({ fontSize: "md", fontWeight: "bold", mb: "1" })}>{cmd.label}</p>
            <p className={css({ opacity: 0.75 })}>{cmd.description}</p>
          </motion.button>
        ))}
      </div>

      {log && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className={css({
            bg: "#101525",
            p: "5",
            borderRadius: "xl",
            maxWidth: "700px",
            fontSize: "sm",
            textAlign: "left",
            whiteSpace: "pre-wrap",
          })}
        >
          {log}
        </motion.div>
      )}
    </section>
  )
}

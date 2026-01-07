"use client"

import { useEffect, useState } from "react"
import { css } from "@styled-system/css"
import { motion } from "framer-motion"

type Step = {
  id: string
  type: string
  detail: string
  timestamp: number
}

export default function LiveNavigator() {
  const [steps, setSteps] = useState<Step[]>([])
  const [error, setError] = useState("")

  useEffect(() => {
    const interval = setInterval(() => {
      fetch("http://localhost:3030/api/trace")
        .then(res => res.json())
        .then(data => setSteps(data.steps || []))
        .catch(() => setError("⚠️ Nuk po merret rrjedha nga AGI"))
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <section
      className={css({
        minHeight: "100vh",
        bg: "#090c1b",
        color: "white",
        px: "6",
        py: "10",
      })}
    >
      <motion.h1
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className={css({ fontSize: "3xl", fontWeight: "bold", mb: "6" })}
      >
        🛰 Live Navigator – Rrjedha e Trurit AGI
      </motion.h1>

      {error && <p className={css({ color: "red.400" })}>{error}</p>}

      <div
        className={css({
          display: "flex",
          flexDirection: "column",
          gap: "4",
          maxHeight: "70vh",
          overflowY: "auto",
        })}
      >
        {steps.map((step) => (
          <motion.div
            key={step.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className={css({
              bg: "#101425",
              p: "4",
              borderRadius: "lg",
              borderLeft: "4px solid #0070f3",
              fontSize: "sm",
              boxShadow: "sm",
            })}
          >
            <p><strong>🔹 {step.type}:</strong> {step.detail}</p>
            <p className={css({ fontSize: "xs", opacity: 0.6 })}>
              ⏱ {new Date(step.timestamp).toLocaleString()}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

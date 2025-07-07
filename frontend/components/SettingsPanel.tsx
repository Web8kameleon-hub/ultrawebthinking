"use client"

import { useState } from "react"
import { css } from "@styled-system/css"
import { motion } from "framer-motion"

const initialSettings = {
  safeThink: true,
  darkMode: true,
  selfHealing: false,
  commandMode: "autonomous",
}

export default function SettingsPanel() {
  const [settings, setSettings] = useState(initialSettings)

  const toggle = (key: keyof typeof settings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const switchCommandMode = () => {
    setSettings((prev) => ({
      ...prev,
      commandMode: prev.commandMode === "autonomous" ? "manual" : "autonomous",
    }))
  }

  return (
    <section
      className={css({
        minHeight: "100vh",
        bg: "#0c0f1d",
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
        transition={{ duration: 0.8 }}
        className={css({ fontSize: "3xl", fontWeight: "bold", mb: "8" })}
      >
        ⚙️ Konfigurimi Strategjik – Web8 AGI
      </motion.h1>

      <div
        className={css({
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "6",
          width: "100%",
          maxWidth: "900px",
        })}
      >
        {Object.entries(settings).map(([key, value]) => (
          <motion.div
            key={key}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className={css({
              bg: "#151a2d",
              p: "5",
              borderRadius: "lg",
              boxShadow: "lg",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            })}
          >
            <span className={css({ textTransform: "capitalize" })}>
              {key === "safeThink"
                ? "SafeThink (Etikë e rreptë)"
                : key === "selfHealing"
                ? "Self-Healing Mode"
                : key === "darkMode"
                ? "Dark Mode UI"
                : "Command Mode"}
            </span>

            {key === "commandMode" ? (
              <button
                onClick={switchCommandMode}
                className={css({
                  px: "3",
                  py: "1",
                  fontSize: "sm",
                  bg: "#0070f3",
                  borderRadius: "lg",
                  color: "white",
                })}
              >
                {settings.commandMode === "autonomous" ? "Autonom" : "Manual"}
              </button>
            ) : (
              <input
                type="checkbox"
                checked={value as boolean}
                onChange={() => toggle(key as keyof typeof settings)}
              />
            )}
          </motion.div>
        ))}
      </div>
    </section>
  )
}

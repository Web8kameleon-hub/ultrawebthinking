"use client"

import { css } from "@styled-system/css"
import { motion } from "framer-motion"

export default function Footer() {
  const year = new Date().getFullYear()
  const date = new Date().toLocaleString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })

  return (
    <motion.footer
      initial={{ opacity: 0, y: 60 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className={css({
        width: "100%",
        bg: "#0b0c1a",
        color: "white",
        py: "5",
        px: "6",
        textAlign: "center",
        fontSize: "sm",
        mt: "auto",
        borderTop: "1px solid #222",
        boxShadow: "0 -2px 6px rgba(0,0,0,0.5)",
      })}
    >
      <p className={css({ mb: "1", fontWeight: "semibold", fontSize: "md" })}>
        🌐 WEB8 • Autonomous Intelligence Infrastructure
      </p>

      <p className={css({ mb: "1", opacity: 0.75, fontSize: "sm" })}>
        ⛓ Powered by AGI-Core v1.0 · Post-Quantum Mesh Secured · UTT Integrated
      </p>

      <p className={css({ fontSize: "xs", opacity: 0.6 })}>
        📅 {date} · © {year} Ultra Thinking Systems · All rights preserved.
      </p>
    </motion.footer>
  )
}

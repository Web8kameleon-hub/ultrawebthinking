"use client"

import { useState } from "react"
import { css } from "@styled-system/css"
import { motion } from "framer-motion"

export default function Surfing() {
  const [query, setQuery] = useState("")
  const [result, setResult] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const surf = async () => {
    if (!query.trim()) return
    setLoading(true)
    setResult("")
    setError("")

    try {
      const res = await fetch("/api/agi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: query }),
      })

      const data = await res.json()
      if (res.ok) {
        setResult(data.output)

        await fetch("/api/agi/memory", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ input: query, output: data.output }),
        })
      } else {
        setError(data.error || "❌ Kërkimi dështoi.")
      }
    } catch (err) {
      setError("❌ Nuk u realizua kërkimi.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <section
      className={css({
        minHeight: "100vh",
        bg: "#0b0c1a",
        color: "white",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        px: "6",
      })}
    >
      <motion.h1
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
        className={css({
          fontSize: "4xl",
          fontWeight: "bold",
          letterSpacing: "wide",
          mb: "4",
          textAlign: "center",
        })}
      >
        🌐 Surfing Inteligjent – WEB8
      </motion.h1>

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && surf()}
        placeholder="Kërko diçka... p.sh. 'Energji diellore në Shqipëri'"
        className={css({
          width: "100%",
          maxWidth: "600px",
          p: "3",
          fontSize: "lg",
          borderRadius: "lg",
          bg: "white",
          color: "black",
          mb: "4",
        })}
      />

      <button
        onClick={surf}
        disabled={loading}
        className={css({
          px: "6",
          py: "3",
          fontWeight: "bold",
          bg: loading ? "gray.600" : "#0070f3",
          color: "white",
          borderRadius: "xl",
          cursor: "pointer",
          mb: "6",
        })}
      >
        {loading ? "Duke eksploruar..." : "Nis Surfing"}
      </button>

      {error && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={css({ color: "red.400", mb: "4", fontSize: "sm" })}
        >
          {error}
        </motion.p>
      )}

      {result && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className={css({
            maxWidth: "700px",
            p: "5",
            bg: "#11162a",
            borderRadius: "xl",
            fontSize: "lg",
            boxShadow: "lg",
          })}
        >
          {result}
        </motion.div>
      )}
    </section>
  )
}

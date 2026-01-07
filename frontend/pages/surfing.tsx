"use client"

import { useState } from "react"
import { css } from "@styled-system/css"
import { motion } from "framer-motion"
import { SearchIcon } from "lucide-react"

export default function SurfingPage() {
  const [query, setQuery] = useState("")
  const [result, setResult] = useState("")

  const handleSearch = async () => {
    if (!query.trim()) return
    // Këtu lidhet me AGICore ose API search inteligjent
    setResult(`🔍 Duke analizuar: "${query}" përmes AGI...`)
    setTimeout(() => {
      setResult(`✅ Përgjigjja nga AGI për "${query}":\n\nKjo është një përgjigje simbolike e mençur.`)
    }, 1200)
  }

  return (
    <main
      className={css({
        minHeight: "100vh",
        bg: "#0e0f1e",
        color: "white",
        px: "6",
        py: "8",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      })}
    >
      <motion.h1
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className={css({
          fontSize: "3xl",
          fontWeight: "bold",
          mb: "4",
          textAlign: "center",
        })}
      >
        🌊 Surfing Fluid – Kërkimi i Gjashtë Ndjesor
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className={css({
          fontSize: "md",
          opacity: 0.7,
          textAlign: "center",
          maxWidth: "600px",
          mb: "8",
        })}
      >
        Jep një pyetje, një mendim ose një ide – dhe AGI do të lundrojë me ty në rrugën më të zgjuar të informacionit.
      </motion.p>

      <div
        className={css({
          display: "flex",
          alignItems: "center",
          gap: "3",
          mb: "6",
          width: "100%",
          maxWidth: "600px",
        })}
      >
        <input
          type="text"
          placeholder="Shkruaj këtu..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className={css({
            flex: "1",
            py: "3",
            px: "4",
            borderRadius: "lg",
            border: "1px solid #333",
            bg: "#12131f",
            color: "white",
            fontSize: "md",
            outline: "none",
          })}
        />
        <button
          onClick={handleSearch}
          className={css({
            bg: "#00ffe1",
            color: "#0e0f1e",
            px: "4",
            py: "3",
            borderRadius: "lg",
            fontWeight: "semibold",
            display: "flex",
            alignItems: "center",
            gap: "2",
            cursor: "pointer",
          })}
        >
          <SearchIcon size={18} />
          Kërko
        </button>
      </div>

      <motion.pre
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className={css({
          width: "100%",
          maxWidth: "700px",
          bg: "#141624",
          px: "4",
          py: "4",
          borderRadius: "xl",
          whiteSpace: "pre-wrap",
          fontSize: "sm",
          boxShadow: "0 0 12px rgba(0,255,225,0.05)",
        })}
      >
        {result || "🧠 AGI është gati për t’u përgjigjur..."}
      </motion.pre>
    </main>
  )
}

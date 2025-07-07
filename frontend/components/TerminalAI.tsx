"use client"

import { useState, useEffect, useRef } from "react"
import { css } from "@styled-system/css"
import { motion } from "framer-motion"

export default function TerminalAI() {
  const [input, setInput] = useState("")
  const [logs, setLogs] = useState<string[]>([])
  const [suggestions, setSuggestions] = useState<string[]>([])
  const wsRef = useRef<WebSocket | null>(null)
  const [currentResponse, setCurrentResponse] = useState("")

  // Load memory on first render
  useEffect(() => {
    fetch("/api/agi/memory")
      .then((res) => res.json())
      .then((data) => {
        setLogs(data.history || [])
      })
  }, [])

  // Autocomplete suggestions
  useEffect(() => {
    if (input.trim().length > 1) {
      fetch("/api/agi/suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: input }),
      })
        .then((res) => res.json())
        .then((data) => setSuggestions(data?.suggestions || []))
    } else {
      setSuggestions([])
    }
  }, [input])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    setLogs((prev) => [...prev, `> ${input}`])
    setInput("")
    setSuggestions([])
    setCurrentResponse("")

    // Connect to websocket
    wsRef.current = new WebSocket("ws://localhost:3000/api/agi/ws")
    wsRef.current.onopen = () => {
      wsRef.current?.send(JSON.stringify({ query: input }))
    }
    wsRef.current.onmessage = (event) => {
      setCurrentResponse((prev) => {
        const updated = prev + event.data
        return updated
      })
    }
    wsRef.current.onclose = () => {
      setLogs((prev) => [...prev, `AGI: ${currentResponse}`])
      fetch("/api/agi/memory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input, output: currentResponse }),
      })
    }
  }

  return (
    <div
      className={css({
        bg: "#0e0f1a",
        color: "#00fff7",
        fontFamily: "monospace",
        p: "6",
        borderRadius: "xl",
        maxWidth: "800px",
        mx: "auto",
        my: "8",
        boxShadow: "0 0 20px rgba(0,255,255,0.1)",
      })}
    >
      <h2 className={css({ fontSize: "lg", mb: "4", fontWeight: "bold", color: "white" })}>
        🧠 Terminal AGI (Live, Memory, Suggestions)
      </h2>

      <div
        className={css({
          minHeight: "200px",
          maxHeight: "400px",
          overflowY: "auto",
          mb: "4",
          whiteSpace: "pre-wrap",
          lineHeight: "1.6",
        })}
      >
        {logs.map((line, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            {line}
          </motion.div>
        ))}
        {currentResponse && <div>AGI: {currentResponse}</div>}
      </div>

      <form onSubmit={handleSubmit} autoComplete="off">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Shkruaj komandën..."
          className={css({
            width: "100%",
            px: "4",
            py: "3",
            fontSize: "md",
            bg: "#1a1c2c",
            border: "1px solid #2d2f3d",
            borderRadius: "md",
            color: "#ffffff",
            outline: "none",
            mb: suggestions.length > 0 ? "1" : "2",
          })}
        />
        <button
          type="submit"
          className={css({
            mt: "2",
            bg: "#00ffe1",
            color: "#0e0f1e",
            px: "5",
            py: "3",
            borderRadius: "lg",
            fontWeight: "bold",
            fontSize: "md",
            cursor: "pointer",
            width: "100%",
          })}
        >
          Dërgo komandën
        </button>
      </form>

      {suggestions.length > 0 && (
        <div
          className={css({
            bg: "#11131b",
            borderRadius: "md",
            p: "3",
            color: "#ccc",
            fontSize: "sm",
            boxShadow: "0 0 8px rgba(0,255,255,0.05)",
          })}
        >
          Sugjerime:
          <ul>
            {suggestions.map((sug, idx) => (
              <li key={idx} onClick={() => setInput(sug)} style={{ cursor: "pointer" }}>
                • {sug}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

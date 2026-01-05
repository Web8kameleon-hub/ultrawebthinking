"use client"

import { usePathname, useRouter } from "next/navigation"
import { css } from "@styled-system/css"
import { motion } from "framer-motion"
import { useEffect } from "react"

const routes = [
  { name: "Ballina", path: "/" },
  { name: "Surfing", path: "/surfing" },
  { name: "AGI", path: "/agi" },
  { name: "Mirëmbajtje", path: "/maintenance" },
  { name: "Memory", path: "/memory" },
  { name: "Navigator", path: "/navigator" },
  { name: "Settings", path: "/settings" },
]

export default function UltraRouter() {
  const router = useRouter()
  const currentPath = usePathname()

  useEffect(() => {
    console.log("📍 Rruga aktive:", currentPath)
  }, [currentPath])

  return (
    <nav
      className={css({
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        bg: "#0a0a15",
        px: "6",
        py: "3",
        display: "flex",
        justifyContent: "center",
        gap: "5",
        borderTop: "1px solid #222",
        zIndex: 100,
        boxShadow: "0 -2px 8px rgba(0,0,0,0.4)",
      })}
    >
      {routes.map((r) => (
        <motion.button
          key={r.path}
          onClick={() => router.push(r.path)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className={css({
            fontSize: "sm",
            px: "3",
            py: "2",
            borderRadius: "lg",
            color: currentPath === r.path ? "#6dd5fa" : "white",
            bg: currentPath === r.path ? "#1c2233" : "transparent",
            border: currentPath === r.path ? "1px solid #6dd5fa" : "1px solid transparent",
            transition: "all 0.2s ease-in-out",
          })}
        >
          {r.name}
        </motion.button>
      ))}
    </nav>
  )
}

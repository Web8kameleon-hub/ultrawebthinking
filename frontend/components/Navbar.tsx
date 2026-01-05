"use client"

import Link from "next/link"
import { css } from "@styled-system/css"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import LiveNavigator from "./LiveNavigator"

const navItems = [
  { label: "🏠 Ballina", href: "/" },
  { label: "🌿 Surfing", href: "/surfing" },
  { label: "🧠 AGI", href: "/agi" },
  { label: "🔧 Mirëmbajtje", href: "/maintenance" },
  { label: "⚙️ Rregullime", href: "/settings" },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <motion.nav
      initial={{ y: -60 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8 }}
      className={css({
        position: "sticky",
        top: 0,
        zIndex: 999,
        width: "100%",
        py: "3",
        px: "6",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        backdropFilter: "blur(12px)",
        bg: scrolled ? "rgba(236,243,239,0.85)" : "rgba(236,243,239,0.65)",
        borderBottom: scrolled ? "1px solid rgba(30,30,30,0.1)" : "none",
        boxShadow: scrolled ? "0 4px 10px rgba(0,0,0,0.05)" : "none",
        transition: "all 0.3s ease-in-out",
      })}
    >
      <motion.h1
        className={css({
          fontSize: "xl",
          fontWeight: "bold",
          color: "#314e52",
          letterSpacing: "wide",
        })}
        whileHover={{ scale: 1.04 }}
      >
        WEB8 ∿
      </motion.h1>

      <div className={css({ display: "flex", gap: "5", alignItems: "center" })}>
        {navItems.map((item) => (
          <motion.div key={item.href} whileHover={{ scale: 1.05 }}>
            <Link
              href={item.href}
              className={css({
                color: "#3a4e4f",
                fontWeight: "medium",
                fontSize: "md",
                position: "relative",
                textDecoration: "none",
                px: "2",
                transition: "all 0.3s ease",
                _hover: {
                  color: "#2a7f62",
                  borderBottom: "2px solid #9dc1b6",
                },
              })}
            >
              {item.label}
            </Link>
          </motion.div>
        ))}

        {/* Navigatori i zgjuar */}
        <div className={css({ ml: "4" })}>
          <LiveNavigator />
        </div>
      </div>
    </motion.nav>
  )
}

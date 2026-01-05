"use client"

import { css } from "@styled-system/css"
import dynamic from "next/dynamic"
import { motion } from "framer-motion"

const Navbar = dynamic(() => import("../components/Navbar"), { ssr: false })
const Maintenance = dynamic(() => import("../components/Maintenance"), { ssr: false })
const Footer = dynamic(() => import("../components/Footer"), { ssr: false })

export default function MaintenancePage() {
  return (
    <main
      className={css({
        minHeight: "100vh",
        bg: "#0b0f1c",
        color: "white",
      })}
    >
      <Navbar />

      <div className={css({ px: "6", py: "8" })}>
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className={css({ 
            fontSize: "3xl", 
            fontWeight: "bold", 
            mb: "6", 
            textAlign: "center" 
          })}
        >
          🔧 Mirëmbajtje – Statusi i Sistemit
        </motion.h1>

        <Maintenance />
      </div>

      <Footer />
    </main>
  )
}

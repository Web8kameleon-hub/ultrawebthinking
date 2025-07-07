"use client"

import { css } from "@styled-system/css"
import dynamic from "next/dynamic"
import { motion } from "framer-motion"

const TerminalAI = dynamic(() => import("../components/TerminalAI"), { ssr: false })
const MemoryGraph = dynamic(() => import("../components/MemoryGraph"), { ssr: false })
const IntroGuide = dynamic(() => import("../components/IntroGuide"), { ssr: false })

export default function AGIPage() {
  return (
    <main
      className={css({
        minHeight: "100vh",
        bg: "#0b0f1c",
        color: "white",
        px: "6",
        py: "8",
      })}
    >
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className={css({ fontSize: "3xl", fontWeight: "bold", mb: "6", textAlign: "center" })}
      >
        🤖 AGI – Inteligjenca e Pavarur e Web8
      </motion.h1>

      <IntroGuide />

      <section className={css({ my: "12" })}>
        <TerminalAI />
      </section>

      <section className={css({ my: "12" })}>
        <MemoryGraph />
      </section>
    </main>
  )
}

"use client"

import { motion } from "framer-motion"
import { css } from "@styled-system/css"
import Link from "next/link"

export default function NotFoundPage() {
  return (
    <main
      className={css({
        minHeight: "100vh",
        bg: "#0b0c1c",
        color: "white",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        px: "6",
        textAlign: "center",
      })}
    >
      <motion.h1
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className={css({
          fontSize: "7xl",
          fontWeight: "bold",
          color: "#0070f3",
          mb: "4",
        })}
      >
        404
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className={css({
          fontSize: "xl",
          fontWeight: "medium",
          mb: "6",
          opacity: 0.85,
        })}
      >
        Kjo rrugë nuk ekziston në mendjen e Web8.
      </motion.p>

      <Link href="/">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={css({
            px: "6",
            py: "3",
            fontSize: "md",
            fontWeight: "bold",
            bg: "#0070f3",
            color: "white",
            borderRadius: "xl",
            cursor: "pointer",
          })}
        >
          🏠 Kthehu në Ballinë
        </motion.button>
      </Link>
    </main>
  )
}

"use client"

import { ReactNode } from "react"
import { css } from "@styled-system/css"
import { motion } from "framer-motion"

type UltraBoxProps = {
  title?: string
  icon?: string
  children: ReactNode
  footer?: string
  glow?: boolean
}

export default function UltraBox({
  title,
  icon,
  children,
  footer,
  glow = false,
}: UltraBoxProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={css({
        bg: "#11162a",
        p: "6",
        borderRadius: "2xl",
        boxShadow: glow
          ? "0 0 18px rgba(0, 112, 243, 0.3)"
          : "0 2px 8px rgba(0,0,0,0.3)",
        border: "1px solid #2d3748",
        color: "white",
        maxWidth: "800px",
        width: "100%",
        mb: "6",
      })}
    >
      {title && (
        <div className={css({ mb: "4", fontSize: "xl", fontWeight: "bold", display: "flex", alignItems: "center", gap: "2" })}>
          {icon && <span>{icon}</span>}
          {title}
        </div>
      )}

      <div className={css({ fontSize: "sm", lineHeight: "1.6" })}>{children}</div>

      {footer && (
        <div className={css({ mt: "4", fontSize: "xs", opacity: 0.6, borderTop: "1px solid #2d2d2d", pt: "2" })}>
          {footer}
        </div>
      )}
    </motion.div>
  )
}

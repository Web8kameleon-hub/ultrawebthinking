"use client"

import { css } from "@styled-system/css"
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"

export default function Hero() {
  const [currentText, setCurrentText] = useState(0)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const { scrollY } = useScroll()

  const y = useTransform(scrollY, [0, 300], [0, -50])
  const opacity = useTransform(scrollY, [0, 300], [1, 0])

  const heroTexts = [
    "Web8. Fuqia e inteligjencës globale fillon këtu.",
    "AGI që mendon, adaptohet dhe evoluon.",
    "E ardhmja e internetit është këtu, tani.",
    "Teknologji post-kuantike për një botë të re.",
  ]

  const subtitleTexts = [
    "Një platformë autonome, e sigurt dhe e pavarur për kërkim, vendimmarrje dhe ndërveprim AGI.",
    "Inteligjencë artificiale e shpërndarë në 12 shtresa funksionale.",
    "Mesh networking me mbrojtje DDoS dhe siguri post-kuantike.",
    "Sistema që rinovohet vetë dhe adaptohet me çdo përdorim.",
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentText((prev) => (prev + 1) % heroTexts.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  return (
    <motion.section
      style={{ y, opacity }}
      className={css({
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        px: "6",
        position: "relative",
        overflow: "hidden",
        bgGradient: "to-br",
        gradientFrom: "#0f0f1a",
        gradientVia: "#1a1a2e",
        gradientTo: "#16213e",
        color: "white",
        gap: "8",
      })}
    >
      {/* Dynamic Background Particles */}
      <div
        className={css({
          position: "absolute",
          inset: 0,
          zIndex: 0,
        })}
      >
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className={css({
              position: "absolute",
              width: "2px",
              height: "2px",
              bg: "blue.400",
              borderRadius: "full",
              opacity: 0.3,
            })}
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              x: mousePosition.x + (Math.random() - 0.5) * 100,
              y: mousePosition.y + (Math.random() - 0.5) * 100,
            }}
            transition={{
              duration: 2,
              ease: "easeOut",
              delay: i * 0.02,
            }}
          />
        ))}
      </div>

      {/* Animated Grid Background */}
      <motion.div
        className={css({
          position: "absolute",
          inset: 0,
          backgroundImage: `linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)`,
          backgroundSize: "50px 50px",
          zIndex: 0,
        })}
        animate={{
          backgroundPosition: [`0px 0px`, `50px 50px`],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      <div className={css({ position: "relative", zIndex: 10 })}>
        {/* Dynamic Title */}
        <AnimatePresence mode="wait">
          <motion.h1
            key={currentText}
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 1.2 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className={css({
              fontSize: { base: "3xl", md: "5xl", lg: "6xl" },
              fontWeight: "extrabold",
              letterSpacing: "wide",
              maxW: "4xl",
              bgGradient: "to-r",
              gradientFrom: "blue.400",
              gradientTo: "purple.500",
              bgClip: "text",
              color: "transparent",
              mb: "6",
            })}
          >
            {heroTexts[currentText]}
          </motion.h1>
        </AnimatePresence>

        {/* Dynamic Subtitle */}
        <AnimatePresence mode="wait">
          <motion.p
            key={currentText}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className={css({
              fontSize: { base: "lg", md: "xl" },
              maxW: "3xl",
              color: "gray.300",
              mb: "8",
              lineHeight: "relaxed",
            })}
          >
            {subtitleTexts[currentText]}
          </motion.p>
        </AnimatePresence>

        {/* Interactive Buttons */}
        <div
          className={css({
            display: "flex",
            gap: "4",
            flexWrap: "wrap",
            justifyContent: "center",
          })}
        >
          <motion.button
            whileHover={{
              scale: 1.05,
              boxShadow: "0 10px 25px rgba(59, 130, 246, 0.3)",
              y: -2,
            }}
            whileTap={{ scale: 0.95 }}
            className={css({
              px: "8",
              py: "4",
              fontSize: "lg",
              fontWeight: "semibold",
              borderRadius: "2xl",
              bg: "blue.600",
              color: "white",
              border: "2px solid transparent",
              bgGradient: "to-r",
              gradientFrom: "blue.600",
              gradientTo: "purple.600",
              transition: "all 0.3s ease",
              _hover: {
                transform: "translateY(-2px)",
              },
            })}
            onClick={() => window.scrollTo({ top: 800, behavior: "smooth" })}
          >
            🚀 Nis Eksplorimin
          </motion.button>

          <motion.button
            whileHover={{
              scale: 1.05,
              borderColor: "blue.400",
              color: "blue.400",
            }}
            whileTap={{ scale: 0.95 }}
            className={css({
              px: "8",
              py: "4",
              fontSize: "lg",
              fontWeight: "semibold",
              borderRadius: "2xl",
              bg: "transparent",
              color: "white",
              border: "2px solid",
              borderColor: "gray.600",
              transition: "all 0.3s ease",
            })}
          >
            📖 Lexo Dokumentacionin
          </motion.button>
        </div>

        {/* Status Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className={css({
            mt: "12",
            display: "flex",
            gap: "6",
            flexWrap: "wrap",
            justifyContent: "center",
            fontSize: "sm",
          })}
        >
          {/*
            { label: "AGI Status", status: "🟢 Online", color: "green.400" },
            { label: "Mesh Network", status: "🔵 Active", color: "blue.400" },
            { label: "Security", status: "🟡 Protected", color: "yellow.400" },
          */}
          {["AGI Status", "Mesh Network", "Security"].map((label, i) => (
            <motion.div
              key={label}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
              className={css({
                display: "flex",
                alignItems: "center",
                gap: "2",
                px: "3",
                py: "2",
                bg: "rgba(0,0,0,0.3)",
                borderRadius: "lg",
                border: "1px solid",
                borderColor: "gray.700",
              })}
            >
              <span
                className={css({
                  color:
                    label === "AGI Status"
                      ? "green.400"
                      : label === "Mesh Network"
                      ? "blue.400"
                      : "yellow.400",
                  fontWeight: "medium",
                })}
              >
                {label === "AGI Status"
                  ? "🟢 Online"
                  : label === "Mesh Network"
                  ? "🔵 Active"
                  : "🟡 Protected"}
              </span>
              <span className={css({ color: "gray.400" })}>{label}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className={css({
          position: "absolute",
          bottom: "8",
          left: "50%",
          transform: "translateX(-50%)",
          color: "gray.400",
          fontSize: "sm",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "2",
        })}
      >
        <span>Scroll për të eksploruar</span>
        <div className={css({ fontSize: "xl" })}>↓</div>
      </motion.div>
    </motion.section>
  )
}

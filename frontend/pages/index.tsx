"use client"

// Vendoseni këtë në fillim të file-it kryesor të aplikacionit tuaj
const events = require('events');
events.EventEmitter.defaultMaxListeners = 20; // ose një numër më të madh sipas nevojës

// Nëse keni një EventEmitter të veçantë:
const emitter = new events.EventEmitter();
emitter.setMaxListeners(20); // ose një numër më të madh sipas nevojës

import { css } from "@styled-system/css"
import { motion } from "framer-motion"
import dynamic from "next/dynamic"

const Navbar = dynamic(() => import("../components/Navbar"), { ssr: false })
const Hero = dynamic(() => import("../components/Hero"), { ssr: false })
const Footer = dynamic(() => import("../components/Footer"), { ssr: false })

export default function HomePage() {
  return (
    <main
      className={css({
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        bg: "#0b0c1a",
        color: "white",
      })}
    >
      <Navbar />

      <section
        className={css({
          flex: "1",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          textAlign: "center",
          px: "6",
          py: "12",
        })}
      >
        <motion.h1
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className={css({
            fontSize: "4xl",
            fontWeight: "extrabold",
            mb: "4",
            letterSpacing: "wide",
          })}
        >
          🌐 Ultra Thinking Web8
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1 }}
          className={css({
            fontSize: "lg",
            maxWidth: "700px",
            opacity: 0.8,
            mb: "6",
          })}
        >
          Një platformë e pavarur mendimi, eksplorimi dhe veprimi. Web8 është më shumë se një shfletues – është një mendje inteligjente që lundron me ju.
        </motion.p>

        <motion.a
          href="/agi"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={css({
            display: "inline-block",
            bg: "#00ffe1",
            color: "#0b0c1a",
            fontWeight: "bold",
            px: "6",
            py: "3",
            borderRadius: "lg",
            fontSize: "md",
            transition: "all 0.3s ease-in-out",
            boxShadow: "0 0 10px rgba(0,255,225,0.4)",
          })}
        >
          Hyr në AGI
        </motion.a>
      </section>

      <Footer />
    </main>
  )
}

"use client"

import { useState } from "react"
import { css } from "@styled-system/css"
import { motion, AnimatePresence } from "framer-motion"

const steps = [
  {
    title: "🌐 Çfarë është Web8?",
    content:
      "Web8 është një platformë inteligjente, e decentralizuar, që përdor AGI për të ndihmuar përdoruesit të lundrojnë, mendojnë dhe vendosin në mënyrë të pavarur.",
  },
  {
    title: "🧠 Roli i AGI-së",
    content:
      "AGI në Web8 funksionon si një mendje analitike që kupton, mban mend dhe optimizon ndërveprimin tënd. Ajo nuk komandon – por bashkëvendos.",
  },
  {
    title: "📡 Rrjeti Mesh & Siguria",
    content:
      "Web8 nuk varet nga serverë qendrorë. Ai operon në nyje Mesh, me enkriptim post-kuantik dhe mbrojtje ndaj çdo manipulimi të jashtëm.",
  },
  {
    title: "💠 UTT Token",
    content:
      "Ultra Thinking Token (UTT) është monedha e brendshme për vlera, votim, pagesa dhe incentivë. Një ekonomi që punon me etikë dhe efikasitet.",
  },
  {
    title: "🚀 Fillimi",
    content:
      "Je gati të përdorësh Surfing Inteligjent, të konsultohesh me AGI dhe të eksplorosh Web8 si një univers të ri? Le të fillojmë.",
  },
]

export default function IntroGuide() {
  const [step, setStep] = useState(0)

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1)
    }
  }

  return (
    <section
      className={css({
        maxWidth: "800px",
        mx: "auto",
        my: "10",
        px: "6",
        py: "8",
        bg: "#101424",
        borderRadius: "2xl",
        boxShadow: "0 0 20px rgba(0,0,0,0.4)",
        color: "white",
        textAlign: "center",
      })}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.4 }}
        >
          <h2 className={css({ fontSize: "2xl", fontWeight: "bold", mb: "4" })}>
            {steps[step].title}
          </h2>
          <p className={css({ fontSize: "md", opacity: 0.85, mb: "6" })}>
            {steps[step].content}
          </p>

          {step < steps.length - 1 ? (
            <button
              onClick={handleNext}
              className={css({
                bg: "#0070f3",
                color: "white",
                px: "6",
                py: "3",
                borderRadius: "xl",
                fontWeight: "semibold",
                cursor: "pointer",
              })}
            >
              ⏭️ Vazhdo
            </button>
          ) : (
            <p className={css({ fontStyle: "italic", opacity: 0.7 })}>
              🎉 Udhëzuesi përfundoi. Tani je pjesë e Web8.
            </p>
          )}
        </motion.div>
      </AnimatePresence>
    </section>
  )
}

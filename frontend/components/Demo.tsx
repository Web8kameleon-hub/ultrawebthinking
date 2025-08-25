'use client'

import { motion } from 'framer-motion'
import React from 'react'
import '../../styles/demo.css'; // për Vanilla CSS

export function Demo(): React.ReactElement {
  return (
    React.createElement(
      motion.div,
      {
        initial: { opacity: 0, y: 50 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: 50 }
      },
      React.createElement('h1', null, 'Demo Component')
    )
  )
}

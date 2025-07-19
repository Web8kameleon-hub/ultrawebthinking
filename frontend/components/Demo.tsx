'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { css } from '../../styled-system/css' // për Panda CSS
import '../../styles/demo.css' // për Vanilla CSS

export function Demo(): React.ReactElement {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50

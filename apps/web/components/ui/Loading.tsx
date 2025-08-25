/**
 * Loading Component - Advanced Loading System
 * Multiple loading animations and states
 * 
 * @author Ledjan Ahmati (100% Owner)
 * @contact dealsjona@gmail.com
 * @version 2.0.0 Dynamic
 * @license MIT
 */

'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { cva, type VariantProps } from 'class-variance-authority'

const loadingVariants = cva(
  'flex items-center justify-center',
  {
    variants: {
      size: {
        sm: 'w-4 h-4',
        md: 'w-8 h-8',
        lg: 'w-12 h-12',
        xl: 'w-16 h-16'
      },
      variant: {
        spinner: '',
        dots: '',
        pulse: '',
        bars: '',
        ripple: ''
      },
      theme: {
        light: 'text-gray-600',
        dark: 'text-white',
        primary: 'text-blue-500',
        success: 'text-green-500',
        warning: 'text-yellow-500',
        error: 'text-red-500'
      }
    },
    defaultVariants: {
      size: 'md',
      variant: 'spinner',
      theme: 'dark'
    }
  }
)

interface LoadingProps extends VariantProps<typeof loadingVariants> {
  text?: string
  overlay?: boolean
  className?: string
}

export function Loading({
  size,
  variant,
  theme,
  text,
  overlay = false,
  className = ''
}: LoadingProps) {
  const renderSpinner = () => (
    <motion.div
      className={`border-2 border-current border-t-transparent rounded-full ${loadingVariants({ size })}`}
      animate={{ rotate: 360 }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: 'linear'
      }}
    />
  )

  const renderDots = () => (
    <div className="flex space-x-1">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-2 h-2 bg-current rounded-full"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: i * 0.2
          }}
        />
      ))}
    </div>
  )

  const renderPulse = () => (
    <motion.div
      className={`bg-current rounded-full ${loadingVariants({ size })}`}
      animate={{
        scale: [1, 1.2, 1],
        opacity: [0.5, 1, 0.5]
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity
      }}
    />
  )

  const renderBars = () => (
    <div className="flex space-x-1">
      {[0, 1, 2, 3].map((i) => (
        <motion.div
          key={i}
          className="w-1 bg-current rounded-full"
          style={{ height: size === 'sm' ? '16px' : size === 'lg' ? '32px' : '24px' }}
          animate={{
            scaleY: [1, 2, 1]
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: i * 0.1
          }}
        />
      ))}
    </div>
  )

  const renderRipple = () => (
    <div className="relative">
      {[0, 1].map((i) => (
        <motion.div
          key={i}
          className={`absolute border-2 border-current rounded-full ${loadingVariants({ size })}`}
          animate={{
            scale: [0, 1],
            opacity: [1, 0]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 1
          }}
        />
      ))}
    </div>
  )

  const renderAnimation = () => {
    switch (variant) {
      case 'dots':
        return renderDots()
      case 'pulse':
        return renderPulse()
      case 'bars':
        return renderBars()
      case 'ripple':
        return renderRipple()
      default:
        return renderSpinner()
    }
  }

  const content = (
    <div className={`${loadingVariants({ theme })} ${className}`}>
      <div className="flex flex-col items-center space-y-4">
        {renderAnimation()}
        {text && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm text-center"
          >
            {text}
          </motion.p>
        )}
      </div>
    </div>
  )

  if (overlay) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center"
      >
        {content}
      </motion.div>
    )
  }

  return content
}

export default Loading

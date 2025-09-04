/**
 * Motion Components - Framer Motion + CVA Integration
 * Vanilla + Motion + CVA + Panda Tokens
 * © Web8 UltraThinking – Ledjan Ahmati
 */

'use client'

import { motion } from 'framer-motion'
import { forwardRef } from 'react'
import {
    buttonVariants,
    cardVariants,
    cn,
    gridVariants,
    statusVariants,
    textVariants,
    type ButtonVariants,
    type CardVariants,
    type GridVariants,
    type StatusVariants,
    type TextVariants
} from './variants'

// Animation presets
export const animationPresets = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.2 }
  },
  
  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.3 }
  },
  
  scaleIn: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
    transition: { duration: 0.2 }
  },
  
  staggerChildren: {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  }
}

// Motion Button
interface MotionButtonProps extends ButtonVariants {
  children: React.ReactNode
  className?: string
  onClick?: () => void
  disabled?: boolean
  whileHover?: object
  whileTap?: object
}

export const MotionButton = forwardRef<HTMLButtonElement, MotionButtonProps>(
  ({ variant, size, fullWidth, className, children, whileHover, whileTap, ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        className={cn(buttonVariants({ variant, size, fullWidth }), className)}
        whileHover={{ scale: 1.02, ...whileHover }}
        whileTap={{ scale: 0.98, ...whileTap }}
        transition={{ duration: 0.1 }}
        {...props}
      >
        {children}
      </motion.button>
    )
  }
)
MotionButton.displayName = 'MotionButton'

// Motion Card
interface MotionCardProps extends CardVariants {
  children: React.ReactNode
  className?: string
  hover?: boolean
  animation?: keyof typeof animationPresets
}

export const MotionCard = forwardRef<HTMLDivElement, MotionCardProps>(
  ({ variant, padding, className, children, hover = true, animation = 'fadeIn', ...props }, ref) => {
    const hoverAnimation = hover ? {
      whileHover: { y: -4, boxShadow: '0 10px 25px rgba(0,0,0,0.1)' },
      transition: { duration: 0.2 }
    } : {}

    return (
      <motion.div
        ref={ref}
        className={cn(cardVariants({ variant, padding }), className)}
        {...animationPresets[animation]}
        {...hoverAnimation}
        {...props}
      >
        {children}
      </motion.div>
    )
  }
)
MotionCard.displayName = 'MotionCard'

// Motion Status Indicator
interface MotionStatusProps extends StatusVariants {
  className?: string
  pulse?: boolean
}

export const MotionStatus = forwardRef<HTMLDivElement, MotionStatusProps>(
  ({ status, size, className, pulse = false, ...props }, ref) => {
    const pulseAnimation = pulse ? {
      animate: { scale: [1, 1.2, 1] },
      transition: { duration: 1, repeat: Infinity }
    } : {}

    return (
      <motion.div
        ref={ref}
        className={cn(statusVariants({ status, size }), className)}
        {...animationPresets.scaleIn}
        {...pulseAnimation}
        {...props}
      />
    )
  }
)
MotionStatus.displayName = 'MotionStatus'

// Motion Grid
interface MotionGridProps extends GridVariants {
  children: React.ReactNode
  className?: string
  stagger?: boolean
}

export const MotionGrid = forwardRef<HTMLDivElement, MotionGridProps>(
  ({ cols, gap, className, children, stagger = true, ...props }, ref) => {
    const staggerAnimation = stagger ? animationPresets.staggerChildren : {}

    return (
      <motion.div
        ref={ref}
        className={cn(gridVariants({ cols, gap }), className)}
        {...animationPresets.fadeIn}
        {...staggerAnimation}
        {...props}
      >
        {children}
      </motion.div>
    )
  }
)
MotionGrid.displayName = 'MotionGrid'

// Motion Text
interface MotionTextProps extends TextVariants {
  children: React.ReactNode
  className?: string
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span'
  animation?: keyof typeof animationPresets
}

export const MotionText = forwardRef<HTMLElement, MotionTextProps>(
  ({ variant, color, align, className, children, as = 'p', animation = 'fadeIn', ...props }, ref) => {
    const Component = motion[as] as any

    return (
      <Component
        ref={ref}
        className={cn(textVariants({ variant, color, align }), className)}
        {...animationPresets[animation]}
        {...props}
      >
        {children}
      </Component>
    )
  }
)
MotionText.displayName = 'MotionText'

// Container wrapper with animation
interface MotionContainerProps {
  children: React.ReactNode
  className?: string
  animation?: keyof typeof animationPresets
}

export const MotionContainer = forwardRef<HTMLDivElement, MotionContainerProps>(
  ({ children, className, animation = 'fadeIn', ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        className={cn('container mx-auto px-4', className)}
        {...animationPresets[animation]}
        {...props}
      >
        {children}
      </motion.div>
    )
  }
)
MotionContainer.displayName = 'MotionContainer'

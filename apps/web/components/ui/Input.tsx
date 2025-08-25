/**
 * Input Component - Advanced Input System
 * Full-featured input with validation and animations
 * 
 * @author Ledjan Ahmati (100% Owner)
 * @contact dealsjona@gmail.com
 * @version 2.0.0 Dynamic
 * @license MIT
 */

'use client'

import React, { forwardRef, useState } from 'react'
import { motion } from 'framer-motion'
import { cva, type VariantProps } from 'class-variance-authority'

const inputVariants = cva(
  'w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200',
  {
    variants: {
      variant: {
        default: 'border-gray-300 focus:ring-blue-500 focus:border-blue-500',
        success: 'border-green-500 focus:ring-green-500 focus:border-green-500',
        error: 'border-red-500 focus:ring-red-500 focus:border-red-500',
        warning: 'border-yellow-500 focus:ring-yellow-500 focus:border-yellow-500'
      },
      size: {
        sm: 'px-2 py-1 text-sm',
        md: 'px-3 py-2',
        lg: 'px-4 py-3 text-lg'
      },
      theme: {
        light: 'bg-white text-gray-900',
        dark: 'bg-gray-800 text-white border-gray-600',
        glass: 'bg-white/10 backdrop-blur-sm text-white border-white/20'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
      theme: 'dark'
    }
  }
)

interface InputProps extends 
  Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
  VariantProps<typeof inputVariants> {
  label?: string
  error?: string
  success?: string
  warning?: string
  helperText?: string
  icon?: React.ReactNode
  rightIcon?: React.ReactNode
  isLoading?: boolean
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  className,
  variant,
  size,
  theme,
  label,
  error,
  success,
  warning,
  helperText,
  icon,
  rightIcon,
  isLoading,
  ...props
}, ref) => {
  const [isFocused, setIsFocused] = useState(false)

  // Determine variant based on status
  const getVariant = () => {
    if (error) {return 'error'}
    if (success) {return 'success'}
    if (warning) {return 'warning'}
    return variant
  }

  const getMessage = () => {
    if (error) {return error}
    if (success) {return success}
    if (warning) {return warning}
    return helperText
  }

  const getMessageColor = () => {
    if (error) {return 'text-red-500'}
    if (success) {return 'text-green-500'}
    if (warning) {return 'text-yellow-500'}
    return 'text-gray-500'
  }

  return (
    <div className="w-full">
      {label && (
        <motion.label
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="block text-sm font-medium mb-2 text-gray-300"
        >
          {label}
        </motion.label>
      )}
      
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        
        <input
          ref={ref}
          className={inputVariants({
            variant: getVariant(),
            size,
            theme,
            className: `${icon ? 'pl-10' : ''} ${rightIcon ?? isLoading ? 'pr-10' : ''} ${className}`
          })}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
        
        {(rightIcon ?? isLoading) && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {isLoading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
              />
            ) : (
              rightIcon
            )}
          </div>
        )}
      </div>
      
      {getMessage() && (
        <motion.p
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className={`mt-2 text-sm ${getMessageColor()}`}
        >
          {getMessage()}
        </motion.p>
      )}
    </div>
  )
})

Input.displayName = 'Input'

export default Input

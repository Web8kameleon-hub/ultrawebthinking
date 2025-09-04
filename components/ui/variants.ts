/**
 * UI Component Variants - CVA + Panda Tokens
 * Arkitektura e re: Vanilla + Motion + CVA + Panda
 * © Web8 UltraThinking – Ledjan Ahmati
 */

import { cva, type VariantProps } from 'class-variance-authority'
import { clsx } from 'clsx'

// Button Variants
export const buttonVariants = cva(
  // Base classes
  'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
        secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500',
        success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
        danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
        ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-500',
        outline: 'border-2 border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500'
      },
      size: {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-base',
        lg: 'px-6 py-3 text-lg',
        xl: 'px-8 py-4 text-xl'
      },
      fullWidth: {
        true: 'w-full'
      }
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md'
    }
  }
)

// Card Variants
export const cardVariants = cva(
  'rounded-lg border border-gray-200 transition-all duration-200',
  {
    variants: {
      variant: {
        default: 'bg-white shadow-sm',
        elevated: 'bg-white shadow-md hover:shadow-lg',
        bordered: 'bg-white border-2',
        ghost: 'bg-transparent border-transparent'
      },
      padding: {
        none: 'p-0',
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8'
      }
    },
    defaultVariants: {
      variant: 'default',
      padding: 'md'
    }
  }
)

// Status Indicator Variants
export const statusVariants = cva(
  'inline-flex items-center justify-center rounded-full transition-all duration-300',
  {
    variants: {
      status: {
        active: 'bg-green-500',
        inactive: 'bg-gray-300',
        loading: 'bg-yellow-500 animate-pulse',
        error: 'bg-red-500'
      },
      size: {
        sm: 'w-3 h-3',
        md: 'w-5 h-5',
        lg: 'w-8 h-8'
      }
    },
    defaultVariants: {
      status: 'inactive',
      size: 'md'
    }
  }
)

// Grid Variants
export const gridVariants = cva(
  'grid gap-6',
  {
    variants: {
      cols: {
        1: 'grid-cols-1',
        2: 'grid-cols-1 md:grid-cols-2',
        3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
        4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
        5: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5'
      },
      gap: {
        sm: 'gap-3',
        md: 'gap-6',
        lg: 'gap-8'
      }
    },
    defaultVariants: {
      cols: 3,
      gap: 'md'
    }
  }
)

// Text Variants
export const textVariants = cva(
  'text-gray-900',
  {
    variants: {
      variant: {
        h1: 'text-4xl font-bold',
        h2: 'text-3xl font-bold',
        h3: 'text-2xl font-semibold',
        h4: 'text-xl font-semibold',
        body: 'text-base',
        small: 'text-sm',
        xs: 'text-xs'
      },
      color: {
        default: 'text-gray-900',
        muted: 'text-gray-600',
        primary: 'text-blue-600',
        success: 'text-green-600',
        danger: 'text-red-600'
      },
      align: {
        left: 'text-left',
        center: 'text-center',
        right: 'text-right'
      }
    },
    defaultVariants: {
      variant: 'body',
      color: 'default',
      align: 'left'
    }
  }
)

// Export types
export type ButtonVariants = VariantProps<typeof buttonVariants>
export type CardVariants = VariantProps<typeof cardVariants>
export type StatusVariants = VariantProps<typeof statusVariants>
export type GridVariants = VariantProps<typeof gridVariants>
export type TextVariants = VariantProps<typeof textVariants>

// Utility function for combining classes
export const cn = clsx

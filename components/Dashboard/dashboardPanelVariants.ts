import { cva } from 'class-variance-authority'

export const dashboardVariants = cva('', {
  variants: {
    variant: {
      default: '',
    }
  },
  defaultVariants: {
    variant: 'default',
  }
})

export const metricCardVariants = cva('', {
  variants: {
    type: {
      agi: '',
      memory: '',
      cpu: '',
      network: '',
    }
  },
  defaultVariants: {
    type: 'agi',
  }
})

export const statusIndicatorVariants = cva('', {
  variants: {
    status: {
      good: '',
      warning: '',
      critical: '',
    }
  },
  defaultVariants: {
    status: 'good',
  }
})

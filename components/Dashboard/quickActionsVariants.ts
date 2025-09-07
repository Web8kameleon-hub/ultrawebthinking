import { cva } from 'class-variance-authority'

export const quickActionsVariants = cva('', {
  variants: {
    variant: {
      default: '',
    }
  },
  defaultVariants: {
    variant: 'default',
  }
})

export const actionButtonVariants = cva('', {
  variants: {
    variant: {
      primary: '',
      success: '',
      warning: '',
      danger: '',
      default: '',
    },
    processing: {
      true: '',
      false: '',
    }
  },
  defaultVariants: {
    variant: 'default',
    processing: false,
  }
})

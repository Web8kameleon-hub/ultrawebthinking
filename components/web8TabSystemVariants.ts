import { cva } from 'class-variance-authority'

/**
 * Web8 Tab System CVA Variants
 * Industrial Grade Component Variants
 */

// Container variants
export const containerVariants = cva('container')

// Header variants
export const headerVariants = cva('header')

export const logoVariants = cva('logo')

export const navVariants = cva('nav')

export const navButtonVariants = cva(
  'navButton',
  {
    variants: {
      variant: {
        default: '',
        active: 'navButtonActive'
      }
    },
    defaultVariants: {
      variant: 'default'
    }
  }
)

export const statusIndicatorVariants = cva('statusIndicator')

// Tab variants
export const tabBarVariants = cva('tabBar')

export const tabVariants = cva(
  'tab',
  {
    variants: {
      state: {
        default: '',
        active: 'tabActive'
      },
      loading: {
        true: '',
        false: ''
      }
    },
    defaultVariants: {
      state: 'default',
      loading: false
    }
  }
)

export const tabSpinnerVariants = cva('tabSpinner')

export const tabTitleVariants = cva('tabTitle')

export const tabCloseVariants = cva('tabClose')

export const newTabButtonVariants = cva('newTabButton')

// Address bar variants
export const addressBarVariants = cva('addressBar')

export const addressControlsVariants = cva('addressControls')

export const navigationButtonsVariants = cva('navigationButtons')

export const navControlButtonVariants = cva('navControlButton')

export const addressInputVariants = cva('addressInput')

export const secureButtonVariants = cva('secureButton')

// Content variants
export const mainVariants = cva('main')

export const contentAreaVariants = cva('contentArea')

export const contentVariants = cva(
  'content',
  {
    variants: {
      active: {
        true: 'contentActive',
        false: ''
      }
    },
    defaultVariants: {
      active: false
    }
  }
)

export const contentTitleVariants = cva(
  'contentTitle',
  {
    variants: {
      theme: {
        dashboard: 'dashboardTitle',
        core: 'coreTitle',
        el: 'elTitle',
        eco: 'ecoTitle'
      }
    },
    defaultVariants: {
      theme: 'dashboard'
    }
  }
)

export const contentSubtitleVariants = cva('contentSubtitle')

export const metricsGridVariants = cva('metricsGrid')

export const metricCardVariants = cva('metricCard')

export const metricValueVariants = cva('metricValue')

export const metricLabelVariants = cva('metricLabel')

export const comingSoonVariants = cva('comingSoon')

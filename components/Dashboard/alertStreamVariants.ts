import { cva } from 'class-variance-authority'
import styles from './AlertStream.module.css'

export const buttonVariants = cva(styles.button, {
  variants: {
    variant: {
      play: styles.buttonPlay,
      pause: styles.buttonPause,
      clear: styles.buttonClear,
    },
  },
  defaultVariants: {
    variant: 'clear',
  },
})

export const alertEntryVariants = cva(styles.alertEntry, {
  variants: {
    level: {
      critical: styles.alertCritical,
      warning: styles.alertWarning,
      info: styles.alertInfo,
    },
  },
  defaultVariants: {
    level: 'info',
  },
})

export const alertLevelVariants = cva(styles.alertLevel, {
  variants: {
    level: {
      critical: styles.levelCritical,
      warning: styles.levelWarning,
      info: styles.levelInfo,
    },
  },
  defaultVariants: {
    level: 'info',
  },
})

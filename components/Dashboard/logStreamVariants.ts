import { cva } from 'class-variance-authority'
import styles from './LogStream.module.css'

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

export const logEntryVariants = cva(styles.logEntry, {
  variants: {
    type: {
      even: styles.logEntryEven,
      odd: styles.logEntryOdd,
    },
  },
  defaultVariants: {
    type: 'odd',
  },
})

export const levelVariants = cva(styles.level, {
  variants: {
    level: {
      CRITICAL: styles.levelCritical,
      ERROR: styles.levelError,
      WARN: styles.levelWarn,
      INFO: styles.levelInfo,
      DEBUG: styles.levelDebug,
    },
  },
  defaultVariants: {
    level: 'INFO',
  },
})

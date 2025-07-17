import React from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { css } from 'styled-system/css';
import { 
  primaryButton, 
  secondaryButton, 
  baseCard, 
  elevatedCard,
  interactiveCard,
  flexCenter,
  flexBetween,
  agiGlow,
  morphingBackground,
  glassMorphism
} from '../styles/vanilla-extract.css';

// Animation variants
const fadeInUpVariants: Variants = {
  hidden: { 
    opacity: 0, 
    y: 20,
    transition: { duration: 0.3 }
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.5,
      ease: [0.4, 0, 0.2, 1]
    }
  }
};

const slideInRightVariants: Variants = {
  hidden: { 
    opacity: 0, 
    x: 20 
  },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { 
      duration: 0.4,
      ease: "easeOut"
    }
  }
};

const scaleInVariants: Variants = {
  hidden: { 
    opacity: 0, 
    scale: 0.95 
  },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { 
      duration: 0.3,
      ease: "easeOut"
    }
  }
};

const staggerContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

// Animated Button Component
interface AnimatedButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  isLoading?: boolean;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

export const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  isLoading = false,
  className,
  onClick,
  disabled,
  type = 'button'
}) => {
  const getButtonClass = () => {
    switch (variant) {
      case 'secondary': return secondaryButton;
      case 'ghost': return css({ bg: 'transparent', color: 'primary.500', _hover: { bg: 'primary.50' } });
      default: return primaryButton;
    }
  };

  const sizeClasses = {
    sm: css({ px: 'sm', py: 'xs', fontSize: 'sm' }),
    md: css({ px: 'md', py: 'sm', fontSize: 'md' }),
    lg: css({ px: 'lg', py: 'md', fontSize: 'lg' })
  };

  return (
    <motion.button
      className={`${getButtonClass()} ${sizeClasses[size]} ${className || ''}`}
      whileHover={{ 
        scale: 1.02,
        transition: { duration: 0.2 }
      }}
      whileTap={{ 
        scale: 0.98,
        transition: { duration: 0.1 }
      }}
      initial="hidden"
      animate="visible"
      variants={fadeInUpVariants}
      disabled={isLoading || disabled}
      onClick={onClick}
      type={type}
    >
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={css({ display: 'flex', alignItems: 'center', gap: 'sm' })}
          >
            <motion.div
              className={css({ 
                w: '4', 
                h: '4', 
                border: '2px solid', 
                borderColor: 'currentColor',
                borderTopColor: 'transparent',
                borderRadius: 'full' 
              })}
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            Loading...
          </motion.div>
        ) : (
          <motion.span
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {children}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
};

// Animated Card Component
interface AnimatedCardProps {
  variant?: 'base' | 'elevated' | 'interactive' | 'glass';
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const AnimatedCard: React.FC<AnimatedCardProps> = ({
  variant = 'base',
  children,
  className,
  onClick
}) => {
  const getCardClass = () => {
    switch (variant) {
      case 'elevated': return elevatedCard;
      case 'interactive': return interactiveCard;
      case 'glass': return glassMorphism;
      default: return baseCard;
    }
  };

  return (
    <motion.div
      className={`${getCardClass()} ${className || ''}`}
      initial="hidden"
      animate="visible"
      variants={scaleInVariants}
      whileHover={{ 
        y: -4,
        transition: { duration: 0.2 }
      }}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      {children}
    </motion.div>
  );
};

// AGI Glow Container
interface AGIGlowContainerProps {
  children: React.ReactNode;
  className?: string;
  intensity?: 'low' | 'medium' | 'high';
}

export const AGIGlowContainer: React.FC<AGIGlowContainerProps> = ({
  children,
  className,
  intensity = 'medium'
}) => {
  const glowVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.8 }
    }
  };

  const intensityClasses = {
    low: css({ filter: 'drop-shadow(0 0 5px token(colors.primary.400))' }),
    medium: css({ filter: 'drop-shadow(0 0 10px token(colors.primary.500))' }),
    high: css({ filter: 'drop-shadow(0 0 20px token(colors.primary.600))' })
  };

  return (
    <motion.div
      className={`${agiGlow} ${intensityClasses[intensity]} ${className || ''}`}
      initial="hidden"
      animate="visible"
      variants={glowVariants}
      whileHover={{
        filter: `drop-shadow(0 0 ${intensity === 'high' ? '30px' : intensity === 'medium' ? '15px' : '8px'} var(--colors-primary-500))`,
        transition: { duration: 0.3 }
      }}
    >
      {children}
    </motion.div>
  );
};

// Morphing Background Container
export const MorphingBackground: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className
}) => {
  return (
    <motion.div
      className={`${morphingBackground} ${className || ''}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {children}
    </motion.div>
  );
};

// Stagger Container for lists
interface StaggerContainerProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export const StaggerContainer: React.FC<StaggerContainerProps> = ({
  children,
  className,
  delay = 0.1
}) => {
  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      variants={{
        ...staggerContainerVariants,
        visible: {
          ...staggerContainerVariants.visible,
          transition: {
            staggerChildren: delay,
            delayChildren: 0.2
          }
        }
      }}
    >
      {children}
    </motion.div>
  );
};

// Stagger Item (to be used inside StaggerContainer)
export const StaggerItem: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className
}) => {
  return (
    <motion.div
      className={className}
      variants={fadeInUpVariants}
    >
      {children}
    </motion.div>
  );
};

// Page Transition Container
interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

export const PageTransition: React.FC<PageTransitionProps> = ({
  children,
  className
}) => {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ 
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1]
      }}
    >
      {children}
    </motion.div>
  );
};

// Floating Element (for floating action buttons, etc.)
interface FloatingElementProps {
  children: React.ReactNode;
  className?: string;
  amplitude?: number;
}

export const FloatingElement: React.FC<FloatingElementProps> = ({
  children,
  className,
  amplitude = 10
}) => {
  return (
    <motion.div
      className={className}
      animate={{
        y: [-amplitude, amplitude, -amplitude],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      {children}
    </motion.div>
  );
};

// Pulse Loading Element
export const PulseLoader: React.FC<{ size?: 'sm' | 'md' | 'lg'; color?: string }> = ({
  size = 'md',
  color = 'primary.500'
}) => {
  const getSizeClass = () => {
    switch (size) {
      case 'sm': return css({ w: '4', h: '4' });
      case 'lg': return css({ w: '12', h: '12' });
      default: return css({ w: '8', h: '8' });
    }
  };

  return (
    <motion.div
      className={`${getSizeClass()} ${css({ bg: color, borderRadius: 'full' })}`}
      animate={{
        scale: [1, 1.2, 1],
        opacity: [1, 0.7, 1]
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
  );
};

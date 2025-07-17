import { style, keyframes, createVar } from '@vanilla-extract/css';

// CSS Variables for dynamic theming
export const primaryColorVar = createVar();
export const secondaryColorVar = createVar();
export const backgroundColorVar = createVar();
export const textColorVar = createVar();

// Keyframe animations
export const fadeInUp = keyframes({
  '0%': {
    opacity: 0,
    transform: 'translateY(20px)'
  },
  '100%': {
    opacity: 1,
    transform: 'translateY(0)'
  }
});

export const slideInRight = keyframes({
  '0%': {
    opacity: 0,
    transform: 'translateX(20px)'
  },
  '100%': {
    opacity: 1,
    transform: 'translateX(0)'
  }
});

export const pulse = keyframes({
  '0%, 100%': {
    opacity: 1
  },
  '50%': {
    opacity: 0.7
  }
});

export const bounce = keyframes({
  '0%, 20%, 53%, 80%, 100%': {
    animationTimingFunction: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
    transform: 'translate3d(0, 0, 0)'
  },
  '40%, 43%': {
    animationTimingFunction: 'cubic-bezier(0.755, 0.05, 0.855, 0.06)',
    transform: 'translate3d(0, -30px, 0)'
  },
  '70%': {
    animationTimingFunction: 'cubic-bezier(0.755, 0.05, 0.855, 0.06)',
    transform: 'translate3d(0, -15px, 0)'
  },
  '90%': {
    transform: 'translate3d(0, -4px, 0)'
  }
});

// Base component styles
export const baseButton = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '0.75rem 1.5rem',
  fontSize: '0.875rem',
  fontWeight: '600',
  borderRadius: '0.5rem',
  border: 'none',
  cursor: 'pointer',
  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
  textDecoration: 'none',
  position: 'relative',
  overflow: 'hidden',
  
  ':hover': {
    transform: 'translateY(-1px)',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
  },
  
  ':active': {
    transform: 'translateY(0)'
  },
  
  ':focus': {
    outline: '2px solid',
    outlineColor: primaryColorVar,
    outlineOffset: '2px'
  }
});

export const primaryButton = style([baseButton, {
  backgroundColor: primaryColorVar,
  color: 'white',
  
  ':hover': {
    filter: 'brightness(1.1)'
  }
}]);

export const secondaryButton = style([baseButton, {
  backgroundColor: 'transparent',
  color: primaryColorVar,
  border: `2px solid ${primaryColorVar}`,
  
  ':hover': {
    backgroundColor: primaryColorVar,
    color: 'white'
  }
}]);

export const ghostButton = style([baseButton, {
  backgroundColor: 'transparent',
  color: primaryColorVar,
  
  ':hover': {
    backgroundColor: 'rgba(99, 102, 241, 0.1)'
  }
}]);

// Card components
export const baseCard = style({
  backgroundColor: 'white',
  borderRadius: '0.75rem',
  padding: '1.5rem',
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  
  ':hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
  }
});

export const elevatedCard = style([baseCard, {
  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
}]);

export const interactiveCard = style([baseCard, {
  cursor: 'pointer',
  
  ':hover': {
    transform: 'scale(1.02) translateY(-2px)',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
  }
}]);

// Animation utilities
export const fadeInUpAnimation = style({
  animation: `${fadeInUp} 0.6s ease-out`
});

export const slideInRightAnimation = style({
  animation: `${slideInRight} 0.5s ease-out`
});

export const pulseAnimation = style({
  animation: `${pulse} 2s cubic-bezier(0.4, 0, 0.6, 1) infinite`
});

export const bounceAnimation = style({
  animation: `${bounce} 1s infinite`
});

// Layout utilities
export const flexCenter = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
});

export const flexBetween = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between'
});

export const gridAutoFit = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
  gap: '1.5rem'
});

// Responsive utilities
export const hiddenMobile = style({
  '@media': {
    'screen and (max-width: 768px)': {
      display: 'none'
    }
  }
});

export const hiddenDesktop = style({
  '@media': {
    'screen and (min-width: 768px)': {
      display: 'none'
    }
  }
});

// AGI-specific styles
export const agiGlow = style({
  position: 'relative',
  
  selectors: {
    '&::before': {
      content: '""',
      position: 'absolute',
      inset: '-2px',
      background: `linear-gradient(45deg, ${primaryColorVar}, ${secondaryColorVar})`,
      borderRadius: '0.5rem',
      opacity: 0,
      transition: 'opacity 0.3s ease',
      zIndex: -1
    },
    
    '&:hover::before': {
      opacity: 0.3
    }
  }
});

const gradientShift = keyframes({
  '0%': { backgroundPosition: '0% 50%' },
  '50%': { backgroundPosition: '100% 50%' },
  '100%': { backgroundPosition: '0% 50%' }
});

export const morphingBackground = style({
  background: `linear-gradient(-45deg, ${primaryColorVar}, ${secondaryColorVar}, #ee7752, #e73c7e)`,
  backgroundSize: '400% 400%',
  animation: `${gradientShift} 15s ease infinite`
});

// Glass morphism effect
export const glassMorphism = style({
  background: 'rgba(255, 255, 255, 0.1)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  borderRadius: '1rem',
  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)'
});

// Motion-safe preferences
export const respectsMotion = style({
  '@media': {
    '(prefers-reduced-motion: reduce)': {
      animation: 'none',
      transition: 'none'
    }
  }
});

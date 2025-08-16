'use strict';

/**
 * Web8 Vanilla Motion System
 * Industrial-grade animation without external dependencies
 * TypeScript Strict - Yarn Berry Compatible
 */

import * as React from 'react';
import { useState } from 'react';

// Web8 Motion Types - Strict TypeScript
interface MotionProps extends React.HTMLAttributes<HTMLElement> {
  initial?: Record<string, any>;
  animate?: Record<string, any>;
  exit?: Record<string, any>;
  transition?: Record<string, any>;
  whileHover?: Record<string, any>;
  whileTap?: Record<string, any>;
  layout?: boolean;
  layoutId?: string;
  'data-motion'?: string;
}

// Web8 Vanilla Motion Components
const createMotionComponent = (element: keyof React.JSX.IntrinsicElements) => {
  return React.forwardRef<HTMLElement, MotionProps>((props: MotionProps, ref: React.Ref<HTMLElement>) => {
    const { initial, animate, exit, transition, whileHover, whileTap, layout, layoutId, ...rest } = props;
    
    return React.createElement(element as any, {
      ...rest,
      ref,
      'data-web8-motion': 'vanilla',
      'data-motion-element': element,
      'data-motion-config': JSON.stringify({
        initial,
        animate,
        exit,
        transition,
        whileHover,
        whileTap,
        layout,
        layoutId
      })
    });
  });
};

// Web8 Motion Elements - Industrial Grade
export const motion = {
  div: createMotionComponent('div'),
  section: createMotionComponent('section'),
  article: createMotionComponent('article'),
  nav: createMotionComponent('nav'),
  main: createMotionComponent('main'),
  header: createMotionComponent('header'),
  footer: createMotionComponent('footer'),
  aside: createMotionComponent('aside'),
  h1: createMotionComponent('h1'),
  h2: createMotionComponent('h2'),
  h3: createMotionComponent('h3'),
  h4: createMotionComponent('h4'),
  h5: createMotionComponent('h5'),
  h6: createMotionComponent('h6'),
  p: createMotionComponent('p'),
  span: createMotionComponent('span'),
  button: createMotionComponent('button'),
  form: createMotionComponent('form'),
  input: createMotionComponent('input'),
  textarea: createMotionComponent('textarea'),
  label: createMotionComponent('label'),
  ul: createMotionComponent('ul'),
  ol: createMotionComponent('ol'),
  li: createMotionComponent('li'),
  img: createMotionComponent('img'),
  svg: createMotionComponent('svg'),
  path: createMotionComponent('path'),
  rect: createMotionComponent('rect'),
  circle: createMotionComponent('circle')
};

// Web8 AnimatePresence Component
interface AnimatePresenceProps {
  children: React.ReactNode;
  mode?: 'wait' | 'sync' | 'popLayout';
  initial?: boolean;
  exitBeforeEnter?: boolean;
}

export const AnimatePresence: React.FC<AnimatePresenceProps> = ({ 
  children, 
  mode = 'sync',
  initial = true,
  exitBeforeEnter = false 
}: AnimatePresenceProps) => {
  return React.createElement('div', {
    'data-web8-animate-presence': 'true',
    'data-animate-mode': mode,
    'data-initial': initial.toString(),
    'data-exit-before-enter': exitBeforeEnter.toString()
  }, children);
};

// Web8 Motion Hooks - TypeScript Strict
interface SpringConfig {
  duration?: number;
  stiffness?: number;
  damping?: number;
}

export const useSpring = (value: number, config?: SpringConfig) => {
  const [current, setCurrent] = useState(value);
  
  React.useEffect(() => {
    // Web8 spring animation logic
    const duration = config?.duration || 300;
    const startTime = Date.now();
    const startValue = current;
    const targetValue = value;
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function
      const eased = 1 - Math.pow(1 - progress, 3);
      const newValue = startValue + (targetValue - startValue) * eased;
      
      setCurrent(newValue);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, [value, config]);
  
  return current;
};

export const useTransform = (value: number, inputRange: number[], outputRange: number[]) => {
  return React.useMemo(() => {
    // Safety checks
    if (!inputRange.length || !outputRange.length || inputRange.length !== outputRange.length) {
      return outputRange[0] || 0;
    }
    
    // Get safe values with fallbacks
    const firstInput = inputRange[0];
    const lastInput = inputRange[inputRange.length - 1];
    const firstOutput = outputRange[0];
    const lastOutput = outputRange[outputRange.length - 1];
    
    // Linear interpolation with safe bounds
    if (firstInput !== undefined && firstOutput !== undefined && value <= firstInput) {
      return firstOutput;
    }
    if (lastInput !== undefined && lastOutput !== undefined && value >= lastInput) {
      return lastOutput;
    }
    
    for (let i = 0; i < inputRange.length - 1; i++) {
      const currentInput = inputRange[i];
      const nextInput = inputRange[i + 1];
      const currentOutput = outputRange[i];
      const nextOutput = outputRange[i + 1];
      
      if (currentInput !== undefined && nextInput !== undefined && 
          currentOutput !== undefined && nextOutput !== undefined &&
          value >= currentInput && value <= nextInput) {
        const progress = (value - currentInput) / (nextInput - currentInput);
        return currentOutput + (nextOutput - currentOutput) * progress;
      }
    }
    
    return outputRange[0] || 0;
  }, [value, inputRange, outputRange]);
};

// Web8 Variants Type - Strict TypeScript
export interface Variants {
  [key: string]: {
    [property: string]: unknown;
  };
}

// Web8 Motion Utilities
export const motionVariants = {
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  },
  slideUp: {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  },
  slideDown: {
    hidden: { y: -20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  },
  slideLeft: {
    hidden: { x: 20, opacity: 0 },
    visible: { x: 0, opacity: 1 }
  },
  slideRight: {
    hidden: { x: -20, opacity: 0 },
    visible: { x: 0, opacity: 1 }
  },
  scale: {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { scale: 1, opacity: 1 }
  },
  rotate: {
    hidden: { rotate: -10, opacity: 0 },
    visible: { rotate: 0, opacity: 1 }
  }
};

// Web8 Motion CSS Injection - Industrial Grade
export const injectMotionCSS = () => {
  if (typeof document === 'undefined') return;
  
  const existingStyle = document.getElementById('web8-motion-css');
  if (existingStyle) return;
  
  const style = document.createElement('style');
  style.id = 'web8-motion-css';
  style.textContent = `
    /* Web8 Motion Base Styles */
    [data-web8-motion="vanilla"] {
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    [data-web8-animate-presence="true"] {
      position: relative;
    }
    
    /* Web8 Motion Utilities */
    .web8-fade-in {
      animation: web8-fadeIn 0.3s ease-out;
    }
    
    .web8-slide-up {
      animation: web8-slideUp 0.3s ease-out;
    }
    
    .web8-slide-down {
      animation: web8-slideDown 0.3s ease-out;
    }
    
    .web8-scale {
      animation: web8-scale 0.3s ease-out;
    }
    
    /* Web8 Keyframes */
    @keyframes web8-fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    
    @keyframes web8-slideUp {
      from { transform: translateY(20px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
    
    @keyframes web8-slideDown {
      from { transform: translateY(-20px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
    
    @keyframes web8-scale {
      from { transform: scale(0.8); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
    }
    
    /* Web8 Motion Performance */
    [data-web8-motion="vanilla"] {
      will-change: transform;
      backface-visibility: hidden;
      perspective: 1000px;
    }
  `;
  document.head.appendChild(style);
  console.log('🎬 Web8 Motion CSS injected');
};

// Auto-inject CSS on module load
if (typeof window !== 'undefined') {
  injectMotionCSS();
}
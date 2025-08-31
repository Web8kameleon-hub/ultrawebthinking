/**
 * EuroWeb Ultra Theme Engine
 * Sistema e pastër e tokens + variants pa PandaCSS
 * Designed by: Ledjan Ahmati
 * Industrial-grade theming system
 */

// 🎨 Royal Color Palette - EuroWeb Ultra
export const colors = {
  // Primary Royal Colors
  royal: {
    gold: '#d4af37',
    darkGold: '#b8941f',
    lightGold: '#f2d570',
    platinum: '#e5e4e2',
  },
  
  // Background System
  bg: {
    primary: '#0f1419',      // Ultra Dark
    secondary: '#1a1a2e',    // Royal Dark
    card: '#2c3e50',         // Card Background
    glass: 'rgba(255, 255, 255, 0.02)', // Glass Effect
    overlay: 'rgba(0, 0, 0, 0.8)',
  },
  
  // Text Colors
  text: {
    primary: '#e2e8f0',      // Main Text
    secondary: '#64748b',    // Muted Text
    accent: '#d4af37',       // Gold Accent
    danger: '#e74c3c',       // Error
    success: '#2ecc71',      // Success
    warning: '#f39c12',      // Warning
    info: '#3498db',         // Info
  },
  
  // Border & Dividers
  border: {
    primary: 'rgba(255, 255, 255, 0.05)',
    secondary: 'rgba(255, 255, 255, 0.1)',
    accent: '#d4af37',
    focus: '#3498db',
  },
  
  // Status Colors
  status: {
    online: '#2ecc71',
    offline: '#95a5a6',
    maintenance: '#f39c12',
    error: '#e74c3c',
  },
  
  // Gradients
  gradients: {
    royal: 'linear-gradient(135deg, #d4af37 0%, #f2d570 100%)',
    dark: 'linear-gradient(135deg, #0f1419 0%, #1a1a2e 100%)',
    glass: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
    danger: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)',
    success: 'linear-gradient(135deg, #2ecc71 0%, #27ae60 100%)',
  },
} as const;

// 📐 Spacing & Sizing System
export const spacing = {
  xs: '0.25rem',    // 4px
  sm: '0.5rem',     // 8px
  md: '0.75rem',    // 12px
  lg: '1rem',       // 16px
  xl: '1.5rem',     // 24px
  '2xl': '2rem',    // 32px
  '3xl': '3rem',    // 48px
  '4xl': '4rem',    // 64px
  '5xl': '6rem',    // 96px
} as const;

// 🔄 Border Radius
export const radius = {
  none: '0',
  sm: '0.25rem',
  md: '0.5rem',
  lg: '0.75rem',
  xl: '1rem',
  '2xl': '1.5rem',
  full: '50%',
} as const;

// 🎭 Shadows
export const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  royal: '0 0 20px rgba(212, 175, 55, 0.3)',
  glass: '0 8px 32px rgba(31, 38, 135, 0.37)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
} as const;

// 📱 Breakpoints
export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

// ⚡ Animations & Transitions
export const animations = {
  duration: {
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
  },
  easing: {
    ease: 'ease',
    linear: 'linear',
    'ease-in': 'ease-in',
    'ease-out': 'ease-out',
    'ease-in-out': 'ease-in-out',
    spring: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },
  keyframes: {
    fadeIn: `
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
    `,
    slideUp: `
      @keyframes slideUp {
        from { transform: translateY(20px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }
    `,
    pulse: `
      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
      }
    `,
    spin: `
      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
    `,
    float: `
      @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-10px); }
      }
    `,
    glow: `
      @keyframes glow {
        0%, 100% { box-shadow: 0 0 5px rgba(212, 175, 55, 0.3); }
        50% { box-shadow: 0 0 20px rgba(212, 175, 55, 0.6); }
      }
    `,
  },
} as const;

// 📝 Typography
export const typography = {
  fontFamily: {
    sans: ['Inter', 'system-ui', 'sans-serif'],
    mono: ['JetBrains Mono', 'Consolas', 'Monaco', 'monospace'],
    display: ['Playfair Display', 'serif'],
  },
  fontSize: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
    '5xl': '3rem',
    '6xl': '3.75rem',
  },
  fontWeight: {
    thin: '100',
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
    black: '900',
  },
  lineHeight: {
    tight: '1.25',
    normal: '1.5',
    relaxed: '1.75',
  },
} as const;

// 🎛️ Component Variants (CVA Alternative)
export const variants = {
  button: {
    size: {
      sm: {
        padding: `${spacing.sm} ${spacing.md}`,
        fontSize: typography.fontSize.sm,
        borderRadius: radius.md,
      },
      md: {
        padding: `${spacing.md} ${spacing.lg}`,
        fontSize: typography.fontSize.base,
        borderRadius: radius.md,
      },
      lg: {
        padding: `${spacing.lg} ${spacing.xl}`,
        fontSize: typography.fontSize.lg,
        borderRadius: radius.lg,
      },
    },
    variant: {
      primary: {
        background: colors.gradients.royal,
        color: colors.bg.primary,
        border: `1px solid ${colors.royal.gold}`,
        boxShadow: shadows.royal,
      },
      secondary: {
        background: colors.bg.glass,
        color: colors.text.primary,
        border: `1px solid ${colors.border.primary}`,
        backdropFilter: 'blur(10px)',
      },
      ghost: {
        background: 'transparent',
        color: colors.text.secondary,
        border: `1px solid transparent`,
      },
      danger: {
        background: colors.gradients.danger,
        color: colors.text.primary,
        border: `1px solid ${colors.text.danger}`,
      },
    },
  },
  card: {
    variant: {
      default: {
        background: colors.bg.glass,
        border: `1px solid ${colors.border.primary}`,
        borderRadius: radius.lg,
        backdropFilter: 'blur(10px)',
        boxShadow: shadows.glass,
      },
      royal: {
        background: colors.gradients.glass,
        border: `1px solid ${colors.royal.gold}`,
        borderRadius: radius.xl,
        backdropFilter: 'blur(15px)',
        boxShadow: shadows.royal,
      },
      flat: {
        background: colors.bg.card,
        border: `1px solid ${colors.border.secondary}`,
        borderRadius: radius.md,
      },
    },
  },
  input: {
    variant: {
      default: {
        background: colors.bg.glass,
        border: `1px solid ${colors.border.primary}`,
        borderRadius: radius.md,
        color: colors.text.primary,
        padding: `${spacing.md} ${spacing.lg}`,
        fontSize: typography.fontSize.base,
      },
      royal: {
        background: 'transparent',
        border: `2px solid ${colors.royal.gold}`,
        borderRadius: radius.lg,
        color: colors.text.primary,
        padding: `${spacing.md} ${spacing.lg}`,
        boxShadow: shadows.royal,
      },
    },
  },
} as const;

// 🔧 Utility Functions
export const utils = {
  // Generate CSS variables from theme
  generateCSSVars: () => {
    const vars: Record<string, string> = {};
    
    // Colors
    Object.entries(colors).forEach(([category, values]) => {
      if (typeof values === 'object') {
        Object.entries(values).forEach(([key, value]) => {
          vars[`--color-${category}-${key}`] = value;
        });
      } else {
        vars[`--color-${category}`] = values;
      }
    });
    
    // Spacing
    Object.entries(spacing).forEach(([key, value]) => {
      vars[`--spacing-${key}`] = value;
    });
    
    // Shadows
    Object.entries(shadows).forEach(([key, value]) => {
      vars[`--shadow-${key}`] = value;
    });
    
    return vars;
  },
  
  // Responsive helper
  media: (breakpoint: keyof typeof breakpoints) => 
    `@media (min-width: ${breakpoints[breakpoint]})`,
  
  // Generate component styles with variants
  createVariant: <T extends Record<string, any>>(
    base: any,
    variants: T,
    defaultVariants: Partial<{ [K in keyof T]: keyof T[K] }>
  ) => {
    return (props: Partial<{ [K in keyof T]: keyof T[K] }>) => {
      const styles = { ...base };
      
      Object.entries({ ...defaultVariants, ...props }).forEach(([key, value]) => {
        if (variants[key] && variants[key][value as string]) {
          Object.assign(styles, variants[key][value as string]);
        }
      });
      
      return styles;
    };
  },
  
  // Convert object styles to CSS string
  objectToCSS: (styles: Record<string, any>): string => {
    return Object.entries(styles)
      .map(([property, value]) => {
        const cssProperty = property.replace(/([A-Z])/g, '-$1').toLowerCase();
        return `${cssProperty}: ${value};`;
      })
      .join('\n  ');
  },
};

// 🌍 Global CSS Injection
export const globalCSS = `
  /* EuroWeb Ultra Global Styles */
  ${animations.keyframes.fadeIn}
  ${animations.keyframes.slideUp}
  ${animations.keyframes.pulse}
  ${animations.keyframes.spin}
  ${animations.keyframes.float}
  ${animations.keyframes.glow}
  
  :root {
    ${Object.entries(utils.generateCSSVars())
      .map(([key, value]) => `${key}: ${value};`)
      .join('\n    ')}
  }
  
  * {
    box-sizing: border-box;
  }
  
  body {
    margin: 0;
    padding: 0;
    font-family: ${typography.fontFamily.sans.join(', ')};
    background: ${colors.bg.primary};
    color: ${colors.text.primary};
    line-height: ${typography.lineHeight.normal};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  
  .ultra-fade-in {
    animation: fadeIn ${animations.duration.normal} ${animations.easing['ease-out']};
  }
  
  .ultra-slide-up {
    animation: slideUp ${animations.duration.normal} ${animations.easing['ease-out']};
  }
  
  .ultra-glow {
    animation: glow 2s ${animations.easing['ease-in-out']} infinite;
  }
  
  .ultra-float {
    animation: float 6s ${animations.easing['ease-in-out']} infinite;
  }
`;

// Export everything for easy access
export const theme = {
  colors,
  spacing,
  radius,
  shadows,
  breakpoints,
  animations,
  typography,
  variants,
  utils,
  globalCSS,
} as const;

export default theme;

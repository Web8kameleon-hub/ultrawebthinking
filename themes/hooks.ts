/**
 * EuroWeb Ultra Theme Hooks
 * React hooks për të përdorur UltraThemeEngine
 */

import { useMemo } from 'react';
import { theme } from './UltraThemeEngine';

// 🎨 Hook për të marrë ngjyrat
export const useColors = () => {
  return useMemo(() => theme.colors, []);
};

// 📐 Hook për të marrë spacing
export const useSpacing = () => {
  return useMemo(() => theme.spacing, []);
};

// 🎛️ Hook për të krijuar variant styles
export const useVariant = () => {
  return useMemo(() => ({
    button: theme.utils.createVariant(
      {
        cursor: 'pointer',
        border: 'none',
        outline: 'none',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: `all ${theme.animations.duration.normal} ${theme.animations.easing['ease-out']}`,
        textDecoration: 'none',
        userSelect: 'none',
      },
      theme.variants.button,
      { size: 'md', variant: 'primary' }
    ),
    
    card: theme.utils.createVariant(
      {
        display: 'block',
        position: 'relative',
        overflow: 'hidden',
      },
      theme.variants.card,
      { variant: 'default' }
    ),
    
    input: theme.utils.createVariant(
      {
        outline: 'none',
        width: '100%',
        transition: `all ${theme.animations.duration.normal} ${theme.animations.easing['ease-out']}`,
      },
      theme.variants.input,
      { variant: 'default' }
    ),
  }), []);
};

// 📱 Hook për responsive design
export const useBreakpoint = () => {
  return useMemo(() => ({
    sm: `@media (min-width: ${theme.breakpoints.sm})`,
    md: `@media (min-width: ${theme.breakpoints.md})`,
    lg: `@media (min-width: ${theme.breakpoints.lg})`,
    xl: `@media (min-width: ${theme.breakpoints.xl})`,
    '2xl': `@media (min-width: ${theme.breakpoints['2xl']})`,
  }), []);
};

// 🎭 Hook për shadows
export const useShadows = () => {
  return useMemo(() => theme.shadows, []);
};

// ⚡ Hook për animations
export const useAnimations = () => {
  return useMemo(() => theme.animations, []);
};

// 🔧 Hook për utilities
export const useThemeUtils = () => {
  return useMemo(() => theme.utils, []);
};

// 🌍 Hook për të injektuar global CSS
export const useGlobalCSS = () => {
  return useMemo(() => theme.globalCSS, []);
};

// 🎯 Main theme hook - everything in one
export const useTheme = () => {
  return useMemo(() => ({
    colors: theme.colors,
    spacing: theme.spacing,
    radius: theme.radius,
    shadows: theme.shadows,
    breakpoints: theme.breakpoints,
    animations: theme.animations,
    typography: theme.typography,
    variants: theme.variants,
    utils: theme.utils,
    globalCSS: theme.globalCSS,
  }), []);
};

// 🎨 Hook për inline styles - EuroWeb Ultra Royal Edition
export const useInlineStyles = () => {
  return useMemo(() => ({
    // 🏰 Royal Button Styles
    button: {
      primary: {
        background: theme.colors.gradients.royal,
        color: theme.colors.bg.primary,
        border: `1px solid ${theme.colors.royal.gold}`,
        borderRadius: theme.radius.lg,
        padding: `${theme.spacing.md} ${theme.spacing.xl}`,
        fontSize: theme.typography.fontSize.base,
        fontWeight: theme.typography.fontWeight.medium,
        cursor: 'pointer',
        transition: `all ${theme.animations.duration.normal} ${theme.animations.easing['ease-out']}`,
        boxShadow: theme.shadows.royal,
        textDecoration: 'none',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        userSelect: 'none' as const,
      },
      secondary: {
        background: theme.colors.bg.glass,
        color: theme.colors.text.primary,
        border: `1px solid ${theme.colors.border.primary}`,
        borderRadius: theme.radius.md,
        padding: `${theme.spacing.md} ${theme.spacing.lg}`,
        fontSize: theme.typography.fontSize.base,
        fontWeight: theme.typography.fontWeight.normal,
        cursor: 'pointer',
        transition: `all ${theme.animations.duration.normal} ${theme.animations.easing['ease-out']}`,
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        textDecoration: 'none',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        userSelect: 'none' as const,
      },
      ghost: {
        background: 'transparent',
        color: theme.colors.text.secondary,
        border: '1px solid transparent',
        borderRadius: theme.radius.md,
        padding: `${theme.spacing.md} ${theme.spacing.lg}`,
        fontSize: theme.typography.fontSize.base,
        fontWeight: theme.typography.fontWeight.normal,
        cursor: 'pointer',
        transition: `all ${theme.animations.duration.normal} ${theme.animations.easing['ease-out']}`,
        textDecoration: 'none',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        userSelect: 'none' as const,
      },
    },

    // 🏰 Royal Card Styles
    card: {
      default: {
        background: theme.colors.bg.glass,
        border: `1px solid ${theme.colors.border.primary}`,
        borderRadius: theme.radius.lg,
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        boxShadow: theme.shadows.glass,
        transition: `all ${theme.animations.duration.normal} ${theme.animations.easing['ease-out']}`,
        overflow: 'hidden',
      },
      royal: {
        background: theme.colors.gradients.glass,
        border: `1px solid ${theme.colors.royal.gold}`,
        borderRadius: theme.radius.xl,
        backdropFilter: 'blur(15px)',
        WebkitBackdropFilter: 'blur(15px)',
        boxShadow: theme.shadows.royal,
        transition: `all ${theme.animations.duration.normal} ${theme.animations.easing['ease-out']}`,
        overflow: 'hidden',
      },
      flat: {
        background: theme.colors.bg.card,
        border: `1px solid ${theme.colors.border.secondary}`,
        borderRadius: theme.radius.md,
        transition: `all ${theme.animations.duration.normal} ${theme.animations.easing['ease-out']}`,
        overflow: 'hidden',
      },
    },

    // 🎛️ Input Styles
    input: {
      default: {
        width: '100%',
        padding: `${theme.spacing.md} ${theme.spacing.lg}`,
        background: theme.colors.bg.glass,
        border: `1px solid ${theme.colors.border.primary}`,
        borderRadius: theme.radius.md,
        color: theme.colors.text.primary,
        fontSize: theme.typography.fontSize.base,
        fontFamily: theme.typography.fontFamily.sans.join(', '),
        outline: 'none',
        transition: `all ${theme.animations.duration.normal} ${theme.animations.easing['ease-out']}`,
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
      },
      royal: {
        width: '100%',
        padding: `${theme.spacing.md} ${theme.spacing.lg}`,
        background: 'transparent',
        border: `2px solid ${theme.colors.royal.gold}`,
        borderRadius: theme.radius.lg,
        color: theme.colors.text.primary,
        fontSize: theme.typography.fontSize.base,
        fontFamily: theme.typography.fontFamily.sans.join(', '),
        outline: 'none',
        transition: `all ${theme.animations.duration.normal} ${theme.animations.easing['ease-out']}`,
        boxShadow: theme.shadows.royal,
      },
    },

    // 🎨 Text Styles
    text: {
      gradient: {
        background: theme.colors.gradients.royal,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        fontWeight: theme.typography.fontWeight.bold,
      },
      royal: {
        color: theme.colors.royal.gold,
        fontWeight: theme.typography.fontWeight.semibold,
      },
      primary: {
        color: theme.colors.text.primary,
        fontFamily: theme.typography.fontFamily.sans.join(', '),
      },
      secondary: {
        color: theme.colors.text.secondary,
        fontFamily: theme.typography.fontFamily.sans.join(', '),
      },
    },

    // 📱 Layout Styles
    layout: {
      container: {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: `0 ${theme.spacing.xl}`,
      },
      flexCenter: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
      flexBetween: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      },
      grid: {
        display: 'grid',
        gap: theme.spacing.lg,
      },
      glassBg: {
        background: theme.colors.bg.primary,
        minHeight: '100vh',
      },
      glassPanel: {
        background: theme.colors.bg.glass,
        border: `1px solid ${theme.colors.border.primary}`,
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
      },
    },

    // ⚡ Animation Styles
    animations: {
      fadeIn: {
        animation: `fadeIn ${theme.animations.duration.normal} ${theme.animations.easing['ease-out']}`,
      },
      slideUp: {
        animation: `slideUp ${theme.animations.duration.normal} ${theme.animations.easing['ease-out']}`,
      },
      glow: {
        animation: `glow 2s ${theme.animations.easing['ease-in-out']} infinite`,
      },
      float: {
        animation: `float 6s ${theme.animations.easing['ease-in-out']} infinite`,
      },
      pulse: {
        animation: `pulse 2s ${theme.animations.easing['ease-in-out']} infinite`,
      },
    },
  }), []);
};

/**
 * InlineStyleEngine.ts
 * Pure TypeScript inline CSS engine - NO external frameworks
 * © Web8 UltraThinking – Ledjan Ahmati
 */

interface StyleProps {
  margin?: string;
  padding?: string;
  background?: string;
  backgroundColor?: string;
  color?: string;
  fontSize?: string;
  fontWeight?: string;
  border?: string;
  borderRadius?: string;
  width?: string;
  height?: string;
  display?: string;
  flexDirection?: 'row' | 'column';
  justifyContent?: string;
  alignItems?: string;
  gap?: string;
  cursor?: string;
  position?: 'static' | 'relative' | 'absolute' | 'fixed' | 'sticky';
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
  zIndex?: string;
  boxShadow?: string;
  opacity?: string;
  transform?: string;
  transition?: string;
}

interface ComponentStyles {
  base: StyleProps;
  hover?: StyleProps;
  active?: StyleProps;
  disabled?: StyleProps;
}

export class InlineStyleEngine {
  /**
   * Convert StyleProps to inline style object
   */
  static compile(styles: StyleProps): React.CSSProperties {
    return {
      margin: styles.margin,
      padding: styles.padding,
      background: styles.background,
      backgroundColor: styles.backgroundColor,
      color: styles.color,
      fontSize: styles.fontSize,
      fontWeight: styles.fontWeight,
      border: styles.border,
      borderRadius: styles.borderRadius,
      width: styles.width,
      height: styles.height,
      display: styles.display,
      flexDirection: styles.flexDirection,
      justifyContent: styles.justifyContent,
      alignItems: styles.alignItems,
      gap: styles.gap,
      cursor: styles.cursor,
      position: styles.position,
      top: styles.top,
      left: styles.left,
      right: styles.right,
      bottom: styles.bottom,
      zIndex: styles.zIndex,
      boxShadow: styles.boxShadow,
      opacity: styles.opacity,
      transform: styles.transform,
      transition: styles.transition
    };
  }

  /**
   * Button styles industriale
   */
  static button: { [key: string]: ComponentStyles } = {
    primary: {
      base: {
        padding: '12px 24px',
        backgroundColor: '#007bff',
        color: '#ffffff',
        border: 'none',
        borderRadius: '6px',
        fontSize: '14px',
        fontWeight: '500',
        cursor: 'pointer',
        transition: 'all 0.2s ease'
      },
      hover: {
        backgroundColor: '#0056b3'
      }
    },
    secondary: {
      base: {
        padding: '12px 24px',
        backgroundColor: 'transparent',
        color: '#007bff',
        border: '1px solid #007bff',
        borderRadius: '6px',
        fontSize: '14px',
        fontWeight: '500',
        cursor: 'pointer',
        transition: 'all 0.2s ease'
      },
      hover: {
        backgroundColor: '#007bff',
        color: '#ffffff'
      }
    }
  };

  /**
   * Card styles industriale
   */
  static card = {
    base: {
      backgroundColor: '#ffffff',
      border: '1px solid #e0e0e0',
      borderRadius: '8px',
      padding: '20px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    },
    elevated: {
      backgroundColor: '#ffffff',
      border: 'none',
      borderRadius: '12px',
      padding: '24px',
      boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
    }
  };

  /**
   * Layout styles industriale
   */
  static layout = {
    container: {
      width: '100%',
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 20px'
    },
    flex: {
      row: {
        display: 'flex',
        flexDirection: 'row' as const,
        alignItems: 'center'
      },
      column: {
        display: 'flex',
        flexDirection: 'column' as const
      },
      center: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }
    },
    grid: {
      responsive: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '20px'
      }
    }
  };

  /**
   * Typography styles industriale
   */
  static typography = {
    h1: {
      fontSize: '32px',
      fontWeight: '700',
      margin: '0 0 20px 0',
      color: '#1a1a1a'
    },
    h2: {
      fontSize: '24px',
      fontWeight: '600',
      margin: '0 0 16px 0',
      color: '#2a2a2a'
    },
    h3: {
      fontSize: '20px',
      fontWeight: '500',
      margin: '0 0 12px 0',
      color: '#3a3a3a'
    },
    body: {
      fontSize: '14px',
      fontWeight: '400',
      lineHeight: '1.5',
      color: '#4a4a4a'
    },
    small: {
      fontSize: '12px',
      fontWeight: '400',
      color: '#6a6a6a'
    }
  };

  /**
   * Input styles industriale
   */
  static input = {
    base: {
      padding: '12px 16px',
      border: '1px solid #d0d0d0',
      borderRadius: '6px',
      fontSize: '14px',
      width: '100%',
      transition: 'border-color 0.2s ease'
    },
    focused: {
      borderColor: '#007bff',
      outline: 'none'
    }
  };

  /**
   * Colors palette industriale
   */
  static colors = {
    primary: '#007bff',
    secondary: '#6c757d',
    success: '#28a745',
    warning: '#ffc107',
    danger: '#dc3545',
    info: '#17a2b8',
    light: '#f8f9fa',
    dark: '#343a40',
    white: '#ffffff',
    gray: {
      100: '#f8f9fa',
      200: '#e9ecef',
      300: '#dee2e6',
      400: '#ced4da',
      500: '#adb5bd',
      600: '#6c757d',
      700: '#495057',
      800: '#343a40',
      900: '#212529'
    }
  };
}

export default InlineStyleEngine;

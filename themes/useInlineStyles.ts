/**
 * useInlineStyles.ts
 * React Hook për inline CSS - Real, no external dependencies
 * © Web8 UltraThinking – Ledjan Ahmati
 */

import { useCallback, useState } from 'react';
import { InlineStyleEngine } from './InlineStyleEngine';

interface UseInlineStylesReturn {
  getStyle: (styleName: string) => React.CSSProperties;
  combineStyles: (...styles: React.CSSProperties[]) => React.CSSProperties;
  addHoverEffect: (baseStyle: React.CSSProperties, hoverStyle: React.CSSProperties) => {
    style: React.CSSProperties;
    onMouseEnter: () => void;
    onMouseLeave: () => void;
  };
}

export function useInlineStyles(): UseInlineStylesReturn {
  const [hoveredElement, setHoveredElement] = useState<string | null>(null);

  const getStyle = useCallback((styleName: string): React.CSSProperties => {
    // Kërkojmë style bazuar në emër
    const stylePath = styleName.split('.');
    let style: any = InlineStyleEngine;
    
    for (const key of stylePath) {
      style = style?.[key];
    }
    
    if (style && typeof style === 'object' && 'base' in style) {
      return InlineStyleEngine.compile(style.base);
    }
    
    if (style && typeof style === 'object') {
      return InlineStyleEngine.compile(style);
    }
    
    return {};
  }, []);

  const combineStyles = useCallback((...styles: React.CSSProperties[]): React.CSSProperties => {
    return Object.assign({}, ...styles);
  }, []);

  const addHoverEffect = useCallback((
    baseStyle: React.CSSProperties, 
    hoverStyle: React.CSSProperties
  ) => {
    const elementId = Math.random().toString(36).substr(2, 9);
    const isHovered = hoveredElement === elementId;
    
    return {
      style: combineStyles(baseStyle, isHovered ? hoverStyle : {}),
      onMouseEnter: () => setHoveredElement(elementId),
      onMouseLeave: () => setHoveredElement(null)
    };
  }, [hoveredElement, combineStyles]);

  return {
    getStyle,
    combineStyles,
    addHoverEffect
  };
}

/**
 * Styled Components Alternative - Pure TypeScript
 */
export const styled = {
  /**
   * Styled Button
   */
  button: (variant: 'primary' | 'secondary' = 'primary') => {
    const { getStyle, addHoverEffect } = useInlineStyles();
    const baseStyle = getStyle(`button.${variant}.base`);
    const hoverStyle = getStyle(`button.${variant}.hover`);
    
    return addHoverEffect(baseStyle, hoverStyle);
  },

  /**
   * Styled Card
   */
  card: (variant: 'base' | 'elevated' = 'base') => {
    const { getStyle } = useInlineStyles();
    return {
      style: getStyle(`card.${variant}`)
    };
  },

  /**
   * Styled Container
   */
  container: () => {
    const { getStyle } = useInlineStyles();
    return {
      style: getStyle('layout.container')
    };
  },

  /**
   * Styled Flex
   */
  flex: (direction: 'row' | 'column' | 'center' = 'row') => {
    const { getStyle } = useInlineStyles();
    return {
      style: getStyle(`layout.flex.${direction}`)
    };
  }
};

export default useInlineStyles;

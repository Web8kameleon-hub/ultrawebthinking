/**
 * EuroWeb Ultra Theme Provider
 * Injekton global styles dhe theme context
 */

import React, { useEffect } from 'react';
import { theme } from './UltraThemeEngine';

interface UltraThemeProviderProps {
  children: React.ReactNode;
}

export const UltraThemeProvider: React.FC<UltraThemeProviderProps> = ({ children }) => {
  useEffect(() => {
    // Inject global CSS
    if (!document.getElementById('ultra-theme-global')) {
      const style = document.createElement('style');
      style.id = 'ultra-theme-global';
      style.textContent = theme.globalCSS;
      document.head.appendChild(style);
    }
  }, []);

  return <>{children}</>;
};

// 🎨 Styled component helper
export const styled = {
  div: (styles: React.CSSProperties) => {
    return React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
      (props, ref) => (
        <div
          ref={ref}
          {...props}
          style={{ ...styles, ...props.style }}
        />
      )
    );
  },
  
  button: (styles: React.CSSProperties) => {
    return React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
      (props, ref) => (
        <button
          ref={ref}
          {...props}
          style={{ ...styles, ...props.style }}
        />
      )
    );
  },
  
  input: (styles: React.CSSProperties) => {
    return React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
      (props, ref) => (
        <input
          ref={ref}
          {...props}
          style={{ ...styles, ...props.style }}
        />
      )
    );
  },
  
  span: (styles: React.CSSProperties) => {
    return React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(
      (props, ref) => (
        <span
          ref={ref}
          {...props}
          style={{ ...styles, ...props.style }}
        />
      )
    );
  },
};

export default UltraThemeProvider;

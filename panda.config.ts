import { defineConfig } from "@pandacss/dev"

export default defineConfig({
  // Whether to use css reset
  preflight: true,

  // Where to look for your css declarations
  include: ["./src/**/*.{js,jsx,ts,tsx}", "./pages/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],

  // Files to exclude
  exclude: [],

  // Useful for theme customization
  theme: {
    extend: {
      tokens: {
        colors: {
          // Primary colors - soft and modern
          primary: {
            50: { value: "#eef2ff" },
            100: { value: "#e0e7ff" },
            200: { value: "#263ea0ff" },
            300: { value: "#182e9bff" },
            400: { value: "#515dccff" },
            500: { value: "#6366f1" },
            600: { value: "#4f46e5" },
            700: { value: "#4338ca" },
            800: { value: "#3730a3" },
            900: { value: "#312e81" }
          },
          
          // Secondary colors - nature green
          secondary: {
            50: { value: "#ecfdf5" },
            100: { value: "#d1fae5" },
            200: { value: "#a7f3d0" },
            300: { value: "#6ee7b7" },
            400: { value: "#34d399" },
            500: { value: "#10b981" },
            600: { value: "#059669" },
            700: { value: "#047857" },
            800: { value: "#065f46" },
            900: { value: "#064e3b" }
          },
          
          // Neutral colors
          neutral: {
            50: { value: "#f8fafc" },
            100: { value: "#f1f5f9" },
            200: { value: "#e2e8f0" },
            300: { value: "#cbd5e1" },
            400: { value: "#94a3b8" },
            500: { value: "#64748b" },
            600: { value: "#475569" },
            700: { value: "#334155" },
            800: { value: "#1e293b" },
            900: { value: "#0f172a" }
          },
          
          // Semantic colors
          success: { value: "#10b981" },
          warning: { value: "#f59e0b" },
          error: { value: "#ef4444" },
          info: { value: "#06b6d4" }
        },
        
        fonts: {
          sans: { value: ["Inter", "system-ui", "sans-serif"] },
          serif: { value: ["Georgia", "serif"] },
          mono: { value: ["Fira Code", "monospace"] }
        },
        
        fontSizes: {
          xs: { value: "0.75rem" },
          sm: { value: "0.875rem" },
          md: { value: "1rem" },
          lg: { value: "1.125rem" },
          xl: { value: "1.25rem" },
          "2xl": { value: "1.5rem" },
          "3xl": { value: "1.875rem" },
          "4xl": { value: "2.25rem" },
          "5xl": { value: "3rem" }
        },
        
        spacing: {
          xs: { value: "0.5rem" },
          sm: { value: "0.75rem" },
          md: { value: "1rem" },
          lg: { value: "1.5rem" },
          xl: { value: "2rem" },
          "2xl": { value: "3rem" },
          "3xl": { value: "4rem" }
        },
        
        radii: {
          none: { value: "0" },
          sm: { value: "0.375rem" },
          md: { value: "0.5rem" },
          lg: { value: "0.75rem" },
          xl: { value: "1rem" },
          "2xl": { value: "1.5rem" },
          full: { value: "9999px" }
        },

        // Animation durations for motion
        durations: {
          fast: { value: "150ms" },
          normal: { value: "300ms" },
          slow: { value: "500ms" },
          slower: { value: "750ms" }
        },

        // Easing curves for smooth animations
        easings: {
          ease: { value: "cubic-bezier(0.4, 0, 0.2, 1)" },
          easeIn: { value: "cubic-bezier(0.4, 0, 1, 1)" },
          easeOut: { value: "cubic-bezier(0, 0, 0.2, 1)" },
          easeInOut: { value: "cubic-bezier(0.4, 0, 0.2, 1)" },
          spring: { value: "cubic-bezier(0.68, -0.55, 0.265, 1.55)" }
        }
      }
    }
  },

  // The output directory for your css system
  outdir: "styled-system",

  // Conditions for responsive and theme variants
  conditions: {
    light: "[data-color-mode=light] &",
    dark: "[data-color-mode=dark] &",
    hover: "&:hover",
    focus: "&:focus",
    active: "&:active",
    disabled: "&:disabled"
  }
})

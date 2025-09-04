import { defineConfig } from "@pandacss/dev";

export default defineConfig({
  // Prefabs
  preflight: false,
  jsxFramework: "react",
  
  // Tokens vetëm - jo utility classes
  theme: {
    extend: {
      tokens: {
        colors: {
          // Industrial Royal Theme
          bg: { value: "#0b1220" },
          panel: { value: "#0f172a" },
          surface: { value: "#111827" },
          card: { value: "#1e293b" },
          
          text: { value: "#e2e8f0" },
          textMuted: { value: "#94a3b8" },
          textDim: { value: "#64748b" },
          
          line: { value: "#1e293b" },
          border: { value: "#334155" },
          
          // Accent colors
          accent: { value: "#60a5fa" },
          royal: { value: "#8b5cf6" },
          indigo: { value: "#6366f1" },
          
          // Status colors
          ok: { value: "#22c55e" },
          warn: { value: "#f59e0b" },
          err: { value: "#ef4444" },
          
          // Node colors for MemoryGraph
          nodeAgi: { value: "rgba(139, 92, 246, 0.55)" },
          nodeCore: { value: "rgba(234, 179, 8, 0.5)" },
          nodeHealth: { value: "rgba(34, 197, 94, 0.4)" },
          nodeError: { value: "rgba(239, 68, 68, 0.4)" },
        },
        
        spacing: {
          1: { value: "4px" },
          2: { value: "8px" },
          3: { value: "12px" },
          4: { value: "16px" },
          5: { value: "20px" },
          6: { value: "24px" },
          8: { value: "32px" },
          10: { value: "40px" },
          12: { value: "48px" },
        },
        
        radii: {
          sm: { value: "4px" },
          md: { value: "8px" },
          lg: { value: "12px" },
          xl: { value: "16px" },
          full: { value: "9999px" },
        },
        
        fontSizes: {
          xs: { value: "10px" },
          sm: { value: "12px" },
          md: { value: "14px" },
          lg: { value: "16px" },
          xl: { value: "18px" },
          "2xl": { value: "22px" },
        },
        
        shadows: {
          sm: { value: "0 2px 4px rgba(0, 0, 0, 0.1)" },
          md: { value: "0 4px 12px rgba(0, 0, 0, 0.15)" },
          lg: { value: "0 8px 24px rgba(0, 0, 0, 0.2)" },
        },
      },
    },
  },
  
  // Minimale includes - vetëm për token generation
  include: ["./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}"],
  exclude: [],
  
  // Output directory
  outdir: "styled-system",
  
  // Minimal theme
  utilities: {},
  patterns: {},
});

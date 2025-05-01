import { defineConfig } from "@pandacss/dev"

export const panda = defineConfig({
  theme: {
    extend: {
      tokens: {
        colors: {
          royal: { 50: { value: "#e0f0ff" }, 900: { value: "#002244" } },
          soft: { 100: { value: "#f9f9ff" }, 300: { value: "#d4d4ff" } },
        },
        fonts: {
          heading: { value: "Inter, sans-serif" },
          body: { value: "Inter, sans-serif" },
        },
        radii: {
          xl: { value: "1rem" },
          "2xl": { value: "1.5rem" },
        },
        shadows: {
          soft: { value: "0 4px 12px rgba(0,0,0,0.1)" },
          intense: { value: "0 8px 24px rgba(0,0,0,0.2)" },
        },
      },
    },
  },
  include: ["./components/**/*.{js,ts,jsx,tsx}", "./pages/**/*.{js,ts,jsx,tsx}"],
  exclude: [],
  preflight: true,
})


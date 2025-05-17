import { defineConfig } from "@pandacss/dev"

export const panda = defineConfig({
  theme: {
    extend: {
      tokens: {
        colors: {
          primary: { 50: { value: "#f0faff" }, 900: { value: "#003366" } },
          secondary: { 100: { value: "#e6f7ff" }, 300: { value: "#99d6ff" } },
          accent: { 500: { value: "#ff6600" }, 700: { value: "#cc5200" } },
        },
        fonts: {
          heading: { value: "Poppins, sans-serif" },
          body: { value: "Roboto, sans-serif" },
        },
        radii: {
          xl: { value: "1.25rem" },
          "2xl": { value: "2rem" },
        },
        shadows: {
          soft: { value: "0 4px 16px rgba(0,0,0,0.1)" },
          intense: { value: "0 8px 32px rgba(0,0,0,0.25)" },
        },
      },
    },
  },
  include: ["./components/**/*.{js,ts,jsx,tsx}", "./pages/**/*.{js,ts,jsx,tsx}"],
  exclude: [],
  preflight: true,
})


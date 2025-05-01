import { defineConfig } from "@pandacss/dev"

export const config = defineConfig({
  theme: {
    extend: {},
  },
  include: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  outdir: "styled-system",
})

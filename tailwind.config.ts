/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      animation: {
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'ping': 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite',
        'bounce': 'bounce 1s infinite',
      },
      boxShadow: {
        'glow-green': '0 0 20px rgba(34, 197, 94, 0.5)',
        'glow-yellow': '0 0 20px rgba(234, 179, 8, 0.5)',
        'glow-red': '0 0 20px rgba(239, 68, 68, 0.5)',
        'glow-blue': '0 0 20px rgba(59, 130, 246, 0.5)',
      },
      backdropBlur: {
        xs: '2px',
      },
      width: {
        '30': '7.5rem',
      },
      height: {
        '20': '5rem',
      }
    },
  },
  plugins: [],
}

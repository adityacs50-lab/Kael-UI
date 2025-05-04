/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyan: {
          400: '#00C6FF',
          500: '#00A3FF',
          700: '#0077CC',
          900: '#005599',
        },
        purple: {
          500: '#9F5FFF',
        },
      },
      fontFamily: {
        'mono': ['JetBrains Mono', 'monospace'],
        'orbitron': ['Orbitron', 'sans-serif'],
      },
      animation: {
        'slow-spin': 'slow-spin 20s linear infinite',
        'reverse-spin': 'reverse-spin 30s linear infinite',
        'scanner-line': 'scanner-line 3s ease-in-out infinite',
        'scanner-line-vertical': 'scanner-line-vertical 3s ease-in-out infinite',
        'scanner-diagonal': 'scanner-diagonal 4s ease-in-out infinite',
        'scanner-diagonal-reverse': 'scanner-diagonal-reverse 4s ease-in-out infinite',
        'orbit': 'orbit 12s linear infinite',
        'orbit-slow': 'orbit-slow 20s linear infinite',
        'orbit-reverse': 'orbit-reverse 15s linear infinite',
        'pulse-slow': 'pulse-slow 2s ease-in-out infinite',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
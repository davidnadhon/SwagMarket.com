/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          orange: '#f59e0b',
          'orange-dark': '#d97706',
          black: '#0a0a0a',
          'gray-900': '#111111',
          'gray-800': '#1a1a1a',
          'gray-700': '#2a2a2a',
          'gray-600': '#3a3a3a',
          'gray-400': '#888888',
          'gray-300': '#aaaaaa',
        },
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        'pulse-orange': 'pulse-orange 2s ease-in-out infinite',
        'scan': 'scan 2s linear infinite',
      },
      keyframes: {
        'pulse-orange': {
          '0%, 100%': { boxShadow: '0 0 5px #f59e0b, 0 0 10px #f59e0b' },
          '50%': { boxShadow: '0 0 20px #f59e0b, 0 0 40px #f59e0b' },
        },
        'scan': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
      },
    },
  },
  plugins: [],
}


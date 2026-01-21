/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
      },
      colors: {
        royal: {
          DEFAULT: '#1E3A8A', // Deep blue
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#3B82F6',
          dark: '#172554', // Very dark blue (almost black)
          surface: '#1e293b', // Dark blue-grey for cards
          text: '#e2e8f0', // Light grey for text
        },
        orange: {
          DEFAULT: '#F97316',
          dark: '#EA580C',
        },
        whatsapp: {
          DEFAULT: '#25D366',
          hover: '#128C7E',
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'fade-right': 'fadeRight 0.5s ease-out forwards',
        'slide-up': 'slideUp 0.5s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeRight: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}

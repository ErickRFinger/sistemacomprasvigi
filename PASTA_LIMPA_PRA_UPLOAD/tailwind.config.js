/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        royal: {
          DEFAULT: '#1E3A8A', // Deep blue
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
      }
    },
  },
  plugins: [],
}

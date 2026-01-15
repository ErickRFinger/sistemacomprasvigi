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
          DEFAULT: '#4169E1',
          dark: '#27408B', // Darker Royal Blue
          darker: '#102A43',
          background: '#D4E2F7', // Lighter blue for background "not too light"
        },
        orange: {
          DEFAULT: '#FF8C00', // Dark Orange
          dark: '#E65100', // Darker
        },
        whatsapp: {
          DEFAULT: '#25D366',
          dark: '#128C7E',
        }
      }
    },
  },
  plugins: [],
}

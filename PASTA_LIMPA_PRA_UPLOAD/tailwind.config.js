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
        },
        orange: {
          DEFAULT: '#FF8C00', // Dark Orange
          dark: '#E65100', // Darker
        }
      }
    },
  },
  plugins: [],
}

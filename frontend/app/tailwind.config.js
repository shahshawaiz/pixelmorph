/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}', // Next.js pages
    './components/**/*.{js,ts,jsx,tsx}', // Any components directory
  ],
  theme: {
    extend: {
      colors: {
        primary: '#283593', // Deep Blue
        secondary: '#5C6BC0', // Lighter Blue
        accent: '#FFD700', // Golden Yellow for highlights
        background: '#F5F7FA', // Light Gray for the main background
        textPrimary: '#333333', // Dark Gray for main text
        textSecondary: '#666666', // Medium Gray for secondary text
      },
      fontFamily: {
        sans: ['Roboto', 'sans-serif'], // Professional Sans Serif Font
        display: ['Montserrat', 'sans-serif'], // Modern Display Font
      },
    },
  },
  plugins: [],
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1e40af',   // blue-800
        secondary: '#374151', // gray-700
        accent: '#60a5fa',    // blue-400
        light: '#f3f4f6',     // gray-100
        dark: '#1f2937',      // gray-800
        darker: '#111827',    // gray-900
      },
    },
  },
  plugins: [],
}
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: "#0284C7",
          sky: "#3B82F6",
          orange: "#FF9F1C",
          yellow: "#F59E0B",
          green: "#10B981",
          pink: "#EC4899",
          purple: "#8B5CF6",
          dark: "#0F172A"
        }
      },
      fontFamily: {
        sans: ['Nunito', 'Segoe UI', 'sans-serif'],
        fredoka: ['Fredoka', 'Nunito', 'sans-serif']
      }
    },
  },
  plugins: [],
}

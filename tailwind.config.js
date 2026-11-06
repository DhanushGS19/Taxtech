/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        phonepe: {
          primary: '#5F259F',
          dark: '#35145F',
          secondary: '#8B4DCC',
          bg: '#F6F3FA',
          darkSurface: '#21152D',
          darkBg: '#180E24',
          card: '#FFFFFF',
          darkCard: '#2A1C39',
          success: '#16A36A',
          warning: '#F4A62A',
          border: '#E8E1F2',
          darkBorder: '#3D2854',
          textMuted: '#7A6B8A',
          darkTextMuted: '#AFA4BF'
        },
        fintech: {
          primary: '#5F259F',
          secondary: '#35145F',
          dark: '#172033',
          slate: '#718096',
          light: '#8B4DCC',
          soft: '#F6F3FA',
          bg: '#F6F3FA',
          card: '#FFFFFF',
          success: '#16A36A',
          warning: '#E9A23B',
          danger: '#DC2626',
          border: '#E2E8F0'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}

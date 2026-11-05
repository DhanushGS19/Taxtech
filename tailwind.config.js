/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        fintech: {
          primary: '#5F259F', // Deep Royal Purple
          secondary: '#35145F', // Dark Violet
          dark: '#172033', // Dark Navy primary text
          slate: '#718096', // Slate Grey secondary text
          light: '#7A38BE',
          soft: '#F3EEF9',
          bg: '#F8F9FC', // Soft Neutral
          card: '#FFFFFF',
          success: '#16A36A', // Green
          warning: '#E9A23B', // Amber
          danger: '#DC2626',
          border: '#E2E8F0'
        },
        pay: {
          50: '#eef2ff',
          100: '#e0e7ff',
          500: '#4f46e5',
          600: '#4338ca',
          700: '#3730a3',
          800: '#312e81',
          900: '#1e1b4b'
        },
        gpay: {
          blue: '#1a73e8',
          green: '#0f9d58',
          yellow: '#f4b400',
          red: '#ea4335'
        },
        saathi: {
          50: '#f0fdf4',
          100: '#dcfce7',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}


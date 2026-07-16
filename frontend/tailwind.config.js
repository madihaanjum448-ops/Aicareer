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
          lightBlue: '#EAF4FF',
          lavender: '#F3EEFF',
          purple: '#8B5CF6',
          indigo: '#6366F1',
          blue: '#3B82F6',
          darkBlue: '#1D4ED8',
          slate: '#0F172A',
          card: 'rgba(255, 255, 255, 0.7)',
        }
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.04)',
        'glass-hover': '0 8px 32px 0 rgba(31, 38, 135, 0.08)',
      },
      borderRadius: {
        '2xl': '20px',
        '3xl': '24px',
      }
    },
  },
  plugins: [],
}

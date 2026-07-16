/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Inter', 'system-ui', 'sans-serif'],
      },
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
          violet: '#7C3AED',
          rose: '#F43F5E',
          teal: '#14B8A6',
          amber: '#F59E0B',
          soft: '#F8F7FF',
        }
      },
      backdropBlur: {
        xs: '2px',
        '4xl': '80px',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.04)',
        'glass-hover': '0 16px 48px 0 rgba(31, 38, 135, 0.10)',
        'glow-indigo': '0 0 40px rgba(99, 102, 241, 0.25)',
        'glow-purple': '0 0 40px rgba(139, 92, 246, 0.25)',
        'glow-sm': '0 0 20px rgba(99, 102, 241, 0.15)',
        'card-premium': '0 4px 24px rgba(99, 102, 241, 0.08), 0 1px 3px rgba(0,0,0,0.05)',
        'card-hover': '0 20px 60px rgba(99, 102, 241, 0.15), 0 2px 8px rgba(0,0,0,0.06)',
        'nav': '0 1px 0 rgba(255,255,255,0.6), 0 4px 24px rgba(31,38,135,0.06)',
      },
      borderRadius: {
        '2xl': '20px',
        '3xl': '24px',
        '4xl': '32px',
      },
      animation: {
        'gradient-shift': 'gradient-shift 8s ease infinite',
        'blob-float': 'blob-float 12s ease-in-out infinite',
        'blob-float-delay': 'blob-float 16s ease-in-out infinite 4s',
        'particle-drift': 'particle-drift 20s ease-in-out infinite',
        'fade-up': 'fade-up 0.6s ease forwards',
        'slide-in-right': 'slide-in-right 0.5s ease forwards',
        'glow-pulse': 'glow-pulse 3s ease-in-out infinite',
        'spin-slow': 'spin 80s linear infinite',
        'spin-reverse': 'spin-reverse 120s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'float-delayed': 'float 6s ease-in-out infinite 2s',
        'float-slow': 'float 8s ease-in-out infinite 1s',
        'typing': 'typing 1.2s steps(3) infinite',
        'counter-up': 'counter-up 1s ease forwards',
        'shimmer': 'shimmer 2s infinite',
      },
      keyframes: {
        'gradient-shift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        'blob-float': {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '33%': { transform: 'translate(30px, -30px) scale(1.08)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.95)' },
        },
        'particle-drift': {
          '0%, 100%': { transform: 'translateY(0) translateX(0) rotate(0deg)' },
          '25%': { transform: 'translateY(-20px) translateX(10px) rotate(5deg)' },
          '75%': { transform: 'translateY(10px) translateX(-15px) rotate(-3deg)' },
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in-right': {
          '0%': { opacity: '0', transform: 'translateX(24px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(99, 102, 241, 0.2)' },
          '50%': { boxShadow: '0 0 40px rgba(99, 102, 241, 0.4), 0 0 80px rgba(139, 92, 246, 0.15)' },
        },
        'spin-reverse': {
          '0%': { transform: 'rotate(360deg)' },
          '100%': { transform: 'rotate(0deg)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        'typing': {
          '0%': { content: '.' },
          '33%': { content: '..' },
          '66%': { content: '...' },
          '100%': { content: '.' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
}

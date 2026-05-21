/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Geist', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['Geist Mono', 'ui-monospace', 'monospace'],
        serif: ['"Instrument Serif"', 'Georgia', 'serif'],
      },
      colors: {
        ink: {
          950: '#08080B',
          900: '#0C0C10',
          800: '#111116',
          700: '#16161D',
          600: '#1C1C25',
          500: '#24242F',
        },
        aurora: {
          cyan: '#22D3EE',
          blue: '#3B82F6',
          violet: '#8B5CF6',
          pink: '#EC4899',
        },
      },
      backgroundImage: {
        'grad-aurora':
          'linear-gradient(135deg, #22D3EE 0%, #3B82F6 50%, #8B5CF6 100%)',
        'grad-aurora-soft':
          'linear-gradient(135deg, rgba(34,211,238,0.15) 0%, rgba(59,130,246,0.15) 50%, rgba(139,92,246,0.15) 100%)',
        'grid-dark':
          'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
        'grid-light':
          'linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px)',
      },
      backgroundSize: {
        grid: '56px 56px',
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(255,255,255,0.06), 0 20px 60px -20px rgba(59,130,246,0.35)',
        'glow-strong':
          '0 0 0 1px rgba(255,255,255,0.08), 0 30px 80px -20px rgba(139,92,246,0.45)',
        soft: '0 10px 40px -10px rgba(0,0,0,0.5)',
      },
      animation: {
        'aurora-1': 'aurora1 18s ease-in-out infinite',
        'aurora-2': 'aurora2 22s ease-in-out infinite',
        'aurora-3': 'aurora3 26s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        shimmer: 'shimmer 2.2s linear infinite',
      },
      keyframes: {
        aurora1: {
          '0%, 100%': { transform: 'translate(0,0) scale(1)' },
          '50%': { transform: 'translate(40px,-30px) scale(1.1)' },
        },
        aurora2: {
          '0%, 100%': { transform: 'translate(0,0) scale(1)' },
          '50%': { transform: 'translate(-30px,40px) scale(1.15)' },
        },
        aurora3: {
          '0%, 100%': { transform: 'translate(0,0) scale(1)' },
          '50%': { transform: 'translate(20px,20px) scale(0.95)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
}

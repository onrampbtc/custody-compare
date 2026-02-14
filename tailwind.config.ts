import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // BlackRock-inspired institutional palette
        navy: {
          DEFAULT: '#0C1821',
          dark: '#060D13',
          light: '#1B2D3E',
        },
        // Primary brand green (institutional, trustworthy)
        brand: {
          DEFAULT: '#00856F',
          dark: '#006B59',
          light: '#00A68A',
          50: '#E6F7F4',
          100: '#B3E8DE',
          200: '#80D9C9',
          500: '#00856F',
          600: '#006B59',
          700: '#005244',
          900: '#002A22',
        },
        accent: {
          DEFAULT: '#00856F',
          gold: '#C9A227',
          emerald: '#059669',
        },
        'btc-orange': '#F7931A',
        'score-green': '#059669',
        'score-blue': '#0284C7',
        'score-yellow': '#D97706',
        'score-orange': '#EA580C',
        'score-red': '#DC2626',
        'bg-light': '#F8FAFB',
        'bg-section': '#F1F5F4',
        'text-body': '#4B5563',
        'text-heading': '#111827',
        'text-muted': '#9CA3AF',
        border: '#E5E7EB',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'monospace'],
        display: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        '2xs': '0.625rem',
        'hero': ['3.5rem', { lineHeight: '1.1', letterSpacing: '-0.03em' }],
        'hero-lg': ['4.5rem', { lineHeight: '1.05', letterSpacing: '-0.03em' }],
      },
      boxShadow: {
        'soft': '0 1px 3px 0 rgba(0,0,0,0.04), 0 1px 2px -1px rgba(0,0,0,0.03)',
        'card': '0 4px 6px -1px rgba(0,0,0,0.03), 0 2px 4px -2px rgba(0,0,0,0.03)',
        'card-hover': '0 20px 25px -5px rgba(0,0,0,0.05), 0 8px 10px -6px rgba(0,0,0,0.04)',
        'elevated': '0 25px 50px -12px rgba(0,0,0,0.08)',
        'glow-green': '0 0 20px rgba(0, 133, 111, 0.15)',
        'glow-gold': '0 0 20px rgba(201, 162, 39, 0.12)',
        'inner-light': 'inset 0 1px 0 rgba(255,255,255,0.1)',
        'score': '0 2px 8px rgba(0,0,0,0.08)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      animation: {
        'score-pop': 'scorePop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'fade-up': 'fadeUp 0.6s ease-out both',
        'fade-in': 'fadeIn 0.6s ease-out both',
        'slide-up': 'slideUp 0.4s ease-out both',
        'pulse-subtle': 'pulseSubtle 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s ease-in-out infinite',
      },
      keyframes: {
        scorePop: {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '60%': { transform: 'scale(1.05)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        shimmer: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'grid-pattern': "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg stroke='%23E5E7EB' stroke-width='0.5'%3E%3Cpath d='M0 0h60v60H0z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [],
}

export default config

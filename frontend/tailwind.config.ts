import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        ghost: '#F8F8FF',
        clerk: {
          purple:       '#6C47FF',
          'purple-hover': '#5D3BE8',
          'purple-dark':  '#4F35CC',
          lavender:     '#EDE8FF',
          'lavender-soft': '#F5F3FF',
          dark:         '#1A1035',
          muted:        '#6B6490',
          border:       '#D9D3F0',
        },
        indigo: {
          50: '#EEF2FF',
          100: '#E0E7FF',
          500: '#6366F1',
          600: '#4F46E5',
          700: '#4338CA',
        },
      },
      borderRadius: {
        lg: '0.5rem',
        md: '0.375rem',
        sm: '0.25rem',
      },
    },
  },
  plugins: [],
}

export default config

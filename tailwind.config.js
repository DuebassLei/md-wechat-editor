/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts}'],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: 'rgb(var(--ink-rgb) / <alpha-value>)',
          soft: 'rgb(var(--ink-soft-rgb) / <alpha-value>)',
          muted: 'rgb(var(--ink-muted-rgb) / <alpha-value>)',
          faint: 'rgb(var(--ink-faint-rgb) / <alpha-value>)',
        },
        paper: {
          DEFAULT: 'rgb(var(--paper-rgb) / <alpha-value>)',
          bright: 'rgb(var(--paper-bright-rgb) / <alpha-value>)',
          dim: 'rgb(var(--paper-dim-rgb) / <alpha-value>)',
          deep: 'rgb(var(--paper-deep-rgb) / <alpha-value>)',
          line: 'rgb(var(--paper-line-rgb) / <alpha-value>)',
        },
        cinnabar: {
          DEFAULT: 'rgb(var(--cinnabar-rgb) / <alpha-value>)',
          dark: 'rgb(var(--cinnabar-dark-rgb) / <alpha-value>)',
          light: 'rgb(var(--cinnabar-light-rgb) / <alpha-value>)',
        },
        jade: {
          DEFAULT: 'rgb(var(--jade-rgb) / <alpha-value>)',
          light: 'rgb(var(--jade-light-rgb) / <alpha-value>)',
          dark: 'rgb(var(--jade-dark-rgb) / <alpha-value>)',
        },
        gold: {
          DEFAULT: 'rgb(var(--gold-rgb) / <alpha-value>)',
          light: 'rgb(var(--gold-light-rgb) / <alpha-value>)',
          dark: 'rgb(var(--gold-dark-rgb) / <alpha-value>)',
        },
      },
      fontFamily: {
        sans: ['"Inter"', '"Noto Sans SC"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(var(--color-shadow-ink), 0.04), 0 8px 24px rgba(var(--color-shadow-ink), 0.06)',
        'card-hover':
          '0 4px 6px rgba(var(--color-shadow-ink), 0.04), 0 20px 40px rgba(var(--color-shadow-ink), 0.08)',
        pop: '0 4px 14px rgba(var(--color-shadow-cinnabar), 0.35)',
      },
    },
  },
  plugins: [],
}

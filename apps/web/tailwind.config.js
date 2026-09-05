/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'var(--color-primary)',
          hover: 'var(--color-primary-hover)',
          soft: 'var(--color-primary-soft)',
        },
        accent: {
          DEFAULT: 'var(--color-accent)',
          soft: 'var(--color-accent-soft)',
        },
        surface: {
          DEFAULT: 'var(--color-surface)',
          muted: 'var(--color-surface-muted)',
        },
        border: {
          DEFAULT: 'var(--color-border)',
          strong: 'var(--color-border-strong)',
        },
        ink: {
          DEFAULT: 'var(--color-text)',
          secondary: 'var(--color-text-secondary)',
          muted: 'var(--color-muted)',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)'],
        display: ['var(--font-display)'],
      },
      boxShadow: {
        soft: 'var(--shadow-sm)',
        panel: 'var(--shadow-md)',
        lift: 'var(--shadow-lg)',
      },
      borderRadius: {
        panel: 'var(--radius-lg)',
      },
      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
}

import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './contexts/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: 'var(--color-background)',
        foreground: 'var(--color-text)',
        primary: 'var(--color-primary)',
        invert: 'var(--color-invert)',
        secondary: 'var(--color-secondary)',
        darker: 'var(--color-darker)',
        muted: 'var(--color-text-muted)',
        highlight: 'var(--color-highlight)',
        cta: 'var(--color-cta)',
        border: 'var(--color-border)',
      },
      fontFamily: {
        sans: ['Outfit', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;

import type { Config } from 'tailwindcss'

const config = {
  darkMode: 'class',
  content: ['./app/**/*.{ts,tsx,js,jsx,mdx}'],
  theme: {
    extend: {
      colors: {
        transparent: 'transparent',
        current: 'currentColor',
        background: 'var(--color-background)',
        surface: {
          DEFAULT: 'var(--color-surface)',
          muted: 'var(--color-surface-muted)',
          elevated: 'var(--color-surface-elevated)',
          inverse: 'var(--color-surface-inverse)',
        },
        border: {
          DEFAULT: 'var(--color-border)',
          muted: 'var(--color-border-muted)',
          strong: 'var(--color-border-strong)',
        },
        foreground: {
          DEFAULT: 'var(--color-text-primary)',
          secondary: 'var(--color-text-secondary)',
          subtle: 'var(--color-text-subtle)',
          muted: 'var(--color-text-muted)',
          inverse: 'var(--color-text-inverse)',
        },
        primary: {
          DEFAULT: 'var(--color-primary)',
          emphasis: 'var(--color-primary-emphasis)',
          soft: 'var(--color-primary-soft)',
          foreground: 'var(--color-primary-foreground)',
        },
        accent: {
          DEFAULT: 'var(--color-accent)',
          soft: 'var(--color-accent-soft)',
          foreground: 'var(--color-accent-foreground)',
        },
        highlight: 'var(--color-highlight)',
        ring: 'var(--color-ring)',
        overlay: 'var(--color-overlay)',
      },
      spacing: {
        '0': 'var(--space-0)',
        '1': 'var(--space-1)',
        '2': 'var(--space-2)',
        '3': 'var(--space-3)',
        '3.5': 'var(--space-3-5)',
        '4': 'var(--space-4)',
        '5': 'var(--space-5)',
        '6': 'var(--space-6)',
        '8': 'var(--space-8)',
        '10': 'var(--space-10)',
        '12': 'var(--space-12)',
        '14': 'var(--space-14)',
        '16': 'var(--space-16)',
        '20': 'var(--space-20)',
        '24': 'var(--space-24)',
      },
      borderRadius: {
        none: 'var(--radius-none)',
        sm: 'var(--radius-sm)',
        DEFAULT: 'var(--radius-md)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
        '2xl': 'var(--radius-2xl)',
        '3xl': 'var(--radius-3xl)',
        full: 'var(--radius-full)',
      },
      boxShadow: {
        DEFAULT: 'var(--shadow-sm)',
        xs: 'var(--shadow-xs)',
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
        xl: 'var(--shadow-xl)',
        focus: 'var(--shadow-focus)',
      },
      fontSize: {
        xs: ['var(--font-size-xs)', 'var(--line-height-snug)'],
        sm: ['var(--font-size-sm)', 'var(--line-height-normal)'],
        base: ['var(--font-size-base)', 'var(--line-height-normal)'],
        lg: ['var(--font-size-lg)', 'var(--line-height-relaxed)'],
        xl: ['var(--font-size-xl)', 'var(--line-height-relaxed)'],
        '2xl': ['var(--font-size-2xl)', 'var(--line-height-relaxed)'],
        '3xl': ['var(--font-size-3xl)', 'var(--line-height-tight)'],
        '4xl': ['var(--font-size-4xl)', 'var(--line-height-tight)'],
        '5xl': ['var(--font-size-5xl)', 'var(--line-height-tight)'],
        '6xl': ['var(--font-size-6xl)', 'var(--line-height-tight)'],
      },
      keyframes: {
        typing: {
          '0%': { width: '0' },
          '100%': { width: 'var(--typing-width)' },
        },
      },
      animation: {
        typing: 'typing 2s steps(20) infinite alternate',
      },
    },
  },
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  plugins: [require('tailwind-scrollbar-hide')],
} satisfies Config

export default config

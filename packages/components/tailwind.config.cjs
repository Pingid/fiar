const typography = require('@tailwindcss/typography')
const path = require('path')

const light = {
  '--color-back': `0deg 0% 100%`,
  '--color-frame': `0deg 0% 96%`,
  '--color-front': `0deg 0% 20%`,
  '--color-line': `0deg 0% 88%`,
  '--color-line-focus': `0deg 0% 65%`,

  '--color-active': `255deg 86% 45%`,
  '--color-error': `351deg 78% 62%`,
  '--color-draft': `45.93deg 100% 52.35%`,
  '--color-published': `117deg 50% 42%`,
  '--color-archived': `255deg 131% 25%`,
}

const dark = {
  '--color-back': `0deg 0% 8%`,
  '--color-frame': `0deg 0% 12%`,
  '--color-front': `0deg 0% 101%`,
  '--color-line': `0deg 0% 23%`,

  '--color-active': `195deg 100% 50%`,
}

const base = {
  ':root': { ...light, '--border-radius': `2px`, '--font-sans': `'Inter', system-ui, sans-serif` },
  '@media (prefers-color-scheme: dark)': { ':root': dark },
  '[data-theme="light"]': light,
  '[data-theme="dark"]': dark,
  html: {
    'background-color': `hsl(var(--color-back) / 1)`,
    color: `hsl(var(--color-front) / 1)`,
    fontFamily: `var(--font-sans)`,
  },
}

module.exports = {
  content: [path.join(__dirname, './src/**/*.{ts,tsx}')],
  darkMode: ['class', 'media'],
  theme: {
    extend: {
      fontFamily: { sans: 'var(--font-sans)' },
      borderRadius: { DEFAULT: 'var(--border-radius)' },
      borderColor: { DEFAULT: 'hsl(var(--color-line) / 1)' },
      rotate: { 270: '270deg' },
      colors: {
        back: { DEFAULT: 'hsl(var(--color-back) / <alpha-value>)' },
        frame: { DEFAULT: 'hsl(var(--color-frame) / <alpha-value>)' },
        front: { DEFAULT: 'hsl(var(--color-front) / <alpha-value>)' },
        line: {
          DEFAULT: 'hsl(var(--color-line) / <alpha-value>)',
          focus: 'hsl(var(--color-line-focus) / <alpha-value>)',
        },
        active: { DEFAULT: 'hsl(var(--color-active) / <alpha-value>)' },
        error: { DEFAULT: 'hsl(var(--color-error) / <alpha-value>)' },
        draft: { DEFAULT: 'hsl(var(--color-draft) / <alpha-value>)' },
        published: { DEFAULT: 'hsl(var(--color-published) / <alpha-value>)' },
        archived: { DEFAULT: 'hsl(var(--color-archived) / <alpha-value>)' },
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme('colors.front'),
            '--tw-prose-bold': theme('colors.front'),
            '--tw-prose-body': theme('colors.front'),
            '--tw-prose-links': theme('colors.front'),
            '--tw-prose-headings': theme('colors.front'),
            a: {
              color: theme('colors.front'),
              '&:hover': { color: theme('colors.active') },
            },
          },
        },
      }),
    },
  },
  plugins: [{ handler: (x) => x.addBase(base) }, typography],
}

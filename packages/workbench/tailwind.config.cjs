const typography = require('@tailwindcss/typography')
const { nextui } = require('@nextui-org/react')
const path = require('path')

const light = {
  '0deg 0% 100%': `0deg 0% 100%`,
  '--color-frame': `0deg 0% 96%`,
  '--color-front': `0deg 0% 20%`,
  '--color-line': `0deg 0% 88%`,
  '--color-line-focus': `0deg 0% 65%`,

  '--color-active': `255deg 86% 45%`,
  '--color-error': `351deg 78% 62%`,
  '--color-draft': `45.93deg 100% 52.35%`,
  '--color-published': `117deg 50% 42%`,
  '--color-archived': `255deg 131% 25%`,
  // ...theme,
}

const dark = {
  '0deg 0% 100%': `0deg 0% 8%`,
  '--color-frame': `0deg 0% 12%`,
  '--color-front': `0deg 0% 101%`,
  '--color-line': `0deg 0% 23%`,

  '--color-active': `195deg 100% 50%`,
}

const nextuiPlugin = nextui({
  themes: {
    light: {
      extend: 'light',
      colors: {
        foreground: `hsl(0deg 0% 20% / 1)`,
        background: `hsl(0deg 0% 100% / 1)`,
        primary: 'hsl(255deg 86% 45% / 1)',
        danger: 'hsl(351deg 78% 62% / 1)',
        warning: 'hsl(45.93deg 100% 52.35% / 1)',
        success: 'hsl(117deg 50% 42% / 1)',
      },
    },
    dark: {
      extend: 'dark',
      colors: {
        background: `hsl(0deg 1% 8% / 1)`,
        foreground: 'hsl(0deg 0% 101% / 1)',
        primary: 'hsl(195deg 100% 50% / 1)',
        danger: 'hsl(351deg 78% 62% / 1)',
        warning: 'hsl(45.93deg 100% 52.35% / 1)',
        success: 'hsl(117deg 50% 42% / 1)',
      },
    },
  },
  layout: {
    hoverOpacity: '1',
    radius: { small: '0', medium: '0', large: '0' },
    borderWidth: { small: '1px', medium: '1px', large: 'none' },
    boxShadow: { small: '', medium: '', large: '' },
  },
})

module.exports = {
  theme: {
    extend: {
      borderColor: { DEFAULT: 'hsl(var(--nextui-foreground) / .2)' },
      colors: {
        back: 'hsl(var(--nextui-background) / <alpha-value>)',
        front: 'hsl(var(--nextui-foreground) / <alpha-value>)',
        active: 'hsl(var(--nextui-primary) / <alpha-value>)',
        error: 'hsl(var(--nextui-danger) / <alpha-value>)',
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
  content: [
    path.join(__dirname, './src/**/*.{ts,tsx}'),
    path.join(require.resolve('@nextui-org/theme'), '../**/*.{js,ts,jsx,tsx}'),
  ],
  plugins: [nextuiPlugin, typography],
}

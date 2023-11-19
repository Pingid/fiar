import type { Config } from 'tailwindcss'

export const light = {
  front: '51 51 51',
  'front-lt': '235 236 241',
  back: '255 255 255',

  active: '67 16 214',
  error: '233 81 103',
  draft: '255 198 12',
  published: '61 160 53',
  archived: '255 131 25',
}

export const dark = {
  ...light,
  front: light.back,
  back: light.front,
  active: '112 189 255',
  error: '247 86 122',
}

export const tailwindTheme = {
  fontFamily: {
    sans: ['Inter', 'sans-serif'],
  },
  fontSize: {
    sm: ['0.875rem', { lineHeight: '1.6rem' }],
    base: ['1rem', { lineHeight: '1.8rem' }],
  },
  colors: {
    ...Object.fromEntries(Object.keys(light).map((key) => [key, `rgb(var(--color-${key}) / <alpha-value>)`])),
  } as { [K in keyof typeof light]: `rgb(var(--color-${K}) / <alpha-value>)` },
  typography: (theme: any) => ({
    DEFAULT: {
      css: {
        color: theme('colors.front'),
        '--tw-prose-bold': theme('colors.front'),
        '--tw-prose-body': theme('colors.front'),
        '--tw-prose-headings': theme('colors.front'),
        a: {
          color: theme('colors.front'),
          '&:hover': { color: theme('colors.active') },
        },
      },
    },
  }),
} satisfies Config['theme']

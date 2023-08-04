import type { PluginCreator } from 'tailwindcss/types/config'
import type { Config } from 'tailwindcss'

const light = {
  front: '51 51 51',
  'front-lt': '235 236 241',
  back: '255 255 255',

  active: '67 16 214',
  error: '233 81 103',
  draft: '255 198 12',
  published: '61 160 53',
  archived: '255 131 25',
}

const dark = {
  ...light,
  front: light.back,
  back: light.front,
  active: '112 189 255',
  error: '247 86 122',
}

const plugin: { handler: PluginCreator; config: Partial<Config> } = {
  config: {
    theme: {
      extend: {
        fontFamily: {
          sans: ['Inter', 'sans-serif'],
        },
        fontSize: {
          sm: ['0.875rem', { lineHeight: '1.6rem' }],
          base: ['1rem', { lineHeight: '1.8rem' }],
        },
        colors: {
          ...Object.fromEntries(Object.keys(light).map((key) => [key, `rgb(var(--color-${key}) / <alpha-value>)`])),
        },
      },
    },
  },
  handler: (p) => {
    p.addBase({
      ':root': {
        ...Object.fromEntries(Object.entries(light).map(([key, value]) => [`--color-${key}`, value])),
      },
      '*, ::before, ::after': {
        'border-color': `rgb(var(--color-front) / .1)`,
      },
      html: {
        'font-size': '16px',
        'background-color': 'rgb(var(--color-back) / 1)',
        color: 'rgb(var(--color-front) / 1)',
      },
      '@media (prefers-color-scheme: dark)': {
        ':root': {
          ...Object.fromEntries(Object.entries(dark).map(([key, value]) => [`--color-${key}`, value])),
        },
      },
      "[data-theme='dark']": {
        ...Object.fromEntries(Object.entries(dark).map(([key, value]) => [`--color-${key}`, value])),
      },
      "[data-theme='light']": {
        ...Object.fromEntries(Object.entries(light).map(([key, value]) => [`--color-${key}`, value])),
      }
    } as any)
  },
}

export default plugin

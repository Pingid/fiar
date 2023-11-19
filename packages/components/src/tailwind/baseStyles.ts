import type { PluginCreator } from 'tailwindcss/types/config.js'
import type { Config } from 'tailwindcss'

import { dark, light } from '../theme/index.js'

const baseStyles: { handler: PluginCreator; config: Partial<Config> } = {
  config: {},
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
      },
    } as any)
  },
}

export default baseStyles

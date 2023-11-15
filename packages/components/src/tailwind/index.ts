import typography from '@tailwindcss/typography'
import type { Config } from 'tailwindcss'
import plugin from './plugin.js'

export default {
  content: [],
  theme: {
    extend: {
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
    },
  },
  plugins: [plugin, typography],
} satisfies Config

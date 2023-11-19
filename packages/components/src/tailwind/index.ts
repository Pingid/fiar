import typography from '@tailwindcss/typography'
import type { Config } from 'tailwindcss'

import { tailwindTheme } from '../theme/index.js'
import baseStyles from './baseStyles.js'

export default {
  content: [],
  theme: { extend: { ...tailwindTheme } },
  plugins: [baseStyles, typography],
} satisfies Config

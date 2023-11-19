import type { Config } from 'tailwindcss'
import config from './tailwind/index.js'

const _config = {
  ...config,
  content: ['./src/**/*.{ts,tsx}'],
} satisfies Config

export default _config

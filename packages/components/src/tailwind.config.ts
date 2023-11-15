import type { Config } from 'tailwindcss'
import config from './tailwind/index.js'

const _config: Config = {
  ...config,
  content: ['./src/**/*.{ts,tsx}'],
}

export default _config

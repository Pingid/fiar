import type { Config } from 'tailwindcss'
import config from './src/tailwind'

const _config: Config = {
  ...config,
  content: ['./src/**/*.{ts,tsx}'],
}

export default _config

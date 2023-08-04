import type { Config } from 'tailwindcss'
import config from '@fiar/components/tailwind'

const _config: Config = {
  ...config,
  content: [
    './src/**/*.{ts,tsx}',
    '../workbench/src/**/*.{ts,tsx}',
    '../content/src/**/*.{ts,tsx}',
    '../assets/src/**/*.{ts,tsx}',
    '../auth/src/**/*.{ts,tsx}',
  ],
}

export default _config

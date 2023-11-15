import type { Config } from 'tailwindcss'

import config from '@fiar/components/tailwind.config'

const _config: Config = {
  ...config,
  content: ['./src/**/*.{ts,tsx}'],
}

export default _config

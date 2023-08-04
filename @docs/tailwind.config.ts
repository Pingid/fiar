import type { Config } from 'tailwindcss'
import config from '@fiar/ui/tailwind'

const _config: Config = {
  ...config,
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
}

export default _config

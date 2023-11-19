import starlightPlugin from '@astrojs/starlight-tailwind'
import config from '@fiar/components/tailwind.config'
import type { Config } from 'tailwindcss'

const _config = {
  ...config,
  plugins: [...config.plugins, starlightPlugin()],
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
} satisfies Config

export default _config

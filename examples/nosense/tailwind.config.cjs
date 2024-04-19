const config = require('@fiar/workbench/tailwind.config')

module.exports = {
  ...config,
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}', ...config.content],
}

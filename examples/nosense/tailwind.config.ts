import type { Config } from 'tailwindcss'
import config from '@fiar/components/tailwind'
import path from 'path'
import fs from 'fs'

const readDirFromRoot = (root: string) => {
  const root_dir = path.resolve(`../../${root}`)
  return fs
    .readdirSync(root_dir)
    .filter((x) => fs.statSync(path.join(root_dir, x)).isDirectory())
    .map((x) => `${root}/${x}`)
}

const _config: Config = {
  ...config,
  content: [
    './src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
    ...readDirFromRoot('packages')
      .map((x) => [`../../${x}/components/**/*.js`, `../../${x}/index.js`])
      .flat(),
  ],
}

export default _config

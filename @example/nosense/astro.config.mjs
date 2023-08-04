import { defineConfig } from 'astro/config'
import tailwind from '@astrojs/tailwind'
import react from '@astrojs/react'
import path from 'path'
import fs from 'fs'

const local = (root) => {
  const root_dir = path.resolve(`../../${root}`)
  return fs
    .readdirSync(root_dir)
    .filter((x) => fs.statSync(path.join(root_dir, x)).isDirectory())
    .map((x) => ({
      find: `${root}/${x}`,
      replacement: path.resolve(root_dir, x, 'src'),
    }))
}

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(), react()],
  server: { port: 3001 },
  vite: {
    define: {
      'process.env.NEXT_PUBLIC_FIRE_EMULATE': `'${
        process.env.FIRE_EMULATE || process.env.NEXT_PUBLIC_FIRE_EMULATE || ''
      }'`,
    },
    // resolve: { alias: [...local('@fiar')] },
  },
})

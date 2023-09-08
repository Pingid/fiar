import { defineConfig } from 'astro/config'
import tailwind from '@astrojs/tailwind'
import react from '@astrojs/react'
import { config } from 'dotenv'
import path from 'path'
import fs from 'fs'

const localEnv = config({ path: path.resolve('../../.env') })
const env = { ...process.env, ...localEnv.parsed }

const local = (root) => {
  const root_dir = path.resolve(`../../${root}`)
  return fs
    .readdirSync(root_dir)
    .filter((x) => fs.statSync(path.join(root_dir, x)).isDirectory())
    .map((x) => {
      const pkg = JSON.parse(fs.readFileSync(path.join(root_dir, x, 'package.json'), 'utf-8'))
      return [
        { find: `${pkg.name}`, replacement: path.resolve(root_dir, x, 'src') },
        { find: `${pkg.name}/*`, replacement: path.resolve(root_dir, x, 'src/*') },
      ]
    })
    .flat()
}

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(), react()],
  server: { port: 3001 },
  vite: {
    define: {
      'process.env.FIRE_EMULATE': `'${env.FIRE_EMULATE || ''}'`,
      'process.env.FIREBASE_API_KEY': `'${process.env.FIREBASE_API_KEY}'`,
      'process.env.FIREBASE_AUTH_DOMAIN': `'${process.env.FIREBASE_AUTH_DOMAIN}'`,
      'process.env.FIREBASE_PROJECT_ID': `'${process.env.FIREBASE_PROJECT_ID}'`,
      'process.env.FIREBASE_STORAGE_BUCKET': `'${process.env.FIREBASE_STORAGE_BUCKET}'`,
      'process.env.FIREBASE_MESSAGING_SENDER_ID': `'${process.env.FIREBASE_MESSAGING_SENDER_ID}'`,
      'process.env.FIREBASE_APP_ID': `'${process.env.FIREBASE_APP_ID}'`,
      'process.env.FIREBASE_MEASUREMENT_ID': `'${process.env.FIREBASE_MEASUREMENT_ID}'`,
    },
    resolve: { alias: [...local('packages')] },
  },
})

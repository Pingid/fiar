import react from '@vitejs/plugin-react'

import { defineConfig } from 'vite'
import path from 'path'
import fs from 'fs'

const local = (root: string) => {
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

process.env.VITE_FIREBASE_APIKEY = process.env.FIREBASE_APIKEY
process.env.VITE_FIREBASE_AUTHDOMAIN = process.env.FIREBASE_AUTHDOMAIN
process.env.VITE_FIREBASE_PROJECTID = process.env.FIREBASE_PROJECTID
process.env.VITE_FIREBASE_STORAGEBUCKET = process.env.FIREBASE_STORAGEBUCKET
process.env.VITE_FIREBASE_MESSAGINGSENDERID = process.env.FIREBASE_MESSAGINGSENDERID
process.env.VITE_FIREBASE_APPID = process.env.FIREBASE_APPID

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: { alias: [...local('packages')] },
  server: { host: '0.0.0.0' }
})

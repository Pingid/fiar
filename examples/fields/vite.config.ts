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

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: { alias: [...local('packages')] },
})

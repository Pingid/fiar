#!/usr/bin/env node
// @ts-check
const path = require('path')
const util = require('./utils')

const cjs_bundle = process.argv.includes('--cjs-bundle')
const cjs_exclude = ['rdndmb-html5-to-touch', 'react-dnd', 'react-dnd-multi-backend', 'react-dnd-html5-backend']
const cjs_bundle_external = []
if (cjs_bundle) {
  const json = require(path.resolve(`package.json`))
  const all = Object.keys({ ...json.peerDependencies, ...json.devDependencies, ...json.dependencies })
  cjs_bundle_external.push(...all.filter((x) => !cjs_exclude.includes(x)))
}

const tasks = () =>
  Promise.all([
    process.argv.includes('--no-transform')
      ? null
      : util.transform({ cjsBundle: !!cjs_bundle, external: cjs_bundle_external }),
    process.argv.includes('--no-dts') ? null : util.dts(),
  ])

const run = () => {
  if (process.argv.includes('--no-cache')) return tasks()
  return util.cache({
    cachedir: path.join(__dirname, '../node_modules/.cache'),
    input: ['src/**/*'],
    output: ['**/*.{cjs,js,d.ts,ts.map,css}', '!src', '!node_modules'],
    build: () => tasks(),
  })
}

run()
  .then(() => util.packageExports())
  .then(() => console.timeEnd('Tranformed in'))
  .catch((e) => {
    if (e) console.error(e)
    process.exit(1)
  })

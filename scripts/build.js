#!/usr/bin/env node

const util = require('./utils')

console.time('Tranformed in')

Promise.all([
  process.argv.includes('--no-transform') ? null : util.transform().await(),
  process.argv.includes('--no-dts') ? null : util.dts(),
])
  .then(() => util.update_imports())
  .then(() => console.timeEnd('Tranformed in'))
  .catch((e) => {
    if (e) console.error()
    process.exit(1)
  })

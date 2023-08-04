#!/usr/bin/env node
const fs = require('fs')
const util = require('./utils')

/** @type {ChildProcess} */
let child = util.transform(['--watch']).child
fs.watch('src', (x) => {
  if (x !== 'rename') return
  child.kill('SIGTERM')
  child = util.transform(['--watch']).child
})

if (!process.argv.includes('--no-types')) util.dts(true, () => util.update_imports())

#!/usr/bin/env node
const util = require('./utils')

util.watch()
if (!process.argv.includes('--no-types')) util.dts(true)

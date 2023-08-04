#!/usr/bin/env node
// @ts-check
const path = require('path')
const fs = require('fs')

const util = require('./utils')

const root = path.join(__dirname, '..')
const rootpkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf-8'))
const [major, minor, patch, pre] = rootpkg.version.split('.')
const next = `${major}.${minor}.${patch}.${parseInt(pre) + 1}`

console.log(`Bumping package version from ${rootpkg.version} -> ${next}`)

// Update Root
rootpkg.version = next
util
  .format(JSON.stringify(rootpkg, null, 2), { filepath: path.join(root, 'package.json') })
  .then((formatted) => fs.writeFileSync(path.join(root, 'package.json'), formatted))

// Update Packages
fs.readdirSync(path.join(root, 'packages')).map(async (x) => {
  const pkg = JSON.parse(fs.readFileSync(path.join(root, 'packages', x, 'package.json'), 'utf-8'))
  pkg.version = next
  const formatted = await util.format(JSON.stringify(pkg, null, 2), {
    filepath: path.join(root, 'packages', x, 'package.json'),
  })
  fs.writeFileSync(path.join(root, 'packages', x, 'package.json'), formatted)
})

#!/usr/bin/env node
// @ts-check
const child_process = require('child_process')
const path = require('path')
const fs = require('fs')

const util = require('./utils')

const root = path.join(__dirname, '..')

const main = async () => {
  const folders = fs.readdirSync(path.join(root, 'packages'))
  const pkgs = folders.map((f) => ({
    source: path.join(root, 'packages', f, 'package.json'),
    json: JSON.parse(fs.readFileSync(path.join(root, 'packages', f, 'package.json'), 'utf-8')),
  }))

  for (const pkg of pkgs) {
    const updated = JSON.parse(JSON.stringify({ ...pkg.json }))
    const sources = ['dependencies', 'peerDependencies', 'devDependencies']
    sources.forEach((source) => {
      if (!updated[source]) return
      for (const key in updated[source]) {
        const local = pkgs.find((x) => pkg.json.name === key)
        if (local) updated[source][key] = local.json.version
      }
    })
    fs.writeFileSync(pkg.source, await util.format(JSON.stringify(updated, null, 2), { filepath: pkg.source }))
    console.log(`Publishing ${pkg.json.name}@${pkg.json.version}`)
    child_process.spawnSync('npm', ['publish', '--access', 'public'], {
      stdio: 'inherit',
      cwd: path.join(pkg.source, '../'),
    })
    fs.writeFileSync(pkg.source, await util.format(JSON.stringify(pkg.json, null, 2), { filepath: pkg.source }))
  }
}

main()

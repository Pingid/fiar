#!/usr/bin/env node
// @ts-check
const child_process = require('child_process')
const path = require('path')
const fs = require('fs')

let env = process.env
const envFile = fs.existsSync(path.resolve('.env')) ? path.resolve('.env') : path.resolve(__dirname, '../.env')

if (fs.existsSync(envFile)) {
  env = {
    ...env,
    ...Object.fromEntries(
      fs
        .readFileSync(envFile, 'utf-8')
        .split('\n')
        .filter((x) => !!x)
        .map((x) => x.split('=')),
    ),
  }
}

child_process.spawnSync('sh', ['-c', `'${process.argv.slice(2).join(' ')}'`], { stdio: 'inherit', env, shell: true })

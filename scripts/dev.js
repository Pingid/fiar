#!/usr/bin/env node
const { spawn } = require('child_process')
const path = require('path')

spawn('pnpm', ['watch'], { stdio: 'inherit', cwd: path.join(__dirname, '../') })
spawn('pnpm', ['emulate'], { stdio: 'inherit', cwd: path.join(__dirname, '../examples/nosense') })
spawn('pnpm', ['dev'], {
  stdio: 'inherit',
  cwd: path.join(__dirname, '../examples/nosense'),
  env: { ...process.env, NEXT_PUBLIC_FIRE_EMULATE: 'TRUE' },
})

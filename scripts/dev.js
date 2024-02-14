#!/usr/bin/env node
// @ts-check
const { spawn } = require('node:child_process')
const path = require('node:path')

const { show } = require('./utils')

const cwd = path.join(__dirname, '../')
const env = { ...process.env, FIRE_EMULATE: 'TRUE', FORCE_COLOR: 'TRUE' }

show(spawn('pnpm', ['watch'], { stdio: 'pipe', cwd, env }), '[tsc] ')
show(spawn('pnpm', ['emulate'], { stdio: 'pipe', cwd, env }), '[emulate] ')
show(spawn('pnpm', ['dev'], { stdio: 'pipe', env, cwd: path.join(cwd, './examples/react') }), '[vite] ')

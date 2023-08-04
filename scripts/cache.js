#!/usr/bin/env node
const fs = require('fs')
const path = require('path')
const crypto = require('crypto')
const glob = require('fast-glob')
const { execSync } = require('child_process')

const [src, contents, cmd] = process.argv.slice(2)
const cache_dir = path.join(__dirname, '../node_modules/.cache')

let main = () => {
  let hash = crypto.createHash('sha256')
  glob.sync(src.split(' '), { absolute: true }).forEach((file) => {
    hash.update(file)
    hash.update(fs.readFileSync(file, 'utf-8'))
  })

  let cache_key = hash.digest('hex')
  let cache_asset = path.join(cache_dir, `${cache_key}.tar.gz`)
  if (!fs.existsSync(cache_dir)) fs.mkdirSync(cache_dir)
  if (process.argv.includes('--no-cache')) {
    console.log(`skip cache`)
  } else if (fs.existsSync(cache_asset)) {
    console.log(`cache hit ${cache_key}`)
    return execSync(`tar -xf ${cache_asset}`)
  }
  execSync(cmd, { pwd: process.cwd(), env: process.env, stdio: 'inherit' })
  let files = glob.sync(contents.split(' '), { ignore: ['node_modules'] })
  let temp = path.join(process.cwd(), '.temp-cache-file-list')
  fs.writeFileSync(temp, files.join('\n'))
  execSync(`tar -cvzf ${cache_asset} -T ${temp}`)
  fs.unlinkSync(temp)
}
main()

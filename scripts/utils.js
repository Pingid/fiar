let { spawn } = require('child_process')
let glob = require('fast-glob')
let path = require('path')
let fs = require('fs')
let pty = require('node-pty')

let root_dir = path.join(__dirname, '../')
let esbuild = path.join(root_dir, `node_modules/.bin/esbuild`)
let tsc = path.join(root_dir, `node_modules/.bin/tsc`)

// Update esm file imports
let imports_running = false
let imports_run_again = false

exports.update_imports = async () => {
  if (imports_running) return (imports_run_again = true)
  imports_running = true
  const files = await glob(['**/*.js', '**/*.d.ts', '!node_modules', '!src'])

  await Promise.all(
    files.map(async (file) => {
      let absolute = path.resolve(process.cwd(), file)
      let content = await fs.promises.readFile(absolute, 'utf8')
      let dir = path.parse(file).dir

      let result = content.replace(/(import|export)([^"']*?)(["'])\.(.*?)\3/g, (full, a, b, _, d) => {
        if (d.endsWith('.js')) return full

        const pth = path.join(dir, d.replace(/^\//, '').replace(/^\.\//, '../'))

        if (files.includes(`${pth}/index.js`)) return `${a}${b}'.${d}/index.js'`
        return `${a}${b}'.${d}.js'`
      })
      if (result !== content) {
        await fs.promises.writeFile(absolute, result, 'utf8')
      }
    }),
  )
  imports_running = false
  if (imports_run_again) {
    imports_run_again = false
    return exports.update_imports()
  }
}

// Transform ts with esbuild
exports.transform = (args) => {
  let inputs = glob.sync('src/**/*.{ts,tsx}')
  const bundle = process.argv.includes('--bundle')
  const platform = process.argv.find((x) => /--platform/.test(x))
  const format = process.argv.find((x) => /--format/.test(x)) || '--format=esm'
  const outdir = process.argv.find((x) => /--outdir/.test(x)) || '--outdir=.'
  let opts = ['--platform=browser', '--target=es2019', '--minify', '--pure:React.createElement']
    .concat(args || [])
    .concat(bundle ? ['--bundle'] : [])
    .concat(platform ? [platform] : [])
    .concat([format, outdir, `--outbase=src`])

  // let pkg = fs.readFileSync(path.join(process.cwd(), 'package.json'),'utf-8')
  // let peers = JSON.parse(pkg)?.peerDependencies || {};
  // let externals = Object.keys(peers);
  // .concat(externals.map(ext => `--external:${ext}`))

  let child = spawn(esbuild, inputs.concat(opts), { stdio: 'inherit' })
  return { child, await: () => awaitChild(child) }
}

// Get typescript decleration files
exports.dts = async (watch = false, onDone) => {
  let child = pty.spawn(tsc, ['--emitDeclarationOnly'].concat(watch ? ['--watch'] : []), {
    env: { ...process.env, FORCE_COLOR: true },
  })
  return new Promise((res, rej) => {
    let out = ''
    child.onExit((x) => {
      if (x.exitCode > 0) return rej(out)
      return res(out)
    })
    child.onData((str) => {
      out += str
      if (onDone && /Found\s\d\serrors?/.test(str)) onDone()
      str = str.replace('\x1Bc', '').replace(/\n{2,}/gim, '')
      if (str.trim()) process.stdout.write(str)
    })
  })
}

const awaitChild = (child) =>
  new Promise((res, rej) => {
    child.on('close', () => res())
    child.on('disconnect', () => process.exit(1))
    child.on('error', (e) => rej(e))
  })

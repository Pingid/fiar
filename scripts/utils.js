// @ts-check
// let { EsmExternalsPlugin } = require('@esbuild-plugins/esm-externals')
let { execSync } = require('child_process')
let autoprefixer = require('autoprefixer')
let tailwindcss = require('tailwindcss')
let prettier = require('prettier')
let esbuild = require('esbuild')
let postcss = require('postcss')
let glob = require('fast-glob')
let crypto = require('crypto')
let pty = require('node-pty')
let path = require('path')
let fs = require('fs')

let root_dir = path.join(__dirname, '../')
let bin_tsc = path.join(root_dir, `node_modules/.bin/tsc`)

/** @return {import('esbuild').BuildOptions} */
const buildOptions = () => ({
  bundle: false,
  outdir: '.',
  minifyIdentifiers: false,
  minifySyntax: false,
  minifyWhitespace: false,
  plugins: [esbuildEsmRenameExtensions, esbuildCjsExt, postcssPlugin],
})

/**
 * @function
 * @param {Object} args
 * @param {boolean | undefined} args.cjsBundle
 * @param {string[] | undefined} args.external
 * @returns {Promise<void>}
 */
exports.transform = async (args) => {
  let entryPoints = glob.sync('src/**/*.{ts,tsx,css}', { absolute: true })
  await esbuild.build({
    ...buildOptions(),
    entryPoints,
    format: 'cjs',
    ...(args.cjsBundle ? { bundle: true, external: args.external || [] } : {}),
  })
  await esbuild.build({ ...buildOptions(), entryPoints, format: 'esm' })
}

/**
 * @function
 * @returns {Promise<void>}
 */
exports.watch = async () => {
  let entryPoints = glob.sync('src/**/*.{ts,tsx}', { absolute: true })
  const task = await esbuild.context({
    ...buildOptions(),
    entryPoints,
    format: 'esm',
    logLevel: 'info',
  })
  return task.watch({})
}

/** @type {import('esbuild').Plugin} */
const postcssPlugin = {
  name: 'postcss',
  setup(build) {
    build.onLoad({ filter: /\.css$/ }, async (args) => {
      const css = await fs.promises.readFile(args.path, 'utf8')
      // @ts-ignore
      const result = await postcss([autoprefixer, tailwindcss])
        .process(css, { from: args.path })
        .then((x) => x)
      return {
        contents: result.content,
        watchFiles: [args.path],
        loader: 'css',
      }
    })
  },
}
/** @type {import('esbuild').Plugin} */
const esbuildEsmRenameExtensions = {
  name: 'esm-imports', // Name of the plugin
  setup(build) {
    if (build.initialOptions.format !== 'esm' || build.initialOptions.bundle) return
    /** @type {any} */
    const entryPoints = build.initialOptions.entryPoints
    build.onLoad({ filter: /\.(js|ts|tsx)$/ }, (args) => {
      /** @type {any} */
      const files = build.initialOptions.entryPoints
      const contents = replaceImportExtension(files, args.path, '.js')
      return { contents, loader: args.path.endsWith('.tsx') ? 'tsx' : 'ts' }
    })
    // build.onEnd((result) => {
    //   for (let input of entryPoints) {
    //     const output = input.replace(/\/src/, '').replace(/\.tsx?/, '.js')
    //     const to = input.replace(/\/src/, '').replace(/\.tsx?/, '.js')
    //     fs.renameSync(output, to)
    //   }
    // })
  },
}

/** @type {import('esbuild').Plugin} */
const esbuildCjsExt = {
  name: 'add-cjs-ext', // Name of the plugin
  setup(build) {
    if (build.initialOptions.format !== 'cjs') return
    /** @type {any} */
    const entryPoints = build.initialOptions.entryPoints
    const outdir = build.initialOptions.outdir

    if (!outdir || !entryPoints) return
    if (!build.initialOptions.bundle) {
      build.onLoad({ filter: /\.(js|ts|tsx)$/ }, (args) => {
        /** @type {any} */
        const files = build.initialOptions.entryPoints
        const contents = replaceImportExtension(files, args.path, '.cjs')
        return { contents, loader: args.path.endsWith('.tsx') ? 'tsx' : 'ts' }
      })
    }
    build.onEnd((result) => {
      for (let input of entryPoints) {
        const output = input.replace(/\/src/, '').replace(/\.tsx?/, '.js')
        const to = input.replace(/\/src/, '').replace(/\.tsx?/, '.cjs')
        fs.renameSync(output, to)
      }
    })
  },
}

/**
 * @function
 * @param {string[]} files
 * @param {string} file
 * @param {string} ext
 * @returns {string}
 */
const replaceImportExtension = (files, file, ext) => {
  let contents = fs.readFileSync(file, 'utf8')
  /** @type {any} */
  let { dir } = path.parse(file)
  return contents.replace(/((import|export).*from.*?['"])(\..*)(['"])/g, (_1, lft, _3, rel, rt) => {
    if (/.*\.\w+$/.test(rel)) return `${lft}${rel}${rt}`
    const pth = path.join(dir, rel)
    if (files.includes(`${pth}.js`) || files.includes(`${pth}.ts`) || files.includes(`${pth}.tsx`)) {
      return `${lft}${rel}${ext}${rt}`
    }
    return `${lft}${rel}/index${ext}${rt}`
  })
}

/**
 * @function
 * @param {boolean} watch
 * @returns {Promise<any>}
 */
exports.dts = async (watch = false) => {
  let child = pty.spawn(bin_tsc, ['--emitDeclarationOnly'].concat(watch ? ['--watch'] : []), {
    env: { ...process.env, FORCE_COLOR: 'true' },
  })
  return new Promise((res, rej) => {
    let out = ''
    child.onExit((x) => {
      if (x.exitCode > 0) return rej(out)
      return res(out)
    })
    child.onData((str) => {
      out += str
      str = str.replace('\x1Bc', '').replace(/\n{2,}/gim, '')
      if (str.trim()) process.stdout.write(str)
    })
  })
}

/**
 * @function
 * @param {Object} args
 * @param {string[]} args.input
 * @param {string[]} args.output
 * @param {string} args.cachedir
 * @param {Function} args.build
 * @returns {Promise<any>}
 */
exports.cache = async (args) => {
  let hash = crypto.createHash('sha256')
  glob.sync(args.input, { absolute: true }).forEach((file) => {
    hash.update(file)
    hash.update(fs.readFileSync(file, 'utf-8'))
  })

  let cache_key = hash.digest('hex')
  let cache_asset = path.join(args.cachedir, `${cache_key}.tar.gz`)
  if (!fs.existsSync(args.cachedir)) fs.mkdirSync(args.cachedir)

  if (process.argv.includes('--no-cache')) {
    console.log(`skip cache`)
  } else if (fs.existsSync(cache_asset)) {
    console.log(`cache hit ${cache_key}`)
    return execSync(`tar -xf ${cache_asset}`)
  }

  await args.build()

  let files = glob.sync(args.output, { ignore: ['node_modules'] })

  let temp = path.join(process.cwd(), '.temp-cache-file-list')
  fs.writeFileSync(temp, files.join('\n'))
  execSync(`tar -cvzf ${cache_asset} -T ${temp}`)
  fs.unlinkSync(temp)
}

/**
 * @function
 * @returns {Promise<any>}
 */
exports.packageExports = async () => {
  /** @type {any} */
  const json = JSON.parse(fs.readFileSync(path.resolve('package.json'), 'utf-8'))
  const all = glob.sync('./src/**', { onlyFiles: true, absolute: true })
  const dirs = glob.sync('./src/**', { onlyDirectories: true, absolute: true })
  json.exports = {
    './package.json': './package.json',
    '.': {
      types: './index.d.ts',
      import: './index.js',
      require: './index.cjs',
    },
  }

  glob.sync('./src/*.ts', { onlyFiles: true, absolute: true }).forEach((root) => {
    const out = path.relative(path.resolve(), root).replace(/\/?src\/?/, '')
    const parsed = path.parse(out)
    if (parsed.name === 'index') return
    json.exports[`./${parsed.name}`] = {
      types: `./${parsed.name}.d.ts`,
      import: `./${parsed.name}.js`,
      require: `./${parsed.name}.cjs`,
    }
  })

  json.main = 'index.js'
  json.types = 'index.d.ts'
  delete json['typings']
  delete json['module']

  if (all.includes(path.resolve('src/style.css'))) {
    json.exports['./style.css'] = {
      import: './style.css',
      require: './style.css',
    }
  }

  dirs.forEach((dir) => {
    if (all.includes(path.join(dir, 'index.ts')) || all.includes(path.join(dir, 'index.tsx'))) {
      const out = path.relative(path.resolve(), dir).replace(/\/?src\/?/, '')
      json.exports[`./${out}`] = {
        types: `./${out}/index.d.ts`,
        import: `./${out}/index.js`,
        require: `./${out}/index.cjs`,
      }
    }
  })
  const formatted = await exports.format(JSON.stringify(json, null, 2), {
    filepath: path.resolve('package.json'),
  })
  fs.writeFileSync(path.resolve('package.json'), formatted)
}

/**
 *
 * @param {string} src
 * @param {import('prettier').Options} opts
 * @returns
 */
exports.format = async (src, opts) => {
  const rootPkg = JSON.parse(fs.readFileSync(path.join(root_dir, 'package.json'), 'utf-8'))
  return prettier.format(src, { ...rootPkg.prettier, ...opts })
}

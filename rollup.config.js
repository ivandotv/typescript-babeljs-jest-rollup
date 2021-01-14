import babel from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import filesize from 'rollup-plugin-filesize'
import peerDepsExternal from 'rollup-plugin-peer-deps-external'
import { terser } from 'rollup-plugin-terser'
import visualizer from 'rollup-plugin-visualizer'
import pkg from './package.json'
import fs from 'fs'

const extensions = ['.js', '.jsx', '.ts', '.tsx']

const libraryName = pkg.name

const input = 'src/index.ts'

const unpkgFilePath = libPath('./dist/unpkg', libraryName.toLocaleLowerCase())

// https://github.com/rollup/rollup/issues/703#issuecomment-314848245
function defaultPlugins(config = {}) {
  return [
    resolve({ extensions }),
    peerDepsExternal(),
    babel(config.babel || { babelHelpers: 'bundled' }),
    commonjs(),
    filesize(),
    visualizer({ template: 'treemap' })
  ]
}
console.log('==========================')
console.log(process.env.NODE_ENV)
const cjsBrowserDev = {
  input,
  output: [
    {
      file: libPath('./dist/cjs', libraryName)('.development.js'),
      format: 'cjs',
      name: libraryName,
      sourcemap: true
    }
  ],
  plugins: defaultPlugins({
    babel: {
      extensions,
      envName: 'browserDev',
      babelHelpers: 'bundled'
    }
  }) //TODO -ovo ide kasnije
  // ).concat([command(() => createCjsBrowserIndex(libraryName), { wait: true })])
}

const cjsBrowserProd = {
  input,
  output: [
    {
      file: libPath('./dist/cjs/', libraryName)('.production.min.js'),
      format: 'cjs',
      name: libraryName,
      sourcemap: true,
      plugins: [terser()]
    }
  ],
  plugins: defaultPlugins({
    babel: {
      extensions,
      envName: 'browser',
      babelHelpers: 'bundled'
    }
  }) //TODO -ovo ide kasnije
  // ).concat([command(() => createCjsBrowserIndex(libraryName), { wait: true })])
}

// umd build for the browser
const umd = {
  input,
  output: [
    {
      file: unpkgFilePath('.js'),
      format: 'umd',
      name: libraryName,
      sourcemap: true
    },
    {
      file: unpkgFilePath('.min.js'),
      format: 'umd',
      name: libraryName,
      sourcemap: true,
      plugins: [terser()]
    }
  ],
  plugins: defaultPlugins({
    babel: {
      extensions,
      envName: 'browser',
      babelHelpers: 'bundled'
    }
  })
}

const umdWithPolyfill = {
  input,
  output: [
    {
      file: unpkgFilePath('.polyfill.js'),
      format: 'umd',
      name: libraryName,
      sourcemap: true
    },
    {
      file: unpkgFilePath('.polyfill.min.js'),
      format: 'umd',
      name: libraryName,
      sourcemap: true,
      plugins: [terser()]
    }
  ],
  plugins: defaultPlugins({
    babel: {
      extensions,
      envName: 'browserPolyfill',
      babelHelpers: 'bundled'
    }
  })
}

// build for browsers as module
const browserModule = {
  input,
  output: [
    {
      file: unpkgFilePath('.esm.js'),
      format: 'esm',
      sourcemap: true
    },
    {
      file: unpkgFilePath('.esm.min.js'),
      format: 'esm',
      sourcemap: true,
      plugins: [terser()]
    }
  ],
  plugins: defaultPlugins({
    babel: {
      extensions,
      envName: 'browserModule',
      babelHelpers: 'bundled'
    }
  })
}

const browserModuleWithPolyfill = {
  input,
  output: [
    {
      file: unpkgFilePath('.esm.polyfill.js'),
      format: 'esm',
      sourcemap: true
    },
    {
      file: unpkgFilePath('.esm.polyfill.min.js'),
      format: 'esm',
      sourcemap: true,
      plugins: [terser()]
    }
  ],
  plugins: defaultPlugins({
    babel: {
      extensions,
      envName: 'browserModulePolyfill',
      babelHelpers: 'bundled'
    }
  })
}

const allBuilds = [
  umd,
  umdWithPolyfill,
  browserModule,
  browserModuleWithPolyfill
]

const envToBuild = {
  // cjs: [cjsBrowserDev, cjsBrowserProd],
  cjs: [cjsBrowserDev],
  umd: [umd, umdWithPolyfill],
  browser: [browserModule, browserModuleWithPolyfill]
}

const finalBuilds = chooseBuild(envToBuild, process.env.BUILD) || allBuilds

function libPath(path, libName) {
  return function (suffix) {
    return path.concat('/', libName, suffix)
  }
}

function chooseBuild(buildMap, builds) {
  if (!builds) {
    return
  }
  const envArr = builds.split('--')
  const result = []

  if (envArr.length > 0) {
    envArr.forEach((element) => {
      if (buildMap[element]) {
        result.push(...buildMap[element])
        console.log(`Will build: ${element}`)
      }
    })

    if (result.length === 0) {
      throw new Error(`Build configuration keys: ${builds} don't exists`)
    }

    return result
  }
}

async function createCjsBrowserIndex(libName) {
  const file = await fs.readFile('./scripts/templates/cjs-browser.js', {
    encoding: 'utf-8'
  })

  const replaced = file.replace(/__LIBRARY_NAME__/gm, libName)
  console.log(replaced)

  return await fs.writeFile('./dist/cjs/index.js', replaced)
}

export default Promise.resolve([...finalBuilds])

import { build } from 'esbuild'
import { writeFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const rootDir = resolve(__dirname, '..')

// Determine which dist directory to process
const browser = process.env.BROWSER || 'chrome'
const distDir = resolve(rootDir, browser === 'firefox' ? 'dist-firefox' : 'dist-chrome')
const contentScriptPath = resolve(distDir, 'content.js')

try {
  console.log('Bundling content script with esbuild...')
  
  // Use esbuild to bundle content.ts and inline all imports
  const result = await build({
    entryPoints: [resolve(rootDir, 'src/content.ts')],
    bundle: true,
    format: 'iife',
    outfile: contentScriptPath,
    write: false,
    minify: true,
    target: 'es2020',
    platform: 'browser',
    define: {
      'process.env.NODE_ENV': '"production"'
    },
    external: [] // Don't externalize anything - bundle everything
  })
  
  // Write the bundled content
  writeFileSync(contentScriptPath, result.outputFiles[0].text, 'utf-8')
  console.log('✓ Content script bundled successfully (all imports inlined)')
} catch (error) {
  console.error('Error bundling content script:', error)
  process.exit(1)
}


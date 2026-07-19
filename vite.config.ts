import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { defineConfig, type Plugin } from 'vitest/config'
import react from '@vitejs/plugin-react'

const base = process.env.GITHUB_PAGES === 'true' ? '/shhhred/' : '/'
const wasmModuleUrl = `${base}t3k-wasm-module.js`

function patchWasmAssetPaths(content: string): string {
  if (base === '/') {
    return content
  }

  return content.replaceAll('"/t3k-wasm-module.', `"${base}t3k-wasm-module.`)
}

function wasmBasePathPlugin(): Plugin {
  return {
    name: 'wasm-base-path',
    generateBundle(_options, bundle) {
      for (const file of Object.values(bundle)) {
        if (file.type !== 'chunk') {
          continue
        }

        if (!file.code.includes('/t3k-wasm-module.js')) {
          continue
        }

        file.code = file.code.replaceAll(
          '`/t3k-wasm-module.js`',
          JSON.stringify(wasmModuleUrl),
        )
        file.code = file.code.replaceAll(
          "'/t3k-wasm-module.js'",
          JSON.stringify(wasmModuleUrl),
        )
      }
    },
    closeBundle() {
      if (base === '/') {
        return
      }

      const wasmModulePath = join(process.cwd(), 'dist', 't3k-wasm-module.js')
      const wasmModuleSource = readFileSync(wasmModulePath, 'utf8')
      writeFileSync(wasmModulePath, patchWasmAssetPaths(wasmModuleSource))
    },
  }
}

export default defineConfig({
  base,
  plugins: [react(), wasmBasePathPlugin()],
  server: {
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
    },
  },
  preview: {
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/**/*.test.{ts,tsx}', 'src/test/**'],
    },
  },
})

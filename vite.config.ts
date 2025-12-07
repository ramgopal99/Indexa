import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Determine output directory based on environment variable
  const browser = process.env.BROWSER || 'chrome'
  const outDir = browser === 'firefox' ? 'dist-firefox' : 'dist-chrome'
  
  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    build: {
      outDir: outDir,
      watch: mode === 'development' ? {} : null,
      rollupOptions: {
        input: {
          main: './index.html',
          content: './src/content.ts'
        },
        output: {
          entryFileNames: (chunkInfo) => {
            return chunkInfo.name === 'content' ? 'content.js' : '[name].js';
          },
          assetFileNames: (assetInfo) => {
            // Keep content.css in root without hash
            const name = assetInfo.name || '';
            if (name.includes('content.css') || (assetInfo.source && typeof assetInfo.source === 'string' && assetInfo.source.includes('content.css'))) {
              return 'content.css';
            }
            return 'assets/[name]-[hash][extname]';
          },
          // Prevent chunking for content script - inline all dependencies
          manualChunks: (id) => {
            // Don't create separate chunks for content script and its dependencies
            // This ensures everything is bundled into content.js
            if (id.includes('src/content') || 
                id.includes('src/components/sidebar') || 
                id.includes('src/components/search') ||
                id.includes('src/components/settings') ||
                id.includes('src/lib/browser-api')) {
              return undefined // Inline into content.js - don't create separate chunk
            }
            
            // Only create vendor chunks for main entry point dependencies
            if (id.includes('node_modules')) {
              return 'vendor'
            }
            
            return undefined
          }
        }
      }
    }
  }
})

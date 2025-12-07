import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
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
        }
      }
    }
  }
}))

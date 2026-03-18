import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

const copy404Plugin = () => ({
  name: 'copy-404-plugin',
  closeBundle() {
    const src = path.resolve('dist/index.html');
    const dest = path.resolve('dist/404.html');
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, dest);
    }
  }
});

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), copy404Plugin()],
  base: './',
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return id.toString().split('node_modules/')[1].split('/')[0].toString();
          }
        }
      }
    }
  }
})

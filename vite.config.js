import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  base: './',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
  },
  server: {
    // 腾讯云上运行时必须设为 '0.0.0.0' 才能从外部访问
    host: '0.0.0.0',
    port: 5173,
    proxy: {
      '/api': {
        // 如果后端也在同一台云服务器上，可改为 'http://localhost:1235'
        target: 'http://159.75.169.224:1235',
        changeOrigin: true
      },
      '/files': {
        target: 'http://159.75.169.224:1235',
        changeOrigin: true
      }
    }
  }
})

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          tensorflow: ['@tensorflow/tfjs', '@teachablemachine/image'],
          ui: ['lucide-react']
        }
      }
    }
  },
  server: {
    port: 3000
  }
})

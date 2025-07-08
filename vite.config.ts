import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  root: path.resolve(__dirname, 'project'),
  publicDir: path.resolve(__dirname, 'public'),
  build: {
    outDir: path.resolve(__dirname, 'dist'),
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'project/src'),
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
    include: ['@tensorflow/tfjs', '@teachablemachine/image'],
  },
  server: {
    fs: {
      allow: ['..'],
    },
  },
});
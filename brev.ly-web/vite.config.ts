import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'node:path';

export default defineConfig({
  server: {
    proxy: {
      // Garante que todas as chamadas para /check/* vão para o backend
      '/check': {
        target: 'http://localhost:3333',
        changeOrigin: true,
        secure: false
      }
    }
  },
  plugins: [
    react(),       
    tailwindcss(), 
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
});

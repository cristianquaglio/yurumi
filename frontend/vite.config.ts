import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // server: {
  //   proxy: {
  //     '/api': {
  //       target: 'http://localhost:7001', // La URL de tu backend
  //       changeOrigin: true,
  //       rewrite: (path) => path.replace(/^\/api/, ''), // Reescribe la ruta para quitar el prefijo /api
  //     },
  //   },
  // },
});

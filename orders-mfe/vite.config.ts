import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'orders',
      filename: 'remoteEntry.js',
      exposes: {
        './OrdersApp': './src/App.tsx'
      },
      shared: {
        react: {
          singleton: true,
          requiredVersion: '^18.2.0'
        },
        'react-dom': {
          singleton: true,
          requiredVersion: '^18.2.0'
        },
        'react-router-dom': {
          singleton: true
        }
      }
    })
  ],
  server: {
    port: 3001,
    cors: true,
    strictPort: true
  },
  preview: {
    port: 3001,
    strictPort: true,
    cors: true
  },
  build: {
    target: 'esnext',
    minify: false,
    cssCodeSplit: false,
    modulePreload: false,
    rollupOptions: {
      output: {
        format: 'esm',
        entryFileNames: 'assets/[name].js',
        chunkFileNames: 'assets/[name].js'
      }
    }
  }
});

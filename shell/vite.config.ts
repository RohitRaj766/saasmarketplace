import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'shell',
      remotes: {
        orders_mfe: {
          external: 'http://localhost:3001/assets/remoteEntry.js',
          format: 'esm',
          from: 'vite'
        },
        billing_mfe: {
          external: 'http://localhost:3002/assets/remoteEntry.js',
          format: 'esm',
          from: 'vite'
        },
        analytics_mfe: {
          external: 'http://localhost:3003/assets/remoteEntry.js',
          format: 'esm',
          from: 'vite'
        },
        admin_mfe: {
          external: 'http://localhost:3004/assets/remoteEntry.js',
          format: 'esm',
          from: 'vite'
        }
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
    port: 3000,
    cors: true,
    strictPort: true
  },
  preview: {
    port: 3000,
    strictPort: true,
    cors: true
  },
  build: {
    target: 'esnext',
    minify: false,
    cssCodeSplit: false,
    modulePreload: false
  }
});

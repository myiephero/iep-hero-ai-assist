// Production deployment Vite config that avoids ESM plugin issues
const { defineConfig } = require('vite');
const path = require('path');

module.exports = defineConfig({
  root: __dirname,
  plugins: [
    // Include only essential plugins using CommonJS syntax
    {
      name: 'react-refresh',
      // Minimal React support without ESM dependencies
      configResolved(config) {
        if (config.command === 'build') {
          // Skip React refresh in production builds
          return;
        }
      }
    }
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'client/src'),
      '@shared': path.resolve(__dirname, 'shared'),
      '@assets': path.resolve(__dirname, 'attached_assets'),
    },
  },
  build: {
    outDir: path.resolve(__dirname, 'dist/public'),
    emptyOutDir: true,
    target: 'es2020',
    minify: 'esbuild',
    sourcemap: false,
    rollupOptions: {
      input: path.resolve(__dirname, 'client/index.html'),
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu']
        },
        assetFileNames: 'assets/[name]-[hash][extname]',
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js'
      }
    },
    chunkSizeWarningLimit: 1000
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react/jsx-runtime']
  },
  esbuild: {
    jsx: 'automatic'
  }
});
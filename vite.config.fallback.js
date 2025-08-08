const { defineConfig } = require('vite');
const path = require('path');

module.exports = defineConfig({
  plugins: [],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'client/src'),
      '@shared': path.resolve(__dirname, 'shared'),
      '@assets': path.resolve(__dirname, 'attached_assets'),
    },
  },
  root: process.cwd(),
  build: {
    outDir: 'dist/public',
    emptyOutDir: true,
    rollupOptions: {
      input: 'client/index.html'
    }
  }
});

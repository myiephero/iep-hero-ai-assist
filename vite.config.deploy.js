// Production deployment Vite config that avoids ESM plugin issues
const path = require('path');

module.exports = {
  root: __dirname,
  plugins: [], // No plugins to avoid ESM conflicts
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
    rollupOptions: {
      input: path.resolve(__dirname, 'client/index.html'),
    },
  },
};
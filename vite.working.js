
const { defineConfig } = require('vite');
const path = require('path');

module.exports = defineConfig({
  root: __dirname,
  plugins: [],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'client/src'),
      '@shared': path.resolve(__dirname, 'shared'),
    },
  },
  build: {
    outDir: path.resolve(__dirname, 'dist/public'),
    emptyOutDir: true,
    target: 'es2020',
    minify: false,
    sourcemap: false,
    rollupOptions: {
      input: path.resolve(__dirname, 'client/index.html')
    }
  },
  esbuild: {
    jsx: 'automatic'
  }
});
